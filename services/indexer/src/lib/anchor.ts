import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BorshCoder, EventParser, type Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve IDL path: env override or default relative to project root
const idlPath =
  process.env.IDL_PATH ??
  path.resolve(__dirname, '../../../../target/idl/helix_staking.json');

const idl: Idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));

/** Program ID from the IDL */
export const programId = new PublicKey(
  (idl as any).address ??
    (idl as any).metadata?.address ??
    (() => {
      throw new Error('IDL missing program address');
    })(),
);

const coder = new BorshCoder(idl);
const eventParser = new EventParser(programId, coder);

/**
 * Parse program events from transaction log messages.
 *
 * @param logs - Array of log strings from a transaction
 * @returns Array of parsed events with name and data
 */
export function parseEventsFromLogs(
  logs: string[],
): Array<{ name: string; data: any }> {
  const events: Array<{ name: string; data: any }> = [];

  for (const event of eventParser.parseLogs(logs)) {
    events.push({
      name: event.name,
      data: event.data,
    });
  }

  return events;
}
