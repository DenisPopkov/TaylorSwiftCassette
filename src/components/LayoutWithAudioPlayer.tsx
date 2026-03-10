"use client";

import { useAudioPlayerOpen } from "@/context/AudioPlayerOpenContext";
import { AudioPlayer } from "./AudioPlayer";

export function LayoutWithAudioPlayer({ children }: { children: React.ReactNode }) {
  const { isOpen, cassetteLabel, close } = useAudioPlayerOpen();
  return (
    <>
      {children}
      {isOpen && <AudioPlayer onClose={close} cassetteLabel={cassetteLabel ?? undefined} />}
    </>
  );
}
