import { Badge, type BadgeAccent } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import type { ProgrammeGridItem } from "./types";

export type AvailableProgrammesGridProps = {
  programmes: ProgrammeGridItem[];
  title?: string;
  description?: string;
  emptyLabel?: string;
};

const accentBadge: Record<ProgrammeGridItem["accent"], BadgeAccent> = {
  strength: "strength",
  calm: "calm",
  "high-energy": "high-energy",
};

export function AvailableProgrammesGrid({
  programmes,
  title = "Programmes at this branch",
  description = "Offered programmes for this location. Long names wrap without overflow.",
  emptyLabel = "Programmes for this branch are to be confirmed.",
}: AvailableProgrammesGridProps) {
  return (
    <Section
      id="programmes"
      eyebrow="Programmes"
      title={title}
      description={description}
      className="bg-surface-sunken/40"
    >
      {programmes.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {programmes.map((programme) => (
            <li key={programme.slug}>
              <Card href={programme.href} interactive className="h-full min-h-11">
                <Badge accent={accentBadge[programme.accent]} className="mb-3">
                  {programme.accent.replace("-", " ")}
                </Badge>
                <Heading as="h3" className="mb-2 break-words text-balance">
                  {programme.name}
                </Heading>
                <Body className="line-clamp-3">{programme.shortDescription}</Body>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
