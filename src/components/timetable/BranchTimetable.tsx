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
  slots: BranchTimetableSlot[];
  branchName: string;
  title?: string;
  description?: string;
  emptyLabel?: string;
};

/**
 * Branch-scoped timetable presentation. Stacked on small screens; table from md+.
 * Not the full site-wide filterable /timetable experience.
 */
export function BranchTimetable({
  slots,
  branchName,
  title = "This week at the branch",
  description,
  emptyLabel = "Timetable for this branch is to be confirmed.",
}: BranchTimetableProps) {
  return (
    <Section
      id="branch-timetable"
      eyebrow="Timetable"
      title={title}
      description={
        description ??
        `Illustrative classes for ${branchName}. Full filters live on the main timetable page.`
      }
    >
      {slots.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-raised shadow-[var(--shadow-soft)]">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <Heading as="h3" className="break-words">
              {branchName}
            </Heading>
            <Caption className="mt-1">Branch schedule preview</Caption>
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
