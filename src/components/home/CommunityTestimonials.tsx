import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { TestimonialCard, type TestimonialCardProps } from "./TestimonialCard";

export type CommunityTestimonialsProps = {
  testimonials: TestimonialCardProps[];
};

export function CommunityTestimonials({ testimonials }: CommunityTestimonialsProps) {
  return (
    <Section
      id="community"
      eyebrow="Community"
      title="Voices from the floor"
      description="Illustrative quotes only — never attributed to a real, identifiable person until verified with consent."
      className="bg-surface-raised/60"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((item, index) => (
          <ScrollReveal key={`${item.attributedName}-${index}`} delay={index * 0.05}>
            <TestimonialCard {...item} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
