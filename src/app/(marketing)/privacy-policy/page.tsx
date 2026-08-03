import type { Metadata } from "next";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Body, Heading } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/privacy-policy";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy policy",
  description:
    "How Ankit’s Studio handles information on this website — WhatsApp enquiries, contact links, and hosting.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Privacy policy", path: PATH },
];

export default function PrivacyPolicyPage() {
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
        <h1 className="pulse-title">Privacy policy</h1>
        <p className="mb-8 text-sm text-[var(--color-muted-on-field)]">Last updated: August 2026</p>

        <Heading as="h2" tone="inverse" className="mb-3">
          What this website does
        </Heading>
        <Body tone="inverse" className="mb-6">
          This website provides studio information for Ankit’s Studio and links that help you enquire
          about programmes, branches, fees and free trials. It is not a medical service and does not
          provide diagnosis or treatment.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          WhatsApp enquiry builders
        </Heading>
        <Body tone="inverse" className="mb-6">
          Trial, pricing and availability builders on this site prepare a message on your device. The
          message is not sent until you choose to open WhatsApp and send it yourself. WhatsApp is an
          external service operated by Meta; its own privacy practices apply once you use that app or
          website.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Phone, email and Maps links
        </Heading>
        <Body tone="inverse" className="mb-6">
          Phone, email and Google Maps links open external applications or services. Those providers
          process information according to their own policies when you use them.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Forms and storage
        </Heading>
        <Body tone="inverse" className="mb-6">
          The primary trial path uses WhatsApp. This website does not claim to store or deliver
          enquiry-form submissions to a studio inbox unless a live message delivery service is
          configured for that environment. If you use a contact form and delivery is not available,
          the site will tell you and you can reach us by WhatsApp, phone or email instead.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Hosting and technical information
        </Heading>
        <Body tone="inverse" className="mb-6">
          Like most websites, hosting infrastructure may process ordinary technical request
          information such as IP address, browser type and pages requested, as needed to serve and
          secure the site. This site does not currently ship a separate marketing analytics or
          advertising pixel integration.
        </Body>

        <Heading as="h2" tone="inverse" className="mb-3">
          Contact
        </Heading>
        <Body tone="inverse" className="mb-2">
          For privacy questions about this website, email{" "}
          <a
            href="mailto:ankitsstudio5@gmail.com"
            className="font-semibold text-ink-inverse underline underline-offset-4"
          >
            ankitsstudio5@gmail.com
          </a>
          .
        </Body>
        <Body tone="inverse" className="text-sm opacity-80">
          This page describes how the live website behaves. It is not a counsel-certified legal
          opinion.
        </Body>
      </article>
    </main>
  );
}
