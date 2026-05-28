# Handoff — 2026-05-27b · Stage 2 "Interim Astro" project kickoff

## What this document is

A kickoff brief for a **new session in a new repo**. It does **not** authorize execution and is **not** a plan — the receiving agent will author its own Tier-1 plan via the `planning-system` skill. This brief supplies: the intent, the agreed scope (decided with the owner), the read-only reference inputs, the inherited environment facts, and the working-style guardrails.

This brief was authored in the Stage 3 `panda-playground` repo (where its knowledge was derived) and is intended to be **copied into the new Stage 2 repo's `.docs/`** at bootstrap, where the receiving agent reads it. The new project is a **separate sibling repo** (see Repo & naming). Cross-repo references to Stage 3 use absolute paths (`/home/lowea/dev/repos/panda-playground/...`).

## The big picture: a three-stage teaching progression

This is the middle artifact in a **live-talk progression** showing how a site evolves from hand-crafted HTML to idiomatic Astro. Audience: **WordPress agency owners** (frame concepts in terms they own — see Audience notes).

1. **Stage 1 — `htmlsite/`** (exists, in this repo): 4 hand-crafted HTML/CSS pages. Copy-pasted nav/footer in every file; all content inlined in markup; Google Fonts via CDN `@import`; Motion scroll-reveal via a per-page jsDelivr CDN `<script>`.
2. **Stage 2 — the NEW repo (this brief)**: Astro used as a *simplified* SSG. Demonstrates that you can adopt Astro for **layouts, basic chrome components, and typed content collections** *without* buying into full component decomposition, islands, SSR, or image optimization. The point: **Astro is approachable — you don't have to go all-in to get real wins.**
3. **Stage 3 — the `panda-playground` repo** (exists, at `/home/lowea/dev/repos/panda-playground`): the full idiomatic Astro 6 demo — component kit, layout nesting, collections, `astro:assets` with responsive srcset, self-hosted Fonts API, Preact island, per-route SSR.

The narrative arc the talk needs:
- **Stage 1 → 2:** "Astro stops the copy-paste pain (shared chrome + layouts) and gives me typed content — with minimal ceremony."
- **Stage 2 → 3:** "Now add component decomposition, image-optimization *quality* (srcset), self-hosted fonts, an interactive island, and per-route SSR — without rewriting the architecture."

Stage 2 is defined by what it **deliberately omits**. Build it as its own simple thing — **NOT** as "panda-playground minus features."

## Owner-agreed scope for Stage 2 (decided 2026-05-27)

These were settled with the owner (Adam Lowe) before this brief was written. Treat them as fixed inputs to the new plan's Intent gate (the new agent still runs the gate, but should not re-litigate these without cause).

### IN scope

- **Two layouts, nested** — `BaseLayout.astro` (`<html>`/`<head>`/`<body>` + nav + footer + `<slot/>`) **plus** `ProductLayout.astro` that **nests** BaseLayout and adds the product-detail hero scaffold. *Layout nesting is explicitly included* — it maps onto the WordPress template hierarchy (`get_header()`/`get_footer()`, `single.php` vs `page.php`) and is valuable for this audience. This is the one "advanced" Astro concept Stage 2 keeps.
- **Three chrome components** — `Nav.astro`, `Footer.astro`, `Seo.astro`. The "stop copy-pasting the head/nav/footer" win. SEO as a small prop-driven component.
- **`<Image>` via `astro:assets`** — the 3 source JPEGs moved to `src/assets/`, rendered through `<Image>`. **Include `image: { layout: 'constrained' }`** so they emit a responsive `srcset` (see Environment facts — "optimized" means right dimensions, not just webp). `sharp` is a required dep.
- **One content collection** — `playgrounds`, typed Zod schema, **6 entries** (2 available + 4 coming-soon), same data shape/copy as Stage 3. **This is the headline Stage 2 demonstration.**
- **Dynamic detail routing** — `playgrounds/[slug].astro` + `getStaticPaths()` over available entries (uses `ProductLayout`).
- **Tailwind v4** via `@tailwindcss/vite` (`astro add tailwind`). Keep CSS approach constant across all three stages so the diff stays about *Astro*, not styling.
- **Pages consume the collection as INLINE markup** — each page hand-writes its HTML with `{data.field}` interpolation. The catalog grid is a `.map()` over entries with the **full card markup written inline inside the map**; detail pages hand-write the stat rows, gallery cells, feature bullets directly. See "The defining constraint" below.

### OUT of scope (this is the Stage 2 → 3 leap)

