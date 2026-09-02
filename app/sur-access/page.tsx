import type { Metadata } from "next";
import { Check } from "lucide-react";
import { surAccess } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SurAccessCheckout from "@/components/SurAccessCheckout";

export const metadata: Metadata = {
  title: "Sur Access",
  description: "Sur Access — the Sur Records membership. Exclusive music, sessions, and events, first.",
};

export default function SurAccessPage() {
  return (
    <div className="relative overflow-hidden px-6 pb-28 pt-32 md:pb-40 md:pt-40">
      {/* A tighter, warmer glow than the ambient effects used elsewhere on
          the site — this page is meant to feel like its own rarefied space. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[60rem] max-w-[160vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
        style={{
          background: "radial-gradient(circle, var(--color-gold) 0%, var(--color-bronze) 55%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="gold-glow-box relative overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-b from-gold/[0.06] to-transparent px-8 py-14 text-center sm:px-16 sm:py-20">
          <Reveal>
            <p className="flex items-center justify-center gap-3 text-gold">
              <span aria-hidden="true" className="text-lg sm:text-xl">
                ♪
              </span>
              <span className="display text-[clamp(2rem,5.5vw,3rem)] italic tracking-wide">
                {surAccess.eyebrow}
              </span>
              <span aria-hidden="true" className="text-lg sm:text-xl">
                ♪
              </span>
            </p>
            <h1 className="display mt-5 text-balance text-[clamp(1.75rem,4vw,2.75rem)] italic leading-[1.05]">
              {surAccess.heading}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-bone-muted">
              {surAccess.description}
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal
        stagger
        className="relative mx-auto mt-16 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2 md:mt-20"
      >
        {surAccess.benefits.map((benefit) => (
          <div key={benefit} className="flex items-start gap-3 text-left">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
              <Check size={12} strokeWidth={2.5} />
            </span>
            <span className="text-pretty leading-relaxed text-bone">{benefit}</span>
          </div>
        ))}
      </Reveal>

      <div className="relative mx-auto mt-20 max-w-3xl md:mt-24">
        <SurAccessCheckout />
      </div>
    </div>
  );
}
