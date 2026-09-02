"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { surAccess, site } from "@/lib/content";
import Reveal from "./Reveal";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  config?: {
    display: {
      blocks: Record<string, { name: string; instruments: { method: string }[] }>;
      sequence: string[];
      preferences: { show_default_blocks: boolean };
    };
  };
};

/**
 * Explicitly feature UPI (GPay/PhonePe/Paytm show as intent-app icons on
 * mobile automatically, or a UPI ID field on desktop) and wallets first,
 * rather than leaving the layout to Razorpay's defaults.
 */
const CHECKOUT_DISPLAY_CONFIG: RazorpayOptions["config"] = {
  display: {
    blocks: {
      upi: {
        name: "Pay via UPI",
        instruments: [{ method: "upi" }],
      },
      wallets: {
        name: "Wallets",
        instruments: [{ method: "wallet" }],
      },
      other: {
        name: "Cards & Net Banking",
        instruments: [{ method: "card" }, { method: "netbanking" }],
      },
    },
    sequence: ["block.upi", "block.wallets", "block.other"],
    preferences: { show_default_blocks: false },
  },
};

type Status = "idle" | "creating" | "paying" | "verifying" | "success" | "error";

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export default function SurAccessCheckout() {
  const [status, setStatus] = useState<Status>("idle");
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || document.querySelector(`script[src="${CHECKOUT_SRC}"]`)) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    document.body.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  async function join(planId: string) {
    setActivePlan(planId);
    setErrorMessage(null);
    setStatus("creating");

    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const order = await orderRes.json().catch(() => ({}));

      if (!orderRes.ok) {
        throw new Error(order?.error ?? "Could not start checkout.");
      }

      if (!window.Razorpay) {
        throw new Error("Checkout is still loading — please try again in a moment.");
      }

      const plan = surAccess.plans.find((p) => p.id === planId);
      setStatus("paying");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: site.name,
        description: plan ? `${plan.label} Membership — Sur Access` : "Sur Access Membership",
        theme: { color: "#d4af37" },
        config: CHECKOUT_DISPLAY_CONFIG,
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setActivePlan(null);
          },
        },
        handler: async (response) => {
          setStatus("verifying");
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, planId }),
            });

            const result = await verifyRes.json().catch(() => ({}));

            if (!verifyRes.ok) {
              throw new Error(result?.error ?? "Payment could not be verified.");
            }

            setStatus("success");
          } catch (err) {
            setStatus("error");
            setErrorMessage(
              err instanceof Error ? err.message : "Payment could not be verified."
            );
          }
        },
      });

      rzp.open();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    const plan = surAccess.plans.find((p) => p.id === activePlan);
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-gold/50 bg-gradient-to-b from-gold/[0.08] to-transparent p-10 text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold">
          <Check size={26} strokeWidth={2.2} />
        </span>
        <h3 className="display text-balance text-2xl sm:text-3xl">Welcome to Sur Access.</h3>
        <p className="mt-4 text-pretty leading-relaxed text-bone-muted">
          Your {plan?.label.toLowerCase()} membership is confirmed. We&apos;ll be in touch
          shortly with everything you need to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {surAccess.plans.map((plan) => {
          const isBusy =
            activePlan === plan.id && (status === "creating" || status === "paying" || status === "verifying");

          return (
            <Reveal key={plan.id} as="div">
              <div className="group relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-ink-2 to-ink p-8 transition-colors duration-[--dur-base] hover:border-gold/60">
                {/* Gold-foil sheen */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.07]"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, var(--color-gold) 48%, transparent 66%)",
                  }}
                />

                <p className="label-mono relative text-gold">{plan.interval === "year" ? "Best value" : "Flexible"}</p>
                <h3 className="display relative mt-3 text-2xl">{plan.label}</h3>
                <p className="relative mt-2 flex items-baseline gap-1.5">
                  <span className="display text-4xl text-gold">₹{plan.amount.toLocaleString("en-IN")}</span>
                  <span className="text-sm text-bone-faint">/ {plan.interval}</span>
                </p>

                <button
                  type="button"
                  onClick={() => join(plan.id)}
                  disabled={status !== "idle" && status !== "error"}
                  className="relative mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-ink transition-[background-color,transform] duration-[--dur-base] ease-[--ease-out-quart] hover:bg-[#f0c75e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isBusy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {status === "verifying" ? "Confirming…" : "Opening checkout…"}
                    </>
                  ) : (
                    `Join — ${plan.label}`
                  )}
                </button>
              </div>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-bone-faint">
        <ShieldCheck size={13} className="shrink-0" />
        Secure checkout via Razorpay — UPI (GPay, PhonePe, Paytm), cards, wallets and net banking.
      </p>

      {status === "error" && errorMessage && (
        <p role="alert" className="mx-auto mt-4 max-w-md text-center text-sm text-danger">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
