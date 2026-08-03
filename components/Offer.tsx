import { Mic, Globe, ScrollText, Film, Camera, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { offer } from "@/lib/content";
import Reveal from "./Reveal";

/**
 * OFFER — the persuasion section.
 *
 * This is the part that actually converts a browsing singer into an
 * applicant, so it sits directly above the form.
 */

// Icon names live in content.ts as plain strings; map them to components here
// so the content file stays free of imports and is safe for a non-dev to edit.
const ICONS: Record<string, LucideIcon> = {
  mic: Mic,
  globe: Globe,
  scroll: ScrollText,
  film: Film,
  camera: Camera,
  users: Users,
};

export default function Offer() {
  return (
    <section id="offer" className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* Ambient warmth so this section reads as the emotional peak. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[64rem] max-w-[140vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-saffron) 0%, var(--color-indigo) 55%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-16 max-w-3xl">
          <p className="label-mono mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-saffron" />
            {offer.label}
          </p>
          <h2 className="display text-balance text-[clamp(2rem,5.5vw,4rem)]">
            {offer.heading}
          </h2>
        </Reveal>

        <Reveal stagger className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {offer.items.map((item) => {
            const Icon = ICONS[item.icon] ?? Mic;

            return (
              <div
                key={item.title}
                className="group bg-ink p-7 transition-colors duration-[--dur-base] hover:bg-ink-2 md:p-9"
              >
                <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink-2 text-saffron transition-colors duration-[--dur-base] group-hover:border-saffron/40">
                  <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
                </span>

                <h3 className="display mb-3 text-xl leading-snug text-balance">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-bone-muted">{item.body}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
