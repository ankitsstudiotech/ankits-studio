import {
  AvailableLocationsSection,
  BatchPreview,
  BenefitsSection,
  ClassExpectationSection,
  EquipmentSection,
  ExperienceLevelSection,
  ProgrammeFaq,
  ProgrammeHero,
  ProgrammeTrialCta,
  TrainerCards,
} from "@/components/programs";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Container } from "@/components/ui/Container";
import { Caption } from "@/components/ui/Typography";
import { TextLink } from "@/components/ui/TextLink";
import {
  batchesFixture,
  benefitsFixture,
  classExpectationFixture,
  equipmentFixture,
  locationsFixture,
  programmeFaqFixture,
  programmeHeroFixture,
  trainersFixture,
} from "./fixtures";

export default function DesignLabProgramsPage() {
  return (
    <main>
      <div className="border-b border-accent/25 bg-accent-soft">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <Caption tone="ink" className="font-medium">
            Design lab · Programme presentation components (fixtures only, noindex)
          </Caption>
          <TextLink href="/design-lab" variant="subtle">
            ← Design lab home
          </TextLink>
        </Container>
      </div>

      <ProgrammeHero {...programmeHeroFixture} />

      <ScrollReveal>
        <BenefitsSection benefits={benefitsFixture} />
      </ScrollReveal>

      <ClassExpectationSection {...classExpectationFixture} />

      <ExperienceLevelSection
        level="all-levels"
        detail="Illustrative guidance: sessions welcome first-timers with scaled options and intermediate lifters progressing main lifts."
      />

      <EquipmentSection items={equipmentFixture} />

      <AvailableLocationsSection locations={locationsFixture} />

      <TrainerCards trainers={trainersFixture} />

      <BatchPreview slots={batchesFixture} />

      <ProgrammeFaq items={programmeFaqFixture} />

      <ProgrammeTrialCta programmeName={programmeHeroFixture.name} />
    </main>
  );
}
