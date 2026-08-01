import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { getProgrammes, getPubliclyListedBranches } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { TrialForm } from "./TrialForm";

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
        titleAs="h1"
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

        <TrialForm branches={branches} programmes={programmes} />
      </Section>
    </main>
  );
}
