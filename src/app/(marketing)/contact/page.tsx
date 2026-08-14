import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageWithFooter } from "@/components/layout/PageWithFooter";
import { RouteOpening } from "@/components/motion";
import { getContactDetails, getPubliclyListedBranches, getStudioContactLinks, getBranchMapsUrl } from "@/content";
import {
  getPrimaryConversionHref,
  SECONDARY_TRIAL_FORM_HREF,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { ContactWhatsAppBuilder } from "./ContactWhatsAppBuilder";

const PATH = "/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Ankit's Studio — WhatsApp, central phone, email, and four neighbourhood studios.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Contact", path: PATH },
];

/**
 * Contact prioritises WhatsApp, phone, email and branches.
 * No server contact form — production has no live lead-delivery provider.
 */
export default function ContactPage() {
  const contact = getContactDetails();
  const studioLinks = getStudioContactLinks();
  const whatsappTrialHref = getPrimaryConversionHref();
  const branches = getPubliclyListedBranches();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const branchOptions = branches.map((branch) => ({
    slug: branch.slug,
    locality: branch.locality,
  }));

  return (
    <PageWithFooter>
    <main className="pulse-page flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <div className="pulse-crumb-bar">
        <PageBreadcrumb items={breadcrumbTrail} />
      </div>

      <div className="grid w-full max-w-[var(--layout-content)] gap-10 px-[var(--layout-gutter)] py-[var(--spacing-section)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12">
        <section aria-labelledby="contact-title">
          <RouteOpening>
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
              <p className="pulse-body">
                Or use the{" "}
                <Link
                  href={SECONDARY_TRIAL_FORM_HREF}
                  className="font-semibold text-ink-inverse underline underline-offset-4"
                >
                  free trial message builder
                </Link>
                .
              </p>
            </div>
          </RouteOpening>

          <section
            id="contact-enquiry"
            className="mt-10 pulse-form-panel sm:p-6"
            aria-labelledby="contact-enquiry-title"
          >
            <h2
              id="contact-enquiry-title"
              className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--text-heading)]"
            >
              Send a message on WhatsApp
            </h2>
            <p className="mb-6 text-sm text-[var(--color-muted-on-field)]">
              Prepare a general enquiry. For the fastest reply about batches and trials, WhatsApp is
              best.
            </p>
            <ContactWhatsAppBuilder
              branches={branchOptions}
              fallbackHref={SECONDARY_TRIAL_FORM_HREF}
            />
          </section>
        </section>

        <section aria-labelledby="contact-channels" className="space-y-4">
          <h2 id="contact-channels" className="pulse-section-title">
            Phone, email &amp; studios
          </h2>
          <div className="border border-[var(--color-border-on-field)] bg-field-raised p-5">
            <p className="text-sm font-semibold text-ink-inverse">Phone &amp; WhatsApp</p>
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
          <div className="border border-[var(--color-border-on-field)] bg-field-raised p-5">
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
            {branches.map((branch) => {
              const mapsUrl = getBranchMapsUrl(branch);
              return (
                <li
                  key={branch.slug}
                  className="border border-[var(--color-border-on-field)] bg-field-raised p-4 text-ink-inverse"
                >
                  <Link
                    href={`/locations/${branch.slug}`}
                    className="block text-ink-inverse no-underline transition-colors hover:text-white"
                  >
                    <span className="font-[family-name:var(--font-display)] text-lg tracking-wide uppercase">
                      {branch.locality}
                    </span>
                    <span className="mt-1 block text-sm text-[var(--color-muted-on-field)]">
                      {branch.address ?? "See the branch page for details"}
                    </span>
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                    <Link
                      href={`/locations/${branch.slug}`}
                      className="text-sm font-semibold text-ink-inverse underline underline-offset-4"
                    >
                      Studio page
                    </Link>
                    {mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-ink-inverse underline underline-offset-4"
                      >
                        Open in Google Maps
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
    </PageWithFooter>
  );
}
