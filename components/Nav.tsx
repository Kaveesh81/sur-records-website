"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/content";

/**
 * Fixed header. Transparent over the hero, then frosts on scroll so the
 * links stay legible against release artwork further down the page.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll and provide an Escape route while the mobile menu is open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-[--dur-base] ${
          scrolled
            ? "border-b border-line/70 bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-18">
          {/* Wordmark */}
          <a
            href="#top"
            className="group flex min-h-11 items-baseline gap-2.5 py-3"
            aria-label={`${site.name} — home`}
          >
            <span className="font-deva text-xl leading-none text-gold transition-transform duration-[--dur-base] ease-[--ease-out-quart] group-hover:-translate-y-px">
              {site.nameDevanagari}
            </span>
            <span className="display text-lg tracking-tight">{site.name}</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-bone after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-[width] after:duration-[--dur-base] after:ease-[--ease-out-quart] hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#apply"
              className="hidden min-h-10 items-center rounded-full bg-bone px-5 text-sm font-semibold text-ink transition-[background-color,transform] duration-[--dur-base] hover:bg-white active:scale-[0.98] sm:inline-flex"
            >
              Apply
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors duration-[--dur-fast] hover:bg-bone/10 md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink/97 backdrop-blur-2xl md:hidden"
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-2"
          aria-label="Mobile"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display flex min-h-14 items-center px-6 text-4xl text-bone transition-colors duration-[--dur-base] hover:text-gold"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#apply"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex min-h-12 items-center rounded-full bg-gold px-9 text-sm font-semibold text-ink"
          >
            Be part of the label
          </a>
        </nav>
      </div>
    </>
  );
}
