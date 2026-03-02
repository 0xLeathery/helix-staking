import { describe, it, expect } from 'vitest';
import BN from 'bn.js';
import {
  formatHelix,
  formatHelixCompact,
  parseHelix,
  formatTShares,
  formatDays,
  formatBps,
  truncateAddress,
} from '@/lib/utils/format';
import { TSHARE_DISPLAY_FACTOR } from '@/lib/solana/constants';

describe('formatHelix', () => {
  it('formats zero correctly', () => {
    expect(formatHelix(new BN(0))).toBe('0.00 HELIX');
  });

  it('formats 1 HELIX (100_000_000 base units)', () => {
    expect(formatHelix(new BN('100000000'))).toBe('1.00 HELIX');
  });

  it('formats 1.5 HELIX (150_000_000 base units)', () => {
    expect(formatHelix(new BN('150000000'))).toBe('1.50 HELIX');
  });

  it('formats without symbol when showSymbol=false', () => {
    const result = formatHelix(new BN('100000000'), false);
    expect(result).toBe('1.00');
    expect(result).not.toContain('HELIX');
  });

  it('formats large amounts with commas', () => {
    // 1,000 HELIX = 100_000_000_000 base units
    const result = formatHelix(new BN('100000000000'));
    expect(result).toContain(',');
    expect(result).toContain('1,000');
  });

  it('formats negative amounts with minus sign', () => {
    const result = formatHelix(new BN('-100000000'));
    expect(result).toContain('-');
    expect(result).toContain('1.00');
  });

  it('trims trailing zeros after 2 decimal places', () => {
    // 1.50000000 -> "1.50 HELIX"
    const result = formatHelix(new BN('150000000'));
    expect(result).toBe('1.50 HELIX');
  });

  it('preserves significant decimal places', () => {
    // 1.12345678 HELIX
    const result = formatHelix(new BN('112345678'));
    expect(result).toBe('1.12345678 HELIX');
  });
});

describe('formatTShares', () => {
  it('returns "0" for zero', () => {
    expect(formatTShares(new BN(0))).toBe('0');
  });

  it('formats small T-shares with 2 decimal places', () => {
    // 100 display T-shares = 100 * TSHARE_DISPLAY_FACTOR
    const amount = new BN(100).mul(TSHARE_DISPLAY_FACTOR);
    const result = formatTShares(amount);
    expect(result).toContain('100');
  });

  it('formats large T-shares in K notation', () => {
    // 2000 display T-shares
    const amount = new BN(2000).mul(TSHARE_DISPLAY_FACTOR);
    const result = formatTShares(amount);
    expect(result).toContain('K');
  });

  it('formats very large T-shares in M notation', () => {
    // 2,000,000 display T-shares
    const amount = new BN(2_000_000).mul(TSHARE_DISPLAY_FACTOR);
    const result = formatTShares(amount);
    expect(result).toContain('M');
  });
});

describe('formatDays', () => {
  it('formats 0 days as "0 days"', () => {
    expect(formatDays(0)).toBe('0 days');
  });

  it('formats 1 day as "1 day" (singular)', () => {
    expect(formatDays(1)).toBe('1 day');
  });

  it('formats 2 days as "2 days" (plural)', () => {
    expect(formatDays(2)).toBe('2 days');
  });

  it('formats 365 days as "1 year"', () => {
    expect(formatDays(365)).toBe('1 year');
  });

  it('formats 730 days as "2 years"', () => {
    expect(formatDays(730)).toBe('2 years');
  });

  it('formats 5555 days with .x notation', () => {
    const result = formatDays(5555);
    expect(result).toContain('years');
    expect(result).toContain('15');
  });

  it('formats non-integer years with decimal', () => {
    const result = formatDays(400); // 400/365 ≈ 1.1 years
    expect(result).toContain('year');
    expect(result).toMatch(/\d+\.\d/); // has decimal
  });
});

describe('formatBps', () => {
  it('formats 0 bps as "0.00%"', () => {
    expect(formatBps(0)).toBe('0.00%');
  });

  it('formats 100 bps as "1.00%"', () => {
    expect(formatBps(100)).toBe('1.00%');
  });

  it('formats 10000 bps as "100.00%"', () => {
    expect(formatBps(10000)).toBe('100.00%');
  });

  it('formats 5000 bps as "50.00%"', () => {
    expect(formatBps(5000)).toBe('50.00%');
  });

  it('formats 1 bps as "0.01%"', () => {
    expect(formatBps(1)).toBe('0.01%');
  });
});

describe('formatHelixCompact', () => {
  it('formats small amounts without suffix', () => {
    const result = formatHelixCompact(new BN('100000000')); // 1 HELIX
    expect(result).toMatch(/\d+\.\d\d/);
    expect(result).not.toContain('K');
    expect(result).not.toContain('M');
    expect(result).not.toContain('B');
  });

  it('formats thousands with K suffix', () => {
    // 5000 HELIX = 5000 * 10^8 = 500_000_000_000
    const result = formatHelixCompact(new BN('500000000000'));
    expect(result).toContain('K');
  });

  it('formats millions with M suffix', () => {
    // 2_000_000 HELIX = 2_000_000 * 10^8
    const result = formatHelixCompact(new BN('200000000000000'));
    expect(result).toContain('M');
  });

  it('formats billions with B suffix', () => {
    // 2B HELIX = 2_000_000_000 * 10^8
    const result = formatHelixCompact(new BN('200000000000000000'));
    expect(result).toContain('B');
  });

  it('formats zero', () => {
    const result = formatHelixCompact(new BN(0));
    expect(result).toBe('0.00');
  });
});

describe('parseHelix', () => {
  it('parses empty string as 0', () => {
    expect(parseHelix('').toString()).toBe('0');
  });

  it('parses "." as 0', () => {
    expect(parseHelix('.').toString()).toBe('0');
  });

  it('parses whole number', () => {
    expect(parseHelix('1').toString()).toBe('100000000');
  });

  it('parses decimal with 2 places', () => {
    expect(parseHelix('1.50').toString()).toBe('150000000');
  });

  it('parses decimal with full 8 places', () => {
    expect(parseHelix('1.12345678').toString()).toBe('112345678');
  });

  it('truncates extra decimal places', () => {
    // 9 decimal places -> truncate to 8
    expect(parseHelix('1.123456789').toString()).toBe('112345678');
  });

  it('parses integer without decimal', () => {
    expect(parseHelix('100').toString()).toBe('10000000000');
  });

  it('throws on invalid format (multiple dots)', () => {
    expect(() => parseHelix('1.2.3')).toThrow();
  });
});

describe('truncateAddress', () => {
  it('returns address unchanged if <= 8 chars', () => {
    expect(truncateAddress('AbCd1234')).toBe('AbCd1234');
  });

  it('truncates long address to first 4 + last 4 chars', () => {
    const result = truncateAddress('AbCdEfGhIjKlMnOpQrStUvWxYz123456789');
    expect(result).toBe('AbCd...6789');
  });

  it('truncates standard 44-char Solana address', () => {
    const addr = 'So11111111111111111111111111111111111111112';
    const result = truncateAddress(addr);
    expect(result).toMatch(/^So11\.\.\.1112$/);
  });
});
