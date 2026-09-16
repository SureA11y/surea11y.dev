# surea11y.dev — project context

The docs and rules site for `@surea11y/core`. Scaffold only as of 2026-09-16 —
Astro + `@astrojs/react`, design tokens wired in. As of the same day it also
has: a nav/page shell (`BaseLayout`/`SiteNav`, one stub page per IA section),
and a first pass at wiring in real `design_system` React components (`Logo`,
`Callout`, copied into `src/components/design-system/` — see below). Still
no rule-page generator, and only those two components are wired in so far.

## Where things come from (all sibling directories on this machine)

- `../internal-notes/docs-site-architecture.design.md` — the full site IA:
  seven sections (Overview, Getting Started, Rules, Configuration, Results &
  Reports, Conformance, Troubleshooting), each mapped to a specific source
  doc, plus what's explicitly GitHub-only and excluded from the public site.
  Read this first. (`internal-notes` is a private repo.)
- `../core/docs/RULE_CATALOG.md` — one row per rule (id, title, WCAG SC,
  level, confidence, severity) plus description/applicability/expectation.
  Generated from the compiled engine; regenerate via
  `cd ../core && npm run docs:rule-catalog` if it looks stale — check
  `../core`'s git log, this file may have moved on since 2026-09-16.
- `../core/docs/RULE_EXAMPLES.md` — one verified `Passed`/`Failed` (or
  `Flagged`/`Not applicable` for manual rules) example pair per rule, all
  132. Hand-curated, not generated, not yet CI-checked.
- `../design_system/tokens/*.css` — design tokens (colors, typography,
  spacing, motion, elevation, radius). Copied into `src/styles/tokens/`
  here; that's the source of truth, re-copy if it changes rather than
  editing the copies in this repo.
- `../design_system/components/` — 18 React (JSX) components (`Badge`,
  `Button`, `Card`, `CodeBlock`, `Tag`, etc.), organized by category
  (brand/core/data/disclosure/feedback/forms/navigation/results). No
  `package.json` there — it's an exported design canvas (`.dc.html`
  sources, bundled JS, `guidelines/`), not an npm package — so components
  are copied into `src/components/design-system/`
  here (mirroring the same category subdirectories, so relative imports
  between components resolve unmodified) rather than depended on, same
  source-of-truth relationship as the tokens above. Only `brand/Logo`,
  `brand/Icon` (a `Callout` dependency), and `feedback/Callout` are copied
  in so far — the rest come in as pages actually need them, not speculatively.
  `Badge`'s `tone` prop already speaks the engine's own outcome vocabulary
  (`pass`/`fail`/`unknown`/`advisory`).
- `../design_system/CLAUDE.md` — locked brand decisions (voice, naming,
  color meanings, type). Site copy and any new components should follow it.

## Why Astro without Starlight

Decided over Starlight specifically because `design_system/components/`
turned out to be a real React component library, not just tokens, and the
goal is genuine control over layout/styling built from those components —
not a themed docs framework fought into shape. Content-collection-driven
page generation (one page per rule, from `RULE_CATALOG.md`/`RULE_EXAMPLES.md`
as structured data) is still the plan; Astro supports that natively.

## Next steps

1. ~~Nav/page shell matching the seven-section IA.~~ Done — `BaseLayout` +
   `SiteNav`, one stub page per section.
2. A generator turning `RULE_CATALOG.md` + `RULE_EXAMPLES.md` into one page
   per rule (132), likely by having `core` emit structured JSON rather than
   parsing the Markdown here — check whether that's landed in `core` before
   building a Markdown parser against it.
3. Import and wire up more `design_system` React components in place of raw
   HTML, as pages need them (`Badge`/`Tag` for rule pages, `Card` for
   result/report examples, etc.) — `Logo` and `Callout` are done.
4. The net-new content the design doc calls out: an Overview page, the
   "Usage" shared-concept subsection of Getting Started, and reader-facing
   adaptations of `RULE_TAXONOMY.md`/`I18N.md`/each binding's README.
