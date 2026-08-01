import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { getProgrammeBySlug, getTrainers } from "@/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { serializeJsonLd } from "@/lib/seo/serialize";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const PATH = "/trainers";

export const metadata: Metadata = buildPageMetadata({
  title: "Trainers",
  description:
    "Illustrative coaching roster for Ankit's Studio — profiles stay labelled until identities and qualifications are verified.",
  path: PATH,
});

const breadcrumbTrail = [
  { name: "Home", path: "/" },
  { name: "Trainers", path: PATH },
];

function disclaimerFor(record: { dataStatus: string; mockDisclaimer?: string }) {
  return record.dataStatus === "verified" ? undefined : record.mockDisclaimer;
}

export default function TrainersIndexPage() {
  const trainers = getTrainers();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbTrail);

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />

      <PageBreadcrumb items={breadcrumbTrail} />

      <Section
        eyebrow="Trainers"
        title="Coaching roster"
        description="Illustrative profiles only. Names, bios, and qualifications are not invented as real staff identities."
      >
        {trainers.length === 0 ? (
          <Body>Trainer roster is to be confirmed.</Body>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((trainer) => {
              const specialties = trainer.specialties
                .map((slug) => getProgrammeBySlug(slug)?.name)
                .filter((name): name is string => Boolean(name));
              const disclaimer = disclaimerFor(trainer);

              return (
                <li key={trainer.slug}>
                  <Card href={`/trainers/${trainer.slug}`} interactive className="h-full">
                    <MediaFrame
                      src={trainer.photo.src}
                      alt={trainer.photo.alt}
                      width={trainer.photo.width}
                      height={trainer.photo.height}
                      sizes="(max-width: 640px) 100vw, 30vw"
                      placeholderLabel="Placeholder"
                      className="mb-4"
                    />
                    <Heading as="h2" className="mb-2 break-words">
                      {trainer.name}
                    </Heading>
                    <Body className="mb-3 line-clamp-3">{trainer.bio}</Body>
                    {specialties.length > 0 ? (
                      <ul className="mb-3 flex flex-wrap gap-2">
                        {specialties.map((label) => (
                          <li key={label}>
                            <Badge accent="neutral">{label}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {trainer.qualifications.length > 0 ? (
                      <Caption className="mb-2 break-words">
                        {trainer.qualifications.join(" · ")}
                      </Caption>
                    ) : (
                      <Caption className="mb-2 italic">Qualifications to be confirmed</Caption>
                    )}
                    {disclaimer ? <Caption className="text-ink-subtle">{disclaimer}</Caption> : null}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
        <Body className="mt-8">
          Looking for a programme instead? <Link href="/programs" className="text-accent underline-offset-4 hover:underline">Browse programmes</Link>.
        </Body>
      </Section>
    </main>
  );
}
