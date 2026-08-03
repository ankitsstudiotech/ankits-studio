import {
  BranchExplorer,
  FaqSection,
  FreeTrialCta,
  Hero,
  ProgrammeShowcase,
  WhyStudio,
} from "@/components/home";
import {
  getBusinessIdentity,
  getContactDetails,
  getPubliclyListedBranches,
  getBranchMapsUrl,
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

export default function HomePage() {
  const identity = getBusinessIdentity();
  const commercial = getStudioCommercial();
  const contact = getContactDetails();
  const studioLinks = getStudioContactLinks();
  const trialHref = getPrimaryConversionHref();
  const trialLabel = getPrimaryConversionLabel();
  const branchCards = getPubliclyListedBranches().map((branch) => ({
    name: branch.locality,
    href: `/locations/${branch.slug}`,
    locality: branch.locality,
    address: branch.address,
    hoursLabel: "Open daily · 6:00 AM–10:00 PM",
    mapsUrl: getBranchMapsUrl(branch) ?? undefined,
    addressPending: branch.address == null,
  }));

  const factualFaqs = [
    {
      id: "faq-trial",
      question: "Is the trial class free?",
      answer:
        "Yes. A free trial is available for every service at every physical branch, once per person. Message us on WhatsApp to arrange yours.",
    },
    {
      id: "faq-hours",
      question: "What are the studio hours?",
      answer:
        "Studios operate from 6:00 AM to 10:00 PM every day — there is no weekly closing day. That is the operating window, not a class-by-class timetable. Message us for current batch availability.",
    },
    {
      id: "faq-fees",
      question: "What does it cost to join?",
      answer: `There is a one-time registration fee of ₹${commercial.registrationFeeInr ?? 300} per person. Programme fees vary by service and branch and are confirmed when you enquire.`,
    },
    {
      id: "faq-batches",
      question: "Do you offer ladies-only or kids-only batches?",
      answer:
        "Yes — ladies-only and kids-only batches are available. Kids Dance age groups include 3–8 years and 8–12 years. Ask which options fit when you book a trial. Not every programme suits every age.",
    },
  ];

  return (
    <main>
      <Hero
        brandName={identity.displayName}
        title="Machine-free fitness. Yoga, Zumba and dance."
        description="Four neighbourhood studios across Airoli, Ghansoli and Thane. Coach-led sessions for working professionals and other neighbourhood visitors — book a free trial on WhatsApp."
        primaryCta={{ label: trialLabel, href: trialHref }}
        secondaryCta={{ label: "Find Your Nearest Studio", href: "/#locations" }}
      />

      <ProgrammeShowcase
        clusters={HOMEPAGE_CLUSTERS}
        audienceNote="Enquiries are welcome across age groups. Maximum group batch size is 15. We will help you match the right service and batch — not every programme is for every person."
      />

      <WhyStudio
        title="Machine-free. Coach-led."
        body="Sessions use machine-free Functional Training and coach-led movement. Group sessions are coach-led; personal training is available when you want more personalised programming."
        points={[
          {
            id: "machine-free",
            title: "Machine-free training",
            body: "Bodyweight and portable equipment — not rows of gym machines.",
          },
          {
            id: "coach-led",
            title: "Coach-led group sessions",
            body: "Group classes are led by coaches in a focused room.",
          },
          {
            id: "personal-training",
            title: "Personal training for personalised programming",
            body: "One-to-one coaching when you want a programme tailored to you.",
          },
        ]}
      />

      <BranchExplorer locations={branchCards} />

      <section
        id="practical"
        className={`${styles.field} ${styles.band} ${styles.practicalBand}`}
        aria-labelledby="home-practical-title"
      >
        <h2 id="home-practical-title" className={styles.bandTitle}>
          Practical information
        </h2>
        <p className={styles.bandLede}>
          Batches run throughout the day and vary by branch and programme. Message us on WhatsApp
          for current batch availability — we do not publish class-by-class rows until real schedules
          are confirmed. Studio operating window: 6:00 AM–10:00 PM every day (not a continuous
          class).
        </p>
        <ul className="pulse-info-grid">
          <li>
            <strong>Operating window</strong>
            6:00 AM – 10:00 PM every day across studios (not individual class times)
          </li>
          <li>
            <strong>Central enquiry</strong>
            {contact.generalPhone}
            {studioLinks.phoneHref ? (
              <>
                {" · "}
                <a href={studioLinks.phoneHref} className={styles.practicalLink}>
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
        <p className={styles.practicalFollow}>
          <a href={SECONDARY_TRIAL_FORM_HREF} className={styles.practicalLink}>
            Open the trial request form →
          </a>
        </p>
      </section>

      <FreeTrialCta href={trialHref} label={trialLabel} />

      <FaqSection items={factualFaqs} />
    </main>
  );
}
