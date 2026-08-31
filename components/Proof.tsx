"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { proof } from "@/lib/content";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * PROOF — animated counters.
 *
 * The final value is rendered in the HTML so it is correct before JS runs
 * and for screen readers; the count-up only animates the visible text node.
 * Figures use tabular numerals so the row never reflows mid-count.
 */
export default function Proof() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        if (!Number.isFinite(target)) return;

        const obj = { v: 0 };

        gsap.to(obj, {
          v: target,
          duration: 1.9,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 88%", once: true },
          onUpdate: () => {
            node.textContent = String(Math.round(obj.v));
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="border-y border-line px-6 py-16 md:py-20">
      <div
        ref={root}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 lg:grid-cols-4"
      >
        {proof.map((s) => (
          <div key={s.label} className="text-center">
            <p className="display text-[clamp(2.5rem,6vw,4rem)] leading-none">
              {/* aria-hidden on the animating node; the accessible value
                  is carried by the sr-only sibling below. */}
              <span data-count={s.value} aria-hidden="true" className="tabular">
                {s.value}
              </span>
              <span aria-hidden="true" className="text-gold">
                {s.suffix}
              </span>
              <span className="sr-only">
                {s.value}
                {s.suffix}
              </span>
            </p>
            <p className="label-mono mt-4">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
