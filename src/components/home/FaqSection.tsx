import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { MockDisclaimer } from "./MockDisclaimer";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  mockDisclaimer?: string;
};

export type FaqSectionProps = {
  items: FaqItem[];
};

/**
 * Server-rendered FAQ using native disclosure widgets — no client JS required
 * for readability. Mock answers stay labelled.
 */
export function FaqSection({ items }: FaqSectionProps) {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Common questions"
      description="Answers below are illustrative placeholders until the owner confirms studio policy copy."
      narrow
      className="bg-surface"
    >
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.id}
            className="group border border-border bg-surface-raised px-5 py-2"
          >
            <summary className="cursor-pointer list-none py-3 font-[family-name:var(--font-display)] text-[length:var(--text-heading)] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring">
              <span className="flex min-h-11 items-center justify-between gap-4">
                {item.question}
                <span
                  aria-hidden
                  className="text-accent transition-transform duration-[var(--duration-fast)] group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-border pb-4 pt-3">
              <Body>{item.answer}</Body>
              {item.mockDisclaimer ? (
                <MockDisclaimer className="mt-3">{item.mockDisclaimer}</MockDisclaimer>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
