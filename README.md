# Griffin Portfolio

Static editorial portfolio for 3D rendered stills. Built with Astro 6 and MDX — exhibition-style pages, file-based content, no CMS in v1.

**Live site:** https://funkatron.github.io/griffin-portfolio/ (GitHub Pages — auto-deploy on push to `main`)

Deeper docs: [Developer guide](docs/DEVELOPMENT.md) (how to change content, assets, and theme) · [v1 handoff](docs/delivery/portfolio-v1-handoff.md) (what shipped, open items, verification).

## How this site was built

If you want to see **how v1 was planned and built** (brainstorm → scope → implementation), start here:

| What | Where |
|------|--------|
| **Task plan** — routes, acceptance criteria, stack choices, what was in/out of scope | [.cursor/plans/griffin_portfolio_v1_34fee3c5.plan.md](.cursor/plans/griffin_portfolio_v1_34fee3c5.plan.md) |
| **Session transcript** — full Cursor chat that implemented the plan (decisions, fixes, deploy notes) | [.cursor/transcripts/portfolio-v1-session-09eb1208.md](.cursor/transcripts/portfolio-v1-session-09eb1208.md) |

Those two files are the paper trail for this repo. The [developer guide](docs/DEVELOPMENT.md) is the ongoing how-to; the plan and transcript are the build story.

## Requirements

- Node.js ≥ 24.0.0 (Active LTS — see `.nvmrc`)
- npm 10+

If you use `nvm`, run `nvm use` before install. Otherwise install Node 24 manually (fnm, volta, or nodejs.org) and confirm with `node -v`.

## Quickstart

If you only run one sequence, run this:

```bash
nvm use
npm install
npm run dev
```

Then open http://localhost:4321.

What that does:

1. `nvm use` — selects Node 24 from `.nvmrc`.
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
| See how v1 was planned and built | [Plan](.cursor/plans/griffin_portfolio_v1_34fee3c5.plan.md) · [Session transcript](.cursor/transcripts/portfolio-v1-session-09eb1208.md) |
| Fix build or content errors | [Troubleshooting](docs/DEVELOPMENT.md#troubleshooting) |
| Deploy to production | [Deploy](docs/DEVELOPMENT.md#deploy) below · full guide in dev doc |

## Deploy

**Production:** https://funkatron.github.io/griffin-portfolio/ — published by `.github/workflows/deploy-pages.yml` on every push to `main`.

Static site — build locally or in CI, upload `dist/` to any static host.

```bash
npm run build
```

**Build settings (all hosts):**

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | ≥ 24.0.0 (`.nvmrc`) |

**Environment variables at build time:**

| Variable | When to set | Example |
|----------|-------------|---------|
| `SITE_URL` | Always in production (canonical + Open Graph) | `https://portfolio.example.com` |
| `BASE_PATH` | GitHub Pages **project** site only (`username.github.io/repo-name/`) | `/griffin-portfolio` |

**Root deploy** (Vercel, Netlify, Cloudflare Pages, custom domain) — set `SITE_URL` only:

```bash
SITE_URL=https://portfolio.example.com npm run build
```

**GitHub Pages project site** — set both (matches repo `funkatron/griffin-portfolio`):

```bash
SITE_URL=https://funkatron.github.io/griffin-portfolio \
BASE_PATH=/griffin-portfolio \
npm run build
```

Step-by-step for [Vercel](docs/DEVELOPMENT.md#vercel), [Netlify](docs/DEVELOPMENT.md#netlify), [Cloudflare Pages](docs/DEVELOPMENT.md#cloudflare-pages), [GitHub Pages](docs/DEVELOPMENT.md#github-pages) (auto-deploy on push to `main`), and [manual upload](docs/DEVELOPMENT.md#manual-or-any-static-host) are in [docs/DEVELOPMENT.md#deploy](docs/DEVELOPMENT.md#deploy).

After deploy, spot-check `/`, `/astronaut-dreams`, `/work?series=other`, and one project page. Work grid filters run in the browser — they work on static hosts. Pushes to `main` publish automatically via GitHub Actions.

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

CMS, shop/prints, contact form backend, WebGL viewers, full ~130-image archive.
