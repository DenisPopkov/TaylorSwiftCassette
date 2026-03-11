"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSetAudioPlaying } from "@/context/AudioPlayingContext";
import { TTPD_TRACKS } from "@/lib/ttpdTracks";

type Props = { onClose: () => void; cassetteLabel?: string };

export function AudioPlayer({ onClose, cassetteLabel }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const setGlobalPlaying = useSetAudioPlaying();
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const track = TTPD_TRACKS[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < TTPD_TRACKS.length - 1;

  useEffect(() => {
    setGlobalPlaying(playing);
    return () => setGlobalPlaying(false);
  }, [playing, setGlobalPlaying]);

  const loadTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = TTPD_TRACKS[index];
    if (!t) return;
    audio.src = t.src;
    setCurrentIndex(index);
    setProgress(0);
    setPlaying(false);
    audio.load();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    loadTrack(currentIndex - 1);
    const audio = audioRef.current;
    if (audio) audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [currentIndex, hasPrev, loadTrack]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    loadTrack(currentIndex + 1);
    const audio = audioRef.current;
    if (audio) audio.play().then(() => setPlaying(true)).catch(() => {});
  }, [currentIndex, hasNext, loadTrack]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    setProgress(p);
  }, []);

  const handleEnded = useCallback(() => {
    setPlaying(false);
    setProgress(0);
    if (hasNext) {
      loadTrack(currentIndex + 1);
      const audio = audioRef.current;
      if (audio) audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [hasNext, currentIndex, loadTrack]);

  const handleError = useCallback(() => {
    setPlaying(false);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const time = x * (audio.duration || 0);
    audio.currentTime = time;
    setProgress(x * 100);
  };

  useEffect(() => {
    loadTrack(0);
  }, [loadTrack]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0b0b] border border-[#e8e6e3]/20 p-6 md:p-8 max-w-lg w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center mb-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#9f9f9f] hover:text-[#e8e6e3] text-3xl sm:text-4xl leading-none -mr-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {cassetteLabel && (
          <p className="text-[#e8e6e3] font-heading text-xs uppercase tracking-widest mb-1">
            {cassetteLabel}
          </p>
        )}

        <p className="text-[#9f9f9f] font-heading text-xs uppercase tracking-wider mb-3">
          Select track
        </p>
        <ul className="space-y-1 mb-6 max-h-48 overflow-y-auto pr-1">
          <li className="text-[#9f9f9f] font-heading text-[10px] uppercase tracking-widest pt-0 pb-0.5">
            SIDE A
          </li>
          {TTPD_TRACKS.slice(0, 3).map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => loadTrack(i)}
                className={`w-full text-left py-2 px-3 text-sm font-heading transition-colors flex items-center gap-2 ${
                  currentIndex === i
                    ? "bg-[#e8e6e3]/15 text-[#e8e6e3] border-l-2 border-[#e8e6e3]"
                    : "text-[#9f9f9f] hover:text-[#e8e6e3] hover:bg-[#e8e6e3]/5"
                }`}
              >
                {currentIndex === i && (
                  <span className="text-[#e8e6e3] shrink-0" aria-hidden>
                    {playing ? "▌▌" : "▶"}
                  </span>
                )}
                {t.title}
              </button>
            </li>
          ))}
          <li className="text-[#9f9f9f] font-heading text-[10px] uppercase tracking-widest pt-3 pb-0.5">
            SIDE B
          </li>
          {TTPD_TRACKS.slice(3, 5).map((t, i) => {
            const idx = i + 3;
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => loadTrack(idx)}
                  className={`w-full text-left py-2 px-3 text-sm font-heading transition-colors flex items-center gap-2 ${
                    currentIndex === idx
                      ? "bg-[#e8e6e3]/15 text-[#e8e6e3] border-l-2 border-[#e8e6e3]"
                      : "text-[#9f9f9f] hover:text-[#e8e6e3] hover:bg-[#e8e6e3]/5"
                  }`}
                >
                  {currentIndex === idx && (
                    <span className="text-[#e8e6e3] shrink-0" aria-hidden>
                      {playing ? "▌▌" : "▶"}
                    </span>
                  )}
                  {t.title}
                </button>
              </li>
            );
          })}
        </ul>

        <p className="text-[#e8e6e3] font-heading text-sm mb-4 truncate flex items-center gap-2" title={track?.title}>
          {playing && <span className="shrink-0" aria-hidden>►</span>}
          {track?.title}
        </p>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        <div
          role="slider"
          tabIndex={0}
          className="h-1.5 bg-[#9f9f9f]/30 cursor-pointer mb-4"
          onClick={seek}
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (!audio) return;
            if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
            if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
          }}
        >
          <div
            className="h-full bg-[#e8e6e3] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={!hasPrev}
            className="p-2 border border-[#e8e6e3]/40 text-[#e8e6e3] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e8e6e3]/10 transition-colors"
            aria-label="Previous track"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="p-3 border border-[#e8e6e3]/40 text-[#e8e6e3] hover:bg-[#e8e6e3]/10 transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!hasNext}
            className="p-2 border border-[#e8e6e3]/40 text-[#e8e6e3] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e8e6e3]/10 transition-colors"
            aria-label="Next track"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 18V6l8.5 6L6 18zm9 0V6h2v12h-2z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
