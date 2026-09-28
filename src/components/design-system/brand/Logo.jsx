import React from "react";

/* The mark: a check inside a rounded tile. 64 grid, radius 14, stroke 8, round caps.
   Below 20px the stroke thickens one step so the check holds. */
function Mark({ size, tile, check }) {
  const stroke = size < 20 ? 9 : size < 28 ? 8.5 : 8;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" style={{ display: "block", flex: "none" }}>
      <rect width="64" height="64" rx="14" fill={tile} />
      <path d="M17 33.5 L27.5 44 L48 18" fill="none" stroke={check} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* variant="tag": a keyline pill for README headers, docs, CLI banners — the
   mark's own tile fills the full pill height flush at the left edge (stretch,
   not centred, so the icon reads as tall as the word beside it), one outline
   around the whole thing. No second filled ground behind the word: the tile
   stays the only filled shape, same rule as everywhere else in the system. */
export function Logo({
  variant = "lockup",
  surface = "light",
  mono = false,
  case: casing = "lower",
  size,
  /* Product name, lowercase: renders "surea11y <product>". */
  product,
  /* Version string, e.g. "1.4.0" — only shown alongside product, mono, muted, space-separated. */
  version,
  /* inline = a feature of the one tool; divided = sold separately, or a report. */
  productStyle = "inline",
  label,
  style,
  ...rest
}) {
  size = size ?? (variant === "tag" ? 26 : 32);
  const dark = surface === "dark";
  let tile = dark ? "var(--green-on-dark)" : "var(--green-on-light)";
  let check = dark ? "var(--green-deep)" : "#FFFFFF";
  if (mono) {
    tile = dark ? "#FFFFFF" : "var(--ink)";
    check = dark ? "var(--ink)" : "#FFFFFF";
  }

  const sureColor = mono
    ? (dark ? "#F7F8F6" : "var(--ink)")
    : (dark ? "#F7F8F6" : "var(--graphite)");
  const a11yColor = mono
    ? (dark ? "#F7F8F6" : "var(--ink)")
    : (dark ? "var(--green-on-dark)" : "var(--green-on-light)");

  const sure = casing === "camel" ? "Sure" : "sure";
  const a11y = casing === "camel" ? "A11y" : "a11y";
  const productColor = mono
    ? (dark ? "#C7D2CB" : "var(--graphite)")
    : (dark ? "var(--slate)" : "var(--slate-ink)");
  const alt = label || (product ? "surea11y " + product : "SureA11y");

  /* The tag's word compartment is much shorter than the tile it sits beside, so
     it needs its own, smaller type scale and gentler tracking — the lockup's
     size × 0.95 / -0.03em is tuned for type sitting free next to the mark, not
     boxed into a fixed-height pill. */
  const wordFontSize = variant === "tag" ? size * 0.577 : size * 0.95;
  const wordLetterSpacing = variant === "tag" ? "-0.01em" : "var(--tracking-display)";

  const word = (
    <span
      aria-hidden="true"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: wordFontSize,
        lineHeight: 1,
        letterSpacing: wordLetterSpacing,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontWeight: 400, color: sureColor }}>{sure}</span>
      <span style={{ fontWeight: 700, color: a11yColor }}>{a11y}</span>
      {product && productStyle === "inline" ? (
        <span style={{ fontWeight: 400, color: productColor, marginLeft: "0.3em" }}>
          {product}
          {version ? <span style={{ fontFamily: "var(--font-mono)", marginLeft: "0.4em" }}>{version}</span> : null}
        </span>
      ) : null}
      {product && productStyle === "divided" ? (
        <>
          <span
            aria-hidden="true"
            style={{
              display: "inline-block", width: 1, height: size * 0.85,
              margin: "0 " + size * 0.3 + "px", verticalAlign: "middle",
              background: dark ? "var(--hairline-dark-strong)" : "var(--hairline-light-strong)",
            }}
          />
          <span style={{ fontWeight: 400, color: mono ? (dark ? "#F7F8F6" : "var(--ink)") : (dark ? "#F7F8F6" : "var(--ink)") }}>{product}</span>
        </>
      ) : null}
    </span>
  );

  if (variant === "tag") {
    const border = mono ? (dark ? "#FFFFFF" : "var(--ink)") : "var(--border-strong)";
    return (
      <span
        role="img"
        aria-label={alt}
        style={{
          display: "inline-flex",
          alignItems: "stretch",
          height: size,
          border: "1px solid " + border,
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: size, flex: "none", background: tile }}>
          <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 64 64" aria-hidden="true" focusable="false" style={{ display: "block" }}>
            <path d="M17 33.5 L27.5 44 L48 18" fill="none" stroke={check} strokeWidth={size < 28 ? 10 : 9} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span style={{ display: "flex", alignItems: "center", padding: "0 " + size * 0.35 + "px" }}>{word}</span>
      </span>
    );
  }

  if (variant === "mark") {
    return (
      <span role="img" aria-label={alt} style={{ display: "inline-flex", ...style }} {...rest}>
        <Mark size={size} tile={tile} check={check} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span role="img" aria-label={alt} style={{ display: "inline-flex", ...style }} {...rest}>
        {word}
      </span>
    );
  }

  const stacked = variant === "stacked";
  return (
    <span
      role="img"
      aria-label={alt}
      style={{
        display: "inline-flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: "center",
        gap: stacked ? size * 0.45 : size * 0.42,
        ...style,
      }}
      {...rest}
    >
      <Mark size={size} tile={tile} check={check} />
      {word}
    </span>
  );
}
