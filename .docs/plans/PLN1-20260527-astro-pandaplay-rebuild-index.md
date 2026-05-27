# PLN1 - Rebuild PandaPlay static site as an idiomatic Astro demo

**Date:** 2026-05-27
**Status:** Planning
**Tier:** Tier 1
**Type:** Development
**Program:** —
**Governing references:** User intake (this session); Astro 6 docs — Styling/Tailwind, Content Collections, Images (verified 2026-05-27)
**Related:** Live technical presentation on Astro (next day)
**Related documents:** `.docs/standards/PLANNING.md` *(not bootstrapped in this repo — see note below)*

> **Bootstrap note:** This repo has no `.docs/standards/` planning files. The plan was authored against the planning-system skill's bundled standards. Bootstrapping the standards into the repo is optional and out of scope for this plan.

## Objective

Rebuild the 4-page static `htmlsite/` ("PandaPlay") site as an **idiomatic Astro 6 site** that an audience of technical developers will read as a clear, faithful example of how Astro is meant to be used. The rebuild must be visually faithful to the original *and* deliberately showcase Astro's flagship features: layouts/components, the Vite Tailwind v4 integration, type-safe Content Collections with dynamic routing, optimized images via `astro:assets`, and scoped client-side `<script>`.

This is a teaching artifact for a live demo, so **clarity of the Astro patterns matters as much as the visual result.**

## Scope

### In scope

- **Multiple layouts** — a base layout (html/head/body, SEO metadata, global CSS import, fonts, shared client script) plus at least one more-specific layout (e.g. product-detail) that nests inside the base — plus extracted `Nav` and `Footer` components. (Exact layout set finalized at the Approach gate.)
- **SEO metadata** on every page (title, description, and standard meta/social tags), driven by a reusable SEO component wired into the base layout.
- Home page (`/`), catalog page (`/catalog`), and two product detail pages, rebuilt to match `htmlsite/` 1:1 visually.
- A `playgrounds` **content collection** modelling all **6** products (2 available + 4 coming-soon) with a typed Zod schema; the catalog grid and the detail pages are generated from it.
- Dynamic product detail routing via `[slug].astro` + `getStaticPaths()` over the collection (replaces the two hand-written detail HTML files).
- **Tailwind v4** through the official `@tailwindcss/vite` plugin (`astro add tailwind`), compiling from real source; the pre-compiled `htmlsite/tailwind_theme/tailwind.css` is **discarded**.
- **Fonts via the Astro 6 Fonts API** (top-level `fonts:` key, Google provider, self-hosted) for Nunito Sans + Quicksand — replaces the source's Google Fonts CDN `@import`. *(Amended: stable/top-level in 6.3.8, not `experimental.fonts` — see Execution notes.)*
- The 3 source JPEGs moved into `src/assets/` and rendered through `astro:assets` `<Image />` for automatic optimization.
- Scroll-reveal animations preserved using **`motion` as an npm dependency**, loaded from one shared `<script>` in the layout (replaces the per-page CDN import + inline `[data-hide]` opacity script).
- **Dynamic island (demo feature)** — one interactive client island: a catalog filter (All / Available / Coming Soon) built as a **Preact** component hydrated with `client:visible`, demonstrating partial hydration against the otherwise zero-JS pages.
- **SSG + SSR side-by-side (demo feature)** — the marketing/catalog/detail pages stay prerendered (SSG, the default `output: 'static'`); **one** on-demand route (a `/quote` live-status page) opts into SSR via `export const prerender = false`, served by the `@astrojs/node` standalone adapter. Demonstrates per-route rendering mode in a single build.

### Out of scope

- New pages, products, or copy beyond what exists in `htmlsite/`.
- Functional newsletter form and working social links (kept as static markup, as in the original). *(The detail-page "Request a Quote" buttons **are** wired to link to the new `/quote` SSR page — see In scope — but `/quote` is a live-status demo page, not a working quote-submission/form flow.)*
- A 3rd detail page for any "Coming Soon" product (the original has none; their cards render placeholders and a non-linking button).
- Deployment, CI, and accessibility work beyond what the source markup already contains. *(SEO metadata is now **in scope** — see In scope.)*
- Deleting `htmlsite/` — it stays as the reference to demo against. (Per standards: do not delete files the agent did not create without explicit approval.)
- Bootstrapping the planning standards into the repo.

## Context and references

