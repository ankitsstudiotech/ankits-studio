import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Body, HeroHeading, Overline } from "@/components/ui/Typography";
import { FadeIn } from "@/components/motion/TextReveal";
import { MockDisclaimer } from "./MockDisclaimer";

export type HeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
    placeholderLabel?: string;
  };
  /** Full-bleed atmospheric treatment; LCP text stays in the server HTML. */
  cinematic?: boolean;
  mockDisclaimer?: string;
};

/**
 * Server-friendly hero: headline, copy, and CTAs are always in the HTML.
 * Optional FadeIn only enhances media chrome after hydration (ADR-009).
 */
export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  media,
  cinematic = false,
  mockDisclaimer,
}: HeroProps) {
  const copy = (
    <div className={cinematic ? "relative z-10 max-w-2xl" : "min-w-0"}>
      {eyebrow ? <Overline className="mb-4">{eyebrow}</Overline> : null}
      <HeroHeading className="max-w-xl">{title}</HeroHeading>
      <Body size="lg" className="mt-5 max-w-lg" tone={cinematic ? "ink" : "muted"}>
        {description}
      </Body>
      {mockDisclaimer ? <MockDisclaimer className="mt-3 max-w-lg">{mockDisclaimer}</MockDisclaimer> : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={primaryCta.href}
          className={[
            "inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-6",
            "bg-accent text-base font-semibold text-accent-foreground touch-target",
            "transition-[background-color,transform] duration-[var(--duration-fast)]",
            "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
          ].join(" ")}
        >
          {primaryCta.label}
        </Link>
        {secondaryCta ? (
          <Link
            href={secondaryCta.href}
            className={[
              "inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-6",
              "border border-border bg-surface-raised/90 text-base font-medium text-ink touch-target",
              "transition-colors hover:border-border-strong",
              "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
            ].join(" ")}
          >
            {secondaryCta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );

  if (cinematic) {
    return (
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={media.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/92 to-surface/50" />
        </div>
        <Container className="relative grid min-h-[min(78vh,44rem)] items-center py-[var(--spacing-section)]">
          {copy}
          {media.placeholderLabel ? (
            <p className="relative z-10 mt-6 w-fit rounded-[var(--radius-sm)] bg-surface-inverse/70 px-2.5 py-1 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-inverse">
              {media.placeholderLabel}
            </p>
          ) : null}
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <Container className="grid items-center gap-10 py-[var(--spacing-section)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        {copy}
        <FadeIn className="min-w-0" delay={0.08}>
          <MediaFrame
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            priority
            sizes="(max-width: 1024px) 100vw, 44vw"
            placeholderLabel={media.placeholderLabel}
            className="shadow-[var(--shadow-lift)]"
          />
        </FadeIn>
      </Container>
    </section>
  );
}
