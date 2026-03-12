"use client";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[150] bg-[#0b0b0b] py-4 sm:py-6 px-4 sm:px-6 lg:px-8 xl:pl-[10.5rem] xl:pr-[17.25rem]">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        <div className="text-[#e8e6e3] font-heading text-center tracking-wide w-full">
          <div className="text-xs sm:text-sm md:text-base uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-90">
            Taylor Swift
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] mt-0.5 text-[#9f9f9f]">
            The Tortured Poets Department
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 text-[#9f9f9f]">
            Cassette Experiment
          </div>
        </div>
      </div>
    </header>
  );
}
