import type { Metadata } from "next";
import { about } from "@/lib/content";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "About Sur Records — an independent music label founded in 2026 by Ishhan.",
};

// Words called out in gold within body copy — same font as the surrounding
// text, just gold. "world" is also rendered upper-case via CSS, without
// altering the source copy.
const MISSION_HIGHLIGHTS = ["2026", "Ishhan", "Mumbai, India", "world"];
const FOUNDER_HIGHLIGHTS = ["Sur Records", "first chapter"];

function withHighlights(text: string, words: string[]) {
  const pattern = new RegExp(`(${words.join("|")})`, "g");
  return text.split(pattern).map((part, i) => {
    if (!words.includes(part)) return part;
    const isWorld = part.toLowerCase() === "world";
    return (
      <span key={i} className={`text-gold ${isWorld ? "uppercase" : ""}`}>
        {part}
      </span>
    );
  });
}

export default function AboutPage() {
  return (
    <div className="px-6 pb-28 pt-32 md:pb-36 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="label-mono mb-6 flex items-center gap-3 !text-[clamp(1.75rem,5vw,3.25rem)]">
            <span className="h-px w-10 bg-gold" />
            About
          </p>
          <h1 className="label-mono text-balance !text-gold !text-[clamp(1.5rem,4vw,2.5rem)]">
            {about.mission.heading}
          </h1>
          <div className="mt-8 space-y-5">
            {about.mission.paragraphs.map((p, i) => (
              <p key={i} className="display text-pretty text-2xl leading-snug sm:text-3xl">
                {withHighlights(p, MISSION_HIGHLIGHTS)}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-24 border-t border-line pt-16">
          <p className="label-mono mb-6 flex items-center gap-3 !text-[clamp(1.75rem,5vw,3.25rem)]">
            <span className="h-px w-10 bg-gold" />
            {about.founder.heading}
          </p>
          <div className="space-y-5">
            {about.founder.paragraphs.map((p, i) => (
              <p key={i} className="display text-pretty text-2xl leading-snug sm:text-3xl">
                {withHighlights(p, FOUNDER_HIGHLIGHTS)}
              </p>
            ))}
          </div>
          <p className="mt-8">
            <span className="display block text-2xl text-gold sm:text-3xl">{about.founder.signOff}</span>
            <span className="label-mono mt-1.5 block !text-sm sm:!text-base">{about.founder.signOffTitle}</span>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
