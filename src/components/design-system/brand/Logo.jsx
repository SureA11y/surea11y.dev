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

export function Logo({
  variant = "lockup",
  surface = "light",
  mono = false,
  case: casing = "lower",
  size = 32,
  label = "SureA11y",
  style,
  ...rest
}) {
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

  const word = (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size * 0.95,
        lineHeight: 1,
        letterSpacing: "var(--tracking-display)",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontWeight: 400, color: sureColor }}>{sure}</span>
      <span style={{ fontWeight: 700, color: a11yColor }}>{a11y}</span>
    </span>
  );

  if (variant === "mark") {
    return (
      <span role="img" aria-label={label} style={{ display: "inline-flex", ...style }} {...rest}>
        <Mark size={size} tile={tile} check={check} />
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span role="img" aria-label={label} style={{ display: "inline-flex", ...style }} {...rest}>
        {word}
      </span>
    );
  }

  const stacked = variant === "stacked";
  return (
    <span
      role="img"
      aria-label={label}
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
