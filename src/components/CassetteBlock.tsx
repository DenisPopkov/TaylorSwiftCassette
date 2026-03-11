"use client";

import { CassetteImage } from "./CassetteImage";
import { CASSETTE_IMAGES } from "@/lib/cassetteImages";

type SpecItem = { label: string; value: string };

type CassetteBlockProps = {
  id: string;
  title: string;
  description: string | React.ReactNode;
  specs: SpecItem[];
  cassetteVariant: "type-i" | "type-ii" | "type-iii" | "type-iv" | "original";
  cassetteLabel: string;
  size?: "normal" | "large";
};

export function CassetteBlock({
  id,
  title,
  description,
  specs,
  cassetteVariant,
  cassetteLabel,
  size = "normal",
}: CassetteBlockProps) {
  const imageSrc = CASSETTE_IMAGES[cassetteVariant] || CASSETTE_IMAGES["type-i"];
  const titleParts = title.includes(" – ") ? title.split(" – ") : null;

  return (
    <section
      id={id}
      data-section={id}
      className="section flex items-center justify-center min-h-screen px-6 sm:px-8 py-16 sm:py-20 md:py-24 lg:py-28 lg:px-24"
    >
      <div className="w-full max-w-[1280px] mx-auto min-w-0 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,280px)_360px_minmax(0,240px)] gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center md:items-start lg:items-center w-full lg:w-max lg:max-w-full">
          <div className="order-1 text-left min-w-0 md:max-w-[90%] lg:max-w-[320px] lg:justify-self-end">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-heading text-[#f2f2f2] uppercase tracking-[0.2em] mb-4 sm:mb-6 max-w-[20ch] leading-tight">
              {titleParts ? (
                <>
                  {titleParts[0]}
                  <span className="title-dash"> – </span>
                  {titleParts[1]}
                </>
              ) : (
                title
              )}
            </h2>
            <div className="text-[#c8c8c8]/90 font-serif text-base sm:text-lg md:text-lg lg:text-lg leading-[1.7]">
              {description}
            </div>
          </div>

          <div className="order-2 flex flex-col items-center justify-center gap-4 sm:gap-6 w-[308px] sm:w-[360px] min-w-[308px] sm:min-w-[360px] shrink-0 md:justify-self-center md:min-w-[360px]">
            <CassetteImage
              src={imageSrc}
              alt={cassetteLabel}
              cassetteLabel={cassetteLabel}
            />
          </div>

          <div className="order-3 flex flex-col text-left w-full min-w-0 lg:max-w-[240px] lg:w-auto lg:justify-self-start pt-8 sm:pt-10 md:pt-12 lg:pt-0 border-t lg:border-t-0 border-[#e8e6e3]/15 lg:border-l lg:pl-6">
            <p className="text-[#9f9f9f] text-xs uppercase tracking-widest mb-2">
              Experiment
            </p>
            <p className="text-[#e0e0e0] font-serif text-sm leading-snug">
              Same deck and source for all tapes. Compare with Play above.
            </p>
            <p className="text-[#9f9f9f] text-xs uppercase tracking-widest mt-4 mb-1">
              Format
            </p>
            <p className="text-[#e0e0e0] font-serif text-sm">
              Compact Cassette
            </p>
            <p className="text-[#9f9f9f] text-xs uppercase tracking-widest mt-4 mb-1">
              Source
            </p>
            <p className="text-[#e0e0e0] font-serif text-sm">
              TTPD · Taylor Swift
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
