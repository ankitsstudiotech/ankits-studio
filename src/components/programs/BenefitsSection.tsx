import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";

export type BenefitsSectionProps = {
  title?: string;
  description?: string;
  benefits: string[];
  disclaimer?: string;
};

export function BenefitsSection({
  title = "What you’ll work toward",
  description = "Category-level benefits for this programme — not guaranteed personal outcomes.",
  benefits,
  disclaimer,
}: BenefitsSectionProps) {
  if (benefits.length === 0) {
    return (
      <Section id="benefits" eyebrow="Benefits" title={title}>
        <Body>Benefits to be confirmed.</Body>
      </Section>
    );
  }

  return (
    <Section id="benefits" eyebrow="Benefits" title={title} description={description}>
      <ol className="grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit, index) => (
          <li
            key={`${index}-${benefit.slice(0, 24)}`}
            className="rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5 shadow-[var(--shadow-soft)]"
          >
            <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>
            <Heading as="h3" className="text-balance break-words">
              {benefit}
            </Heading>
          </li>
        ))}
      </ol>
      {disclaimer ? <FieldDisclaimer className="mt-6">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
