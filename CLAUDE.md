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
- `npm run check:links` — the post-build link/anchor audit described
  above, now a script; also flags a localized page linking out of its own
  locale (links carrying `hreflang`, i.e. the switcher, are exempt).

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

Still open for Japanese specifically: a CJK-capable font fallback and
`word-break: auto-phrase` under `:lang(ja)`. The engine itself has no `ja`
locale (`src/data/locales.generated.json`: en/de/es/fr), so Japanese pages
would document English engine output unless `core` gains one.

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
  yet, see below). Per-page descriptions set so far: the homepage and the
  six other top-level section indexes, reusing `sections.ts`'s existing
  one-line descriptions where one already existed. Still open: submitting
  the sitemap to Google Search Console / Bing Webmaster Tools once the
  domain has settled, and a real Open Graph image (1200×630) — no such
  asset exists in `design_system` yet, so `og:image`/`twitter:image` are
  omitted rather than pointing at nothing. Deployment to surea11y.dev is
  a manual step outside this repo (`wrangler.jsonc` configures the
  Cloudflare target, but nothing here runs `wrangler deploy` — no CI
  workflow, no deploy script in `package.json`), so a merged commit isn't
  live until that's run separately.
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
