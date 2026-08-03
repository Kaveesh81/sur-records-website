import { NextResponse } from "next/server";
import { Resend } from "resend";
import { applicationSchema } from "@/lib/schema";
import { site } from "@/lib/content";

export const runtime = "nodejs";
// Never cache a submission endpoint.
export const dynamic = "force-dynamic";

/**
 * In-memory rate limit: 5 submissions per IP per 10 minutes.
 *
 * Good enough to blunt casual abuse. Note that serverless instances do not
 * share memory, so the real-world ceiling is per-instance — if this site ever
 * gets seriously targeted, move to Upstash Redis or Vercel KV.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

/** Escape user input before interpolating it into the HTML email body. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  /* ---- Rate limit --------------------------------------------------- */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  /* ---- Parse + validate --------------------------------------------- */
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields and try again." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot tripped — accept the request so the bot sees success, send nothing.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  /* ---- Deliver ------------------------------------------------------- */
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Never fail silently in the logs — this is the #1 deploy-day mistake.
    console.error(
      "[apply] RESEND_API_KEY is not set — application received but NOT delivered:",
      { name: data.name, email: data.email }
    );
    return NextResponse.json(
      { error: "The form is not fully configured yet. Please email us directly." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const to = process.env.APPLICATIONS_TO ?? site.email;
  // Must be a domain you have verified in Resend. onboarding@resend.dev works
  // for testing but only delivers to your own Resend account address.
  const from = process.env.APPLICATIONS_FROM ?? "Sur Records <onboarding@resend.dev>";

  const row = (label: string, value: string, isLink = false) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#666;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eee;color:#111;font-size:14px">${
        isLink ? `<a href="${esc(value)}" style="color:#d9560a">${esc(value)}</a>` : esc(value)
      }</td>
    </tr>`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto">
      <div style="background:#0b0a0f;padding:24px 16px;border-radius:10px 10px 0 0">
        <p style="margin:0;color:#ff7a1a;font-size:11px;letter-spacing:2px;text-transform:uppercase">Sur Records</p>
        <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:20px;font-weight:600">New artist application</h1>
      </div>

      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;border-top:none">
        ${row("Name", data.name)}
        ${row("Role", data.role)}
        ${row("Email", data.email, true)}
        ${row("Phone", data.phone)}
        ${data.instagram ? row("Instagram", data.instagram) : ""}
        ${data.link ? row("Music link", data.link, true) : ""}
      </table>

      ${
        data.message
          ? `<div style="background:#fafafa;border:1px solid #eee;border-top:none;padding:16px">
               <p style="margin:0 0 6px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Message</p>
               <p style="margin:0;color:#111;font-size:14px;line-height:1.65;white-space:pre-wrap">${esc(data.message)}</p>
             </div>`
          : ""
      }

      <p style="padding:14px 16px;color:#999;font-size:12px;background:#fafafa;border:1px solid #eee;border-top:none;border-radius:0 0 10px 10px;margin:0">
        Reply directly to this email to reach ${esc(data.name)}.
      </p>
    </div>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `New artist — ${data.name} (${data.role})`,
      // Lets you hit reply and land straight in the applicant's inbox.
      replyTo: data.email,
      html,
    });

    if (error) {
      console.error("[apply] Resend rejected the send:", error);
      return NextResponse.json(
        { error: "We could not send that just now. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[apply] Unexpected failure:", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }
}
