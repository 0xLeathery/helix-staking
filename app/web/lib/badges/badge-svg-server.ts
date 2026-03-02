/**
 * Server-side SVG badge generation for HELIX Achievement Badges.
 * Node.js only — no DOM or browser APIs used.
 * Returns data URIs for use in NFT metadata.
 */

import { type BadgeType, TIER_COLORS, MILESTONE_COLOR, MILESTONE_BADGES } from './badge-types';

interface BadgeData {
  wallet: string;
  claimDate: string;
  stakeAmount?: string;
}

// ---------- helpers ----------

function truncateWallet(wallet: string): string {
  if (wallet.length <= 8) return wallet;
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}

function formatAmount(amount: string): string {
  // Convert base-unit string (8 decimals) to human-readable with commas
  const raw = BigInt(amount);
  const whole = raw / BigInt(100_000_000);
  return whole.toLocaleString('en-US');
}

function getColors(badgeType: BadgeType): { primary: string; secondary: string } {
  if (MILESTONE_BADGES.includes(badgeType as (typeof MILESTONE_BADGES)[number])) {
    return MILESTONE_COLOR;
  }
  return TIER_COLORS[badgeType] ?? MILESTONE_COLOR;
}

/**
 * Returns SVG <path> or <polygon> data for the inner motif of each badge type.
 * All shapes are centered in a 400x400 viewBox.
 */
function getShape(badgeType: BadgeType, primary: string, secondary: string): string {
  switch (badgeType) {
    // --- Milestone badges: hexagonal motif ---
    case 'first_stake':
      return `
        <polygon points="200,110 270,152 270,238 200,280 130,238 130,152"
                 fill="none" stroke="${primary}" stroke-width="5" opacity="0.9"/>
        <polygon points="200,130 255,162 255,228 200,260 145,228 145,162"
                 fill="${primary}" opacity="0.15"/>
        <text x="200" y="212" text-anchor="middle" fill="${primary}"
              font-size="42" font-family="monospace" font-weight="bold">✦</text>`;

    case '365_day':
      return `
        <polygon points="200,100 278,148 278,244 200,292 122,244 122,148"
                 fill="none" stroke="${primary}" stroke-width="4" opacity="0.9"/>
        <polygon points="200,120 262,154 262,238 200,272 138,238 138,154"
                 fill="none" stroke="${secondary}" stroke-width="2" opacity="0.6"/>
        <text x="200" y="217" text-anchor="middle" fill="${primary}"
              font-size="34" font-family="sans-serif" font-weight="bold">365</text>`;

    case 'bpd':
      return `
        <polygon points="200,105 275,150 275,240 200,285 125,240 125,150"
                 fill="none" stroke="${primary}" stroke-width="5" opacity="0.9"/>
        <polygon points="200,125 260,160 260,232 200,265 140,232 140,160"
                 fill="${primary}" opacity="0.12"/>
        <text x="200" y="210" text-anchor="middle" fill="${primary}"
              font-size="40" font-family="monospace" font-weight="bold">$</text>`;

    // --- Tier badges: shape complexity scales with tier ---
    case 'shrimp':
      // Simple circle
      return `
        <circle cx="200" cy="200" r="70" fill="none" stroke="${primary}" stroke-width="5" opacity="0.9"/>
        <circle cx="200" cy="200" r="52" fill="${primary}" opacity="0.15"/>
        <circle cx="200" cy="200" r="18" fill="${primary}" opacity="0.6"/>`;

    case 'fish':
      // Diamond
      return `
        <polygon points="200,128 258,200 200,272 142,200"
                 fill="none" stroke="${primary}" stroke-width="5" opacity="0.9"/>
        <polygon points="200,148 242,200 200,252 158,200"
                 fill="${primary}" opacity="0.15"/>
        <circle cx="200" cy="200" r="16" fill="${primary}" opacity="0.6"/>`;

    case 'dolphin':
      // Triangle / upward arrow
      return `
        <polygon points="200,118 268,258 132,258"
                 fill="none" stroke="${primary}" stroke-width="5" opacity="0.9"/>
        <polygon points="200,138 254,248 146,248"
                 fill="${primary}" opacity="0.15"/>
        <polygon points="200,160 230,230 170,230"
                 fill="${primary}" opacity="0.4"/>`;

    case 'shark':
      // 8-point star
      return `
        <polygon points="200,118 214,162 258,162 222,190 234,234 200,208 166,234 178,190 142,162 186,162"
                 fill="none" stroke="${primary}" stroke-width="4" opacity="0.9"/>
        <polygon points="200,132 212,168 248,168 220,188 230,224 200,204 170,224 180,188 152,168 188,168"
                 fill="${primary}" opacity="0.15"/>
        <circle cx="200" cy="188" r="16" fill="${primary}" opacity="0.5"/>`;

    case 'whale':
      // Multi-layered polygon (most elaborate)
      return `
        <polygon points="200,108 228,160 282,168 240,208 250,262 200,236 150,262 160,208 118,168 172,160"
                 fill="none" stroke="${primary}" stroke-width="5" opacity="0.9"/>
        <polygon points="200,124 224,168 272,176 236,210 245,258 200,234 155,258 164,210 128,176 176,168"
                 fill="${primary}" opacity="0.12"/>
        <polygon points="200,148 216,178 250,184 226,208 232,242 200,226 168,242 174,208 150,184 184,178"
                 fill="${primary}" opacity="0.2"/>
        <circle cx="200" cy="196" r="14" fill="${primary}" opacity="0.55"/>`;

    default:
      return `<circle cx="200" cy="200" r="60" fill="${primary}" opacity="0.3"/>`;
  }
}

