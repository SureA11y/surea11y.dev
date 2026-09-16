# surea11y.dev — project context

The docs and rules site for `@surea11y/core`. Scaffold only as of 2026-09-16 —
Astro + `@astrojs/react`, design tokens wired in. As of the same day it also
has: a nav/page shell (`BaseLayout`/`SiteNav`, one stub page per IA section),
Overview turned into a section-index landing (badges + a card grid linking
the other six sections), a real Rules catalog + 132 generated rule pages
(see `scripts/generate-rules-data.cjs` below), and `design_system` React
components wired in where real content maps to them (copied into
`src/components/design-system/` — see below). Getting Started,
Configuration, Results & Reports, Conformance, and Troubleshooting are
still stub pages.

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
  `scripts/generate-rules-data.cjs` (below) does **not** parse this file —
  it pulls the same catalog fields straight from `core.getChecksCatalog()`
  and each rule's JSDoc, the same API this doc's own generator calls.
- `../core/docs/RULE_EXAMPLES.md` — one verified `Passed`/`Failed` (or
  `Flagged`/`Not applicable` for manual rules) example pair per rule, all
  132. Hand-curated, not generated, not yet CI-checked. This one *is*
  parsed (`scripts/generate-rules-data.cjs`) — it's the only source for the
  example pairs, there's no API for them. Two format exceptions the parser
  already handles: `manual-review` has one example, not a pair (no
  `notApplicable` branch), and `duplicate-id`'s `**Failed**` heading carries
  a trailing annotation on the same line.
- `scripts/generate-rules-data.cjs` — writes `src/data/rules.generated.json`
  (132 rules: catalog fields + applicability/expectation + example pairs +
  `relatedRuleIds`, computed by stripping a rule id's last hyphen segment
  and grouping ids that share the remainder). `npm run docs:rules` to
  regenerate, `npm run docs:rules:check` to verify it's current — same
  committed-artifact relationship as the tokens/components below. Requires
  `../core/src/core.js` to be built and current.
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
  source-of-truth relationship as the tokens above. Copied in so far:
  `brand/Logo`, `brand/Icon` (a `Callout` dependency), `feedback/Callout`,
  `core/Badge`, `core/Card`, `core/Tag`, `core/CodeBlock`,
  `results/ResultBadge` (+ its `results/resultStates.js` data dependency),
  and `data/DataTable` — the rest come in as pages actually need them, not
  speculatively. `Badge`'s `tone` prop already speaks the engine's own
  outcome vocabulary (`pass`/`fail`/`unknown`/`advisory`), but `Card`'s
  `accent` prop is reserved for result states in tables/reports and must
  not appear on marketing/nav cards — see its own `.d.ts`. `Badge`'s
  `neutral`/`accent`/`accent2` tones always pair a white value-cell text
  with a *semantic* token (`--text-muted`/`--accent`/`--accent-2`), which
  resolves to a light, on-dark-surface color by default here — white-on-light
  fails contrast badly (as low as 2.05:1). Those tones read correctly only
  under `data-surface="light"` (wrap the usage in that, don't edit the
  copied component); `pass`/`fail`/`unknown`/`advisory` are unaffected,
  they pin fixed `-on-light` colors regardless of surface. `DataTable`
  ("runs, pages, packages, rules") is for static listings; `ResultsTable`
  is the wrong component for the rule catalog — its `state` column means a
  scan *outcome*, not a property of the rule itself. `src/components/RulesTable.jsx`
  and `src/components/RulePage.jsx` are project-authored wrappers, not
  design-system copies — `.astro` frontmatter can't write JSX, so anything
  needing a `render`/composed-JSX callback (the catalog table's link/Tag
  cells, a rule page's tag row and example blocks) has to live in a real
  `.jsx` file.
- `../design_system/CLAUDE.md` — locked brand decisions (voice, naming,
  color meanings, type). Site copy and any new components should follow it.

## Why Astro without Starlight

Decided over Starlight specifically because `design_system/components/`
turned out to be a real React component library, not just tokens, and the
goal is genuine control over layout/styling built from those components —
not a themed docs framework fought into shape. Page-per-rule generation from
structured data is done (`src/pages/rules/[slug]/index.astro`,
`getStaticPaths()` over `rules.generated.json`) — a plain JSON import and
dynamic route, not Astro's `astro:content` collections API; the data didn't
need a content-collection schema, just a build-time array.

## Next steps

1. ~~Nav/page shell matching the seven-section IA.~~ Done — `BaseLayout` +
   `SiteNav`, one stub page per section.
2. ~~A generator turning the rule catalog + examples into one page per
   rule.~~ Done — `scripts/generate-rules-data.cjs`, `/rules/` catalog
   index, `/rules/<id>/` × 132.
3. Import and wire up more `design_system` React components in place of raw
   HTML, as pages need them — done so far: `Logo`, `Callout`, `Badge`,
   `Card`, `Tag`, `CodeBlock`, `ResultBadge`, `DataTable`. Configuration,
   Results & Reports, and Conformance are still stub pages that will need
   more of these (e.g. `CodeBlock` for CI-config/report-format examples).
4. The net-new content the design doc calls out: an Overview page, the
   "Usage" shared-concept subsection of Getting Started, reader-facing
   adaptations of `RULE_TAXONOMY.md`/`I18N.md`/each binding's README, and
   the "How rules are organized" page under Rules (`RULE_TAXONOMY.md`
   needs adaptation, not a verbatim drop-in — see the IA doc).
