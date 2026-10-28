import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GarbaNightView } from "@/components/events/GarbaNightView";
import { GarbaHomePromo } from "@/components/events/GarbaHomePromo";
import { GarbaCampaignRibbon } from "@/components/events/GarbaCampaignRibbon";
import { EventVideo } from "@/components/events/EventVideo";
import { getGarbaNight2026 } from "@/content";
import { SiteChrome } from "@/components/layout/SiteChrome";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

vi.mock("@/components/motion", () => ({
  RouteOpening: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SectionReveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  MotionReady: () => null,
}));

vi.mock("@/components/layout/SiteHeader", () => ({
  SiteHeader: () => <header>Header</header>,
}));

vi.mock("@/components/layout/StickyCtaBar", () => ({
  StickyCtaBar: () => <div data-testid="studio-sticky">Studio sticky</div>,
}));

describe("Garba 2026 highlights archive UI", () => {
  const event = getGarbaNight2026();
  const media = {
    poster: true,
    promoTeaser: true,
    previousEdition: true,
    currentEditionHero: true,
    currentEditionHighlights: true,
    campaignComplete: true,
  };

  it("renders real 2026 hero/video/gallery without booking CTAs", () => {
    const { container } = render(<GarbaNightView event={event} media={media} />);
    expect(event.lifecycle).toBe("concluded");
    expect(
      screen.queryByRole("link", { name: /book passes|book now|register now/i }),
    ).toBeNull();
    expect(container.innerHTML).not.toMatch(/kaizenevents\.live/i);
    expect(container.querySelector("[data-cta-variant='sticky']")).toBeNull();
    expect(screen.getByText(/Event concluded/i)).toBeTruthy();
    expect(screen.getByText(/The 5th Edition in motion/i)).toBeTruthy();
    expect(screen.getByText(/Pass Pricing — 5th Edition/i)).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/coming soon/i);
    // next/image encodes paths in src — assert filename presence
    expect(container.innerHTML).toMatch(/garba-night-2026-hero\.webp/);
    expect(container.innerHTML).toContain(
      event.media.currentEdition.highlightsVideo.src,
    );
    for (const image of event.media.currentEdition.gallery) {
      const file = image.src.split("/").pop()!;
      expect(container.innerHTML).toContain(encodeURIComponent(file).replace(/%2E/g, ".") || file);
      expect(container.innerHTML).toMatch(new RegExp(file.replace(/\./g, "\\.")));
    }
    expect(screen.getByText(/Garba Night 4\.0/i)).toBeTruthy();
    expect(screen.getAllByText(/previous edition/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /explore programmes/i })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /book a free trial/i }),
    ).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/sold out/i);
  });

  it("fires garba_2026_highlights_video_play once on first play", () => {
    const gtagCalls: unknown[][] = [];
    vi.stubGlobal("gtag", (...args: unknown[]) => {
      gtagCalls.push(args);
    });
    const { container } = render(
      <EventVideo
        src={event.media.currentEdition.highlightsVideo.src}
        poster={event.media.currentEdition.highlightsVideo.poster}
        label={event.media.currentEdition.highlightsVideo.label}
        playEvent="garba_2026_highlights_video_play"
        mode="manual"
      />,
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    fireEvent.play(video!);
    fireEvent.play(video!);
    const plays = gtagCalls.filter(
      (c) => c[0] === "event" && c[1] === "garba_2026_highlights_video_play",
    );
    expect(plays).toHaveLength(1);
    vi.unstubAllGlobals();
  });

  it("homepage Garba promo is inactive when campaign cleared", () => {
    const { container } = render(<GarbaHomePromo />);
    expect(container).toBeEmptyDOMElement();
  });

  it("campaign ribbon is suppressed when no active seasonal promo", () => {
    const { container } = render(
      <SiteChrome>
        <main>page</main>
      </SiteChrome>,
    );
    expect(container.innerHTML).not.toMatch(/Book Passes|kaizenevents\.live/i);
    expect(screen.queryByRole("link", { name: /book passes/i })).toBeNull();
    const { container: ribbon } = render(
      <GarbaCampaignRibbon
        eventPath={event.path}
        memberPriceLabel={event.memberPriceLabel}
        guestPriceLabel={event.guestPriceLabel}
      />,
    );
    expect(ribbon.innerHTML).not.toMatch(/kaizenevents\.live/i);
    expect(screen.queryAllByRole("link", { name: /book passes/i })).toHaveLength(
      0,
    );
  });
});
