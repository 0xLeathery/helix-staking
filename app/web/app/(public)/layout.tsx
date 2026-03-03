import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "HELIX Protocol - Time-Locked Staking on Solana",
  description:
    "Stake HELIX tokens with time-locked commitments. Earn T-shares and claim daily inflation rewards. The longer you stake, the more you earn.",
  openGraph: {
    title: "HELIX Protocol - Time-Locked Staking on Solana",
    description:
      "Stake HELIX tokens with time-locked commitments. Earn T-shares and claim daily inflation rewards.",
    siteName: "HELIX Protocol",
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HELIX - Time-Locked Staking on Solana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HELIX Protocol - Time-Locked Staking on Solana",
    description:
      "Stake HELIX tokens with time-locked commitments. Earn T-shares and claim daily inflation rewards.",
    images: ["/brand/twitter-card.jpg"],
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
