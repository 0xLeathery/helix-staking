import { create } from "zustand";

interface StakeWizardState {
  step: 1 | 2 | 3 | "success";
  amount: string; // User input, decimal format (e.g., "100.5")
  days: number; // 1-5555
  referrer: string | null; // base58 pubkey of referrer, null = no referrer

  setStep: (step: 1 | 2 | 3 | "success") => void;
  setAmount: (amount: string) => void;
  setDays: (days: number) => void;
  setReferrer: (referrer: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: 1 as const,
  amount: "",
  days: 365,
  referrer: null as string | null,
};

/**
 * Zustand store for stake creation wizard UI state.
 *
 * This is UI-only state and does NOT duplicate on-chain data.
 * State is cleared on wizard completion or unmount.
 */
export const useStakeWizard = create<StakeWizardState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setAmount: (amount) => set({ amount }),
  setDays: (days) => {
    // Validate days is an integer 1-5555
    const clamped = Math.max(1, Math.min(5555, Math.floor(days)));
    set({ days: clamped });
  },
  setReferrer: (referrer) => set({ referrer }),
  reset: () => set(initialState),
}));
