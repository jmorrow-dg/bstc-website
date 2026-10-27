import type { Metadata } from "next";

// The contact page is a client component, so its metadata lives here.
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bali Startup & Tech: questions about events, speaking at How I AI, sponsoring, partnering or joining the community in Bali.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
