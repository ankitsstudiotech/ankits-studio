import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer, PendingValue } from "./PendingValue";
import { isToBeConfirmed } from "./types";

export type AddressDirectionsProps = {
  address: string;
  directions?: string | null;
  disclaimer?: string;
};

export function AddressDirections({
  address,
  directions,
  disclaimer,
}: AddressDirectionsProps) {
  return (
    <Section
      id="address"
      eyebrow="Find us"
      title="Address & directions"
      description="Long addresses wrap safely. Unconfirmed strings stay labelled."
      className="bg-surface-raised/40"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
            Address
          </p>
          <PendingValue
            value={address}
            as="address"
            className="block text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] not-italic"
          />
        </div>
        <div>
          <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
            Directions
          </p>
          {directions && !isToBeConfirmed(directions) ? (
            <Body size="lg" tone="ink" className="break-words">
              {directions}
            </Body>
          ) : (
            <PendingValue value={directions} fallback="Directions to be confirmed" />
          )}
        </div>
      </div>
      {disclaimer ? <FieldDisclaimer className="mt-6">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
