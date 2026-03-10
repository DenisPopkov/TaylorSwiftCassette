"use client";

import { useEffect, useRef } from "react";
import { CassetteBlock } from "@/components/CassetteBlock";

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
              start: "top 80%",
              end: "top 20%",
              scrub: 0.5,
            },
            opacity: 0.6,
            y: 40,
            duration: 0.8,
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
      className="container-snap"
    >
      {/* Block 0 — Intro */}
      <section
        id="intro"
        data-section="intro"
        className="section flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 md:py-24"
      >
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-[#e8e6e3] uppercase tracking-wider mb-6 sm:mb-8">
            Cassette Recording Experiment
          </h1>
          <p className="text-[#c8c8c8] font-serif text-sm sm:text-base md:text-lg leading-relaxed mb-6">
            This project explores how the album The Tortured Poets Department sounds
            when recorded onto different cassette tape types. Each section presents a different
            tape formulation and its sonic characteristics.
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
    </main>
  );
}
