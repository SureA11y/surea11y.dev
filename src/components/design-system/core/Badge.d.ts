import * as React from "react";

/**
 * A two-cell shields.io-style badge for READMEs, docs headers and CI comments.
 *
 * The left cell is always ink; the right carries the tone. Use `accent` (green)
 * only when the right-hand value genuinely reports a passing state — a version
 * number is `neutral`, a WCAG level is `accent2`.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Left cell, e.g. "npm". */
  label: string;
  /** Right cell, e.g. "v2.1.0". */
  value: string;
  /** @default "neutral" */
  tone?: "neutral" | "accent" | "accent2" | "pass" | "fail" | "unknown" | "advisory" | string;
}

export function Badge(props: BadgeProps): React.ReactElement;
