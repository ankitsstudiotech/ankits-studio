import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";

export type EquipmentSectionProps = {
  items: string[];
  title?: string;
  emptyLabel?: string;
  disclaimer?: string;
};

export function EquipmentSection({
  items,
  title = "What to bring",
  emptyLabel = "No special equipment required — studio gear is provided where needed.",
  disclaimer,
}: EquipmentSectionProps) {
  return (
    <Section
      id="equipment"
      eyebrow="Equipment"
      title={title}
      description="Pack list for this programme. Empty means none beyond standard workout kit."
      className="bg-surface-sunken/40"
    >
      {items.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex min-h-11 items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-3 text-ink"
            >
              <span aria-hidden className="mt-1 text-accent">
                ✓
              </span>
              <span className="break-words">{item}</span>
            </li>
          ))}
        </ul>
      )}
      {disclaimer ? <FieldDisclaimer className="mt-6">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
