// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { DEFAULT_LOCALE, localeCodes } from './src/i18n/locales.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://surea11y.dev',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/from/'),
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(localeCodes.map((code) => [code, code]))
      }
    })
  ],
  i18n: {
    locales: localeCodes,
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: false
    }
  }
});
