"use client";

import { useRef, useState } from "react";
import { ChevronUp, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import CoverArt from "./CoverArt";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Persistent playback bar, mounted once in the root layout so it survives
 * navigation between pages. A "Sur Records" take on a disk player: a
 * grooved vinyl ring around the spinning cover art, rendered in the site's
 * black-and-gold system rather than any stock player skin.
 */
export default function MusicPlayer() {
  const { queue, currentTrack, isPlaying, progress, toggle, next, prev, seek, play } =
    usePlayer();
  const [queueOpen, setQueueOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const duration = currentTrack?.duration ?? 0;
  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  const onScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(fraction * currentTrack.duration);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      {/* Queue panel */}
      {queueOpen && (
        <div className="max-h-[50vh] overflow-y-auto border-t border-line bg-ink/97 backdrop-blur-2xl">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="label-mono">Queue</p>
              <button
                type="button"
                onClick={() => setQueueOpen(false)}
                aria-label="Close queue"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-bone-muted transition-colors duration-[--dur-fast] hover:bg-bone/10 hover:text-bone"
              >
                <X size={16} />
              </button>
            </div>

            <ul className="divide-y divide-line">
              {queue.map((t) => {
                const active = t.id === currentTrack?.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => play(t)}
                      className={`flex min-h-14 w-full items-center gap-3 py-2.5 text-left transition-colors duration-[--dur-fast] ${
                        active ? "text-gold" : "text-bone hover:text-gold"
                      }`}
                    >
                      <span className="h-9 w-9 shrink-0 overflow-hidden rounded-md border border-line">
                        <CoverArt hue={t.art.hue} glyph={t.art.glyph} src={t.cover ?? undefined} alt={t.title} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{t.title}</span>
                        <span className="block truncate text-xs text-bone-muted">{t.artist}</span>
                      </span>
                      {active && isPlaying && (
                        <span className="label-mono shrink-0 text-gold">Playing</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Scrub bar */}
      <div
        ref={barRef}
        onClick={onScrub}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={progress}
        tabIndex={currentTrack ? 0 : -1}
        className={`h-1 w-full bg-line ${currentTrack ? "cursor-pointer" : "cursor-default"}`}
      >
        <div
          className="h-full bg-gold transition-[width] duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Bar */}
      <div className="border-t border-line bg-ink/95 backdrop-blur-2xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:h-20 sm:gap-4 sm:px-6">
          {/* Vinyl disk */}
          <div className="relative h-11 w-11 shrink-0 sm:h-14 sm:w-14">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "repeating-radial-gradient(circle at center, #000 0px, #000 1px, transparent 1.6px, transparent 3.2px)",
              }}
            />
            <div
              className="player-disk absolute inset-[3px] overflow-hidden rounded-full border border-line"
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
            >
              {currentTrack ? (
                <CoverArt
                  hue={currentTrack.art.hue}
                  glyph={currentTrack.art.glyph}
                  src={currentTrack.cover ?? undefined}
                  alt={currentTrack.title}
                />
              ) : (
                <div className="h-full w-full bg-ink-2" />
              )}
            </div>
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60 bg-ink" />
          </div>

          {/* Title / artist */}
          <button
            type="button"
            onClick={() => setQueueOpen((v) => !v)}
            className="group min-w-0 flex-1 text-left"
            aria-expanded={queueOpen}
          >
            {currentTrack ? (
              <>
                <span className="block truncate text-sm font-medium text-bone group-hover:text-gold transition-colors duration-[--dur-fast]">
                  {currentTrack.title}
                </span>
                <span className="block truncate text-xs text-bone-muted">
                  {currentTrack.artist}
                </span>
              </>
            ) : (
              <span className="block truncate text-sm text-bone-muted group-hover:text-gold transition-colors duration-[--dur-fast]">
                Pick a track from The Sur Sound
              </span>
            )}
          </button>

          {/* Time — hidden on the smallest screens to keep controls from crowding */}
          {currentTrack && (
            <span className="label-mono hidden shrink-0 tabular sm:block">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          )}

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={prev}
              disabled={!currentTrack}
              aria-label="Previous track"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-bone-muted transition-colors duration-[--dur-fast] hover:bg-bone/10 hover:text-bone disabled:pointer-events-none disabled:opacity-30"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold text-ink transition-[background-color,transform] duration-[--dur-base] hover:bg-[#f0c75e] active:scale-[0.96]"
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={next}
              disabled={!currentTrack}
              aria-label="Next track"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-bone-muted transition-colors duration-[--dur-fast] hover:bg-bone/10 hover:text-bone disabled:pointer-events-none disabled:opacity-30"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={() => setQueueOpen((v) => !v)}
              aria-label={queueOpen ? "Hide queue" : "Show queue"}
              aria-expanded={queueOpen}
              className="ml-1 hidden h-10 w-10 items-center justify-center rounded-full text-bone-muted transition-[background-color,color,transform] duration-[--dur-fast] hover:bg-bone/10 hover:text-bone sm:inline-flex"
            >
              <ChevronUp
                size={16}
                className={`transition-transform duration-[--dur-base] ${queueOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
