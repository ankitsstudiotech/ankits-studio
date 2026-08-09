import {
  BranchExplorer,
  FaqSection,
  FreeTrialCta,
  Hero,
  ProgrammeShowcase,
  PulseTrustRail,
  WhyStudio,
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
  title: "Machine-free fitness, yoga, Zumba & dance in Navi Mumbai",
  description:
    "Ankit’s Studio offers machine-free, coach-led fitness, yoga, Zumba and dance across four neighbourhood studios in Airoli, Ghansoli and Thane. Book a free trial on WhatsApp.",
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
    shortDescription: "Machine-free, coach-led sessions for how you move day to day.",
    meta: "All branches",
    emphasis: "primary" as const,
  },
  "home-personal-training": {
    slug: "home-personal-training" as const,
    tempo: "home" as const,
    name: "Home Personal Training",
    shortDescription: "Coach-led sessions at your location.",
    meta: "Per session · share your locality",
  },
  "online-training": {
    slug: "online-training" as const,
    tempo: "online" as const,
    name: "Online Training",
    shortDescription: "Coach-led sessions on Zoom.",
    meta: "One-to-one and group",
  },
  zumba: {
    slug: "zumba" as const,
    tempo: "zumba" as const,
    name: "Zumba",
    shortDescription: "Music-led group energy — no dance background required.",
    meta: "All branches",
  },
  yoga: {
    slug: "yoga" as const,
    tempo: "yoga" as const,
    name: "Yoga",
    shortDescription: "Breath-led movement with space to settle.",
    meta: "Ladies-only batches on request",
  },
  "adult-dance": {
    slug: "adult-dance" as const,
    tempo: "dance" as const,
    name: "Dance",
    shortDescription: "Technique and choreography in a welcoming room.",
    meta: "Kids-only batches on request",
  },
  "wedding-choreography": {
    slug: "wedding-choreography" as const,
    tempo: "wedding" as const,
    name: "Wedding Choreography",
    shortDescription: "Personal choreography for wedding routines.",
    meta: "Arranged after you enquire",
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
    lede: "Choreography for wedding moments.",
    programmes: [toShowcaseProgramme(SERVICE_BY_SLUG["wedding-choreography"])],
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
    address: null,
    hoursLabel: "Open daily · 6:00 AM–10:00 PM",
    mapsUrl: getBranchMapsUrl(branch) ?? undefined,
    addressPending: false,
  }));

  const factualFaqs = [
    {
      id: "faq-batches",
      question: "Do you offer ladies-only or kids-only batches?",
      answer:
        "Yes — ladies-only and kids-only batches are available. Kids Dance age groups include 3–8 years and 8–12 years. Ask which options fit when you book a trial.",
    },
    {
      id: "faq-group-size",
      question: "How large are group batches?",
      answer: "Group batches are typically up to 15 people. We’ll help match the right service and batch for you.",
    },
  ];

  return (
    <main>
      <Hero
        brandName={identity.displayName}
        title="Machine-free fitness. Yoga, Zumba and dance."
        titleLines={["Machine-free fitness.", "Yoga, Zumba and dance."]}
        description="Four neighbourhood studios across Airoli, Ghansoli and Thane. Coach-led sessions for working professionals and other neighbourhood visitors — book a free trial on WhatsApp."
        primaryCta={{ label: trialLabel, href: trialHref }}
        secondaryCta={{ label: "Find Your Nearest Studio", href: "/#locations" }}
      />

      <ProgrammeShowcase
        clusters={HOMEPAGE_CLUSTERS}
        audienceNote="Enquiries welcome across age groups. Maximum group batch size is 15."
      />

      <WhyStudio
        title="Machine-free. Coach-led."
        body="Sessions stay machine-free and coach-led. Personal training is available when you want more personalised programming."
        points={[
          {
            id: "machine-free",
            title: "Machine-free training",
            body: "Bodyweight and portable equipment — not rows of gym machines.",
          },
          {
            id: "coach-led",
            title: "Coach-led group sessions",
            body: "Group classes led by coaches in a focused room.",
          },
          {
            id: "personal-training",
            title: "Personal training",
            body: "One-to-one coaching when you want a programme tailored to you.",
          },
        ]}
      />

      <PulseTrustRail
        facts={[
          { id: "founded", label: "Founded", value: "2019" },
          { id: "studios", label: "Studios", value: "4" },
          { id: "team", label: "Team", value: "15+" },
          { id: "open", label: "Open", value: "Every day · 6 AM–10 PM" },
        ]}
      />

      <BranchExplorer locations={branchCards} />

      <FreeTrialCta
        href={trialHref}
        label={trialLabel}
        body="Message Ankit’s Studio on WhatsApp to book a free trial. Studios open 6:00 AM–10:00 PM every day."
      />

      <FaqSection
        items={factualFaqs}
        description="A couple of details that help first-time visitors."
      />
    </main>
  );
}
