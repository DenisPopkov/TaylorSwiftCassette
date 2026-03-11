"use client";

import { useEffect, useState, useRef } from "react";

const SECTIONS = [
  { id: "intro", label: "INTRO" },
  { id: "type-i", label: "TYPE I" },
  { id: "type-ii", label: "TYPE II" },
  { id: "type-iii", label: "TYPE III" },
  { id: "type-iv", label: "TYPE IV" },
  { id: "original", label: "ORIGINAL" },
  { id: "compare", label: "COMPARE" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  const container = document.getElementById("scroll-container");
  if (!el || !container) return;
  const cont = container as HTMLElement;
  const rect = el.getBoundingClientRect();
  const contRect = cont.getBoundingClientRect();
  const targetScrollTop = cont.scrollTop + (rect.top - contRect.top);
  cont.scrollTo({ top: targetScrollTop, behavior: "smooth" });
}

export function PageNav() {
  const [activeId, setActiveId] = useState("intro");
  const lastActiveRef = useRef("intro");

  // Клики по нав-кнопкам (nav теперь после main в DOM — клики доходят)
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-goto]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const id = (el as HTMLElement).getAttribute("data-goto");
      if (id) scrollToSection(id);
    };
    document.addEventListener("click", handle, true);
    return () => document.removeEventListener("click", handle, true);
  }, []);

  // Скролл: подписка на #scroll-container с повторными попытками и по load/DOMContentLoaded
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let raf = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function run(container: HTMLElement) {
      const handleScroll = () => {
        raf = requestAnimationFrame(() => {
          const sections = container.querySelectorAll<HTMLElement>("[data-section]");
          if (!sections.length) return;
          const contRect = container.getBoundingClientRect();
          const centerY = contRect.top + contRect.height / 2;
          let current = sections[0].dataset.section ?? "intro";
          for (let i = 0; i < sections.length; i++) {
            const el = sections[i];
            const rect = el.getBoundingClientRect();
            if (rect.top <= centerY) current = el.dataset.section ?? current;
          }
          if (current !== lastActiveRef.current) {
            lastActiveRef.current = current;
            setActiveId(current);
          }
        });
      };
      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => {
        cancelAnimationFrame(raf);
        container.removeEventListener("scroll", handleScroll);
      };
    }

    function tryAttach() {
      const container = document.getElementById("scroll-container");
      if (container && !cleanup) {
        cleanup = run(container);
        timeouts.forEach(clearTimeout);
        timeouts.length = 0;
      }
    }

    tryAttach();
    timeouts.push(setTimeout(tryAttach, 50));
    timeouts.push(setTimeout(tryAttach, 200));
    timeouts.push(setTimeout(tryAttach, 500));
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") tryAttach();
      else window.addEventListener("load", tryAttach);
      document.readyState !== "loading" && tryAttach();
      document.addEventListener("DOMContentLoaded", tryAttach);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", tryAttach);
        document.removeEventListener("DOMContentLoaded", tryAttach);
      }
      cleanup?.();
    };
  }, []);

  const navItems = SECTIONS.filter((s) => s.label);

  const navButton = (id: string, label: string) => {
    const isActive = activeId === id;
    const btnClass =
      "font-heading text-xs uppercase tracking-widest transition-colors duration-300 hover:text-[#e8e6e3] min-h-[44px] min-w-[44px] w-full flex items-center justify-center lg:justify-end cursor-pointer py-2 px-3 text-left lg:text-right select-none border-b border-transparent " +
      (isActive ? "text-[#e8e6e3] border-[#e8e6e3]" : "text-[#9f9f9f]");
    return (
      <li key={id} className="list-none">
        <button
          type="button"
          data-goto={id}
          onClick={() => scrollToSection(id)}
          className={btnClass}
          aria-current={isActive ? "true" : undefined}
        >
          {label}
        </button>
      </li>
    );
  };

  return (
    <div
      className="fixed inset-y-0 right-0 w-[180px] z-[9999] pointer-events-none"
      aria-hidden
    >
      <nav
        className="fixed top-1/2 right-0 min-w-[140px] pl-4 pr-6 py-2 -translate-y-1/2 pointer-events-auto"
        aria-label="Section navigation"
      >
        <ul className="space-y-0 text-right">
          {navItems.map(({ id, label }) => navButton(id, label))}
        </ul>
      </nav>
      <nav
        className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0b0b0b]/95 backdrop-blur-sm border-t border-[#e8e6e3]/10 pointer-events-auto"
        aria-label="Section navigation"
      >
        <ul className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto px-3 py-3 scrollbar-hide">
          {navItems.map(({ id, label }) => navButton(id, label))}
        </ul>
      </nav>
    </div>
  );
}
