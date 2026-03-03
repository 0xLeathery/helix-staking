import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import cron from 'node-cron';
import { Keypair } from '@solana/web3.js';
import { Program, Wallet } from '@coral-xyz/anchor';
import { logger } from './logger.js';
import { env } from './env.js';
import { executeCrank, loadCrankerKeypair, checkSolBalance } from './crank.js';
import { withRpcFallback, createCrankProgram } from './rpc.js';

// ---------------------------------------------------------------------------
// IDL loading
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Support IDL_PATH env var for Docker override (e.g. bind-mount from /mnt/idl)
const idlPath =
  process.env.IDL_PATH ??
  path.resolve(__dirname, '../../../target/idl/helix_staking.json');

let idl: any = JSON.parse(readFileSync(idlPath, 'utf-8'));

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------
let isShuttingDown = false;
let crankerKeypair!: Keypair;
let wallet!: Wallet;
let program!: Program;

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

async function setupProgram(): Promise<void> {
  crankerKeypair = loadCrankerKeypair();
  wallet = new Wallet(crankerKeypair);
  program = createCrankProgram(env.RPC_URL, wallet, idl);

  // Log masked RPC URL at startup
  const maskedUrl = env.RPC_URL.replace(/^(https?:\/\/[^/]{4}).*/, '$1***');
  logger.info(
    { rpcUrl: maskedUrl, cluster: env.CLUSTER, programId: env.PROGRAM_ID },
    'Crank service program setup complete',
  );
}

// ---------------------------------------------------------------------------
// Heartbeat
// ---------------------------------------------------------------------------

async function pingHeartbeat(suffix = ''): Promise<void> {
  if (!env.HEARTBEAT_URL) return;
  try {
    await fetch(env.HEARTBEAT_URL + suffix);
    logger.info({ suffix: suffix || '(success)' }, 'Heartbeat pinged');
  } catch (err) {
    logger.warn({ err: String(err) }, 'Heartbeat ping failed — BetterStack may alert');
  }
}

// ---------------------------------------------------------------------------
// Tick (runs on each cron fire)
// ---------------------------------------------------------------------------

async function tick(): Promise<void> {
  if (isShuttingDown) return;

  // CRANK-04: Check SOL balance on each tick (read-only, primary endpoint only)
  const balanceCheck = await checkSolBalance(
    program.provider.connection,
    crankerKeypair.publicKey,
  );

  // Low SOL: alert via heartbeat /fail outbound
  if (balanceCheck.belowThreshold) {
    await pingHeartbeat('/fail');
  }

  // CRANK-03: Wrap executeCrank in withRpcFallback for automatic RPC failover.
  // Primary: 5 retries (1s-60s). Fallback: 3 retries (1s-30s) if RPC_URL_FALLBACK set.
  try {
    const result = await withRpcFallback(
      (prog) => executeCrank(prog, crankerKeypair),
      wallet,
      idl,
    );

    if (result === 'cranked') {
      logger.info('crank_distribution succeeded — pinging heartbeat');
      await pingHeartbeat();
    } else if (result === 'already_done') {
      logger.info('Distribution already completed today — skipping');
    } else if (result === 'not_yet') {
      logger.debug('Day boundary not crossed — no action needed');
    } else if (result === 'program_paused') {
      logger.error('Program paused — stopping crank service');
      await pingHeartbeat('/fail');
      process.exit(1);
    }
  } catch (err) {
    // All retries exhausted — log and continue (next tick will retry)
    logger.error(
      { err: err instanceof Error ? err.message : String(err) },
      'Crank tick failed after all retries',
    );
  }
}

// ---------------------------------------------------------------------------
// Graceful shutdown (CRANK-09)
// ---------------------------------------------------------------------------

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info({ signal }, 'Crank service shutdown signal received — exiting');
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// ---------------------------------------------------------------------------
// Cron scheduling (CRANK-01, CRANK-06)
// Four daily attempts at UTC midnight + buffer to ensure distribution fires
// ---------------------------------------------------------------------------
const CRANK_TIMES = ['5 0 * * *', '20 0 * * *', '35 0 * * *', '50 0 * * *'];

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

(async () => {
  await setupProgram();

  // CRANK-04: Initial SOL balance check at startup
  const startupBalance = await checkSolBalance(
    program.provider.connection,
    crankerKeypair.publicKey,
  );
  logger.info(
    { balance: startupBalance.balance, belowThreshold: startupBalance.belowThreshold },
    'Startup SOL balance check complete',
  );

  if (!env.HEARTBEAT_URL) {
    logger.warn('HEARTBEAT_URL not configured — liveness monitoring disabled');
  }

  logger.info({ schedules: CRANK_TIMES }, 'Crank service started — scheduling cron jobs');

  // Schedule 4 daily attempts with noOverlap to prevent concurrent executions
  for (const expr of CRANK_TIMES) {
    cron.schedule(expr, () => void tick(), { timezone: 'UTC', noOverlap: true });
  }
})();
