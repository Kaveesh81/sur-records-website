"use client";

import { Pause, Play, Youtube } from "lucide-react";
import type { releases as releasesList, StreamingLinks } from "@/lib/content";
import { usePlayer } from "@/lib/player-context";
import CoverArt from "./CoverArt";

type Release = (typeof releasesList)[number];

const PLATFORM_LABELS: Record<keyof StreamingLinks, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  amazonMusic: "Amazon Music",
  youtubeMusic: "YouTube Music",
  jioSaavn: "JioSaavn",
  gaana: "Gaana",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

/**
 * One release, fully detailed: cover, credits, and links out to every place
 * it lives. Reused across Latest / Songs / Albums on The Sur Sound — one
 * card, three filtered views of the same `releases` list.
 *
 * The play button pushes the track into the global player context, so
 * picking a song here keeps playing as the visitor browses elsewhere.
 */
export default function ReleaseCard({ release }: { release: Release }) {
  const { currentTrack, isPlaying, play, toggle } = usePlayer();
  const isActive = currentTrack?.id === release.title;

  const onPlayClick = () => {
    if (isActive) {
      toggle();
      return;
    }
    play({
      id: release.title,
      title: release.title,
      artist: release.artist,
      art: release.art,
      cover: release.cover,
      audioSrc: release.audioSrc,
      duration: release.duration ?? 180,
    });
  };

  const streamingEntries = Object.entries(release.streaming) as [
    keyof StreamingLinks,
    string | undefined,
  ][];

  return (
    <article className="flex flex-col gap-5 border-b border-line py-8 sm:flex-row sm:gap-7">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl border border-line sm:w-40 md:w-44">
        <CoverArt hue={release.art.hue} glyph={release.art.glyph} src={release.cover ?? undefined} alt={release.title} />

        <button
          type="button"
          onClick={onPlayClick}
          aria-label={isActive && isPlaying ? `Pause ${release.title}` : `Play ${release.title}`}
          className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-[--dur-base] hover:bg-ink/35"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bone/95 text-ink opacity-0 transition-[opacity,transform] duration-[--dur-base] ease-[--ease-out-quart] hover:opacity-100 hover:scale-100 scale-90">
            {isActive && isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="ml-0.5" />
            )}
          </span>
        </button>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-bone/15 bg-ink/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-bone backdrop-blur-md">
          {release.type}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="display text-2xl leading-tight sm:text-[1.75rem]">{release.title}</h3>

        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-bone-muted sm:grid-cols-4">
          <div>
            <dt className="label-mono !text-[0.6rem]">Singer</dt>
            <dd className="mt-0.5 truncate text-bone">{release.singer}</dd>
          </div>
          <div>
            <dt className="label-mono !text-[0.6rem]">Composer</dt>
            <dd className="mt-0.5 truncate text-bone">{release.composer}</dd>
          </div>
          <div>
            <dt className="label-mono !text-[0.6rem]">Lyricist</dt>
            <dd className="mt-0.5 truncate text-bone">{release.lyricist}</dd>
          </div>
          <div>
            <dt className="label-mono !text-[0.6rem]">Released</dt>
            <dd className="mt-0.5 truncate text-bone">{formatDate(release.releaseDate)}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="label-mono !text-[0.6rem] shrink-0">Listen on</span>
          {streamingEntries.map(([key, href]) =>
            !href || href === "#" ? (
              <span key={key} className="text-sm text-bone-faint" title="Link coming soon">
                {PLATFORM_LABELS[key]}
              </span>
            ) : (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-gold"
              >
                {PLATFORM_LABELS[key]}
              </a>
            )
          )}
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="label-mono !text-[0.6rem] shrink-0">Watch on</span>
          {release.youtubeUrl && release.youtubeUrl !== "#" ? (
            <a
              href={release.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-bone-muted transition-colors duration-[--dur-base] hover:text-gold"
            >
              <Youtube size={14} />
              YouTube
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm text-bone-faint" title="Link coming soon">
              <Youtube size={14} />
              YouTube
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