- **Source site:** `htmlsite/` — `index.html`, `catalog.html`, `bamboo-jungle-gym.html`, `roly-poly-slide.html`; `images/{hero_panda,bamboo_jungle_gym,roly_poly_slide}.jpeg`; `tailwind_theme/tailwind.css`.
- **Current Astro app:** Astro `^6.3.8`, default install. Only `src/pages/index.astro` (the starter) and `public/favicon.*`. `astro.config.mjs` is empty; `tsconfig.json` extends `astro/tsconfigs/strict`. Package manager is **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml` present).
- **Styling reality (first-hand):** `tailwind_theme/tailwind.css` is a 2,127-line **compiled Tailwind v4.2.2** dump. It defines `--font-display: 'Quicksand'` (line 417, wired at 1097) and `@import`s Google Fonts *Nunito Sans* + *Quicksand* (line 2). `.delay-100`/`.delay-200` are standard `transition-delay` utilities. `.reveal` and `[data-hide]` have **no CSS rules** in the file — `[data-hide]{opacity:0}` is injected by an inline `<script>` in each page head, and `.reveal` is animated solely by the Motion library.
- **Animation reality (first-hand):** every page ends with `<script type="module">` importing `animate, inView, stagger` from `motion@12.23.26` via jsDelivr CDN and running `inView('.reveal', …)` to fade+slide elements in.
- **Catalog data (first-hand):** 6 products. Available (have photo + detail page): *The Bamboo Jungle Gym* (badge "Bestseller"), *The Roly-Poly Slide*. Coming-soon (SVG icon placeholder, badge "Coming Soon", non-linking button): *Bamboo Forage Maze*, *Cloud Nine Lounger*, *Splash Pad Splashdown*, *Tumble Tower*. The home page's "Featured" section shows only the 2 available products.
- **Detail page structure (first-hand):** both detail pages share an identical layout — eyebrow + title + intro hero, a 2-col "feature + 3 checkmark bullets" block, a 3-up stats row (distinct numbers per product), a "See It In Action" image gallery, and a "Ready to Install" CTA. This regular structure is what makes a single `[slug].astro` template + collection data the right model.
- **Verified current Astro APIs (docs fetched 2026-05-27):**
  - Tailwind: `npx astro add tailwind` installs `@tailwindcss/vite`; `src/styles/global.css` contains `@import "tailwindcss";`, imported from the layout frontmatter.
  - Content Layer: `src/content.config.ts`; `import { defineCollection } from 'astro:content'`; `import { glob } from 'astro/loaders'`; `import { z } from 'astro/zod'`; schema-with-images form `schema: ({ image }) => z.object({ … })`.
  - Images: `import { Image } from 'astro:assets'`; local images imported by relative path from `src/assets/`; collection images validated via the `image()` helper and passed straight to `<Image src=… />`.

## Tier rationale

Tier 1: single, self-contained demo site; no rollback/migration/compatibility risk; one developer, one sitting; the original is a fixed, fully-known reference. It touches several files but they're all new and within one obvious boundary (a fresh `src/` tree), so it remains comprehensible in one plan document. Approach and Delivery are combined per the Tier 1 default.

## Documentation and governance deliverables

- **README.md** — update the stock Astro README to describe PandaPlay: what the demo shows, the project structure (layout/components/collection/assets), and `pnpm dev`/`build`/`preview`. This doubles as the presenter's cheat-sheet.
- No decision log, changelog, or requirements catalog exists in this repo; none required. This plan document is the audit trail.

---

## Intent checkpoint

### Intent / requirements

1. **Visual fidelity** — `/`, `/catalog`, and the two product pages match the corresponding `htmlsite/` pages: same layout, copy, colors, badges, gallery arrangement, stats, CTAs, nav, and footer.
2. **Idiomatic Astro** — the implementation is a *good example*. Specifically it demonstrates, and a reader can point to:
   - **Proper component decomposition** — repeated UI atoms (buttons, badges, cards, stat tiles, section headings, repeated SVG icons) are extracted into small, prop-driven, reusable components rather than inlined or copy-pasted. The demo pages should read as composition of named components, not walls of markup.
   - **More than one layout** — page-level chrome is provided by a base layout shared by every page, *plus* at least one additional, more specific layout (e.g. a product-detail layout) so the demo shows Astro layout composition/nesting rather than a single catch-all layout.
   - component reuse for shared chrome (nav, footer) replacing the copy-pasted nav/footer in all 4 source files;
   - file-based + dynamic routing (`/`, `/catalog`, `/playgrounds/[slug]`);
   - type-safe **Content Collections** driving both the catalog grid and detail pages;
   - the official **Tailwind v4 Vite** integration compiling from source;
   - **`astro:assets`** image optimization on the ~1 MB JPEGs;
   - a single shared client `<script>` (Astro's island/script story) for the Motion reveals.
3. **Faithful behavior** — scroll-reveal animations still fire and are flicker-free on load; available cards link to their detail page; coming-soon cards render the SVG placeholder and a **non-interactive, visibly-disabled** CTA that does not link anywhere (an intentional improvement over the source's dead `href="#"`, making the status meaningful).
4. **Collection-driven throughout** — every product surface (home "Featured Playgrounds", catalog grid, detail pages) reads from the one `playgrounds` collection; no product data is hardcoded in pages. *(Exact query/filter pattern is an Approach-gate decision.)*
5. **SEO metadata** — every page exposes proper SEO metadata (page title, description, and standard meta/social tags) via a reusable SEO component wired into the base layout, so per-page values flow through one prop-driven component rather than ad-hoc `<head>` markup. *(Component shape and exact tag set are an Approach-gate detail.)*
6. **Dynamic island (demo)** — one interactive component (catalog filter) is a Preact island hydrated with a `client:*` directive, so a viewer can see partial hydration: the island ships JS and works interactively while the surrounding page stays static. *(Framework = Preact, feature = catalog filter, directive `client:visible` — confirmed; details at Approach.)*
7. **SSG + SSR side-by-side (demo)** — the site builds with most routes prerendered (SSG) and exactly one route rendered on demand (SSR), coexisting in one build via per-route `prerender = false` + the Node adapter, so a viewer can contrast a static `.html` file with a per-request response. *(Route = `/quote` live-status, adapter = `@astrojs/node` standalone — confirmed; details at Approach.)*
8. **Runs cleanly** — `pnpm build` succeeds with no errors; `pnpm dev` serves every route; pages render correctly in a browser.

### Constraints and non-goals

- **Constraint:** package manager is pnpm; all installs/scripts use pnpm.
- **Constraint:** Vite must stay on **v7** (not v8) — pinned via `pnpm.overrides` so the transitive resolution can't drift. Acceptance verifies the installed Vite major is 7.
- **Constraint:** discard the pre-compiled `tailwind.css`. Tailwind utilities come from the `@tailwindcss/vite` plugin; the two fonts come from the Astro 6 Fonts API (not a CDN `@import`); `global.css` only re-points the `font-sans`/`font-display` theme tokens at the Astro font CSS variables. No verbatim carry-over from the dump.
- **Constraint:** keep `htmlsite/` intact as the reference.
- **Requirement (quality bar):** reveal animations are flicker-free on first paint — elements do not flash visible before animating in. *(Mechanism — CSS rule vs. inline script — is an Approach-gate decision.)*
- **Non-goal:** no redesign, no new content, no working forms/links, no extra accessibility/perf work beyond what's inherent to the chosen Astro features. *(SEO metadata is in scope per Req 5; deeper SEO like sitemaps/robots/structured data is not.)*
- **Non-goal:** no third coming-soon detail page.

### Acceptance criteria

- AC1 — `pnpm build` exits 0 with no errors; `pnpm dev` boots and serves `/`, `/catalog`, `/playgrounds/bamboo-jungle-gym`, `/playgrounds/roly-poly-slide` without console errors.
- AC2 — Each of the 4 routes is visually faithful to its `htmlsite/` counterpart (nav, hero, sections, cards, badges, stats, galleries, CTAs, footer), confirmed by browser screenshots.
- AC3 — Nav and footer are single shared components used by all pages (no duplicated nav/footer markup across pages).
- AC3b — **Component decomposition:** repeated UI atoms (at minimum buttons, badges, product cards, feature cards, stat tiles, and repeated SVG icons) exist as discrete reusable components driven by props; no page re-inlines these. Exact component list is finalized at the Approach gate.
- AC3c — **Multiple layouts:** the site uses a base layout for all pages plus at least one additional more-specific layout (e.g. product-detail); at least one layout component imports and renders the base layout, and at least one page uses that nested layout. Exact layout set is finalized at the Approach gate.
- AC9 — Each page renders its source `<title>` verbatim: "PandaPlay - Build a Paradise for Pandas" (`/`), "PandaPlay - Playground Catalog" (`/catalog`), "PandaPlay - The Bamboo Jungle Gym" and "PandaPlay - The Roly-Poly Slide" (detail pages, title from collection data).
- AC10 — Per-product detail-page eyebrow (label text + color) is collection-driven, not hardcoded: Bamboo Jungle Gym shows green "Bestseller", Roly-Poly Slide shows pink "Featured Playground".
- AC4 — All 6 products live in the `playgrounds` content collection with a typed schema; the catalog grid and both detail pages are rendered from `getCollection`/`getStaticPaths`, not hardcoded.
- AC5 — Coming-soon products render the SVG placeholder + "Coming Soon" badge + a non-interactive, visibly-disabled "View Details" CTA (no navigation); available products render their photo + link to a working detail page.
- AC11 — The home page "Featured Playgrounds" section renders the available products sourced from the `playgrounds` collection; no product data is hardcoded in the page.
- AC6 — Tailwind is provided by `@tailwindcss/vite` compiling from source (no committed pre-compiled CSS dump in `src/`). Both web fonts (Nunito Sans body, Quicksand `font-display` headings) load via the Astro 6 Fonts API — **self-hosted, no Google Fonts CDN request** — and render correctly.
- AC7 — The 3 photos render through `astro:assets` `<Image />` and are optimized (build emits resized/`webp` assets, not the raw ~1 MB JPEGs).
- AC8 — Scroll-reveal animations fire on all pages using the `motion` npm dependency loaded once from the layout.
- AC12 — Every page renders SEO metadata (title, description, and standard meta/social tags) emitted by a single reusable SEO component wired into the base layout; per-page values are passed as props (no ad-hoc `<head>` metadata duplicated across pages).
- AC13 — The catalog filter is a Preact island hydrated with `client:visible`; filtering by All / Available / Coming Soon works interactively in the browser. Verifiable that the island ships JS while other components don't: `dist/_astro/` contains a JS chunk attributable to the island (and the static pages reference it), with no per-component JS for the Astro-only components.
- AC14 — `pnpm build` produces a mixed output: the marketing/catalog/detail routes as prerendered static `.html` in `dist/`, and the `/quote` route as an on-demand server route (not a static file). The `@astrojs/node` standalone server (`node ./dist/server/entry.mjs`) serves `/quote` with per-request content that changes between requests, while the static routes are served as files. The detail-page "Request a Quote" buttons link to `/quote`, so it's reachable in the click-flow.

### Open questions

None for Intent. Intake decisions resolved at the *what/why* level: styling via official Tailwind v4 Vite; animations via Motion npm dep; content via Content Collections; coming-soon CTA = non-interactive/disabled (behavior, AC5); reveals flicker-free (quality bar); every product surface collection-sourced (AC11); images via `astro:assets`; acceptance = build + dev + browser screenshots.

Decisions deferred to the **Approach gate** (HOW, not WHAT): flash-prevention mechanism (CSS rule vs. inline script); featured-section query/filter pattern; exact component and layout breakdown.

## Intent approval record

**Approver:** Adam Lowe
**Date:** 2026-05-27
**Status:** Approved (v1 and v2)
**Notes / constraints:**
- v1 (approved): multiple nested layouts; SEO metadata in scope (Req 5 / AC12).
- v2 (approved): added two demo requirements — Req 6 dynamic island (Preact catalog filter, `client:visible`, AC13) and Req 7 SSG+SSR side-by-side (`/quote` SSR route via `@astrojs/node`, `prerender=false`, AC14). Also reconciled stale lines: fonts now via Astro Fonts API (not CDN); "Request a Quote" buttons wired to link to `/quote`. User elected to keep Tier 1 as an additive amendment; agent flagged this sits near the Tier-2 boundary (adapter + SSR change build/deploy model) — accepted because it's a no-risk demo with SSR scoped to one throwaway route.

---

## Approach + Delivery checkpoint

> Resolved deferred decisions (from Intent): (1) flash-prevention = `[data-hide]{opacity:0}` rule in `global.css`; (2) featured section = `getCollection('playgrounds')` filtered to `status: 'available'`, sorted by `order`; (3) layouts = **two** (`BaseLayout` + `ProductLayout`, nested); (4) SEO = hand-rolled `Seo.astro` emitting title + description + canonical + Open Graph + Twitter Card, wired into `BaseLayout`.
>
> **Amendment v2 (demo features):** (5) island = Preact catalog filter, `client:visible`; (6) SSG+SSR = keep default `output: 'static'`, add `@astrojs/node` standalone adapter, one `/quote` route with `export const prerender = false`. Mechanics verified against Astro 6 docs (`output: 'static'` is correct — `'hybrid'` was removed; per-route `prerender = false`; `node({ mode: 'standalone' })` → `node ./dist/server/entry.mjs`, default localhost:4321 — *amended 2026-05-27: the plan originally said 8080; the adapter's real default is 4321, port set via the `PORT` env var, see Execution notes*).

### Approach (chosen shape of the solution)

**1. Project setup**
- `pnpm dlx astro add tailwind` → installs `@tailwindcss/vite`, wires the Vite plugin into `astro.config.mjs`, and scaffolds `src/styles/global.css` with `@import "tailwindcss";`.
- **Pin Vite to v7** via `pnpm.overrides` in `package.json` (`"pnpm": { "overrides": { "vite": "^7" } }`). Vite is a transitive dep (Astro 6.3.8 resolved v7.3.3 in the prototype, and `@tailwindcss/vite` is a peer of Astro's Vite); the override forces the whole tree to Vite 7 so a reinstall/lockfile regeneration can never drift to v8. Run `pnpm install` after adding so the lockfile records the pin.
- `pnpm add motion` (animation library as a real dependency).
- `pnpm add sharp` — **required**, not optional. Prototyping confirmed the build fails with `MissingSharp` when rendering `<Image />` without it in this pnpm setup; installing sharp makes optimization succeed (verified: JPEGs → webp).
- `pnpm dlx astro add preact` — installs `@astrojs/preact` + preact, wires the integration. Used only for the one island component.
- `pnpm dlx astro add node` — installs `@astrojs/node`, sets `adapter: node({ mode: 'standalone' })`. `output` stays the default `'static'` (Astro 6 prerenders by default; SSR is opted into per-route). Adding the adapter does **not** make the whole site SSR.
- **Fonts via the Astro 6 Fonts API** (no CDN `@import` — self-hosted and optimized). Configure a **top-level `fonts: [...]`** key in `astro.config.mjs` (imported via `import { defineConfig, fontProviders } from 'astro/config'`) with `fontProviders.google()` for *Nunito Sans* (`cssVariable: '--font-nunito-sans'`) and *Quicksand* (`cssVariable: '--font-quicksand'`), each with the weights the source uses and `fallbacks: ['sans-serif']`. `BaseLayout` head renders `<Font cssVariable="--font-nunito-sans" preload />` (body font, preloaded) and `<Font cssVariable="--font-quicksand" />`, imported from `astro:assets`. This replaces the source's Google Fonts CDN line entirely. *(Amended 2026-05-27: the Fonts API is **stable and top-level** in installed Astro 6.3.8 — verified that `experimental.fonts` fails config validation. Still a flagship-feature demo beat.)*
- `src/styles/global.css` carries:
  - `@theme inline { --font-sans: var(--font-nunito-sans); --font-display: var(--font-quicksand); }` — backs the Tailwind `font-sans`/`font-display` utilities with the Astro font CSS variables. `inline` is required so Tailwind emits `var(--font-nunito-sans)` (which the `<Font>`-injected `@font-face` resolves) rather than copying a literal. `font-sans` is the body default; `font-display` is used on all headings.
  - `[data-hide] { opacity: 0; }` — replaces the source's inline `<head>` IIFE; loads before paint so reveals are flicker-free.

**2. Layouts** (`src/layouts/`)
- `BaseLayout.astro` — owns `<html lang="en">`/`<head>`/`<body class="font-sans text-gray-800 bg-white antialiased">`. Props: `title`, `description`, optional `ogImage`. Renders `<Seo …/>` and the two `<Font …/>` tags (Astro 6 Fonts API) in the head, imports `global.css`, then `<Nav />`, a `<slot />`, `<Footer />`, and the **one** shared Motion `<script>` (`import { animate, inView } from 'motion'` — only what's used; the source's unused `stagger` import is dropped, per review R1 — running `inView('.reveal', el => animate(el, { opacity: [0,1], y: [30,0] }, { duration: 0.8, ease: 'easeOut' }))`). Used directly by `/` and `/catalog`.
- `ProductLayout.astro` — **nests `BaseLayout`** (imports and wraps it, passing SEO props through). Renders the shared product-detail hero scaffold (gradient hero band + eyebrow + title + intro), then a `<slot />` for the per-product body sections. Used by `[slug].astro`. This is the concrete "layout nesting" demonstration (AC3c).

**3. Components** (`src/components/`) — repeated UI atoms become prop-driven components (AC3b):
- `Seo.astro` — emits `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph (`og:title/description/type/url/image`), and Twitter Card (`twitter:card/title/description/image`) from props. Wired into `BaseLayout` head.
- `Nav.astro`, `Footer.astro` — shared chrome lifted from source markup; `href`s point at Astro routes (`/`, `/catalog`, `/#why-play`, `/#sanctuaries`). Footer keeps the static newsletter form + social links (non-functional, as in source).
- `Button.astro` — `variant: 'primary' | 'secondary' | 'ghost'`, optional `href` (renders `<a>`) or none (renders `<button>`); a `disabled` variant covers the coming-soon CTA (AC5). Replaces the repeated pill-button markup.
- `Badge.astro` — props `text`, `color`, and `placement: 'inline' | 'overlay'`. The source is inconsistent: home "Featured" cards show the badge **inline** in the card body; catalog cards show it **overlaid** `absolute top-4 left-4` on the image. The `placement` prop reproduces both faithfully (resolves review R2).
- `ProductCard.astro` — branches on `status`: **available** → `<Image />` photo + `Badge` + `Button` linking to `/playgrounds/{id}`; **coming-soon** → colored placeholder panel + placeholder icon + `Badge` + disabled `Button`. Takes a `badgePlacement` prop passed through to `Badge` (home = inline, catalog = overlay). The coming-soon SVG is chosen via a small `iconMap` keyed by the entry's `placeholder.icon` string → the matching `icons/*` component (resolves review A1). Used by home featured + catalog.
- `FeatureCard.astro` — the "Why Play Matters" icon cards (icon, rotation, color, title, body via props).
- `StatCard.astro` — the detail-page 3-up stat tiles (`value`, `label`, accent color).
- `SectionHeading.astro` — the repeated centered heading + subcopy block (`eyebrow?`, `title`, `subtitle?`). Used by the "Why Play Matters", "Featured Playgrounds", and "See It In Action" section headers (resolves review A4).
- `icons/` — small `.astro` icon components for the SVGs repeated across pages. The nav and footer logos are **different** SVGs in the source (nav = simple single-path circle face; footer = detailed multi-circle panda face), so two components: `LogoIconNav`, `LogoIconFooter`. Plus `InstagramIcon`, `XIcon`, `CheckIcon` (detail-page bullets), `ArrowIcon` (home "View Full Catalog"), and the four catalog placeholder icons (`ClockIcon`, `CloudIcon`, `FaceIcon`, `CubeIcon`). Keeps demo pages readable (no raw `<path>` walls).
- **`CatalogFilter.tsx` (Preact island, the one hydrated component)** — a small filter bar with All / Available / Coming Soon buttons. **Design choice:** Astro still renders all 6 `ProductCard`s server-side (SSG, SEO-friendly, faithful); the island is a *minimal* filter-bar that toggles card visibility by `status` (Preact `useState` for the active filter; on change it adds/removes Tailwind's `hidden` class on the card wrappers — a class toggle, not raw style mutation). It reads each card's `data-status` to decide. This keeps card rendering in Astro and makes the island genuinely small — the clearest teaching contrast ("the grid is static HTML; only this ~1 KB control hydrates"). Placed on `catalog.astro` with `client:visible`. **Tailwind/TSX:** `@tailwindcss/vite`'s default content glob includes `.tsx` under `src/`, so the island's button classes are scanned; if any island-only class is missing from the built CSS, add `@source "../components/**/*.tsx";` to `global.css` as a fallback (resolves review R1).
  - **`data-status` owner:** `ProductCard.astro`'s root wrapper emits `data-status={entry.data.status}` so the island can filter without re-rendering cards (resolves review MD2).

**4. Content collection** (`src/content.config.ts`, `src/content/playgrounds/`)
- `playgrounds` via `glob({ pattern: '**/*.md', base: './src/content/playgrounds' })`.
- Schema `({ image }) => z.object({ … })`:
  - `title: z.string()` · `status: z.enum(['available','coming-soon'])` · `order: z.number()` · `summary: z.string()` (home featured-card copy) · `cardSummary: z.string().optional()` (catalog-grid copy; ProductCard falls back to `summary` — *amended 2026-05-27, see Execution notes*)
  - `badge: z.object({ text: z.string(), color: z.string() }).optional()`
  - available-only: `image: image().optional()`, `seoDescription: z.string().optional()`, `eyebrow: z.object({ text: z.string(), color: z.string() }).optional()`, `heroIntro: z.string().optional()`, `feature: z.object({ heading: z.string(), body: z.string(), points: z.array(z.string()) }).optional()`, `stats: z.array(z.object({ value: z.string(), label: z.string(), color: z.string() })).optional()`, `ctaHeading: z.string().optional()`, `ctaBody: z.string().optional()` (full per-product CTA copy: "Ready to Install This Gym?" etc.)
  - coming-soon: `placeholder: z.object({ color: z.string(), icon: z.enum(['clock','cloud','face','cube']) }).optional()`
  - `gallery: z.array(image()).optional()` — the "See It In Action" gallery images. **Verified working:** prototyped against this repo's Astro 6.3.8 — `z.array(image())` validates, `getCollection` returns the typed array, and the build optimizes each gallery image (1150 kB JPEG → 12 kB webp). Frontmatter lists relative paths under `src/assets/`; the source galleries reuse the product photo + `hero_panda.jpeg`, so those paths repeat.
  - Markdown body unused for layout (structured fields carry everything); `.md` kept for idiomatic collection shape.
- 6 entries: `bamboo-jungle-gym.md`, `roly-poly-slide.md` (full data + image), and 4 coming-soon stubs (`bamboo-forage-maze`, `cloud-nine-lounger`, `splash-pad-splashdown`, `tumble-tower`).

**5. Pages** (`src/pages/`)
- `index.astro` — `BaseLayout`; hero (with directly-imported `hero_panda.jpeg`), "Why Play Matters" (3 `FeatureCard`s under a `SectionHeading`), "Featured Playgrounds" (`getCollection` → `status: 'available'`, sorted by `order`, via `ProductCard` with `badgePlacement="inline"`), "Sanctuary Spotlight". Decorative blobs and copy verbatim. The Sanctuary Spotlight's two decorative images (`hero_panda.jpeg`, `roly_poly_slide.jpeg`) also render via `<Image />` (AC7 covers every photo use site, resolves review M2).
- `catalog.astro` — `BaseLayout`; the catalog **hero band** (`bg-gradient-to-b from-green-50 to-white`, `<h1>` + intro — resolves review M1), the **`<CatalogFilter client:visible />`** island (the dynamic-island demo, AC13), then `getCollection('playgrounds')` (all 6, unfiltered) sorted by `order` → 6-card grid via `ProductCard` with `badgePlacement="overlay"`. Each card wrapper carries `data-status` so the island can filter it.
- `playgrounds/[slug].astro` — `getStaticPaths()` over **available** entries; uses `ProductLayout`. Renders the feature block (`StatCard`s + `CheckIcon` bullet list), the "See It In Action" gallery (asymmetric grid: one cell `md:col-span-1 md:row-span-2`, one `md:col-span-2`) mapped from the entry's `gallery` array, and the CTA from `ctaHeading`/`ctaBody`. All photos via `<Image />`. **SSG** (prerendered, default).
- **`quote.astro` — the one SSR route (SSG+SSR demo, AC14).** `export const prerender = false`. Uses `BaseLayout`. Renders per-request dynamic content that visibly changes on reload — e.g. a server timestamp (`new Date()`), a pseudo-random "N sanctuaries browsing right now", and an optional `?playground=` query param echoed back — with a visible "Rendered on the server at {time}" line so the contrast with the static pages is obvious in the demo. Linked from the detail-page "Request a Quote" buttons so it's reachable in the flow.

**6. Layout props** — `BaseLayout` props: `title`, `description`, `ogImage?`. `ProductLayout` props: `title`, `description`, `ogImage?`, `productTitle`, `eyebrow`, `heroIntro` — it forwards the SEO trio to `BaseLayout` and renders the eyebrow/title/intro hero scaffold itself (resolves review R4). *(Amended 2026-05-27: `productTitle` (on-page `<h1>`) is split from the SEO `title` (full `<title>`) since the source's heading and page title differ — see Execution notes.)*

**7. Images** — `htmlsite/images/*.jpeg` → `src/assets/playgrounds/`. The 2 available entries reference their photo + `gallery` array via the schema `image()` helper; `hero_panda.jpeg` is imported directly where used outside collections (home hero, Sanctuary Spotlight). All photo use sites render with `<Image />` and explicit `width`/`height` to preserve layout (avoids CLS).

### Affected surfaces and ownership boundaries

All work is **new files in `src/`** plus config/README. Net changes:
- **New:** `src/layouts/{BaseLayout,ProductLayout}.astro`; `src/components/{Seo,Nav,Footer,Button,Badge,ProductCard,FeatureCard,StatCard,SectionHeading}.astro` + `src/components/icons/*.astro` + `src/components/CatalogFilter.tsx` (Preact island); `src/content.config.ts`; `src/content/playgrounds/*.md` (6); `src/pages/catalog.astro`; `src/pages/playgrounds/[slug].astro`; `src/pages/quote.astro` (SSR); `src/styles/global.css`; `src/assets/playgrounds/*.jpeg` (3).
- **Replaced:** `src/pages/index.astro` (starter → real home); `astro.config.mjs` (Tailwind plugin + top-level `fonts:` + Preact + Node adapter); `README.md`; `package.json`/lockfile (deps incl. `motion`, `sharp`, `@astrojs/preact`+`preact`, `@astrojs/node`, and the `pnpm.overrides` Vite-7 pin).
- **Untouched:** `htmlsite/` (reference), `public/favicon.*`, `tsconfig.json`.
- No shared/production state, no external services, no migrations. The Node adapter changes the **build output shape** (adds `dist/server/`) but the site still prerenders everything except `/quote`.

### Deliverables

The running Astro site (5 routes: 4 SSG + 1 SSR); two nested layouts; the component kit (incl. `Seo`); the Preact catalog-filter island; the `/quote` SSR route + Node adapter; the `playgrounds` collection + typed schema; Tailwind-from-source; fonts via the Astro Fonts API; flash-prevention rule; optimized images; Motion reveals; SEO metadata on every page; updated README.

### Delivery — order of work

1. **Setup** — `astro add tailwind`; `pnpm add motion sharp`; `astro add preact`; `astro add node` (`mode: 'standalone'`); pin Vite 7 (`pnpm.overrides`); configure top-level `fonts:` (Nunito Sans + Quicksand via `fontProviders.google()`); author `global.css` (`@import "tailwindcss"` + `@theme inline` mapping the font tokens to the Astro font vars + `[data-hide]`). *Checkpoint: dev server boots, Tailwind utility renders, fonts load self-hosted.*
2. **Layouts + chrome** — `BaseLayout`, `Seo`, `Nav`, `Footer`, shared Motion `<script>`; `ProductLayout` nesting `BaseLayout`.
3. **Primitives** — `Button`, `Badge`, `SectionHeading`, `icons/*`.
4. **Collection** — `content.config.ts` schema; the 6 entries; move images into `src/assets/`.
5. **Cards** — `ProductCard`, `FeatureCard`, `StatCard`.
6. **SSG pages** — `index` → `catalog` → `[slug]` (each verified rendering before the next).
7. **Island** — `CatalogFilter.tsx`; wire into `catalog.astro` with `client:visible`; verify filtering works and only this component hydrates.
8. **SSR route** — `quote.astro` with `prerender = false`; verify it renders per-request data; confirm `pnpm build` emits static `.html` for the other routes and a server route for `/quote`.
9. **README** update.
10. **Verify** — run the Acceptance checks.

Built bottom-up (layouts/primitives before pages) so each page composes already-working components. The two demo features (island, SSR) come last as additive layers on a working SSG site, so a failure there can't block the core rebuild. Single cohesive build; no rollout/handoff concerns.

### Validation / review impact

Validated by `astro build`, dev server boot, and browser screenshots against `htmlsite/` (see Acceptance). No test suite exists; none added (out of scope for a demo; acceptance is visual/build-based).

### Documentation and governance deliverables

**README.md** rewritten to describe PandaPlay: what the demo shows, project structure (layouts/components/collection/assets), and `pnpm dev`/`build`/`preview`. **Must include the SSR demo run instructions** — after `pnpm build`, **stop `pnpm dev` if running** (both default to 4321), then start the Node server with `node ./dist/server/entry.mjs` (localhost:4321) to serve the `/quote` SSR route, and the note that the static routes are real files in `dist/client/` while `/quote` is computed per request (the presenter beat). Also note that in `astro dev` the `/quote` route is served by Vite, not the Node adapter (resolves review R3/MD1). Doubles as the presenter cheat-sheet. No decision log/changelog/requirements catalog in this repo; none required.

A short combined `astro.config.mjs` reference (Tailwind Vite plugin + top-level `fonts:` + Preact + Node adapter, composed in one config) is captured here so the four integrations are wired together, not piecemeal (resolves review MD3).

## Approach + Delivery approval record

**Approver:** Adam Lowe
**Date:** 2026-05-27
**Status:** Approved
**Notes / constraints:**

---

## Acceptance checkpoint

Written per `.docs/standards/VERIFICATION.md` (Code & UI discipline): **Agent Verification** = objectively re-runnable checks the implementing agent must pass before handoff; **Manual Verification** = human-judgment smoke tests the user runs after handoff. Deterministic browser behavior (filter toggles, SSR per-request change, route existence) lives in Agent Verification via Playwright; only subjective fidelity/feel (does it look like the source, do fonts/animations look right) is Manual.

**Verification-support artifacts:**
- *Persistent:* `htmlsite/` is the existing visual baseline for the Manual fidelity comparison (already in the repo; not created or removed by this plan).
- *Temporary (runtime):* the AC14 SSR checks require the **built Node server** running. Start it with `node ./dist/server/entry.mjs` (port 4321) after `pnpm build`; **stop the process** (Ctrl-C / kill the PID) once the SSR Playwright check and Manual Test 7 are done. `pnpm preview` (for the SSG Playwright checks) is likewise started and stopped around those checks. **Run one Astro process at a time** — `pnpm dev`, `pnpm preview`, and the Node server all default to 4321; stop one before starting the next. No files are created; teardown is stopping the processes.
- No fixtures, showcase pages, or sample content needed.

**Pre-execution baseline (per PLANNING-DELIVERY §17):** this repo has **no `lint`/`test`/`validate` npm script and no test suite**. The baseline check is `pnpm exec astro check` + `pnpm build` on the current starter (expected clean). Recorded here so post-execution verification can distinguish new issues from pre-existing ones; no automated test pipeline is being added (out of scope — demo site).

### Agent Verification

The implementing agent must pass all of these before handoff. Leave checkboxes unchecked until run.

**Prerequisites for the Playwright items:** the source/file/build-output checks need only the repo + a `pnpm build`. The Playwright SSG checks run against `pnpm preview`; the Playwright SSR check runs against `node ./dist/server/entry.mjs` (port 4321). Start each server before its checks and stop it after — one Astro process at a time, since they share the 4321 default (see Verification-support artifacts above).

#### Standard gates

- [ ] `pnpm build` exits 0 with no errors (full build is this project's validation pipeline). [AC1, AC8]
- [ ] `pnpm exec astro check` reports 0 errors (TypeScript under `astro/tsconfigs/strict`). [AC1]
- [ ] `pnpm dev` boots; `/`, `/catalog`, `/playgrounds/bamboo-jungle-gym`, `/playgrounds/roly-poly-slide`, `/quote` all respond 200 with **no server-side errors in terminal output**. (Browser-console errors are checked via Playwright / Manual, not here.) [AC1, AC14]

#### Source and file checks

- [ ] `astro.config.mjs` — search `'@tailwindcss/vite'`: 1 match (Vite plugin wired). [AC6]
- [ ] `astro.config.mjs` — search `'fontProviders.google'`: 2 matches (Nunito Sans + Quicksand under the top-level `fonts:` key). [AC6] *(Amended 2026-05-27: Fonts API is stable/top-level in Astro 6.3.8, not `experimental.fonts`; the prior `search 'experimental': ≥1 match` line was removed — see Execution notes deviation.)*
- [ ] `astro.config.mjs` — search `"mode: 'standalone'"`: 1 match (Node adapter). [AC14]
- [ ] `astro.config.mjs` — search `'@astrojs/preact'`: 1 match (import); search `'preact()'`: 1 match (in the `integrations:` array). [AC13]
- [ ] `astro.config.mjs` — `output` stays default `'static'`: search `"output: 'server'"`: 0 matches **and** `'output: "server"'`: 0 matches (per-route `prerender=false` is the SSR mechanism, not a global `output: 'server'`). [AC14]
- [ ] `package.json` — `pnpm.overrides.vite` is `"^7"`. After install, `pnpm list vite` (or `pnpm why vite`) shows a single resolved Vite on major **7**, none on 8. [Vite-7 constraint]
- [ ] `src/styles/global.css` — search `'@import "tailwindcss"'`: 1 match; `'@theme inline'`: 1 match; `'[data-hide]'`: 1 match; `'opacity: 0'`: 1 match (the `[data-hide]` rule). [AC6, flicker-free]
- [ ] **No Google Fonts CDN anywhere in `src/`** — search all files under `src/` for `'fonts.googleapis.com'`: 0 matches (fonts are self-hosted via the Fonts API, not a CDN `@import` or `<link>` in `global.css` *or* `BaseLayout.astro`). [AC6, MC3]
- [ ] No pre-compiled Tailwind dump under `src/`: search `src/` for `'tailwindcss v4'` banner string: 0 matches. [AC6]
- [ ] `src/content.config.ts` — search `'glob('`: 1 match; `'astro/loaders'`: 1 match; `'astro/zod'`: 1 match. `status` field is `z.enum(['available','coming-soon'])`; `gallery` field is `z.array(image())`. [AC4]
- [ ] `src/content/playgrounds/` — exactly 6 `.md` files; search across them for `'status: available'`: 2 matches, `'status: coming-soon'`: 4 matches. [AC4, AC5]
- [ ] `src/pages/playgrounds/[slug].astro` — `getStaticPaths` filters to available entries (search `'available'`: ≥1 match in the path-generation filter). [AC4]
- [ ] `src/pages/quote.astro` — search `'export const prerender = false'`: 1 match. [AC14]
- [ ] Nav/footer single-component check: `src/components/Nav.astro` and `src/components/Footer.astro` exist; search **`src/pages/**`** (pages only, not layouts) for `'<nav'`: 0 matches and `'<footer'`: 0 matches (chrome lives only in the components, used by the layout). [AC3]
- [ ] `src/layouts/ProductLayout.astro` imports and renders `BaseLayout` (search `'BaseLayout'`: ≥1 import + usage). [AC3c]
- [ ] **Component decomposition (AC3b):** each atom component file exists under `src/components/` — `Button.astro`, `Badge.astro`, `ProductCard.astro`, `FeatureCard.astro`, `StatCard.astro`, `SectionHeading.astro`. **Judgment check (read, do not grep):** read each file in `src/pages/**` end to end and confirm no page re-inlines these atoms (no raw `<button>` pill markup or bare repeated `<svg>` icon blocks that belong in a component); record `composed | inlined` per page — every page must read `composed`. [AC3b]
- [ ] **Eyebrow is collection-driven (AC10):** search `src/pages/playgrounds/[slug].astro` for `'Bestseller'`: 0 matches and `'Featured Playground'`: 0 matches (eyebrow text comes from `entry.data.eyebrow`, not hardcoded). [AC10]
- [ ] **Featured section is collection-driven (AC11):** `src/pages/index.astro` — search `'getCollection'`: ≥1 match; search the template body for `'Bamboo Jungle Gym'`: 0 matches and `'Roly-Poly Slide'`: 0 matches (product data comes from the collection, not hardcoded copy). [AC11]
- [ ] **All photos via `<Image />` (AC7):** search `src/pages/index.astro`, `src/pages/catalog.astro`, `src/pages/playgrounds/[slug].astro`, and `src/layouts/ProductLayout.astro` for raw `'<img'`: 0 matches each (every photo use site uses `astro:assets` `<Image />`). [AC7]

#### DOM / ARIA & structural wiring (verify by reading source, not the browser)

- [ ] `ProductCard.astro` — root wrapper emits `data-status={…status}` (the island's filter hook). [AC13, MD2]
- [ ] `BaseLayout.astro` — head renders `<Seo …/>` and two `<Font cssVariable=… />` tags (one with `preload`). [AC6, AC12]
- [ ] `Seo.astro` — emits `<title>`, `<meta name="description">`, `<link rel="canonical">`, and `og:`/`twitter:` tags from props (search for `'og:title'`, `'twitter:card'`: 1 match each). [AC12]
- [ ] Coming-soon `ProductCard` CTA is a non-interactive disabled control (no `href`); available CTA links to `/playgrounds/{id}`. [AC5]
- [ ] Detail-page "Request a Quote" button links to `/quote`. [AC14]

#### Build-output checks

- [ ] After `pnpm build`: `dist/` contains static `.html` for `/`, `/catalog`, and both `/playgrounds/*` routes; `dist/server/entry.mjs` exists; `/quote` is **not** emitted as a static `.html`. [AC14]
- [ ] `dist/_astro/` contains optimized `.webp` (or resized) image assets, not the raw ~1 MB JPEGs, for hero + product + gallery images. [AC7]
- [ ] Island JS isolation: only the catalog page's built HTML references a JS chunk under `/_astro/` (search `dist/catalog/index.html` for `'/_astro/'` `<script src>`: ≥1 match), while `dist/index.html` and the `dist/playgrounds/*/index.html` files contain **0** `<script src="/_astro/…">` references — confirms only `CatalogFilter` hydrates. [AC13]

#### Browser automation (Playwright — deterministic behavior only)

Run the SSG-page checks against `pnpm preview` (the built static output). Run the SSR check against the built Node server (see Agent Verification prerequisites).

- [ ] Playwright (`/catalog`, against `pnpm preview`): the 6 card wrappers carry `data-status`. Clicking "Available" leaves exactly 2 cards without the `hidden` class (the `data-status="available"` ones) and applies `hidden` to the 4 `coming-soon`; "Coming Soon" inverts it (4 shown, 2 hidden); "All" removes `hidden` from all 6. Assert via not-`.hidden` count + `data-status`, so the result is deterministic regardless of how Playwright computes visibility. [AC13]
- [ ] Playwright title check (`pnpm preview`): `/` → "PandaPlay - Build a Paradise for Pandas"; `/catalog` → "PandaPlay - Playground Catalog". [AC9]
- [ ] Playwright title check (`pnpm preview`): `/playgrounds/bamboo-jungle-gym` → "PandaPlay - The Bamboo Jungle Gym"; `/playgrounds/roly-poly-slide` → "PandaPlay - The Roly-Poly Slide" (titles from collection data). [AC9]
- [ ] Playwright (coming-soon CTA, `pnpm preview` `/catalog`): clicking a coming-soon card's "View Details" performs no navigation (URL unchanged; control is disabled/non-link). [AC5]
- [ ] Playwright (SSR, against the **built Node server** at `http://localhost:4321`): two GETs of `/quote` a moment apart return responses whose dynamic field (timestamp / count) differs between the two requests. [AC14]

### Manual Verification

Human-judgment smoke tests the user runs after handoff. Covers what automation can't: visual fidelity, fonts, and animation feel.

#### Prerequisites

- Dev (SSG pages + island): `pnpm dev` → routes below on the dev server.
- SSR demo: `pnpm build`, stop any dev/preview server, then `node ./dist/server/entry.mjs` → `/quote` at `http://localhost:4321/quote`.
- Visual baseline: open the corresponding `htmlsite/*.html` files side-by-side (the existing reference).

#### Acceptance-criteria mapping

- AC2 → Tests 1–4 · AC3/AC3b/AC3c → Tests 1–4 (component/layout fidelity) · AC6 → Test 5 · AC7 → Tests 1–4 (images look right) · AC8 → Test 6 · AC10 → Test 3 · AC11 → Test 1 · AC13 → Test 2 (feel) · AC14 → Test 7.

---

##### Test 1: Home page fidelity

**Page:** `/`

1. Compare against `htmlsite/index.html` side-by-side.

**Expected:**
- [ ] Nav, hero (panda image, both CTAs, decorative blobs), "Why Play Matters" 3 feature cards, "Featured Playgrounds" (the 2 available products only), "Sanctuary Spotlight" (rotated 2-image grid), and footer all match the source in layout, copy, and color.
- [ ] Featured section shows exactly the 2 available products (collection-driven). [AC11]

##### Test 2: Catalog page + filter island

**Page:** `/catalog`

1. Compare the 6-card grid against `htmlsite/catalog.html` (hero band, 2 photo cards + 4 colored placeholder cards with "Coming Soon").
2. Use the filter bar: All / Available / Coming Soon.

**Expected:**
- [ ] Grid matches the source visually; badges overlay the cards as in the source.
- [ ] Filtering feels instant and correct; the right cards show/hide for each option.

##### Test 3: Product detail pages

**Page:** `/playgrounds/bamboo-jungle-gym` and `/playgrounds/roly-poly-slide`

1. Compare each against its `htmlsite/` counterpart.

**Expected:**
- [ ] Hero (eyebrow color + text: green "Bestseller" / pink "Featured Playground" [AC10]), feature block + 3 checkmark bullets, 3 stat tiles (correct numbers), "See It In Action" gallery (asymmetric grid), and "Ready to Install This Gym/Slide?" CTA all match.

##### Test 4: Shared chrome consistency

**Page:** all routes

**Expected:**
- [ ] Nav and footer are identical across every page (same component); links navigate correctly.

##### Test 5: Fonts

**Page:** `/`

**Expected:**
- [ ] Headings render in Quicksand (`font-display`), body in Nunito Sans (`font-sans`); no fallback-font flash. (DevTools Network: no request to `fonts.googleapis.com` — fonts are self-hosted.) [AC6]

##### Test 6: Scroll-reveal animations

**Page:** `/`, `/catalog`, a detail page

1. Reload and scroll down each page.

**Expected:**
- [ ] Elements fade+slide in on scroll; no flash of fully-visible content before they animate (flicker-free). [AC8]

##### Test 7: SSR vs SSG contrast (the demo beat)

**Page:** `/quote` on the built Node server (`http://localhost:4321/quote`)

1. Load `/quote`, note the per-request data (timestamp / "N browsing now"). Reload a few times.
2. Inspect `dist/client/`: confirm `/`, `/catalog`, `/playgrounds/*` are `.html` files on disk; `/quote` is not (it lives in the `dist/server/` build).
3. Reach `/quote` via a detail page's "Request a Quote" button.

**Expected:**
- [ ] The dynamic value changes on each reload (server-rendered per request).
- [ ] Static routes exist as files in `dist/`; `/quote` does not — it's computed by the Node server. [AC14]

## Acceptance approval record

**Approver:** Adam Lowe
**Date:** 2026-05-27
**Status:** Approved
**Notes / constraints:** Approved after sub-agent review (13 spec-correctness findings incorporated: grep-unsafe checks tightened, missing Agent coverage for AC3b/AC10/AC11/AC7 added, Node-server temporary artifact lifecycle documented). User noted the plan's structure is more annotation-heavy than their usual plans under this standard (a consequence of mid-stream gate corrections) but accepted as-is.

---

## Execution authorization

**Branch mode:** **Main branch** (confirmed 2026-05-27 — repo is on `main`, clean; user chose to build directly on main, not a branch/worktree).
**Execution mode:** **Guided** (confirmed — user available for material decisions and commit approvals).
**Execution delegation:** **Inline orchestrator** (confirmed — explicit override of the standard's Sonnet-sub-agent default; one cohesive Tier-1 build where slices share heavy context).
**Begin execution approved:** **Authorized, but execution deferred to a fresh session** (decided 2026-05-27). Planning session was long; the plan is the complete spec. A new session should resume here — see resume note below.
**Commit strategy:** Guided proposals — per user's commit discipline, **every** commit requires: inspect the staged diff, show the exact commit message in chat, and explicit user approval. Do not chain commit + push (separate approvals). This holds even though execution is "authorized."

### Resume note for the execution session

To execute this plan in a new session:
1. Read `.docs/standards/PLANNING-DELIVERY.md` (execution + closeout rules) and this plan index in full. (No bootstrapped standards in-repo — read from the `planning-system` skill's bundled `standards/`.)
2. Read the `htmlsite/` source pages first-hand for fidelity; do not work from this plan's prose alone for markup.
3. **Pre-execution baseline (PLANNING-DELIVERY §17):** repo has no `lint`/`test`/`validate` script and no test suite. Establish baseline with `pnpm exec astro check` + `pnpm build` on the current starter (expected clean) and record it in `Execution notes / deviations` before the first slice.
4. Follow the **Delivery — order of work** (10 steps: setup → layouts → primitives → collection → cards → SSG pages → island → SSR route → README → verify). Demo features (island, SSR) come last as additive layers.
5. Mode is **guided + inline orchestrator + main branch**; **every commit needs explicit approval** (show diff-summary + message, wait). Record deviations/decisions in `Execution notes / deviations` as they happen, not at the end.
6. Run the **Acceptance checkpoint** Agent Verification before handoff; Manual Verification is the user's.
7. **Watch items flagged during planning:** Fonts API is configured via a **top-level `fonts:` key** (it graduated from experimental — `experimental.fonts` fails to build in 6.3.8; see Execution notes deviation); `sharp` is a required install (build fails without it — verified); Vite pinned to `^7` via `pnpm.overrides`; `z.array(image())` gallery is prototype-verified working in this repo's Astro 6.3.8.

## Execution notes / deviations

**Pre-execution baseline (2026-05-27):**
- `pnpm build` on the stock starter → exit 0, clean (1 page built).
- `pnpm exec astro check` → **required installing `@astrojs/check` + `typescript`** first (Astro prompts for it; not present in the stock starter). After `pnpm add -D @astrojs/check typescript` (→ `@astrojs/check@0.9.9`, `typescript@6.0.3`), `astro check` reports **0 errors, 0 warnings, 0 hints** (3 files). Baseline is clean.

---

- `Date:` 2026-05-27
- `Type:` Decision
- `Summary:` Installed `@astrojs/check` + `typescript` as devDependencies during baseline setup.
- `Reason:` The plan's standard gate `pnpm exec astro check` (AC1) requires `@astrojs/check`; it is not in the stock starter and Astro prompts to install it interactively. Installing it non-interactively is a prerequisite for the type-check gate, implied by the plan rather than new scope.
- `Affected sections / artifacts:` `package.json` devDependencies, `pnpm-lock.yaml`.
- `User approval:` Not required (record-only — enables an already-planned verification gate; no behavior/scope change).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` `tsconfig.json` was modified by `astro add preact` (added `compilerOptions.jsx: "react-jsx"` + `jsxImportSource: "preact"`, and reformatted the `include`/`exclude` arrays). The plan's *Affected surfaces* listed `tsconfig.json` as "Untouched."
- `Reason:` The Preact integration requires this JSX config for the `.tsx` island to type-check and compile; `astro add preact` writes it automatically. The `extends: "astro/tsconfigs/strict"` base (the plan's TypeScript constraint) is preserved — strictness is unchanged.
- `Affected sections / artifacts:` `tsconfig.json`; plan's "Affected surfaces and ownership boundaries → Untouched" line.
- `User approval:` Not required (low-risk record-only — necessary consequence of an approved install; no change to approved scope, behavior, or the strict-TS decision).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` The Astro Fonts API is configured under a **stable top-level `fonts:`** key in astro.config.mjs, **not** `experimental.fonts` as the plan specified. Verified against installed Astro 6.3.8: `fonts` is a top-level schema key (`base.js:311`); the `experimental` block is `.strict()` and rejects `fonts` — `astro sync` with `experimental.fonts` fails with "Invalid or outdated experimental feature" (exit 1). The Fonts API graduated out of experimental before 6.3.8.
- `Reason:` The plan's `experimental.fonts` shape does not build in this version. The *requirement* (Req 5 / AC6 — both fonts via the Astro Fonts API, self-hosted, no Google CDN) is unaffected; only the config key location and one verification line change. `fontProviders.google()`, the `<Font>` component, self-hosting, and the `@theme inline` token mapping are all unchanged.
- `Affected sections / artifacts:` `astro.config.mjs`; plan Scope/Approach/Constraints font references; **AC6 Agent Verification** — the `search 'experimental': ≥1 match` line is removed (now incorrect); `fontProviders.google: 2 matches` is retained.
- `User approval:` **Received** (Adam Lowe, 2026-05-27 — "Use top-level, fix AC6 check"). Plan body + AC6 amended to match.

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` The `pnpm.overrides.vite: "^7"` pin is present in `package.json` but pnpm does **not** write an `overrides:` block into `pnpm-lock.yaml`, because the natural resolution already lands on Vite 7 (Astro 6.3.8 + `@tailwindcss/vite` both require Vite 7), making the override a redundant no-op that pnpm elides. Verified end state: exactly one Vite version linked (`7.3.3`), zero Vite 8. The pin still functions as a drift guard — it would force Vite back to 7 if a future dependency tried to pull 8.
- `Reason:` pnpm 9 only records overrides in the lockfile when they change a resolution. The plan's AC verifies via `pnpm list vite` / `pnpm why vite` showing a single major-7 Vite — which holds. No action needed; recording so the closeout verifier doesn't flag the absent lockfile block as a miss.
- `Affected sections / artifacts:` `package.json` (`pnpm.overrides`); `pnpm-lock.yaml` (no override block, as expected). The Vite-7 AC check (`pnpm why vite` → single major 7) passes.
- `User approval:` Not required (low-risk record-only — constraint intent satisfied; the pin is present and functional).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Step 1 (Setup) committed as `0991c76`.
- `Reason:` Slice boundary per Delivery order; reviewable setup unit before any UI code.
- `Affected sections / artifacts:` Delivery step 1.
- `User approval:` **Received** (commit approved by Adam Lowe).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` The chrome-related icon components (`LogoIconNav`, `LogoIconFooter`, `InstagramIcon`, `XIcon`) are authored in Step 2 (Layouts + chrome) rather than Step 3 (Primitives), because `Nav.astro` and `Footer.astro` compose them and must not re-inline raw `<svg>` (AC3b). Remaining icons (`CheckIcon`, `ArrowIcon`, placeholder icons) stay in Step 3 as planned.
- `Reason:` Build-order dependency: Step 2 chrome needs its icons present to be idiomatic and pass AC3b. Same files, same components — only the slice they land in moves earlier.
- `Affected sections / artifacts:` Delivery steps 2–3 sequencing; `src/components/icons/*`. No change to deliverables, scope, or verification.
- `User approval:` Not required (low-risk record-only — sequencing adjustment).

---

- `Date:` 2026-05-27
- `Type:` Decision
- `Summary:` Added `site: 'https://pandaplay.example'` to `astro.config.mjs` (placeholder canonical origin). `Seo.astro` uses `Astro.site` to build absolute canonical + OG/Twitter image URLs (falls back to `Astro.url` if unset).
- `Reason:` Stable absolute canonical/OG URLs need a configured `site`; without it canonical would be per-request origin. The plan deferred SEO component shape to an Approach-gate detail and didn't specify `site`. Placeholder value is demo-appropriate; swap at deploy.
- `Affected sections / artifacts:` `astro.config.mjs` (`site`); `src/components/Seo.astro`.
- `User approval:` Not required (minor implementation detail within deferred SEO-shape latitude; fallback handles unset case).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` `ProductLayout.astro` takes a `productTitle` prop (the on-page `<h1>` text, e.g. "The Bamboo Jungle Gym") **distinct from** the SEO `title` prop (the full `<title>`, e.g. "PandaPlay - The Bamboo Jungle Gym"). The plan's ProductLayout prop list (`title, description, ogImage?, eyebrow, heroIntro`) conflated page title and displayed heading.
- `Reason:` The source's `<title>` and on-page heading differ; faithful rendering (AC2/AC9) requires both. Splitting the prop is the minimal correct fix.
- `Affected sections / artifacts:` `src/layouts/ProductLayout.astro`; plan Approach §6 layout-props line (ProductLayout props).
- `User approval:` Not required (minor implementation detail; serves AC9 fidelity, no scope/behavior change).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Editor surfaced a TS diagnostic on `astro.config.mjs` (`vite.plugins` `Plugin` type mismatch) from two pnpm peer-context copies of the *same* `vite@7.3.3`. The authoritative gate `pnpm exec astro check` reports **0 errors** — the diagnostic is an editor-only false positive, not a real type error. Not suppressed (suppression would mask real config errors).
- `Reason:` pnpm resolves `vite@7.3.3` under two peer hashes; the editor's TS server picks a stricter multi-context view than `astro check`. Benign; build + check pass.
- `Affected sections / artifacts:` none (no code change; recorded so it isn't re-investigated).
- `User approval:` Not required (record-only, no defect).

---

- `Date:` 2026-05-27
- `Type:` Decision
- `Summary:` Added an optional `cardSummary` field to the `playgrounds` schema. The source uses **different card copy** for the 2 available products on home (longer) vs catalog (shorter). `summary` holds the home/longer text; `cardSummary` holds the catalog/shorter text; `ProductCard` falls back to `summary` when `cardSummary` is absent (coming-soon products appear only on catalog and carry one copy).
- `Reason:` A single `summary` field could not reproduce both source surfaces verbatim (AC2 fidelity). One optional field keeps both faithful.
- `Affected sections / artifacts:` `src/content.config.ts` (schema); plan Approach §4 schema field list; `ProductCard` (consumes a per-surface summary prop).
- `User approval:` **Received** (Adam Lowe, 2026-05-27 — "Add cardSummary field").

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Gallery images keep the planned `gallery: z.array(image())` schema (image only, no per-image alt/tint). The detail template supplies each cell's alt text, background tint, and span classes **positionally** (the tints and spans were always template concerns; alt joins them). Added three home-section icon components (`HeartIcon`, `BoltIcon`, `SmileIcon`) not enumerated in the plan's icon list, so the home "Why Play Matters" cards compose icons instead of inlining raw `<svg>` (AC3b).
- `Reason:` Keeps the prototype-verified schema shape; the source gallery's alt texts are positional and few, so template-supplied alts are simpler than expanding the schema. The three feature icons are required for AC3b (no inlined SVG in pages) and were implied by "repeated SVG icons" in the plan's icon rationale.
- `Affected sections / artifacts:` `src/components/ProductCard.astro`, `FeatureCard.astro`, `StatCard.astro`, `src/components/icons/{Heart,Bolt,Smile}Icon.astro`; gallery alt handled in `[slug].astro` (Step 6).
- `User approval:` Not required (minor implementation detail; serves AC3b/AC7, no scope change).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Steps 2–5 complete (layouts + chrome, primitives, collection, cards). `astro check` clean (28 files, 0 errors); `astro sync` validates the collection + image paths. Proposing one commit for the foundation slice (all components/collection, no rendered page yet).
- `Reason:` Steps 2–5 are foundation with no user-facing render; one coherent reviewable commit beats four noisy micro-commits (PLANNING-DELIVERY §18 commit grouping).
- `Affected sections / artifacts:` Delivery steps 2–5.
- `User approval:` Commit pending approval.

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` With the `@astrojs/node` adapter, the build splits output into `dist/client/` (prerendered static files + `_astro/` assets) and `dist/server/` (entry.mjs + chunks). Prerendered HTML is at `dist/client/index.html`, `dist/client/catalog/index.html`, etc. — **not** `dist/index.html` as several Agent Verification checks assume.
- `Reason:` The Node adapter changes the build output shape (the plan acknowledged "adds `dist/server/`" but the AC checks still reference `dist/index.html`, `dist/catalog/index.html`, `dist/_astro/`). Build-output and Playwright path references must use `dist/client/...`.
- `Affected sections / artifacts:` AC7/AC13/AC14 build-output checks; the optimized-image, island-JS-isolation, and static-HTML-existence checks all need the `dist/client/` prefix. The `/quote` SSR route is correctly absent from `dist/client/` (it's in the server build).
- `User approval:` Not required (verification-artifact path correction; reality matches approved intent — mixed SSG/SSR output. Will apply the path prefix when running Step 10 Agent Verification).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` **AC13 island-JS-isolation check needs correction.** As written it expects `dist/index.html` and detail pages to contain **0** `<script src="/_astro/…">` references. But the shared **Motion reveal script** (from `BaseLayout`'s `<script>`, AC8) legitimately bundles to a `/_astro/*.js` file referenced on *every* page. Verified: `dist/client/index.html` references `/_astro/BaseLayout.astro_..._lang.*.js` (the Motion script), and an inline module. The correct island-isolation check is: the **CatalogFilter island chunk** appears only on the catalog page, not "zero /_astro scripts on non-catalog pages."
- `Reason:` The plan's AC13 check conflated "any `/_astro/` script" with "island hydration JS." The Motion script is shared chrome by design (AC8 loads it once from the layout), so it's present everywhere. The real isolation property is that the *Preact island's* JS is unique to catalog.
- `Affected sections / artifacts:` AC13 Agent Verification (build-output island-isolation line). Corrected check to be applied in Step 10: identify the island chunk on `dist/client/catalog/index.html` and confirm it's absent from `dist/client/index.html` + detail pages — distinguishing it from the shared Motion script which is allowed everywhere.
- `User approval:` Not required (verification-artifact gap correction per PLANNING-DELIVERY §16; the underlying behavior — only the island hydrates interactively — is unchanged and still verified).

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Step 6 SSG pages complete (`index`, `catalog`, `playgrounds/[slug]`). All three render faithfully vs `htmlsite/` — verified by browser screenshots (home: hero/feature cards/featured grid/spotlight; catalog: hero band + 6-card grid with overlay badges + disabled coming-soon CTAs; detail: eyebrow/feature+bullets/stats/asymmetric gallery/CTA). Build optimizes images to webp; fonts self-hosted (0 googleapis refs); titles verbatim (AC9); "Request a Quote" → `/quote` (AC14). `astro check` clean (30 files).
- `Reason:` Delivery step 6.
- `Affected sections / artifacts:` `src/pages/index.astro`, `catalog.astro`, `playgrounds/[slug].astro`; `.gitignore` (Playwright artifacts excluded).
- `User approval:` Commit pending approval.

---

- `Date:` 2026-05-27
- `Type:` Decision
- `Summary:` Playwright screenshots (`*-astro.png`, `home-astro-revealed.png`) and `.playwright-mcp/` added to `.gitignore` — temporary verification artifacts, not source. Cleaned up at closeout.
- `Reason:` These are transient render-verification output (the plan classifies browser verification as temporary). Keeping them out of git matches the plan's temporary-artifact lifecycle.
- `Affected sections / artifacts:` `.gitignore`.
- `User approval:` Not required (hygiene; no scope/behavior change).

---

**Verification note (Motion scroll-reveal + full-page screenshots):** A full-page Playwright screenshot captures the whole page height *without* scroll-triggering the IntersectionObserver, so below-fold `.reveal` elements appear blank (`opacity: 0` from `[data-hide]`) until scrolled into view. This is correct, faithful behavior (the source uses the same `inView('.reveal')` pattern) — **not** a render bug. Verified: scrolling the page sets every reveal to `opacity: 1`. Step 10 reveal verification must scroll before asserting visibility / screenshotting.

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Step 7 (Preact catalog-filter island) complete. `CatalogFilter.tsx` hydrated with `client:visible`; filtering verified in-browser (All=6, Available=2 both `available`, Coming Soon=4 all `coming-soon`, back to All=6 — deterministic by data-status + `hidden` class toggle, AC13). Island JS isolation verified against a production build: the `CatalogFilter` chunk + Preact runtime ship **only** on `/catalog` (via `<astro-island>` from `client:visible`); `/index` and both detail pages reference **0** island/Preact chunks. The shared Motion script is present on all pages (AC8) and is correctly distinct from the island chunk. Tailwind compiled the island's `.tsx` button classes without needing the `@source` fallback.
- `Reason:` Delivery step 7.
- `Affected sections / artifacts:` `src/components/CatalogFilter.tsx`, `src/pages/catalog.astro`.
- `User approval:` Commit pending approval.

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` **The `@astrojs/node` standalone server runs on the default port `4321`, served with `node ./dist/server/entry.mjs` — the plan's repeated "localhost:8080" is wrong.** Verified empirically (the server logs `Server listening on http://localhost:4321`) and against canonical Astro docs (`guides/integrations-guide/node/`): the standalone server reads `HOST`/`PORT` env vars at runtime (docs example: `HOST=0.0.0.0 PORT=4321 node ./dist/server/entry.mjs`); **there is no `server`/port option in the adapter config** (only `mode`, `staticHeaders`, `experimentalDisableStreaming`, `bodySizeLimit`). The idiomatic way to set the port is the runtime env var, not committed config. 8080 was not an Astro default or convention — the plan invented it.
- `Reason:` Build/demo/verification of the SSR route must target the real port. The idiomatic, docs-backed command is the bare `node ./dist/server/entry.mjs` (→ 4321); a `PORT=` prefix is only needed to override.
- `Affected sections / artifacts:` AC14 (Agent Verification SSR check — change `http://localhost:8080` → `http://localhost:4321`); Manual Test 7 prerequisites + page URL (`http://localhost:8080/quote` → `http://localhost:4321/quote`); the "Verification-support artifacts" temporary-artifact note ("port 8080" → "port 4321"); the README SSR run instructions (Documentation deliverables). No code change to `quote.astro` (it has no port config). To be applied to those plan sections + the README in this slice.
- `User approval:` **Received** (Adam Lowe, 2026-05-27 — confirmed default 4321 / docs-idiomatic / no PORT override).

---

- `Date:` 2026-05-27
- `Type:` Decision
- `Summary:` **The SSR demo and verification run a single Astro process at a time — `pnpm dev` (4321) and the built Node server (4321) are never run concurrently.** In dev, the `/quote` route is served by Vite; to exercise the real adapter-rendered SSR behavior, stop `pnpm dev`, then run `node ./dist/server/entry.mjs`. The plan's Acceptance checks already start/stop `pnpm preview` and the Node server *around* their respective checks (sequential), so no concurrency is required.
- `Reason:` The EADDRINUSE collision on 4321 encountered during Step 8 testing was caused by a `pnpm dev` server I started earlier for screenshots and **left running** — an operator cleanup miss, not a design constraint. There is no functional need for two Astro processes; treating the collision as a reason to override the port was backwards. Single-process-at-a-time keeps the default 4321 collision-free and the run command idiomatic (bare `node ./dist/server/entry.mjs`).
- `Affected sections / artifacts:` README SSR run instructions (clarify: stop the dev server before starting the prod server); Manual Test 7 wording; operator process hygiene during Step 10 verification. No effect if both side-by-side were ever needed (they aren't for this demo).
- `User approval:` **Received** (Adam Lowe, 2026-05-27 — "That matches").

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Step 8 (`/quote` SSR route) complete. `quote.astro` has `export const prerender = false`; renders per-request data (UTC timestamp + random "N sanctuaries browsing" count) and echoes the `?playground=` param. Detail-page "Request a Quote" buttons now pass `?playground=<title>`. Verified against the built Node server (default 4321): two requests 2.5s apart differ in both timestamp (23:12:20→23:12:22) and count (7→3); param echo renders ("enquiring about The Roly-Poly Slide"); `/quote` is **not** in `dist/client/` (SSR, lives in `dist/server/`) while `/`, `/catalog`, `/playgrounds/*` are static `.html` in `dist/client/`; all routes return 200 from the Node server; production server console is clean (no dev-toolbar errors). Browser screenshot confirms on-brand fidelity.
- `Reason:` Delivery step 8.
- `Affected sections / artifacts:` `src/pages/quote.astro` (new); `src/pages/playgrounds/[slug].astro` (Quote button param); plan body 8080→4321 + `dist/`→`dist/client/` + single-process corrections applied throughout.
- `User approval:` Commit pending approval.

---

- `Date:` 2026-05-27
- `Type:` Deviation
- `Summary:` Step 9 (README) complete. Rewrote the stock README into a PandaPlay presenter cheat-sheet: a feature→code-location table (the 9 Astro features mapped to files), project structure, commands, and the SSG+SSR run instructions (corrected to port 4321, single-process note, `PORT=` override shown per Astro docs). The plan's review-MD3 "combined astro.config.mjs reference" is satisfied by pointing to the live `astro.config.mjs` (all four integrations composed there) rather than duplicating config into the README.
- `Reason:` Delivery step 9; the config file is the authoritative reference, so duplicating it into docs would risk drift (concision over restatement).
- `Affected sections / artifacts:` `README.md`; plan Documentation deliverables (MD3 satisfied by reference, not duplication).
- `User approval:` Commit pending approval.

## Closeout record

**Status:**
**Owner verification date:**
**Owner approval status:**
**Owner approval notes:**
**Verification completed:**
**Documentation updated:**
**Requirements updated:** N/A (no requirements catalog)
**Changelog / decisions updated:** N/A (no changelog)
**Archived:**
