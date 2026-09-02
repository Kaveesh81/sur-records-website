import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { surAccess } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Creates a Razorpay order for a Sur Access plan. The client sends only a
 * `planId` — the amount is always looked up here from `surAccess.plans`
 * (lib/content.ts), never taken from the request, so a tampered request
 * can't pay less than the real price.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const planId = (body as { planId?: unknown })?.planId;

  if (typeof planId !== "string") {
    return NextResponse.json({ error: "Missing plan." }, { status: 400 });
  }

  const plan = surAccess.plans.find((p) => p.id === planId);

  if (!plan) {
    return NextResponse.json({ error: "That plan does not exist." }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("[razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.");
    return NextResponse.json(
      { error: "Membership checkout is not configured yet. Please try again later." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount: plan.amount * 100, // Razorpay expects paise
      currency: "INR",
      // Short receipt id — Razorpay caps this at 40 characters.
      receipt: `sur-access-${plan.id}-${Date.now()}`,
      notes: { planId: plan.id, planLabel: plan.label },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("[razorpay] Failed to create order:", err);
    return NextResponse.json(
      { error: "Could not start checkout just now. Please try again." },
      { status: 502 }
    );
  }
}
