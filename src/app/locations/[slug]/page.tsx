import Link from "next/link";
import type { Metadata } from "next";
import {
  AddressDirections,
  AvailableProgrammesGrid,
  BranchGallery,
  ContactActionGroup,
  LocationFaq,
  LocationHero,
  LocationTrialCta,
  OpeningHours,
  ParkingTransportSection,
  TrainerSection,
  type ContactAction,
} from "@/components/locations";
import { MapPlaceholder } from "@/components/maps";
import { BranchTimetable } from "@/components/timetable";
import { Container } from "@/components/ui/Container";
import {
  getBranchContactLinks,
  getBranches,
  getFaqs,
  getProgrammeBySlug,
  getTimetableSlots,
  getTrainers,
} from "@/content";
import type { Programme, Trainer } from "@/content";
import {
  buildWhatsAppTrialUrl,
  getPrimaryConversionHref,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildLocalBusinessJsonLd } from "@/lib/seo/structured-data";
import { getBranchOrNotFound } from "../_lib/lookup";

type LocationPageParams = { params: Promise<{ slug: string }> };

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** All branches, including Thane — the route still exists for
 *  prototyping (docs/DECISIONS.md ADR-007 finding I2); only the index
 *  page/nav/sitemap exclude non-public branches. */
export function generateStaticParams() {
  return getBranches().map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: LocationPageParams): Promise<Metadata> {
  const { slug } = await params;
  const branch = getBranchOrNotFound(slug);
  return buildPageMetadata({
    title: branch.seoTitle ?? branch.name,
    description: branch.seoDescription,
    path: `/locations/${branch.slug}`,
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

export default async function LocationDetailPage({ params }: LocationPageParams) {
  const { slug } = await params;
  const branch = getBranchOrNotFound(slug);

  const contactLinks = getBranchContactLinks(branch);
  const programmes: Programme[] = branch.programmeSlugs
    .map((programmeSlug) => getProgrammeBySlug(programmeSlug))
    .filter((programme): programme is Programme => programme !== undefined);
  const trainers = getTrainers().filter((trainer) => trainer.branchSlugs.includes(branch.slug));
  const timetableSlots = getTimetableSlots({ branchSlug: branch.slug });
  const branchFaqs = getFaqs({ branchSlug: branch.slug });
  const faqs = branchFaqs.length > 0 ? branchFaqs : getFaqs().slice(0, 3);
  const branchShortName = branch.name.replace(/^Ankit's Studio —\s*/i, "");
  const whatsappHref =
    buildWhatsAppTrialUrl({ preferredBranch: branchShortName }) ?? getPrimaryConversionHref();

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: branch.name, path: `/locations/${branch.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const localBusinessJsonLd = buildLocalBusinessJsonLd(branch);
  const faqJsonLd = buildFaqPageJsonLd(faqs);

  const branchDisclaimer = disclaimerFor(branch);
  const trialLabel = `Book a trial at ${branch.name}`;

  const contactActions: ContactAction[] = [
    {
      id: "phone",
      label: `Call ${branch.name}`,
      href: contactLinks.phoneHref,
      kind: "phone",
    },
    {
      id: "whatsapp",
      label: `WhatsApp ${branch.name}`,
      href: contactLinks.whatsappHref,
      kind: "whatsapp",
    },
    {
      id: "directions",
      label: `Get directions to ${branch.name}`,
      // No separate directions URL in contact links — never invent Maps
      // hrefs from unverified data (ADR-011). Embed stays on MapPlaceholder.
      href: null,
      kind: "directions",
    },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {localBusinessJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(localBusinessJsonLd) }}
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
              <Link href="/locations" className="hover:text-ink">
                Locations
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink break-words">
              {branch.name}
            </li>
          </ol>
        </nav>
      </Container>

      <LocationHero
        name={branch.name}
        areaLabel={branch.locality}
        address={branch.address ?? "Detailed address is being updated."}
        primaryCta={{ label: trialLabel, href: whatsappHref }}
        disclaimer={branchDisclaimer}
      />

      <ContactActionGroup
        actions={contactActions}
        disclaimer={
          contactLinks.phoneHref || contactLinks.whatsappHref || contactLinks.mapEmbedUrl
            ? undefined
            : "Contact and map actions stay disabled until this branch is verified (ADR-011)."
        }
      />

      <AddressDirections
        address={branch.address ?? "Detailed address is being updated."}
        directions={branch.directions}
        disclaimer={branchDisclaimer}
      />

      <MapPlaceholder
        branchName={branch.name}
        addressConfirmed={Boolean(contactLinks.mapEmbedUrl)}
        note={
          contactLinks.mapEmbedUrl
            ? undefined
            : "Map unavailable until this branch address is verified."
        }
        disclaimer={
          contactLinks.mapEmbedUrl
            ? undefined
            : "No map embed until the branch address is verified (ADR-011)."
        }
      />

      <OpeningHours
        title="Studio operating window"
        rows={branch.openingHours.map((entry) => ({
          dayLabel: DAY_LABELS[entry.dayOfWeek] ?? "—",
          opensAt: entry.opensAt,
          closesAt: entry.closesAt,
        }))}
        disclaimer={branchDisclaimer}
      />

      <AvailableProgrammesGrid
        programmes={programmes.map((programme) => ({
          slug: programme.slug,
          name: programme.name,
          href: `/programs/${programme.slug}`,
          shortDescription: programme.shortDescription,
          accent: programme.heroAccent,
        }))}
      />

      <TrainerSection
        trainers={trainers.map((trainer) => ({
          slug: trainer.slug,
          name: trainer.name,
          bio: trainer.bio,
          specialtyLabels: specialtyLabels(trainer),
          photo: trainer.photo,
          disclaimer: disclaimerFor(trainer),
        }))}
      />

      <BranchTimetable
        branchName={branch.name}
        slots={timetableSlots.map((slot) => ({
          id: slot.id,
          dayLabel: DAY_SHORT[slot.dayOfWeek] ?? "—",
          timeLabel: `${slot.startTime}–${slot.endTime}`,
          programmeLabel: getProgrammeBySlug(slot.programmeSlug)?.name ?? slot.programmeSlug,
          disclaimer: disclaimerFor(slot),
        }))}
        whatsappHref={whatsappHref}
      />

      <ParkingTransportSection
        parking={branch.parking}
        nearbyTransport={branch.nearbyTransport}
        disclaimer={branchDisclaimer}
      />

      <BranchGallery
        photos={(branch.photos ?? []).map((photo) => ({
          src: photo.src,
          alt: photo.alt,
          width: photo.width,
          height: photo.height,
        }))}
        disclaimer={branchDisclaimer}
      />

      <LocationFaq
        title={`${branch.name} FAQs`}
        items={faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          disclaimer: disclaimerFor(faq),
        }))}
      />

      <LocationTrialCta
        branchName={branch.name}
        title={`Visit ${branch.name}`}
        body={`Try a class at ${branch.name}. Contact actions stay disabled until this branch is verified.`}
        ctaLabel={trialLabel}
      />
    </main>
  );
}
