export const BADGE_TYPES = [
  'first_stake', '365_day', 'bpd',
  'shrimp', 'fish', 'dolphin', 'shark', 'whale',
] as const;

export type BadgeType = (typeof BADGE_TYPES)[number];

export const MILESTONE_BADGES: BadgeType[] = ['first_stake', '365_day', 'bpd'];
export const TIER_BADGES: BadgeType[] = ['shrimp', 'fish', 'dolphin', 'shark', 'whale'];

// Tier thresholds in HELIX (human-readable) — for display
export const TIER_THRESHOLDS_DISPLAY: Record<string, number> = {
  shrimp: 1_000,
  fish: 10_000,
  dolphin: 100_000,
  shark: 1_000_000,
  whale: 10_000_000,
};

// Tier thresholds in base units (8 decimals) — for on-chain comparison
export const TIER_THRESHOLDS: Record<string, string> = {
  shrimp:  '100000000000',
  fish:    '1000000000000',
  dolphin: '10000000000000',
  shark:   '100000000000000',
  whale:   '1000000000000000',
};

export const BADGE_NAMES: Record<BadgeType, string> = {
  first_stake: 'First Stake',
  '365_day': '365-Day Staker',
  bpd: 'Big Pay Day',
  shrimp: 'Shrimp',
  fish: 'Fish',
  dolphin: 'Dolphin',
  shark: 'Shark',
  whale: 'Whale',
};

export const BADGE_DESCRIPTIONS: Record<BadgeType, string> = {
  first_stake: 'Created your first HELIX stake',
  '365_day': 'Completed a stake of 365+ days',
  bpd: 'Received a Big Pay Day distribution',
  shrimp: 'Staked 1,000+ HELIX in a single stake',
  fish: 'Staked 10,000+ HELIX in a single stake',
  dolphin: 'Staked 100,000+ HELIX in a single stake',
  shark: 'Staked 1,000,000+ HELIX in a single stake',
  whale: 'Staked 10,000,000+ HELIX in a single stake',
};

export const BADGE_REQUIREMENTS: Record<BadgeType, string> = {
  first_stake: 'Create at least one stake',
  '365_day': 'Complete a stake with 365+ day commitment',
  bpd: 'Have an active stake during a BPD event',
  shrimp: 'Stake >= 1,000 HELIX',
  fish: 'Stake >= 10,000 HELIX',
  dolphin: 'Stake >= 100,000 HELIX',
  shark: 'Stake >= 1,000,000 HELIX',
  whale: 'Stake >= 10,000,000 HELIX',
};

// Tier badge color palette (per CONTEXT.md)
export const TIER_COLORS: Record<string, { primary: string; secondary: string; label: string }> = {
  shrimp:  { primary: '#9CA3AF', secondary: '#6B7280', label: 'gray' },    // gray
  fish:    { primary: '#60A5FA', secondary: '#3B82F6', label: 'blue' },    // blue
  dolphin: { primary: '#34D399', secondary: '#10B981', label: 'green' },   // green
  shark:   { primary: '#FB923C', secondary: '#F97316', label: 'orange' },  // orange
  whale:   { primary: '#FBBF24', secondary: '#F59E0B', label: 'gold' },    // gold
};

// Milestone badge color: HELIX brand purple
export const MILESTONE_COLOR = { primary: '#A78BFA', secondary: '#7C3AED' }; // helix-400/helix-600
