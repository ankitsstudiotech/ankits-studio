import type {
  ContactAction,
  FaqItemProps,
  OpeningHoursRow,
  ProgrammeGridItem,
  TrainerItemProps,
} from "@/components/locations";
import type { BranchTimetableSlot } from "@/components/timetable";
import type { LocationHeroProps } from "@/components/locations";

/**
 * Design-lab presentation fixtures only — not a content system.
 * Do not import src/content/mock.
 */

export const locationHeroFixture: LocationHeroProps = {
  name: "Ankit's Studio — Airoli",
  areaLabel: "Airoli",
  address:
    "123 Placeholder Road, Near Long Landmark Name Extension, Sector 15, Airoli, Navi Mumbai, Maharashtra (exact address not yet confirmed)",
  shortBlurb:
    "Illustrative neighbourhood blurb for layout review. Replace with owner-approved local copy.",
  media: {
    src: "/mock-media/hero-atmosphere.svg",
    alt: "Abstract branch atmosphere placeholder",
    width: 1600,
    height: 1200,
    placeholderLabel: "Mock media",
  },
  disclaimer:
    "Placeholder branch details — address and contact are illustrative only.",
};

export const thaneHeroFixture: LocationHeroProps = {
  name: "Ankit's Studio — Thane",
  areaLabel: "Thane",
  address: "To be confirmed",
  disclaimer:
    "Reference-only branch — not publicly listed until the owner confirms it operates.",
};

export const contactActionsFixture: ContactAction[] = [
  { id: "call", label: "Call", href: null, kind: "phone" },
  { id: "wa", label: "WhatsApp", href: null, kind: "whatsapp" },
  { id: "dir", label: "Directions", href: null, kind: "directions" },
];

export const openingHoursFixture: OpeningHoursRow[] = [
  { dayLabel: "Mon", opensAt: "06:00", closesAt: "21:00" },
  { dayLabel: "Tue", opensAt: "06:00", closesAt: "21:00" },
  { dayLabel: "Wed", opensAt: "06:00", closesAt: "21:00" },
  { dayLabel: "Thu", opensAt: "06:00", closesAt: "21:00" },
  { dayLabel: "Fri", opensAt: "06:00", closesAt: "21:00" },
  { dayLabel: "Sat", opensAt: "07:00", closesAt: "19:00" },
  { dayLabel: "Sun", opensAt: "07:00", closesAt: "13:00", pending: true },
];

export const programmesGridFixture: ProgrammeGridItem[] = [
  {
    slug: "strength-training",
    name: "Strength Training",
    href: "/design-lab/programs",
    shortDescription: "Barbell and free-weight coaching for building real strength.",
    accent: "strength",
  },
  {
    slug: "yoga",
    name: "Yoga",
    href: "/design-lab/programs",
    shortDescription: "Breath-led movement and mobility work for every level.",
    accent: "calm",
  },
  {
    slug: "adult-dance",
    name: "Adult Dance — Choreography Intensive With A Long Title",
    href: "/design-lab/programs",
    shortDescription: "Technique and choreography for adult learners.",
    accent: "high-energy",
  },
];

export const branchTrainersFixture: TrainerItemProps[] = [
  {
    slug: "illustrative-coach-1",
    name: "Illustrative Coach One",
    bio: "Illustrative bio — not a real trainer.",
    specialtyLabels: ["Strength Training"],
    photo: null,
    disclaimer: "Illustrative roster entry.",
  },
];

export const branchTimetableFixture: BranchTimetableSlot[] = [
  {
    id: "t1",
    dayLabel: "Mon",
    timeLabel: "06:30–07:30",
    programmeLabel: "Strength Training",
    disclaimer: "Placeholder schedule — not a real class time.",
  },
  {
    id: "t2",
    dayLabel: "Tue",
    timeLabel: "07:00–08:00",
    programmeLabel: "Yoga",
    disclaimer: "Placeholder schedule — not a real class time.",
  },
];

export const locationFaqFixture: FaqItemProps[] = [
  {
    id: "lf1",
    question: "Is there parking near the studio?",
    answer: "Illustrative answer: parking details are to be confirmed with the owner.",
    disclaimer: "Illustrative FAQ — not owner-confirmed.",
  },
  {
    id: "lf2",
    question: "Which programmes run at this branch?",
    answer:
      "Illustrative answer: see the programmes grid above; offerings may differ by location.",
    disclaimer: "Illustrative FAQ — not owner-confirmed.",
  },
];
