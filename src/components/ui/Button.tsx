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
    "bg-accent text-accent-foreground hover:bg-accent-hover rounded-none font-bold uppercase tracking-[0.06em]",
  secondary:
    "bg-transparent text-ink border border-border-strong hover:border-ink rounded-none font-semibold uppercase tracking-[0.06em]",
  ghost: "bg-transparent text-ink hover:bg-surface-sunken rounded-none font-medium",
  inverse:
    "bg-ink-inverse text-field hover:bg-white rounded-none font-bold uppercase tracking-[0.06em]",
};

const sizeClass: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-xs gap-2",
  lg: "min-h-12 px-6 text-xs gap-2.5",
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
        "inline-flex items-center justify-center font-[family-name:var(--font-sans)]",
        "transition-[background-color,border-color,transform,color] duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
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
