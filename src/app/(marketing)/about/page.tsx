import type { Metadata } from "next";
import { FounderStoryPlaceholder } from "@/components/home";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Caption } from "@/components/ui/Typography";
import { getBusinessIdentity } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/about";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn about Ankit's Studio — founder story placeholder, studio purpose, and how we approach coaching without invented claims.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "About", path: PATH },
];

export default function AboutPage() {
  const identity = getBusinessIdentity();
  const disclaimer =
    identity.dataStatus === "verified" ? undefined : identity.mockDisclaimer;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="About"
        title={identity.displayName}
        titleAs="h1"
        description={identity.tagline}
      >
        <Badge accent="neutral" className="mb-4">
          Placeholder studio narrative
        </Badge>
        <Body size="lg" className="max-w-3xl">
          {identity.description}
        </Body>
        {disclaimer ? <Caption className="mt-4 text-ink-subtle">{disclaimer}</Caption> : null}
        <Body className="mt-6 max-w-3xl">
          This page does not invent years in business, certifications, awards, or member
          statistics. Those details appear only after the owner confirms them for publication.
        </Body>
      </Section>

      <FounderStoryPlaceholder
        title="Founder story placeholder"
        body="An owner-approved founder narrative, portrait, and timeline have not been provided yet. This block stays clearly labelled so visitors never mistake placeholder copy for a verified biography, certification list, or achievement timeline."
        disclaimer="No founder years, certifications, or achievements have been verified for publication."
        mediaSrc="/mock-media/programme-placeholder.svg"
      />
    </main>
  );
}
