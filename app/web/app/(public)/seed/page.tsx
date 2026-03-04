import type { Metadata } from "next";
import { SeedHero } from "@/components/marketing/seed-hero";
import { SeedWhatIs } from "@/components/marketing/seed-what-is";
import { SeedBoostExplain } from "@/components/marketing/seed-boost-explain";
import { SeedSolFlow } from "@/components/marketing/seed-sol-flow";
import { SeedHeadroom } from "@/components/marketing/seed-headroom";
import { SeedCta } from "@/components/marketing/seed-cta";

export const metadata: Metadata = {
  title: "HELIX Seed Launch — Fund the Liquidity Pool",
  description:
    "The seed token funds the HLX/SOL liquidity pool. Hold seed tokens when you stake HELIX and earn a permanent 10% APY boost on every reward claim.",
  openGraph: {
    title: "HELIX Seed Launch — Fund the Liquidity Pool",
    description:
      "The seed token funds the HLX/SOL liquidity pool. Hold seed tokens when you stake HELIX and earn a permanent 10% APY boost.",
    siteName: "HELIX Protocol",
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HELIX Seed Launch — Fund the Liquidity Pool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HELIX Seed Launch — Fund the Liquidity Pool",
    description:
      "The seed token funds the HLX/SOL liquidity pool. Hold seed tokens when you stake HELIX and earn a permanent 10% APY boost.",
    images: ["/brand/og-image.jpg"],
  },
};

export const revalidate = 86400; // Daily revalidation — pure content page

export default function SeedLaunchPage() {
  return (
    <>
      <SeedHero />
      <SeedWhatIs />
      <SeedBoostExplain />
      <SeedSolFlow />
      <SeedHeadroom />
      <SeedCta />
    </>
  );
}
