import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { LocationTeaserCard, type LocationTeaserCardProps } from "./LocationTeaserCard";

export type BranchExplorerProps = {
  locations: LocationTeaserCardProps[];
};

export function BranchExplorer({ locations }: BranchExplorerProps) {
  return (
    <Section
      id="locations"
      eyebrow="Locations"
      title="Train near you"
      description="Publicly listed branches only. Contact links stay disabled until each branch is verified."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((location, index) => (
          <ScrollReveal key={location.name} delay={index * 0.05}>
            <LocationTeaserCard {...location} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
