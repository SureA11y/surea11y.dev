import * as React from "react";
import { IconName } from "../brand/Icon";

/**
 * An inline aside in docs and reports.
 *
 * The left accent bar is the only place this system uses that device outside
 * result rows, and the tone must match what the callout is actually about — an
 * `unknown` callout explains a "can't tell", it is not a generic warning.
 */
export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "note" */
  tone?: "note" | "accent" | "advisory" | "unknown" | "fail";
  title?: string;
  icon?: IconName;
  children?: React.ReactNode;
}

export function Callout(props: CalloutProps): React.ReactElement;
