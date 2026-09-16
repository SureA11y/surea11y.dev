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

// CodeBlock always renders on the ink surface (see below), so token colors
// are brightened and contrast-checked against this literal value rather
// than the (browser-only) --ink-sunken custom property.
const CODE_BG = "#0B100F";
const MIN_TOKEN_CONTRAST = 4.5;

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, l];
}
function hslToRgb([h, s, l]) {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3) * 255, hue2rgb(p, q, h) * 255, hue2rgb(p, q, h - 1 / 3) * 255];
}
function relativeLuminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexToRgb(hexA));
  const lB = relativeLuminance(hexToRgb(hexB));
  const [hi, lo] = lA > lB ? [lA, lB] : [lB, lA];
  return (hi + 0.05) / (lo + 0.05);
}

const brightenedColorCache = new Map();

// Lifts vitesse-dark's deliberately muted token palette a bit brighter, then
// keeps lightening (hue/saturation held) until the token clears AA contrast
// against the ink-sunken background — vitesse-dark's own punctuation tone
// falls just short of that (3.34:1) before this runs.
function brightenTokenColor(hex) {
  if (!hex) return hex;
  const cached = brightenedColorCache.get(hex);
  if (cached) return cached;

  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  let nextL = Math.min(0.92, l + 0.08);
  const nextS = Math.min(1, s * 1.08);
  let result = rgbToHex(hslToRgb([h, nextS, nextL]));

  let guard = 0;
  while (contrastRatio(result, CODE_BG) < MIN_TOKEN_CONTRAST && nextL < 0.95 && guard < 40) {
    nextL += 0.02;
    result = rgbToHex(hslToRgb([h, nextS, nextL]));
    guard++;
  }

  brightenedColorCache.set(hex, result);
  return result;
}

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
                      <span key={j} style={{ color: brightenTokenColor(t.color) }}>{t.content}</span>
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
