"use client";

import { useEffect } from "react";
import { useAudioPlayerOpen } from "@/context/AudioPlayerOpenContext";
import { AudioPlayer } from "./AudioPlayer";

export function LayoutWithAudioPlayer({ children }: { children: React.ReactNode }) {
  const { isOpen, cassetteLabel, close, open } = useAudioPlayerOpen();

  // Кнопки Play и Show audio analysis: нативные listeners на document (capture), чтобы клики срабатывали сразу
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const playEl = target.closest("[data-play-cassette]");
      if (playEl) {
        e.preventDefault();
        e.stopPropagation();
        const label = (playEl as HTMLElement).getAttribute("data-play-cassette");
        if (label) open(label);
        return;
      }
      const analysisEl = target.closest("[data-show-analysis-toggle]");
      if (analysisEl) {
        e.preventDefault();
        e.stopPropagation();
        // Только по click, иначе mousedown+click дают двойной тоггл и кнопка возвращается в «SHOW»
        if (e.type === "click") {
          window.dispatchEvent(new CustomEvent("toggle-audio-analysis"));
        }
      }
    };
    document.addEventListener("mousedown", handle, true);
    document.addEventListener("click", handle, true);
    return () => {
      document.removeEventListener("mousedown", handle, true);
      document.removeEventListener("click", handle, true);
    };
  }, [open]);

  return (
    <>
      {children}
      {isOpen && <AudioPlayer onClose={close} cassetteLabel={cassetteLabel ?? undefined} />}
    </>
  );
}
