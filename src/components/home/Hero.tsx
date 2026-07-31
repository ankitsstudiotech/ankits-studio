import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Body, HeroHeading, Overline } from "@/components/ui/Typography";
import { FadeIn } from "@/components/motion/TextReveal";

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
};

/**
 * Server-friendly hero: headline, copy, and CTAs are always in the HTML.
 * FadeIn only enhances secondary chrome after hydration — LCP text is never
 * gated on client JS (ADR-009).
 */
export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  media,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <Container className="grid items-center gap-10 py-[var(--spacing-section)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div className="min-w-0">
          {eyebrow ? <Overline className="mb-4">{eyebrow}</Overline> : null}
          <HeroHeading className="max-w-xl">{title}</HeroHeading>
          <Body size="lg" className="mt-5 max-w-lg">
            {description}
          </Body>
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
                  "border border-border bg-surface-raised text-base font-medium text-ink touch-target",
                  "transition-colors hover:border-border-strong",
                  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
                ].join(" ")}
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>

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
