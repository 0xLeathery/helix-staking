import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  RPC_URL: z.string().url().describe('Required: Solana RPC endpoint URL (no default — fails loudly if missing)'),
  RPC_URL_FALLBACK: z.string().url().optional().describe('Fallback RPC endpoint used when primary is exhausted'),
  CLUSTER: z.enum(['devnet', 'mainnet-beta', 'localnet']).default('devnet'),
  PROGRAM_ID: z.string().min(1, 'PROGRAM_ID is required'),
  PORT: z.coerce.number().int().positive().default(3001),
  POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
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

    console.error('Environment validation failed:\n' + missing);
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
