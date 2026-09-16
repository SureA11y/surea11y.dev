import React from "react";

export function Tag({ children, tone = "neutral", onRemove, style, ...rest }) {
  const tones = {
    neutral: { color: "var(--text-muted)", border: "var(--border-strong)" },
    accent:  { color: "var(--accent)", border: "var(--accent)" },
    accent2: { color: "var(--accent-2)", border: "var(--accent-2)" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "5px 10px",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        lineHeight: 1.3,
        color: t.color,
        border: `1px solid ${t.border}`,
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: "var(--text-sm)" }}
        >
          &times;
        </button>
      ) : null}
    </span>
  );
}
