"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import { releases } from "@/lib/content";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";
import CoverArt from "./CoverArt";

/**
 * RELEASES
 *
 * Desktop (>=768px): the section pins and the card track scrubs horizontally
 * — vertical scroll input, horizontal motion. This is the second and last
 * pin on the page.
 *
 * Mobile: no pin. The same track becomes a native scroll-snap carousel,
 * which preserves momentum scrolling and avoids the gesture conflict of
 * hijacking vertical scroll on a touch device.
 */
export default function Releases() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Distance the track must travel to bring its last card flush right.
        const distance = () => Math.max(0, tr.scrollWidth - el.offsetWidth);

        const tween = gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            // Scroll length tracks content width, so adding releases to
            // content.ts never needs a hardcoded height adjusted here.
            end: () => `+=${distance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => tween.kill();
      });

      // Cards fade up on entry regardless of breakpoint.
      gsap.from("[data-card]", {
        opacity: 0,
        y: 28,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="releases" className="relative py-24 md:py-0">
      <div
        ref={root}
        className="relative flex flex-col justify-center md:h-svh md:overflow-hidden md:pt-24"
      >
        {/* Heading */}
        <div className="mx-auto w-full max-w-7xl shrink-0 px-6 pb-6 md:pb-6">
          <p className="label-mono mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-saffron" />
            Selected work
          </p>
          <h2 className="display max-w-2xl text-balance text-[clamp(1.85rem,4.4vw,3.25rem)]">
            Records we have <span className="italic text-saffron">put our name on</span>
          </h2>
        </div>

        {/* Track — GSAP-driven on desktop, snap-scroll on mobile */}
        <div className="overflow-x-auto pb-4 md:overflow-visible md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            ref={track}
            className="flex w-max snap-x snap-mandatory gap-5 px-6 md:snap-none md:px-[max(1.5rem,calc((100vw-80rem)/2))]"
          >
            {releases.map((r) => (
              <article
                key={r.title}
                data-card
                className="group w-[76vw] shrink-0 snap-center sm:w-[18rem] md:w-[17rem] lg:w-[18.5rem]"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-line">
                  <CoverArt hue={r.art.hue} glyph={r.art.glyph} />

                  {/* Play affordance. Visible on touch (no hover), revealed on hover for pointers. */}
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-[--dur-base] md:group-hover:bg-ink/35">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bone/95 text-ink opacity-0 transition-[opacity,transform] duration-[--dur-base] ease-[--ease-out-quart] md:scale-90 md:group-hover:scale-100 md:group-hover:opacity-100">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </span>
                  </div>

                  <span className="absolute left-3 top-3 rounded-full border border-bone/15 bg-ink/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone backdrop-blur-md">
                    {r.type}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="display truncate text-xl">{r.title}</h3>
                    <p className="mt-1 truncate text-sm text-bone-muted">{r.artist}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-bone-faint tabular">
                    {r.year}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-4 w-full max-w-7xl shrink-0 px-6 text-xs text-bone-faint">
          <span className="md:hidden">Swipe to browse</span>
          <span className="hidden md:inline">Keep scrolling to browse the catalogue</span>
        </p>
      </div>
    </section>
  );
}
