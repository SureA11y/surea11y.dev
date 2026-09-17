# surea11y.dev — project context

The docs and rules site for `@surea11y/core`. Scaffold only as of 2026-09-16 —
Astro + `@astrojs/react`, design tokens wired in. As of the same day it also
has: a nav/page shell (`BaseLayout`/`SiteNav`, one stub page per IA section),
Overview turned into a section-index landing (badges + a card grid linking
the other six sections), a real Rules catalog + 132 generated rule pages
(see `scripts/generate-rules-data.cjs` below), and `design_system` React
components wired in where real content maps to them (copied into
`src/components/design-system/` — see below). All seven IA sections have
real content now, including both pieces of net-new prose the IA doc calls
out (the real Overview page, and a "How rules are organized" page under
Rules at `/rules/organization/`) — see "Where things come from" and
"Next steps" below for how each was written.

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
- **Configuration, Results & Reports, Conformance, and Help are
  each split into per-topic subpages**, not one long page: every section
  index (`/configuration/`, `/results-reports/`, `/conformance/`,
  `/help/`) has its own real intro content — one `.jsx`
  component per section (`ConfigurationContent.jsx`,
  `ResultsReportsContent.jsx`, `ConformanceContent.jsx`,
  `HelpContent.jsx`, distinct from and much shorter than the
  per-topic subpage components below, same naming convention as
  `GettingStartedContent.jsx`), one `<h2>` per subtopic with a real
  paragraph explaining what it covers and why a reader would want it, not
  just a link teaser — plus `SectionMenu.astro` underneath (a generic
  `sections: {href, label}[]` local-nav menu, repeated on every subpage of
  that section so switching topics never dead-ends back through the index
  — same reasoning and the same non-color-only active-state cue,
  `aria-current` + bottom border, no font-weight, as `SiteNav` and the
  Getting Started menu below). This started as a one-line teaser + menu
  and nothing else; the user flagged that as too bare — an index page
  that's just a menu under one sentence doesn't orient or sell the section,
  it just routes. Rewritten with real per-topic paragraphs, and pushed to
  explain the *value* of each topic (why you'd reach for it, what it saves
  you), not just describe its contents — per explicit voice feedback: this
  site is also selling the tool, not just documenting it, so index prose
  shouldn't read cold. Stayed inside the locked brand voice doing it
  (`../design_system/CLAUDE.md`): plain and certain, sells through
  specificity and confidence, never through hype words like "empower" or
  "solutions." Each subpage's content lives in its own `.jsx` component
  (never raw `.astro` markup — see the whitespace-bug note below) with the
  section's original H2 becoming that page's `<h1>` and every descendant
  heading promoted one level (H3→H2, H4→H3) to keep a valid hierarchy.
  Section data lives in `src/data/{section}Sections.ts`.
  This started as one long page per section (each built as a near-verbatim
  drop-in from source docs, described below); split later once the pages
  were confirmed too long to navigate, same alfa.siteimprove.com-inspired
  pattern as Getting Started's own split.
  - `/configuration/` ← `ENGINE_OPTIONS.md` + `CI_INTEGRATIONS.md` +
    `I18N.md` → `EngineOptionsContent.jsx` (`/configuration/engine-options/`),
    `CiIntegrationContent.jsx` (`/configuration/ci-integration/`),
    `LocalesContent.jsx` (`/configuration/locales/`). One deliberate
    deviation from the IA doc's literal text: it names only `I18N.md`'s
    "Adding your language" section as excluded (contributor-facing), but
    the very next H2, "Maintaining the locales" (`npm run
    i18n:sync`/`i18n:check`/`i18n:report` as repo-maintainer commands), is
    the same class of content — nothing an `@surea11y/core` *consumer*
    could run without `core`'s own source checked out — so it's left off
    the site too, on the same reasoning the IA doc used for its neighbor,
    not because the IA doc said to. Worth confirming this reading is
    right. Also referenced from `ENGINE_OPTIONS.md` but never classified
    anywhere in the IA doc: `API_STABILITY.md` — not imported, linked to
    GitHub as a fallback; flagging here since it's a gap in the IA doc
    itself, not a decision already made for it.
  - `/results-reports/` ← `OUTPUT_SCHEMA.md` + `REPORT.md` + `SARIF.md` +
    `EARL.md` → `OutputSchemaContent.jsx` (`/results-reports/output-schema/`),
    `HtmlReportContent.jsx` (`/results-reports/html-report/`),
    `SarifReportContent.jsx` (`/results-reports/sarif-report/`),
    `EarlReportContent.jsx` (`/results-reports/earl-report/`) — the biggest
    of these pages by far (~10 `DataTable`s, most of `OUTPUT_SCHEMA.md`'s
    type blocks as `CodeBlock`). The four source docs cross-reference each
    other; what were in-page anchors while this was one page
    (`#output-schema`/`#html-report`/`#sarif-report`/`#earl-report`) are now
    cross-page links to the corresponding subpage.
  - `/conformance/` ← `WCAG_CONFORMANCE.md` + `BASELINE.md` →
    `WcagMappingContent.jsx` (`/conformance/wcag-mapping/`),
    `BaselineContent.jsx` (`/conformance/baseline/`); the "How a
    composite's outcome is computed" table is a `DataTable`, and the
    baseline CLI transcript is a `CodeBlock` with the two real `surea11y
    scan` lines marked `command: true` (the `#` comment lines aren't —
    `CodeBlock` has no comment styling of its own, so they're just plain
    text, matching the source). One correction made while adapting, not
    just relinking: `WCAG_CONFORMANCE.md`'s own link to `RULE_CATALOG.md`'s
    composite table used the anchor `#composite-wcag-sc-rollup-rules-33`,
    but that file's heading currently reads "(34)" — the source doc's own
    link had gone stale. Check a doc's live heading before reusing one of
    its internal anchors, don't assume it's still accurate.
  - `/help/` ← `TROUBLESHOOTING.md` + `LIMITATIONS.md` →
    `FaqContent.jsx` (`/help/faq/`), `KnownLimitationsContent.jsx`
    (`/help/known-limitations/`); each FAQ entry's own `<h3>`
    promoted to `<h2>` on the split. What was an in-page
    `#known-limitations` anchor while both lived on one page is now a
    cross-page link from the FAQ subpage to the Known Limitations subpage.
    Section renamed from the IA doc's "Troubleshooting" to "Help" (route
    `/help/`, component `HelpContent.jsx`) — "Troubleshooting" reads as
    something-is-wrong even though half the content (FAQ) isn't.
  - Cross-reference rule used throughout every split above and reused for
    every other page's incoming links: a link into a doc that now maps to
    one of our own subpages points directly at that subpage, with a
    `#anchor` only if the subpage actually carries that `id`; a link into a
    doc the IA doc marks GitHub-only (`INTEGRATION.md`, `RULE_AUTHORING.md`,
    `POLICY.md`, `ACT_RULE_MAPPING.md`, `API_STABILITY.md`) points at
    `https://github.com/SureA11y/core/blob/main/docs/<file>.md` instead,
    keeping its anchor since GitHub renders those.
  - This content lives in `.jsx` files, not `.astro` pages directly, for a
    real reason: a plain `.astro` template silently drops the whitespace
    between a line of text and an inline tag (`<a>`/`<code>`) that starts
    the next line, instead of collapsing it to a space the way HTML/JSX
    normally would — invisible until you read the rendered text closely.
    JSX doesn't have this bug. Any future page with this much inline-linked
    prose should go straight to a `.jsx` content component rather than risk
    it in `.astro` markup.
  - Verification after every section split: `npm run build`, then a
    Node script (walk `dist/`, build the route set from
    `index.html`-containing directories, build an `id="..."` set per
    route, confirm every `<a href>` resolves to a real route and, if it
    carries a `#anchor`, that the anchor exists on the target route) — run
    per section, not just once at the end, since a mistake here is silent
    until audited.
