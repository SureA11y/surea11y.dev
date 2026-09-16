import React from "react";

/* The SureA11y icon set. 24px grid, 2px stroke, round caps, 4px radius, line work
   only. Every glyph depicts a barrier removed — never a person, never a
   wheelchair, ear or eye. Minimum 20px; below that use the Logo mark instead. */
export const GLYPHS = {
  "focus": (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" strokeDasharray="4 4" />
      <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" stroke="none" />
    </>
  ),
  "keyboard": (
    <>
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M7 11h0M11 11h0M15 11h0M8 15h8" />
    </>
  ),
  "contrast": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
    </>
  ),
  "captions": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M7 11h3M7 15h10M14 11h3" />
    </>
  ),
  "landmarks": (
    <>
      <rect x="2" y="3" width="20" height="5" rx="2" />
      <rect x="2" y="11" width="7" height="10" rx="2" />
      <rect x="12" y="11" width="10" height="10" rx="2" />
    </>
  ),
  "announced": (
    <>
      <circle cx="7" cy="12" r="3" fill="currentColor" stroke="none" />
      <path d="M13 8a6 6 0 0 1 0 8M17.5 5a11 11 0 0 1 0 14" />
    </>
  ),
  "alt-text": (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <text x="12" y="16" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600" fill="currentColor" stroke="none">alt</text>
    </>
  ),
  "text-scale": (
    <>
      <text x="3" y="19" fontFamily="var(--font-display)" fontSize="12" fontWeight="500" fill="currentColor" stroke="none">A</text>
      <text x="11" y="19" fontFamily="var(--font-display)" fontSize="18" fontWeight="700" fill="currentColor" stroke="none">A</text>
    </>
  ),
  "target-size": (
    <>
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </>
  ),
  "reduced-motion": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 12h12" />
    </>
  ),
};

export const ICON_NAMES = Object.keys(GLYPHS);

export function Icon({ name, size = 24, label, color = "currentColor", style, ...rest }) {
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  const decorative = !label;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? "true" : undefined}
      aria-label={label}
      focusable="false"
      style={{ display: "block", flex: "none", color, ...style }}
      {...rest}
    >
      {label ? <title>{label}</title> : null}
      {glyph}
    </svg>
  );
}
