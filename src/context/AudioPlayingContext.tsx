"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AudioPlayingContextType = {
  isPlaying: boolean;
  setPlaying: (v: boolean) => void;
};

const AudioPlayingContext = createContext<AudioPlayingContextType>({
  isPlaying: false,
  setPlaying: () => {},
});

export function AudioPlayingProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setPlaying] = useState(false);
  return (
    <AudioPlayingContext.Provider value={{ isPlaying, setPlaying: useCallback(setPlaying, []) }}>
      {children}
    </AudioPlayingContext.Provider>
  );
}

export function useAudioPlaying() {
  return useContext(AudioPlayingContext).isPlaying;
}

export function useSetAudioPlaying() {
  return useContext(AudioPlayingContext).setPlaying;
}
