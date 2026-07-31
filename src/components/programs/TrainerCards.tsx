import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { TrainerCardProps } from "./types";

export type TrainerCardsProps = {
  trainers: TrainerCardProps[];
  title?: string;
  description?: string;
  emptyLabel?: string;
};

export function TrainerCards({
  trainers,
  title = "Coaches for this programme",
  description = "Roster presentation only — names and bios stay labelled until verified.",
  emptyLabel = "Trainer roster for this programme is to be confirmed.",
}: TrainerCardsProps) {
  return (
    <Section
      id="trainers"
      eyebrow="Trainers"
      title={title}
      description={description}
      className="bg-surface-raised/40"
    >
      {trainers.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trainers.map((trainer) => (
            <li key={trainer.slug}>
              <Card className="flex h-full flex-col">
                {trainer.photo ? (
                  <MediaFrame
                    src={trainer.photo.src}
                    alt={trainer.photo.alt}
                    width={trainer.photo.width}
                    height={trainer.photo.height}
                    sizes="(max-width: 640px) 100vw, 30vw"
                    placeholderLabel={trainer.photo.placeholderLabel ?? "Placeholder"}
                    className="mb-4"
                  />
                ) : (
                  <div
                    className="mb-4 flex aspect-[4/3] items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-sm text-ink-muted"
                    role="img"
                    aria-label={`Photo placeholder for ${trainer.name}`}
                  >
                    Photo to be confirmed
                  </div>
                )}
                <Heading as="h3" className="mb-2 break-words">
                  {trainer.href ? (
                    <Link
                      href={trainer.href}
                      className="rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                    >
                      {trainer.name}
                    </Link>
                  ) : (
                    trainer.name
                  )}
                </Heading>
                <Body className="mb-3 line-clamp-4">{trainer.bio}</Body>
                {trainer.specialtyLabels.length > 0 ? (
                  <ul className="mb-3 flex flex-wrap gap-2">
                    {trainer.specialtyLabels.map((label) => (
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
                {trainer.disclaimer ? (
                  <FieldDisclaimer className="mt-auto pt-2">{trainer.disclaimer}</FieldDisclaimer>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
