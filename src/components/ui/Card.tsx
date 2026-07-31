import type { ElementType, ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Interactive cards get hover lift; static presentation stays flat. */
  interactive?: boolean;
  href?: string;
};

export function Card({
  children,
  as,
  className = "",
  interactive = false,
  href,
}: CardProps) {
  const Comp: ElementType = href ? "a" : (as ?? "div");

  return (
    <Comp
      href={href}
      className={[
        "block rounded-[var(--radius-lg)] border border-border bg-surface-raised",
        "p-5 sm:p-6",
        href || interactive ? "no-underline text-inherit" : "",
        interactive
          ? "transition-[transform,box-shadow,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out-quart)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring motion-reduce:hover:translate-y-0"
          : "shadow-[var(--shadow-soft)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}