- `../core/docs/INTEGRATION.md` (Standalone section, Pattern 3) plus each
  binding's own `README.md` — `../cypress`, `../playwright`, `../puppeteer`,
  `../selenium`, `../webdriverio`, `../cli`, all sibling directories here
  too — feed `/getting-started/`'s per-binding pages. Unlike every other
  content page, this one is **not** a near-verbatim drop-in: each binding
  README is 150-220 lines and the IA doc explicitly says to pull only
  "install + minimal usage" from each, leaving the rest (advanced builder
  options, TypeScript types, binding-internals sections) on that binding's
  own README/GitHub. Real install-time gotchas were kept where they
  directly affect the shown usage snippet (Playwright's separate
  browser-install step, WebdriverIO's BiDi-vs-classic-WebDriver performance
  note tied to the capability flag in its own example) — everything past
  "does this work" was cut. The "results is the engine's own native shape,
  not violations/passes/incomplete" differentiator, which every binding
  README repeats verbatim for its own standalone readers, is stated once
  on the `/getting-started/` index instead of seven times.

  **Page shape corrected after launch**: this started as one flowing page
  with anchor-linked subsections — the internal IA doc's stated reason was
  "closer to alfa's actual pattern," but checking the real
  `alfa.siteimprove.com/code-checker/getting-started/usage` page directly
  showed that premise was wrong: alfa uses a separate URL per framework,
  linked from a plain list, not one long page. Rebuilt to match: `/getting-started/`
  is now an index (Installation + shared Usage intro + a picker menu,
  `src/components/GettingStartedContent.jsx` + `SectionMenu.astro`),
  and each binding gets its own route
  (`/getting-started/{cypress,playwright,puppeteer,selenium,webdriverio,cli,standalone}/`).
  `SectionMenu.astro` (the generic component the other four sections'
  splits later reused — see above) repeats on every one of those pages
  (not just the index, unlike alfa) so switching bindings never dead-ends
  back through the index — confirmed with the user as a deliberate
  improvement, not an oversight. Data lives in
  `src/data/gettingStartedSections.ts` (menu entries) and
  `src/data/bindingUsage.jsx` (the 5 true bindings' install/usage/note
  content, spread as props into `src/components/UsageBindingSection.jsx`
  per page); CLI and Standalone don't fit that shape (extra output-sample
  block; several standalone paragraphs) and keep their own bespoke
  `CliUsageContent.jsx`/`StandaloneUsageContent.jsx`.
