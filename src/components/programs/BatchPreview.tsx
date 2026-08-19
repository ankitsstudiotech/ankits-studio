import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Caption } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { BatchSlotProps } from "./types";

export type BatchPreviewProps = {
  /** Verified slots only — never pass mock/illustrative times. */
  slots: BatchSlotProps[];
  title?: string;
  description?: string;
  emptyLabel?: string;
  whatsappHref?: string;
  whatsappLabel?: string;
};

/**
 * Batch availability for a programme page.
 * Exact class rows render only when verified; otherwise honest pending + WhatsApp.
 */
export function BatchPreview({
  slots,
  title = "Batch availability",
  description = "Exact class times vary by branch and have not been published yet. Studio operating hours are separate from batch start times.",
  emptyLabel = "Exact batch times for this programme are not published yet. Message us on WhatsApp for current availability.",
  whatsappHref,
  whatsappLabel = "Ask about batches on WhatsApp",
}: BatchPreviewProps) {
  return (
    <Section id="batches" eyebrow="Batch availability" title={title} description={description}>
      {slots.length === 0 ? (
        <div className="flex flex-col gap-4">
          <Body>{emptyLabel}</Body>
          {whatsappHref ? (
            <p>
              <a
                href={whatsappHref}
                className="inline-flex min-h-11 items-center justify-center bg-accent px-5 text-sm font-bold uppercase tracking-[0.06em] text-accent-foreground touch-target hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                {...(whatsappHref.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {whatsappLabel}
              </a>
            </p>
          ) : (
            <p>
              <Link
                href="/timetable"
                className="font-medium text-ink underline underline-offset-2 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
              >
                See batch availability →
              </Link>
            </p>
          )}
          <Caption>
            Opening WhatsApp starts a chat — it does not mean a message was already delivered.
          </Caption>
        </div>
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
