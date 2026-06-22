# Developer guide — Griffin Portfolio

Task-first reference for anyone editing content, assets, or the Astro site. For product context and acceptance criteria, see [portfolio-v1 handoff](delivery/portfolio-v1-handoff.md).

New here? Start with [README.md](../README.md) quickstart, then come back to this guide for content and theme work.

---

## Production smoke

After content or layout changes:

```bash
npm run build    # must exit 0; writes dist/
npm run preview  # serves dist/ at http://localhost:4321
```

---

## How do I…

| Goal | Section |
|------|---------|
| Add a new work to the grid | [Add a piece](#add-a-piece) |
| Put real renders on the site | [Replace images](#replace-images) |
| Change the 12-work exhibition | [Edit a series](#edit-a-series) |
| Change home splash image | [Change the home hero](#change-the-home-hero) |
| Adjust Kanagawa Dragon colors/fonts | [Theme](#theme-kanagawa-dragon) |
| Fix “build failed” on content | [Content schema](#content-schema) |
| Regenerate placeholder SVGs | [Scripts](#scripts) |

---

## Project layout

```
griffin-portfolio/
├── src/
│   ├── content.config.ts      # Zod schemas for pieces + series collections
│   ├── content/
│   │   ├── pieces/*.mdx       # One file per work (URL id = filename stem)
│   │   └── series/*.mdx       # Exhibition metadata (e.g. astronaut-dreams)
│   ├── pages/                 # Routes (index, work, astronaut-dreams, …)
│   ├── components/
│   │   ├── layout/            # BaseLayout, DisappearingNav, Footer
│   │   ├── editorial/         # Grid, hero, process strip, credits
│   │   └── media/             # OptimizedImage, ClickToPlayVideo
│   ├── layouts/               # PageLayout, ProjectLayout (+ JSON-LD)
│   ├── styles/                # tokens, kanagawa, editorial, global
│   └── utils/                 # pieces.ts (queries), images.ts
├── public/
│   ├── images/splash.jpg      # Home hero
│   ├── works/*.jpg            # Real render files (referenced in frontmatter)
│   └── placeholders/*.svg       # Grid stubs for works without real assets yet
├── scripts/                   # Asset and content automation
└── sources/                   # (you create) originals for prepare-images.mjs
```

Content is loaded at build time via Astro 6 **glob loaders** in `src/content.config.ts`. There is no runtime database or CMS.

---

## Content schema

### Pieces (`src/content/pieces/<slug>.mdx`)

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Display name |
| `series` | yes | `astronaut-dreams` or `other` |
| `year` | yes | Integer, used for `/work?year=` filter |
| `featured` | yes | `true` to show on `/work` grid |
| `hero` | yes | Public path, e.g. `/works/spaceman.jpg` |
| `alt` | yes | Accessibility + SEO |
| `description` | no | Shown in credits overlay |
| `order` | no | Sort order within series (Astronaut Dreams uses 1–12) |
| `tools` | no | String array, e.g. `["Blender", "Cycles"]` |
| `gallery` | no | Extra image paths |
| `process` | no | Up to 6 paths — process strip on project page |
| `video` | no | `{ src, poster }` for click-to-play loop |

The URL id is the **filename** without `.mdx` (e.g. `astronaut-dreams-03.mdx` → `/work/astronaut-dreams-03`). In Astro 6 collection APIs this field is `piece.id`, not `piece.slug`.

### Work grid filters

| Query | Values | Example |
|-------|--------|---------|
| `series` | `astronaut-dreams`, `other` | `/work?series=other` |
| `year` | any year present in frontmatter | `/work?year=2024` |

Combine filters: `/work?series=astronaut-dreams&year=2024`. Clear a filter by removing the query param or visiting `/work`.

Filters apply in the browser after load (static export builds one `/work` HTML page; query params are read from `window.location` on the client).

### Series (`src/content/series/<slug>.mdx`)

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Exhibition name |
| `statement` | yes | Curator-facing intro |
| `colophon` | yes | Tools, digital-only note |
| `pieceSlugs` | yes | Exactly **12** slugs, ordered |
| `ogImage` | yes | Social preview image path |
| `yearStart`, `yearEnd` | yes | Shown on title plate |
| `processPieceSlug` | yes | Which piece supplies the process strip on `/astronaut-dreams` |

Build fails loudly if Zod validation fails (wrong slug count, missing fields, bad types).

---

## Add a piece

1. Add a hero image under `public/works/` (or use `/public/placeholders/other-NN.svg` temporarily).
2. Create `src/content/pieces/my-new-piece.mdx`:

```mdx
---
title: "My New Piece"
series: other
year: 2024
featured: true
hero: "/works/my-new-piece.jpg"
alt: "Short description of the render for screen readers"
description: "Optional curator note shown in the credits overlay."
tools: ["Blender", "Cycles"]
---
```

3. Save — dev server picks it up. Visit `/work/my-new-piece`.
4. Set `featured: false` to hide from the grid but keep a direct URL.

For Astronaut Dreams works, also add the slug to `pieceSlugs` in `src/content/series/astronaut-dreams.mdx` and set `order: N`.

---

## Edit a series

File: `src/content/series/astronaut-dreams.mdx`.

- Reorder the exhibition: change `pieceSlugs` order (must remain 12 entries).
- Change intro copy: edit `statement` or the MDX body below the frontmatter.
- Change which piece shows the process strip: set `processPieceSlug` to a piece that has a `process:` array in its frontmatter.
- Page template: `src/pages/astronaut-dreams.astro`.

After edits, open `/astronaut-dreams` and confirm labels `01/12` … `12/12`.

---

## Replace images

Two paths depending on what you have.

### Path A — Drop JPGs in `public/works/` (fastest)

1. Export render as JPG or WebP.
2. Save as `public/works/descriptive-name.jpg`.
3. Update piece frontmatter: `hero: "/works/descriptive-name.jpg"`.
4. Run `npm run build` to verify.

### Path B — Batch resize from `sources/` (many files)

1. Create `sources/` at repo root.
2. Drop originals (png, jpg, webp, tiff).
3. Install Sharp once: `npm install --save-dev sharp`.
4. Run:

```bash
node scripts/prepare-images.mjs
```

Output per file: `public/works/<basename>/thumb.webp`, `hero.webp`, `og.webp`.

5. Point frontmatter at hero, e.g. `hero: "/works/my-render/hero.webp"`.

### Re-sync the v1 catalog (maintainers)

Real JPGs for v1 are already committed under `public/works/` and `public/images/splash.jpg`. A fresh clone does **not** need any sync script to run the site.

To regenerate piece MDX and series frontmatter from the shared catalog:

```bash
npm run sync:content
```

To also import originals from a local `sources/` folder (gitignored):

```bash
npm run sync:content:sources
```

Catalog lives in `scripts/content-catalog.mjs`. Validation:

```bash
npm run validate:content
```

(`npm run build` runs validation first via `prebuild`.)

---

## Change the home hero

File: `src/pages/index.astro`.

- Image path: `public/images/splash.jpg` (referenced as `/images/splash.jpg`).
- Replace the file on disk, or change `splashSrc` in the page frontmatter.
- `objectPosition` controls crop (default `42% 58%`).

Home does not use a piece MDX entry — it is a dedicated route.

---

## Theme (Kanagawa Dragon)

Palette follows [kanagawa.nvim](https://github.com/rebelot/kanagawa.nvim) **Dragon** variant (muted dark, warm accents).

| File | Role |
|------|------|
| `src/styles/tokens.css` | CSS variables (`--dragon-*`, fonts, spacing) |
| `src/styles/kanagawa.css` | Page chrome, links, exhibition accents |
| `src/styles/editorial.css` | Grid, sequence layout, credits overlay |
| `src/styles/global.css` | Resets, filters, project nav |

Fonts (Google Fonts in `BaseLayout.astro`):

- Display: Cormorant Garamond
- Body: Noto Sans JP

To tweak accent color sitewide, change `--color-accent` and `--color-accent-warm` in `tokens.css`.

Fonts load from Google Fonts at runtime (`BaseLayout.astro`). Offline dev requires network once to cache fonts, or self-host the WOFF files and update the layout links.

---

## Deploy

The site is a **static export** — no server runtime, database, or secrets. Any host that serves files from a folder works.

### Quick reference

| Setting | Value |
|---------|--------|
| Install | `npm ci` (or `npm install`) |
| Build | `npm run build` |
| Output | `dist/` |
| Node | ≥ 22.12.0 (`.nvmrc`) |
| Pre-build check | `npm run validate:content` (runs automatically via `prebuild`) |

### Environment variables

Set these **during the build step** on your host or in CI:

| Variable | Required | Purpose |
|----------|----------|---------|
| `SITE_URL` | **Yes** (production) | Public site origin for `<link rel="canonical">`, Open Graph, and JSON-LD. Must match where users open the site (no trailing slash). |
| `BASE_PATH` | GitHub Pages project sites only | Astro `base` — repo subpath when the site is **not** at the domain root. Omit for Vercel, Netlify, Cloudflare, or a custom domain at `/`. |

Examples:

```bash
# Custom domain or host root (Vercel, Netlify, etc.)
SITE_URL=https://portfolio.example.com npm run build

# GitHub Pages project site: funkatron.github.io/griffin-portfolio/
SITE_URL=https://funkatron.github.io/griffin-portfolio \
BASE_PATH=/griffin-portfolio \
npm run build
```

Local dev leaves both unset — site runs at `http://localhost:4321/` with no subpath.

### Verify before you ship

```bash
npm run build
npm run preview
```

1. Open `/`, `/astronaut-dreams`, `/work`, and `/work/astronaut-dreams-01`.
2. Try `/work?series=other` — grid should narrow (client-side filter).
3. View page source on a project page — canonical and `og:url` should use your `SITE_URL`.

---

### Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Astro** (or Other).
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `SITE_URL` = your production URL (e.g. `https://griffin-portfolio.vercel.app` or custom domain).
6. Deploy. Vercel picks Node from `.nvmrc` when present; otherwise set **Node.js 22** in project settings.

Do **not** set `BASE_PATH` unless you intentionally deploy under a subpath.

---

### Netlify

1. **Add new site** → Import from Git.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment: `SITE_URL=https://your-site.netlify.app` (or custom domain).
5. **Environment** → set **Node version** to **22** (or add `NODE_VERSION=22`).

Optional `netlify.toml` at repo root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
  SITE_URL = "https://your-site.netlify.app"
```

Replace `SITE_URL` with your real URL before merging.

---

### Cloudflare Pages

1. **Workers & Pages** → Create → Connect Git.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. **Environment variables** (Production): `SITE_URL` = `https://your-project.pages.dev` or custom domain.
5. Set **Node.js version** to **22** in build settings.

---

### GitHub Pages

Two common setups:

**A. Project site** (`https://<user>.github.io/<repo>/`) — use for this repo:

1. Repo **Settings** → **Pages** → Source: **GitHub Actions**.
2. Merge the workflow in `.github/workflows/deploy-pages.yml` (builds with `SITE_URL` + `BASE_PATH`, deploys `dist/`).
3. After the workflow runs, site URL: `https://funkatron.github.io/griffin-portfolio/`

**B. User/org site or custom domain at root** — site lives at `https://example.com/`:

1. Build with `SITE_URL=https://example.com` only (no `BASE_PATH`).
2. Upload `dist/` or use the same workflow with those env vars.

Enable **Enforce HTTPS** under Pages settings when using `github.io`.

---

### Manual or any static host

```bash
nvm use
npm ci
SITE_URL=https://your.domain npm run build
# upload everything inside dist/ to the host (S3 + CloudFront, nginx, etc.)
```

Point the web server document root at the uploaded folder. Ensure `404.html` handling if your host supports SPA-style fallbacks (optional — this site uses static HTML per route).

---

### Custom domain checklist

1. Add DNS (CNAME or A records) per your host’s docs.
2. Set `SITE_URL` to the **canonical** HTTPS URL (e.g. `https://portfolio.example.com`).
3. Rebuild and redeploy after changing `SITE_URL`.
4. Confirm canonical tags and social previews on one project page.

---

## Scripts

| Script | Command | What it does |
|--------|---------|--------------|
| Dev server | `npm run dev` | Astro HMR on port 4321 |
| Build | `npm run build` | Static site → `dist/` (32 pages in v1) |
| Preview | `npm run preview` | Serve `dist/` |
| Placeholders | `npm run generate:placeholders` | Writes SVG stubs to `public/placeholders/` |
| Seed content | `npm run seed:content` | Overwrites MDX with template seed data |
| Sync content | `npm run sync:content` | Regenerate MDX from `scripts/content-catalog.mjs` |
| Sync + import | `npm run sync:content:sources` | Sync MDX and copy `sources/` → `public/works/` |
| Validate content | `npm run validate:content` | Catalog ↔ MDX ↔ assets check (also `prebuild`) |
| Prepare images | `node scripts/prepare-images.mjs` | Batch WebP variants (needs `sharp`) |

---

## Troubleshooting

### `LegacyContentConfigError` or missing loader

Astro 6 requires `src/content.config.ts` with a `loader:` on each collection. Do not use legacy `src/content/config.ts`.

### `Missing parameter: id` on build

Content entries use `id` (filename), not `slug`. In `getStaticPaths`, use `params: { id: piece.id }` for `/work/[id].astro`.

### Node version errors

Astro 6 scaffold expects Node ≥ 22.12.0. Run `nvm use` before install/build.

### Piece not on `/work`

Check `featured: true` in frontmatter and that filters (`?series=`, `?year=`) are not hiding it.

### Astronaut Dreams build fails on `pieceSlugs`

Series schema requires exactly 12 slugs. Each slug must match an existing `src/content/pieces/<slug>.mdx` file.

### Images 404

Paths in frontmatter must start with `/` and match files under `public/` (e.g. `/works/foo.jpg` → `public/works/foo.jpg`).

---

## Verification checklist

After substantive edits:

1. `npm run dev` — spot-check `/`, `/astronaut-dreams`, `/work`, one project page.
2. `npm run build` — must complete with no Zod or route errors.
3. Keyboard: on a series piece, `←` / `→` moves prev/next within the same series.
4. Scroll: nav hidden at top, appears after ~80px scroll.

Full acceptance list: [handoff doc](delivery/portfolio-v1-handoff.md#acceptance-criteria).
