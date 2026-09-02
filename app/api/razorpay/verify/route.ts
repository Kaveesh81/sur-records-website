import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import Razorpay from "razorpay";
import { site, surAccess } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Escape user-influenced values before interpolating into the HTML email. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Verifies a Razorpay Checkout payment server-side before treating it as
 * real. The client's "success" callback is just a JS event — anyone could
 * fake calling it — so this recomputes the HMAC signature with the secret
 * key and only proceeds if it matches exactly what Razorpay actually signed.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string" ||
    typeof planId !== "string"
  ) {
    return NextResponse.json({ error: "Malformed payment response." }, { status: 400 });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error("[razorpay] RAZORPAY_KEY_SECRET is not set — cannot verify payment.");
    return NextResponse.json({ error: "Verification is not configured." }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid =
    expectedSignature.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

  if (!isValid) {
    console.error("[razorpay] Signature mismatch — rejecting payment:", {
      razorpay_order_id,
      razorpay_payment_id,
    });
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  const plan = surAccess.plans.find((p) => p.id === planId);

  // Verified but pointing at a plan that no longer exists — extremely
  // unlikely (client just created the order against a real plan seconds
  // earlier) but fail closed rather than emailing garbage.
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  // Best-effort: pull the payer's email/contact/method for the
  // notification email. Never block a verified payment on this failing.
  let payerEmail = "";
  let payerContact = "";
  let method = "";

  const keyId = process.env.RAZORPAY_KEY_ID;
  if (keyId) {
    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      payerEmail = payment.email ?? "";
      payerContact = String(payment.contact ?? "");
      method = payment.method ?? "";
    } catch (err) {
      console.error("[razorpay] Verified payment, but couldn't fetch payment details:", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      "[razorpay] RESEND_API_KEY not set — payment verified but no notification sent:",
      { razorpay_payment_id, planId }
    );
    // The payment itself is genuinely valid — don't fail the user's
    // checkout just because the notification email can't be sent.
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const to = process.env.APPLICATIONS_TO ?? site.email;
  const from = process.env.APPLICATIONS_FROM ?? "Sur Records <onboarding@resend.dev>";

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#111;font-size:14px">${esc(value)}</td>
    </tr>`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto">
      <div style="background:#0a0908;padding:24px 16px;border-radius:10px 10px 0 0">
        <p style="margin:0;color:#d4af37;font-size:11px;letter-spacing:2px;text-transform:uppercase">Sur Access</p>
        <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:20px;font-weight:600">New member</h1>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none">
        ${row("Plan", `${plan.label} — ₹${plan.amount}`)}
        ${payerEmail ? row("Email", payerEmail) : ""}
        ${payerContact ? row("Phone", payerContact) : ""}
        ${method ? row("Payment method", method) : ""}
        ${row("Payment ID", razorpay_payment_id)}
        ${row("Order ID", razorpay_order_id)}
      </table>

      <p style="padding:14px 16px;color:#999;font-size:12px;background:#fafafa;border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;margin:0">
        Verified directly against Razorpay's signature before this email was sent.
      </p>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `New Sur Access member — ${plan.label}`,
      ...(payerEmail ? { replyTo: payerEmail } : {}),
      html,
    });

    if (error) {
      // The payment is still genuinely valid even if the email failed.
      console.error("[razorpay] Payment verified but Resend rejected the notification:", error);
    }
  } catch (err) {
    console.error("[razorpay] Payment verified but notification send failed:", err);
  }

  return NextResponse.json({ ok: true });
}
