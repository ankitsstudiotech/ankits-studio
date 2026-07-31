import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { ProgrammeCard, type ProgrammeCardProps } from "./ProgrammeCard";

export type ProgrammeShowcaseProps = {
  programmes: ProgrammeCardProps[];
};

export function ProgrammeShowcase({ programmes }: ProgrammeShowcaseProps) {
  return (
    <Section
      id="programmes"
      eyebrow="Programmes"
      title="Train strength. Move with rhythm."
      description="One studio system for strength, personal training, yoga, Zumba, and dance — differentiated by accent, not by competing sub-brands."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {programmes.map((programme, index) => (
          <ScrollReveal key={programme.name} delay={Math.min(index * 0.04, 0.16)}>
            <ProgrammeCard {...programme} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
