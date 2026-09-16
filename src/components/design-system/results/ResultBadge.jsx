import React from "react";
import { RESULT_STATES } from "./resultStates.js";

/* Colour + glyph + word, always all three. */
export function ResultBadge({
  state = "pass",
  surface = "dark",
  size = "md",
  count,
  variant = "text",
  style,
  ...rest
}) {
  const s = RESULT_STATES[state];
  if (!s) return null;
  const tone = surface === "dark" ? s.onDark : s.onLight;
  const pad = size === "sm" ? "3px 8px" : "6px 11px";
  const font = size === "sm" ? "var(--text-xs)" : "var(--text-sm)";

  const solid = variant === "solid";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontFamily: "var(--font-mono)",
        fontSize: font,
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        padding: solid ? pad : 0,
        borderRadius: solid ? "var(--radius-sm)" : 0,
        background: solid ? tone : "transparent",
        color: solid ? s.ink : tone,
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden="true">{s.glyph}</span>
      <span>{s.word}</span>
      {count != null ? <span style={{ opacity: 0.75 }}>{count}</span> : null}
    </span>
  );
}
