# surea11y.dev — project context

The docs and rules site for `@surea11y/core`. Scaffold only as of 2026-09-16 —
Astro + `@astrojs/react`, design tokens wired in. As of the same day it also
has: a nav/page shell (`BaseLayout`/`SiteNav`, one stub page per IA section),
Overview turned into a section-index landing (badges + a card grid linking
the other six sections), a real Rules catalog + generated rule pages (134 as of core 1.12.0)
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
  of them. Hand-curated, not generated; since core 1.10.0 core's CI runs
  every example against the engine (`rule-examples:outcomes:check`). This one *is*
  parsed (`scripts/generate-rules-data.cjs`) — it's the only source for the
  example pairs, there's no API for them. Format variations the parser
  handles: one to four examples per rule (`manual-review` has one; a rule
  with a tiered outcome adds a third, `Flagged (cantTell)`;
  `form-control-programmatic-label-quality` has three `cantTell` cases, so
  four); an annotation
  after the bold heading (`duplicate-id`) is dropped; a qualifier inside it
  (`**Passed (in a browser)**`) becomes an example `context`, mapped to a
  translated label via `EXAMPLE_CONTEXT` and `rulePage.exampleContext.*` —
  an unknown qualifier fails the generator rather than being dropped.
- `scripts/generate-rules-data.cjs` — writes `src/data/rules.generated.json`
  (one entry per rule: catalog fields + applicability/expectation + example pairs +
  `relatedRuleIds`, computed by stripping a rule id's last hyphen segment
  and grouping ids that share the remainder). `npm run docs:rules` to
  regenerate, `npm run docs:rules:check` to verify it's current — same
  committed-artifact relationship as the tokens/components below. Reads
  the installed `@surea11y/core` package (the pinned devDependency, via
  `require.resolve`), never a `../core` checkout, so the site's rule text
  always matches a release; it ships `src/checks`, `src/core.js` and
  `docs/`. Reads three JSDoc tags
  from each rule module: `@applicability`, `@expectation` and `@reports`
  (since core `d7b4725`, after 1.9.0: the fields a rule's findings carry
  in `data.details`, one `- ` line each). `@reports` renders on rule pages
  as "What a finding reports", with a note that those fields aren't a
  stable contract apart from `reasonCode`, linking to the Output schema's
  `#occurrence`. A locale whose rule overlay has no `reports` yet shows
  the English list marked `lang="en"` (`reportsLang` in `localizeRule`).
  Since core 1.10.0 it also carries a rule's `margin` (`meta.margin` from
  the catalog: `measure`, `unit`, `limit`), shown on the five rule pages
  that report one as a "Margin." line linking to the Output schema's
  `#margin`; unlike `@reports`, that is a stable contract.
  `scripts/generate-locale-data.cjs` reads core's `getLocaleCoverage()`
  (a supported export since 1.10.0) from the same package. Both
  `docs:rules:check` and `docs:locales:check` run in CI, so a core bump
  (Dependabot) fails until `npm run docs:rules && npm run docs:locales`
  is run and any outdated translations are updated. See
  `internal-notes/surea11y-dev-a11y-ci.design.md` §8.1, decision 4.
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
  (`../branding/CLAUDE.md`): plain and certain, sells through
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
  - `/configuration/` ← `ENGINE_OPTIONS.md` + `PACKS.md` + `CI_INTEGRATIONS.md` +
    `I18N.md` → `EngineOptionsContent.jsx` (`/configuration/engine-options/`),
    `PacksContent.jsx` (`/configuration/packs/`),
    `CiIntegrationContent.jsx` (`/configuration/ci-integration/`),
    `LocalesContent.jsx` (`/configuration/locales/`). `PACKS.md` (core 1.11)
    postdates the IA doc, which has no place for it; it went under
    Configuration as its own subpage, second in the menu, because a pack is
    passed in `engineOptions.packs` and chosen with `engineOptions.profile`.
    The page covers using a pack (Node, the browser bindings, Cypress's
    plugin, test-matchers, the CLI, a page of your own), what a scan reports,
    a skipped pack, and writing one with `surea11y-pack new` (names,
    profiles, checklist items, messages, tests, publishing), with the
    bindings' `examples/acme-policy-pack.js` as the running example. How to
    write a rule's `runInPage` stays on GitHub (`RULE_AUTHORING.md`,
    `PACKS.md`): rule authorship is GitHub-only by the canonical-source rule
    below. Engine options keeps a short "Packs" section linking to it.
    `I18N.md`'s "Notes on individual locales" (per-language translation
    terms for the engine's dictionaries) is contributor-facing too and stays
    off the Locales page. One deliberate
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
  - **Canonical source, formalized**: the site owns adoption, product
    usage, concepts, decisions, recipes, and stable reference for
    consumers; GitHub owns contribution, internal architecture, rule
    authorship, development process, and repo policy. The
    cross-reference rule above is this principle applied at the link
    level — a topic that stays on GitHub gets a real link plus a short
    description of what's there, never a bare filename standing alone.
    Audited the four highest-traffic entry points to a GitHub-only doc
    (`EngineOptionsContent.jsx`, `CiIntegrationContent.jsx`,
    `LocalesContent.jsx`, `FaqContent.jsx`, both languages) against this:
    every `${core}/docs/*.md` link in those eight files already carries
    an adjacent description, so no fix was needed there. Didn't extend
    the audit to the remaining ~15 files x 2 languages using the same
    `${core}` link convention — disproportionate for what a full sweep
    would likely find, given the sampled files were already consistent.
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
  verification numbers (since 1.12: 942 W3C test cases/59 rules/zero false positives), key
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
- The design system lives in `../branding` (GitHub `rumoroso/branding`);
  `rumoroso/design_system` is an older, stale copy. "design_system" below
  means this repo.
