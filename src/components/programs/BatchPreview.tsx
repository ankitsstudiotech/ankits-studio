import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Caption } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { BatchSlotProps } from "./types";

export type BatchPreviewProps = {
  slots: BatchSlotProps[];
  title?: string;
  description?: string;
  emptyLabel?: string;
};

/**
 * Lightweight batch/schedule preview for a programme page.
 * Full filterable timetable belongs on /timetable.
 */
export function BatchPreview({
  slots,
  title = "Upcoming batches",
  description = "Illustrative slot preview — not a live booking grid.",
  emptyLabel = "Batch times for this programme are to be confirmed.",
}: BatchPreviewProps) {
  return (
    <Section id="batches" eyebrow="Schedule" title={title} description={description}>
      {slots.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-[var(--shadow-soft)]">
          <ul className="divide-y divide-border md:hidden">
            {slots.map((slot) => (
              <li key={slot.id} className="flex flex-col gap-2 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge accent="accent">{slot.dayLabel}</Badge>
                  <span className="text-sm font-semibold text-ink">{slot.timeLabel}</span>
                </div>
                <p className="font-medium text-ink break-words">{slot.locationLabel}</p>
                {slot.disclaimer ? <Caption>{slot.disclaimer}</Caption> : null}
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <caption className="sr-only">{title}</caption>
              <thead className="bg-surface-sunken text-[length:var(--text-overline)] uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Day
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-t border-border">
                    <th scope="row" className="px-6 py-4 font-medium text-ink">
                      {slot.dayLabel}
                    </th>
                    <td className="px-6 py-4 text-ink-muted">{slot.timeLabel}</td>
                    <td className="px-6 py-4">
                      <span className="break-words text-ink">{slot.locationLabel}</span>
                      {slot.disclaimer ? (
                        <FieldDisclaimer className="mt-1">{slot.disclaimer}</FieldDisclaimer>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Section>
  );
}
