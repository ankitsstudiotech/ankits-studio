import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ProgrammeCard, TimetablePreview, type ProgrammeAccent } from "@/components/home";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading, HeroHeading } from "@/components/ui/Typography";
import {
  getBranchContactLinks,
  getBranches,
  getFaqs,
  getProgrammeBySlug,
  getTimetableSlots,
  getTrainers,
} from "@/content";
import type { Programme } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildLocalBusinessJsonLd } from "@/lib/seo/structured-data";
import { getBranchOrNotFound } from "../_lib/lookup";

type LocationPageParams = { params: Promise<{ slug: string }> };

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
    title: branch.name,
    description: `${branch.name} — programmes, timings, and contact details.`,
    path: `/locations/${branch.slug}`,
  });
}

function disclaimerFor(record: { dataStatus: string; mockDisclaimer?: string }): string | undefined {
  return record.dataStatus === "verified" ? undefined : record.mockDisclaimer;
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

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Locations", path: "/locations" },
    { name: branch.name, path: `/locations/${branch.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const localBusinessJsonLd = buildLocalBusinessJsonLd(branch);
  const faqJsonLd = buildFaqPageJsonLd(faqs);

  const branchDisclaimer = disclaimerFor(branch);

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
            <li aria-current="page" className="text-ink">
              {branch.name}
            </li>
          </ol>
        </nav>
      </Container>

      {/* Hero / Address */}
      <Container className="pt-6">
        <HeroHeading as="h1" className="mb-4">
          {branch.name}
        </HeroHeading>
        <Body size="lg" className="max-w-2xl">
          {branch.address}
        </Body>
        {branchDisclaimer ? <Caption className="mt-2 text-ink-subtle">{branchDisclaimer}</Caption> : null}
      </Container>

      {/* Map */}
      <Section eyebrow="Find us" title="Map">
        {contactLinks.mapEmbedUrl ? (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
            <iframe
              title={`Map for ${branch.name}`}
              src={contactLinks.mapEmbedUrl}
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
        ) : (
          <Card>
            <Body>Map not yet available — the branch address is pending confirmation.</Body>
          </Card>
        )}
      </Section>

      {/* Directions + Parking + Nearby transport */}
      <Section eyebrow="Getting here" title="Directions, parking, and transport" narrow className="pt-0">
        <dl className="flex flex-col gap-4">
          <div>
            <dt className="font-semibold text-ink">Directions</dt>
            <dd>
              <Body>{branch.directions ?? "Directions not yet available."}</Body>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Parking</dt>
            <dd>
              <Body>{branch.parking ?? "Parking details not yet available."}</Body>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Nearby transport</dt>
            <dd>
              {branch.nearbyTransport && branch.nearbyTransport.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {branch.nearbyTransport.map((item) => (
                    <li key={item}>
                      <Body>{item}</Body>
                    </li>
                  ))}
                </ul>
              ) : (
                <Body>Nearby transport details not yet available.</Body>
              )}
            </dd>
          </div>
        </dl>
      </Section>

      {/* Opening hours */}
      <Section eyebrow="Hours" title="Opening hours" narrow className="pt-0">
        {branch.openingHours.length > 0 ? (
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Opening hours for {branch.name}</caption>
            <tbody>
              {branch.openingHours.map((entry) => (
                <tr key={entry.dayOfWeek} className="border-b border-border last:border-b-0">
                  <th scope="row" className="py-2 pr-4 font-medium text-ink">
                    {DAY_LABELS[entry.dayOfWeek] ?? "—"}
                  </th>
                  <td className="py-2 text-ink-muted">
                    {entry.opensAt}–{entry.closesAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Body>Opening hours to be confirmed.</Body>
        )}
      </Section>

      {/* Branch photos */}
      <Section eyebrow="Gallery" title="Branch photos">
        {branch.photos && branch.photos.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branch.photos.map((photo) => (
              <li key={photo.src} className="overflow-hidden rounded-[var(--radius-lg)] bg-surface-sunken">
                <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="h-auto w-full object-cover" />
              </li>
            ))}
          </ul>
        ) : (
          <Body>Branch photos are not available yet.</Body>
        )}
      </Section>

      {/* Programmes */}
      <Section eyebrow="Train here" title="Programmes at this branch">
        {programmes.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme) => (
              <li key={programme.slug}>
                <ProgrammeCard
                  name={programme.name}
                  href={`/programs/${programme.slug}`}
                  shortDescription={programme.shortDescription}
                  accent={programme.heroAccent as ProgrammeAccent}
                  tags={programme.audienceTags}
                />
              </li>
            ))}
          </ul>
        ) : (
          <Body>No programmes currently listed for this branch.</Body>
        )}
      </Section>

      {/* Trainers */}
      <Section eyebrow="Coaches" title="Trainers at this branch">
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
          <Body>Trainer roster for this branch is coming soon.</Body>
        )}
      </Section>

      {/* Timetable */}
      <Section eyebrow="Schedule" title="Timetable" description="Illustrative schedule — not a confirmed timetable.">
        {timetableSlots.length > 0 ? (
          <TimetablePreview
            title={`${branch.name} timetable`}
            description="Illustrative schedule preview — not a confirmed timetable."
            slots={timetableSlots.map((slot) => ({
              id: slot.id,
              dayLabel: DAY_LABELS[slot.dayOfWeek]?.slice(0, 3) ?? "—",
              timeLabel: `${slot.startTime}–${slot.endTime}`,
              programmeLabel: getProgrammeBySlug(slot.programmeSlug)?.name ?? slot.programmeSlug,
              branchLabel: branch.name,
              mockDisclaimer: disclaimerFor(slot) ?? "",
            }))}
          />
        ) : (
          <Body>No scheduled sessions listed yet for this branch.</Body>
        )}
      </Section>

      {/* Contact actions */}
      <Section eyebrow="Get in touch" title="Contact this branch" narrow>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {contactLinks.phoneHref ? (
            <Link
              href={contactLinks.phoneHref}
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-accent px-5 text-sm font-medium text-accent-foreground hover:bg-accent-hover"
            >
              Call {branch.name}
            </Link>
          ) : (
            <Body>Phone contact will be available once this branch&apos;s details are confirmed.</Body>
          )}
          {contactLinks.whatsappHref ? (
            <Link
              href={contactLinks.whatsappHref}
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-border px-5 text-sm font-medium text-ink hover:border-border-strong"
            >
              WhatsApp {branch.name}
            </Link>
          ) : null}
          <Link
            href="/trial"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-border px-5 text-sm font-medium text-ink hover:border-border-strong"
          >
            Book a trial
          </Link>
        </div>
      </Section>

      {/* FAQs */}
      <Section eyebrow="FAQ" title={`${branch.name} FAQs`} narrow className="bg-surface-sunken/50">
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
    </main>
  );
}
