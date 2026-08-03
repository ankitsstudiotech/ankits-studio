import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import {
  getPublishableTrainerBySlug,
  getPublishableTrainers,
  shouldIndexTrainersRoute,
} from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";

type TrainerPageParams = { params: Promise<{ slug: string }> };

/**
 * Public trainer detail routes exist only for publishable profiles (ADR-019).
 * With an empty publishable roster, generateStaticParams is empty and all
 * unknown slugs 404.
 */
export function generateStaticParams() {
  return getPublishableTrainers().map((trainer) => ({ slug: trainer.slug }));
}

export async function generateMetadata({ params }: TrainerPageParams): Promise<Metadata> {
  const { slug } = await params;
  const trainer = getPublishableTrainerBySlug(slug);
  if (!trainer) {
    return buildPageMetadata({
      title: "Trainer not found",
      description: "This trainer profile is not available.",
      path: `/trainers/${slug}`,
      forceNoIndex: true,
    });
  }

  return buildPageMetadata({
    title: trainer.seoTitle ?? trainer.name,
    description:
      trainer.seoDescription ??
      (trainer.bio ? trainer.bio.slice(0, 155) : `${trainer.name} at Ankit’s Studio`),
    path: `/trainers/${trainer.slug}`,
    forceNoIndex: !shouldIndexTrainersRoute(),
  });
}

export default async function TrainerDetailPage({ params }: TrainerPageParams) {
  const { slug } = await params;
  const trainer = getPublishableTrainerBySlug(slug);
  if (!trainer) notFound();

  const breadcrumbTrail = [
    { name: "Home", path: "/" },
    { name: "Trainers", path: "/trainers" },
    { name: trainer.name, path: `/trainers/${trainer.slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);
  const pageJsonLd = buildWebPageJsonLd({
    name: trainer.seoTitle ?? trainer.name,
    description:
      trainer.seoDescription ??
      (trainer.bio ? trainer.bio.slice(0, 155) : `${trainer.name} at Ankit’s Studio`),
    path: `/trainers/${trainer.slug}`,
  });

  const photo = trainer.photo!;

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <article className="px-[var(--spacing-gutter)] py-[var(--spacing-section)] max-w-3xl">
        <p className="text-sm uppercase tracking-wider text-ink-muted mb-2">Trainer</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide mb-4 break-words">
          {trainer.name}
        </h1>
        {trainer.role ? <p className="text-lg text-ink-muted mb-4">{trainer.role}</p> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="mb-6 w-full max-w-sm aspect-[4/5] object-cover"
          loading="lazy"
        />
        {trainer.bio ? <p className="text-base leading-relaxed mb-6 max-w-prose">{trainer.bio}</p> : null}
        {trainer.qualifications.length > 0 ? (
          <section className="mb-6" aria-labelledby="trainer-quals">
            <h2 id="trainer-quals" className="text-sm uppercase tracking-wider mb-2">
              Qualifications
            </h2>
            <ul className="flex flex-col gap-1">
              {trainer.qualifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {trainer.certifications.length > 0 ? (
          <section className="mb-6" aria-labelledby="trainer-certs">
            <h2 id="trainer-certs" className="text-sm uppercase tracking-wider mb-2">
              Certifications
            </h2>
            <ul className="flex flex-col gap-1">
              {trainer.certifications.map((cert) => (
                <li key={`${cert.name}-${cert.issuer ?? ""}`}>
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
