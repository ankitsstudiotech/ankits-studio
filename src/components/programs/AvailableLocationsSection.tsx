import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { FieldDisclaimer, PendingValue } from "./PendingValue";
import type { LocationTeaserProps } from "./types";

export type AvailableLocationsSectionProps = {
  locations: LocationTeaserProps[];
  title?: string;
  description?: string;
  emptyLabel?: string;
};

export function AvailableLocationsSection({
  locations,
  title = "Where you can train this",
  description = "Branches that list this programme. Availability can still be illustrative until verified.",
  emptyLabel = "Locations for this programme are to be confirmed.",
}: AvailableLocationsSectionProps) {
  return (
    <Section id="available-locations" eyebrow="Locations" title={title} description={description}>
      {locations.length === 0 ? (
        <Body>{emptyLabel}</Body>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {locations.map((location) => (
            <li key={location.slug}>
              <Card href={location.href} interactive className="h-full min-h-11">
                <Heading as="h3" className="mb-2 break-words">
                  {location.name}
                </Heading>
                <PendingValue
                  value={location.address}
                  as="p"
                  className="text-[length:var(--text-body)] leading-[var(--text-body--line-height)]"
                />
                {location.disclaimer ? (
                  <FieldDisclaimer className="mt-3">{location.disclaimer}</FieldDisclaimer>
                ) : null}
                <p className="mt-4 text-sm font-medium text-accent">
                  View location
                  <span aria-hidden> →</span>
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
