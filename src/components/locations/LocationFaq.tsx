import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { FaqItemProps } from "./types";

export type LocationFaqProps = {
  items: FaqItemProps[];
  title?: string;
  emptyLabel?: string;
};

export function LocationFaq({
  items,
  title = "Branch FAQ",
  emptyLabel = "FAQ for this branch is to be confirmed.",
}: LocationFaqProps) {
  return (
    <Section
      id="location-faq"
      eyebrow="FAQ"
      title={title}
      description="Branch-specific questions. Answers stay labelled until verified."
      narrow
      className="bg-surface-sunken/50"
    >
      {items.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <details
              key={item.id}
              className="group rounded-[var(--radius-lg)] border border-border bg-surface-raised px-5 py-2 open:shadow-[var(--shadow-soft)]"
            >
              <summary className="cursor-pointer list-none py-3 font-[family-name:var(--font-display)] text-[length:var(--text-heading)] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring">
                <span className="flex min-h-11 items-center justify-between gap-4 text-left break-words">
                  {item.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-accent transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <div className="border-t border-border pb-4 pt-3">
                <Body>{item.answer}</Body>
                {item.disclaimer ? (
                  <FieldDisclaimer className="mt-3">{item.disclaimer}</FieldDisclaimer>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      )}
    </Section>
  );
}
