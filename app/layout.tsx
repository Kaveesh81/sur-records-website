import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Noto_Serif_Devanagari } from "next/font/google";
import { site } from "@/lib/content";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

/**
 * Fonts are self-hosted by next/font — no render-blocking request to Google,
 * and the size-adjust metrics it injects prevent layout shift on swap.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-jb",
  display: "swap",
});

const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "600"],
  variable: "--font-deva",
  display: "swap",
});

/**
 * Update this to your real domain before launch — it makes social share
 * previews resolve correctly.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://surrecords.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description:
    "An independent record label for singers, composers and producers building the next era of Indian music. Open call for artists — send us your voice.",
  keywords: [
    "record label",
    "Indian music label",
    "independent record label India",
    "singer submission",
    "music composer opportunities",
    "artist signing",
    "Sur Records",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description:
      "A home for singers, composers and producers. Classical roots, modern pulse. Open call for artists.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description:
      "A home for singers, composers and producers. Open call for artists.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0a0f",
  width: "device-width",
  initialScale: 1,
  // Zoom is deliberately NOT disabled — capping it breaks low-vision access.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} ${devanagari.variable}`}
    >
      <body>
        {/* Keyboard users land here first. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>

        <SmoothScroll />
        {children}

        {/* Film grain sits above everything, pointer-events: none. */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
