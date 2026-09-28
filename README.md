# surea11y.dev

The docs and rules site for the surea11y accessibility engine — a rules
reference plus integration guides, in the spirit of a code-checker
documentation hub, adapted for a core engine plus a family of framework
bindings rather than one single product.

Site structure and content sourcing are planned in
[`internal-notes/docs-site-architecture.design.md`](https://github.com/rumoroso/internal-notes/blob/main/docs-site-architecture.design.md)
(private repo). The rule content itself lives in `@surea11y/core`:
[`docs/RULE_CATALOG.md`](https://github.com/SureA11y/core/blob/main/docs/RULE_CATALOG.md)
and
[`docs/RULE_EXAMPLES.md`](https://github.com/SureA11y/core/blob/main/docs/RULE_EXAMPLES.md).

## Stack

- [Astro](https://astro.build), with the [React integration](https://docs.astro.build/en/guides/integrations-guide/react/)
  for reusing components from the design system, no docs-theme framework
  layered on top — layout and navigation are built directly against that
  system rather than a third-party theme.
- Design tokens in `src/styles/tokens/` are copied from the design system
  repo (`design_system/tokens/`), which is the source of truth — re-copy
  those files if it changes rather than editing them here.

## Status

Scaffold only. No page templates, navigation, rule-page generator, or content
beyond the placeholder home page exist yet.

## Development

```bash
npm install
npm run dev      # localhost:4321
npm run build    # outputs to ./dist/
npm run preview  # preview a production build locally
npm run check:links  # after a build: broken internal links/anchors
npm run i18n:check   # translation coverage and outdated translations per language
npm run check:typography  # after a build: stray spaces in Japanese pages
```

## Languages

English lives at the root, other languages under their own prefix
(`/es/…`, `/fr/…`, `/de/…`, `/ja/…`). The language list is
`src/i18n/locales.ts`. A page that isn't translated yet still builds in
every language, showing the English text marked `lang="en"` with a short
notice.

### Adding a language

1. Add the language to `src/i18n/locales.ts` (code and its own name for
   itself). Every page then builds under `/<code>/`, in English, with the
   notice.
2. Create `src/i18n/<code>.json`: every key from `en.json`, plus the
   `nav:`/`page:` keys `npm run i18n:check -- --locale=<code>` lists.
3. Add `Name.<code>.jsx` next to each content component, and
   `src/data/bindingUsage.<code>.jsx`. Code, option names, outcome values
   and existing `id`s stay as they are.
4. Add `src/data/rules.i18n.<code>.json` for the rule pages (same shape as
   the other `rules.i18n.*.json` files).
5. Run `npm run build`, `npm run check:links`, `npm run i18n:check`,
   `npm run check:lang`, and for Japanese `npm run check:typography`.
6. Record the new translations as current:
   `npm run i18n:mark -- --locale=<code> --stale`.

### Keeping translations current

`src/i18n/translation-sources.json` records, for every translated page,
interface string and rule, a fingerprint of the English it was translated
from. When the English changes, `npm run i18n:check` lists that
translation as outdated in every language (whitespace-only edits don't
count; regenerating the rules with `docs:rules` does, for the rules whose
text changed).

For each outdated item: see what changed in English (`git log -p` on the
English file, `en.json`, or `rules.generated.json`), update the
translation, then record it:

```bash
npm run i18n:mark -- --locale=fr content:components/FaqContent string:footer.about rule:accesskeys
```

`npm run i18n:check -- --strict` fails on outdated translations too, for
use in CI.
