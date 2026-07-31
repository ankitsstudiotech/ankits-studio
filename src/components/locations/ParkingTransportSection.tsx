import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer, PendingValue } from "./PendingValue";
import { isToBeConfirmed } from "./types";

export type ParkingTransportSectionProps = {
  parking?: string | null;
  nearbyTransport?: string[];
  disclaimer?: string;
};

export function ParkingTransportSection({
  parking,
  nearbyTransport = [],
  disclaimer,
}: ParkingTransportSectionProps) {
  const hasTransport = nearbyTransport.length > 0;

  return (
    <Section
      id="access"
      eyebrow="Getting here"
      title="Parking & transport"
      description="Optional access notes. Missing fields stay clearly pending."
      className="bg-surface-raised/50"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
            Parking
          </p>
          {parking && !isToBeConfirmed(parking) ? (
            <Body size="lg" tone="ink" className="break-words">
              {parking}
            </Body>
          ) : (
            <PendingValue value={parking} fallback="Parking details to be confirmed" />
          )}
        </div>
        <div>
          <p className="mb-2 text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
            Nearby transport
          </p>
          {hasTransport ? (
            <ul className="flex flex-col gap-2">
              {nearbyTransport.map((item) => (
                <li
                  key={item}
                  className="rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-3 text-ink break-words"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <Body>Nearby transport notes to be confirmed.</Body>
          )}
        </div>
      </div>
      {disclaimer ? <FieldDisclaimer className="mt-6">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
