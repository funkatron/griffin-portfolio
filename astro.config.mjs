// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Override at build time: SITE_URL=https://your.domain npm run build
  site: process.env.SITE_URL ?? 'https://funkatron.github.io/griffin-portfolio',
  integrations: [mdx()],
});
