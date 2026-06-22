# Griffin Portfolio

Static editorial portfolio for 3D rendered stills. Astro + MDX, placeholder imagery, local dev only in v1.

## Quickstart

```bash
nvm use    # Node 22 — see .nvmrc
npm install
npm run dev
```

Open `http://localhost:4321`.

## Common tasks

| Goal | Command / location |
|------|---------------------|
| Run dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Add a work | Create `src/content/pieces/<slug>.mdx` |
| Edit Astronaut Dreams series | `src/content/series/astronaut-dreams.mdx` |
| Regenerate placeholder images | `node scripts/generate-placeholders.mjs` |
| Re-apply bundled real renders | `npm run apply:assets` |
| Swap in new renders | See **Replace placeholders** below |

## Add a piece

1. Add hero image under `public/works/` (or use a placeholder in `public/placeholders/`).
2. Create `src/content/pieces/my-piece.mdx`:

```mdx
---
title: "My Piece"
series: other
year: 2024
featured: true
hero: "/placeholders/other-01.svg"
alt: "My Piece — 3D render"
tools: ["Blender", "Cycles"]
description: "Short curator-facing note."
---
```

3. Set `featured: true` to include it on `/work`.

## Replace placeholders

1. Put originals in `sources/` (png, jpg, webp, tiff).
2. `npm install --save-dev sharp`
3. `node scripts/prepare-images.mjs` — writes `public/works/<name>/thumb.webp`, `hero.webp`, `og.webp`.
4. Update piece frontmatter, e.g. `hero: "/works/my-piece/hero.webp"`.
5. `npm run build`

## Project layout

- `src/pages/` — routes (`/`, `/work`, `/astronaut-dreams`, `/about`, `/contact`)
- `src/content/pieces/` — one MDX file per work
- `src/content/series/` — exhibition metadata
- `src/components/` — layout, editorial, media
- `public/placeholders/` — SVG stubs for v1

## Deferred (not v1)

Deploy, CMS, shop/prints, full image archive, WebGL viewers, contact form backend.
