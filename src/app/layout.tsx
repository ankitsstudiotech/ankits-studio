import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MockModeIndicator } from "@/components/MockModeIndicator";
import { baseMetadata } from "@/lib/metadata";
import "./globals.css";

// Geist Sans/Mono are a functional starting point, not a final choice — see
// docs/DESIGN-DIRECTION.md ("final family selection is a Phase 1 task",
// owned by the design-tokens track).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-ink focus:shadow-lg"
        >
          Skip to main content
        </a>
        <MockModeIndicator />
        {/* A plain wrapper, not <main> — each page owns its own <main>
            landmark (see src/app/page.tsx) so this never produces nested
            <main> elements. */}
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