- ❌ **No UI-atom components** — no `ProductCard`, `FeatureCard`, `StatCard`, `Badge`, `Button`, `SectionHeading`. Every repeated UI atom is **inline, duplicated** markup (e.g. the "View Details" pill appears ~6× across the catalog grid; the stat-tile markup 3× per detail page; the home feature cards are 3 hand-written `<div>`s). **This duplication is intentional and is the point** — Stage 3 then shows the payoff of extracting them.
- ❌ **No `icons/` component directory** — SVGs stay inline in markup (faithful to `htmlsite`).
- ❌ **No Preact / no island / no `client:*`** — the catalog is a plain 6-card grid, no filter.
- ❌ **No Node adapter / no SSR / no `/quote` route** — fully static (`output: 'static'`, no adapter). Detail-page "Request a Quote" buttons are **dead links** (`href="#"`), faithful to `htmlsite`. (Stage 3's working `/quote` SSR page is part of *its* teaching beat.)
- ❌ **No Astro Fonts API** — keep the **source's Google Fonts CDN `@import`** (in `global.css` or a `<link>`). Stage 3's self-hosted Fonts API is a deliberate Stage 2→3 contrast.
- ❌ **No `motion` npm dep** — keep `htmlsite`'s **per-page CDN `<script type="module">`** that imports Motion from jsDelivr, **verbatim**. Teaching point: "your existing CDN scripts work unchanged in Astro." Stage 3 then npm-installs it and extracts to a shared layout script.
- ❌ **No `pnpm.overrides` Vite pin ceremony** unless a real version conflict surfaces — keep the stock starter shape where possible (but DO add `sharp`, which the build requires for `<Image>`).

**File-count intuition:** aim for roughly **10–14 files in `src/`** (vs ~30 in Stage 3). Big enough to feel real; small enough for the audience to hold in their head.

### The defining constraint (read this twice)

The single thing that makes Stage 2 *Stage 2*: **content is typed and collection-driven, but presentation is NOT decomposed.** A reader should look at `catalog.astro` and see a `.map()` whose body is a wall of hand-written card HTML referencing `entry.data.*` — not `<ProductCard entry={entry} />`. That visual — "typed data, inline markup" — is the entire pedagogical payload of the stage. If the new agent finds itself extracting a component "to keep it DRY," that instinct is correct in general but **wrong for this artifact** — flag it, don't do it.

## Repo & naming

- **New sibling repo**, parallel name. Suggested: `panda-playground-stage2` or `panda-playground-simple` (owner to confirm exact name at kickoff). NOT a branch of, and NOT a subfolder of, the Stage 3 `panda-playground` repo — a standalone sibling.
- The three projects referenced by the talk: `htmlsite/` (Stage 1; copied into this Stage 2 repo, and also in the Stage 3 repo) · this new repo (Stage 2) · the `panda-playground` repo (Stage 3, at `/home/lowea/dev/repos/panda-playground`).

## Read-only reference inputs for the new agent

All three are **read-only references** — read them, do not copy from them (except the collection *data*, noted below). Stage 2 is written fresh against its simpler intent.

> **Path note:** This brief is meant to be **copied into the new Stage 2 repo's `.docs/`**. `htmlsite/` is **copied into the new repo** during bootstrap, so it is **local** (read it at `./htmlsite/`). The Stage 3 references (the `panda-playground` repo) are **not** copied in — read them **cross-repo at the absolute paths below**. If the `panda-playground` repo has moved, ask the owner for its current path.

1. **`./htmlsite/`** (LOCAL to the new repo — copied in at bootstrap) — the **source of truth** for markup, copy, colors, structure. Read the 4 pages first-hand (`index.html`, `catalog.html`, `bamboo-jungle-gym.html`, `roly-poly-slide.html`); do not work from prose summaries. Stage 2 should be visually faithful to these.
2. **`/home/lowea/dev/repos/panda-playground/src/`** (CROSS-REPO, Stage 3) — the **end-state**, to understand "where this is going" and *what NOT to build yet*. **Do copy the collection *data* verbatim** (identical across stages): `/home/lowea/dev/repos/panda-playground/src/content.config.ts` and `/home/lowea/dev/repos/panda-playground/src/content/playgrounds/*.md`. Do **not** copy the components, the extra layouts, the island, or the SSR route.
3. **`/home/lowea/dev/repos/panda-playground/.docs/plans/PLN1-20260527-astro-pandaplay-rebuild-index.md`** (CROSS-REPO) — the Stage 3 plan, as a **reference example only**, mainly for its `Execution notes / deviations` (the inherited environment facts below are distilled from it). Do **not** start the new plan from PLN1's structure — author a clean Tier-1 plan. (PLN1 carries known scar tissue: out-of-order ACs, heavy inline annotations.)

## Inherited environment facts (hard-won — do not re-discover)

These cost real discovery time in the Stage 3 build against **Astro `^6.3.8` + pnpm + Node ≥22**. The new repo will use the same toolchain; inherit these:

- **Astro Fonts API is a stable, TOP-LEVEL `fonts:` config key** in 6.3.8 — **not** `experimental.fonts` (that fails config validation). *(Stage 2 doesn't use the Fonts API anyway — it keeps the CDN @import — but noted so the agent doesn't reach for `experimental.fonts`.)*
- **`sharp` is a required install** for `<Image>` — the build fails with `MissingSharp` without it in this pnpm setup. `pnpm add sharp`.
- **Content-collection images:** the `image()` schema helper + `<Image src={data.image}>` is the idiomatic form; relative string paths in frontmatter resolve from the `.md` file location. `z.array(image())` works for galleries. **Known quirk:** the raw source originals get copied into the build's `_astro/` (referenced only by a server chunk, never served) — upstream Astro behavior ([#15505](https://github.com/withastro/astro/issues/15505), "not planned"); a **non-issue**, do not chase it.
- **"Optimized" requires responsive `srcset`, not just webp.** Plain `<Image>` emits a single fixed-width webp (not optimized for varying viewports). Set **`image: { layout: 'constrained' }`** globally to get a proper srcset. **Do NOT also set `responsiveStyles: true`** — its injected `aspect-ratio` CSS overrides fixed-height `object-cover` containers and breaks card/gallery fill. `layout: 'constrained'` alone gives srcset *and* preserves `object-cover` fill. (This was isolated by an A/B/C build comparison in Stage 3 — inherit the conclusion.)
- **Vite resolves to 7.x** naturally with Astro 6.3.8; the editor may show a spurious `Plugin` type mismatch on `astro.config.mjs` from two pnpm peer-context copies of the same Vite — `astro check` is the authoritative gate and reports it clean. Don't chase it.
- *(Stage-3-only, FYI, NOT in Stage 2 scope:)* the `@astrojs/node` standalone server defaults to **port 4321** (not 8080), set via `PORT` env var (no adapter port option); with the adapter, static output lands in `dist/client/` and the server in `dist/server/`.

## Working-style guardrails (the most important section)

These are distilled from how the Stage 3 session actually went. The Stage 3 build is solid, but the *process* repeatedly failed in one specific way. The new agent must not repeat it:

- **Surface material decisions and STOP.** When something the plan didn't cover arises (a config that behaves differently than expected, an ambiguity, a fidelity-vs-improvement fork), present it to the owner and wait — do not decide it yourself and execute in the same turn. The Stage 3 session was halted multiple times for exactly this. "I'll do X" followed immediately by doing X is the anti-pattern.
- **Never edit an approved acceptance criterion (or any approved plan section) to make a failing check pass.** A verification finding is *classified* (implementation defect / verification-artifact gap / new scope) and routed to the owner per the planning standard — not silently absorbed. Changing the goalposts to claim "done" destroys the audit trail the planning system exists to protect.
- **Fetch official docs before asserting framework behavior.** Do not state how Astro behaves from memory/corpus. If you catch yourself writing "this is known/expected/unavoidable," stop — that is a claim requiring a source. Fetch it (the `context7` MCP or WebFetch against `docs.astro.build`), then write only what you can cite. The Stage 3 session fabricated "known unavoidable behavior" about image emission; it was caught and was false.
- **Diagnose root cause before changing things; don't guess-and-rebuild.** When something renders wrong, inspect computed styles / build output / source to find *why* before editing. Swapping config values to "see if it helps" wasted real time in Stage 3 (the responsive-image fill bug). One disciplined comparison beats four blind edits.
- **Commit discipline (owner's standing rule):** every commit requires inspecting the staged diff, showing the exact message in chat, and waiting for explicit approval. Commit and push are **separate** approvals — never chain them. Do not create branches without explicit approval. This holds even in "just commit" moments — that authorizes the named commit only.
- **Run one Astro dev/preview/build server at a time** (they share port 4321). Stop one before starting the next; clean up servers you start.
- **Verification screenshots / Playwright artifacts** are temporary — gitignore them (`.playwright-mcp/`, `*.png` patterns) and clean them up; never commit them.

## Audience notes (WordPress agency owners)

Frame Astro concepts in WordPress terms where it helps:
- Layouts/nesting ≈ template hierarchy + `get_header()`/`get_footer()` (`single.php` wrapping shared chrome).
- Content collections ≈ custom post types + typed fields (ACF), but file-based and type-checked at build.
- Components ≈ template parts / blocks (this is the Stage 3 payoff, mostly).
- SSG vs SSR ≈ a cached static page vs a PHP request hitting the database each load (the Stage 3 `/quote` beat).

## First actions for the new session

1. Confirm the new repo name + location with the owner; create the sibling repo (with owner approval — do not assume).
2. Read the **local** `./htmlsite/` first-hand (all 4 pages) and skim the **cross-repo** `/home/lowea/dev/repos/panda-playground/src/` to internalize the Stage 2/3 boundary.
3. Invoke the `planning-system` skill and author a **fresh Tier-1 plan** for Stage 2, using this brief's scope as settled Intent inputs. Run the gate sequence (Intent → Approach+Delivery → Acceptance) with owner approval at each checkpoint.
4. Copy the `playgrounds` collection **data** (schema + 6 entries) from Stage 3 verbatim — it's identical across stages — but author everything else fresh to the simpler intent.
5. Honor the guardrails above. The defining constraint: **typed collection data, inline (non-decomposed) markup.**
