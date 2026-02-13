import { describe, it, expect } from "vitest";
import BN from "bn.js";
import { formatBps, formatDays, formatTShares } from "./format";
import { TSHARE_DISPLAY_FACTOR } from "@/lib/solana/constants";

describe("Format Utils", () => {
  describe("formatBps", () => {
    it("should format basis points as percentage string", () => {
      expect(formatBps(5000)).toBe("50.00%");
      expect(formatBps(0)).toBe("0.00%");
      expect(formatBps(10000)).toBe("100.00%");
      expect(formatBps(1234)).toBe("12.34%");
      expect(formatBps(5)).toBe("0.05%");
    });
  });

  describe("formatDays", () => {
    it("should format days correctly", () => {
      expect(formatDays(1)).toBe("1 day");
      expect(formatDays(10)).toBe("10 days");
      expect(formatDays(364)).toBe("364 days");
    });

    it("should format years correctly", () => {
      expect(formatDays(365)).toBe("1 year");
      expect(formatDays(730)).toBe("2 years");
      expect(formatDays(1825)).toBe("5 years");
    });

    it("should format fractional years correctly", () => {
      // 547 / 365 = 1.498... -> 1.5
      expect(formatDays(547)).toBe("1.5 years");
    });
  });

  describe("formatTShares", () => {
    it("should format zero T-Shares", () => {
      expect(formatTShares(new BN(0))).toBe("0");
    });

    it("should format small T-Shares", () => {
      // 100 * 10^12
      const amount = new BN(100).mul(TSHARE_DISPLAY_FACTOR);
      expect(formatTShares(amount)).toBe("100.00");

      // 1 * 10^12
      const amountOne = new BN(1).mul(TSHARE_DISPLAY_FACTOR);
      expect(formatTShares(amountOne)).toBe("1.00");
    });

    it("should format fractional T-Shares", () => {
      // 1.5 * 10^12
      const amount = new BN(150).mul(TSHARE_DISPLAY_FACTOR).div(new BN(100));
      expect(formatTShares(amount)).toBe("1.50");
    });

    it("should format fractional T-Shares with leading zero in decimal", () => {
      // 1.05 * 10^12
      const amount = new BN(105).mul(TSHARE_DISPLAY_FACTOR).div(new BN(100));
      expect(formatTShares(amount)).toBe("1.05");
    });

    it("should format K notation", () => {
      // 1500 * 10^12
      const amount = new BN(1500).mul(TSHARE_DISPLAY_FACTOR);
      expect(formatTShares(amount)).toBe("1.50K");

      // 1000 * 10^12
      const amount1000 = new BN(1000).mul(TSHARE_DISPLAY_FACTOR);
      expect(formatTShares(amount1000)).toBe("1.00K");
    });

    it("should format M notation", () => {
      // 1,500,000 * 10^12
      const amount = new BN(1_500_000).mul(TSHARE_DISPLAY_FACTOR);
      expect(formatTShares(amount)).toBe("1.50M");

      // 1,000,000 * 10^12
      const amountMillion = new BN(1_000_000).mul(TSHARE_DISPLAY_FACTOR);
      expect(formatTShares(amountMillion)).toBe("1.00M");
    });
  });
});
