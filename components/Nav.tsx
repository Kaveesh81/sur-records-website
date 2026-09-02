"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/content";

/**
 * Fixed header. Solid ink background at all times (matches the page
 * background exactly) so scrolling content never shows through or
 * overlaps the nav.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:h-18">
          {/* Mark — just the devanagari glyph, left-aligned. */}
          <Link
            href="/"
            className="group flex min-h-11 items-center py-3"
            aria-label={`${site.name} — home`}
          >
            <span className="font-deva text-2xl leading-none text-gold transition-transform duration-[--dur-base] ease-[--ease-out-quart] group-hover:-translate-y-px">
              {site.nameDevanagari}
            </span>
          </Link>

          {/* Right side: desktop links + mobile menu toggle. */}
          <div className="flex items-center gap-8">
            <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
              {nav.map((item) =>
                item.href === "/sur-access" ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="gold-glow-pill rounded-full border border-gold/40 px-4 py-1.5 text-sm text-gold transition-colors duration-[--dur-base] hover:text-gold-bright"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-gold"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>

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
          {nav.map((item) =>
            item.href === "/sur-access" ? (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="gold-glow-pill display mt-2 flex min-h-14 items-center rounded-full border border-gold/40 px-8 text-4xl text-gold transition-colors duration-[--dur-base] hover:text-gold-bright"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="display flex min-h-14 items-center px-6 text-4xl text-bone transition-colors duration-[--dur-base] hover:text-gold"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
}
