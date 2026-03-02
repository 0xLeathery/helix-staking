import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  PROGRAM_ID,
  GLOBAL_STATE_SEED,
  MINT_SEED,
  MINT_AUTHORITY_SEED,
  STAKE_SEED,
  CLAIM_CONFIG_SEED,
  CLAIM_STATUS_SEED,
  REFERRAL_RECORD_SEED,
} from "./constants";

/**
 * Derive the GlobalState PDA.
 * Seeds: ["global_state"]
 */
export function deriveGlobalState(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([GLOBAL_STATE_SEED], PROGRAM_ID);
}

/**
 * Derive the HELIX token mint PDA.
 * Seeds: ["helix_mint"]
 */
export function deriveMint(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([MINT_SEED], PROGRAM_ID);
}

/**
 * Derive the mint authority PDA.
 * Seeds: ["mint_authority"]
 */
export function deriveMintAuthority(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([MINT_AUTHORITY_SEED], PROGRAM_ID);
}

/**
 * Derive a StakeAccount PDA for a user and stake ID.
 * Seeds: ["stake", user_pubkey, stake_id_as_u64_le]
 */
export function deriveStakeAccount(
  user: PublicKey,
  stakeId: number | BN
): [PublicKey, number] {
  const stakeIdBn = BN.isBN(stakeId) ? stakeId : new BN(stakeId);
  const stakeIdBuffer = stakeIdBn.toArrayLike(Buffer, "le", 8);

  return PublicKey.findProgramAddressSync(
    [STAKE_SEED, user.toBuffer(), stakeIdBuffer],
    PROGRAM_ID
  );
}

/**
 * Derive the ClaimConfig PDA (singleton).
 * Seeds: ["claim_config"]
 */
export function deriveClaimConfig(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([CLAIM_CONFIG_SEED], PROGRAM_ID);
}

/**
 * Derive a ClaimStatus PDA for a specific user and merkle root.
 * Seeds: ["claim_status", merkle_root[0..8], snapshot_wallet]
 */
export function deriveClaimStatus(
  merkleRootPrefix: Buffer,
  snapshotWallet: PublicKey
): [PublicKey, number] {
  // Use first 8 bytes of merkle root as prefix
  const prefix = merkleRootPrefix.subarray(0, 8);

  return PublicKey.findProgramAddressSync(
    [CLAIM_STATUS_SEED, prefix, snapshotWallet.toBuffer()],
    PROGRAM_ID
  );
}

/**
 * Derive a ReferralRecord PDA for a referrer-referee pair.
 * Seeds: ["referral", referrer_pubkey, referee_pubkey]
 */
export function deriveReferralRecord(
  referrer: PublicKey,
  referee: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [REFERRAL_RECORD_SEED, referrer.toBuffer(), referee.toBuffer()],
    PROGRAM_ID
  );
}
