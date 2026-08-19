import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Brand-only Open Graph card — Studio Pulse dark field + temporary symbol.
 * No synthetic fitness photography. Verified facts only.
 */
export const alt = "Ankit’s Studio — Fitness, Yoga, Zumba & Dance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const symbolPath = join(
    process.cwd(),
    "public",
    "brand",
    "ankits-studio-symbol-transparent.png",
  );
  const symbolData = await readFile(symbolPath);
  const symbolSrc = `data:image/png;base64,${symbolData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#0e0e10",
          color: "#f4f4f5",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 36 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={symbolSrc} width={96} height={96} alt="" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 56,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Ankit’s Studio
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 1,
            color: "#c4c4c8",
            marginBottom: 18,
          }}
        >
          Fitness · Yoga · Zumba · Dance
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#9a9aa0", letterSpacing: 0.5 }}>
          Airoli · Ghansoli · Thane
        </div>
      </div>
    ),
    { ...size },
  );
}
