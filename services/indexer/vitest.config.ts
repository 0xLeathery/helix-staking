import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    root: 'src',
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['**/*.ts'],
      exclude: [
        '**/__tests__/**',
        '**/node_modules/**',
        '**/db/migrations/**',
        '**/*.d.ts',
        // Entry points (no testable logic)
        '**/worker/index.ts',
        '**/api/index.ts',
        // Infrastructure / config-only files
        '**/lib/env.ts',
        '**/lib/logger.ts',
        '**/lib/rpc.ts',
        '**/lib/anchor.ts',
        '**/db/client.ts',
        // Types-only file
        '**/types/**',
        // Rate limiting middleware (infrastructure, no business logic)
        '**/api/middleware/rate-limit.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
