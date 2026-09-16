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
 * @startingPoint section="Brand" subtitle="Mark, wordmark and lockups" viewport="700x220"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "lockup" */
  variant?: "lockup" | "stacked" | "mark" | "wordmark";
  /** Which surface the logo sits on. @default "dark" */
  surface?: "dark" | "light";
  /** Single-colour rendition for print, fax and laser. @default false */
  mono?: boolean;
  /** @default "lower" */
  case?: "lower" | "camel";
  /** Height of the mark in px; the wordmark scales from it. @default 32 */
  size?: number;
  /** Accessible name. @default "SureA11y" */
  label?: string;
}

export function Logo(props: LogoProps): React.ReactElement;
