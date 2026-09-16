import * as React from "react";

/**
 * The SureA11y logo — mark, wordmark, or lockup.
 *
 * The mark is the only solid-filled shape in the system; it always outranks the
 * icon set. Use `case="lower"` for anything a developer or machine reads
 * (packages, CLI, product UI, the domain) and `case="camel"` for the brand in
 * prose, audit reports and invoices. Never all-caps, never "Sure A11y".
 *
 * Below 120px use `variant="mark"` alone — never the lockup.
 *
 * `variant="tag"` is a keyline pill for README headers, docs and CLI banners:
 * one outline around the whole thing, the mark's tile filling the full pill
 * height flush at the left edge. No second filled ground behind the word —
 * the tile stays the only filled shape.
 *
 * @startingPoint section="Brand" subtitle="Mark, wordmark and lockups" viewport="700x220"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "lockup" */
  variant?: "lockup" | "stacked" | "mark" | "wordmark" | "tag";
  /** Which surface the logo sits on. @default "light" */
  surface?: "dark" | "light";
  /** Single-colour rendition for print, fax and laser. @default false */
  mono?: boolean;
  /** @default "lower" */
  case?: "lower" | "camel";
  /** Height of the mark in px; the wordmark scales from it. @default 32 (variant="tag" defaults to 26 — inline scale, not a button) */
  size?: number;
  /**
   * Product name, always lowercase and one word where possible — renders
   * "surea11y <product>". Same face and size as the wordmark, weight 400, muted.
   */
  product?: string;
  /**
   * Version string shown alongside `product`, e.g. "1.4.0" — mono, muted, space-
   * separated, no punctuation. Only rendered with `productStyle="inline"`.
   */
  version?: string;
  /**
   * How the product name attaches. "inline" (muted, same size) for a feature of
   * the one tool; "divided" (hairline rule, full-strength text) for something
   * sold separately, and for audit reports.
   */
  productStyle?: "inline" | "divided";
  /** Accessible name. @default "SureA11y" (or "surea11y <product>" when product is set) */
  label?: string;
}

export function Logo(props: LogoProps): React.ReactElement;