- `../core/README.md` grounds the real Overview page
  (`src/components/OverviewContent.jsx`) — the net-new content the IA doc
  calls for turned out to already be mostly written: the README's tagline,
  "Which package do I need?" table, outcome vocabulary, ACT-corpus
  verification numbers (798 examples/58 rules/zero false positives), key
  principles, and Philosophy section are adapted, not invented. Left out
  deliberately: Installation/Quick Start (that's `/getting-started/`'s
  job, already built), the Documentation table (a sitemap of `core`'s own
  docs, redundant with this site's own nav), and everything
  contributor-facing (Project Structure, Building, Contributing, Security,
  Versioning, Maintainer, License). The four-outcome list uses
  `ResultBadge`, not `Tag` — results need the five-state
  colour+glyph+word treatment, `Tag` has no glyph and is documented for
  categories/filters, not results; this was a real mistake caught and
  fixed while writing the page, not a first-try decision.
- `../core/docs/RULE_TAXONOMY.md` grounds `/rules/organization/`'s "How
  rules are organized" (`src/components/RuleOrganizationContent.jsx`), the
  other net-new piece. This one genuinely needed adaptation, not a
  drop-in: the source is a rule-*authoring* doc (MUST/MUST NOT constraints,
  internal field references like `meta.type`/`data.visibilityFilter.targetSet`).
  Kept: automatic-vs-manual (what a reader needs to correctly weight a
  `fail` vs a `cantTell`), the family+intent rule-id naming convention
  (§1.2/1.3 — this is also literally the logic `computeRelated` in
  `scripts/generate-rules-data.cjs` implements, so this page is the
  reader-facing explanation of a mechanism the site already uses), and a
  light pass on WCAG facets linking to Conformance's fuller treatment. Cut
  entirely: target-set/tree-scope (§1.4) and mechanism-type (§1.5) — pure
  rule-authoring internals with no reader-facing payoff, same reasoning
  that keeps `RULE_AUTHORING.md` itself GitHub-only. Linked from
  `/rules/`'s intro paragraph, since nothing else on the site pointed to
  it.
- `../design_system/tokens/*.css` — design tokens (colors, typography,
  spacing, motion, elevation, radius). Copied into `src/styles/tokens/`
  here; that's the source of truth, re-copy if it changes rather than
  editing the copies in this repo. `colors.css` was re-copied after
  design_system flipped its locked "dark is primary surface" brand
  decision to light-primary — see its `CLAUDE.md`'s Direction/Colour
  bullets. `:root` now carries the light-surface values by default;
  `[data-surface="dark"]` is the opt-in override (the terminal/`CodeBlock`
  stays on it unconditionally, deliberately, not via that attribute).
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
  resolves to a dark, on-light-surface color by default here (light is the
  default surface — see below) — that pairing is correct out of the box, no
  wrapper needed. Wrapping in `data-surface="dark"` flips those tokens back
  to their pale on-dark tones, which then fails the same white-on-pale
  contrast the old dark-default used to; avoid that wrapper for `Badge`
  unless the value cell's text color is also darkened to match.
  `pass`/`fail`/`unknown`/`advisory` are unaffected, they pin fixed
  `-on-light` colors regardless of surface. `DataTable`
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

## Navigation and layout

Rebuilt to match `alfa.siteimprove.com/code-checker`'s layout (not just its
per-topic content structure, matched earlier — the actual page shell): a
persistent left sidebar showing the full site tree, a right-hand "on this
page" table of contents, and breadcrumbs, replacing the earlier top-nav-bar +
horizontal-pill-menu-under-`<h1>` pattern (`SiteNav`'s section list and the
whole `SectionMenu.astro` component are gone).

