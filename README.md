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
```
