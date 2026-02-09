import BN from "bn.js";
import { TOKEN_DECIMALS, TSHARE_DISPLAY_FACTOR } from "@/lib/solana/constants";

const ZERO = new BN(0);
const DECIMALS_FACTOR = new BN(10).pow(new BN(TOKEN_DECIMALS)); // 10^8

/**
 * Format a token amount (BN in base units) for display.
 * Example: BN(100_000_000) -> "1.00 HELIX"
 *
 * Trims trailing zeros but keeps at least 2 decimal places.
 */
export function formatHelix(amount: BN, showSymbol = true): string {
  const isNeg = amount.isNeg();
  const abs = isNeg ? amount.abs() : amount;

  const whole = abs.div(DECIMALS_FACTOR);
  const remainder = abs.mod(DECIMALS_FACTOR);

  // Pad remainder to TOKEN_DECIMALS digits
  const decimalStr = remainder.toString(10).padStart(TOKEN_DECIMALS, "0");

  // Trim trailing zeros but keep at least 2 decimal places
  let trimmed = decimalStr;
  while (trimmed.length > 2 && trimmed.endsWith("0")) {
    trimmed = trimmed.slice(0, -1);
  }

  const sign = isNeg ? "-" : "";
  const formatted = `${sign}${addCommas(whole.toString(10))}.${trimmed}`;
  return showSymbol ? `${formatted} HELIX` : formatted;
}

/**
 * Format token amount in compact notation for large numbers.
 * Examples: 1,500,000 -> "1.50M", 250,000 -> "250.00K", 42 -> "42.00"
 */
export function formatHelixCompact(amount: BN): string {
  // Convert to a floating-point-like representation for compact display
  const whole = amount.div(DECIMALS_FACTOR);

  const ONE_BILLION = new BN(1_000_000_000);
  const ONE_MILLION = new BN(1_000_000);
  const ONE_THOUSAND = new BN(1_000);

  if (whole.gte(ONE_BILLION)) {
    const billions = whole.mul(new BN(100)).div(ONE_BILLION);
    const b = billions.toNumber();
    return `${(b / 100).toFixed(2)}B`;
  }

  if (whole.gte(ONE_MILLION)) {
    const millions = whole.mul(new BN(100)).div(ONE_MILLION);
    const m = millions.toNumber();
    return `${(m / 100).toFixed(2)}M`;
  }

  if (whole.gte(ONE_THOUSAND)) {
    const thousands = whole.mul(new BN(100)).div(ONE_THOUSAND);
    const k = thousands.toNumber();
    return `${(k / 100).toFixed(2)}K`;
  }

  // For small amounts, show 2 decimal places
  const rem = amount.mod(DECIMALS_FACTOR);
  const decStr = rem.toString(10).padStart(TOKEN_DECIMALS, "0").slice(0, 2);
  return `${addCommas(whole.toString(10))}.${decStr}`;
}

/**
 * Parse user input string to BN (base token units).
 * Example: "1.5" -> BN(150_000_000)
 *
 * Handles empty strings, integers, and decimals up to TOKEN_DECIMALS precision.
 */
export function parseHelix(input: string): BN {
  const trimmed = input.trim();
  if (!trimmed || trimmed === ".") {
    return ZERO;
  }

  const parts = trimmed.split(".");
  if (parts.length > 2) {
    throw new Error("Invalid number format");
  }

  const wholePart = parts[0] || "0";
  let decimalPart = parts[1] || "";

  // Truncate to TOKEN_DECIMALS precision (don't round -- match on-chain behavior)
  if (decimalPart.length > TOKEN_DECIMALS) {
    decimalPart = decimalPart.slice(0, TOKEN_DECIMALS);
  }

  // Pad decimal part to TOKEN_DECIMALS
  decimalPart = decimalPart.padEnd(TOKEN_DECIMALS, "0");

  const wholeUnits = new BN(wholePart).mul(DECIMALS_FACTOR);
  const decimalUnits = new BN(decimalPart);

  return wholeUnits.add(decimalUnits);
}

/**
 * Format basis points as percentage string.
 * Example: 5000 -> "50.00%"
 */
export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/**
 * Format days into human-readable duration.
 * Examples: 1 -> "1 day", 365 -> "365 days", 1825 -> "5.0 years"
 */
export function formatDays(days: number): string {
  if (days === 1) {
    return "1 day";
  }
  if (days < 365) {
    return `${days} days`;
  }
  const years = days / 365;
  if (Number.isInteger(years)) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  return `${years.toFixed(1)} years`;
}

/**
 * Format T-shares for display.
 * Raw on-chain T-shares are scaled down by TSHARE_DISPLAY_FACTOR (10^12) so that
 * a 10 HELIX stake ≈ 100 display T-Shares (intuitive, proportional to stake size).
 * Uses compact notation (K, M) for very large portfolios.
 */
export function formatTShares(amount: BN): string {
  if (amount.isZero()) {
    return "0";
  }

  // Scale down: divide by 10^12 with 2 decimal places
  const whole = amount.div(TSHARE_DISPLAY_FACTOR);
  const remainder = amount.mod(TSHARE_DISPLAY_FACTOR);
  // Get 2 decimal places from remainder
  const fracBN = remainder.mul(new BN(100)).div(TSHARE_DISPLAY_FACTOR);
  const frac = fracBN.toNumber();

  const wholeNum = parseFloat(whole.toString(10));

  // Compact notation for very large display values
  if (wholeNum >= 1_000_000) {
    return `${(wholeNum / 1_000_000).toFixed(2)}M`;
  }
  if (wholeNum >= 1_000) {
    return `${(wholeNum / 1_000).toFixed(2)}K`;
  }

  return `${addCommas(whole.toString(10))}.${frac.toString().padStart(2, "0")}`;
}

/**
 * Truncate a Solana address for display.
 * Example: "AbCdEfGhIjKlMnOpQrStUvWxYz123456789" -> "AbCd...6789"
 */
export function truncateAddress(address: string): string {
  if (address.length <= 8) {
    return address;
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

/**
 * Add commas to a number string for readability.
 */
function addCommas(str: string): string {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
