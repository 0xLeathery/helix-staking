import { NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';

// ---------------------------------------------------------------------------
// Test-wallet API route (server-side only — never sent to client as env var).
//
// Security: reads process.env.TEST_WALLET_SECRET (no NEXT_PUBLIC_ prefix).
// In production (env var absent) returns 404 — completely safe.
// Only present in E2E test runs where TEST_WALLET_SECRET is injected by
// playwright.config.ts into the Next.js web-server process.
//
// F-01 fix: the old client-bundle approach embedded the secret key into client
// JS. This server-side pattern prevents that. See Phase 8.2-01 for full audit.
// ---------------------------------------------------------------------------

/**
 * Minimal base58 decoder using the Bitcoin/Solana alphabet.
 * Matches the encodeBase58 used in playwright.config.ts.
 */
function decodeBase58(input: string): Uint8Array {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes = [0];
  for (let i = 0; i < input.length; i++) {
    const value = ALPHABET.indexOf(input[i]);
    if (value < 0) throw new Error(`Invalid base58 char: ${input[i]}`);
    let carry = value;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  // Add leading zeros for leading '1' characters
  for (let i = 0; i < input.length && input[i] === '1'; i++) {
    bytes.push(0);
  }
  return new Uint8Array(bytes.reverse());
}

export async function GET() {
  const secretKeyBase58 = process.env.TEST_WALLET_SECRET;
  if (!secretKeyBase58) {
    return NextResponse.json(
      { error: 'not configured' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  const secretKey = decodeBase58(secretKeyBase58);
  const keypair = Keypair.fromSecretKey(secretKey);
  return NextResponse.json(
    { secretKeyBase58, publicKey: keypair.publicKey.toBase58() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
