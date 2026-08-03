"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so that Lenis and
 * ScrollTrigger share a single RAF loop (two loops causes scrub jitter).
 *
 * Adds a `js` class to <html> so CSS can safely hide reveal elements —
 * without JS they stay visible and crawlable.
 *
 * Fully disabled under prefers-reduced-motion: native scrolling only.
 */
export default function SmoothScroll() {
  useEffect(() => {
    registerGsap();

    const root = document.documentElement;
    root.classList.add("js");

    // Anchor links must still work when Lenis is off.
    if (prefersReducedMotion()) {
      root.style.scrollBehavior = "auto";
      return () => {
        root.classList.remove("js");
      };
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch feels better than a JS-driven approximation.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Route in-page anchor clicks through Lenis for a controlled glide.
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -8, duration: 1.2 });
    };

    document.addEventListener("click", onAnchorClick);

    // Layout settles after fonts load; stale trigger positions cause
    // sections to pin at the wrong scroll offset.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      root.classList.remove("js");
    };
  }, []);

  return null;
}
