import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type TextLinkVariant = "inline" | "nav" | "subtle";

export type TextLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  children: ReactNode;
  variant?: TextLinkVariant;
  className?: string;
};

const variantClass: Record<TextLinkVariant, string> = {
  inline:
    "text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent transition-colors",
  nav: "text-ink/85 hover:text-ink transition-colors",
  subtle: "text-ink-muted hover:text-ink transition-colors",
};

export function TextLink({
  variant = "inline",
  className = "",
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={[
        "rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
        variantClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}
