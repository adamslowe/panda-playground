import { useState } from "preact/hooks";

// The one hydrated island. Astro renders all 6 ProductCards at build time
// (SSG, prerendered to static HTML); this ~1 KB control is the only component
// that ships JS. It filters by toggling Tailwind's `hidden` class on each card
// wrapper (read via its data-status), rather than re-rendering the grid — so
// the cards stay static HTML and only this bar hydrates (client:visible on the
// catalog page).

type Filter = "all" | "available" | "coming-soon";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "coming-soon", label: "Coming Soon" },
];

export default function CatalogFilter() {
  const [active, setActive] = useState<Filter>("all");

  function applyFilter(filter: Filter) {
    setActive(filter);
    const cards = document.querySelectorAll<HTMLElement>("[data-status]");
    cards.forEach((card) => {
      const status = card.getAttribute("data-status");
      const show = filter === "all" || status === filter;
      card.classList.toggle("hidden", !show);
    });
  }

  return (
    <div class="flex flex-wrap justify-center gap-3 mb-12">
      {FILTERS.map((f) => {
        const isActive = active === f.value;
        return (
          <button
            type="button"
            key={f.value}
            onClick={() => applyFilter(f.value)}
            aria-pressed={isActive}
            class={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${
              isActive
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
