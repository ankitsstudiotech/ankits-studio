import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";

export type FreeTrialCtaProps = {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function FreeTrialCta({
  title = "Book a trial class",
  body = "Start with a visit. Choose a programme and branch that fits — no fabricated pricing or guarantees on this page.",
  ctaLabel = "Book a trial",
  ctaHref = "/trial",
}: FreeTrialCtaProps) {
  return (
    <Section id="trial" eyebrow="Trial" title="Come move with us">
      <ScrollReveal>
        <Card className="flex flex-col items-start gap-5 bg-accent-soft/80 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Heading as="h3" className="mb-2">
              {title}
            </Heading>
            <Body>{body}</Body>
          </div>
          <Link
            href={ctaHref}
            className={[
              "inline-flex min-h-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] px-6",
              "bg-accent text-base font-semibold text-accent-foreground touch-target",
              "transition-[background-color,transform] duration-[var(--duration-fast)]",
              "hover:bg-accent-hover active:scale-[0.98] motion-reduce:active:scale-100",
              "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring",
            ].join(" ")}
          >
            {ctaLabel}
          </Link>
        </Card>
      </ScrollReveal>
    </Section>
  );
}
