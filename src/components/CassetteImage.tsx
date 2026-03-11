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
      className={`flex flex-col items-center gap-4 shrink-0 w-[308px] sm:w-[360px] min-w-0 ${className}`}
    >
      <button
        type="button"
        data-play-cassette={cassetteLabel}
        onClick={() => open(cassetteLabel)}
        className="play-button min-h-[44px] min-w-[44px] px-5 py-2.5 border border-[#e8e6e3]/50 text-[#e8e6e3] text-sm uppercase tracking-widest hover:bg-[#e8e6e3]/10 hover:border-[#e8e6e3] hover:scale-105 active:bg-[#e8e6e3]/15 transition-all duration-200 font-heading shrink-0 rounded-none flex items-center gap-2"
        aria-label="Play cassette"
      >
        <span className="text-base leading-none" aria-hidden>▶</span>
        <span>Play cassette</span>
      </button>
      {/* Единый квадратный контейнер. Type I–IV увеличены на 50%, Original — базовый размер. */}
      <div
        className="relative w-[308px] h-[308px] sm:w-[360px] sm:h-[360px] shrink-0 overflow-hidden"
        style={
          variant === "type-i" ||
          variant === "type-ii" ||
          variant === "type-iii" ||
          variant === "type-iv"
            ? { transform: "scale(1.5)" }
            : undefined
        }
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
