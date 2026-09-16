import * as React from "react";

export interface DataTableColumn {
  key: string;
  label: string;
  /** CSS width for the colgroup, e.g. "12ch" or "20%". */
  width?: string;
  align?: "left" | "right" | "center";
  /** Machine values — ids, versions, counts, dates — set in IBM Plex Mono. */
  mono?: boolean;
  /** Muted text colour for secondary columns. */
  muted?: boolean;
  /** Allow the cell to wrap instead of truncating. */
  wrap?: boolean;
  /** Opt a column out of sorting. */
  sortable?: boolean;
  /** Custom cell renderer — use for Badge, Tag or ResultBadge cells. */
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableProps {
  columns?: DataTableColumn[];
  rows?: any[];
  /** Mono uppercase label above the header row. */
  caption?: string;
  /** Field used as the row key. Default "id". */
  rowKey?: string;
  sort?: string;
  sortDir?: "asc" | "desc";
  /** Omit to render static headers with no sort buttons (print, embedded views). */
  onSort?: (key: string) => void;
  selected?: string | number | null;
  onRowClick?: (key: string | number, row: any) => void;
  /** 36px rows — dense tool UI only. */
  dense?: boolean;
  stickyHeader?: boolean;
  /** Empty-state sentence. Say what is missing, plainly. */
  empty?: React.ReactNode;
  /** Mono uppercase footer row, e.g. a total. */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Generic data table — runs, pages, packages, rules. Use ResultsTable for findings.
 */
export declare function DataTable(props: DataTableProps): JSX.Element;
