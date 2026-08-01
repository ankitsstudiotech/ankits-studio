import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { getPricingPlans, getProgrammeBySlug, getPubliclyListedBranches } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/pricing";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Illustrative membership pricing for Ankit's Studio — clearly labelled mock fees, not real offers or discounts.",
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
  const branches = getPubliclyListedBranches();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Pricing"
        title="Membership plans"
        titleAs="h1"
        description="Every fee on this page is mock placeholder pricing. There are no real offers, discount countdowns, or limited-time claims."
      >
        <Badge accent="neutral" className="mb-6">
          Mock pricing — not for sale
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
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge accent="accent">Illustrative</Badge>
                    <Caption className="text-ink-subtle">Not a live offer</Caption>
                  </div>
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
                  <div>
                    <Caption className="mb-2 font-semibold uppercase tracking-wide text-ink-muted">
                      Includes (placeholder)
                    </Caption>
                    <ul className="flex flex-col gap-2">
                      {plan.inclusions.map((item) => (
                        <li key={item} className="text-ink">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {programmeNames.length > 0 ? (
                    <Caption className="text-ink-muted">
                      Programmes (illustrative): {programmeNames.join(", ")}
                    </Caption>
                  ) : null}
                  {branchNames.length > 0 ? (
                    <Caption className="text-ink-muted">
                      Branches (illustrative): {branchNames.join(", ")}
                    </Caption>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>

        <Body className="mt-8 max-w-3xl">
          Ready to visit instead of comparing placeholder fees?{" "}
          <Link href="/trial" className="text-accent underline-offset-4 hover:underline">
            Book a free trial
          </Link>
          .
        </Body>
      </Section>
    </main>
  );
}
