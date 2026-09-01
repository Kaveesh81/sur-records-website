import { manifesto } from "@/lib/content";
import Reveal from "./Reveal";

// Called out in gold within the closing signature line; the rest stays white.
const SIGNATURE_HIGHLIGHT = "For the artists who have something to say";

function renderSignature(text: string) {
  const idx = text.indexOf(SIGNATURE_HIGHLIGHT);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-gold">{text.slice(idx, idx + SIGNATURE_HIGHLIGHT.length)}</span>
      {text.slice(idx + SIGNATURE_HIGHLIGHT.length)}
    </>
  );
}

/**
 * MANIFESTO — the brand statement, staggered in as the visitor scrolls
 * through it via the shared `Reveal` primitive (the old per-word scroll-scrub
 * only worked for a single paragraph; this copy has several distinct beats).
 */
export default function Manifesto() {
  return (
    <section id="manifesto" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-gold/40 bg-gold/[0.04] px-6 py-12 text-center sm:px-14 sm:py-16">
        <Reveal>
          <p className="label-mono mb-8 flex items-center justify-center gap-3 !text-[clamp(1.75rem,5vw,3.25rem)]">
            <span className="h-px w-10 bg-gold" />
            {manifesto.label}
          </p>
          <p className="display text-pretty text-xl leading-relaxed text-bone sm:text-2xl">
            {manifesto.lead}
          </p>
        </Reveal>

        <Reveal stagger delay={0.05} className="mt-8 space-y-5">
          {manifesto.paragraphs.map((p, i) => (
            <p key={i} className="display text-pretty text-xl leading-relaxed text-bone sm:text-2xl">
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal stagger delay={0.05} className="mt-8 space-y-6">
          {manifesto.contrasts.map((c, i) => (
            <div key={i}>
              <p className="display text-xl leading-relaxed text-bone sm:text-2xl">{c.not}</p>
              <p className="display mt-1 text-xl leading-relaxed text-gold sm:text-2xl">{c.but}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <p className="display text-pretty text-2xl italic leading-relaxed text-bone sm:text-3xl">
            {renderSignature(manifesto.signature)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
