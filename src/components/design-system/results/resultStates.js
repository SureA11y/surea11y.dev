/* The five result states. There are five, and only five — no "warning", no "info".
   Every finding is one of them, and every rendition carries three redundant cues:
   colour, glyph and word. Remove the colour and nothing is lost. */
export const RESULT_STATES = {
  pass:     { glyph: "\u2713", word: "pass",       onDark: "var(--pass-on-dark)",     onLight: "var(--pass-on-light)",     ink: "var(--green-deep)",  exit: 0 },
  fail:     { glyph: "\u2715", word: "fail",       onDark: "var(--fail-on-dark)",     onLight: "var(--fail-on-light)",     ink: "#2A0A05",            exit: 1 },
  unknown:  { glyph: "?",       word: "can't tell", onDark: "var(--unknown-on-dark)",  onLight: "var(--unknown-on-light)",  ink: "#241B02",            exit: 0 },
  advisory: { glyph: "!",       word: "advisory",   onDark: "var(--advisory-on-dark)", onLight: "var(--advisory-on-light)", ink: "var(--violet-deep)", exit: 0 },
  na:       { glyph: "\u2013", word: "n/a",        onDark: "var(--na-on-dark)",       onLight: "var(--na-on-light)",       ink: "var(--ink-sunken)",  exit: 0 },
};

export const RESULT_ORDER = ["pass", "fail", "unknown", "advisory", "na"];
