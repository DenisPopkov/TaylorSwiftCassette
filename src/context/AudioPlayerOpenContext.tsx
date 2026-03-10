"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AudioPlayerOpenContextType = {
  isOpen: boolean;
  cassetteLabel: string | null;
  open: (label?: string) => void;
  close: () => void;
};

const AudioPlayerOpenContext = createContext<AudioPlayerOpenContextType>({
  isOpen: false,
  cassetteLabel: null,
  open: () => {},
  close: () => {},
});

export function AudioPlayerOpenProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cassetteLabel, setCassetteLabel] = useState<string | null>(null);

  const open = useCallback((label?: string) => {
    if (label) {
      setCassetteLabel(label);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AudioPlayerOpenContext.Provider value={{ isOpen, cassetteLabel, open, close }}>
      {children}
    </AudioPlayerOpenContext.Provider>
  );
}

export function useAudioPlayerOpen() {
  return useContext(AudioPlayerOpenContext);
}
