import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  mockDisclaimer?: string;
};

export type FaqSectionProps = {
  items: FaqItem[];
  description?: string;
};

/**
 * Server-rendered FAQ using native disclosure widgets.
 */
export function FaqSection({
  items,
  description = "Short answers based on confirmed studio information.",
}: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Quick answers"
      description={description}
      narrow
      className="bg-surface"
    >
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.id}
            className="group border border-border bg-surface-raised px-5 py-2"
          >
            <summary className="cursor-pointer list-none py-3 font-[family-name:var(--font-sans)] text-[length:var(--text-heading)] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring">
              <span className="flex min-h-11 items-center justify-between gap-4">
                {item.question}
                <span
                  aria-hidden
                  className="text-accent transition-transform duration-[var(--duration-fast)] group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-border pb-4 pt-3">
              <Body>{item.answer}</Body>
              {item.mockDisclaimer ? (
                <p className="mt-3 text-sm text-ink-subtle">{item.mockDisclaimer}</p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
