import Link from "next/link";
import type { Metadata } from "next";
import {
  AvailableLocationsSection,
  BatchPreview,
  BenefitsSection,
  ClassExpectationSection,
  EquipmentSection,
  ExperienceLevelSection,
  ProgrammeFaq,
  ProgrammeHero,
  ProgrammeTrialCta,
  TrainerCards,
} from "@/components/programs";
import { Container } from "@/components/ui/Container";
import {
  getBranchBySlug,
  getFaqs,
  getProgrammeBySlug,
  getProgrammes,
  getPubliclyListedBranches,
  getTimetableSlots,
  getTrainers,
} from "@/content";
import type { Trainer } from "@/content";
import {
  buildWhatsAppTrialUrl,
  getPrimaryConversionHref,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildCourseJsonLd, buildFaqPageJsonLd } from "@/lib/seo/structured-data";
import { getProgrammeOrNotFound } from "../_lib/lookup";

type ProgrammePageParams = { params: Promise<{ slug: string }> };

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

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

function disclaimerFor(record: { dataStatus: string; mockDisclaimer?: string }): string | undefined {
  return record.dataStatus === "verified" ? undefined : record.mockDisclaimer;
}

function specialtyLabels(trainer: Trainer): string[] {
  return trainer.specialties
    .map((slug) => getProgrammeBySlug(slug)?.name)
    .filter((name): name is string => Boolean(name));
}

export default async function ProgrammeDetailPage({ params }: ProgrammePageParams) {
  const { slug } = await params;
  const programme = getProgrammeOrNotFound(slug);

  const availableBranches = getPubliclyListedBranches().filter((branch) =>
    programme.branchSlugs.includes(branch.slug)
  );
  const timetableSlots = getTimetableSlots({ programmeSlug: programme.slug });
  const trainers = getTrainers().filter((trainer) => trainer.specialties.includes(programme.slug));
  const programmeFaqs = getFaqs({ programmeSlug: programme.slug });
  const faqs = programmeFaqs.length > 0 ? programmeFaqs : getFaqs().slice(0, 3);
  const whatsappHref =
    buildWhatsAppTrialUrl({ interestedService: programme.name }) ?? getPrimaryConversionHref();

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Programmes", path: "/programs" },
    { name: programme.name, path: `/programs/${programme.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const courseJsonLd = buildCourseJsonLd(programme);
  const faqJsonLd = buildFaqPageJsonLd(faqs);

  const trialLabel = `Book a trial for ${programme.name}`;

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
            <li aria-current="page" className="text-ink break-words">
              {programme.name}
            </li>
          </ol>
        </nav>
      </Container>

      <ProgrammeHero
        name={programme.name}
        shortDescription={programme.shortDescription}
        longDescription={programme.longDescription}
        accent={programme.heroAccent}
        audienceTags={programme.audienceTags}
        primaryCta={{ label: trialLabel, href: "/trial" }}
        secondaryCta={{ label: "See locations for this programme", href: "#available-locations" }}
        disclaimer={disclaimerFor(programme)}
      />

      <BenefitsSection benefits={programme.benefits} />

      <ClassExpectationSection
        classStructure={programme.classStructure}
        whoItsFor={programme.whoItsFor}
      />

      <ExperienceLevelSection level={programme.difficulty} detail={programme.whoItsFor} />

      <EquipmentSection items={programme.requiredEquipment} />

      <AvailableLocationsSection
        locations={availableBranches.map((branch) => ({
          slug: branch.slug,
          name: branch.name,
          href: `/locations/${branch.slug}`,
          address: branch.address,
          disclaimer: disclaimerFor(branch),
        }))}
      />

      <TrainerCards
        trainers={trainers.map((trainer) => ({
          slug: trainer.slug,
          name: trainer.name,
          bio: trainer.bio,
          qualifications: trainer.qualifications,
          specialtyLabels: specialtyLabels(trainer),
          photo: trainer.photo,
          disclaimer: disclaimerFor(trainer),
        }))}
      />

      <BatchPreview
        slots={timetableSlots.map((slot) => ({
          id: slot.id,
          dayLabel: DAY_LABELS[slot.dayOfWeek] ?? "—",
          timeLabel: `${slot.startTime}–${slot.endTime}`,
          locationLabel: getBranchBySlug(slot.branchSlug)?.name ?? slot.branchSlug,
          disclaimer: disclaimerFor(slot),
        }))}
        whatsappHref={whatsappHref}
      />

      <ProgrammeFaq
        title={`${programme.name} FAQs`}
        items={faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          disclaimer: disclaimerFor(faq),
        }))}
      />

      <ProgrammeTrialCta
        programmeName={programme.name}
        title={`Try ${programme.name}`}
        body={`Book a trial class to experience ${programme.name} at Ankit's Studio.`}
        ctaLabel={trialLabel}
      />
    </main>
  );
}
