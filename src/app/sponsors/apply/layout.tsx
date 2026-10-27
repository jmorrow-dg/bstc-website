import type { Metadata } from "next";

// The apply page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Apply to Sponsor",
  description:
    "Apply to sponsor Bali Startup & Tech events. Tell us about your company and goals and we'll reply within 48 hours with a partnership proposal.",
  alternates: { canonical: "/sponsors/apply" },
};

export default function SponsorApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
