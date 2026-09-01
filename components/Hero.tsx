"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero, site } from "@/lib/content";
import { registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";

/**
 * HERO
 *
 * Brand-first: the name "Sur Records" is the content, centered both axes,
 * until real logo/branding assets exist (`hero.logoSrc` overrides the
 * generated lockup below once they do).
 *
 * Still composites the same ambient layers as before — Aurora Background,
 * Lamp Effect, canvas Sparkles — re-implemented in CSS + GSAP.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  /* ---------------------------------------------------------------------
   * Sparkles — a light dust field. Canvas rather than DOM nodes so the
   * particle count never touches layout.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || prefersReducedMotion()) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = 1;
    let motes: { x: number; y: number; r: number; vy: number; a: number; tw: number }[] = [];

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = cv.offsetWidth * dpr;
      cv.height = cv.offsetHeight * dpr;

      const count = Math.round((cv.offsetWidth * cv.offsetHeight) / 14000);

      motes = Array.from({ length: count }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: (Math.random() * 1.4 + 0.35) * dpr,
        vy: -(Math.random() * 0.16 + 0.04) * dpr,
        a: Math.random() * 0.5 + 0.12,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);

      for (const m of motes) {
        m.y += m.vy;
        m.tw += 0.02;

        if (m.y < -4) {
          m.y = cv.height + 4;
          m.x = Math.random() * cv.width;
        }

        // Twinkle, biased warm to sit inside the gold light — gilded dust.
        const alpha = m.a * (0.55 + 0.45 * Math.sin(m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 199, 94, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    draw();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 180);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ---------------------------------------------------------------------
   * Entrance choreography + scroll parallax.
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-anim]"), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      tl.from(".lamp-filament", { scaleX: 0, opacity: 0, duration: 1.1 }, 0)
        .from(".lamp-cone", { opacity: 0, scaleY: 0.5, duration: 1.4 }, 0.08)
        .from(".aurora", { opacity: 0, duration: 1.8 }, 0)
        .from("[data-anim='wordmark']", { opacity: 0, y: 24, duration: 0.9 }, 0.4)
        .from("[data-anim='tagline']", { opacity: 0, y: 16, duration: 0.75 }, 0.95)
        .from("[data-anim='cta']", { opacity: 0, y: 18, duration: 0.7, stagger: 0.09 }, 1.1)
        .from("[data-anim='scrollcue']", { opacity: 0, duration: 0.7 }, 1.45);

      // Parallax out: content sinks and fades, background drifts slower.
      gsap.to("[data-parallax='fore']", {
        yPercent: 22,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to("[data-parallax='back']", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      {/* ---- Ambient layers ------------------------------------------- */}
      <div data-parallax="back" className="pointer-events-none absolute inset-0">
        <div className="aurora" />
        <div className="lamp-cone" />
        <div className="lamp-filament" />
        <canvas
          ref={canvas}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* ---- Foreground: the brand itself ------------------------------ */}
      <div data-parallax="fore" className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Watermark is centered on the headline specifically (not the
            section), so it always sits directly behind "Sur Records"
            regardless of how much space the tagline/CTAs need below. */}
        <div className="relative mx-auto mt-10 sm:mt-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-deva text-[42vw] leading-none text-bone/[0.078] md:text-[30vw]"
          >
            {site.nameDevanagari}
          </span>

          {hero.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              data-anim="wordmark"
              src={hero.logoSrc}
              alt={site.name}
              className="relative mx-auto h-auto w-full max-w-md"
            />
          ) : (
            <h1
              data-anim="wordmark"
              className="relative display text-balance text-[clamp(3.25rem,12vw,8.5rem)] leading-[0.96]"
            >
              {site.name}
            </h1>
          )}
        </div>

        <p
          data-anim="tagline"
          className="mx-auto mt-24 max-w-lg text-pretty text-base leading-relaxed text-bone-muted sm:mt-32 sm:text-lg"
        >
          {site.tagline}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <Link
            data-anim="cta"
            href={hero.primaryCta.href}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-semibold text-ink transition-[background-color,transform] duration-[--dur-base] ease-[--ease-out-quart] hover:bg-[#f0c75e] active:scale-[0.98] sm:w-auto"
          >
            {hero.primaryCta.label}
            <ArrowUpRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform duration-[--dur-base] ease-[--ease-out-quart] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <Link
            data-anim="cta"
            href={hero.secondaryCta.href}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-line bg-bone/[0.03] px-8 text-sm font-medium text-bone backdrop-blur-sm transition-colors duration-[--dur-base] hover:border-bone/25 hover:bg-bone/[0.07] sm:w-auto"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* ---- Scroll cue ------------------------------------------------ */}
      <div
        data-anim="scrollcue"
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ArrowDown size={16} className="animate-bounce text-bone-faint" />
      </div>
    </section>
  );
}
