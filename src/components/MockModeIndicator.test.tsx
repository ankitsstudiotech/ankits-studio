import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const bannerState = vi.hoisted(() => ({ show: true }));

vi.mock("@/content/content-mode", () => ({
  siteHasUnverifiedContent: true,
  shouldShowMockPreviewBanner: () => bannerState.show,
}));

import { MockModeIndicator } from "./MockModeIndicator";

describe("MockModeIndicator", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    bannerState.show = true;
  });

  it("renders when the preview banner gate is open (development / mock publish)", () => {
    bannerState.show = true;
    vi.stubEnv("NODE_ENV", "development");
    render(<MockModeIndicator />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status").textContent).toContain("Development preview");
  });

  it("renders nothing when the production gate closes the banner", () => {
    bannerState.show = false;
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "");
    const { container } = render(<MockModeIndicator />);
    expect(container).toBeEmptyDOMElement();
  });

  it("labels an ALLOW_MOCK_PUBLISH preview as Mock preview", () => {
    bannerState.show = true;
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_MOCK_PUBLISH", "true");
    render(<MockModeIndicator />);
    expect(screen.getByRole("status").textContent).toContain("Mock preview");
    expect(screen.getByRole("status").textContent).toMatch(/pending confirmation/i);
  });
});
