import React from "react";

const PAD = { sm: "8px 14px", md: "12px 18px", lg: "15px 24px" };
const FS = { sm: "var(--text-sm)", md: "var(--text-base)", lg: "var(--text-md)" };

export function Button({
  variant = "primary",
  size = "md",
  as = "button",
  disabled = false,
  fullWidth = false,
  mono = true,
  children,
  style,
  ...rest
}) {
  const Tag = as;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--space-2)",
    minHeight: "var(--target-min)",
    width: fullWidth ? "100%" : undefined,
    padding: PAD[size],
    fontFamily: mono ? "var(--font-mono)" : "var(--font-display)",
    fontSize: FS[size],
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: 0,
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.42 : 1,
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition: "background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)",
  };

  const variants = {
    primary:   { background: "var(--accent)",   color: "var(--accent-contrast)" },
    secondary: { background: "var(--accent-2)", color: "var(--accent-2-contrast)" },
    outline:   { background: "transparent", color: "var(--text-strong)", borderColor: "var(--border-strong)" },
    ghost:     { background: "transparent", color: "var(--text-body)" },
    danger:    { background: "var(--fail-on-light)", color: "#FFFFFF" },
  };

  return (
    <Tag
      disabled={as === "button" ? disabled : undefined}
      aria-disabled={disabled || undefined}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
