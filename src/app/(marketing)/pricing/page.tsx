import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { getPricingPlans, getProgrammeBySlug, getPubliclyListedBranches, getStudioCommercial } from "@/content";
import { getPrimaryConversionHref, SECONDARY_TRIAL_FORM_HREF } from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Registration fee and pending programme pricing for Ankit's Studio. Monthly plans are not published until confirmed.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: PATH },
];

const BILLING_LABEL = {
  monthly: "per month",
  quarterly: "per quarter",
  annual: "per year",
  "per-session": "per session",
} as const;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PricingPage() {
  const plans = getPricingPlans();
  const commercial = getStudioCommercial();
  const branches = getPubliclyListedBranches();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const trialHref = getPrimaryConversionHref();

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Pricing"
        title="Fees"
        titleAs="h1"
        description="Trial class is free. One-time registration fee is confirmed. Programme monthly, quarterly, and annual fees are not yet published."
      >
        <ul className="mb-8 grid gap-5 lg:grid-cols-2">
          <li>
            <Card className="flex h-full flex-col gap-4">
              <Badge accent="accent">Owner-confirmed</Badge>
              <Heading as="h2">Free trial class</Heading>
              <Body>
                {commercial.trialIsFree
                  ? "Book a free trial via WhatsApp (opening the chat does not confirm delivery) or the trial form."
                  : "Trial availability to be confirmed."}
              </Body>
            </Card>
          </li>
          {typeof commercial.registrationFeeInr === "number" ? (
            <li>
              <Card className="flex h-full flex-col gap-4">
                <Badge accent="accent">Owner-confirmed</Badge>
                <Heading as="h2">Registration fee</Heading>
                <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
                  {formatInr(commercial.registrationFeeInr)}
                  <span className="ml-2 text-base font-medium text-ink-muted">one-time</span>
                </p>
                <Caption className="text-ink-muted">
                  Programme fees vary by service and are still pending.
                </Caption>
              </Card>
            </li>
          ) : null}
        </ul>

        {plans.length === 0 ? (
          <Body className="mb-6 max-w-3xl text-ink-muted">
            Detailed membership plan prices are not published yet. Ask via WhatsApp for the current fee for your preferred service and branch.
          </Body>
        ) : (
          <>
            <Badge accent="neutral" className="mb-6">
              Additional plan rows
            </Badge>
            <ul className="grid gap-5 lg:grid-cols-2">
              {plans.map((plan) => {
                const disclaimer =
                  plan.dataStatus === "verified" ? undefined : plan.mockDisclaimer;
                const programmeNames = plan.programmeSlugs
                  .map((slug) => getProgrammeBySlug(slug)?.name)
                  .filter((name): name is string => Boolean(name));
                const branchNames = branches
                  .filter((branch) => plan.branchSlugs.includes(branch.slug))
                  .map((branch) => branch.name);

                return (
                  <li key={plan.slug}>
                    <Card className="flex h-full flex-col gap-4 border-accent/20">
                      <Heading as="h2" className="break-words">
                        {plan.name}
                      </Heading>
                      <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
                        {formatInr(plan.priceInr)}
                        <span className="ml-2 text-base font-medium text-ink-muted">
                          {BILLING_LABEL[plan.billingPeriod]}
                        </span>
                      </p>
                      {disclaimer ? (
                        <Caption className="rounded-[var(--radius-sm)] bg-accent-soft/70 px-3 py-2 text-ink">
                          {disclaimer}
                        </Caption>
                      ) : null}
                      {programmeNames.length > 0 ? (
                        <Caption className="text-ink-muted">
                          Programmes: {programmeNames.join(", ")}
                        </Caption>
                      ) : null}
                      {branchNames.length > 0 ? (
                        <Caption className="text-ink-muted">
                          Branches: {branchNames.join(", ")}
                        </Caption>
                      ) : null}
                    </Card>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <Body className="mt-8 max-w-3xl">
          Ready to visit?{" "}
          <Link
            href={trialHref}
            className="text-accent underline-offset-4 hover:underline"
            {...(trialHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            Book a free trial on WhatsApp
          </Link>
          {" "}
          or use the{" "}
          <Link href={SECONDARY_TRIAL_FORM_HREF} className="text-accent underline-offset-4 hover:underline">
            trial form
          </Link>
          .
        </Body>
      </Section>
    </main>
  );
}
