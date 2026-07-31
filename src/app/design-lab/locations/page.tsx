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
} from "@/components/locations";
import { MapPlaceholder } from "@/components/maps";
import { BranchTimetable } from "@/components/timetable";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Caption, Heading, Body } from "@/components/ui/Typography";
import { TextLink } from "@/components/ui/TextLink";
import {
  branchTimetableFixture,
  branchTrainersFixture,
  contactActionsFixture,
  locationFaqFixture,
  locationHeroFixture,
  openingHoursFixture,
  programmesGridFixture,
  thaneHeroFixture,
} from "./fixtures";

export default function DesignLabLocationsPage() {
  return (
    <main>
      <div className="border-b border-accent/25 bg-accent-soft">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Caption tone="ink" className="font-medium">
            Design lab · Location presentation components (fixtures only, noindex)
          </Caption>
          <TextLink href="/design-lab" variant="subtle">
            ← Design lab home
          </TextLink>
        </Container>
      </div>

      <LocationHero {...locationHeroFixture} />

      <ContactActionGroup
        actions={contactActionsFixture}
        disclaimer="All actions disabled — branch contact is not verified (ADR-011)."
      />

      <AddressDirections
        address={locationHeroFixture.address}
        directions="Illustrative directions: approach from the main sector road; look for the studio entrance signage once confirmed."
        disclaimer="Directions copy is illustrative until verified."
      />

      <MapPlaceholder
        branchName={locationHeroFixture.name}
        addressConfirmed={false}
        disclaimer="No iframe embed — maps stay off until verified."
      />

      <OpeningHours
        rows={openingHoursFixture}
        disclaimer="Hours are placeholder — Sunday row shows pending handling."
      />

      <AvailableProgrammesGrid programmes={programmesGridFixture} />

      <TrainerSection trainers={branchTrainersFixture} />

      <BranchTimetable
        branchName={locationHeroFixture.name}
        slots={branchTimetableFixture}
      />

      <ParkingTransportSection
        parking="To be confirmed"
        nearbyTransport={[]}
        disclaimer="Access notes pending owner confirmation."
      />

      <BranchGallery photos={[]} />

      <LocationFaq items={locationFaqFixture} />

      <LocationTrialCta branchName={locationHeroFixture.name} />

      <Section
        id="thane-tbc"
        eyebrow="Edge case"
        title="Reference-only branch hero"
        description="Demonstrates “To be confirmed” address handling for unlisted branches."
        className="border-t border-border bg-surface-sunken/60"
      >
        <ScrollReveal>
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-raised p-4 sm:p-6">
            <Heading as="h3" className="mb-4">
              Thane fixture
            </Heading>
            <Body className="mb-6">
              Used only in the design lab to verify TBC presentation — not for public nav.
            </Body>
            <LocationHero {...thaneHeroFixture} />
          </div>
        </ScrollReveal>
      </Section>
    </main>
  );
}
