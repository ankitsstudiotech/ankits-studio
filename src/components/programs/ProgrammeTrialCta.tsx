import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";

export type ProgrammeTrialCtaProps = {
  programmeName: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ProgrammeTrialCta({
  programmeName,
  title = "Try this programme",
  body,
  ctaLabel = "Book a trial",
  ctaHref = "/trial",
}: ProgrammeTrialCtaProps) {
  return (
    <Section id="trial" eyebrow="Trial" title="Start with a visit">
      <Card className="flex flex-col items-start gap-5 bg-accent-soft/80 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 max-w-xl">
          <Heading as="h3" className="mb-2 break-words">
            {title}
          </Heading>
          <Body>
            {body ??
              `Book an illustrative trial for ${programmeName}. Final fees and batch assignment stay unconfirmed until verified.`}
          </Body>
        </div>
        <Link
          href={ctaHref}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent px-6 text-base font-semibold text-accent-foreground touch-target hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
        >
          {ctaLabel}
        </Link>
      </Card>
    </Section>
  );
}
