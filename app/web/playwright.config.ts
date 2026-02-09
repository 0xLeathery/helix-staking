import { defineConfig, devices } from '@playwright/test';
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Pre-generate a test wallet keypair at config-parse time.
// This runs before both globalSetup and webServer, so the wallet secret is
// available for the Next.js process (NEXT_PUBLIC_TEST_WALLET_SECRET) and
// globalSetup reads it back to fund+stake with the same keypair.
// ---------------------------------------------------------------------------

const WALLET_PATH = path.resolve(__dirname, 'e2e/.test-wallet.json');

function encodeBase58(input: Uint8Array): string {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = Array.from(input);
  const digits = [0];
  for (let b = 0; b < bytes.length; b++) {
    let carry = bytes[b];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let str = "";
  for (let b = 0; b < bytes.length; b++) {
    if (bytes[b] !== 0) break;
    str += "1";
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    str += ALPHABET[digits[i]];
  }
  return str;
}

// Generate fresh keypair each run — written to disk for globalSetup to read
const testKeypair = Keypair.generate();
const secretKeyBase58 = encodeBase58(testKeypair.secretKey);
fs.writeFileSync(
  WALLET_PATH,
  JSON.stringify({
    publicKey: testKeypair.publicKey.toBase58(),
    secretKeyBase58,
    secretKey: Array.from(testKeypair.secretKey),
  })
);

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /transactions\//,
    },
    {
      name: 'transaction-tests',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /transactions\/.+\.spec\.ts/,
      timeout: 90_000,
      fullyParallel: false,
      dependencies: ['chromium'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    env: {
      NEXT_PUBLIC_SKIP_WALLET_CHECK: 'true',
      HELIUS_RPC_URL: 'http://localhost:8899',
      NEXT_PUBLIC_RPC_URL: 'http://localhost:8899',
      NEXT_PUBLIC_TEST_WALLET_SECRET: secretKeyBase58,
    },
  },
});
