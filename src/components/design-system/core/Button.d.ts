import * as React from "react";

/**
 * The action control.
 *
 * `primary` is the green — reserve it for the single main action on a view;
 * green means pass and spending it decoratively costs the whole system its
 * meaning. `secondary` is ultraviolet and carries the services-side actions
 * ("Book an audit", "Talk to us"). Labels are IBM Plex Mono by default because
 * most buttons in this product are commands; set `mono={false}` for prose
 * buttons on marketing pages.
 *
 * @startingPoint section="Core" subtitle="Variants, sizes and states" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default "primary" */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Render as another element, e.g. `"a"`. @default "button" */
  as?: "button" | "a";
  /** @default false */
  fullWidth?: boolean;
  /** Set the label in IBM Plex Mono. @default true */
  mono?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): React.ReactElement;
