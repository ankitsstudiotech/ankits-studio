import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
type ButtonSize = "md" | "lg";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** When true, stretches to full width (mobile CTAs). */
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover shadow-[var(--shadow-soft)]",
  secondary:
    "bg-surface-raised text-ink border border-border hover:border-border-strong hover:bg-surface",
  ghost: "bg-transparent text-ink hover:bg-surface-sunken",
  inverse:
    "bg-surface-raised text-ink hover:bg-surface shadow-[var(--shadow-soft)]",
};

const sizeClass: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-sm gap-2",
  lg: "min-h-12 px-6 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium",
        "transition-[background-color,border-color,transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
        "disabled:pointer-events-none disabled:opacity-45",
        "active:scale-[0.98] motion-reduce:active:scale-100",
        "touch-target",
        variantClass[variant],
        sizeClass[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
