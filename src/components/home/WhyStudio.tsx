import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { MockDisclaimer } from "./MockDisclaimer";

export type WhyPoint = {
  id: string;
  title: string;
  body: string;
};

export type WhyStudioProps = {
  points: WhyPoint[];
  disclaimer: string;
};

export function WhyStudio({ points, disclaimer }: WhyStudioProps) {
  return (
    <Section
      id="why"
      eyebrow="Why Ankit's Studio"
      title="Built for the whole community"
      description="A premium space that holds strength credibility and dance energy without looking like a generic gym template."
      className="bg-surface-raised/50"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {points.map((point, index) => (
          <ScrollReveal key={point.id} delay={index * 0.05}>
            <Card className="h-full">
              <Heading as="h3" className="mb-3">
                {point.title}
              </Heading>
              <Body>{point.body}</Body>
            </Card>
          </ScrollReveal>
        ))}
      </div>
      <MockDisclaimer className="mt-6">{disclaimer}</MockDisclaimer>
    </Section>
  );
}
