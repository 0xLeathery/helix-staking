import { PublicKey, Keypair, Transaction, TransactionInstruction } from "@solana/web3.js";
import { keccak_256 } from "@noble/hashes/sha3.js";
import { ed25519 } from "@noble/curves/ed25519.js";
import BN from "bn.js";

// Re-export base utilities
export * from "../utils";

// Phase 3 PDA seeds
export const CLAIM_CONFIG_SEED = Buffer.from("claim_config");
export const CLAIM_STATUS_SEED = Buffer.from("claim_status");

// Phase 3 constants (mirror Rust constants)
export const VESTING_DAYS = 30;
export const IMMEDIATE_RELEASE_BPS = 1000;  // 10%
export const CLAIM_PERIOD_DAYS = 180;
export const SPEED_BONUS_WEEK1_BPS = 2000;  // +20%
export const SPEED_BONUS_WEEK2_4_BPS = 1000;  // +10%
export const SPEED_BONUS_WEEK1_END = 7;
export const SPEED_BONUS_WEEK4_END = 28;
export const HELIX_PER_SOL = 10_000;
export const MIN_SOL_BALANCE = 100_000_000;  // 0.1 SOL in lamports
export const BPS_SCALER = 10_000;
export const MERKLE_ROOT_PREFIX_LEN = 8;

/**
 * Claim entry for Merkle tree
 */
export interface ClaimEntry {
  wallet: PublicKey;
  amount: BN;
  claimPeriodId: number;
}

/**
 * Merkle tree node
 */
export interface MerkleTree {
  root: Buffer;
  leaves: Buffer[];
  proofs: Map<string, Buffer[]>;
}

/**
 * Build a Merkle tree from claim entries
 * Leaf format: keccak256(wallet || amount_le_bytes || claim_period_id_le_bytes)
 */
export function buildMerkleTree(entries: ClaimEntry[]): MerkleTree {
  // Create leaves with original indices
  const leaves = entries.map((entry, idx) => {
    const data = Buffer.concat([
      entry.wallet.toBuffer(),
      entry.amount.toArrayLike(Buffer, "le", 8),
      Buffer.from(new Uint32Array([entry.claimPeriodId]).buffer),
    ]);
    return { leaf: Buffer.from(keccak_256(data)), idx, wallet: entry.wallet };
  });

  // If single entry, root is the leaf itself
  if (leaves.length === 1) {
    const proofs = new Map<string, Buffer[]>();
    proofs.set(entries[0].wallet.toBase58(), []);
    return { root: leaves[0].leaf, leaves: [leaves[0].leaf], proofs };
  }

  // Sort leaves for deterministic tree
  const sortedLeaves = [...leaves].sort((a, b) => Buffer.compare(a.leaf, b.leaf));

  // Build tree layers
  const layers: Buffer[][] = [sortedLeaves.map(s => s.leaf)];

  while (layers[layers.length - 1].length > 1) {
    const currentLayer = layers[layers.length - 1];
    const nextLayer: Buffer[] = [];

    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        const left = currentLayer[i];
        const right = currentLayer[i + 1];
        const combined = Buffer.compare(left, right) < 0
          ? Buffer.concat([left, right])
          : Buffer.concat([right, left]);
        nextLayer.push(Buffer.from(keccak_256(combined)));
      } else {
        nextLayer.push(currentLayer[i]);
      }
    }
    layers.push(nextLayer);
  }

  const root = layers[layers.length - 1][0];

  // Generate proofs for each leaf
  const proofs = new Map<string, Buffer[]>();

  for (const { leaf, wallet } of leaves) {
    const proof: Buffer[] = [];
    let currentIdx = sortedLeaves.findIndex(s => Buffer.compare(s.leaf, leaf) === 0);

    for (let layer = 0; layer < layers.length - 1; layer++) {
      const currentLayer = layers[layer];
      const siblingIdx = currentIdx % 2 === 0 ? currentIdx + 1 : currentIdx - 1;

      if (siblingIdx >= 0 && siblingIdx < currentLayer.length) {
        proof.push(currentLayer[siblingIdx]);
      }

      currentIdx = Math.floor(currentIdx / 2);
    }

    proofs.set(wallet.toBase58(), proof);
  }

  return { root, leaves: sortedLeaves.map(s => s.leaf), proofs };
}

/**
 * Get Merkle proof for a wallet
 */
export function getMerkleProof(tree: MerkleTree, wallet: PublicKey): Buffer[] {
  const proof = tree.proofs.get(wallet.toBase58());
  if (!proof) {
    throw new Error(`No proof found for wallet ${wallet.toBase58()}`);
  }
  return proof;
}

/**
 * Build Ed25519 claim message
 * Format: "HELIX:claim:{pubkey}:{amount}"
 */
export function buildClaimMessage(wallet: PublicKey, amount: BN): Uint8Array {
  const message = `HELIX:claim:${wallet.toBase58()}:${amount.toString()}`;
  return new TextEncoder().encode(message);
}

/**
 * Sign a claim message with Ed25519
 * Returns the signature for use with Ed25519Program.verify
 */
export function signClaimMessage(
  keypair: Keypair,
  amount: BN
): { signature: Uint8Array; message: Uint8Array } {
  const message = buildClaimMessage(keypair.publicKey, amount);
  const signature = ed25519.sign(message, keypair.secretKey.slice(0, 32));
  return { signature, message };
}

