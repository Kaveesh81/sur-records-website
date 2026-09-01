import type { Metadata } from "next";
import { releases } from "@/lib/content";
import PageIntro from "@/components/PageIntro";
import ReleaseCard from "@/components/ReleaseCard";

export const metadata: Metadata = {
  title: "The Sur Sound",
  description: "Listen, watch, and go behind every release from Sur Records.",
};

const SUB_NAV = [
  { href: "#latest", label: "Latest Releases" },
  { href: "#songs", label: "All Songs" },
  { href: "#albums", label: "Albums" },
];

export default function SurSoundPage() {
  const latest = releases.filter((r) => r.featured);
  const songs = releases.filter((r) => r.type !== "Album");
  const albums = releases.filter((r) => r.type === "Album");

  return (
    <div className="px-6 pb-28 md:pb-36">
      <PageIntro
        label="The Sur Sound"
        heading="Listen. Watch. The story behind it all."
        sub="Every release from Sur Records — who made it, when it landed, and where to hear it."
      />

      <nav
        aria-label="Sections"
        className="mx-auto mb-16 flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-3 border-y border-line py-5"
      >
        {SUB_NAV.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="label-mono text-bone-muted transition-colors duration-[--dur-base] hover:text-gold"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="mx-auto max-w-4xl space-y-24">
        <section id="latest" className="scroll-mt-24">
          <h2 className="display mb-8 text-[clamp(1.75rem,4vw,2.75rem)]">Latest Releases</h2>
          <div>
            {latest.map((r) => (
              <ReleaseCard key={r.title} release={r} />
            ))}
          </div>
        </section>

        <section id="songs" className="scroll-mt-24">
          <h2 className="display mb-8 text-[clamp(1.75rem,4vw,2.75rem)]">All Songs</h2>
          <div>
            {songs.map((r) => (
              <ReleaseCard key={r.title} release={r} />
            ))}
          </div>
        </section>

        <section id="albums" className="scroll-mt-24">
          <h2 className="display mb-8 text-[clamp(1.75rem,4vw,2.75rem)]">Albums</h2>
          <div>
            {albums.map((r) => (
              <ReleaseCard key={r.title} release={r} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
