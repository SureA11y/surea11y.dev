import * as React from "react";

export type IconName =
  | "focus"
  | "keyboard"
  | "contrast"
  | "captions"
  | "landmarks"
  | "announced"
  | "alt-text"
  | "text-scale"
  | "target-size"
  | "reduced-motion";

export declare const ICON_NAMES: IconName[];

/**
 * A glyph from the SureA11y icon set.
 *
 * 24px grid, 2px stroke, round caps, line work only, one accent. Icons depict
 * barriers removed — there is deliberately no wheelchair, ear or eye in the set.
 * Minimum rendered size is 20px; below that use `<Logo variant="mark" />`.
 *
 * An icon is never the sole carrier of meaning: pass `label` when it stands
 * alone, and omit it when adjacent text already says the same thing.
 */
export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, "name"> {
  name: IconName;
  /** Rendered px. Minimum 20. @default 24 */
  size?: number;
  /** Accessible name. Omit for decorative icons sitting beside a text label. */
  label?: string;
  /** @default "currentColor" */
  color?: string;
}

export function Icon(props: IconProps): React.ReactElement | null;
