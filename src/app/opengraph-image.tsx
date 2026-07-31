import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/metadata";

/**
 * Minimal, functional default OG image — a placeholder foundation, not a
 * final branded design (that's a design-tokens/Track A decision, out of
 * this task's ownership). Plain text on a neutral dark background.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1310",
          color: "#ffffff",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        {siteConfig.name}
      </div>
    ),
    { ...size }
  );
}
