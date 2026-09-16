import * as React from "react";

/**
 * An outlined label for rule categories, package scopes and filters.
 *
 * Tags are outlined, never filled — a filled pill in this system reads as a
 * result badge, and results are the only thing allowed to look like that.
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: "neutral" | "accent" | "accent2";
  /** Renders a remove affordance when provided. */
  onRemove?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export function Tag(props: TagProps): React.ReactElement;
