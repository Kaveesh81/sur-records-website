import { ticker } from "@/lib/content";

/**
 * Infinite marquee band. The track is rendered twice and translated -50%,
 * which makes the loop seamless. Pauses on hover (see .marquee-track).
 *
 * Server component — no interactivity, pure CSS animation.
 */
export default function Ticker() {
  const row = [...ticker, ...ticker];

  return (
    <div
      className="relative border-y border-line/70 bg-ink-2/40 py-5"
      aria-hidden="true"
    >
      {/* Feather the ends so words dissolve rather than clip at the viewport edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent sm:w-40" />

      <div className="flex overflow-hidden">
        <div className="marquee-track">
          {row.map((word, i) => (
            <span key={i} className="flex shrink-0 items-center">
              <span className="display px-7 text-2xl text-bone-muted sm:text-3xl">
                {word}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
