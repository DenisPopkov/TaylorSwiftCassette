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
      className="section flex items-center xl:items-start justify-center min-h-screen px-4 sm:px-8 pt-20 sm:pt-24 md:pt-24 lg:pt-24 xl:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-24 lg:px-16 xl:px-24"
    >
      <div className="w-full max-w-[1100px] mx-auto min-w-0 flex justify-center items-center xl:items-start">
        <div className="grid grid-cols-1 xl:grid-cols-[240px_360px_240px] gap-5 sm:gap-8 xl:gap-12 items-center xl:items-start w-full xl:w-[936px] xl:max-w-none xl:shrink-0 xl:mx-auto">
          <div className="order-1 text-center xl:text-left min-w-0 xl:max-w-[280px] xl:justify-self-end">
            <h2 className="text-lg sm:text-2xl md:text-2xl lg:text-3xl font-heading text-[#f2f2f2] uppercase tracking-[0.2em] mb-3 sm:mb-6 max-w-[20ch] leading-tight mx-auto xl:mx-0">
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
            <div className="text-[#c8c8c8]/90 font-serif text-sm sm:text-lg md:text-lg lg:text-lg leading-[1.7]">
              {description}
            </div>
          </div>

          <div className="order-2 flex flex-col items-center justify-center gap-3 sm:gap-6 w-full max-w-[240px] sm:max-w-[308px] xl:max-w-[360px] min-w-0 sm:w-[308px] xl:w-[360px] shrink-0 xl:min-w-[360px] mx-auto">
            <CassetteImage
              src={imageSrc}
              alt={cassetteLabel}
              cassetteLabel={cassetteLabel}
              variant={cassetteVariant}
            />
          </div>

          <div className="order-3 hidden xl:flex flex-col text-center md:text-left w-full min-w-0 xl:max-w-[240px] xl:w-auto xl:justify-self-start pt-6 sm:pt-10 md:pt-12 xl:pt-0 border-t xl:border-t-0 border-[#e8e6e3]/15 xl:border-l xl:pl-6">
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
