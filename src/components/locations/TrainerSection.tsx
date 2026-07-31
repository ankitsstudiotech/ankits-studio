import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";
import type { TrainerItemProps } from "./types";

export type TrainerSectionProps = {
  trainers: TrainerItemProps[];
  title?: string;
  emptyLabel?: string;
};

export function TrainerSection({
  trainers,
  title = "Trainers at this branch",
  emptyLabel = "Trainer roster for this branch is to be confirmed.",
}: TrainerSectionProps) {
  return (
    <Section id="branch-trainers" eyebrow="Team" title={title}>
      {trainers.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {trainers.map((trainer) => (
            <li key={trainer.slug}>
              <Card className="grid h-full gap-4 sm:grid-cols-[8rem_1fr] sm:items-start">
                {trainer.photo ? (
                  <MediaFrame
                    src={trainer.photo.src}
                    alt={trainer.photo.alt}
                    width={trainer.photo.width}
                    height={trainer.photo.height}
                    sizes="128px"
                    placeholderLabel={trainer.photo.placeholderLabel ?? "Photo"}
                  />
                ) : (
                  <div
                    className="flex aspect-square items-center justify-center rounded-[var(--radius-md)] bg-surface-sunken text-center text-xs text-ink-muted"
                    role="img"
                    aria-label={`Photo placeholder for ${trainer.name}`}
                  >
                    Photo TBC
                  </div>
                )}
                <div className="min-w-0">
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
                  <Body className="mb-3 line-clamp-3">{trainer.bio}</Body>
                  {trainer.specialtyLabels.length > 0 ? (
                    <ul className="mb-2 flex flex-wrap gap-2">
                      {trainer.specialtyLabels.map((label) => (
                        <li key={label}>
                          <Badge accent="neutral">{label}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {trainer.disclaimer ? (
                    <FieldDisclaimer>{trainer.disclaimer}</FieldDisclaimer>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
