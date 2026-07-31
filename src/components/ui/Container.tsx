import type { ElementType, ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
  as?: ElementType;
};

export function Container({
  children,
  narrow = false,
  className = "",
  as: Comp = "div",
}: ContainerProps) {
  return (
    <Comp
      className={[
        "mx-auto w-full px-[var(--spacing-gutter)]",
        narrow ? "max-w-[var(--width-container-narrow)]" : "max-w-[var(--width-container)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}
