import { Badge } from "@/components/ui/Badge";
import { Caption, Heading } from "@/components/ui/Typography";

export type TimetablePreviewSlot = {
  id: string;
  dayLabel: string;
  timeLabel: string;
  programmeLabel: string;
  branchLabel: string;
  mockDisclaimer: string;
};

export type TimetablePreviewProps = {
  slots: TimetablePreviewSlot[];
  title?: string;
  description?: string;
};

/**
 * Presentation preview — not the full /timetable filter UI.
 * Semantic list (mobile-friendly); table-like on larger screens.
 */
export function TimetablePreview({
  slots,
  title = "This week’s classes",
  description = "Illustrative schedule preview — not a real timetable.",
}: TimetablePreviewProps) {
  return (
    <div className="overflow-hidden border border-border bg-surface-raised">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <Heading as="h3">{title}</Heading>
        <Caption className="mt-1">{description}</Caption>
      </div>

      {/* Mobile: stacked cards */}
      <ul className="divide-y divide-border md:hidden">
        {slots.map((slot) => (
          <li key={slot.id} className="flex flex-col gap-2 px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge accent="accent">{slot.dayLabel}</Badge>
              <span className="text-sm font-semibold text-ink">{slot.timeLabel}</span>
            </div>
            <p className="font-medium text-ink">{slot.programmeLabel}</p>
            <Caption>
              {slot.branchLabel} · {slot.mockDisclaimer}
            </Caption>
          </li>
        ))}
      </ul>

      {/* md+: table semantics */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">{title}</caption>
          <thead className="bg-surface-sunken text-[length:var(--text-overline)] uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-subtle">
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
              <th scope="col" className="px-6 py-3 font-semibold">
                Branch
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
                <td className="px-6 py-4 text-ink">{slot.programmeLabel}</td>
                <td className="px-6 py-4">
                  <span className="text-ink-muted">{slot.branchLabel}</span>
                  <Caption className="mt-1 block text-ink-subtle">{slot.mockDisclaimer}</Caption>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
