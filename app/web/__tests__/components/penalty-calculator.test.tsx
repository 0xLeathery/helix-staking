import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BN from 'bn.js';
import { LABELS } from '@/lib/solana/constants';
import { PenaltyCalculator } from '@/components/stake/penalty-calculator';

// Use small slot numbers to avoid BN overflow in percentage calculations
// slotsPerDay=1 so each slot = 1 day for test simplicity
const SLOTS = 1;

// Keep tShares small enough that tShares*shareRate fits in safe integer
// tShares=100, shareRate=1000 -> value=100000 (safe)
const baseProps = {
  stakedAmount: new BN('1000000000'), // 10 HELIX
  startSlot: new BN(0),
  endSlot: new BN(SLOTS * 365), // 365 slot-days
  tShares: new BN('100'),          // small t-shares to avoid overflow
  currentShareRate: new BN('1000'),
  rewardDebt: new BN('99999'),     // > 100*1000=100000? No, 100*1000=100000 > 99999 -> rewards=1
  bpdBonusPending: new BN(0),
  slotsPerDay: new BN(SLOTS),
};

describe('PenaltyCalculator - early unstake', () => {
  it('shows Early Unstake status when before end slot', () => {
    render(<PenaltyCalculator {...baseProps} currentSlot={SLOTS * 10} />);
    expect(screen.getByText(LABELS.EARLY_UNSTAKE)).toBeInTheDocument();
  });

  it('shows Staked Amount in the breakdown', () => {
    render(<PenaltyCalculator {...baseProps} currentSlot={SLOTS * 10} />);
    expect(screen.getByText(/Staked Amount/i)).toBeInTheDocument();
  });

  it('shows Penalty Amount for early unstake', () => {
    render(<PenaltyCalculator {...baseProps} currentSlot={SLOTS * 10} />);
    expect(screen.getByText(/Penalty Amount/i)).toBeInTheDocument();
  });

  it('shows You Receive section', () => {
    render(<PenaltyCalculator {...baseProps} currentSlot={SLOTS * 10} />);
    expect(screen.getByText(/You Receive/i)).toBeInTheDocument();
  });

  it('shows what you staked label', () => {
    render(<PenaltyCalculator {...baseProps} currentSlot={SLOTS * 10} />);
    expect(screen.getByText(/What you staked/i)).toBeInTheDocument();
  });
});

describe('PenaltyCalculator - grace period (on-time)', () => {
  it('shows End Stake status within grace period', () => {
    // endSlot = SLOTS * 365, 7 days past = grace period (< 14 days)
    const currentSlot = SLOTS * 365 + SLOTS * 7;
    render(<PenaltyCalculator {...baseProps} currentSlot={currentSlot} />);
    expect(screen.getByText(LABELS.ON_TIME_UNSTAKE)).toBeInTheDocument();
  });

  it('does not show penalty amount in grace period', () => {
    const currentSlot = SLOTS * 365 + SLOTS * 7;
    render(<PenaltyCalculator {...baseProps} currentSlot={currentSlot} />);
    expect(screen.queryByText(/Penalty Amount/i)).not.toBeInTheDocument();
  });
});

describe('PenaltyCalculator - late unstake', () => {
  it('shows Late Unstake status after grace period', () => {
    // 30 days past end slot, well past 14-day grace
    const currentSlot = SLOTS * 365 + SLOTS * 30;
    render(<PenaltyCalculator {...baseProps} currentSlot={currentSlot} />);
    expect(screen.getByText(LABELS.LATE_UNSTAKE)).toBeInTheDocument();
  });

  it('shows days until total loss for late unstake', () => {
    const currentSlot = SLOTS * 365 + SLOTS * 30;
    render(<PenaltyCalculator {...baseProps} currentSlot={currentSlot} />);
    expect(screen.getByText(/days until total loss/i)).toBeInTheDocument();
  });

  it('shows penalty amount for late unstake', () => {
    const currentSlot = SLOTS * 365 + SLOTS * 30;
    render(<PenaltyCalculator {...baseProps} currentSlot={currentSlot} />);
    expect(screen.getByText(/Penalty Amount/i)).toBeInTheDocument();
  });
});
