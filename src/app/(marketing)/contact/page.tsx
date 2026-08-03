import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { getContactDetails, getPubliclyListedBranches, getStudioContactLinks } from "@/content";
import {
  getPrimaryConversionHref,
  SECONDARY_TRIAL_FORM_HREF,
  WHATSAPP_REVIEW_HELPER,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { ContactForm } from "./ContactForm";

const PATH = "/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Ankit's Studio — WhatsApp for a free trial, central phone, email, and branch directory.",
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

  const status = params.status;
  const statusMessage =
    status === "received"
      ? `Thanks — we received your enquiry reference ${params.ref ?? "n/a"}.`
      : status === "not-configured" || status === "provider-error"
        ? "Your message could not be delivered right now. Please reach us on WhatsApp or phone instead."
        : null;

  return (
    <main className="pulse-page flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <div className="mx-auto grid w-full max-w-[var(--width-container)] gap-10 px-[var(--spacing-gutter)] py-[var(--spacing-section)] lg:grid-cols-2 lg:items-start lg:gap-14">
        <section aria-labelledby="contact-title">
          <p className="pulse-kicker">Contact</p>
          <h1 id="contact-title" className="pulse-title">
            Get in touch
          </h1>
          <p className="pulse-lede">{contact.introText}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={whatsappTrialHref}
              className="pulse-cta self-start"
              {...(whatsappTrialHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              Book a free trial on WhatsApp
            </Link>
            <p className="pulse-body max-w-prose">{WHATSAPP_REVIEW_HELPER}</p>
            <p className="pulse-body">
              Or use the{" "}
              <Link href={SECONDARY_TRIAL_FORM_HREF} className="font-semibold text-ink-inverse underline underline-offset-4">
                trial message builder
              </Link>
              .
            </p>
          </div>
        </section>

        <section aria-labelledby="contact-channels" className="space-y-4">
          <h2 id="contact-channels" className="pulse-section-title">
            Phone, email &amp; branches
          </h2>
          <div className="border border-white/10 bg-field-raised p-5">
            <p className="text-sm font-semibold text-ink-inverse">Central phone &amp; WhatsApp</p>
            {studioLinks.phoneHref ? (
              <a
                href={studioLinks.phoneHref}
                className="mt-2 block text-lg font-semibold text-ink-inverse underline underline-offset-4"
              >
                {contact.generalPhone}
              </a>
            ) : (
              <p className="mt-2 text-lg font-semibold text-ink-inverse">{contact.generalPhone}</p>
            )}
            <p className="mt-2 text-sm text-[var(--color-muted-on-field)]">
              Shared across all branches. Messages are answered during studio operating hours.
            </p>
          </div>
          <div className="border border-white/10 bg-field-raised p-5">
            <p className="text-sm font-semibold text-ink-inverse">Email</p>
            {studioLinks.emailHref ? (
              <a
                href={studioLinks.emailHref}
                className="mt-2 block break-all font-semibold text-ink-inverse underline underline-offset-4"
              >
                {contact.generalEmail}
              </a>
            ) : (
              <p className="mt-2 break-all font-semibold text-ink-inverse">{contact.generalEmail}</p>
            )}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {branches.map((branch) => (
              <li key={branch.slug}>
                <Link
                  href={`/locations/${branch.slug}`}
                  className="block border border-white/10 bg-field-raised p-4 text-ink-inverse no-underline transition-colors hover:border-white/25"
                >
                  <span className="font-[family-name:var(--font-display)] text-lg tracking-wide">
                    {branch.locality}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--color-muted-on-field)]">
                    {branch.address ?? "Address on the branch page"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        id="contact-form"
        className="mx-auto w-full max-w-[var(--width-container)] px-[var(--spacing-gutter)] pb-[var(--spacing-section)]"
        aria-labelledby="contact-form-title"
      >
        <div className="mx-auto max-w-[var(--width-container-narrow)] border border-white/10 bg-[var(--color-surface)] p-5 text-ink sm:p-6">
          <h2
            id="contact-form-title"
            className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--text-heading)]"
          >
            Send a general message
          </h2>
          <p className="mb-6 text-sm text-ink-muted">
            For non-trial questions. Prefer WhatsApp for the fastest reply about batches and trials.
          </p>
          {statusMessage ? (
            <p
              role="status"
              aria-live="polite"
              className="mb-6 border border-border bg-surface-raised px-4 py-3 text-sm"
            >
              {statusMessage}
            </p>
          ) : null}
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
