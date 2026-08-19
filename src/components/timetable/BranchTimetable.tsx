import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";

export type BranchTimetableSlot = {
  id: string;
  dayLabel: string;
  timeLabel: string;
  programmeLabel: string;
  disclaimer?: string;
};

export type BranchTimetableProps = {
  /** Verified slots only — never pass mock/illustrative times. */
  slots: BranchTimetableSlot[];
  branchName: string;
  title?: string;
  description?: string;
  emptyLabel?: string;
  whatsappHref?: string;
  whatsappLabel?: string;
};

/**
 * Branch-scoped batch availability UI for verified slot rows only.
 * Production location pages use BranchDetailView instead.
 * Design-lab may pass fixture slots; marketing routes must pass [] or omit.
 * Never pass mock timetable rows from getTimetableSlots() — the public accessor
 * returns verified slots only (currently empty). Do not render operating hours here.
 */
export function BranchTimetable({
  slots,
  branchName,
  title = "Batch availability",
  description,
  emptyLabel = "Exact batch times for this branch are not published yet. Message us on WhatsApp for current programme availability.",
  whatsappHref,
  whatsappLabel = "Ask about batches on WhatsApp",
}: BranchTimetableProps) {
  return (
    <Section
      id="branch-timetable"
      eyebrow="Batch availability"
      title={title}
      description={
        description ??
        `Slots vary by programme at ${branchName}. Studio operating hours are listed separately and are not individual class times.`
      }
    >
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
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <Heading as="h3" className="break-words">
              {branchName}
            </Heading>
            <Caption className="mt-1">Verified batch times</Caption>
          </div>

          <ul className="divide-y divide-border md:hidden">
            {slots.map((slot) => (
              <li key={slot.id} className="flex flex-col gap-2 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge accent="accent">{slot.dayLabel}</Badge>
                  <span className="text-sm font-semibold text-ink">{slot.timeLabel}</span>
                </div>
                <p className="font-medium text-ink break-words">{slot.programmeLabel}</p>
                {slot.disclaimer ? <Caption>{slot.disclaimer}</Caption> : null}
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              <caption className="sr-only">
                {title} — {branchName}
              </caption>
              <thead className="bg-surface-sunken text-[length:var(--text-overline)] uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Day
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Programme
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
                      <span className="break-words text-ink">{slot.programmeLabel}</span>
                      {slot.disclaimer ? (
                        <Caption className="mt-1 block text-ink-subtle">
                          {slot.disclaimer}
                        </Caption>
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
