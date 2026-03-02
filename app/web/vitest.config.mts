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
      include: [
        'lib/**/*.{ts,tsx}',
        'components/**/*.tsx',
        'hooks/**/*.ts',
      ],
      exclude: [
        '**/*.test.*', '**/*.spec.*', '**/node_modules/**',
        'e2e/**', 'lib/testing/**', '**/*.d.ts',
      ],
      thresholds: { lines: 80, functions: 80, branches: 80 },
    },
  },
});
