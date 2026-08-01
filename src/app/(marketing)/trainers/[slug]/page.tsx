import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Section } from "@/components/ui/Section";
import { Body, Caption, HeroHeading } from "@/components/ui/Typography";
import { getProgrammeBySlug, getPubliclyListedBranches, getTrainerBySlug, getTrainers } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

type TrainerPageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getTrainers().map((trainer) => ({ slug: trainer.slug }));
}

export async function generateMetadata({ params }: TrainerPageParams): Promise<Metadata> {
  const { slug } = await params;
  const trainer = getTrainerBySlug(slug);
  if (!trainer) {
    return buildPageMetadata({
      title: "Trainer not found",
      description: "This trainer profile could not be found.",
      path: `/trainers/${slug}`,
      forceNoIndex: true,
    });
  }
  return buildPageMetadata({
    title: trainer.name,
    description: trainer.bio.slice(0, 155),
    path: `/trainers/${trainer.slug}`,
  });
}

export default async function TrainerDetailPage({ params }: TrainerPageParams) {
  const { slug } = await params;
  const trainer = getTrainerBySlug(slug);
  if (!trainer) notFound();

  const specialties = trainer.specialties
    .map((programmeSlug) => getProgrammeBySlug(programmeSlug)?.name)
    .filter((name): name is string => Boolean(name));
  const branches = getPubliclyListedBranches().filter((branch) =>
    trainer.branchSlugs.includes(branch.slug)
  );
  const disclaimer =
    trainer.dataStatus === "verified" ? undefined : trainer.mockDisclaimer;

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Trainers", path: "/trainers" },
    { name: trainer.name, path: `/trainers/${trainer.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section eyebrow="Trainer" title={trainer.name}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] lg:items-start">
          <MediaFrame
            src={trainer.photo.src}
            alt={trainer.photo.alt}
            width={trainer.photo.width}
            height={trainer.photo.height}
            sizes="(max-width: 1024px) 100vw, 288px"
            placeholderLabel="Placeholder"
          />
          <div className="min-w-0">
            <HeroHeading as="h1" className="mb-4 break-words">
              {trainer.name}
            </HeroHeading>
            <Body size="lg" className="mb-4">
              {trainer.bio}
            </Body>
            {specialties.length > 0 ? (
              <ul className="mb-4 flex flex-wrap gap-2">
                {specialties.map((label) => (
                  <li key={label}>
                    <Badge accent="neutral">{label}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mb-4">
              <Caption className="mb-1 font-semibold uppercase tracking-wide text-ink-muted">
                Qualifications
              </Caption>
              {trainer.qualifications.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {trainer.qualifications.map((item) => (
                    <li key={item}>
                      <Body>{item}</Body>
                    </li>
                  ))}
                </ul>
              ) : (
                <Body className="italic">Qualifications to be confirmed.</Body>
              )}
            </div>
            <div className="mb-4">
              <Caption className="mb-1 font-semibold uppercase tracking-wide text-ink-muted">
                Branches
              </Caption>
              {branches.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {branches.map((branch) => (
                    <li key={branch.slug}>
                      <Badge accent="accent">{branch.name}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <Body className="italic">Branch assignments to be confirmed.</Body>
              )}
            </div>
            {disclaimer ? <Caption className="text-ink-subtle">{disclaimer}</Caption> : null}
          </div>
        </div>
      </Section>
    </main>
  );
}
