// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Production: set SITE_URL to your public origin (canonical + Open Graph).
  site: process.env.SITE_URL ?? 'https://funkatron.github.io/griffin-portfolio',
  // Subpath hosts (e.g. GitHub Pages project site): BASE_PATH=/griffin-portfolio
  // Root deploy (Vercel, Netlify, custom domain): leave BASE_PATH unset.
  ...(process.env.BASE_PATH ? { base: process.env.BASE_PATH } : {}),
  integrations: [mdx()],
});
