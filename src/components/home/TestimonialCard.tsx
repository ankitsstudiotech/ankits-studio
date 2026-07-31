import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Body, Caption, Heading } from "@/components/ui/Typography";

export type TestimonialCardProps = {
  quote: string;
  attributedName: string;
  programmeLabel?: string;
  branchLabel?: string;
  mockDisclaimer: string;
};

export function TestimonialCard({
  quote,
  attributedName,
  programmeLabel,
  branchLabel,
  mockDisclaimer,
}: TestimonialCardProps) {
  return (
    <Card className="h-full bg-surface">
      <Badge accent="accent" className="mb-4">
        Illustrative
      </Badge>
      <blockquote>
        <Body size="lg" tone="ink" className="mb-6 font-medium" as="p">
          “{quote}”
        </Body>
        <footer>
          <Heading as="cite" className="not-italic">
            {attributedName}
          </Heading>
          {(programmeLabel || branchLabel) && (
            <Caption className="mt-1">
              {[programmeLabel, branchLabel].filter(Boolean).join(" · ")}
            </Caption>
          )}
          <Caption className="mt-3 text-ink-subtle">{mockDisclaimer}</Caption>
        </footer>
      </blockquote>
    </Card>
  );
}