/**
 * Create Ed25519 signature verification instruction
 * This must be the instruction immediately before free_claim
 */
export function createEd25519Instruction(
  keypair: Keypair,
  amount: BN
): TransactionInstruction {
  const { signature, message } = signClaimMessage(keypair, amount);
  const publicKey = keypair.publicKey.toBytes();

  // Ed25519SignatureOffsets format (per Solana SDK):
  // header: num_signatures (u8), padding (u8)
  // per-sig entry (14 bytes each):
  //   signature_offset (u16), signature_instruction_index (u16, 0xFFFF = this ix)
  //   public_key_offset (u16), public_key_instruction_index (u16, 0xFFFF = this ix)
  //   message_data_offset (u16), message_data_size (u16)
  //   message_instruction_index (u16, 0xFFFF = this ix)
  const sigLen = 64;
  const pkLen = 32;
  const msgLen = message.length;

  const sigOffset = 16; // After 2-byte header + 14-byte entry
  const pkOffset = sigOffset + sigLen;
  const msgOffset = pkOffset + pkLen;

  const instructionData = Buffer.alloc(16 + sigLen + pkLen + msgLen);
  instructionData.writeUInt8(1, 0);     // num_signatures
  instructionData.writeUInt8(0, 1);     // padding
  instructionData.writeUInt16LE(sigOffset, 2);  // signature_offset
  instructionData.writeUInt16LE(0xFFFF, 4);     // signature_instruction_index (this ix)
  instructionData.writeUInt16LE(pkOffset, 6);   // public_key_offset
  instructionData.writeUInt16LE(0xFFFF, 8);     // public_key_instruction_index (this ix)
  instructionData.writeUInt16LE(msgOffset, 10); // message_data_offset
  instructionData.writeUInt16LE(msgLen, 12);    // message_data_size
  instructionData.writeUInt16LE(0xFFFF, 14);    // message_instruction_index (this ix)

  Buffer.from(signature).copy(instructionData, sigOffset);
  Buffer.from(publicKey).copy(instructionData, pkOffset);
  Buffer.from(message).copy(instructionData, msgOffset);

  return new TransactionInstruction({
    keys: [],
    programId: new PublicKey("Ed25519SigVerify111111111111111111111111111"),
    data: instructionData,
  });
}

/**
 * Derive ClaimConfig PDA
 */
export function findClaimConfigPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [CLAIM_CONFIG_SEED],
    programId
  );
}

/**
 * Derive ClaimStatus PDA
 */
export function findClaimStatusPDA(
  programId: PublicKey,
  merkleRoot: Buffer,
  snapshotWallet: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      CLAIM_STATUS_SEED,
      merkleRoot.slice(0, MERKLE_ROOT_PREFIX_LEN),  // First 8 bytes of merkle root
      snapshotWallet.toBuffer(),
    ],
    programId
  );
}

/**
 * Calculate expected vested amount at a given slot
 */
export function calculateVestedAmount(
  claimedAmount: BN,
  claimedSlot: BN,
  vestingEndSlot: BN,
  currentSlot: BN
): BN {
  const immediate = claimedAmount.muln(IMMEDIATE_RELEASE_BPS).divn(BPS_SCALER);

  if (currentSlot.gte(vestingEndSlot)) {
    return claimedAmount;
  }

  if (currentSlot.lte(claimedSlot)) {
    return immediate;
  }

  const vestingDuration = vestingEndSlot.sub(claimedSlot);
  const elapsed = currentSlot.sub(claimedSlot);
  const vestingPortion = claimedAmount.sub(immediate);
  const unlockedVesting = vestingPortion.mul(elapsed).div(vestingDuration);

  return immediate.add(unlockedVesting);
}

/**
 * Calculate speed bonus for a given days elapsed
 * Week 1 (days 0-7): +20% bonus (SPEED_BONUS_WEEK1_BPS)
 * Weeks 2-4 (days 8-28): +10% bonus (SPEED_BONUS_WEEK2_4_BPS)
 * Days 29+: base amount (no bonus)
 */
export function calculateSpeedBonus(
  snapshotBalance: BN,
  daysElapsed: number
): { bonusBps: number; baseAmount: BN; bonusAmount: BN; totalAmount: BN } {
  // Base: snapshot_balance * HELIX_PER_SOL / 10 (adjust for SOL->HELIX decimal diff)
  // SOL has 9 decimals, HELIX has 8 decimals
  const baseAmount = snapshotBalance.muln(HELIX_PER_SOL).divn(10);

  let bonusBps: number;
  if (daysElapsed <= SPEED_BONUS_WEEK1_END) {
    bonusBps = SPEED_BONUS_WEEK1_BPS;  // +20%
  } else if (daysElapsed <= SPEED_BONUS_WEEK4_END) {
    bonusBps = SPEED_BONUS_WEEK2_4_BPS;  // +10%
  } else {
    bonusBps = 0;  // No bonus
  }

  const bonusAmount = baseAmount.muln(bonusBps).divn(BPS_SCALER);
  const totalAmount = baseAmount.add(bonusAmount);

  return { bonusBps, baseAmount, bonusAmount, totalAmount };
}

/**
 * Calculate days elapsed from slots
 */
export function calculateDaysElapsed(
  startSlot: BN,
  currentSlot: BN,
  slotsPerDay: BN
): number {
  const elapsedSlots = currentSlot.sub(startSlot);
  return elapsedSlots.div(slotsPerDay).toNumber();
}
