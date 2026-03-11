"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSetAudioPlaying } from "@/context/AudioPlayingContext";
import { TTPD_TRACKS } from "@/lib/ttpdTracks";
import {
  COMPARISON_FORMULATIONS,
  getComparisonSrc,
  type FormulationId,
} from "@/lib/comparisonSources";
import { CASSETTE_IMAGES } from "@/lib/cassetteImages";
import { AudioAnalysisPanel } from "@/components/AudioAnalysisPanel";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ComparisonBlock() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [formulation, setFormulation] = useState<FormulationId>("type-i");
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const wasPlayingRef = useRef(false);
  const seekTimeRef = useRef<number | null>(null);
  const setGlobalPlaying = useSetAudioPlaying();

  const track = TTPD_TRACKS[trackIndex];

  useEffect(() => {
    setGlobalPlaying(playing);
    return () => setGlobalPlaying(false);
  }, [playing, setGlobalPlaying]);
  const hasPrev = trackIndex > 0;
  const hasNext = trackIndex < TTPD_TRACKS.length - 1;

  const loadSource = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const src = getComparisonSrc(trackIndex, formulation);
    if (audio.src?.endsWith(src)) return;
    wasPlayingRef.current = playing;
    seekTimeRef.current = audio.currentTime;
    audio.src = src;
    audio.load();
  }, [trackIndex, formulation, playing]);

  useEffect(() => {
    loadSource();
  }, [loadSource]);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = seekTimeRef.current;
    if (t != null) {
      audio.currentTime = Math.min(t, audio.duration || 0);
      seekTimeRef.current = null;
    }
    setDuration(audio.duration || 0);
    setCurrentTime(audio.currentTime);
    setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    if (wasPlayingRef.current) {
      audio.play().catch(() => {});
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const d = audio.duration;
    setCurrentTime(audio.currentTime);
    setProgress(d ? (audio.currentTime / d) * 100 : 0);
  }, []);

  const onDurationChange = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration || 0);
  }, []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (trackIndex < TTPD_TRACKS.length - 1) {
      seekTimeRef.current = 0;
      wasPlayingRef.current = true;
      setTrackIndex((i) => i + 1);
    }
  }, [trackIndex]);

  const switchFormulation = useCallback((next: FormulationId) => {
    if (next === formulation) return;
    const audio = audioRef.current;
    if (audio) {
      wasPlayingRef.current = playing;
      seekTimeRef.current = audio.currentTime;
    }
    setFormulation(next);
  }, [formulation, playing]);

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
    seekTimeRef.current = 0;
    wasPlayingRef.current = true;
    setTrackIndex((i) => i - 1);
    setProgress(0);
    setCurrentTime(0);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    seekTimeRef.current = 0;
    wasPlayingRef.current = true;
    setTrackIndex((i) => i + 1);
    setProgress(0);
    setCurrentTime(0);
  }, [hasNext]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const time = x * (audio.duration || 0);
    audio.currentTime = time;
    setCurrentTime(time);
    setProgress(audio.duration ? x * 100 : 0);
  }, []);

  const selectTrack = useCallback((index: number) => {
    seekTimeRef.current = 0;
    wasPlayingRef.current = true;
    setTrackIndex(index);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  return (
    <section
      id="compare"
      data-section="compare"
      className="section flex flex-col items-center justify-center min-h-screen py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-24"
    >
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-[#e8e6e3] uppercase tracking-wider text-center mb-4">
          Cassette Comparison
        </h2>
        <p className="text-[#c8c8c8] font-serif text-base sm:text-lg leading-[1.7] text-center mb-2">
          Listen to the same recording across different cassette formulations.
        </p>
        <p className="text-[#c8c8c8]/90 font-serif text-base sm:text-lg leading-[1.7] text-center mb-10">
          Switch between tape types to hear the difference instantly.
        </p>

        {/* Source: formulation buttons */}
        <p className="text-[#9f9f9f] font-heading text-xs uppercase tracking-widest mb-3">
          Source
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {COMPARISON_FORMULATIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchFormulation(id)}
              className={`min-h-[44px] px-4 py-2 border font-heading text-xs uppercase tracking-widest transition-all ${
                formulation === id
                  ? "border-[#e8e6e3] bg-[#e8e6e3]/15 text-[#e8e6e3] scale-105"
                  : "border-[#e8e6e3]/40 text-[#9f9f9f] hover:border-[#e8e6e3]/60 hover:text-[#e8e6e3]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Optional: 5 cassette thumbnails */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
          {COMPARISON_FORMULATIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => switchFormulation(id)}
              className={`flex flex-col items-center gap-1 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8e6e3] ${
                formulation === id ? "scale-110" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Play ${label}`}
            >
              <img
                src={CASSETTE_IMAGES[id] ?? CASSETTE_IMAGES["type-i"]}
                alt=""
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain pointer-events-none"
              />
              <span className="text-[10px] sm:text-xs font-heading uppercase tracking-wider text-[#9f9f9f]">
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Track */}
        <p className="text-[#9f9f9f] font-heading text-xs uppercase tracking-widest mb-2">
          Track
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {TTPD_TRACKS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTrack(i)}
              className={`px-3 py-2 font-heading text-sm transition-colors ${
                trackIndex === i
                  ? "bg-[#e8e6e3]/15 text-[#e8e6e3] border border-[#e8e6e3]/40"
                  : "text-[#9f9f9f] hover:text-[#e8e6e3] border border-transparent"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        <p className="text-[#e8e6e3] font-heading text-sm mb-3 truncate">
          {track?.title}
        </p>

        <audio
          ref={audioRef}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          onEnded={onEnded}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
        />

        <div
          role="slider"
          tabIndex={0}
          className="h-1.5 bg-[#9f9f9f]/30 cursor-pointer mb-2"
          onClick={seek}
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (!audio) return;
            if (e.key === "ArrowLeft")
              audio.currentTime = Math.max(0, audio.currentTime - 5);
            if (e.key === "ArrowRight")
              audio.currentTime = Math.min(
                audio.duration || 0,
                audio.currentTime + 5
              );
          }}
        >
          <div
            className="h-full bg-[#e8e6e3] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[#9f9f9f] font-heading text-xs mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
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

        <div className="mt-8 pt-6 border-t border-[#e8e6e3]/15">
          <button
            type="button"
            onClick={() => setShowAnalysis((v) => !v)}
            className="w-full min-h-[48px] border border-[#e8e6e3]/40 font-heading text-xs uppercase tracking-widest text-[#9f9f9f] hover:text-[#e8e6e3] hover:border-[#e8e6e3]/60 transition-colors"
          >
            {showAnalysis ? "Hide audio analysis" : "Show audio analysis"}
          </button>
        </div>

        {showAnalysis && (
          <AudioAnalysisPanel
            trackIndex={trackIndex}
            formulation={formulation}
            trackTitle={track?.title ?? ""}
            isOpen={showAnalysis}
          />
        )}
      </div>
    </section>
  );
}
