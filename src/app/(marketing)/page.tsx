import {
  BranchExplorer,
  FaqSection,
  FreeTrialCta,
  Hero,
  ProgrammeShowcase,
  WhyStudio,
} from "@/components/home";
import { TextLink } from "@/components/ui/TextLink";
import {
  getBusinessIdentity,
  getContactDetails,
  getStudioCommercial,
  getStudioContactLinks,
  type ProgrammeSlug,
} from "@/content";
import {
  getPrimaryConversionHref,
  getPrimaryConversionLabel,
  SECONDARY_TRIAL_FORM_HREF,
} from "@/lib/conversion";
import { buildPageMetadata } from "@/lib/seo";
import type { ServiceTempo } from "@/components/home/pulse/PulseMotion";
import styles from "@/components/home/pulse/pulse-home.module.css";

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
    shortDescription: "Machine-free, coach-led sessions built around how you move day to day.",
    meta: "Studio classes · all branches",
    emphasis: "primary" as const,
  },
  "home-personal-training": {
    slug: "home-personal-training" as const,
    tempo: "home" as const,
    name: "Home Personal Training",
    shortDescription: "Coach-led sessions at home — a delivery mode, not a branch-floor class.",
    meta: "Home delivery · coverage confirmed when you message us",
  },
  "online-training": {
    slug: "online-training" as const,
    tempo: "online" as const,
    name: "Online Training",
    shortDescription: "Remote coach-led sessions. Platform and timing confirmed on enquiry.",
    meta: "Online delivery · not a physical branch class",
  },
  zumba: {
    slug: "zumba" as const,
    tempo: "zumba" as const,
    name: "Zumba",
    shortDescription: "Music-led group energy. No dance background required to enquire.",
    meta: "Studio classes · high-energy group sessions",
  },
  yoga: {
    slug: "yoga" as const,
    tempo: "yoga" as const,
    name: "Yoga",
    shortDescription: "Breath-led movement with space to settle — ask which batch suits you.",
    meta: "Studio classes · ladies-only batches available on request",
  },
  "adult-dance": {
    slug: "adult-dance" as const,
    tempo: "dance" as const,
    name: "Dance",
    shortDescription: "Studio dance for adults — technique and choreography in a welcoming room.",
    meta: "Studio classes · kids-only batches available on request",
  },
  "wedding-choreography": {
    slug: "wedding-choreography" as const,
    tempo: "wedding" as const,
    name: "Wedding Choreography",
    shortDescription: "Personal choreography support for wedding routines and performances.",
    meta: "Arranged with the studio after you enquire",
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
    lede: "Personal choreography for wedding moments.",
    programmes: [toShowcaseProgramme(SERVICE_BY_SLUG["wedding-choreography"])],
  },
];

const BRANCHES = [
  {
    name: "Airoli Sector 19",
    href: "/locations/airoli-sector-19",
    detail: "Neighbourhood studio in Airoli Sector 19.",
    mapsUrl: "https://maps.app.goo.gl/NWrGtXKKYwr5xXwbA?g_st=ac",
  },
  {
    name: "Airoli Sector 8",
    href: "/locations/airoli-sector-8",
    detail: "Open neighbourhood studio. Detailed map and address are being updated.",
    addressPending: true,
  },
  {
    name: "Ghansoli",
    href: "/locations/ghansoli",
    detail: "Neighbourhood studio in Ghansoli.",
    mapsUrl: "https://maps.app.goo.gl/WzhJUEhAvC67eMgR8?g_st=ac",
  },
  {
    name: "Thane",
    href: "/locations/thane",
    detail: "Neighbourhood studio in Thane.",
    mapsUrl: "https://maps.app.goo.gl/bvzahC17HkciT6QQ6?g_st=ic",
  },
] as const;

