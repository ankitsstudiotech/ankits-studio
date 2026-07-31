import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer } from "@/components/locations/PendingValue";

export type MapPlaceholderProps = {
  branchName: string;
  /** When false, shows a stronger “not ready” message. */
  addressConfirmed?: boolean;
  note?: string;
  disclaimer?: string;
};

/**
 * Never embeds a live map until the page layer passes a verified embed URL.
 * This component is presentation-only — no iframe, no scraped Maps content.
 */
export function MapPlaceholder({
  branchName,
  addressConfirmed = false,
  note,
  disclaimer,
}: MapPlaceholderProps) {
  return (
    <Section
      id="map"
      eyebrow="Map"
      title="On the map"
      description="Map embeds stay off until the branch address is verified (ADR-011)."
    >
      <div
        className="relative flex min-h-64 flex-col items-center justify-center gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-border bg-surface-sunken px-6 py-12 text-center"
        role="img"
        aria-label={`Map placeholder for ${branchName}`}
      >
        <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink break-words">
          {branchName}
        </p>
        <Body>
          {addressConfirmed
            ? note ?? "Map embed ready to wire once a verified map URL is supplied by the page."
            : note ?? "Map unavailable — address is to be confirmed."}
        </Body>
        <p className="text-[length:var(--text-caption)] text-ink-muted">
          Accessible fallback: use the address and directions sections above.
        </p>
      </div>
      {disclaimer ? <FieldDisclaimer className="mt-4">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
