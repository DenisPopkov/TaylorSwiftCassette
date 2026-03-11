"use client";

import Image from "next/image";
import { useAudioPlayerOpen } from "@/context/AudioPlayerOpenContext";

type CassetteVariant = "type-i" | "type-ii" | "type-iii" | "type-iv" | "original";

type CassetteImageProps = {
  src: string;
  alt: string;
  cassetteLabel: string;
  variant?: CassetteVariant;
  className?: string;
};

export function CassetteImage({
  src,
  alt,
  cassetteLabel,
  variant,
  className = "",
}: CassetteImageProps) {
  const { open } = useAudioPlayerOpen();

  return (
    <div
      className={`flex flex-col items-center gap-3 sm:gap-4 shrink-0 w-full max-w-[240px] sm:max-w-[308px] md:max-w-[360px] min-w-0 sm:w-[308px] md:w-[360px] ${className}`}
    >
      <button
        type="button"
        data-play-cassette={cassetteLabel}
        onClick={() => open(cassetteLabel)}
        className="play-button min-h-[44px] min-w-[44px] px-5 py-2.5 border border-[#e8e6e3]/50 text-[#e8e6e3] text-sm uppercase tracking-widest hover:bg-[#e8e6e3]/10 hover:border-[#e8e6e3] hover:scale-105 active:bg-[#e8e6e3]/15 transition-all duration-200 font-heading shrink-0 rounded-none flex items-center gap-2"
        aria-label="Play cassette"
      >
        <svg className="w-4 h-4 shrink-0 text-[#e8e6e3]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Play cassette</span>
      </button>
      {/* Original принудительно уменьшаем (75%), чтобы визуально совпадал с Type I–IV */}
      <div
        className={`relative w-[200px] h-[200px] sm:w-[308px] sm:h-[308px] md:w-[360px] md:h-[360px] shrink-0 overflow-hidden mx-auto ${
          variant === "original" ? "scale-[0.75] origin-center" : ""
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 640px) 308px, 360px"
        />
      </div>
    </div>
  );
}
