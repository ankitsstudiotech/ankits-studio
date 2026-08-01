import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import {
  branchSlugSchema,
  getProgrammeBySlug,
  getProgrammes,
  getPubliclyListedBranches,
  getTimetableSlots,
  programmeSlugSchema,
  type BranchSlug,
  type ProgrammeSlug,
} from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/timetable";
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export const metadata: Metadata = buildPageMetadata({
  title: "Timetable",
  description:
    "Illustrative weekly class timetable for Ankit's Studio — filter by branch and programme. Times stay provisional until verified.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Timetable", path: PATH },
];

type TimetableSearchParams = {
  searchParams: Promise<{ branch?: string; programme?: string }>;
};

function parseBranch(value: string | undefined): BranchSlug | undefined {
  if (!value) return undefined;
  const parsed = branchSlugSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

function parseProgramme(value: string | undefined): ProgrammeSlug | undefined {
  if (!value) return undefined;
  const parsed = programmeSlugSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

export default async function TimetablePage({ searchParams }: TimetableSearchParams) {
  const params = await searchParams;
  const branchSlug = parseBranch(params.branch);
  const programmeSlug = parseProgramme(params.programme);

  const branches = getPubliclyListedBranches();
  const programmes = getProgrammes();
  const slots = getTimetableSlots({
    branchSlug,
    programmeSlug,
  }).filter((slot) => {
    // Never surface Thane slots on the public timetable while unlisted.
    return branches.some((branch) => branch.slug === slot.branchSlug);
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const resultLabel =
    slots.length === 1 ? "1 provisional class listed" : `${slots.length} provisional classes listed`;

  const slotsByDay = DAY_LABELS.map((label, dayOfWeek) => ({
    label,
    dayOfWeek,
    slots: slots.filter((slot) => slot.dayOfWeek === dayOfWeek),
  })).filter((group) => group.slots.length > 0);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Timetable"
        title="Weekly class schedule"
        titleAs="h1"
        description="Provisional illustrative timings only. Filters work with a normal form submit — no JavaScript required."
      >
        <Badge accent="neutral" className="mb-6">
          Provisional schedule
        </Badge>

        <form
          method="get"
          action={PATH}
          className="mb-8 grid gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-raised p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end sm:p-5"
        >
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-ink">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              defaultValue={branchSlug ?? ""}
              className="mt-1.5 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <option value="">All listed branches</option>
              {branches.map((branch) => (
                <option key={branch.slug} value={branch.slug}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="programme" className="block text-sm font-medium text-ink">
              Programme
            </label>
            <select
              id="programme"
              name="programme"
              defaultValue={programmeSlug ?? ""}
              className="mt-1.5 min-h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <option value="">All programmes</option>
              {programmes.map((programme) => (
                <option key={programme.slug} value={programme.slug}>
                  {programme.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Apply filters
          </Button>
          <Link
            href={PATH}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-border px-5 text-sm font-medium text-ink touch-target hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
          >
            Clear
          </Link>
        </form>

        <p className="mb-6 text-sm font-medium text-ink" aria-live="polite">
          {resultLabel}
          {branchSlug || programmeSlug ? " for the selected filters." : "."}
        </p>

        {slots.length === 0 ? (
          <Body>No provisional classes match these filters yet.</Body>
        ) : (
          <>
            {/* Mobile / SR-friendly stacked list */}
            <div className="flex flex-col gap-8 md:hidden">
              {slotsByDay.map((group) => (
                <section key={group.label} aria-labelledby={`day-${group.dayOfWeek}`}>
                  <Heading as="h2" className="mb-3">
                    <span id={`day-${group.dayOfWeek}`}>{group.label}</span>
                  </Heading>
                  <ul className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface-raised">
                    {group.slots.map((slot) => (
                      <li key={slot.id} className="flex flex-col gap-2 px-4 py-4">
                        <p className="font-semibold text-ink">
                          {slot.startTime}–{slot.endTime}
                        </p>
                        <p className="break-words text-ink">
                          {getProgrammeBySlug(slot.programmeSlug)?.name ?? slot.programmeSlug}
                        </p>
                        <Caption>
                          {branches.find((branch) => branch.slug === slot.branchSlug)?.name ??
                            slot.branchSlug}
                        </Caption>
                        {slot.dataStatus !== "verified" && slot.mockDisclaimer ? (
                          <Caption className="text-ink-subtle">{slot.mockDisclaimer}</Caption>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[40rem] border-collapse text-left">
                <caption className="sr-only">Provisional weekly timetable</caption>
                <thead className="bg-surface-sunken text-[length:var(--text-overline)] uppercase tracking-[var(--text-overline--letter-spacing)] text-ink-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Day
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Time
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Programme
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Branch
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot.id} className="border-t border-border">
                      <th scope="row" className="px-4 py-3 font-medium text-ink">
                        {DAY_LABELS[slot.dayOfWeek] ?? "—"}
                      </th>
                      <td className="px-4 py-3 text-ink-muted">
                        {slot.startTime}–{slot.endTime}
                      </td>
                      <td className="px-4 py-3 break-words text-ink">
                        {getProgrammeBySlug(slot.programmeSlug)?.name ?? slot.programmeSlug}
                        {slot.dataStatus !== "verified" && slot.mockDisclaimer ? (
                          <Caption className="mt-1 block text-ink-subtle">{slot.mockDisclaimer}</Caption>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {branches.find((branch) => branch.slug === slot.branchSlug)?.name ??
                          slot.branchSlug}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Section>
    </main>
  );
}
