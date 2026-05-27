# PandaPlay — an idiomatic Astro 6 demo

A small marketing site (panda-playground company) rebuilt from a static HTML
original into idiomatic Astro 6. It exists to be *read* during a live talk: every
flagship Astro feature is used the way the docs intend, so the code itself is the
teaching material.

The original static site lives in [`htmlsite/`](./htmlsite/) and is kept as the
visual reference to demo against.

## What the demo shows

| Astro feature | Where to point in the code |
| :--- | :--- |
| **Layouts + nesting** | `src/layouts/BaseLayout.astro` (html/head/body, SEO, fonts, shared script); `ProductLayout.astro` *nests* BaseLayout |
| **Component decomposition** | `src/components/` — `Button`, `Badge`, `ProductCard`, `FeatureCard`, `StatCard`, `SectionHeading`, `Seo`, `Nav`, `Footer`, and `icons/*` (no copy-pasted markup) |
| **Content Collections + dynamic routing** | `src/content.config.ts` (typed Zod schema) drives `src/content/playgrounds/*.md`; `src/pages/playgrounds/[slug].astro` generates detail pages via `getStaticPaths()` |
| **`astro:assets` image optimization** | the ~1 MB JPEGs in `src/assets/playgrounds/` render through `<Image />` and build to resized `.webp` |
| **Tailwind v4 via Vite** | `@tailwindcss/vite` compiles from source; `src/styles/global.css` (`@import "tailwindcss"` + `@theme inline` font tokens) |
| **Fonts API (self-hosted)** | top-level `fonts:` in `astro.config.mjs` (Nunito Sans + Quicksand, Google provider) → `<Font>` in BaseLayout; no Google CDN request |
| **Shared client `<script>`** | one Motion scroll-reveal script in BaseLayout (the `motion` npm dep), loaded once for every page |
| **Dynamic island** | `src/components/CatalogFilter.tsx` — a Preact island hydrated with `client:visible`; it ships JS while the rest of the page stays static HTML |
| **SSG + SSR side-by-side** | every route prerenders (SSG) **except** `src/pages/quote.astro`, which opts into SSR with `export const prerender = false`, served by the `@astrojs/node` adapter |

## Project structure

```text
/
├── htmlsite/                  # the original static site (visual reference)
├── public/                    # favicons
├── src/
│   ├── assets/playgrounds/    # source photos, optimized by astro:assets
│   ├── components/            # prop-driven UI kit + icons/ + CatalogFilter.tsx (island)
│   ├── content/playgrounds/   # 6 collection entries (2 available, 4 coming-soon)
│   ├── content.config.ts      # typed playgrounds collection schema
│   ├── layouts/               # BaseLayout + ProductLayout (nested)
│   ├── pages/                 # /, /catalog, /playgrounds/[slug], /quote (SSR)
│   └── styles/global.css      # Tailwind import + font-token mapping + flicker rule
└── astro.config.mjs           # Tailwind Vite plugin + fonts + Preact + Node adapter
```

## Commands

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Dev server at `localhost:4321` (the `/quote` route is served by Vite here, not the Node adapter) |
| `pnpm build` | Build to `./dist/` — static routes in `dist/client/`, the SSR server in `dist/server/` |
| `pnpm preview` | Preview the built **static** output |
| `pnpm astro check` | Type-check (`astro/tsconfigs/strict`) |

## Running the SSG + SSR demo (the presenter beat)

The static routes build to real `.html` files; `/quote` is computed per request.
To show the contrast on the built output:

```sh
pnpm build
node ./dist/server/entry.mjs    # serves everything at http://localhost:4321
```

Then:

- Open `http://localhost:4321/quote` and **reload** — the timestamp and the
  "N sanctuaries browsing right now" count change every time (server-rendered
  per request). Reach it in the flow via any detail page's **Request a Quote**
  button, which passes `?playground=<name>` and gets echoed back.
- Inspect `dist/`: `/`, `/catalog`, and `/playgrounds/*` are static `.html` files
  in `dist/client/`. There is **no** `dist/client/quote/index.html` — `/quote`
  lives in the `dist/server/` build and is rendered on demand.

> **One Astro process at a time.** `pnpm dev`, `pnpm preview`, and the standalone
> Node server all default to port **4321**. Stop one before starting the next, or
> override with a `PORT` env var: `PORT=8080 node ./dist/server/entry.mjs`.

## Learn more

[Astro documentation](https://docs.astro.build)