- `src/data/siteTree.ts` — composes `sections.ts` (the 7 top-level entries)
  with the five existing per-section arrays
  (`gettingStartedSections`/`configurationSections`/`resultsReportsSections`/
  `conformanceSections`/`helpSections`) as children, keyed by
  section href. No new source-of-truth data. `Rules` gets one hand-picked
  child (`/rules/organization/`) rather than enumerating all 132 generated
  rule pages.
- `src/components/Sidebar.astro` — one `<details>` per top section used
  purely as a **toggle-state holder** (its `<summary>` carries no visible
  content, just an `aria-label`); the real `<ul>` of child links is an
  ordinary sibling shown via `.tree-section:has(details[open])
  .tree-children`, not nested inside `<summary>` (nesting an `<a>` inside
  `<summary>` is invalid interactive-content nesting). `open` is computed
  server-side from `Astro.url.pathname.startsWith(section.href)` — zero JS,
  consistent with the rest of this site.
- `src/utils/headings.ts` — `processHeadings(html)` runs on every page's
  rendered content (via `Astro.slots.render("default")` in `BaseLayout`,
  a real, current Astro API — verify the version in `package.json` before
  assuming otherwise if this ever looks stale) and regex-slugifies every
  `<h2>`/`<h3>` that doesn't already carry an `id`. Existing hand-authored
  ids (`filtering-by-wcag-version`, `rule-scoped-excludeselectors`,
  `top-level-result`, etc. — targets of real cross-page links elsewhere on
  the site) pass through completely unchanged; only headings with no id get
  one. `src/components/TableOfContents.astro` renders the result as a
  static link list — no scroll-spy/active-heading highlighting, since that
  needs `IntersectionObserver` and this site ships zero client-side JS by
  design.
- `src/components/Breadcrumbs.astro` — derived from `siteTree` and the
  current URL for every hand-written page automatically. The 132 generated
  `/rules/[slug]/` pages aren't (and shouldn't be) in `siteTree`, so
  `rules/[slug]/index.astro` is the one call site that passes an explicit
  `breadcrumbLabel={rule.title}` prop.
- `src/layouts/BaseLayout.astro` now captures each page's own slotted
  content as an HTML string (`Astro.slots.render`), runs it through
  `processHeadings`, and re-renders it via `set:html` alongside `Sidebar`/
  `Breadcrumbs`/`TableOfContents` in a responsive CSS grid (`.shell`,
  single column below 900px with a native `<details>` drawer for the
  sidebar, sidebar column from 900px, TOC rail added from 1200px — no JS
  at any width). The repeated `h1`/`h2`/`h3`/`p`/`li`/`code` style block
  every page used to carry is centralized here under `.prose :global(...)`
  — **any selector in `BaseLayout`'s own `<style>` that targets content
  arriving through `set:html` must use `:global()`**, since Astro's
  `data-astro-cid-*` scoping is baked in per source file before
  `slots.render()` ever captures the string; a page's own scoped selectors
  (e.g. `index.astro`'s `.section-card`) still work unmodified since their
  scope attribute travels with the markup.

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
3. ~~Import and wire up more `design_system` React components in place of
   raw HTML, as pages need them.~~ Done — `Logo`, `Callout`, `Badge`,
   `Card`, `Tag`, `CodeBlock`, `ResultBadge`, `DataTable`, used across
   every page that exists.
4. ~~Fill in every stub page with real content.~~ Done — all seven IA
   sections now have real content: ~~Help~~ (formerly Troubleshooting),
   ~~Conformance~~,
   ~~Configuration~~, ~~Results & Reports~~, and ~~Getting Started~~ (the
   one page built from each binding's own README rather than a single
   `core` doc — see above).
5. ~~The net-new content the design doc calls out, not a drop-in from any
   single source doc.~~ Done — the real Overview page
   (`src/components/OverviewContent.jsx`, grounded in `../core/README.md`)
   and `/rules/organization/`'s "How rules are organized"
   (`src/components/RuleOrganizationContent.jsx`, adapted from
   `RULE_TAXONOMY.md` — see above for both).

Nothing from the original scope in this file is left open. Real follow-up
work from here is either genuinely new scope (not yet asked for) or small
maintenance items already noted inline above (e.g. re-running
`docs:rules`/`docs:rule-catalog` if `core` moves on, wiring
`docs:rules:check` into CI if one gets set up) — check `../internal-notes`
for anything newer than this file before assuming there's nothing left.
