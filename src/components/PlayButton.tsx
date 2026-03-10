"use client";

import { useState } from "react";
import { AudioPlayer } from "./AudioPlayer";

export function PlayButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-8 z-40 px-4 py-2 border border-[#e8e6e3]/40 text-[#e8e6e3] text-sm uppercase tracking-widest hover:bg-[#e8e6e3]/10 transition-colors font-heading"
        aria-label="Play cassette recording"
      >
        Play Cassette Recording
      </button>
      {isOpen && (
        <AudioPlayer onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
