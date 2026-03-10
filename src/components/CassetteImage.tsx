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

  const imageStyle = {
    width: "100%",
    minWidth: 0,
    aspectRatio: "4/3" as const,
  };

  return (
    <div className={`flex flex-col items-center gap-4 w-full max-w-[308px] sm:max-w-[360px] ${className}`}>
      <button
        type="button"
        onClick={() => open(cassetteLabel)}
        className="min-h-[44px] min-w-[44px] px-5 py-2.5 border border-[#e8e6e3]/50 text-[#e8e6e3] text-sm uppercase tracking-widest hover:bg-[#e8e6e3]/10 active:bg-[#e8e6e3]/15 transition-colors font-heading shrink-0 rounded-none"
        aria-label="Play cassette"
      >
        Play
      </button>
      <div className="relative bg-[#0b0b0b] shrink-0 w-full" style={imageStyle}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain drop-shadow-2xl"
          sizes="(max-width: 640px) 277px, (max-width: 768px) 306px, 340px"
        />
      </div>
    </div>
  );
}