export default function HomePage() {
  const identity = getBusinessIdentity();
  const commercial = getStudioCommercial();
  const contact = getContactDetails();
  const studioLinks = getStudioContactLinks();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();

  const factualFaqs = [
    {
      id: "faq-trial",
      question: "Is the trial class free?",
      answer:
        "Yes. You can book a free trial on WhatsApp. Opening WhatsApp starts a chat — it does not mean a message was already delivered.",
    },
    {
      id: "faq-hours",
      question: "What are the studio hours?",
      answer:
        "Studios operate from 6:00 AM to 10:00 PM. That is the operating window, not a class-by-class timetable. Message us for current batch availability.",
    },
    {
      id: "faq-fees",
      question: "What does it cost to join?",
      answer: `There is a one-time registration fee of ₹${commercial.registrationFeeInr ?? 300}. Programme fees vary by service and are confirmed when you enquire.`,
    },
    {
      id: "faq-batches",
      question: "Do you offer ladies-only or kids-only batches?",
      answer:
        "Yes — ladies-only and kids-only batches are available. Ask which options fit when you book a trial. Not every programme suits every age.",
    },
  ];

  return (
    <main>
      <Hero
        brandName={identity.displayName}
        title="Machine-free fitness. Yoga, Zumba and dance."
        description="Four neighbourhood studios across Airoli, Ghansoli and Thane. Coach-led sessions adapted to your needs — book a free trial on WhatsApp."
        primaryCta={{ label: trialLabel, href: trialHref }}
        secondaryCta={{ label: "Find Your Nearest Studio", href: "/#locations" }}
      />

      <ProgrammeShowcase
        clusters={HOMEPAGE_CLUSTERS}
        audienceNote="Enquiries are welcome across age groups. Maximum group batch size is 15. We will help you match the right service and batch — not every programme is for every person."
      />

      <WhyStudio
        title="Machine-free. Coach-led. Adapted to you."
        body="Sessions are built without conventional gym-machine circuits. Coaches adapt the work to your requirements and goals — without promising specific outcomes."
        points={[
          {
            id: "machine-free",
            title: "Machine-free training",
            body: "Coach-led movement rather than rows of gym machines.",
          },
          {
            id: "adapted",
            title: "Adapted to you",
            body: "Sessions respond to individual needs and goals.",
          },
          {
            id: "community",
            title: "Welcoming batches",
            body: "Ladies-only and kids-only options are available to ask about.",
          },
        ]}
      />

      <BranchExplorer locations={[...BRANCHES]} />

      <section
        id="practical"
        className={styles.utilityBand}
        aria-labelledby="home-practical-title"
      >
        <h2 id="home-practical-title">Practical information</h2>
        <p>
          Batches run throughout the day and vary by branch and programme. Message us on WhatsApp
          for current batch availability — we do not publish class-by-class rows until real schedules
          are confirmed. Studio operating window: 6:00 AM–10:00 PM (not a continuous class).
        </p>
        <ul className={styles.utilityFacts}>
          <li>
            <strong>Operating window</strong>
            6:00 AM – 10:00 PM across studios (not individual class times)
          </li>
          <li>
            <strong>Central enquiry</strong>
            {contact.generalPhone}
            {studioLinks.phoneHref ? (
              <>
                {" · "}
                <a
                  href={studioLinks.phoneHref}
                  className="font-semibold text-ink underline underline-offset-2 hover:text-accent"
                >
                  Call
                </a>
              </>
            ) : null}
          </li>
          <li>
            <strong>Group size</strong>
            Maximum 15 people per group batch
          </li>
          <li>
            <strong>Join fees</strong>
            Free trial · ₹{commercial.registrationFeeInr ?? 300} one-time registration
          </li>
        </ul>
        <p className="mt-4">
          <TextLink href={SECONDARY_TRIAL_FORM_HREF}>Open the trial request form →</TextLink>
        </p>
      </section>

      <FreeTrialCta href={trialHref} label={trialLabel} />

      <FaqSection items={factualFaqs} />
    </main>
  );
}
