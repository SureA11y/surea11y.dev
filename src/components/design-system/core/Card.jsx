import React from "react";

export function Card({ accent, raised = false, padding = "var(--space-6)", children, style, ...rest }) {
  const accentColor = accent
    ? { pass: "var(--accent)", advisory: "var(--accent-2)", fail: "var(--fail-on-dark)", unknown: "var(--unknown-on-dark)", na: "var(--na-on-dark)" }[accent] || accent
    : null;
  return (
    <div
      style={{
        background: raised ? "var(--surface-raised)" : "var(--surface-sunken)",
        border: "1px solid var(--border)",
        borderLeft: accentColor ? `var(--stroke-accent-bar) solid ${accentColor}` : undefined,
        borderRadius: "var(--radius-sm)",
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
