import React from "react";

/* Terminal and code output. Lines may carry a result state, which tints the
   whole line — the only place colour appears in code. */
export function CodeBlock({ lines = [], prompt = "$", copyable = false, style, ...rest }) {
  const tone = {
    pass: "var(--pass-on-dark)",
    fail: "var(--fail-on-dark)",
    unknown: "var(--unknown-on-dark)",
    advisory: "var(--advisory-on-dark)",
    na: "var(--na-on-dark)",
    accent: "var(--green-on-dark)",
    muted: "var(--text-muted)",
  };
  return (
    <div
      style={{
        position: "relative",
        background: "var(--ink-sunken)",
        border: "1px solid var(--hairline-dark)",
        borderRadius: "var(--radius-sm)",
        padding: "var(--space-5) var(--space-6)",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-sm)",
        lineHeight: 1.85,
        color: "#C7D2CB",
        overflowX: "auto",
        ...style,
      }}
      {...rest}
    >
      {copyable ? (
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(lines.map((l) => (typeof l === "string" ? l : l.text)).join("\n"))}
          style={{
            position: "absolute", top: "var(--space-3)", right: "var(--space-3)",
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
            background: "transparent", color: "var(--text-muted)",
            border: "1px solid var(--hairline-dark-strong)", borderRadius: "var(--radius-sm)",
            padding: "5px 9px", cursor: "pointer",
          }}
        >
          copy
        </button>
      ) : null}
      <pre style={{ margin: 0, fontFamily: "inherit" }}>
        {lines.map((line, i) => {
          const l = typeof line === "string" ? { text: line } : line;
          return (
            <div key={i} style={{ color: l.state ? tone[l.state] : undefined }}>
              {l.command ? <span style={{ color: "#8FA298", userSelect: "none" }}>{prompt} </span> : null}
              {l.text}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
