import { describe, it, expect } from 'vitest';
import BN from 'bn.js';
import {
  formatHelix,
  formatHelixCompact,
  parseHelix,
  formatBps,
  formatDays,
  formatTShares,
  truncateAddress
} from './format';
import { TOKEN_DECIMALS, TSHARE_DISPLAY_FACTOR } from '@/lib/solana/constants';

const DECIMALS_FACTOR = new BN(10).pow(new BN(TOKEN_DECIMALS));

describe('formatHelix', () => {
  it('formats zero correctly', () => {
    expect(formatHelix(new BN(0))).toBe('0.00 HELIX');
  });

  it('formats small amounts correctly', () => {
    // 0.5 HELIX
    const amount = new BN(50_000_000);
    expect(formatHelix(amount)).toBe('0.50 HELIX');
  });

  it('formats whole numbers correctly', () => {
    // 100 HELIX
    const amount = new BN(100).mul(DECIMALS_FACTOR);
    expect(formatHelix(amount)).toBe('100.00 HELIX');
  });

  it('formats large numbers with commas', () => {
    // 1,000,000 HELIX
    const amount = new BN(1_000_000).mul(DECIMALS_FACTOR);
    expect(formatHelix(amount)).toBe('1,000,000.00 HELIX');
  });

  it('trims trailing zeros but keeps 2 decimal places', () => {
    // 1.50000000 -> 1.50
    const amount = new BN(150_000_000);
    expect(formatHelix(amount)).toBe('1.50 HELIX');

    // 1.12345678 -> 1.12345678
    const exact = new BN(112_345_678);
    expect(formatHelix(exact)).toBe('1.12345678 HELIX');

    // 1.12300000 -> 1.123
    const withTrailing = new BN(112_300_000);
    expect(formatHelix(withTrailing)).toBe('1.123 HELIX');
  });

  it('handles negative numbers', () => {
    const amount = new BN(-150_000_000);
    expect(formatHelix(amount)).toBe('-1.50 HELIX');
  });

  it('respects showSymbol parameter', () => {
    const amount = new BN(150_000_000);
    expect(formatHelix(amount, false)).toBe('1.50');
  });
});

describe('formatHelixCompact', () => {
  it('formats small amounts normally', () => {
    const amount = new BN(500).mul(DECIMALS_FACTOR);
    expect(formatHelixCompact(amount)).toBe('500.00');
  });

  it('formats thousands (K)', () => {
    const amount = new BN(1_500).mul(DECIMALS_FACTOR);
    expect(formatHelixCompact(amount)).toBe('1.50K');

    const amount2 = new BN(250_000).mul(DECIMALS_FACTOR);
    expect(formatHelixCompact(amount2)).toBe('250.00K');
  });

  it('formats millions (M)', () => {
    const amount = new BN(1_500_000).mul(DECIMALS_FACTOR);
    expect(formatHelixCompact(amount)).toBe('1.50M');
  });

  it('formats billions (B)', () => {
    const amount = new BN(1_500_000_000).mul(DECIMALS_FACTOR);
    expect(formatHelixCompact(amount)).toBe('1.50B');
  });

  it('handles small fractional amounts correctly', () => {
    // 42.00000000
    const amount = new BN(42).mul(DECIMALS_FACTOR);
    expect(formatHelixCompact(amount)).toBe('42.00');
  });
});

describe('parseHelix', () => {
  it('parses integers correctly', () => {
    expect(parseHelix('100').toString()).toBe(new BN(100).mul(DECIMALS_FACTOR).toString());
  });

  it('parses decimals correctly', () => {
    // 1.5 -> 150_000_000
    expect(parseHelix('1.5').toString()).toBe('150000000');
  });

  it('handles empty strings and dots', () => {
    expect(parseHelix('').toString()).toBe('0');
    expect(parseHelix('.').toString()).toBe('0');
    expect(parseHelix('   ').toString()).toBe('0');
  });

  it('truncates extra decimals', () => {
    // 1.123456789 -> 1.12345678 (8 decimals max)
    const expected = new BN(112_345_678);
    expect(parseHelix('1.123456789').toString()).toBe(expected.toString());
  });

  it('throws on invalid format', () => {
    expect(() => parseHelix('1.2.3')).toThrow('Invalid number format');
  });
});

describe('formatBps', () => {
  it('formats basis points correctly', () => {
    expect(formatBps(5000)).toBe('50.00%');
    expect(formatBps(100)).toBe('1.00%');
    expect(formatBps(0)).toBe('0.00%');
  });
});

describe('formatDays', () => {
  it('formats single day', () => {
    expect(formatDays(1)).toBe('1 day');
  });

  it('formats multiple days', () => {
    expect(formatDays(10)).toBe('10 days');
  });

  it('formats years', () => {
    expect(formatDays(365)).toBe('1 year');
    expect(formatDays(730)).toBe('2 years');
    expect(formatDays(1825)).toBe('5 years');
    expect(formatDays(500)).toBe('1.4 years');
  });
});

describe('formatTShares', () => {
  it('formats zero correctly', () => {
    expect(formatTShares(new BN(0))).toBe('0');
  });

  it('scales down by TSHARE_DISPLAY_FACTOR', () => {
    // 100 * 10^12 -> 100.00
    const amount = new BN(100).mul(TSHARE_DISPLAY_FACTOR);
    expect(formatTShares(amount)).toBe('100.00');
  });

  it('uses compact notation for large values', () => {
    // 1000 * 10^12 -> 1.00K
    const amount = new BN(1000).mul(TSHARE_DISPLAY_FACTOR);
    expect(formatTShares(amount)).toBe('1.00K');

    // 1,000,000 * 10^12 -> 1.00M
    const amount2 = new BN(1_000_000).mul(TSHARE_DISPLAY_FACTOR);
    expect(formatTShares(amount2)).toBe('1.00M');
  });
});

describe('truncateAddress', () => {
  it('truncates long address', () => {
    expect(truncateAddress('AbCdEfGhIjKlMnOpQrStUvWxYz123456789')).toBe('AbCd...6789');
  });

  it('returns short address as is', () => {
    expect(truncateAddress('12345678')).toBe('12345678');
  });
});
