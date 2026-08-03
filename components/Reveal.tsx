"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import gsap from "gsap";
import { registerGsap, prefersReducedMotion, EASE } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  /** Seconds to wait after the trigger fires. */
  delay?: number;
  /** Travel distance in px. Kept small so it reads as a fade, not a slide. */
  y?: number;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Scroll-reveal primitive used by every section.
 *
 * Elements carry the `reveal` class, which CSS hides ONLY when the `js` class
 * is present on <html>. That way a crawler or a JS-disabled visitor sees
 * fully rendered content (ui-ux-pro-max: scroll-reveal SEO fallback).
 */
export default function Reveal({
  children,
  stagger = false,
  delay = 0,
  y = 24,
  as: Tag = "div",
  className = "",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registerGsap();

    // Reduced motion: reveal instantly, register nothing.
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, clearProps: "all" });
      return;
    }

    const targets = stagger ? Array.from(el.children) : el;

    const ctx = gsap.context(() => {
      // The wrapper is hidden by CSS (.js .reveal { opacity: 0 }) to prevent
      // a flash of unstyled content. Always make it visible again here.
      gsap.set(el, { opacity: 1 });

      // fromTo, not from: `from` infers the END state from the element's
      // current opacity, which CSS has already set to 0 — so `from` would
      // animate 0 -> 0 and the section would never appear.
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          delay,
          ease: EASE.soft,
          stagger: stagger ? 0.075 : 0,
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, y]);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
