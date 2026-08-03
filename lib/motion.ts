"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 * Importing this module anywhere guarantees ScrollTrigger exists exactly once.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Shared motion tokens. Every animation on the site pulls its easing and
 * duration from here so the whole page moves with one rhythm
 * (ui-ux-pro-max: `motion-consistency`).
 */
export const EASE = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power2.out",
} as const;

export const DUR = {
  fast: 0.28,
  base: 0.55,
  slow: 0.9,
} as const;

/**
 * Splits an element's text into per-character spans for kinetic headlines.
 *
 * Hand-rolled rather than using GSAP's SplitText plugin: it keeps the bundle
 * smaller and, more importantly, lets us set `aria-label` on the wrapper so
 * screen readers announce the original sentence instead of spelling it out
 * one character at a time.
 *
 * Returns the created spans, ready to hand to `gsap.from(...)`.
 */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.textContent = "";

  const chars: HTMLElement[] = [];

  for (const ch of Array.from(text)) {
    const span = document.createElement("span");
    span.textContent = ch === " " ? " " : ch;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    // The visible characters are decorative once aria-label carries the text.
    span.setAttribute("aria-hidden", "true");
    el.appendChild(span);
    chars.push(span);
  }

  return chars;
}
