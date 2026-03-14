import { z } from 'zod';
import { PublicKey } from '@solana/web3.js';

/**
 * Zod schema for a valid Solana public key (base58 encoded).
 * Validates format using @solana/web3.js PublicKey constructor.
 */
export const solanaAddress = () =>
  z.string().refine(
    (val) => {
      try {
        new PublicKey(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid Solana address (must be valid base58 public key)' },
  );
