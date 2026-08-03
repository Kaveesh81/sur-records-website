"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero, site } from "@/lib/content";
import { registerGsap, prefersReducedMotion, splitChars, EASE } from "@/lib/motion";

/**
 * HERO
 *
 * Composites three effects from the 21st.dev / Aceternity hero family,
 * re-implemented in CSS + GSAP against the Sur palette:
 *   · Aurora Background — drifting masked gradient field   (.aurora)
 *   · Lamp Effect       — conic light cone + filament      (.lamp-cone)
 *   · Sparkles          — canvas dust motes                (this file)
 *
 * On top: a per-character kinetic headline and a scroll-scrubbed parallax
 * that sinks the whole composition as you leave the fold.
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

      // Scale count with area so a phone doesn't render desktop density.
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

        // Twinkle, biased warm to sit inside the saffron light.
        const alpha = m.a * (0.55 + 0.45 * Math.sin(m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 226, 196, ${alpha})`;
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
      // Split every headline line into characters up front.
      const lines = gsap.utils.toArray<HTMLElement>("[data-headline-line]");
      const perLine = lines.map((line) => splitChars(line));

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      // 1 — the lamp strikes.
      tl.from(".lamp-filament", { scaleX: 0, opacity: 0, duration: 1.1 }, 0)
        .from(".lamp-cone", { opacity: 0, scaleY: 0.5, duration: 1.4 }, 0.08)
        .from(".aurora", { opacity: 0, duration: 1.8 }, 0)

        // 2 — eyebrow.
        .from("[data-anim='eyebrow']", { opacity: 0, y: 14, duration: 0.7 }, 0.45)

        // 3 — headline, character by character, line after line.
        .add(() => {}, 0.6);

      perLine.forEach((chars, i) => {
        tl.from(
          chars,
          {
            opacity: 0,
            yPercent: 110,
            rotateX: -55,
            duration: 0.85,
            stagger: 0.016,
            ease: EASE.out,
          },
          0.6 + i * 0.11
        );
      });

      // 4 — the Devanagari watermark breathes in behind everything.
      tl.from("[data-anim='glyph']", { opacity: 0, scale: 0.86, duration: 1.6 }, 0.5)

        // 5 — supporting copy and actions.
        .from("[data-anim='sub']", { opacity: 0, y: 18, duration: 0.75 }, 1.15)
        .from("[data-anim='cta']", { opacity: 0, y: 18, duration: 0.7, stagger: 0.09 }, 1.28)
        .from("[data-anim='scrollcue']", { opacity: 0, duration: 0.7 }, 1.6);

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
        {/* Grounds the composition — stops the aurora bleeding into the next section. */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* ---- Devanagari watermark ------------------------------------- */}
      <span
        data-anim="glyph"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[56%] select-none font-deva text-[38vw] leading-none text-bone/[0.028] md:text-[26vw]"
      >
        {site.nameDevanagari}
      </span>

      {/* ---- Foreground ----------------------------------------------- */}
      <div data-parallax="fore" className="relative z-10 mx-auto max-w-5xl text-center">
        <p data-anim="eyebrow" className="label-mono mb-8">
          <span className="mr-3 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-saffron align-middle" />
          {hero.eyebrow}
        </p>

        <h1 className="display text-balance text-[clamp(2.5rem,7.4vw,6rem)]">
          {hero.headline.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <span
                data-headline-line
                className={`block ${i === 1 ? "italic text-saffron" : ""}`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-anim="sub"
          className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-bone-muted sm:text-lg"
        >
          {hero.sub}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <a
            data-anim="cta"
            href={hero.primaryCta.href}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-saffron px-8 text-sm font-semibold text-ink transition-[background-color,transform] duration-[--dur-base] ease-[--ease-out-quart] hover:bg-[#ff8f3d] active:scale-[0.98] sm:w-auto"
          >
            {hero.primaryCta.label}
            <ArrowUpRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform duration-[--dur-base] ease-[--ease-out-quart] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <a
            data-anim="cta"
            href={hero.secondaryCta.href}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-line bg-bone/[0.03] px-8 text-sm font-medium text-bone backdrop-blur-sm transition-colors duration-[--dur-base] hover:border-bone/25 hover:bg-bone/[0.07] sm:w-auto"
          >
            {hero.secondaryCta.label}
          </a>
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
