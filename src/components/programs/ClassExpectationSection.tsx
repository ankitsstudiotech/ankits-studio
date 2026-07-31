import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer, PendingValue } from "./PendingValue";
import { isToBeConfirmed } from "./types";

export type ClassExpectationSectionProps = {
  title?: string;
  classStructure: string;
  whoItsFor?: string;
  disclaimer?: string;
};

export function ClassExpectationSection({
  title = "What a class feels like",
  classStructure,
  whoItsFor,
  disclaimer,
}: ClassExpectationSectionProps) {
  return (
    <Section
      id="class-expectation"
      eyebrow="In class"
      title={title}
      description="How sessions are typically structured — pacing may vary by coach and level."
      className="bg-surface-raised/50"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
            Class structure
          </p>
          <PendingValue value={classStructure} className="text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)]" />
        </div>
        <div>
          <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
            Who it’s for
          </p>
          {whoItsFor && !isToBeConfirmed(whoItsFor) ? (
            <Body size="lg" tone="ink">
              {whoItsFor}
            </Body>
          ) : (
            <PendingValue value={whoItsFor} />
          )}
        </div>
      </div>
      {disclaimer ? <FieldDisclaimer className="mt-6">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
