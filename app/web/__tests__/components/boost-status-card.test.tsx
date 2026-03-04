import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BN from 'bn.js';
import { TooltipProvider } from '@/components/ui/tooltip';

// ---------------------------------------------------------------------------
// Module-level mocks
// ---------------------------------------------------------------------------

// Wallet adapter
const mockPublicKey = { toBase58: () => 'mockWalletPubkey' };
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: vi.fn(() => ({ publicKey: mockPublicKey })),
}));

// useSeedBalance
vi.mock('@/lib/hooks/useSeedBalance', () => ({
  useSeedBalance: vi.fn(() => ({ data: new BN(0), isLoading: false })),
  getSeedMintFromGlobalState: vi.fn(),
}));

// useBoostRecord
vi.mock('@/lib/hooks/useBoostRecord', () => ({
  useBoostRecord: vi.fn(() => ({ data: null, isLoading: false })),
}));

// useRegisterBoost
const mockMutate = vi.fn();
vi.mock('@/lib/hooks/useRegisterBoost', () => ({
  useRegisterBoost: vi.fn(() => ({
    mutate: mockMutate,
    isPending: false,
    error: null,
  })),
}));

// useGlobalState — boost enabled by default (reserved[7] !== 0)
vi.mock('@/lib/hooks/useGlobalState', () => ({
  useGlobalState: vi.fn(() => ({
    data: {
      reserved: Array(10).fill(new BN(0)).map((_, i) =>
        i === 7 ? new BN(1) : new BN(0)
      ),
    },
    isLoading: false,
  })),
}));

// ---------------------------------------------------------------------------
// Import mocked hooks for per-test overrides
// ---------------------------------------------------------------------------
import { useWallet } from '@solana/wallet-adapter-react';
import { useSeedBalance } from '@/lib/hooks/useSeedBalance';
import { useBoostRecord } from '@/lib/hooks/useBoostRecord';
import { useRegisterBoost } from '@/lib/hooks/useRegisterBoost';
import { useGlobalState } from '@/lib/hooks/useGlobalState';

// ---------------------------------------------------------------------------
// Import the component under test — will fail (RED) until component is created
// ---------------------------------------------------------------------------
import { BoostStatusCard } from '@/components/dashboard/boost-status-card';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// u64::MAX as BN (no stake linked yet sentinel)
const U64_MAX = new BN('18446744073709551615');

function renderCard() {
  return render(
    React.createElement(TooltipProvider, null, React.createElement(BoostStatusCard))
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('BoostStatusCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore defaults
    vi.mocked(useWallet).mockReturnValue({ publicKey: mockPublicKey } as any);
    vi.mocked(useSeedBalance).mockReturnValue({ data: new BN(0), isLoading: false } as any);
    vi.mocked(useBoostRecord).mockReturnValue({ data: null, isLoading: false } as any);
    vi.mocked(useRegisterBoost).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);
    vi.mocked(useGlobalState).mockReturnValue({
      data: {
        reserved: Array(10).fill(new BN(0)).map((_, i) =>
          i === 7 ? new BN(1) : new BN(0)
        ),
      },
      isLoading: false,
    } as any);
  });

  it('renders nothing when wallet is not connected', () => {
    vi.mocked(useWallet).mockReturnValue({ publicKey: null } as any);
    const { container } = renderCard();
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no seed balance and no boost record', () => {
    vi.mocked(useSeedBalance).mockReturnValue({ data: new BN(0), isLoading: false } as any);
    vi.mocked(useBoostRecord).mockReturnValue({ data: null, isLoading: false } as any);
    const { container } = renderCard();
    expect(container.firstChild).toBeNull();
  });

  it('renders eligible state with Register button when has seed balance but no boost record', () => {
    vi.mocked(useSeedBalance).mockReturnValue({ data: new BN(1000), isLoading: false } as any);
    vi.mocked(useBoostRecord).mockReturnValue({ data: null, isLoading: false } as any);
    renderCard();
    expect(screen.getByRole('button', { name: /register boost/i })).toBeDefined();
  });

  it('renders registered state when boost record has u64::MAX boostedStakeId', () => {
    vi.mocked(useSeedBalance).mockReturnValue({ data: new BN(1000), isLoading: false } as any);
    vi.mocked(useBoostRecord).mockReturnValue({
      data: {
        boostedStakeId: U64_MAX,
        boostRevoked: false,
      },
      isLoading: false,
    } as any);
    renderCard();
    // Should show registered/waiting state (no stake linked yet)
    expect(screen.getAllByText(/registered/i).length).toBeGreaterThan(0);
  });

  it('renders active state when boost record has real boostedStakeId', () => {
    vi.mocked(useSeedBalance).mockReturnValue({ data: new BN(1000), isLoading: false } as any);
    vi.mocked(useBoostRecord).mockReturnValue({
      data: {
        boostedStakeId: new BN(5),
        boostRevoked: false,
      },
      isLoading: false,
    } as any);
    renderCard();
    expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0);
  });

  it('renders revoked state when boost is revoked', () => {
    vi.mocked(useBoostRecord).mockReturnValue({
      data: {
        boostedStakeId: new BN(5),
        boostRevoked: true,
      },
      isLoading: false,
    } as any);
    renderCard();
    expect(screen.getAllByText(/revoked/i).length).toBeGreaterThan(0);
  });

  it('Register button is disabled while mutation is pending', () => {
    vi.mocked(useSeedBalance).mockReturnValue({ data: new BN(1000), isLoading: false } as any);
    vi.mocked(useBoostRecord).mockReturnValue({ data: null, isLoading: false } as any);
    vi.mocked(useRegisterBoost).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    } as any);
    renderCard();
    const button = screen.getByRole('button', { name: /register/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
