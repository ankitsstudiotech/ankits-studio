/** True when a string is missing, blank, or the project’s TBC sentinel. */
export function isToBeConfirmed(value: string | null | undefined): boolean {
  if (value == null) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return trimmed.toLowerCase() === "to be confirmed";
}

export type MediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholderLabel?: string;
};

export type OpeningHoursRow = {
  dayLabel: string;
  opensAt: string;
  closesAt: string;
  closed?: boolean;
  pending?: boolean;
};

export type ContactAction = {
  id: string;
  label: string;
  /** When null, action renders disabled with TBC messaging (ADR-011). */
  href: string | null;
  kind: "phone" | "whatsapp" | "directions" | "email" | "other";
};

export type ProgrammeGridItem = {
  slug: string;
  name: string;
  href: string;
  shortDescription: string;
  accent: "strength" | "calm" | "high-energy";
};

export type FaqItemProps = {
  id: string;
  question: string;
  answer: string;
  disclaimer?: string;
};

export type TrainerItemProps = {
  slug: string;
  name: string;
  bio: string;
  specialtyLabels: string[];
  photo?: MediaProps | null;
  href?: string;
  disclaimer?: string;
};
