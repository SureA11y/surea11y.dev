import React from "react";
import { createHighlighterCoreSync, createJavaScriptRegexEngine } from "shiki";
import jsLang from "@shikijs/langs/javascript";
import jsonLang from "@shikijs/langs/json";
import yamlLang from "@shikijs/langs/yaml";
import htmlLang from "@shikijs/langs/html";
import vitesseDark from "@shikijs/themes/vitesse-dark";

const SHIKI_LANG_ID = { js: "javascript", json: "json", yaml: "yaml", html: "html" };

const highlighter = createHighlighterCoreSync({
  langs: [jsLang, jsonLang, yamlLang, htmlLang],
  themes: [vitesseDark],
  engine: createJavaScriptRegexEngine(),
});

/* Terminal and code output. Lines may carry a result state, which tints the
   whole line — the only place colour appears in code, unless `lang` is set:
   a language-tagged block is syntax-highlighted instead, and per-line
   `command`/`state` styling doesn't apply to it (no current content mixes
   the two, by design — a block is either a real source snippet or a
   command/output transcript, never both). */
export function CodeBlock({ lines = [], prompt = "$", copyable = false, lang, style, ...rest }) {
  const tone = {
    pass: "var(--pass-on-dark)",
    fail: "var(--fail-on-dark)",
    unknown: "var(--unknown-on-dark)",
    advisory: "var(--advisory-on-dark)",
    na: "var(--na-on-dark)",
    accent: "var(--green-on-dark)",
    muted: "var(--text-muted)",
  };
  const joinedText = lines
    .map((l) => (typeof l === "string" ? l : l.text))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const defaultLabel = joinedText ? `Code sample: ${joinedText.slice(0, 120)}` : "Code sample";

  const tokenLines = lang
    ? highlighter.codeToTokensBase(
        lines.map((l) => (typeof l === "string" ? l : l.text)).join("\n"),
        { lang: SHIKI_LANG_ID[lang] || lang, theme: "vitesse-dark" }
      )
    : null;
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={defaultLabel}
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
        {tokenLines
          ? tokenLines.map((tokens, i) => (
              <div key={i}>
                {tokens.length === 0
                  ? " "
                  : tokens.map((t, j) => (
                      <span key={j} style={{ color: t.color }}>{t.content}</span>
                    ))}
              </div>
            ))
          : lines.map((line, i) => {
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
