import { Badge, type BadgeAccent } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Body, Heading } from "@/components/ui/Typography";

export type ProgrammeAccent = "strength" | "calm" | "high-energy";

export type ProgrammeCardProps = {
  name: string;
  href: string;
  shortDescription: string;
  accent: ProgrammeAccent;
  tags?: string[];
  mockDisclaimer?: string;
};

const accentToBadge: Record<ProgrammeAccent, BadgeAccent> = {
  strength: "strength",
  calm: "calm",
  "high-energy": "high-energy",
};

const accentRail: Record<ProgrammeAccent, string> = {
  strength: "border-l-accent-strength",
  calm: "border-l-accent-calm",
  "high-energy": "border-l-accent-high-energy",
};

export function ProgrammeCard({
  name,
  href,
  shortDescription,
  accent,
  tags = [],
  mockDisclaimer,
}: ProgrammeCardProps) {
  return (
    <Card
      href={href}
      interactive
      className={["relative border-l-4", accentRail[accent], "h-full min-h-11"].join(" ")}
    >
      <Badge accent={accentToBadge[accent]} className="mb-4 w-fit">
        {accent.replace("-", " ")}
      </Badge>
      <Heading as="h3" className="mb-2">
        {name}
      </Heading>
      <Body className="mb-4">{shortDescription}</Body>
      {tags.length > 0 ? (
        <ul className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-[var(--radius-sm)] bg-surface-sunken px-2 py-1 text-[length:var(--text-caption)] text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {mockDisclaimer ? (
        <p className="text-[length:var(--text-caption)] text-ink-subtle">{mockDisclaimer}</p>
      ) : null}
    </Card>
  );
}
