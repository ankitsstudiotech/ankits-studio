import {
  BranchExplorer,
  CommunityTestimonials,
  FaqSection,
  FounderStoryPlaceholder,
  FreeTrialCta,
  Hero,
  ProgrammeShowcase,
  TransformationStories,
  TrustStrip,
  TimetablePreview,
  WhyStudio,
  type ProgrammeAccent,
} from "@/components/home";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Section } from "@/components/ui/Section";
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
  const slots = getTimetableSlots();
  const testimonials = getTestimonials();
  const transformations = getTransformations();
  const faqs = getFaqs();

  const identityDisclaimer =
    identity.dataStatus === "verified" ? undefined : identity.mockDisclaimer;

  return (
    <main>
      <Hero
        cinematic
        eyebrow={identity.displayName}
        title="Move with strength, rhythm, and community."
        description={identity.description}
        mockDisclaimer={identityDisclaimer}
        primaryCta={{ label: "Book a trial", href: "/trial" }}
        secondaryCta={{ label: "Browse programmes", href: "/programs" }}
        media={{
          src: "/mock-media/hero-atmosphere.svg",
          alt: "Replaceable abstract studio atmosphere placeholder — not real photography",
          width: 1600,
          height: 1200,
          placeholderLabel: "Mock media",
        }}
      />

      <TrustStrip
        items={[
          { id: "strength", label: "Strength & personal training" },
          { id: "yoga", label: "Yoga" },
          { id: "dance", label: "Zumba & dance" },
          {
            id: "locations",
            label: branches.map((b) => b.slug.charAt(0).toUpperCase() + b.slug.slice(1)).join(" · "),
          },
        ]}
        disclaimer="Programme names and listed locations are confirmed; no member counts, ratings, or outcome statistics are shown."
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
            title: "One studio, full range",
            body: "Strength, yoga, Zumba, and dance share one premium system — so the brand stays coherent while each programme still feels distinct.",
          },
          {
            id: "local",
            title: "Neighbourhood-first",
            body: "Built for local discovery across listed branches, with clear paths from programme interest to a trial visit.",
          },
          {
            id: "human",
            title: "Human, not hype",
            body: "No fabricated member counts or miracle claims — coaching culture and community come first.",
          },
        ]}
        disclaimer="Positioning copy above is illustrative studio narrative pending owner review — not verified biography or performance claims."
      />

      <FounderStoryPlaceholder
        title="Founder story coming soon"
        body="This section is reserved for an owner-approved founder narrative and photography. Until then it stays clearly labelled as a placeholder so nothing is mistaken for a verified biography."
        disclaimer="No founder biography, portrait, or timeline has been verified for publication."
        mediaSrc="/mock-media/programme-placeholder.svg"
      />

      <TransformationStories
        items={transformations.map((item) => ({
          slug: item.slug,
          summary: item.summary,
          programmeLabel: PROGRAMME_LABELS[item.programmeSlug],
          mockDisclaimer:
            item.dataStatus === "verified" ? "Verified transformation story." : item.mockDisclaimer,
        }))}
      />

      <BranchExplorer
        locations={branches.map((branch) => ({
          name: branch.name,
          href: `/locations/${branch.slug}`,
          areaLabel: branch.slug.charAt(0).toUpperCase() + branch.slug.slice(1),
          programmeCountLabel: `${branch.programmeSlugs.length} programmes listed (illustrative availability)`,
          addressPreview:
            branch.dataStatus === "verified"
              ? branch.address
              : "Address shown as placeholder until the owner confirms the printable string.",
          mockDisclaimer:
            branch.dataStatus === "verified" ? "Verified branch details." : branch.mockDisclaimer,
        }))}
      />

      <Section
        id="timetable"
        eyebrow="Timetable"
        title="A peek at the week"
        description="Illustrative class slots only — the full filterable timetable lives on /timetable."
      >
        <ScrollReveal>
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
        </ScrollReveal>
      </Section>

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
