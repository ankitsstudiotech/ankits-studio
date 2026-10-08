import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getGarbaNight2026 } from "@/content";

export const alt = "Ankit's Studio Garba Night 2026 — 17 October, Airoli";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function GarbaOpengraphImage() {
  const event = getGarbaNight2026();
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
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0b0b0c",
          backgroundImage:
            "radial-gradient(ellipse 70% 55% at 90% 10%, #6b1d2a55, transparent 55%), radial-gradient(ellipse 45% 40% at 5% 90%, #c9a22733, transparent 50%)",
          color: "#f4f1ea",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={symbolSrc} width={72} height={72} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Ankit&apos;s Studio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#c9a227",
            }}
          >
            Garba Night · 5th Edition
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              lineHeight: 0.95,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            17 Oct
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#c2bdb4",
            }}
          >
            Airoli · Navi Mumbai
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 1,
            color: "#c2bdb4",
          }}
        >
          <div style={{ display: "flex" }}>
            Members {event.memberPriceLabel} · Guests {event.guestPriceLabel}
          </div>
          <div style={{ display: "flex", color: "#c9a227" }}>7 PM – Midnight</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
