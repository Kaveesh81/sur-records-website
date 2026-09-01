import { Play } from "lucide-react";
import { studio } from "@/lib/content";
import Reveal from "./Reveal";
import CoverArt from "./CoverArt";

/**
 * From the Studio — video placeholder cards. Each renders generated cover
 * art with a play affordance until a real `videoUrl` is added to content.ts,
 * at which point this can be swapped for an embed.
 */
export default function StudioGrid() {
  return (
    <Reveal stagger className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
      {studio.map((v, i) => (
        <article key={v.title}>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-line">
            <CoverArt hue={(i * 47) % 360} glyph="" />

            <div className="absolute inset-0 flex items-center justify-center bg-ink/25">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bone/95 text-ink">
                <Play size={18} fill="currentColor" className="ml-0.5" />
              </span>
            </div>

            <span className="absolute left-3 top-3 rounded-full border border-bone/15 bg-ink/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone backdrop-blur-md">
              {v.category}
            </span>
          </div>

          <h3 className="display mt-4 text-xl">{v.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-bone-muted">{v.description}</p>
          {v.relatedSong && (
            <p className="label-mono mt-2 !text-[0.6rem]">From &ldquo;{v.relatedSong}&rdquo;</p>
          )}
        </article>
      ))}
    </Reveal>
  );
}
