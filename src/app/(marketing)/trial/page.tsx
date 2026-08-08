import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { RouteOpening } from "@/components/motion";
import { getProgrammes, getPubliclyListedBranches, getStudioContactLinks } from "@/content";
import { isConfirmedProgramme } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { TrialWhatsAppForm } from "./TrialWhatsAppForm";

const PATH = "/trial";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a free trial",
  description:
    "Book a free trial at Ankit’s Studio. Tell us your preferences and continue on WhatsApp to message the studio.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Book a free trial", path: PATH },
];

export default function TrialPage() {
  const branches = getPubliclyListedBranches();
  const programmes = getProgrammes().filter(isConfirmedProgramme);
  const studioLinks = getStudioContactLinks();
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

      <div className="mx-auto grid w-full max-w-[var(--width-container)] gap-10 px-[var(--spacing-gutter)] py-[var(--spacing-section)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
        <section aria-labelledby="trial-title">
          <RouteOpening>
            <p className="pulse-kicker">Free trial</p>
            <h1 id="trial-title" className="pulse-title">
              Book a free trial
            </h1>
            <p className="pulse-lede">
              Free once per person for studio services. Share what you can — every field is optional —
              then continue on WhatsApp.
            </p>
          </RouteOpening>
          <ul className="mt-6 list-none space-y-3 p-0 text-[length:var(--text-body)] text-[var(--color-muted-on-field)]">
            <li>Studios open daily · 6:00 AM–10:00 PM</li>
            <li>₹300 one-time registration after you join</li>
          </ul>
          <div className="mt-8 space-y-2 text-sm text-[var(--color-muted-on-field)]">
            {studioLinks.phoneHref ? (
              <p>
                Prefer a call?{" "}
                <a
                  href={studioLinks.phoneHref}
                  className="font-semibold text-ink-inverse underline underline-offset-4"
                >
                  {studioLinks.phoneHref.replace("tel:", "")}
                </a>
              </p>
            ) : null}
            {studioLinks.emailHref ? (
              <p>
                Or email{" "}
                <a
                  href={studioLinks.emailHref}
                  className="font-semibold text-ink-inverse underline underline-offset-4 break-all"
                >
                  {studioLinks.emailHref.replace("mailto:", "")}
                </a>
              </p>
            ) : null}
            <p>
              Prefer the form later? You can always{" "}
              <Link href="/contact" className="font-semibold text-ink-inverse underline underline-offset-4">
                contact us
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          id="trial-builder"
          aria-labelledby="trial-builder-title"
          className="pulse-form-panel sm:p-6"
        >
          <h2
            id="trial-builder-title"
            className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--text-heading)]"
          >
            Trial message builder
          </h2>
          <TrialWhatsAppForm branches={branches} programmes={programmes} />
        </section>
      </div>
    </main>
  );
}
