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
      className="section flex items-center justify-center min-h-screen pl-6 pr-4 sm:pl-8 sm:pr-6 py-16 sm:py-20 md:py-24 md:pl-10 md:pr-8 lg:py-28 lg:pl-12 lg:pr-24"
    >
      <div className="w-full max-w-[1280px] mx-auto min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(0,280px)_minmax(0,400px)_minmax(0,240px)] gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center md:items-start lg:items-center">
          <div className="order-1 text-left min-w-0 md:max-w-[90%] lg:max-w-[320px] lg:justify-self-end">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-heading text-[#f2f2f2] uppercase tracking-wider mb-4 sm:mb-6 max-w-[20ch] leading-tight">
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
            <div className="text-[#c8c8c8] font-serif text-sm sm:text-base md:text-base lg:text-lg leading-relaxed">
              {description}
            </div>
          </div>

          <div className="order-2 flex flex-col items-center justify-center gap-4 sm:gap-6 min-w-0 md:w-full md:max-w-[380px] md:justify-self-center lg:max-w-[400px]">
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
