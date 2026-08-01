import type { Metadata } from "next";
import Link from "next/link";
import { TransformationStories } from "@/components/home";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { getProgrammeBySlug, getTransformations } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/transformations";

export const metadata: Metadata = buildPageMetadata({
  title: "Transformations",
  description:
    "Editorial placeholder for the kind of progress Ankit's Studio coaches toward — no fabricated before-and-after outcomes.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Transformations", path: PATH },
];

export default function TransformationsPage() {
  const transformations = getTransformations();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Transformations"
        title="Editorial placeholder"
        description="This page reserves space for future owner-approved stories. It does not fabricate before-and-after photography, weight changes, or percentage claims."
      >
        <Badge accent="neutral" className="mb-4">
          No fabricated outcomes
        </Badge>
        <Body className="max-w-3xl">
          Until verified member stories exist, we only show qualitative examples of the kind of
          progress a programme is designed to support — never invented identities or measured results.
        </Body>
      </Section>

      <TransformationStories
        items={transformations.map((item) => ({
          slug: item.slug,
          summary: item.summary,
          programmeLabel: getProgrammeBySlug(item.programmeSlug)?.name ?? item.programmeSlug,
          mockDisclaimer:
            item.dataStatus === "verified" ? "Verified transformation story." : item.mockDisclaimer,
        }))}
      />

      <Section title="Prefer a visit over a story?">
        <Body>
          <Link href="/trial" className="text-accent underline-offset-4 hover:underline">
            Book a free trial
          </Link>{" "}
          to experience coaching in person.
        </Body>
      </Section>
    </main>
  );
}
