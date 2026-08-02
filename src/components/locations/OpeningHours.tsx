import { Section } from "@/components/ui/Section";
import { Body, Caption } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { OpeningHoursRow } from "./types";

export type OpeningHoursProps = {
  rows: OpeningHoursRow[];
  title?: string;
  emptyLabel?: string;
  disclaimer?: string;
};

export function OpeningHours({
  rows,
  title = "Opening hours",
  emptyLabel = "Opening hours to be confirmed.",
  disclaimer,
}: OpeningHoursProps) {
  return (
    <Section id="hours" eyebrow="Hours" title={title}>
      {rows.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-raised">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{title}</caption>
            <thead className="bg-surface-sunken text-[length:var(--text-overline)] uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                  Day
                </th>
                <th scope="col" className="px-5 py-3 font-semibold sm:px-6">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const pending = row.pending || row.closed;
                const hoursLabel = row.closed
                  ? "Closed"
                  : row.pending
                    ? "To be confirmed"
                    : `${row.opensAt}–${row.closesAt}`;

                return (
                  <tr key={row.dayLabel} className="border-t border-border">
                    <th
                      scope="row"
                      className="px-5 py-3.5 font-medium text-ink sm:px-6"
                    >
                      {row.dayLabel}
                    </th>
                    <td
                      className={[
                        "px-5 py-3.5 sm:px-6",
                        pending ? "italic text-ink-muted" : "text-ink-muted",
                      ].join(" ")}
                    >
                      {hoursLabel}
                      {pending ? (
                        <span className="sr-only"> (not yet confirmed)</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Caption className="mt-3">
        Studio operating window by day — not a class-by-class timetable. Exact batches vary; ask on
        WhatsApp for current availability.
      </Caption>
      {disclaimer ? <FieldDisclaimer className="mt-2">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
