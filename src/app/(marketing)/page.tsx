import {
  BranchExplorer,
  CommunityTestimonials,
  FaqSection,
  FreeTrialCta,
  Hero,
  ProgrammeShowcase,
  TransformationStories,
  TimetablePreview,
  WhyStudio,
  type ProgrammeAccent,
} from "@/components/home";
import { TextLink } from "@/components/ui/TextLink";
import {
  getBusinessIdentity,
  getFaqs,
  getProgrammes,
  getPubliclyListedBranches,
  getTestimonials,
  getTimetableSlots,
  getTransformations,
  type ProgrammeSlug,
} from "@/content";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/components/home/pulse/pulse-home.module.css";

export const metadata = buildPageMetadata({
  title: "Fitness & dance studio in Navi Mumbai",
  description:
    "Ankit's Studio offers strength training, personal training, yoga, Zumba, and dance programmes across publicly listed neighbourhoods in Navi Mumbai.",
  path: "/",
});

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const PROGRAMME_LABELS: Record<ProgrammeSlug, string> = {
  "strength-training": "Strength Training",
  "personal-training": "Personal Training",
  yoga: "Yoga",
  zumba: "Zumba",
  "adult-dance": "Adult Dance",
  "kids-dance": "Kids Dance",
  "weight-loss-fitness": "Weight-Loss & General Fitness",
};

export default function HomePage() {
  const identity = getBusinessIdentity();
  const programmes = getProgrammes();
  const branches = getPubliclyListedBranches();
  const slots = getTimetableSlots().slice(0, 6);
  const testimonials = getTestimonials();
  const transformations = getTransformations();
  const faqs = getFaqs().slice(0, 6);

  const identityDisclaimer =
    identity.dataStatus === "verified" ? undefined : identity.mockDisclaimer;

  return (
    <main>
      <Hero
        title="FEEL THE ROOM'S TEMPO"
        description="Strength hits. Yoga holds. Dance grooves. Pick the energy that fits your week — then book a trial at a listed Navi Mumbai branch."
        mockDisclaimer={identityDisclaimer}
        primaryCta={{ label: "Book a free trial", href: "/trial" }}
        secondaryCta={{ label: "Browse programmes", href: "/programs" }}
      />

      <ProgrammeShowcase
        programmes={programmes.map((programme) => ({
          name: programme.name,
          href: `/programs/${programme.slug}`,
          shortDescription: programme.shortDescription,
          accent: programme.heroAccent as ProgrammeAccent,
          tags: programme.audienceTags.slice(0, 2),
        }))}
      />

      <WhyStudio
        points={[
          {
            id: "range",
            title: "ONE FLOOR, MANY TEMPOS",
            body: "Strength, yoga, Zumba, and dance share equipment, coaches, and calendar space — one neighbourhood studio, not unrelated brands taped together.",
          },
          {
            id: "local",
            title: "BUILT FOR THE WEEK",
            body: "Working adults and parents can find a programme, confirm a listed branch, check illustrative timings, and book a trial without hype metrics.",
          },
          {
            id: "human",
            title: "ENERGY WITHOUT THEATRE",
            body: "No fabricated member counts or miracle claims. Community energy is structural — lanes, places, and an honest trial path.",
          },
        ]}
        disclaimer="Positioning copy is studio narrative pending owner review — not verified biography or performance claims."
      />

      <BranchExplorer
        locations={branches.map((branch) => ({
          name: branch.name,
          href: `/locations/${branch.slug}`,
          areaLabel: branch.slug.charAt(0).toUpperCase() + branch.slug.slice(1),
          programmeCountLabel: `${branch.programmeSlugs.length} programmes linked`,
          dataStatus: branch.dataStatus,
          mockDisclaimer:
            branch.dataStatus === "verified" ? undefined : branch.mockDisclaimer,
        }))}
      />

      <section
        id="timetable"
        className={styles.utilityBand}
        aria-labelledby="home-timetable-title"
      >
        <h2 id="home-timetable-title">Timetable entry</h2>
        <p>
          Illustrative class slots only — filter the full week on the timetable
          page. Utility zone: calm, direct, no theatrical motion.
        </p>
        <TimetablePreview
          slots={slots.map((slot) => ({
            id: slot.id,
            dayLabel: DAY_LABELS[slot.dayOfWeek] ?? "—",
            timeLabel: `${slot.startTime}–${slot.endTime}`,
            programmeLabel: PROGRAMME_LABELS[slot.programmeSlug],
            branchLabel: slot.branchSlug.charAt(0).toUpperCase() + slot.branchSlug.slice(1),
            mockDisclaimer:
              slot.dataStatus === "verified" ? "Verified class time." : slot.mockDisclaimer,
          }))}
        />
        <p className="mt-4">
          <TextLink href="/timetable">Open full timetable →</TextLink>
        </p>
      </section>

      <TransformationStories
        items={transformations.map((item) => ({
          slug: item.slug,
          summary: item.summary,
          programmeLabel: PROGRAMME_LABELS[item.programmeSlug],
          mockDisclaimer:
            item.dataStatus === "verified" ? "Verified transformation story." : item.mockDisclaimer,
        }))}
      />

      <CommunityTestimonials
        testimonials={testimonials.map((item) => ({
          quote: item.quote,
          attributedName: item.attributedName,
          programmeLabel: item.programmeSlug ? PROGRAMME_LABELS[item.programmeSlug] : undefined,
          branchLabel: item.branchSlug
            ? `${item.branchSlug.charAt(0).toUpperCase()}${item.branchSlug.slice(1)} (placeholder)`
            : undefined,
          mockDisclaimer:
            item.dataStatus === "verified" ? "Verified member testimonial." : item.mockDisclaimer,
        }))}
      />

      <FreeTrialCta />

      <FaqSection
        items={faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          mockDisclaimer: faq.dataStatus === "verified" ? undefined : faq.mockDisclaimer,
        }))}
      />
    </main>
  );
}
