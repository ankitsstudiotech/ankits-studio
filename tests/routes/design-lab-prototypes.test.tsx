import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RevampAView } from "@/components/design-lab/revamp-a/RevampAView";
import { RevampBView } from "@/components/design-lab/revamp-b/RevampBView";
import { RevampCView } from "@/components/design-lab/revamp-c/RevampCView";
import stylesA from "@/components/design-lab/revamp-a/revamp-a.module.css";
import stylesB from "@/components/design-lab/revamp-b/revamp-b.module.css";
import stylesC from "@/components/design-lab/revamp-c/revamp-c.module.css";

/**
 * Structural regression for frozen art-direction prototypes.
 * Guards: routes render (via views), primary headings, typography wrappers,
 * direction-specific root classes, and scoped styles surviving production token churn.
 */
describe("frozen design-lab prototypes", () => {
  it("revamp A renders with Kinetic Editorial heading and root markers", () => {
    expect(stylesA.root).toBeTruthy();
    const { container } = render(<RevampAView />);
    const root = container.querySelector('[data-design-lab-prototype="a"]');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("data-frozen-prototype", "true");
    expect(root).toHaveAttribute("data-prototype-typography", "kinetic-editorial");
    expect(root?.className).toContain(stylesA.root as string);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Seven disciplines/i
    );
  });

  it("revamp B renders with Studio Pulse heading and root markers", () => {
    expect(stylesB.root).toBeTruthy();
    const { container } = render(<RevampBView />);
    const root = container.querySelector('[data-design-lab-prototype="b"]');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("data-frozen-prototype", "true");
    expect(root).toHaveAttribute("data-prototype-typography", "studio-pulse");
    expect(root?.className).toContain(stylesB.root as string);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /FEEL THE ROOM/i
    );
  });

  it("revamp C renders with Movement System heading and root markers", () => {
    expect(stylesC.root).toBeTruthy();
    const { container } = render(<RevampCView />);
    const root = container.querySelector('[data-design-lab-prototype="c"]');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute("data-frozen-prototype", "true");
    expect(root).toHaveAttribute("data-prototype-typography", "movement-system");
    expect(root?.className).toContain(stylesC.root as string);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Choose a programme/i
    );
  });
});

describe("design-lab metadata protection", () => {
  it("design-lab layout metadata is noindex/nofollow", async () => {
    const { designLabRobots, designLabRevampRobots } = await import(
      "@/app/design-lab/design-lab-robots"
    );
    expect(designLabRobots).toMatchObject({
      index: false,
      follow: false,
    });
    expect(designLabRevampRobots).toEqual({ index: false, follow: false });
  });

  it("design-lab shell layout exports noindex metadata", async () => {
    const layout = await import("@/app/design-lab/layout");
    expect(layout.metadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });
});