- `../branding/tokens/*.css` — design tokens (colors, typography,
  spacing, motion, elevation, radius). Copied into `src/styles/tokens/`
  here; that's the source of truth, re-copy if it changes rather than
  editing the copies in this repo. `colors.css` was re-copied after
  design_system flipped its locked "dark is primary surface" brand
  decision to light-primary — see its `CLAUDE.md`'s Direction/Colour
  bullets. `:root` now carries the light-surface values by default;
  `[data-surface="dark"]` is the opt-in override (the terminal/`CodeBlock`
  stays on it unconditionally, deliberately, not via that attribute).
- `../branding/components/` — 18 React (JSX) components (`Badge`,
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
  `.jsx` file. `DataTable` (since `branding` 78197e5) never clips: cells
  wrap with automatic layout, the table scrolls sideways below `minWidth`
  (36rem; the rules catalog passes 54rem), and the wrapper is a focusable
  region named by `label` or `caption` — so give every table one, in every
  language. Its focus ring is `.ds-data-table:focus-visible` in
  `global.css`; `BaseLayout` turns off inline code's `overflow-wrap:
  anywhere` inside tables so identifiers keep their column wide instead.
- `../branding/CLAUDE.md` — locked brand decisions (voice, naming,
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
  child (`/rules/organization/`) rather than enumerating all 134 generated
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
  current URL for every hand-written page automatically. The generated
  `/rules/[slug]/` pages aren't (and shouldn't be) in `siteTree`, so
  `[...lang]/rules/[slug]/index.astro` passes an explicit
  `breadcrumbLabel` prop, as does `[...page].astro` for the one registry
  page outside the tree (the accessibility statement).
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
  (e.g. the homepage's `.section-card`) still work unmodified since their
  scope attribute travels with the markup.

## Languages (i18n)

English at the root, every other language under its own prefix (`/es/…`).
Reworked from a hard-coded English/Spanish pair into an N-language setup
ahead of adding French, German and Japanese — one list of languages, one
route file per page shape instead of one per page per language, and English
fallback for anything not yet translated.

- `src/i18n/locales.ts` — the one list of languages (`code` + the
  language's own name, shown in the switcher). Everything else reads it:
  Astro's `i18n` config and the sitemap in `astro.config.mjs` (imported
  straight from the `.ts`), routes, the switcher, hreflang, `localizeLinks`.
- `src/i18n/paths.ts` — the URL scheme in one place: `localizePath`,
  `splitLocale` (the layout and nav derive the locale from the URL with it,
  not `Astro.currentLocale`), `localeStaticPaths` for `[...lang]` routes.
- Routes: `src/pages/[...page].astro` builds every entry of the page
  registry `src/data/pages.ts` (href, English title, content component or
  binding key) once per locale — adding a page is a registry entry plus
  its content component, no per-language route files. The homepage and the
  rules catalog/rule pages keep their own markup under `src/pages/[...lang]/`.
  `from/[source]` (referral redirects) is untouched.
- Strings: `src/i18n/<code>.json`, loaded automatically by `t.ts`.
  English source text for nav labels and page titles stays in the data
  files (`sections.ts`, `*Sections.ts`, `pages.ts`); translations of it go
  in the locale's dictionary as `nav:<href>`, `nav:<href>:description`,
  `page:<href>:title`, `page:<href>:description` (read via `tOr`). A label
  that's the same in every language (Cypress, CLI) is still listed in the
  locale's file, so "present" always means "reviewed".
- Prose: `Name.jsx` is English, `Name.<code>.jsx` its translation, with the
  same exports; `src/i18n/content.ts` picks the file. Rule prose:
  `src/data/rules.i18n.<code>.json`, merged by `localizeRule`.
- **Untranslated pages build anyway**, in English: the route passes
  `contentLocale="en"` to `BaseLayout`, which marks the content
  `lang="en"` (the chrome stays in the reader's language), shows a short
  "not translated yet" `Callout`, points `canonical` at the English page,
  and leaves the locale out of that page's hreflang set. Title and
  description follow the content's language, so nothing reads as a
  translated heading over English prose. Rule pages decide per rule.
- The language switcher is a plain link while there are two languages and
  a no-JS `<details>` menu from three on (tested with a throwaway `fr`
  entry, then removed).
- Lists of links joined in running text use `Intl.ListFormat`
  (`UsageBindingSection`), not a translated "and" — punctuation differs by
  language.
- Heading slugs (`src/utils/headings.ts`) fold Latin accents and keep any
  other letter, so Spanish/French/German headings get readable ids
  (`como-funciona`, not `c-mo-funciona`) and Japanese ones get non-empty
  ids. This changed every auto-generated Spanish id once; nothing on the
  site linked to the old ones (link audit clean).
- `npm run i18n:check` — per-locale coverage (interface strings, nav/page
  titles, content pages, rule pages) and hard errors for unknown keys,
  mismatched `{placeholders}`, a translation whose exports differ from the
  English file, or a rule overlay that doesn't match the catalog.
  `--strict` also fails on anything missing; `--locale=fr` narrows it.
  On Node < 22.18 it can't load `locales.ts` (`ERR_UNKNOWN_FILE_EXTENSION`);
  run `node --experimental-strip-types scripts/check-i18n.mjs` instead.
- Outdated translations: `src/i18n/translation-sources.json` holds, per
  locale and unit (`content:components/FaqContent`, `string:<key>`,
  `rule:<id>`), a fingerprint of the English each translation was made
  from; `i18n:check` lists units whose English has changed since, and
  `npm run i18n:mark` records a unit as current after updating it (see
  README "Keeping translations current"). Logic shared in
  `scripts/lib/i18n-units.mjs`. Baseline recorded 2026-09-28 with every
  translation current (git history showed no English-only change after any
  Spanish file was written).
- `npm run check:links` — the post-build link/anchor audit described
  above, now a script; also flags a localized page linking out of its own
  locale (links carrying `hreflang`, i.e. the switcher, are exempt).
- `npm run check:meta` — post-build: every page (except `/from/`
  redirects) has a meta description of its own, matching its `og:` and
  `twitter:` descriptions, unique within its locale, and never the sitewide
  `layout.defaultDescription`. A new page in `pages.ts` needs a
  `description` (and `page:<href>:description` in each locale), or the
  check fails.

**Adding a language** (`fr` as the example):

1. Add `{ code: "fr", name: "Français" }` to `src/i18n/locales.ts`. The
   site builds every page under `/fr/` straight away, in English, with the
   notice.
2. `src/i18n/fr.json`: every key from `en.json` first (the site chrome and
   the notice itself), then the `nav:`/`page:` keys `npm run i18n:check
   -- --locale=fr` lists.
3. `Name.fr.jsx` next to each content component, and
   `src/data/bindingUsage.fr.jsx`; keep code, option names, outcome
   values (`passed`, `cantTell`, …) and hand-authored `id`s untranslated.
4. `src/data/rules.i18n.fr.json` for rule pages (same shape as the `es` one).
5. `npm run build && npm run check:links && npm run i18n:check`.

**French and German** were added on 2026-09-28, complete from the start
(all interface strings, nav/page titles, 24 content pages, 132 rule pages;
`i18n:check` shows no gaps). Translated from the English source, not the
Spanish. Conventions, so later edits stay consistent:

- Code, option/field names, rule ids, outcome values (`pass`, `fail`,
  `cantTell`, …), CLI transcripts and code comments stay English; every
  code block was verified byte-identical to the English page's.
- French: "vous"; non-breaking space before `: ; ? !` and inside « » in
  prose (not in code); typographic apostrophes. Terms: règle, moteur,
  analyse, rapport, binding (m.), critère de succès, conformité, revue
  manuelle, Langues (page name; « langue » for the concept) / `locale`
  (option, locale codes, resolution reasons), landmark, arbre
  d'accessibilité, nom accessible, technologies d'assistance, gravité
  (severity), libellé (a form label; « étiquette » only in 2.5.3 « Étiquette
  dans le nom »), atteignable (reachable, never « accessible »). Not
  « paramètres régionaux »: that implies date/number formatting, and the
  engine only has message dictionaries.
- German: "Sie"; „…" quotes. Terms: Regel, Engine, Scan, Bericht, Binding
  (das), Erfolgskriterium, Konformität, Barrierefreiheit, manuelle Prüfung,
  Locales, Accessibility Tree, zugänglicher Name, Landmark, assistive
  Technologien, Ergebnis (outcome; not "Outcome"), Schweregrad/Konfidenz
  (severity/confidence), Befund (a finding), Vorkommen (an occurrence).
  Gender-neutral wording where a person is described (Nutzende, Personen,
  die …, prüfende Person), not "Nutzer"/"Tester"/"Auditor". No "sauber" for
  outcomes: a clean scan is "ohne Befunde"; exit code `0` is "bestanden"
  (it still allows `cantTell`). Not "ein Pass": "ergibt `pass`" / "gilt
  als bestanden".
- Official W3C French/German names are used for WCAG criterion titles
  (e.g. 4.1.1 "Analyse syntaxique" / "Syntaxanalyse"; 2.5.3 « Étiquette
  dans le nom » / „Beschriftung im Namen“).
- Obligation level follows the English exactly, in every language: "must"
  → doit / muss / 〜してはいけません・〜なければなりません; "should" and
  advisory wording → devrait / sollte / 〜を推奨します・〜が望ましい. A manual
  rule's wording never reads as a definite failure.
- Sample page text inside examples ("Read more", "Save changes") and
  engine output strings stay English, since they refer to the English
  markup or real output.
- Link text naming another page uses that page's nav label from the
  locale's dictionary.

**Japanese** was added the same day, also complete. What it needed beyond
translation, and what to keep in mind when editing it:

- `spaced: false` on its `locales.ts` entry; `wordSeparator()` returns ""
  for it. Sentences containing links or code are whole-sentence templates
  rendered by `src/i18n/Trans.jsx` ("See {policy} for…"), never fragments
  joined with spaces, in every language.
- JSX turns a line break between two lines of text into a space. In
  Japanese content files, a paragraph's text stays on one line, lines break
  only next to a tag, and there are no `{" "}` joins. No spaces between
  Japanese and Latin text or code either; `text-autospace` adds the visual
  gap. `npm run check:typography` catches violations in the build.
- `:lang(ja)` in `global.css`: Japanese system fonts named after the brand
  fonts, taller line height, strict line breaking, phrase-aware heading
  breaks, bold instead of italic.
- Style: です・ます, full-width punctuation, 「」 quotes, official WAIC names
  for WCAG criteria. Terms: ルール, エンジン, スキャン, 判定結果, バインディング,
  達成基準, 適合性, 複合ルール, 構成ルール, ファセット, アクセシブルな名前,
  アクセシビリティツリー, 支援技術, 誤検出. 2.5.3 is 「ラベルを含む名前
  ([[en:name]])」. The accessibility statement page is 「このサイトのアクセシビリティ」
  (title and footer link), not 「方針」 (that reads as a JIS X 8341-3 policy
  with targets) or 「声明」. Keep
  「必要があります」 for genuine "must"s only; "must not" titles use
  「〜してはいけません」.
- The engine ships a `ja` locale since core 1.8.0, so Japanese engine
  output exists too; the Locales page still notes that this site's Japanese
  translation is separate from the engine's report languages.
- Rule prose marks other-language text with `[[<code>:…]]` (`[[en:…]]`,
  `[[fr:…]]`, …), rendered by `RuleText` as `<span lang>`;
  `check:lang` skips any element marked with a language other than the
  page's.

**Translation review (2026-09-28)**: de, fr and ja were reviewed line by
line against the English (all 132 rules, every content page, dictionaries),
correcting meaning, obligation levels and terminology per the conventions
above. `meta-refresh-no-exceptions` said "must not use a meta refresh at
all", but a delay of 0 passes. The English is now fixed at the source
(`core`'s rule module and `src/i18n/en.json`, plus the regenerated
`RULE_CATALOG.md`) to "must not use a timed meta refresh". Every locale
matches it now, here and in `core`'s engine messages. `meta-viewport-large` still
differs on purpose: the English calls it "AAA-level", but it has
`wcagSc: []` / Best Practices, so the translations drop "AAA". Fix the
English, and `es`, to match.

Open English-source issues found in that review, not yet decided:
- `ResultsReportsContent.jsx` calls EARL "ACT-conformance evidence";
  `core/docs/EARL.md` says "listed as an ACT implementation", never
  certification. The translations follow EARL.md.
- `sections.ts` Rules description says "a pass/fail example"; examples also
  cover `cantTell`/`notApplicable`. The translations say "examples of
  results" without promising all four per rule (`manual-review` has one).
- ~~`GettingStartedContent.jsx` says "One `fail`", but its own sample shows
  `fail: 2`.~~ The sample was re-captured with `@surea11y/cli` 1.2.0 for
  core 1.11.1 and the prose now matches it in every language.
- `OutputSchemaContent.jsx` equates "no WCAG mapping" with "manual rules";
  `aria-allowed-role` is automatic with no mapping.
- Overview's "These are the cases where the engine reports `cantTell`"
  covers cases with no rule at all (keyboard traps, reflow).
- About 25 manual rules have "must" titles but only return `cantTell`;
  `css-hidden-focus` and `aria-valid-attr` contradict themselves;
  `avoid-inline-spacing`'s fail example says "the page's own styles"
  (1.4.12 is about the user's). Rule text also exposes internal notes and
  "see below" (`target-size-minimum`, `aria-prohibited-attr`).
- `skip-link` only recognised English link text ("skip", "jump to"),
  which wasn't documented. Core 1.10.0 says the wording list now covers
  every shipped language (CHANGELOG, `bypass-blocks-present`); the rule
  pages don't list the words either way.
- The FAQ mentions `npm run i18n:sync`, a `core` maintainer command.
- Found updating to core 1.10.0 and fixed in core 1.11.0: `region`'s cut-off
  "Applies to" (SureA11y/core#87) and the `contrast-computable`
  `BACKGROUND_OVERLAP` noise from the language menu inside a closed
  `<details>` (SureA11y/core#86). `definition-list-children-valid`'s
  "(see implementation-notes)" was fixed in core 1.12.0.
- Found updating to core 1.12.0 (rule JSDoc in `core`, translated as
  written): `aria-prohibited-children`'s expectation keeps "regardless of
  whether group/rowgroup is itself in the container's own required-owned-
  roles set" right after the new condition that contradicts it;
  `table-th-has-data-cells` names a "header" role (no such ARIA role);
  `empty-heading` cites "the engines implementing" ACT `ffd0e9`; the three
  contrast rules point readers at `docs/LAYOUT_MEASUREMENT.md` (and
  `LIMITATIONS.md`); `contrast-computable` says stroke/shadow-only text
  "below the AA ratio" fails both contrast rules, `contrast-enhanced` says
  "below the ratio" (7:1); "colour"/"color" mixed. Not in the rule text
  at all though the CHANGELOG has them: `aria-prohibited-attr`'s
  `aria-braillelabel`/`aria-roledescription` checks, the contrast rules'
  `SYMBOLIC_CHARACTER_BELOW_THRESHOLD`, `label-in-name`'s `aria-hidden`
  change.
- Bugs outside translation: ~~`AccessibilityStatementContent`'s issue link
  resolves to `…/core/blob/main/issues`~~ (fixed 2026-10-11, every
  language: `core` is now the repo root);
  `TestMatchersUsageContent`'s failure-message samples now follow the
  test-matchers 1.2.0 README; `es` has
  glued-word JSX bugs (`OutputSchemaContent.es.jsx`,
  `SarifReportContent.es.jsx`, `WcagMappingContent.es.jsx`,
  `TestMatchersUsageContent.es.jsx`).

## CI, accessibility scan and deploy

`.github/workflows/ci.yml`, on every PR, push to `main` and manual run:

- **check**: `npm ci`, build, `check:links`, `check:meta`, `i18n:check
  --strict`, `check:typography`, and `check:lang` (advisory, never fails).
  Uploads `dist/` so the scan and the deploy use this one build.
- **a11y**: `npm run check:a11y` (`scripts/check-a11y.mjs`) scans every
  built page except `/from/` redirects in Chromium with
  `@surea11y/playwright` and the pinned `@surea11y/core`, profile
  `wcag22-aa` (the statement's WCAG 2.2 AA), at 375 and 1280 px (one
  parallel job each, artifacts `a11y-results-<width>`), after
  `document.fonts.ready`. Any `fail` or unscannable page fails the run;
  `cantTell` never does. Writes `a11y-results/summary.md` (also the run
  summary) and core's HTML report per page with a finding (artifact).
  `--widths=` and `--pages=` narrow a local run. Installs `fonts-noto-cjk`
  so Japanese pages are measured in a real CJK font.
- **deploy**: push to `main` only, after both: `npx wrangler deploy` with
  secrets `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`. It replaces
  Cloudflare's git-triggered build, which was disconnected on 2026-10-03
  after the first deploy from Actions worked: the org's free plan can't
  require checks on a private repo, so the deploy job's `needs` is the
  gate. Don't reconnect that build, or pushes to `main` go live without
  the checks and the scan. Wrangler also reports the Worker's default
  `surea11y-dev.rumoroso.workers.dev` address, which serves the same site
  (a "workers.dev" toggle in the Worker's settings).
- `.github/dependabot.yml`: `@surea11y/*` weekly (grouped), Actions monthly.

Decisions and follow-ups (more widths, dark mode, publishing results on
the site, PR previews, the data checks) are in
`internal-notes/surea11y-dev-a11y-ci.design.md` §8.1. The site passed with
zero failures at both widths when this went in (2026-10-03).

## Why Astro without Starlight

Decided over Starlight specifically because `design_system/components/`
turned out to be a real React component library, not just tokens, and the
goal is genuine control over layout/styling built from those components —
not a themed docs framework fought into shape. Page-per-rule generation from
structured data is done (`src/pages/[...lang]/rules/[slug]/index.astro`,
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

## Post-launch hardening (site is now public at surea11y.dev)

Done after an external review of the live site flagged gaps:

- **Homepage hero**: `src/pages/[...lang]/index.astro` now has a tagline, a
  Get started/View on GitHub CTA pair, and a compact ACT-corpus stat line
  (linking to `OverviewContent.jsx`'s own `#checked-against-the-act-corpus`
  section) above the existing technical content, which is otherwise
  unchanged. Pulled in `design_system`'s `Button` component for the CTAs
  (`src/components/design-system/core/Button.jsx` + `.d.ts`) — first use on
  this site. Deliberately used `variant="secondary"` and `variant="outline"`,
  never `variant="primary"`: the design system reserves the green primary
  variant for the single main action on a results-bearing view, since green
  already means `pass` everywhere else on this site — spending it on a
  marketing CTA would blur that meaning. `getting-started/`'s own structure
  (one full page per binding rather than inline tabs on the index) was
  reviewed and kept as-is — it's a prior deliberate choice matching
  alfa.siteimprove.com's real pattern, not an oversight the review caught.
  **H1 changed on a second review pass**: was `<Logo variant="tag" product="core" label="@surea11y/core" />`
  (a decision made explicitly a few commits earlier), swapped for a plain
  `<Logo variant="lockup" />` (same "surea11y" mark the header itself uses,
  just larger) once the hero's tagline and family-wide positioning made the
  `@surea11y/core` tag chip read as a mismatch — the page was pitching the
  whole project one line below a heading naming one package. Engine
  version/license `Badge`s moved below the hero (after the CTAs and ACT
  stat line, before `OverviewContent`) as secondary metadata rather than
  the first thing under the heading.
- **SEO baseline**: `astro.config.mjs` sets `site: 'https://surea11y.dev'`
  and adds `@astrojs/sitemap` (emits `sitemap-index.xml` at build);
  `public/robots.txt` points at it. `BaseLayout.astro` takes an optional
  `description` prop (sitewide default otherwise) and now emits
  `meta[name=description]`, `link[rel=canonical]`, `og:*`, and
  `twitter:card` (`summary`, not `summary_large_image` — no OG image exists
  yet, see below). Every page has its own description: the homepage and
  section indexes from `sections.ts`, each subpage from `description` in
  `pages.ts` (since 2026-10-18), and each rule page from the rule's own
  description; `check:meta` enforces it. `sitemap-index.xml`
  was submitted to Google Search Console on 2026-09-28 (Domain property,
  already verified; Bing Webmaster Tools not done yet — it can import from
  Search Console). Still open: a real Open Graph image (1200×630) — no such
  asset exists in `design_system` yet, so `og:image`/`twitter:image` are
  omitted rather than pointing at nothing. Deployment to surea11y.dev is
  automatic from GitHub Actions: a push to `main` goes live only after the
  site checks and the accessibility scan pass (see "CI, accessibility scan
  and deploy"; `wrangler.jsonc` sets the target Worker, `surea11y-dev`).
  Until 2026-10-03 Cloudflare built and deployed every push itself.
- **Accessibility statement wording**: "Every change also goes through a
  complete manual accessibility audit" (`AccessibilityStatementContent.jsx`)
  overstated what actually happens — there's no process guaranteeing a full
  keyboard + screen-reader + WCAG audit on every single change. Weakened to
  "Changes are also subject to manual accessibility testing" instead, which
  is what's actually true and still says manual testing happens.

- **Project stewardship ("About the project")**: a short `<h2 id="about-the-project">`
  section, `OverviewAbout` in `OverviewContent.jsx`/`.es.jsx`, rendered by
  the homepage (every locale) *after* the six-card section grid, as the last thing before
  the footer — the cards close the documentation part of the page, About
  closes the page itself (moved there from above the cards; it read as part
  of the docs flow when the cards came after it) (independent open source, npm +
  GitHub links, contributions welcome via `CONTRIBUTING.md`, "created and
  currently maintained by" Jorge Rumoroso with LinkedIn link), plus one footer
  link to it (`footer.about`) so it's reachable from every page. The
  footer's copyright line is just `© {year} SureA11y` — the personal
  attribution moved into this section. Deliberately
  not a separate About page or sidebar entry — two paragraphs didn't justify a
  route. Visually it's deliberately *not* docs-shaped ("same identity,
  different conceptual space" — it's about the people/stewardship, not the
  product): wrapped in `<section class="stewardship">`, separated from the card grid by a
  large top margin + full-width top rule (no bottom rule — the footer's own
  border-top follows), `h2` restyled as a mono ultraviolet eyebrow (ultraviolet is the
  brand's editorial accent), a display-type lead sentence, and a byline
  (credit label → name → role → LinkedIn) behind the same violet accent bar
  the Philosophy blockquote uses. Styles live in `src/styles/stewardship.css`,
  imported by the homepage; selectors are `.prose`-prefixed to outrank
  `BaseLayout`'s scoped `.prose :global(h2/p)`. The id is explicit and
  identical in both languages because the footer link is shared and `localizeLinks` only rewrites the path, not the anchor;
  the ES ACT-corpus `<h3>` got an explicit `id` for the same reason (the hero
  stat link had been pointing at a slug that only existed in English).

## Core 1.10.0 update (2026-10-06)

Pinned `@surea11y/core` 1.10.0 and moved both generators onto the package
(see "Where things come from"). Content pages that adapt a core doc changed
in 1.10.0 were updated from `git diff v1.9.0 6b057bb -- docs/` in every
language: Engine options, Locales (`getLocaleCoverage()`), Standalone
(`waitForPageReady`), Output schema (`margin` with `id="margin"`,
`contextMatch`, `skippedCustomRules`, `engine.version`,
`shadowHostSelectors`), HTML/SARIF/EARL reports, Baseline, Known
limitations, FAQ (new `runonly-threw` and `contextselector-matched-nothing`
entries replace the bare-array one), How rules are organized (manual rules
may `pass`). The rules catalog's manual heading now reads "never `fail`".
The homepage got two 1.10.0 highlights inside `OverviewContent`: a margin
paragraph under "How its results differ" and the held-still animations in
"Deterministic execution". Long one-line code samples can overflow into the
TOC rail under the text-spacing check; split them over lines (the FAQ's
`runOnly` sample was).

## Core 1.11.1 update (2026-10-11)

Pinned `@surea11y/core` 1.11.1 (1.11.0's package left out
`src/core/engine-options.js`, so a Node scan with packs failed) and
`@surea11y/playwright` 1.3.0 for the scan. 67 rules' applicability,
expectation or reports changed; every overlay follows the new English.
Content pages follow the 1.11 docs in every language: Engine options
(reordered as core's doc is: WCAG targets and `bestPractices` first, tags
and ids under "Advanced selection", `strictOptions`, `output.detail`,
`packs`), Output schema (`standards`, `skippedPacks`, `engine.packs`,
`engine.outputDetail`, `policyOutcome`, `ruleSeverity`, frame `selector`/
`title`, the reporters reading cross-frame and binding frame results),
the HTML/SARIF/JUnit/EARL reports, Baseline, WCAG mapping, Locales, How
rules are organized, Known limitations, FAQ, Standalone (packs in a page,
a time limit on a scan), and the binding, CLI and test-matchers pages
(`.withWcag()`, `.withPacks()`, `--wcag`, `--pack`, `--compact`). New page:
Packs (see "Where things come from"). The quickstart sample on Getting
Started was re-run with `@surea11y/cli` 1.2.0 (three `fail`s now: the two
contrast rules and `page-title-present`). Every mention of other engines
by name was removed from Engine options, FAQ and Known limitations, in
every language, as the 1.11 docs did. The homepage got one paragraph on WCAG
targets and packs under "How its results differ".

## Core 1.12.0 update (2026-10-16)

Pinned `@surea11y/core` 1.12.0 and `@surea11y/playwright` 1.4.1. Covers
the bindings at 1.4.x (cypress, playwright, puppeteer, selenium,
webdriverio), `@surea11y/cli` 1.3.0 and `@surea11y/test-matchers` 1.3.0,
read from their release notes and README diffs. 61 rules' text changed
(mostly a sentence on custom elements whose `ElementInternals` give them
a role); every overlay follows it. Content pages, every language:

- Homepage/Overview: ACT figures are now W3C's own corpus (942 test cases,
  59 rules, no false positive in jsdom or Chromium; both EARL reports
  linked, the browser one checked live); new paragraphs on criteria
  reported for named checks + `wcagLevel`, web components, contrast in a
  browser; "Which package" table gains "build your own tool" (core).
- Getting Started: see "Installing core beside a binding" below for the
  install line. Each binding page gained a "Web components"
  block (`installInternalsHook`, per-binding call) and an "also available"
  line (`.wcagLevel()`, `.includeMode()`, `plannedChecks()`, `logger()`,
  `getScanNotes()`), via new optional props on `UsageBindingSection`.
  Quickstart and CLI samples re-captured with CLI 1.3.0 (criteria block).
- CLI (`#naming-checks`: `--include-mode`, `--wcag-level` alone),
  test-matchers (`#web-components`), Standalone (`#internals-hook`,
  `#what-a-scan-covers`, link to `BUILDING_ON_CORE.md`, treated as
  GitHub-only like `INTEGRATION.md`).
- Engine options (`#which-criteria-a-scan-reports`,
  `#giving-the-level-of-a-scan-that-names-checks-wcaglevel`), Packs
  (profile `wcagVersion`), CI integration, Locales, Output schema
  (`#partly-checked`), HTML/SARIF (`#outside-the-target`)/JUnit
  (`#names-in-every-locale`: the one-time CI history reset)/EARL,
  Baseline, WCAG mapping, How rules are organized, Known limitations
  (rewritten to core's new LIMITATIONS.md), FAQ (`#results-changed-1-12`,
  first and dated — move or drop it later; `#tags-and-rules-run-nothing`;
  `#web-component-canttell`).
- Engine strings the HTML report prints ("Partly checked: …") are quoted
  in the report language core itself uses (`report_rollup_notSelected*`
  in core's locale files), not in English, since the report follows the
  scan's locale.

## Content/structure review implementation

Implemented most of `Revision_general_contenidos_estructura_surea11y.docx`
(a Spanish-language content/structure audit), excluding two items that
share a "no client-side JS" conflict with this site's deliberate zero-JS
design (`TableOfContents.astro` already skips scroll-spy for the same
reason): the rules-catalog search/filter, and global site search. Both
are explicitly deferred, not built.

Done: the 132-vs-58-ACT-rules stat framing (now reads `{rules.length}
accessibility rules · 58 validated against the ACT corpus`, sourced from
`rules.generated.json`'s length rather than a second hardcoded number);
a "not sure where to start?" `Callout` on Getting Started; baseline/
allowlist cross-links added to CLI usage and Results & Reports (CI
integration already had one); a changelog link on the homepage
(`../core/CHANGELOG.md` is genuinely maintained); the homepage split into
`OverviewLead`/`OverviewContent` so the value-prop paragraphs sit with the
hero before the CTA, completing the review's proposed block order; a
choice-matrix `DataTable` and a real, CLI-captured 5-minute quickstart
example (one `fail`, one `cantTell`, one `notApplicable` —
`target-size-minimum`, which the CLI's own static-HTML limitation makes
`notApplicable`) added to Getting Started; a shared "next steps" paragraph
added once to `UsageBindingSection.jsx` (covers all 5 driver bindings ×
2 languages); light heading-only structure added to CLI and Standalone
(still bespoke, per the reasoning above — just no longer headingless);
an output-format comparison `DataTable` on Results & Reports; and the
canonical-source principle formalized above.

**Deferred, not built — record for later:**
- ACT-equivalent / reason-codes per rule page: `scripts/generate-rules-data.cjs`
  has no ACT-linkage field today, and `../core/docs/ACT_RULE_MAPPING.md` is
  unstructured prose — but it references a machine-readable companion,
  `../core/scripts/data/act-rule-map.json`, which is the real source to
  reach for if this is ever built. Not built now — matches the review's
  own "optional" framing and this repo's no-speculative-build convention.
- Audience-specific tracks (separate onboarding paths for QA, a11y
  specialists, leadership, platform teams): the review itself says only
  build these on demonstrated demand. No design work done.

## Core 1.12.1 update (2026-10-17)

Pinned `@surea11y/core` 1.12.1 (bindings unchanged; their `.screenshots()`
release is a separate update). One rule's text changed:
`text-spacing-content-loss` leaves out text inside a `<marquee>`, and its
"(a marquee)" examples now read "(a ticker)"; every overlay follows it. New
FAQ entry `#scan-time` ("A scan takes longer after upgrading"), every
language, linking core's `PERFORMANCE.md` as GitHub-only (scan time per
release, as ratios; measurement method). `RELEASING.md` is maintainer-only
and not linked. `check:lang` flags "Web Animations API" in the Japanese
rule text; it's a standard's name, left unmarked.

## Installing core beside a binding (2026-10-17)

Since the bindings' 1.4.2 and test-matchers 1.3.1, every install line on
the site names `@surea11y/core` beside the binding
(`npm install @surea11y/core @surea11y/playwright playwright`), in
`bindingUsage*.jsx`, `TestMatchersUsageContent*`, the Overview package
table, and the pack install sentences (Packs, FAQ), every language. The
site presents only this way: it doesn't say core also comes with the
binding as a dependency, and it doesn't mention the bindings' planned
2.0 peer change. Keep it that way. The CLI (`npm install -g
@surea11y/cli`) is unchanged.

## Core 1.13.0 update (2026-10-17)

Pinned `@surea11y/core` 1.13.0. No rule text, locale or doc content the
site adapts changed except the EN 301 549 deprecation (built-in profiles,
`mappings: 'en301549'` and `@surea11y/core/en301549` move to
`@surea11y/pack-en301549`, removed in 2.0.0). **Deliberately not on the
site yet**: the pack isn't on npm until its first release (planned
2026-10-19). Once it is, add in every language: deprecation notes on
Engine options (profiles, `mappings`) and WCAG mapping's `#en-301-549`
(entry point → `@surea11y/pack-en301549/public`), following core's
`ENGINE_OPTIONS.md`/`WCAG_CONFORMANCE.md`, and link
`API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`
(GitHub-only). PERFORMANCE.md's 1.13.0 row needs no site change; the FAQ
`#scan-time` only links it.
