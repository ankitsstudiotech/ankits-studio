import { SiteFooter, SiteHeader, StickyCtaBar } from "@/components/layout";
import {
  Hero,
  LocationTeaserCard,
  ProgrammeCard,
  TestimonialCard,
  TimetablePreview,
} from "@/components/home";
import { AccessibleCarousel, ScrollReveal, TextReveal } from "@/components/motion";
import {
  Badge,
  Body,
  Button,
  Caption,
  Card,
  Container,
  Heading,
  MediaFrame,
  Overline,
  Section,
  TextLink,
  Title,
  VideoFrame,
} from "@/components/ui";
import { LabShell } from "./LabShell";
import {
  labFooterGroups,
  labHero,
  labLocations,
  labNavItems,
  labProgrammes,
  labTestimonials,
  labTimetableSlots,
} from "../fixtures";

export default function DesignLabPage() {
  return (
    <LabShell>
      <SiteHeader items={labNavItems} pathname="/design-lab" brandHref="/design-lab" />

      <main>
        <div className="border-b border-accent/25 bg-accent-soft">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
            <Caption tone="ink" className="font-medium">
              Design lab — component review only. Mock presentation fixtures; not
              verified business data.
            </Caption>
            <Badge accent="accent">noindex</Badge>
          </Container>
        </div>

        <Hero {...labHero} />

        <Section
          id="primitives"
          eyebrow="Foundation"
          title="UI primitives"
          description="Buttons, links, badges, and cards sharing one token system across strength, calm, and high-energy accents."
        >
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <TextLink href="/design-lab#trial">Inline text link</TextLink>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05} className="mt-6 flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge accent="accent">Accent</Badge>
            <Badge accent="strength">Strength</Badge>
            <Badge accent="calm">Calm</Badge>
            <Badge accent="high-energy">High energy</Badge>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <Heading className="mb-2">Static card</Heading>
              <Body>
                Cards are reserved for interactive or quotation surfaces — not
                decorative chrome.
              </Body>
            </Card>
            <Card interactive href="/design-lab#programmes">
              <Heading className="mb-2">Interactive card</Heading>
              <Body>Hover lift and focus ring for link-style cards.</Body>
            </Card>
          </ScrollReveal>
        </Section>

        <Section
          id="type"
          eyebrow="Typography"
          title="Editorial type pairing"
          description="Syne for display. Figtree for body. Max two families."
          className="bg-surface-raised/60"
        >
          <Overline>Overline</Overline>
          <Title className="mt-3">Title — confident, not gym-poster</Title>
          <Body size="lg" className="mt-4 max-w-2xl">
            Body large — readable for programme and location storytelling across
            strength, yoga, Zumba, and dance audiences.
          </Body>
          <div className="mt-8">
            <TextReveal
              as="h3"
              className="font-[family-name:var(--font-display)] text-[length:var(--text-heading)] font-semibold text-ink"
              text="Text reveal enhances after hydration — content stays readable without motion."
            />
          </div>
        </Section>

        <Section
          id="programmes"
          eyebrow="Programmes"
          title="Programme cards"
          description="One shared system; accent family rails differentiate without sub-brands."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {labProgrammes.map((programme, index) => (
              <ScrollReveal key={programme.name} delay={index * 0.04}>
                <ProgrammeCard {...programme} />
              </ScrollReveal>
            ))}
          </div>
        </Section>

        <Section
          id="locations"
          eyebrow="Locations"
          title="Location teasers"
          description="Public branches only in real nav — Thane stays out until confirmed. No live tel/wa links on mock data."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {labLocations.map((location, index) => (
              <ScrollReveal key={location.name} delay={index * 0.05}>
                <LocationTeaserCard {...location} />
              </ScrollReveal>
            ))}
          </div>
        </Section>

        <Section
          id="timetable"
          eyebrow="Timetable"
          title="Timetable preview"
          description="Stacked on small screens; semantic table from md up. Full filter UI belongs on /timetable."
        >
          <ScrollReveal>
            <TimetablePreview slots={labTimetableSlots} />
          </ScrollReveal>
        </Section>

        <Section
          id="social-proof"
          eyebrow="Social proof"
          title="Testimonials"
          description="Always labelled illustrative. Carousel is optional — prefer grids when space allows."
          className="bg-surface-sunken/80"
        >
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {labTestimonials.map((item) => (
              <TestimonialCard key={item.quote} {...item} />
            ))}
          </div>

          <div className="mt-10 max-w-2xl">
            <Caption className="mb-3">Accessible carousel primitive (no autoplay)</Caption>
            <AccessibleCarousel
              label="Illustrative testimonials carousel"
              slides={labTestimonials.map((item, index) => ({
                id: `t-${index}`,
                content: <TestimonialCard {...item} />,
              }))}
            />
          </div>
        </Section>

        <Section
          id="media"
          eyebrow="Media"
          title="Image and video wrappers"
          description="next/image frames with mock labels. Video shell is poster-only — no autoplay hero video."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <MediaFrame
              src="/mock-media/programme-placeholder.svg"
              alt="Abstract programme media placeholder"
              width={1200}
              height={900}
              placeholderLabel="Mock media"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <VideoFrame
              poster="/mock-media/video-poster.svg"
              title="Play locked — policy"
            />
          </div>
        </Section>

        <Section
          id="trial"
          eyebrow="Conversion"
          title="Trial CTA pattern"
          description="Header CTA on desktop; sticky bar on mobile. WhatsApp/tel only when verified."
        >
          <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Heading className="mb-1">Ready to visit?</Heading>
              <Body>Illustrative booking CTA for layout review.</Body>
            </div>
            <Button size="lg">Book a trial</Button>
          </Card>
          <p id="contact" className="sr-only">
            Contact anchor for lab navigation
          </p>
        </Section>
      </main>

      <SiteFooter groups={labFooterGroups} />
      <StickyCtaBar pathname="/design-lab" href="/design-lab#trial" />
    </LabShell>
  );
}
