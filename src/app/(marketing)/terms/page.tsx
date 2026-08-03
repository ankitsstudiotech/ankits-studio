import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Body, Heading } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/terms";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of use",
  description:
    "Terms for using the Ankit’s Studio website — general information, enquiries and third-party links.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Terms", path: PATH },
];

export default function TermsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="pulse-page flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <article className="mx-auto w-full max-w-[var(--width-container-narrow)] px-[var(--spacing-gutter)] py-[var(--spacing-section)]">
        <p className="pulse-kicker">Legal</p>
        <h1 className="pulse-title">Terms of use</h1>
        <p className="mb-8 text-sm text-[var(--color-muted-on-field)]">Last updated: August 2026</p>

        <Heading as="h2" tone="inverse" className="mb-3">
          Website information
        </Heading>
        <Body tone="inverse" className="mb-6">
          Content on this website is general information about Ankit’s Studio programmes, branches
          and how to enquire. Fees and batch availability should be confirmed directly with the
          studio. Information may be updated without notice.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Enquiries and trials
        </Heading>
        <Body tone="inverse" className="mb-6">
          Opening a WhatsApp link does not complete a booking by itself. You review and send any
          message in WhatsApp. A free trial remains subject to current branch and batch availability.
          Advance booking is optional; checking availability on WhatsApp is recommended.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Fitness and health
        </Heading>
        <Body tone="inverse" className="mb-6">
          Fitness participation is voluntary. This website does not provide medical diagnosis or
          treatment. Choose activities that suit you, and seek appropriate professional advice where
          necessary.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Third-party services
        </Heading>
        <Body tone="inverse" className="mb-6">
          Links to WhatsApp, Google Maps, phone and email open third-party applications or services.
          Those services have their own terms and privacy practices.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Intellectual property
        </Heading>
        <Body tone="inverse" className="mb-6">
          Branding, logos and site content belonging to Ankit’s Studio may not be copied or reused
          without permission, except where the law allows.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Membership policies
        </Heading>
        <Body tone="inverse" className="mb-6">
          Detailed membership cancellation, refund and freeze rules are confirmed with the studio.
          They are not published as customer-facing legal terms on this website yet.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Contact
        </Heading>
        <Body tone="inverse" className="mb-2">
          Questions about these terms:{" "}
          <a
            href="mailto:ankitsstudio5@gmail.com"
            className="font-semibold text-ink-inverse underline underline-offset-4"
          >
            ankitsstudio5@gmail.com
          </a>
          .
        </Body>
        <Body tone="inverse" className="text-sm opacity-80">
          These terms describe website use. They are not a counsel-certified membership contract.
        </Body>
      </article>
    </main>
  );
}
