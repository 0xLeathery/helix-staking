import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  RPC_URL: z.string().url().describe('Required: Solana RPC endpoint URL'),
  RPC_URL_FALLBACK: z.string().url().optional().describe('Fallback RPC endpoint used when primary is exhausted'),
  PROGRAM_ID: z.string().min(1, 'PROGRAM_ID is required'),
  CLUSTER: z.enum(['devnet', 'mainnet-beta']).default('devnet'),
  CRANK_KEYPAIR_JSON: z.string().min(1, 'CRANK_KEYPAIR_JSON is required (JSON byte array)'),
  SOL_BALANCE_THRESHOLD_SOL: z.coerce.number().positive().default(0.1),
  HEARTBEAT_URL: z.string().url().optional().describe('BetterStack heartbeat URL — optional, warning if absent'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    const missing = Object.entries(formatted)
      .filter(([key]) => key !== '_errors')
      .map(([key, val]) => `  ${key}: ${(val as any)._errors?.join(', ')}`)
      .join('\n');

    console.error('Crank service environment validation failed:\n' + missing);
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
