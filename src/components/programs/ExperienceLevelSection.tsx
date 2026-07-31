import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";
import { Body } from "@/components/ui/Typography";
import { FieldDisclaimer } from "./PendingValue";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "all-levels";

export type ExperienceLevelSectionProps = {
  level: ExperienceLevel;
  detail?: string;
  disclaimer?: string;
};

const levelLabel: Record<ExperienceLevel, string> = {
  beginner: "Beginner-friendly",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "all-levels": "All levels",
};

export function ExperienceLevelSection({
  level,
  detail,
  disclaimer,
}: ExperienceLevelSectionProps) {
  return (
    <Section
      id="experience-level"
      eyebrow="Level"
      title="Experience level"
      description="Guidance for who this programme is paced for — coaches still adapt in the room."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Badge accent="accent">{levelLabel[level]}</Badge>
        {detail ? <Body className="max-w-2xl">{detail}</Body> : null}
      </div>
      {disclaimer ? <FieldDisclaimer className="mt-4">{disclaimer}</FieldDisclaimer> : null}
    </Section>
  );
}
