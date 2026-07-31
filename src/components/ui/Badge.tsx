import type { ReactNode } from "react";

export type BadgeAccent = "neutral" | "strength" | "calm" | "high-energy" | "accent";

export type BadgeProps = {
  children: ReactNode;
  accent?: BadgeAccent;
  className?: string;
};

const accentClass: Record<BadgeAccent, string> = {
  neutral: "bg-surface-sunken text-ink-muted",
  accent: "bg-accent-soft text-accent",
  strength: "bg-accent-strength-soft text-accent-strength",
  calm: "bg-accent-calm-soft text-accent-calm",
  "high-energy": "bg-accent-high-energy-soft text-accent-high-energy",
};

export function Badge({ children, accent = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-1",
        "text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)]",
        accentClass[accent],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
