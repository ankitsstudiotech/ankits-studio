import type {
  BatchSlotProps,
  FaqItemProps,
  LocationTeaserProps,
  ProgrammeHeroProps,
  TrainerCardProps,
} from "@/components/programs";

/**
 * Design-lab presentation fixtures only — not a content system.
 * Do not import src/content/mock.
 */

export const programmeHeroFixture: ProgrammeHeroProps = {
  name: "Strength Training & Progressive Overload Foundations",
  eyebrow: "Programme",
  shortDescription:
    "Barbell and free-weight coaching for building real strength across experience levels.",
  longDescription:
    "Illustrative long description: structured strength programming with technique focus. Replace with owner-approved copy when ready.",
  accent: "strength",
  audienceTags: ["adults", "beginner-friendly", "strength-focused"],
  media: {
    src: "/mock-media/programme-placeholder.svg",
    alt: "Abstract programme media placeholder",
    width: 1200,
    height: 900,
    placeholderLabel: "Mock media",
  },
  secondaryCta: { label: "See locations", href: "/design-lab/locations" },
  disclaimer:
    "Programme marketing copy in this lab is illustrative presentation only.",
};

export const benefitsFixture = [
  "Stronger technique under coaching eyes",
  "Progressive plans that scale with you",
  "A room that welcomes first-timers and lifters alike",
];

export const classExpectationFixture = {
  classStructure:
    "Illustrative structure: warm-up, coached main lifts, accessory work, cool-down. Exact flow varies by coach.",
  whoItsFor:
    "Adults who want strength with clear coaching — beginners welcome with scaled options.",
};

export const equipmentFixture = [
  "Comfortable training shoes",
  "Water bottle",
  "Optional lifting belt (if you already use one)",
];

export const locationsFixture: LocationTeaserProps[] = [
  {
    slug: "airoli",
    name: "Ankit's Studio — Airoli",
    href: "/design-lab/locations",
    address:
      "123 Placeholder Road, Sector 15, Airoli, Navi Mumbai (exact address not yet confirmed)",
    disclaimer: "Placeholder address — not confirmed for publication.",
  },
  {
    slug: "ghansoli",
    name: "Ankit's Studio — Ghansoli",
    href: "/design-lab/locations",
    address: "To be confirmed",
    disclaimer: "Address sentinel demonstrates TBC handling.",
  },
];

export const trainersFixture: TrainerCardProps[] = [
  {
    slug: "illustrative-coach-1",
    name: "Illustrative Coach One",
    bio: "Illustrative bio for a strength-focused coach. Not a real person.",
    qualifications: ["Illustrative certification"],
    specialtyLabels: ["Strength Training", "Personal Training"],
    photo: null,
    disclaimer: "Illustrative trainer — not a real roster entry.",
  },
  {
    slug: "illustrative-coach-2",
    name: "Illustrative Coach With A Longer Display Name For Wrapping",
    bio: "Illustrative bio covering multi-line wrapping and specialty chips.",
    qualifications: [],
    specialtyLabels: ["Yoga"],
    photo: {
      src: "/mock-media/programme-placeholder.svg",
      alt: "Placeholder coach portrait",
      width: 800,
      height: 600,
      placeholderLabel: "Placeholder",
    },
    disclaimer: "Illustrative trainer — not a real roster entry.",
  },
];

export const batchesFixture: BatchSlotProps[] = [
  {
    id: "b1",
    dayLabel: "Mon",
    timeLabel: "06:30–07:30",
    locationLabel: "Airoli",
    disclaimer: "Placeholder schedule — not a real class time.",
  },
  {
    id: "b2",
    dayLabel: "Thu",
    timeLabel: "18:30–19:30",
    locationLabel: "Ghansoli",
    disclaimer: "Placeholder schedule — not a real class time.",
  },
];

export const programmeFaqFixture: FaqItemProps[] = [
  {
    id: "pf1",
    question: "Do I need prior lifting experience?",
    answer:
      "Illustrative answer: beginners are welcome; coaches scale loads and complexity.",
    disclaimer: "Illustrative FAQ — not owner-confirmed policy.",
  },
  {
    id: "pf2",
    question: "Is equipment provided?",
    answer:
      "Illustrative answer: primary training equipment is provided in-studio; bring personal accessories you prefer.",
    disclaimer: "Illustrative FAQ — not owner-confirmed policy.",
  },
];
