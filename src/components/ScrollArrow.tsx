"use client";

export function ScrollArrow() {
  const scrollNext = () => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    const sections = container.querySelectorAll("[data-section]");
    const current = container.scrollTop;
    const vh = container.clientHeight;
    for (let i = 0; i < sections.length; i++) {
      const el = sections[i] as HTMLElement;
      if (el.offsetTop > current + vh * 0.3) {
        el.scrollIntoView({ behavior: "smooth" });
        break;
      }
    }
  };

  return (
    <button
      type="button"
      onClick={scrollNext}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 text-[#9f9f9f] hover:text-[#e8e6e3] transition-colors animate-bounce"
      aria-label="Scroll to next section"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </button>
  );
}
