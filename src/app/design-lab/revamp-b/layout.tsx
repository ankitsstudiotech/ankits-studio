import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import { designLabRevampRobots } from "../design-lab-robots";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--rb-display",
  display: "swap",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--rb-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revamp B · Studio Pulse · Design lab",
  robots: designLabRevampRobots,
};

export default function RevampBLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${display.variable} ${sans.variable}`}
      data-prototype-fonts="studio-pulse"
    >
      {children}
    </div>
  );
}
