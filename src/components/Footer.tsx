"use client";

export function Footer() {
  return (
    <footer
      id="footer"
      data-section="footer"
      className="section flex items-center justify-center px-6 py-24 bg-[#0b0b0b]"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-heading text-[#e8e6e3] uppercase tracking-wider mb-8">
          Cassette Experiment
        </h2>
        <dl className="space-y-2 text-left inline-block">
          <div>
            <dt className="text-[#9f9f9f] text-xs uppercase">Album</dt>
            <dd className="text-[#e8e6e3] font-heading">The Tortured Poets Department</dd>
          </div>
          <div>
            <dt className="text-[#9f9f9f] text-xs uppercase">Artist</dt>
            <dd className="text-[#e8e6e3] font-heading">Taylor Swift</dd>
          </div>
          <div>
            <dt className="text-[#9f9f9f] text-xs uppercase">Year</dt>
            <dd className="text-[#e8e6e3] font-heading">2024</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
