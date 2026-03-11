"use client";

import Image from "next/image";
import { useAudioPlayerOpen } from "@/context/AudioPlayerOpenContext";

type CassetteImageProps = {
  src: string;
  alt: string;
  cassetteLabel: string;
  className?: string;
};

export function CassetteImage({
  src,
  alt,
  cassetteLabel,
  className = "",
}: CassetteImageProps) {
  const { open } = useAudioPlayerOpen();

  return (
    <div className={`flex flex-col items-center gap-4 w-[308px] sm:w-[360px] min-w-[308px] sm:min-w-[360px] shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => open(cassetteLabel)}
        className="play-button min-h-[44px] min-w-[44px] px-5 py-2.5 border border-[#e8e6e3]/50 text-[#e8e6e3] text-sm uppercase tracking-widest hover:bg-[#e8e6e3]/10 hover:border-[#e8e6e3] hover:scale-105 active:bg-[#e8e6e3]/15 transition-all duration-200 font-heading shrink-0 rounded-none flex items-center gap-2"
        aria-label="Play cassette"
      >
        <span className="text-base leading-none" aria-hidden>▶</span>
        <span>Play cassette</span>
      </button>
      {/* 4:3 как у типичного фото кассеты (800×600), object-contain сохраняет пропорции */}
      <div className="relative w-full shrink-0" style={{ aspectRatio: "4/3" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 308px, 360px"
        />
      </div>
    </div>
  );
}
