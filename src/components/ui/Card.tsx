import type { ElementType, ReactNode } from "react";

export type CardProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Interactive cards get border emphasis; no soft lift shadows. */
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
        "block rounded-none border border-border bg-surface-raised",
        "p-5 sm:p-6",
        href || interactive ? "no-underline text-inherit" : "",
        interactive
          ? "transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-standard)] hover:border-border-strong hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}
