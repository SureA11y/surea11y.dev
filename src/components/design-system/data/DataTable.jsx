import React from "react";

/* The generic data table. ResultsTable is the specialised sibling for findings;
   use this one for runs, pages, packages, rules — anything without a result
   state. Hairlines, no zebra, no shadow: depth comes from the raised header. */
export function DataTable({
  columns = [],
  rows = [],
  caption,
  /** Row key. Falls back to the row index. */
  rowKey = "id",
  sort,
  sortDir = "asc",
  onSort,
  selected,
  onRowClick,
  dense = false,
  stickyHeader = false,
  empty = "Nothing to show yet.",
  footer,
  style,
  ...rest
}) {
  const pad = dense ? "9px var(--space-4)" : "var(--space-3) var(--space-4)";
  const sortable = typeof onSort === "function";

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "auto", ...style }} {...rest}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", fontFamily: "var(--font-body)" }}>
        {caption ? (
          <caption style={{
            captionSide: "top", textAlign: "left",
            padding: "var(--space-4) var(--space-4) var(--space-3)",
            background: "var(--surface-raised)",
            fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
            color: "var(--text-muted)",
          }}>{caption}</caption>
        ) : null}
        <colgroup>
          {columns.map((c) => <col key={c.key} style={{ width: c.width || "auto" }} />)}
        </colgroup>
        <thead>
          <tr style={{ background: "var(--surface-raised)" }}>
            {columns.map((c) => {
              const active = sort === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={sortable && c.sortable !== false ? (active ? (sortDir === "asc" ? "ascending" : "descending") : "none") : undefined}
                  style={{
                    position: stickyHeader ? "sticky" : undefined,
                    top: stickyHeader ? 0 : undefined,
                    background: "var(--surface-raised)",
                    textAlign: c.align || "left",
                    padding: pad,
                    borderBottom: "1px solid var(--border)",
                    fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600,
                    letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
                    color: active ? "var(--text-strong)" : "var(--text-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sortable && c.sortable !== false ? (
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      style={{
                        all: "unset", cursor: "pointer", font: "inherit", color: "inherit",
                        letterSpacing: "inherit", textTransform: "inherit",
                        display: "inline-flex", gap: "var(--space-2)", alignItems: "center",
                      }}
                    >
                      {c.label}
                      <span aria-hidden="true" style={{ opacity: active ? 1 : 0.35, transform: active && sortDir === "desc" ? "rotate(180deg)" : undefined }}>↑</span>
                    </button>
                  ) : c.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const key = r[rowKey] != null ? r[rowKey] : i;
            const on = selected != null && selected === key;
            const interactive = typeof onRowClick === "function";
            return (
              <tr
                key={key}
                onClick={interactive ? () => onRowClick(key, r) : undefined}
                tabIndex={interactive ? 0 : undefined}
                onKeyDown={interactive ? (e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick(key, r); }
                } : undefined}
                aria-selected={interactive ? on : undefined}
                style={{
                  background: on ? "var(--surface-sunken)" : "transparent",
                  cursor: interactive ? "pointer" : "default",
                  transition: "background var(--duration-instant) var(--ease-standard)",
                }}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    style={{
                      padding: pad,
                      textAlign: c.align || "left",
                      borderBottom: "1px solid var(--border)",
                      fontFamily: c.mono ? "var(--font-mono)" : "var(--font-body)",
                      fontSize: c.mono ? "var(--text-sm)" : "var(--text-base)",
                      color: c.muted ? "var(--text-muted)" : "var(--text-strong)",
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: c.wrap ? "normal" : "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis",
                    }}
                  >
                    {c.render ? c.render(r[c.key], r) : (r[c.key] == null ? "—" : r[c.key])}
                  </td>
                ))}
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{
                padding: "var(--space-6) var(--space-4)",
                fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--text-muted)",
              }}>{empty}</td>
            </tr>
          ) : null}
        </tbody>
        {footer ? (
          <tfoot>
            <tr style={{ background: "var(--surface-raised)" }}>
              <td colSpan={columns.length} style={{
                padding: pad, fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
                letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)",
              }}>{footer}</td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
