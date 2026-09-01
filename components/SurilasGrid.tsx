import { surilas } from "@/lib/content";
import Reveal from "./Reveal";
import CoverArt from "./CoverArt";

/**
 * The Surilas — large-format artist portraits (2-up, not the old 4-up roster
 * grid) so the photo is the dominant element, with the credit info below.
 */
export default function SurilasGrid() {
  return (
    <Reveal stagger className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
      {surilas.map((a) => (
        <article key={a.name} className="group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line">
            <div className="h-full w-full transition-transform duration-700 ease-[--ease-out-quart] group-hover:scale-[1.03]">
              <CoverArt hue={a.hue} glyph={a.glyph} src={a.photo ?? undefined} alt={a.name} />
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/75 to-transparent p-6 pt-24">
              <h3 className="display text-2xl leading-tight sm:text-3xl">{a.name}</h3>
              <p className="mt-1 text-sm text-gold">{a.song}</p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="label-mono !text-[0.6rem]">Age</dt>
              <dd className="mt-0.5 text-bone">{a.age}</dd>
            </div>
            <div>
              <dt className="label-mono !text-[0.6rem]">Language</dt>
              <dd className="mt-0.5 text-bone">{a.language}</dd>
            </div>
            <div>
              <dt className="label-mono !text-[0.6rem]">Social</dt>
              <dd className="mt-0.5 truncate text-bone">{a.socialHandle}</dd>
            </div>
          </dl>
        </article>
      ))}
    </Reveal>
  );
}
