import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Section } from "@/components/ui/Section";
import { Body, Heading } from "@/components/ui/Typography";
import { MockDisclaimer } from "./MockDisclaimer";

export type FounderStoryPlaceholderProps = {
  title: string;
  body: string;
  disclaimer: string;
  mediaSrc: string;
};

export function FounderStoryPlaceholder({
  title,
  body,
  disclaimer,
  mediaSrc,
}: FounderStoryPlaceholderProps) {
  return (
    <Section
      id="founder"
      eyebrow="Founder"
      title="The story behind the studio"
      description="Owner-confirmed founder narrative is not available yet — this block is a replaceable placeholder."
    >
      <ScrollReveal>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <MediaFrame
            src={mediaSrc}
            alt="Placeholder frame for future founder photography"
            width={1200}
            height={900}
            sizes="(max-width: 1024px) 100vw, 40vw"
            placeholderLabel="Replace later"
          />
          <div>
            <Badge accent="accent" className="mb-4">
              Placeholder
            </Badge>
            <Heading as="h3" className="mb-4">
              {title}
            </Heading>
            <Body size="lg">{body}</Body>
            <MockDisclaimer className="mt-4">{disclaimer}</MockDisclaimer>
          </div>
        </div>
      </ScrollReveal>
    </Section>
  );
}
