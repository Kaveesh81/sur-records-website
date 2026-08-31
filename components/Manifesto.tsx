"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { manifesto } from "@/lib/content";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * MANIFESTO
 *
 * The signature scroll moment: each word lifts from dim to full brightness
 * as the section is scrubbed through, so reading pace is tied to scroll pace.
 *
 * Desktop pins the section (one of only two pins on the page — see Releases).
 * Mobile skips the pin: pinning fights native momentum scroll and is the
 * single most common cause of janky scroll on mid-tier phones.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-word]"), { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const build = (pin: boolean) => () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.5,
            scrollTrigger: {
              trigger: el,
              start: pin ? "top top" : "top 78%",
              end: pin ? "+=120%" : "bottom 55%",
              scrub: 0.5,
              pin,
              anticipatePin: pin ? 1 : 0,
            },
          }
        );
      };

      mm.add("(min-width: 768px)", build(true));
      mm.add("(max-width: 767px)", build(false));
    }, el);

    return () => ctx.revert();
  }, []);

  const words = manifesto.body.split(" ");

  return (
    <section
      ref={root}
      id="manifesto"
      className="relative flex min-h-[70svh] items-center px-6 py-28 md:min-h-svh md:py-36"
    >
      <div className="mx-auto w-full max-w-4xl">
        <p className="label-mono mb-10 flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />
          {manifesto.label}
        </p>

        {/*
          The paragraph carries the full sentence for assistive tech; the
          per-word spans are decorative brightness targets only.
        */}
        <p
          className="display text-balance text-[clamp(1.75rem,4.4vw,3.5rem)] leading-[1.18]"
          aria-label={manifesto.body}
        >
          {words.map((word, i) => (
            /* mr-[0.25em] instead of a text space: trailing whitespace inside
               an inline-block is trimmed, which jams the words together. */
            <span key={i} data-word aria-hidden="true" className="mr-[0.25em] inline-block">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
