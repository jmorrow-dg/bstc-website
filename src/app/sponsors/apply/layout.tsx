import type { Metadata } from "next";

// The apply page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Apply to Sponsor",
  alternates: { canonical: "/sponsors/apply" },
};

export default function SponsorApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
