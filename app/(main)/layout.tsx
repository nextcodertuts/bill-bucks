import { BottomNav } from "@/components/bottom-nav";
import Topnav from "@/components/top-nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "nextcoder - Transform Your Workforce with Enterprise Learning Solutions",
  description:
    "nextcoder offers world-class corporate training and development solutions. Empower your organization with our expert-led online courses and personalized learning experiences.",
  keywords:
    "corporate training, enterprise learning, professional development, online courses, workforce transformation",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextcoder.co.in",
    siteName: "nextcoder",
    images: [
      {
        url: "https://nextcoder.co.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "nextcoder - Enterprise Learning Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nextcoder",
    creator: "@nextcoder",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen pt-12 pb-16 bg-white">
      <Topnav />
      {children}
      <BottomNav />
    </div>
  );
}
