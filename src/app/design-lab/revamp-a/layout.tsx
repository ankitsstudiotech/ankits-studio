import { DM_Sans, Instrument_Serif } from "next/font/google";
import type { Metadata } from "next";
import { designLabRevampRobots } from "../design-lab-robots";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--ra-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--ra-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revamp A · Kinetic Editorial · Design lab",
  robots: designLabRevampRobots,
};

export default function RevampALayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${display.variable} ${sans.variable}`}
      data-prototype-fonts="kinetic-editorial"
    >
      {children}
    </div>
  );
}
