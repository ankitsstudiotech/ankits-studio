import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Field, TextInput, TextTextarea } from "@/components/forms/Field";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { getContactDetails, getPubliclyListedBranches } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";
import { submitContactInquiry } from "./actions";

const PATH = "/contact";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact Ankit's Studio — branch directory and a fallback inquiry form. Phone numbers stay non-clickable until verified.",
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
          : status === "validation-error"
            ? "Please check the form fields and try again."
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
        description={contact.introText}
      >
        <Badge accent="neutral" className="mb-4">
          Safe mock contact states
        </Badge>
        <Body className="mb-4 max-w-3xl">
          Prefer a trial class?{" "}
          <Link href="/trial" className="text-accent underline-offset-4 hover:underline">
            Book a free trial
          </Link>{" "}
          first — that is the primary conversion path.
        </Body>
        {disclaimer ? <Caption className="mb-6 text-ink-subtle">{disclaimer}</Caption> : null}

        <dl className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5">
            <dt className="text-sm font-semibold text-ink">General phone</dt>
            <dd className="mt-2">
              {/* Plain text only — never tel: for unverified mock numbers (ADR-011). */}
              <Body as="span">{contact.generalPhone}</Body>
              <Caption className="mt-2 block">
                Shown as text only until the number is verified for dialling.
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

        <form action={submitContactInquiry} className="flex flex-col gap-5">
          <Field id="name" label="Name">
            <TextInput id="name" name="name" autoComplete="name" required />
          </Field>
          <Field id="phone" label="Phone">
            <TextInput id="phone" name="phone" type="tel" autoComplete="tel" required />
          </Field>
          <Field id="email" label="Email (optional)">
            <TextInput id="email" name="email" type="email" autoComplete="email" />
          </Field>
          <Field id="message" label="Message">
            <TextTextarea id="message" name="message" rows={5} required />
          </Field>
          <div className="flex items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              className="mt-1 size-5 rounded border-border text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            />
            <label htmlFor="consent" className="text-sm text-ink">
              I agree to be contacted about this inquiry. I understand messages are not delivered
              live unless a provider is configured.
            </label>
          </div>
          <Button type="submit" size="lg" className="self-start">
            Send inquiry
          </Button>
        </form>
      </Section>
    </main>
  );
}
