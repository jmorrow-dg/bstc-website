import type { Metadata } from "next";
import { Archivo, Big_Shoulders_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import MotionProvider from "@/components/layout/MotionProvider";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";
import WhatsAppCTA from "@/components/ui/WhatsAppCTA";
import { SITE } from "@/lib/constants";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";
import "./globals.css";
import "./season.css";

// Global league type: Archivo for text, Big Shoulders Display for display.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
});

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.fullName} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.fullName,
    title: `${SITE.fullName} | ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.fullName,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // No site-wide canonical here: a canonical set in the root layout is
  // inherited by every page that doesn't override it, which canonicalised
  // every page to the homepage. Each route sets its own self-referencing
  // `alternates.canonical` (resolved against metadataBase).
  alternates: {
    types: {
      "application/rss+xml": `${SITE.url}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${bigShoulders.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              getOrganizationSchema(),
              getWebSiteSchema(),
            ]),
          }}
        />
      </head>
      <body className="font-body antialiased bg-brand-paper text-brand-navy">
        <MotionProvider>
          <a className="gl-skip" href="#main">
            Skip to content
          </a>
          <Navbar />
          <ReadingProgress />
          <main id="main" className="min-h-screen">
            <PageTransition>{children}</PageTransition>
          </main>
          <ScrollToTop />
          <WhatsAppCTA />
          <Footer />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
