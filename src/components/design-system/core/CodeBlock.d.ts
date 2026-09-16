import * as React from "react";
import { ResultState } from "../results/ResultBadge";

export interface CodeLine {
  text: string;
  /** Tints the line with a result colour. The line's text must still name the state in words. */
  state?: ResultState | "accent" | "muted";
  /** Prefix the line with the shell prompt. */
  command?: boolean;
}

/**
 * Terminal or code output.
 *
 * Always renders on the ink surface, even inside a light page — a terminal is a
 * terminal. When a line carries a `state`, the text itself must still spell the
 * state out ("✓ pass 412"); the tint is the third cue, never the first.
 *
 * @startingPoint section="Core" subtitle="Terminal output with result tints" viewport="700x220"
 */
export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  lines: (string | CodeLine)[];
  /** @default "$" */
  prompt?: string;
  /** @default false */
  copyable?: boolean;
}

export function CodeBlock(props: CodeBlockProps): React.ReactElement;
