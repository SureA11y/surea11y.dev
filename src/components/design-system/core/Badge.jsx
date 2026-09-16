import React from "react";

export function Badge({ label, value, tone = "neutral", style, ...rest }) {
  const tones = {
    neutral:  "var(--text-muted)",
    accent:   "var(--accent)",
    accent2:  "var(--accent-2)",
    pass:     "var(--pass-on-light)",
    fail:     "var(--fail-on-light)",
    unknown:  "var(--unknown-on-light)",
    advisory: "var(--advisory-on-light)",
  };
  const cell = {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    lineHeight: 1,
    padding: "5px 9px",
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "stretch", ...style }} {...rest}>
      <span style={{ ...cell, background: "var(--ink)", color: "#F7F8F6", borderRadius: "var(--radius-sm) 0 0 var(--radius-sm)" }}>{label}</span>
      <span style={{ ...cell, background: tones[tone] || tone, color: "#FFFFFF", borderRadius: "0 var(--radius-sm) var(--radius-sm) 0" }}>{value}</span>
    </span>
  );
}
