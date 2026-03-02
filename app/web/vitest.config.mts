import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally for @solana/* packages
if (typeof globalThis.Buffer === 'undefined') {
  (globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer;
}

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  define: {
    'global.Buffer': 'Buffer',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      // Scope coverage to the specific files that have tests written for them.
      // Async Server Components (page.tsx) and complex transaction mutation
      // hooks are excluded — they are covered by Playwright E2E (TEST-05/06).
      include: [
        'lib/solana/math.ts',
        'lib/solana/compute-budget.ts',
        'lib/solana/pdas.ts',
        'lib/solana/constants.ts',
        'lib/utils/format.ts',
        'lib/hooks/useGlobalState.ts',
        'lib/hooks/useStakes.ts',
        'lib/hooks/useTokenBalance.ts',
        'lib/hooks/useTransactionSimulation.ts',
        'components/dashboard/protocol-paused-banner.tsx',
        'components/stake/stake-card.tsx',
        'components/stake/penalty-calculator.tsx',
        'components/stake/bonus-preview.tsx',
        'components/dashboard/portfolio-summary.tsx',
        'components/dashboard/notification-settings.tsx',
        'components/dashboard/referral-stats-panel.tsx',
        'components/badges/badge-card.tsx',
        'lib/badges/badge-types.ts',
        'lib/cn.ts',
      ],
      exclude: [
        '**/*.test.*', '**/*.spec.*', '**/node_modules/**',
        'e2e/**', 'lib/testing/**', '**/*.d.ts',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80 },
    },
  },
});
