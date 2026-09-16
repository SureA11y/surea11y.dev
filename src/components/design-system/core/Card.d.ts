import * as React from "react";

/**
 * A flat panel. This system has no shadow on cards — depth comes from surface
 * value and a hairline border. Do not add one.
 *
 * The `accent` bar is reserved for result states in tables and report sections;
 * it is not a decorative device and must not appear on marketing cards.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left accent bar keyed to a result state, or any CSS colour. */
  accent?: "pass" | "fail" | "unknown" | "advisory" | "na" | string;
  /** Use the raised surface instead of the sunken one. @default false */
  raised?: boolean;
  /** @default "var(--space-6)" */
  padding?: string;
  children?: React.ReactNode;
}

export function Card(props: CardProps): React.ReactElement;
