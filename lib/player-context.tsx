"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { releases } from "./content";

export type Track = {
  id: string;
  title: string;
  artist: string;
  art: { hue: number; glyph: string };
  cover: string | null;
  audioSrc: string | null;
  duration: number;
};

/**
 * The player's queue is derived straight from `releases` — one catalogue,
 * no separate track list to keep in sync as content.ts grows.
 */
const queue: Track[] = releases.map((r) => ({
  id: r.title,
  title: r.title,
  artist: r.artist,
  art: r.art,
  cover: r.cover,
  audioSrc: r.audioSrc,
  duration: r.duration ?? 180,
}));

type PlayerState = {
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // seconds elapsed
  play: (track: Track) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

/**
 * Global playback state, mounted once in the root layout so it survives
 * client-side navigation between pages — "listen while browsing."
 *
 * Drives a real <audio> element when a track has a real `audioSrc`. Until
 * real audio files exist, playback is simulated (a ticking progress timer
 * against the placeholder `duration`) so the player stays visually alive
 * and fully interactive rather than looking broken.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  const stepTo = useCallback(
    (dir: 1 | -1) => {
      if (!currentTrack) {
        if (queue.length) play(queue[0]);
        return;
      }
      const i = queue.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (i + dir + queue.length) % queue.length;
      play(queue[nextIndex]);
    },
    [currentTrack, play]
  );

  const next = useCallback(() => stepTo(1), [stepTo]);
  const prev = useCallback(() => stepTo(-1), [stepTo]);

  const toggle = useCallback(() => {
    if (!currentTrack) {
      if (queue.length) play(queue[0]);
      return;
    }
    setIsPlaying((v) => !v);
  }, [currentTrack, play]);

  const seek = useCallback(
    (seconds: number) => {
      if (!currentTrack) return;
      const clamped = Math.max(0, Math.min(seconds, currentTrack.duration));
      setProgress(clamped);
      if (audioRef.current && currentTrack.audioSrc) {
        audioRef.current.currentTime = clamped;
      }
    },
    [currentTrack]
  );

  // Real <audio> element: syncs src + play/pause when a track has real audio.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    if (!currentTrack?.audioSrc) {
      audio.pause();
      audio.removeAttribute("src");
      return;
    }

    if (audio.src !== currentTrack.audioSrc) audio.src = currentTrack.audioSrc;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", next);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", next);
    };
  }, [next]);

  // Simulated ticker for placeholder tracks with no real audioSrc.
  useEffect(() => {
    if (!currentTrack || currentTrack.audioSrc || !isPlaying) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 1, currentTrack.duration));
    }, 1000);
    return () => clearInterval(id);
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (!currentTrack || currentTrack.audioSrc) return;
    if (progress >= currentTrack.duration) next();
  }, [progress, currentTrack, next]);

  return (
    <PlayerContext.Provider
      value={{ queue, currentTrack, isPlaying, progress, play, toggle, next, prev, seek }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
