import type { ElementType, ReactNode } from "react";

type Tone = "ink" | "muted" | "inverse" | "accent";

const toneClass: Record<Tone, string> = {
  ink: "text-ink",
  muted: "text-ink-muted",
  inverse: "text-ink-inverse",
  accent: "text-accent",
};

export type DisplayProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  tone?: Tone;
};

export function Display({
  children,
  as: Comp = "h1",
  className = "",
  tone = "ink",
}: DisplayProps) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-display)] font-normal",
        "text-[length:var(--text-display)] leading-[var(--text-display--line-height)] tracking-[var(--text-display--letter-spacing)]",
        "text-balance",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}

export function HeroHeading({
  children,
  as: Comp = "h1",
  className = "",
  tone = "ink",
}: DisplayProps) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-display)] font-normal",
        "text-[length:var(--text-hero)] leading-[var(--text-hero--line-height)] tracking-[var(--text-hero--letter-spacing)]",
        "text-balance",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}

export function Title({
  children,
  as: Comp = "h2",
  className = "",
  tone = "ink",
}: DisplayProps) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-display)] font-normal",
        "text-[length:var(--text-title)] leading-[var(--text-title--line-height)] tracking-[var(--text-title--letter-spacing)]",
        "text-balance",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}

export function Heading({
  children,
  as: Comp = "h3",
  className = "",
  tone = "ink",
}: DisplayProps) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-display)] font-normal",
        "text-[length:var(--text-heading)] leading-[var(--text-heading--line-height)]",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}

export function Body({
  children,
  as: Comp = "p",
  className = "",
  tone = "muted",
  size = "md",
}: DisplayProps & { size?: "md" | "lg" }) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-sans)]",
        size === "lg"
          ? "text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)]"
          : "text-[length:var(--text-body)] leading-[var(--text-body--line-height)]",
        "text-pretty",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}

export function Overline({
  children,
  as: Comp = "p",
  className = "",
  tone = "accent",
}: DisplayProps) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-sans)] font-semibold uppercase",
        "text-[length:var(--text-overline)] leading-[var(--text-overline--line-height)] tracking-[var(--text-overline--letter-spacing)]",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}

export function Caption({
  children,
  as: Comp = "p",
  className = "",
  tone = "muted",
}: DisplayProps) {
  return (
    <Comp
      className={[
        "font-[family-name:var(--font-sans)]",
        "text-[length:var(--text-caption)] leading-[var(--text-caption--line-height)]",
        toneClass[tone],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Comp>
  );
}
