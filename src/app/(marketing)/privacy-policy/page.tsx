import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/privacy-policy";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description:
    "Draft privacy policy placeholder for Ankit's Studio. Legal review is required before treating this as final counsel-approved policy.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Privacy policy", path: PATH },
];

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section eyebrow="Legal" title="Privacy policy" narrow>
        <Badge accent="neutral" className="mb-4">
          Draft placeholder
        </Badge>
        <Body className="mb-6 rounded-[var(--radius-md)] border border-border bg-accent-soft/60 px-4 py-3">
          This is an explicit draft placeholder. Legal review is required before launch. Do not treat
          this text as an enforceable privacy policy.
        </Body>

        <Heading as="h2" className="mb-3">
          What this draft will cover
        </Heading>
        <Body className="mb-4">
          A future counsel-approved policy will describe what personal data is collected (for example
          trial booking details), why it is processed, how long it is retained, and how visitors can
          request access or deletion.
        </Body>

        <Heading as="h2" className="mb-3">
          Current development behaviour
        </Heading>
        <Body>
          Development and mock-publish environments may accept form submissions through a mock lead
          adapter for local testing only. Production does not claim that a lead was delivered unless
          a real provider is configured.
        </Body>
      </Section>
    </main>
  );
}
