import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { FreeTrialCta, LocationTeaserCard, TimetablePreview } from "@/components/home";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading, HeroHeading } from "@/components/ui/Typography";
import { getFaqs, getProgrammes, getPubliclyListedBranches, getTimetableSlots, getTrainers } from "@/content";
import type { Branch, Programme } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildCourseJsonLd, buildFaqPageJsonLd } from "@/lib/seo/structured-data";
import { getProgrammeOrNotFound } from "../_lib/lookup";

type ProgrammePageParams = { params: Promise<{ slug: string }> };

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DIFFICULTY_LABEL: Record<Programme["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "all-levels": "All levels",
};

export function generateStaticParams() {
  return getProgrammes().map((programme) => ({ slug: programme.slug }));
}

export async function generateMetadata({ params }: ProgrammePageParams): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeOrNotFound(slug);
  return buildPageMetadata({
    title: programme.name,
    description: programme.shortDescription,
    path: `/programs/${programme.slug}`,
  });
}

/** Branch/Trainer records don't carry `mockDisclaimer` once verified — this
 *  narrows the discriminated union safely rather than reading the field
 *  unconditionally. */
function disclaimerFor(record: { dataStatus: string; mockDisclaimer?: string }): string | undefined {
  return record.dataStatus === "verified" ? undefined : record.mockDisclaimer;
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageParams) {
  const { slug } = await params;
  const programme = getProgrammeOrNotFound(slug);

  const availableBranches: Branch[] = getPubliclyListedBranches().filter((branch) =>
    programme.branchSlugs.includes(branch.slug)
  );
  const timetableSlots = getTimetableSlots({ programmeSlug: programme.slug });
  const trainers = getTrainers().filter((trainer) => trainer.specialties.includes(programme.slug));
  const programmeFaqs = getFaqs({ programmeSlug: programme.slug });
  const faqs = programmeFaqs.length > 0 ? programmeFaqs : getFaqs().slice(0, 3);

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Programmes", path: "/programs" },
    { name: programme.name, path: `/programs/${programme.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const courseJsonLd = buildCourseJsonLd(programme);
  const faqJsonLd = buildFaqPageJsonLd(faqs);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {courseJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(courseJsonLd) }}
        />
      ) : null}
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      ) : null}

      <Container className="pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/programs" className="hover:text-ink">
                Programmes
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {programme.name}
            </li>
          </ol>
        </nav>
      </Container>

      {/* Hero / Overview */}
      <Container className="pt-6">
        <Badge accent={programme.heroAccent} className="mb-4 w-fit">
          {DIFFICULTY_LABEL[programme.difficulty]}
        </Badge>
        <HeroHeading as="h1" className="mb-4">
          {programme.name}
        </HeroHeading>
        <Body size="lg" className="max-w-2xl">
          {programme.longDescription}
        </Body>
      </Container>

      {/* Who it's for + Class structure */}
      <Section eyebrow="Overview" title="Who it's for" narrow>
        <Body size="lg">{programme.whoItsFor}</Body>
      </Section>

      <Section eyebrow="What to expect" title="Class structure" narrow className="pt-0">
        <Body size="lg">{programme.classStructure}</Body>
      </Section>

      {/* Benefits + Required equipment */}
      <Section eyebrow="Details" title="Benefits" narrow className="pt-0">
        <ul className="flex flex-col gap-2">
          {programme.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <span aria-hidden className="mt-1 text-accent">
                •
              </span>
              <Body as="span">{benefit}</Body>
            </li>
          ))}
        </ul>

        <Heading as="h3" className="mb-2 mt-8">
          Required equipment
        </Heading>
        {programme.requiredEquipment.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {programme.requiredEquipment.map((item) => (
              <li key={item} className="rounded-[var(--radius-sm)] bg-surface-sunken px-2.5 py-1 text-sm text-ink-muted">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <Body>No equipment required.</Body>
        )}
      </Section>

      {/* Available branches */}
      <Section eyebrow="Where" title="Available branches" description="Branches currently offering this programme.">
        {availableBranches.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {availableBranches.map((branch) => (
              <li key={branch.slug}>
                <LocationTeaserCard
                  name={branch.name}
                  href={`/locations/${branch.slug}`}
                  areaLabel={branch.slug}
                  programmeCountLabel={`${branch.programmeSlugs.length} programmes offered`}
                  mockDisclaimer={disclaimerFor(branch) ?? ""}
                />
              </li>
            ))}
          </ul>
        ) : (
          <Body>No branches currently offer this programme.</Body>
        )}
      </Section>

      {/* Timings */}
      <Section eyebrow="Schedule" title="Timings" description="Illustrative schedule — not a confirmed timetable.">
        {timetableSlots.length > 0 ? (
          <TimetablePreview
            title={`${programme.name} timings`}
            description="Illustrative schedule preview — not a confirmed timetable."
            slots={timetableSlots.map((slot) => ({
              id: slot.id,
              dayLabel: DAY_LABELS[slot.dayOfWeek] ?? "—",
              timeLabel: `${slot.startTime}–${slot.endTime}`,
              programmeLabel: programme.name,
              branchLabel: slot.branchSlug,
              mockDisclaimer: disclaimerFor(slot) ?? "",
            }))}
          />
        ) : (
          <Body>No scheduled sessions listed yet for this programme.</Body>
        )}
      </Section>

      {/* Trainers */}
      <Section eyebrow="Coaches" title="Trainers" description="Trainers specialising in this programme.">
        {trainers.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer) => (
              <li key={trainer.slug}>
                <Card className="flex h-full flex-col gap-4">
                  <div className="relative aspect-square w-20 overflow-hidden rounded-full bg-surface-sunken">
                    <Image
                      src={trainer.photo.src}
                      alt={trainer.photo.alt}
                      width={trainer.photo.width}
                      height={trainer.photo.height}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <Heading as="h3" className="mb-1">
                      {trainer.name}
                    </Heading>
                    <Body className="mb-2">{trainer.bio}</Body>
                    {disclaimerFor(trainer) ? <Caption className="text-ink-subtle">{disclaimerFor(trainer)}</Caption> : null}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <Body>Trainer roster for this programme is coming soon.</Body>
        )}
      </Section>

      {/* FAQs */}
      <Section eyebrow="FAQ" title={`${programme.name} FAQs`} narrow className="bg-surface-sunken/50">
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details key={faq.id} className="group rounded-[var(--radius-lg)] border border-border bg-surface-raised px-5 py-2">
              <summary className="cursor-pointer list-none py-3 font-[family-name:var(--font-display)] text-[length:var(--text-heading)] font-semibold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {faq.question}
              </summary>
              <div className="border-t border-border pb-4 pt-3">
                <Body>{faq.answer}</Body>
                {disclaimerFor(faq) ? <Caption className="mt-2 text-ink-subtle">{disclaimerFor(faq)}</Caption> : null}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* Trial CTA */}
      <FreeTrialCta
        title={`Try a ${programme.name} class`}
        body={`Book a trial class to experience ${programme.name.toLowerCase()} at Ankit's Studio.`}
      />
    </main>
  );
}
