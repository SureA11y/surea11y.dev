'use strict';

/**
 * Generate src/data/locales.generated.json from the installed
 * @surea11y/core package's getLocaleCoverage(), so the locales page never
 * hand-types coverage numbers that can drift from the dictionaries the
 * release the site depends on actually ships.
 *
 * Usage:
 *   node scripts/generate-locale-data.cjs
 *   node scripts/generate-locale-data.cjs --check
 */

const fs = require('fs');
const path = require('path');

const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'locales.generated.json');

// The report has no notion of a language's display name -- add one here as
// each new locale file ships. Missing from this map is treated as a bug,
// not silently skipped, so the page never renders a bare code.
const LOCALE_NAMES = {
  en: 'English',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  ja: 'Japanese'
};

function parseArgs(argv) {
  const out = {};
  for (const a of argv) if (a.startsWith('--')) out[a.slice(2)] = true;
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  const { getLocaleCoverage } = require('@surea11y/core');
  const coverage = getLocaleCoverage();
  const totalKeys = coverage.totalKeys;
  const rows = coverage.locales;

  const locales = [
    {
      id: 'en',
      name: LOCALE_NAMES.en,
      file: 'src/i18n/en.json',
      keys: totalKeys,
      stillEnglish: null,
      missing: 0,
      orphaned: 0,
      canonical: true
    },
    ...rows.map((r) => {
      const name = LOCALE_NAMES[r.locale];
      if (!name) {
        throw new Error(
          `generate-locale-data: no display name for locale "${r.locale}" -- add one to LOCALE_NAMES`
        );
      }
      return {
        id: r.locale,
        name,
        file: `src/i18n/${r.locale}.json`,
        keys: r.total,
        stillEnglish: r.total - r.translated,
        missing: r.missing,
        orphaned: r.orphaned.length,
        canonical: false
      };
    })
  ];

  const json = JSON.stringify({ totalKeys, locales }, null, 2) + '\n';

  if (args.check) {
    const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : null;
    if (current !== json) {
      console.error(`[generate-locale-data] ${OUT_PATH} is stale. Run: npm run docs:locales`);
      process.exit(1);
    }
    console.log('[generate-locale-data] locale data is up to date.');
    return;
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, json);
  console.log(`[generate-locale-data] wrote ${OUT_PATH} (${locales.length} locales)`);
}

main();
