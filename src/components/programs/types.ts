/** True when a string is missing, blank, or the project’s TBC sentinel. */
export function isToBeConfirmed(value: string | null | undefined): boolean {
  if (value == null) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  return trimmed.toLowerCase() === "to be confirmed";
}

export type ProgrammeAccent = "strength" | "calm" | "high-energy";

export type MediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholderLabel?: string;
};

export type FaqItemProps = {
  id: string;
  question: string;
  answer: string;
  disclaimer?: string;
};

export type TrainerCardProps = {
  slug: string;
  name: string;
  bio: string;
  qualifications: string[];
  specialtyLabels: string[];
  photo?: MediaProps | null;
  href?: string;
  disclaimer?: string;
};

export type LocationTeaserProps = {
  slug: string;
  name: string;
  href: string;
  address?: string | null;
  disclaimer?: string;
};

export type BatchSlotProps = {
  id: string;
  dayLabel: string;
  timeLabel: string;
  locationLabel: string;
  disclaimer?: string;
};
