import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GarbaNightView } from "@/components/events/GarbaNightView";
import { GarbaHomePromo } from "@/components/events/GarbaHomePromo";
import { GarbaCampaignRibbon } from "@/components/events/GarbaCampaignRibbon";
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

describe("Garba post-event UI surfaces", () => {
  const event = getGarbaNight2026();
  const media = {
    poster: true,
    promoTeaser: true,
    previousEdition: true,
    campaignComplete: true,
  };

  it("event archive has no Book Passes / Kaizen / sticky purchase CTA", () => {
    const { container } = render(<GarbaNightView event={event} media={media} />);
    expect(event.lifecycle).toBe("concluded");
    expect(screen.queryByRole("link", { name: /book passes|book now|register now/i })).toBeNull();
    expect(container.innerHTML).not.toMatch(/kaizenevents\.live/i);
    expect(container.querySelector("[data-cta-variant='sticky']")).toBeNull();
    expect(screen.getByText(/Event concluded/i)).toBeTruthy();
    expect(screen.getByText(/Pass Pricing — 5th Edition/i)).toBeTruthy();
    expect(container.innerHTML).toMatch(/₹600/);
    expect(container.innerHTML).toMatch(/₹700/);
    expect(container.innerHTML).toMatch(/₹500/);
    expect(container.innerHTML).toMatch(/₹650/);
    expect(container.innerHTML).not.toMatch(/sold out/i);
    expect(container.innerHTML).not.toMatch(/photo gallery|2026 photos/i);
    expect(screen.getAllByRole("link", { name: /directions/i }).length).toBeGreaterThan(0);
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
    // Direct ribbon render with props would still show CTA component which is null
    const { container: ribbon } = render(
      <GarbaCampaignRibbon
        eventPath={event.path}
        memberPriceLabel={event.memberPriceLabel}
        guestPriceLabel={event.guestPriceLabel}
      />,
    );
    expect(ribbon.innerHTML).not.toMatch(/kaizenevents\.live/i);
    expect(screen.queryAllByRole("link", { name: /book passes/i })).toHaveLength(0);
  });
});
