import { eq, sql } from 'drizzle-orm';
import { db, type DbClient } from '../db/client.js';
import { checkpoints } from '../db/schema.js';

/**
 * Retrieve the last processed checkpoint for a given program.
 *
 * Returns null values on first run (no checkpoint row exists yet).
 */
export async function getCheckpoint(
  programId: string,
): Promise<{ lastSignature: string | null; lastSlot: number | null }> {
  const rows = await db
    .select({
      lastSignature: checkpoints.lastSignature,
      lastSlot: checkpoints.lastSlot,
    })
    .from(checkpoints)
    .where(eq(checkpoints.programId, programId))
    .limit(1);

  if (rows.length === 0) {
    return { lastSignature: null, lastSlot: null };
  }

  return {
    lastSignature: rows[0].lastSignature,
    lastSlot: rows[0].lastSlot,
  };
}

/**
 * Upsert a checkpoint for the given program.
 *
 * Phase 8.1 (H7/FR-008): Accepts optional dbClient for transactional writes.
 * When called inside db.transaction(), pass the transaction object to ensure
 * checkpoint update is atomic with event inserts.
 *
 * Inserts a new row or updates the existing one (keyed on programId).
 * Also increments the processed transaction counter.
 */
export async function updateCheckpoint(
  programId: string,
  signature: string,
  slot: number,
  dbClient: DbClient = db,
): Promise<void> {
  await dbClient
    .insert(checkpoints)
    .values({
      programId,
      lastSignature: signature,
      lastSlot: slot,
      processedCount: 1,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: checkpoints.programId,
      set: {
        lastSignature: signature,
        lastSlot: slot,
        processedCount: sql`${checkpoints.processedCount} + 1`,
        updatedAt: new Date(),
      },
    });
}
