import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * Shared "hero page" intro used at the top of every section page — a big
 * centered heading, consistent across The Surilas / The Sur Sound / From
 * the Studio.
 */
export default function PageIntro({
  label,
  heading,
  sub,
}: {
  label: string;
  heading: ReactNode;
  sub?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-4xl px-6 pb-16 pt-32 text-center md:pt-40">
      <p className="label-mono mb-6 flex items-center justify-center gap-3 !text-[clamp(1.75rem,5vw,3.25rem)]">
        <span className="h-px w-10 bg-gold" />
        {label}
        <span className="h-px w-10 bg-gold" />
      </p>
      <h1 className="display text-balance text-xl sm:text-2xl">{heading}</h1>
      {sub && (
        <p className="mx-auto mt-5 max-w-2xl text-pretty leading-relaxed text-bone-muted">
          {sub}
        </p>
      )}
    </Reveal>
  );
}
