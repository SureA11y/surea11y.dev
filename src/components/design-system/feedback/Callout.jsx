import React from "react";
import { Icon } from "../brand/Icon.jsx";

export function Callout({ tone = "note", title, icon, children, style, ...rest }) {
  const tones = {
    note:     "var(--text-muted)",
    accent:   "var(--accent)",
    advisory: "var(--accent-2)",
    unknown:  "var(--unknown-on-dark)",
    fail:     "var(--fail-on-dark)",
  };
  const bar = tones[tone] || tones.note;
  return (
    <div
      role="note"
      style={{
        display: "flex",
        gap: "var(--space-4)",
        padding: "var(--space-4) var(--space-5)",
        background: "var(--surface-sunken)",
        borderLeft: `var(--stroke-accent-bar) solid ${bar}`,
        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={22} color={bar} style={{ marginTop: 2 }} /> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {title ? (
          <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: 500, color: "var(--text-strong)" }}>{title}</div>
        ) : null}
        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)", color: "var(--text-body)" }}>{children}</div>
      </div>
    </div>
  );
}
