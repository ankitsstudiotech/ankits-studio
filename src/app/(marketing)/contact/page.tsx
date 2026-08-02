import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { getContactDetails, getPubliclyListedBranches, getStudioContactLinks } from "@/content";
import { getPrimaryConversionHref, SECONDARY_TRIAL_FORM_HREF } from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { ContactForm } from "./ContactForm";

const PATH = "/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Ankit's Studio — WhatsApp for a free trial, central phone, branch directory, and a trial form.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Contact", path: PATH },
];

type ContactPageProps = {
  searchParams: Promise<{ status?: string; mode?: string; ref?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const contact = getContactDetails();
  const studioLinks = getStudioContactLinks();
  const whatsappTrialHref = getPrimaryConversionHref();
  const branches = getPubliclyListedBranches();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const disclaimer =
    contact.dataStatus === "verified" ? undefined : contact.mockDisclaimer;

  const status = params.status;
  const statusMessage =
    status === "received"
      ? params.mode === "mock"
        ? `Inquiry accepted locally for development (reference ${params.ref ?? "n/a"}). Not delivered to a live inbox.`
        : `Inquiry accepted (reference ${params.ref ?? "n/a"}).`
      : status === "not-configured"
        ? "Your message was not delivered. No live lead provider is configured."
        : status === "provider-error"
          ? "Your message was not delivered. The lead provider is not ready."
          : null;

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Contact"
        title="Get in touch"
        titleAs="h1"
        description={contact.introText}
      >
        <Badge accent="neutral" className="mb-4">
          {contact.dataStatus === "verified" ? "Central enquiry verified" : "Safe mock contact states"}
        </Badge>
        <Body className="mb-4 max-w-3xl">
          Primary path:{" "}
          <Link
            href={whatsappTrialHref}
            className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
            {...(whatsappTrialHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            book a free trial on WhatsApp
          </Link>
          . Opening WhatsApp does not mean a message was delivered. Secondary:{" "}
          <Link
            href={SECONDARY_TRIAL_FORM_HREF}
            className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
          >
            trial request form
          </Link>
          .
        </Body>
        {disclaimer ? <Caption className="mb-6 text-ink-subtle">{disclaimer}</Caption> : null}

        <dl className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5">
            <dt className="text-sm font-semibold text-ink">Central phone & WhatsApp</dt>
            <dd className="mt-2">
              {studioLinks.phoneHref ? (
                <Body as="span">
                  <a
                    href={studioLinks.phoneHref}
                    className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
                  >
                    {contact.generalPhone}
                  </a>
                </Body>
              ) : (
                <Body as="span">{contact.generalPhone}</Body>
              )}
              <Caption className="mt-2 block">
                Central studio enquiry number — inherited by branches; not a unique branch line.
                {studioLinks.whatsappHref ? (
                  <>
                    {" "}
                    <a
                      href={whatsappTrialHref.startsWith("http") ? whatsappTrialHref : studioLinks.whatsappHref}
                      className="font-semibold text-ink underline underline-offset-4 hover:text-accent"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open WhatsApp
                    </a>
                    {" "}
                    (does not confirm delivery).
                  </>
                ) : null}
              </Caption>
            </dd>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5">
            <dt className="text-sm font-semibold text-ink">General email</dt>
            <dd className="mt-2">
              <Body as="span" className="break-all">
                {contact.generalEmail}
              </Body>
              <Caption className="mt-2 block">
                Placeholder address — not a confirmed studio inbox.
              </Caption>
            </dd>
          </div>
        </dl>
      </Section>

      <Section
        eyebrow="Branches"
        title="Listed locations"
        description="Branch phone and WhatsApp actions stay disabled until each branch record is verified."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {branches.map((branch) => (
            <li key={branch.slug}>
              <Card href={`/locations/${branch.slug}`} interactive className="h-full">
                <Heading as="h3" className="mb-2 break-words">
                  {branch.name}
                </Heading>
                <Body className="mb-3 break-words">{branch.address}</Body>
                <Caption>
                  {branch.dataStatus === "verified"
                    ? "Verified branch details."
                    : branch.mockDisclaimer}
                </Caption>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="Inquiry"
        title="Send a non-trial message"
        description="Fallback form for general questions. Live delivery requires a configured lead provider."
        narrow
      >
        {statusMessage ? (
          <p
            role="status"
            aria-live="polite"
            className="mb-6 rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-3 text-sm"
          >
            {statusMessage}
          </p>
        ) : null}

        <ContactForm />
      </Section>
    </main>
  );
}
