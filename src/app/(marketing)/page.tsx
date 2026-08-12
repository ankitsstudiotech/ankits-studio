import {
  BranchExplorer,
  FaqSection,
  FounderHomeMoment,
  FreeTrialCta,
  GoogleReviewProof,
  Hero,
  ProgrammeShowcase,
} from "@/components/home";
import {
  getBusinessIdentity,
  getPubliclyListedBranches,
  getBranchMapsUrl,
  type ProgrammeSlug,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo";
import type { ServiceTempo } from "@/components/home/pulse/PulseMotion";

export const metadata = buildPageMetadata({
  title: "Coach-led dance & fitness in Navi Mumbai",
  description:
    "Ankit’s Studio offers coach-led functional training, yoga, Zumba and dance across four neighbourhood studios in Airoli, Ghansoli and Thane. Book a free trial on WhatsApp.",
  path: "/",
});

type HomepageService = {
  slug: ProgrammeSlug;
  tempo: ServiceTempo;
  name: string;
  shortDescription: string;
  meta?: string;
  emphasis?: "primary";
};

const SERVICE_BY_SLUG = {
  "functional-training": {
    slug: "functional-training" as const,
    tempo: "functional" as const,
    name: "Functional Training",
    shortDescription:
      "Coach-led, machine-free sessions — strength, mobility and everyday fitness.",
    meta: "All branches",
    emphasis: "primary" as const,
  },
  "home-personal-training": {
    slug: "home-personal-training" as const,
    tempo: "home" as const,
    name: "Home Personal Training",
    shortDescription: "One-to-one coaching at your location in Navi Mumbai and Thane.",
    meta: "Per session · share your locality",
  },
  "online-training": {
    slug: "online-training" as const,
    tempo: "online" as const,
    name: "Online Training",
    shortDescription: "Live coach-led sessions on Zoom.",
    meta: "One-to-one and group",
  },
  zumba: {
    slug: "zumba" as const,
    tempo: "zumba" as const,
    name: "Zumba",
    shortDescription: "High-energy dance fitness — beginner-friendly.",
    meta: "All branches",
  },
  yoga: {
    slug: "yoga" as const,
    tempo: "yoga" as const,
    name: "Yoga",
    shortDescription: "Structured breath-led movement with mindful guidance.",
    meta: "Ladies-only batches on request",
  },
  "adult-dance": {
    slug: "adult-dance" as const,
    tempo: "dance" as const,
    name: "Dance",
    shortDescription: "Energetic choreography in a welcoming studio room.",
    meta: "Kids-only batches on request",
  },
  "wedding-choreography": {
    slug: "wedding-choreography" as const,
    tempo: "wedding" as const,
    name: "Wedding Choreography",
    shortDescription: "Easy-to-learn routines for your wedding moment.",
    meta: "Arranged after you enquire",
  },
  "corporate-wellness": {
    slug: "corporate-wellness" as const,
    tempo: "home" as const,
    name: "Corporate Wellness",
    shortDescription: "Employee fitness and wellness at your workplace or online.",
    meta: "Custom programmes · enquire for scope",
  },
} satisfies Record<string, HomepageService>;

function toShowcaseProgramme(service: HomepageService) {
  return {
    name: service.name,
    href: `/programs/${service.slug}`,
    shortDescription: service.shortDescription,
    tempo: service.tempo,
    meta: service.meta,
    emphasis: service.emphasis,
    slug: service.slug,
  };
}

const HOMEPAGE_CLUSTERS = [
  {
    id: "train" as const,
    title: "Train",
    lede: "Coach-led fitness — in studio, at home, or online.",
    programmes: [
      toShowcaseProgramme(SERVICE_BY_SLUG["functional-training"]),
      toShowcaseProgramme(SERVICE_BY_SLUG["home-personal-training"]),
      toShowcaseProgramme(SERVICE_BY_SLUG["online-training"]),
    ],
  },
  {
    id: "move" as const,
    title: "Move",
    lede: "Group energy, breath work, and studio dance.",
    programmes: [
      toShowcaseProgramme(SERVICE_BY_SLUG.zumba),
      toShowcaseProgramme(SERVICE_BY_SLUG.yoga),
      toShowcaseProgramme(SERVICE_BY_SLUG["adult-dance"]),
    ],
  },
  {
    id: "celebrate" as const,
    title: "Celebrate",
    lede: "Personal choreography for wedding moments.",
    programmes: [toShowcaseProgramme(SERVICE_BY_SLUG["wedding-choreography"])],
  },
  {
    id: "teams" as const,
    title: "For Teams",
    lede: "Workplace and online fitness and wellness programmes for organisations.",
    programmes: [toShowcaseProgramme(SERVICE_BY_SLUG["corporate-wellness"])],
  },
];

export default function HomePage() {
  const identity = getBusinessIdentity();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();
  const branchCards = getPubliclyListedBranches().map((branch) => ({
    name: branch.locality,
    href: `/locations/${branch.slug}`,
    locality: branch.locality,
    openingYear: branch.openingYear,
    landmarkHint: branch.landmarks ?? undefined,
    hoursLabel: "Open daily · 6:00 AM–10:00 PM",
    mapsUrl: getBranchMapsUrl(branch) ?? undefined,
  }));

  const homepageFaqs = [
    {
      id: "faq-trial-free",
      question: "Is the trial really free?",
      answer:
        "Yes — the trial class is free once per person. A one-time ₹300 registration fee applies only after you join, not for the trial.",
    },
    {
      id: "faq-start-programme",
      question: "Which programme should I start with?",
      answer:
        "Most people begin with Functional Training, Zumba, Yoga or Dance in studio. Home and Online training suit personalised schedules. Message us on WhatsApp and we’ll help match a batch.",
    },
    {
      id: "faq-batches",
      question: "Do you offer ladies-only or kids-only batches?",
      answer:
        "Yes — ladies-only and kids-only batches are available as options. Ask which programmes and branches fit when you book a trial.",
    },
    {
      id: "faq-batch-times",
      question: "How do I check current batch timings?",
      answer:
        "Batch times vary by programme and branch. Studios are open 6:00 AM–10:00 PM daily — message us on WhatsApp with your preferred service and branch for current availability.",
    },
  ];

  return (
    <main>
      <Hero
        brandName={identity.displayName}
        title="Coach-led fitness, yoga, Zumba and dance."
        titleLines={["Coach-led fitness,", "yoga, Zumba and dance."]}
        description="Four neighbourhood studios across Airoli, Ghansoli and Thane. Approachable, energetic sessions with coach guidance — work toward your goals at your pace. Book a free trial on WhatsApp."
        primaryCta={{ label: trialLabel, href: trialHref }}
        secondaryCta={{ label: "Find Your Nearest Studio", href: "/#locations" }}
      />

      <ProgrammeShowcase clusters={HOMEPAGE_CLUSTERS} />

      <GoogleReviewProof />

      <BranchExplorer locations={branchCards} />

      <FounderHomeMoment
        copy="Ankit’s Studio began in Airoli in 2019 with the idea that fitness should feel approachable, enjoyable and sustainable. It has since grown to four studios across Navi Mumbai and Thane."
      />

      <FreeTrialCta
        href={trialHref}
        label={trialLabel}
        body="Tell us your preferred programme and branch on WhatsApp — we’ll share the current trial option and batch fit."
        variant="accent"
      />

      <FaqSection items={homepageFaqs} description="Quick answers before you message us." />
    </main>
  );
}
