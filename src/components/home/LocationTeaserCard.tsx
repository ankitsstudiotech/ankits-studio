import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Body, Caption, Heading } from "@/components/ui/Typography";

export type LocationTeaserCardProps = {
  name: string;
  href: string;
  areaLabel: string;
  programmeCountLabel: string;
  mockDisclaimer: string;
  /** Never pass a live tel:/wa.me/map URL for mock branches. */
  addressPreview?: string;
};

export function LocationTeaserCard({
  name,
  href,
  areaLabel,
  programmeCountLabel,
  mockDisclaimer,
  addressPreview,
}: LocationTeaserCardProps) {
  return (
    <Card href={href} interactive className="relative h-full min-h-11">
      <Badge accent="neutral" className="mb-4 w-fit">
        {areaLabel}
      </Badge>
      <Heading as="h3" className="mb-2">
        {name}
      </Heading>
      {addressPreview ? <Body className="mb-3">{addressPreview}</Body> : null}
      <Caption className="mb-3">{programmeCountLabel}</Caption>
      <Caption className="text-ink-subtle">{mockDisclaimer}</Caption>
    </Card>
  );
}
