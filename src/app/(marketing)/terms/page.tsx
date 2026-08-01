import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/terms";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms",
  description:
    "Draft terms of use placeholder for Ankit's Studio. Legal review is required before launch.",
  path: PATH,
  forceNoIndex: true,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Terms", path: PATH },
];

export default function TermsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section eyebrow="Legal" title="Terms of use" narrow>
        <Badge accent="neutral" className="mb-4">
          Draft placeholder
        </Badge>
        <Body className="mb-6 rounded-[var(--radius-md)] border border-border bg-accent-soft/60 px-4 py-3">
          This is an explicit draft placeholder. Legal review is required before launch. Do not treat
          this text as binding terms of service or membership terms.
        </Body>

        <Heading as="h2" className="mb-3">
          Intended scope
        </Heading>
        <Body className="mb-4">
          A future counsel-approved document will cover website use, trial class requests, membership
          agreements, liability limits, and dispute processes appropriate for the studio&apos;s
          jurisdiction.
        </Body>

        <Heading as="h2" className="mb-3">
          Mock content notice
        </Heading>
        <Body>
          Programme descriptions, schedules, pricing, and contact details on this website may still be
          mock or provisional. They are labelled accordingly and are not contractual offers.
        </Body>
      </Section>
    </main>
  );
}
