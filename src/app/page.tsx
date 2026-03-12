"use client";

import { useEffect, useRef } from "react";
import { CassetteBlock } from "@/components/CassetteBlock";
import { ComparisonBlock } from "@/components/ComparisonBlock";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let kill: (() => void) | undefined;
    import("gsap").then(({ default: gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const sections = container.querySelectorAll<HTMLElement>("[data-section]");
        sections.forEach((section) => {
          gsap.from(section, {
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 25%",
              scrub: 0.4,
            },
            y: 24,
            duration: 0.6,
          });
        });
        kill = () => ScrollTrigger.getAll().forEach((t) => t.kill());
      })
    );
    return () => {
      cancelled = true;
      kill?.();
    };
  }, []);

  return (
    <main
      id="scroll-container"
      ref={containerRef}
      className="container-snap w-full px-4 sm:px-6 lg:px-8 xl:px-24 z-0 relative"
    >
      {/* Block 0 — Intro */}
      <section
        id="intro"
        data-section="intro"
        className="section flex flex-col items-center justify-center pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24"
      >
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-[#e8e6e3] uppercase tracking-wider mb-6 sm:mb-8">
            Cassette Recording Experiment
          </h1>
          <p className="text-[#c8c8c8] font-serif text-base sm:text-lg leading-[1.7] mb-10 text-center">
            This project explores how &ldquo;The Tortured Poets Department&rdquo; sounds when
            recorded onto different cassette tape formulations.
          </p>
          <p className="text-[#c8c8c8]/90 font-serif text-base sm:text-lg leading-[1.7] mb-12 text-center">
            Each section represents a different tape type used in the experiment.
          </p>
        </div>
      </section>

      {/* Block 1 — Type I */}
      <CassetteBlock
        id="type-i"
        title="Type I – Ferric"
        description={
          <>
            Ferric (Type I) tape: warm, classic sound with noticeable hiss and medium frequency
            response. The most common formulation; good baseline for comparison.
          </>
        }
        specs={[
          { label: "Type", value: "Ferric" },
          { label: "Bias", value: "Normal" },
          { label: "Noise level", value: "High" },
          { label: "Frequency response", value: "Medium" },
        ]}
        cassetteVariant="type-i"
        cassetteLabel="Type I"
      />

      {/* Block 2 — Type II */}
      <CassetteBlock
        id="type-ii"
        title="Type II – Chrome"
        description={
          <>
            Chrome (Type II) tape: improved high-frequency response and lower noise than Type I.
            Brighter, cleaner top end while keeping body.
          </>
        }
        specs={[
          { label: "Type", value: "Chrome" },
          { label: "Bias", value: "High" },
          { label: "Noise level", value: "Medium" },
          { label: "Frequency response", value: "Wide" },
        ]}
        cassetteVariant="type-ii"
        cassetteLabel="Type II"
      />

      {/* Block 3 — Type III */}
      <CassetteBlock
        id="type-iii"
        title="Type III – Ferro-Chrome"
        description={
          <>
            Ferro-chrome (Type III) hybrid: combines ferric and chrome layers. Less common;
            distinct character between warm lows and extended highs.
          </>
        }
        specs={[
          { label: "Type", value: "Ferro-Chrome" },
          { label: "Bias", value: "Hybrid" },
          { label: "Noise level", value: "Medium" },
          { label: "Frequency response", value: "Extended" },
        ]}
        cassetteVariant="type-iii"
        cassetteLabel="Type III"
      />

      {/* Block 4 — Type IV */}
      <CassetteBlock
        id="type-iv"
        title="Type IV – Metal"
        description={
          <>
            Metal (Type IV) tape: maximum detail and dynamic range. Best high-frequency extension
            and lowest noise; the reference formulation in this experiment.
          </>
        }
        specs={[
          { label: "Type", value: "Metal" },
          { label: "Bias", value: "Metal" },
          { label: "Noise level", value: "Low" },
          { label: "Frequency response", value: "Maximum" },
        ]}
        cassetteVariant="type-iv"
        cassetteLabel="Type IV"
      />

      {/* Block 5 — Original */}
      <CassetteBlock
        id="original"
        title="Official Cassette"
        description={
          <>
            The official Taylor Swift cassette release of The Tortured Poets Department.
          </>
        }
        specs={[
          { label: "Album", value: "TTPD" },
          { label: "Artist", value: "Taylor Swift" },
        ]}
        cassetteVariant="original"
        cassetteLabel="Original"
      />

      {/* Compare: switch formulations without losing playback position */}
      <ComparisonBlock />
    </main>
  );
}
