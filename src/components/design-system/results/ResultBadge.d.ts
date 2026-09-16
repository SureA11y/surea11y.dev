import * as React from "react";

export type ResultState = "pass" | "fail" | "unknown" | "advisory" | "na";

/**
 * A single result, rendered with all three cues: colour, glyph and word.
 *
 * There are five states and only five. Never invent "warning" or "info" — every
 * finding is one of these. Never strip the word to leave a bare coloured dot:
 * the badge must survive greyscale and colour-blind rendering, and that is the
 * acceptance test for the whole brand.
 *
 * @startingPoint section="Results" subtitle="The five result states" viewport="700x160"
 */
export interface ResultBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "pass" */
  state?: ResultState;
  /** @default "dark" */
  surface?: "dark" | "light";
  /** @default "md" */
  size?: "sm" | "md";
  /** Optional occurrence count shown after the word. */
  count?: number;
  /** `text` is the default; `solid` fills the badge for high-density tables. @default "text" */
  variant?: "text" | "solid";
}

export function ResultBadge(props: ResultBadgeProps): React.ReactElement | null;
