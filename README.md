# Griffin Portfolio

Static editorial portfolio for 3D rendered stills. Built with Astro 6 and MDX — exhibition-style pages, file-based content, no CMS in v1.

Deeper docs: [Developer guide](docs/DEVELOPMENT.md) (how to change content, assets, and theme) · [v1 handoff](docs/delivery/portfolio-v1-handoff.md) (what shipped, open items, verification).

## Requirements

- Node.js ≥ 22.12.0 (see `.nvmrc`)
- npm 10+

If you use `nvm`, run `nvm use` before install. Otherwise install Node 22 manually (fnm, volta, or nodejs.org) and confirm with `node -v`.

## Quickstart

If you only run one sequence, run this:

```bash
nvm use
npm install
npm run dev
```

Then open http://localhost:4321.

What that does:

1. `nvm use` — selects Node 22 from `.nvmrc`.
2. `npm install` — installs Astro, MDX, and build tooling.
3. `npm run dev` — serves the site with hot reload on port 4321.

For a production check:

```bash
npm run build
npm run preview
```

Preview serves the built site from `dist/` (default http://localhost:4321).

## Common tasks

| Goal | Where to go |
|------|-------------|
| Add or edit a work | [Add a piece](docs/DEVELOPMENT.md#add-a-piece) |
| Swap placeholder grid images for real renders | [Replace images](docs/DEVELOPMENT.md#replace-images) |
| Change Astronaut Dreams copy or order | [Edit a series](docs/DEVELOPMENT.md#edit-a-series) |
| Change colors / fonts (Kanagawa Dragon) | [Theme](docs/DEVELOPMENT.md#theme-kanagawa-dragon) |
| Understand routes and folders | [Project layout](docs/DEVELOPMENT.md#project-layout) |
| See what v1 includes and what is deferred | [Handoff doc](docs/delivery/portfolio-v1-handoff.md) |
| Fix build or content errors | [Troubleshooting](docs/DEVELOPMENT.md#troubleshooting) |

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Static export to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run sync:content` | Regenerate piece + series MDX from `scripts/content-catalog.mjs` (uses existing `public/works/`) |
| `npm run sync:content:sources` | Same as above, plus copy `sources/{key}.*` → `public/works/{key}.jpg` |
| `npm run validate:content` | Check catalog ↔ MDX ↔ `public/works/` (runs automatically before `npm run build`) |
| `npm run generate:placeholders` | Regenerate SVG stubs in `public/placeholders/` |
| `npm run seed:content` | Reset MDX seed content (destructive — overwrites pieces) |

## Routes (v1)

| URL | Page |
|-----|------|
| `/` | Home — full-bleed splash, links to series and grid |
| `/astronaut-dreams` | 12-work exhibition |
| `/work` | Featured works grid — filters: `?series=astronaut-dreams`, `?series=other`, `?year=2024` |
| `/work/<id>` | Single piece (`id` = MDX filename without `.mdx`, e.g. `astronaut-dreams-03`) |
| `/about`, `/contact` | Bio and contact placeholders |

## Not in v1

Deploy config, CMS, shop/prints, contact form backend, WebGL viewers, full ~130-image archive.
