import { roster } from "@/lib/content";
import Reveal from "./Reveal";
import CoverArt from "./CoverArt";

/**
 * ROSTER — artist grid.
 * Server component; the entrance stagger is delegated to <Reveal stagger>.
 */
export default function Roster() {
  return (
    <section id="roster" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-mono mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-saffron" />
              The roster
            </p>
            <h2 className="display max-w-xl text-balance text-[clamp(2rem,5.5vw,4rem)]">
              The people making <span className="italic text-saffron">the noise</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-bone-muted">
            A small roster on purpose. Every artist here gets the room, the
            budget and the attention a record actually needs.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {roster.map((a) => (
            <article key={a.name} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line">
                <div className="h-full w-full transition-transform duration-700 ease-[--ease-out-quart] group-hover:scale-[1.04]">
                  <CoverArt hue={a.hue} glyph={a.glyph} />
                </div>

                {/* Scrim keeps the name legible over any artwork. */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-4 pt-14">
                  <h3 className="display text-lg leading-tight">{a.name}</h3>
                  <p className="mt-1 text-xs text-bone-muted">{a.role}</p>
                </div>

                {/* Scrimmed pill: this label sits directly on the artwork, where
                    contrast against a bright gradient pocket is otherwise
                    unpredictable. Matches the release-type badge treatment. */}
                <span className="absolute right-3 top-3 rounded-full border border-bone/15 bg-ink/65 px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-bone backdrop-blur-md">
                  {a.location}
                </span>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