// ---------- main export ----------

export function generateBadgeSvg(badgeType: BadgeType, data: BadgeData): string {
  const { primary, secondary } = getColors(badgeType);
  const shape = getShape(badgeType, primary, secondary);
  const walletShort = truncateWallet(data.wallet);
  const claimDateStr = data.claimDate.slice(0, 10); // YYYY-MM-DD

  const amountLine = data.stakeAmount
    ? `<text x="200" y="356" text-anchor="middle" fill="${primary}" font-size="13" font-family="sans-serif" opacity="0.85">${formatAmount(data.stakeAmount)} HELIX staked</text>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${primary}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="400" height="400" rx="24" fill="url(#bg)"/>

  <!-- Outer ring -->
  <circle cx="200" cy="200" r="168" fill="none" stroke="${secondary}" stroke-width="2" opacity="0.4"/>
  <circle cx="200" cy="200" r="160" fill="none" stroke="${primary}" stroke-width="3" opacity="0.7"/>

  <!-- Ambient glow -->
  <circle cx="200" cy="200" r="130" fill="url(#glow)" filter="url(#blur)"/>

  <!-- Inner motif -->
  ${shape}

  <!-- Badge name -->
  <text x="200" y="52" text-anchor="middle"
        fill="${primary}" font-size="20" font-family="sans-serif" font-weight="bold"
        letter-spacing="2" opacity="0.95">HELIX ACHIEVEMENT</text>

  <!-- Badge type label -->
  <text x="200" y="330" text-anchor="middle"
        fill="white" font-size="22" font-family="sans-serif" font-weight="bold"
        letter-spacing="1" opacity="0.9">
    ${BADGE_TYPE_LABELS[badgeType] ?? badgeType}
  </text>

  <!-- Claim date -->
  <text x="200" y="354" text-anchor="middle"
        fill="${secondary}" font-size="12" font-family="sans-serif" opacity="0.8">
    Claimed ${claimDateStr}
  </text>

  <!-- Stake amount (tier badges only) -->
  ${amountLine}

  <!-- Wallet address -->
  <text x="200" y="388" text-anchor="middle"
        fill="white" font-size="11" font-family="monospace" opacity="0.45">${walletShort}</text>
</svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Human-readable labels used in the SVG
const BADGE_TYPE_LABELS: Record<BadgeType, string> = {
  first_stake: 'FIRST STAKE',
  '365_day': '365-DAY STAKER',
  bpd: 'BIG PAY DAY',
  shrimp: 'SHRIMP',
  fish: 'FISH',
  dolphin: 'DOLPHIN',
  shark: 'SHARK',
  whale: 'WHALE',
};
