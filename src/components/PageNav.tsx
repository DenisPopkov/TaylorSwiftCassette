"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "intro", label: "INTRO" },
  { id: "type-i", label: "TYPE I" },
  { id: "type-ii", label: "TYPE II" },
  { id: "type-iii", label: "TYPE III" },
  { id: "type-iv", label: "TYPE IV" },
  { id: "original", label: "ORIGINAL" },
];

export function PageNav() {
  const [activeId, setActiveId] = useState("intro");

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;

    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      const scrollTop = container.scrollTop;
      const viewportHalf = container.clientHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i] as HTMLElement;
        const top = el.offsetTop;
        if (scrollTop >= top - viewportHalf) {
          setActiveId(el.dataset.section || "intro");
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    const container = document.getElementById("scroll-container");
    if (el && container) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = SECTIONS.filter((s) => s.label);
  const navButton = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => goTo(id)}
      className={`font-heading text-xs uppercase tracking-widest transition-colors duration-300 hover:text-[#e8e6e3] min-h-[44px] min-w-[44px] flex items-center justify-center ${
        activeId === id ? "text-[#e8e6e3]" : "text-[#9f9f9f]"
      }`}
      aria-current={activeId === id ? "true" : undefined}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Desktop: vertical nav on the right */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
        aria-label="Section navigation"
      >
        <ul className="space-y-2 text-right">
          {navItems.map(({ id, label }) => (
            <li key={id}>{navButton(id, label)}</li>
          ))}
        </ul>
      </nav>
      {/* Mobile & tablet: horizontal nav at bottom */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0b0b0b]/95 backdrop-blur-sm border-t border-[#e8e6e3]/10"
        aria-label="Section navigation"
      >
        <ul className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto px-3 py-3 scrollbar-hide">
          {navItems.map(({ id, label }) => (
            <li key={id} className="shrink-0">
              {navButton(id, label)}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
