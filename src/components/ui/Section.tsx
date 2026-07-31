import type { ElementType, ReactNode } from "react";
import { Container } from "./Container";

export type SectionProps = {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  containerClassName?: string;
  as?: ElementType;
  narrow?: boolean;
};

export function Section({
  children,
  id,
  eyebrow,
  title,
  description,
  className = "",
  containerClassName = "",
  as: Comp = "section",
  narrow = false,
}: SectionProps) {
  return (
    <Comp
      id={id}
      className={["py-[var(--spacing-section)]", className].filter(Boolean).join(" ")}
    >
      <Container narrow={narrow} className={containerClassName}>
        {(eyebrow || title || description) && (
          <header className="mb-8 max-w-2xl sm:mb-10">
            {eyebrow ? (
              <p className="mb-3 font-[family-name:var(--font-sans)] text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-accent">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[var(--text-title--line-height)] tracking-[var(--text-title--letter-spacing)] text-ink">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-3 text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-ink-muted">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </Container>
    </Comp>
  );
}
