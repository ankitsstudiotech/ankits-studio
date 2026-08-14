import type { ElementType, ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
  narrow?: boolean;
  /** Full viewport width minus shared gutter — header/footer chrome. */
  full?: boolean;
  className?: string;
  as?: ElementType;
};

export function Container({
  children,
  narrow = false,
  full = false,
  className = "",
  as: Comp = "div",
}: ContainerProps) {
  return (
    <Comp
      className={[
        "w-full px-[var(--layout-gutter)]",
        full
          ? "max-w-none"
          : narrow
            ? "mx-auto max-w-[var(--width-container-narrow)]"
            : "max-w-[var(--layout-content)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}
