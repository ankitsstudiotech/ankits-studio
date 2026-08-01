import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Field, TextInput, TextSelect, TextTextarea } from "@/components/forms/Field";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Caption } from "@/components/ui/Typography";
import { getProgrammes, getPubliclyListedBranches } from "@/content";
import { ageGroupValues, preferredTimingValues } from "@/lib/leads";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { submitTrialLead } from "./actions";

const PATH = "/trial";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a free trial",
  description:
    "Request a trial class at Ankit's Studio. Development builds accept mock leads locally; production does not pretend delivery without a provider.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Book a free trial", path: PATH },
];

const TIMING_LABELS: Record<(typeof preferredTimingValues)[number], string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  weekend: "Weekend",
  flexible: "Flexible",
};

const AGE_LABELS: Record<(typeof ageGroupValues)[number], string> = {
  adults: "Adults",
  teens: "Teens",
  kids: "Kids",
  mixed: "Mixed / family",
};

type TrialPageProps = {
  searchParams: Promise<{ status?: string; mode?: string; ref?: string }>;
};

export default async function TrialPage({ searchParams }: TrialPageProps) {
  const params = await searchParams;
  const branches = getPubliclyListedBranches();
  const programmes = getProgrammes();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  const status = params.status;
  const statusMessage =
    status === "received"
      ? params.mode === "mock"
        ? `Request accepted locally for development (reference ${params.ref ?? "n/a"}). This was not sent to a live lead provider.`
        : `Request accepted (reference ${params.ref ?? "n/a"}).`
      : status === "not-configured"
        ? "Your details were not delivered. No live lead provider is configured in this environment."
        : status === "provider-error"
          ? "Your details were not delivered. The lead provider is not ready."
          : status === "validation-error"
            ? "Please check the form fields and try again."
            : null;

  const statusTone =
    status === "received" ? "text-ink" : status ? "text-accent-strength" : undefined;

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Trial"
        title="Book a free trial"
        description="Tell us how to reach you and which class you’d like to try. Production builds will not claim success unless a real lead provider is connected."
        narrow
      >
        <Badge accent="neutral" className="mb-6">
          Lead routing adapter required for live delivery
        </Badge>

        {statusMessage ? (
          <p
            role="status"
            aria-live="polite"
            className={`mb-6 rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-3 text-sm ${statusTone}`}
          >
            {statusMessage}
          </p>
        ) : null}

        <form action={submitTrialLead} className="flex flex-col gap-5" noValidate>
          <Field id="name" label="Name" hint="How should we address you?">
            <TextInput id="name" name="name" autoComplete="name" required />
          </Field>

          <Field id="phone" label="Phone" hint="We will only use this to arrange your visit.">
            <TextInput id="phone" name="phone" type="tel" autoComplete="tel" required />
          </Field>

          <Field id="branchSlug" label="Branch">
            <TextSelect id="branchSlug" name="branchSlug" required defaultValue="">
              <option value="" disabled>
                Select a listed branch
              </option>
              {branches.map((branch) => (
                <option key={branch.slug} value={branch.slug}>
                  {branch.name}
                </option>
              ))}
            </TextSelect>
          </Field>

          <Field id="programmeSlug" label="Programme">
            <TextSelect id="programmeSlug" name="programmeSlug" required defaultValue="">
              <option value="" disabled>
                Select a programme
              </option>
              {programmes.map((programme) => (
                <option key={programme.slug} value={programme.slug}>
                  {programme.name}
                </option>
              ))}
            </TextSelect>
          </Field>

          <Field id="preferredTiming" label="Preferred timing">
            <TextSelect id="preferredTiming" name="preferredTiming" required defaultValue="">
              <option value="" disabled>
                Select a preference
              </option>
              {preferredTimingValues.map((value) => (
                <option key={value} value={value}>
                  {TIMING_LABELS[value]}
                </option>
              ))}
            </TextSelect>
          </Field>

          <Field id="ageGroup" label="Age group">
            <TextSelect id="ageGroup" name="ageGroup" required defaultValue="">
              <option value="" disabled>
                Select an age group
              </option>
              {ageGroupValues.map((value) => (
                <option key={value} value={value}>
                  {AGE_LABELS[value]}
                </option>
              ))}
            </TextSelect>
          </Field>

          <Field id="message" label="Optional message">
            <TextTextarea id="message" name="message" rows={4} />
          </Field>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="mt-1 size-5 rounded border-border text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            />
            <label htmlFor="consent" className="text-sm text-ink">
              I agree to be contacted about this trial request. I understand mock/development
              submissions are not sent to a live studio inbox unless a provider is configured.
            </label>
          </div>

          <Button type="submit" size="lg" className="self-start">
            Submit trial request
          </Button>
          <Caption>
            Canonical booking path is <code>/trial</code>. <code>/book-a-free-trial</code> redirects
            here.
          </Caption>
        </form>
      </Section>
    </main>
  );
}
