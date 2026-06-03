// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    // Placeholder canonical origin for SEO (canonical + OG URLs). Demo value;
    // swap for the real domain at deploy time.
    site: "https://pandaplay.peakperformancesites.com",

    vite: {
        plugins: [tailwindcss()],
    },
    // Make every <Image> responsive by default: `constrained` generates a
    // srcset of multiple widths + a sizes attribute, so the browser downloads
    // the right dimensions per viewport (genuinely optimized, not just converted
    // to webp). responsiveStyles is intentionally OFF: its injected aspect-ratio
    // CSS overrides our fixed-height `object-cover` containers (gallery/cards);
    // we drive sizing with Tailwind h-full/object-cover instead.
    image: {
        layout: "constrained",
    },

    integrations: [preact()],

    // Node adapter for the one on-demand /quote route. output stays the default
    // 'static' — Astro prerenders every page unless a route opts out with
    // `export const prerender = false`. Adding the adapter does not make the
    // whole site SSR.
    adapter: node({ mode: "standalone" }),

    // Astro Fonts API — self-hosted, optimized. Replaces the source's Google
    // Fonts CDN @import. Stable, top-level `fonts` key in Astro 6 (graduated
    // from experimental). The cssVariables are mapped to Tailwind's font-sans /
    // font-display tokens via @theme inline in src/styles/global.css.
    fonts: [
        {
            provider: fontProviders.google(),
            name: "Nunito Sans",
            cssVariable: "--font-nunito-sans",
            weights: [200, 300, 400, 600, 700, 800, 900],
            fallbacks: ["sans-serif"],
        },
        {
            provider: fontProviders.google(),
            name: "Quicksand",
            cssVariable: "--font-quicksand",
            weights: [300, 400, 500, 600, 700],
            fallbacks: ["sans-serif"],
        },
    ],
});
