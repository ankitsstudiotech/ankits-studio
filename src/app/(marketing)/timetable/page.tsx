import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import {
  getProgrammes,
  getPubliclyListedBranches,
  getStudioCommercial,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/timetable";

export const metadata: Metadata = buildPageMetadata({
  title: "Batch Availability",
  description:
    "Ask Ankit’s Studio on WhatsApp for current batch availability by branch and programme. Studios operate 6:00 AM–10:00 PM — that window is not a class timetable.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Batch Availability", path: PATH },
];

/**
 * Honest batch-availability surface.
 * Exact class rows are not published — owner has not supplied verified schedules.
 * Operating window is shown separately and must never be rendered as continuous class time.
 */
export default function TimetablePage() {
  const branches = getPubliclyListedBranches();
  const programmes = getProgrammes().filter(
    (programme) => programme.taxonomyStatus !== "migration-pending",
  );
  const commercial = getStudioCommercial();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Batch availability"
        title="Current slots vary by branch and programme"
        titleAs="h1"
        description="We do not publish a full class timetable yet. Message us on WhatsApp for the latest batches that fit your branch, programme, and preferred time."
      >
        <Badge accent="neutral" className="mb-6">
          Schedules confirmed on enquiry
        </Badge>

        <div className="mb-8 rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5">
          <Heading as="h2" className="mb-2 text-lg">
            Studio operating window
          </Heading>
          <Body className="mb-2">
            Branches operate from <strong>6:00 AM to 10:00 PM</strong>.
          </Body>
          <Caption>
            This is the studio open window — not one continuous class, and not a list of batch start
            times. Batches run during the day; exact timings differ by programme and branch.
          </Caption>
        </div>

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={trialHref}
            className="inline-flex min-h-11 items-center justify-center bg-accent px-5 text-sm font-bold uppercase tracking-[0.06em] text-accent-foreground touch-target hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
            {...(trialHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {trialLabel}
          </a>
          <Caption>
            Opening WhatsApp starts a chat — it does not mean a message was already delivered.
            {commercial.registrationFeeInr != null
              ? ` Free trial · ₹${commercial.registrationFeeInr} registration after you join.`
              : null}
          </Caption>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="availability-programmes">
            <Heading as="h2" className="mb-3">
              <span id="availability-programmes">Programmes you can ask about</span>
            </Heading>
            <ul className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface-raised">
              {programmes.map((programme) => (
                <li key={programme.slug}>
                  <Link
                    href={`/programs/${programme.slug}`}
                    className="flex min-h-11 items-center px-4 py-3 text-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                  >
                    {programme.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="availability-branches">
            <Heading as="h2" className="mb-3">
              <span id="availability-branches">Branches</span>
            </Heading>
            <ul className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface-raised">
              {branches.map((branch) => (
                <li key={branch.slug}>
                  <Link
                    href={`/locations/${branch.slug}`}
                    className="flex min-h-11 items-center px-4 py-3 text-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                  >
                    {branch.name.replace(/^Ankit's Studio —\s*/i, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Section>
    </main>
  );
}
