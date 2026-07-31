import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Body, Caption, Heading } from "@/components/ui/Typography";
import { MockDisclaimer } from "./MockDisclaimer";

export type TransformationStoryItem = {
  slug: string;
  summary: string;
  programmeLabel: string;
  mockDisclaimer: string;
};

export type TransformationStoriesProps = {
  items: TransformationStoryItem[];
};

export function TransformationStories({ items }: TransformationStoriesProps) {
  return (
    <Section
      id="transformations"
      eyebrow="Transformations"
      title="The kind of progress we coach toward"
      description="Illustrative programme outcomes only — no fabricated before/after photography, percentages, or member identities."
      className="bg-surface-sunken/60"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <ScrollReveal key={item.slug} delay={index * 0.05}>
            <Card className="h-full">
              <Badge accent="neutral" className="mb-4">
                Illustrative
              </Badge>
              <Caption className="mb-2">{item.programmeLabel}</Caption>
              <Heading as="h3" className="mb-3">
                Example journey
              </Heading>
              <Body className="mb-4">{item.summary}</Body>
              <MockDisclaimer>{item.mockDisclaimer}</MockDisclaimer>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
