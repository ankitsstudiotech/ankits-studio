import type { NavItem, FooterLinkGroup } from "@/components/layout";
import type { ProgrammeCardProps } from "@/components/home/ProgrammeCard";
import type { TestimonialCardProps } from "@/components/home/TestimonialCard";
import type { LocationTeaserCardProps } from "@/components/home/LocationTeaserCard";
import type { TimetablePreviewSlot } from "@/components/home/TimetablePreview";
import type { HeroProps } from "@/components/home/Hero";

/**
 * Design-lab presentation fixtures only.
 * Not a business content system — do not import from src/content/mock.
 * All mock disclaimers are explicit.
 */

export const labNavItems: NavItem[] = [
  { id: "lab-home", label: "Home", href: "/design-lab" },
  { id: "lab-programmes", label: "Programmes", href: "/design-lab#programmes" },
  { id: "lab-locations", label: "Locations", href: "/design-lab#locations" },
  { id: "lab-timetable", label: "Timetable", href: "/design-lab#timetable" },
  { id: "lab-contact", label: "Contact", href: "/design-lab#contact" },
  {
    id: "lab-trial",
    label: "Book a trial",
    href: "/design-lab#trial",
    isPrimaryCta: true,
  },
];

export const labFooterGroups: FooterLinkGroup[] = [
  {
    title: "Explore",
    links: [
      { id: "f-programmes", label: "Programmes", href: "/design-lab#programmes" },
      { id: "f-locations", label: "Locations", href: "/design-lab#locations" },
      { id: "f-timetable", label: "Timetable", href: "/design-lab#timetable" },
    ],
  },
  {
    title: "Visit",
    links: [
      { id: "f-contact", label: "Contact", href: "/design-lab#contact" },
      { id: "f-trial", label: "Book a trial", href: "/design-lab#trial" },
    ],
  },
];

export const labHero: HeroProps = {
  title: "FEEL THE ROOM'S TEMPO",
  description:
    "A premium fitness and dance studio system for strength, yoga, Zumba, and dance — built to feel human, not like a generic gym template.",
  primaryCta: { label: "Book a trial", href: "/design-lab#trial" },
  secondaryCta: { label: "Browse programmes", href: "/design-lab#programmes" },
};

export const labProgrammes: ProgrammeCardProps[] = [
  {
    name: "Strength Training",
    href: "/design-lab#programmes",
    shortDescription: "Barbell and free-weight coaching for building real strength.",
    accent: "strength",
    tags: ["adults", "beginner-friendly"],
  },
  {
    name: "Yoga",
    href: "/design-lab#programmes",
    shortDescription: "Breath-led movement and mobility work for every level.",
    accent: "calm",
    tags: ["adults", "low-impact"],
  },
  {
    name: "Zumba",
    href: "/design-lab#programmes",
    shortDescription: "High-energy dance cardio set to music.",
    accent: "high-energy",
    tags: ["group-class", "high-intensity"],
  },
  {
    name: "Adult Dance",
    href: "/design-lab#programmes",
    shortDescription: "Choreography-based classes for adult beginners and beyond.",
    accent: "high-energy",
    tags: ["adults", "group-class"],
  },
];

export const labTestimonials: TestimonialCardProps[] = [
  {
    quote:
      "Illustrative example: a placeholder quote describing a positive class experience.",
    attributedName: "Illustrative member",
    programmeLabel: "Yoga",
    branchLabel: "Airoli (placeholder)",
    mockDisclaimer: "Illustrative example quote — not a real member testimonial.",
  },
  {
    quote:
      "Illustrative example: a placeholder quote describing a coached strength session.",
    attributedName: "Illustrative member",
    programmeLabel: "Strength Training",
    branchLabel: "Ghansoli (placeholder)",
    mockDisclaimer: "Illustrative example quote — not a real member testimonial.",
  },
];

export const labLocations: LocationTeaserCardProps[] = [
  {
    name: "Ankit's Studio — Airoli",
    href: "/design-lab#locations",
    areaLabel: "Airoli",
    programmeCountLabel: "7 programmes (illustrative)",
    addressPreview: "Placeholder address — not confirmed for publication.",
    mockDisclaimer:
      "Placeholder branch details — address and contact are illustrative only.",
  },
  {
    name: "Ankit's Studio — Ghansoli",
    href: "/design-lab#locations",
    areaLabel: "Ghansoli",
    programmeCountLabel: "7 programmes (illustrative)",
    addressPreview: "Placeholder address — not confirmed for publication.",
    mockDisclaimer:
      "Placeholder branch details — address and contact are illustrative only.",
  },
];

export const labTimetableSlots: TimetablePreviewSlot[] = [
  {
    id: "slot-1",
    dayLabel: "Mon",
    timeLabel: "06:30–07:30",
    programmeLabel: "Strength Training",
    branchLabel: "Airoli",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
  },
  {
    id: "slot-2",
    dayLabel: "Tue",
    timeLabel: "07:00–08:00",
    programmeLabel: "Yoga",
    branchLabel: "Airoli",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
  },
  {
    id: "slot-3",
    dayLabel: "Wed",
    timeLabel: "18:00–19:00",
    programmeLabel: "Zumba",
    branchLabel: "Ghansoli",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
  },
  {
    id: "slot-4",
    dayLabel: "Thu",
    timeLabel: "18:30–19:30",
    programmeLabel: "Strength Training",
    branchLabel: "Ghansoli",
    mockDisclaimer: "Placeholder schedule — not a real class time.",
  },
];
