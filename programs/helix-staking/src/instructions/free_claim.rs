use anchor_lang::prelude::*;
use anchor_lang::solana_program::ed25519_program;
use anchor_lang::solana_program::sysvar::instructions::{
    self as ix_sysvar, load_current_index_checked, load_instruction_at_checked,
};
use anchor_spl::token_2022::{self, MintTo, Token2022};
use anchor_spl::token_interface::{Mint, TokenAccount};
use solana_nostd_keccak::hashv;

use crate::constants::*;
use crate::error::HelixError;
use crate::events::TokensClaimed;
use crate::instructions::math::mul_div;
use crate::state::{ClaimConfig, ClaimStatus, GlobalState};

#[derive(Accounts)]
#[instruction(snapshot_balance: u64, proof: Vec<[u8; 32]>)]
pub struct FreeClaim<'info> {
    /// The wallet receiving the tokens (pays rent for ClaimStatus)
    #[account(mut)]
    pub claimer: Signer<'info>,

    /// The snapshot wallet that signed the claim message
    /// CHECK: Verified via Ed25519 signature introspection
    /// Must equal claimer - delegation not supported (see MEDIUM-3 security fix)
    #[account(
        constraint = snapshot_wallet.key() == claimer.key() @ HelixError::Unauthorized
    )]
    pub snapshot_wallet: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(
        mut,
        seeds = [CLAIM_CONFIG_SEED],
        bump = claim_config.bump,
        constraint = claim_config.claim_period_started @ HelixError::ClaimPeriodNotStarted,
    )]
    pub claim_config: Account<'info, ClaimConfig>,

    #[account(
        init,
        payer = claimer,
        space = ClaimStatus::LEN,
        seeds = [
            CLAIM_STATUS_SEED,
            &claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],
            snapshot_wallet.key().as_ref()
        ],
        bump,
    )]
    pub claim_status: Account<'info, ClaimStatus>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = claimer,
        associated_token::token_program = token_program,
    )]
    pub claimer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [MINT_SEED],
        bump,
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    /// CHECK: PDA mint authority
    #[account(
        seeds = [MINT_AUTHORITY_SEED],
        bump = global_state.mint_authority_bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    /// CHECK: Instructions sysvar for Ed25519 verification
    #[account(address = ix_sysvar::ID)]
    pub instructions_sysvar: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
}

pub fn free_claim(
    ctx: Context<FreeClaim>,
    snapshot_balance: u64,
    proof: Vec<[u8; 32]>,
) -> Result<()> {
    let clock = Clock::get()?;
    let claim_config = &mut ctx.accounts.claim_config;
    let claim_status = &mut ctx.accounts.claim_status;
    let global_state = &ctx.accounts.global_state;

    // OPS-03: Reject user operations while program is paused
    require!(!global_state.is_paused(), HelixError::ProgramPaused);

    // === Security Check 1: Verify claim period is active ===
    require!(
        clock.slot <= claim_config.end_slot,
        HelixError::ClaimPeriodEnded
    );

    // === Security Check 2: Verify minimum balance ===
    require!(
        snapshot_balance >= MIN_SOL_BALANCE,
        HelixError::SnapshotBalanceTooLow
    );

    // === Security Check 3: Verify Ed25519 signature (MEV prevention) ===
    verify_ed25519_signature(
        &ctx.accounts.instructions_sysvar,
        ctx.accounts.snapshot_wallet.key(),
        snapshot_balance,
    )?;

    // === Security Check 4: Verify Merkle proof ===
    verify_merkle_proof(
        ctx.accounts.snapshot_wallet.key(),
        snapshot_balance,
        claim_config.claim_period_id,
        &claim_config.merkle_root,
        &proof,
    )?;

    // === Calculate claim amount with speed bonus ===
    let days_elapsed = calculate_days_elapsed(
        claim_config.start_slot,
        clock.slot,
        global_state.slots_per_day,
    )?;

    let (bonus_bps, base_amount, bonus_amount) =
        calculate_speed_bonus(snapshot_balance, days_elapsed)?;

    let total_amount = base_amount
        .checked_add(bonus_amount)
        .ok_or(HelixError::Overflow)?;

    // Phase 8.1 (C3/FR-006): Prevent zero-amount mint CPI
    require!(total_amount > 0, HelixError::ClaimAmountZero);

    // === Split into immediate (10%) and vesting (90%) ===
    // ADDL-2 FIX: Use mul_div to avoid overflow for large claims
    let immediate_amount = mul_div(total_amount, IMMEDIATE_RELEASE_BPS, BPS_SCALER)?;

    let vesting_amount = total_amount
        .checked_sub(immediate_amount)
        .ok_or(HelixError::Underflow)?;

    let vesting_end_slot = clock
        .slot
        .checked_add(
            VESTING_DAYS
                .checked_mul(global_state.slots_per_day)
                .ok_or(HelixError::Overflow)?,
        )
        .ok_or(HelixError::Overflow)?;

    // === Initialize ClaimStatus ===
    claim_status.is_claimed = true;
    claim_status.claimed_amount = total_amount;
    claim_status.claimed_slot = clock.slot;
    claim_status.bonus_bps = bonus_bps;
    claim_status.withdrawn_amount = immediate_amount; // Immediate portion counts as withdrawn
    claim_status.vesting_end_slot = vesting_end_slot;
    claim_status.snapshot_wallet = ctx.accounts.snapshot_wallet.key();
    claim_status.bump = ctx.bumps.claim_status;

    // === Update ClaimConfig ===
    claim_config.total_claimed = claim_config
        .total_claimed
        .checked_add(total_amount)
        .ok_or(HelixError::Overflow)?;
    claim_config.claim_count = claim_config
        .claim_count
        .checked_add(1)
        .ok_or(HelixError::Overflow)?;

    // === Mint immediate tokens to claimer ===
    let authority_seeds = &[MINT_AUTHORITY_SEED, &[global_state.mint_authority_bump]];
    let signer_seeds = &[&authority_seeds[..]];

    token_2022::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.claimer_token_account.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        immediate_amount,
    )?;

    // === Emit event ===
    emit!(TokensClaimed {
        slot: clock.slot,
        timestamp: clock.unix_timestamp,
        claimer: ctx.accounts.claimer.key(),
        snapshot_wallet: ctx.accounts.snapshot_wallet.key(),
        claim_period_id: claim_config.claim_period_id,
        snapshot_balance,
        base_amount,
        bonus_bps,
        days_elapsed: days_elapsed as u16,
        total_amount,
        immediate_amount,
        vesting_amount,
        vesting_end_slot,
    });

    Ok(())
}

/// Verify Ed25519 signature via instruction introspection
/// Message format: "HELIX:claim:{pubkey}:{amount}"
fn verify_ed25519_signature(
    instructions_sysvar: &AccountInfo,
    snapshot_wallet: Pubkey,
    amount: u64,
) -> Result<()> {
    let current_ix_index = load_current_index_checked(instructions_sysvar)?;

    // Ed25519 verify must be the instruction immediately before this one
    require!(current_ix_index > 0, HelixError::MissingEd25519Instruction);

    let ed25519_ix =
        load_instruction_at_checked((current_ix_index - 1) as usize, instructions_sysvar)?;

    // Verify it's the Ed25519 program
    require!(
        ed25519_ix.program_id == ed25519_program::ID,
        HelixError::MissingEd25519Instruction
    );

    // Build expected message
    let expected_message = format!("HELIX:claim:{}:{}", snapshot_wallet, amount);

    // Ed25519 instruction data format (after signature count byte):
    // - 2 bytes: signature offset
    // - 2 bytes: signature length (64)
    // - 2 bytes: public key offset
    // - 2 bytes: public key length (32)
    // - 2 bytes: message offset
    // - 2 bytes: message length
    // Then: signature (64 bytes), public key (32 bytes), message (variable)

    let ix_data = &ed25519_ix.data;
    require!(ix_data.len() >= 16, HelixError::InvalidSignature);

    // Parse offsets (little-endian u16)
    let pubkey_offset = u16::from_le_bytes([ix_data[6], ix_data[7]]) as usize;
    let msg_offset = u16::from_le_bytes([ix_data[10], ix_data[11]]) as usize;
    let msg_len = u16::from_le_bytes([ix_data[12], ix_data[13]]) as usize;

    // Verify public key matches snapshot wallet
    require!(
        ix_data.len() >= pubkey_offset + 32,
        HelixError::InvalidSignature
    );
    let signed_pubkey = Pubkey::try_from(&ix_data[pubkey_offset..pubkey_offset + 32])
        .map_err(|_| HelixError::InvalidSignature)?;
    require!(
        signed_pubkey == snapshot_wallet,
        HelixError::InvalidSignature
    );

    // Verify message matches expected format
    require!(
        ix_data.len() >= msg_offset + msg_len,
        HelixError::InvalidSignature
    );
    let signed_message = &ix_data[msg_offset..msg_offset + msg_len];
    require!(
        signed_message == expected_message.as_bytes(),
        HelixError::InvalidSignature
    );

    Ok(())
}

/// Verify Merkle proof
/// Leaf format: keccak256(snapshot_address || amount || claim_period_id)
fn verify_merkle_proof(
    snapshot_wallet: Pubkey,
    amount: u64,
    claim_period_id: u32,
    merkle_root: &[u8; 32],
    proof: &[[u8; 32]],
) -> Result<()> {
    require!(
        proof.len() <= MAX_MERKLE_PROOF_LEN,
        HelixError::InvalidMerkleProof
    );

    // Compute leaf hash: keccak256(snapshot_address || amount || claim_period_id)
    let mut hash = hashv(&[
        snapshot_wallet.as_ref(),
        &amount.to_le_bytes(),
        &claim_period_id.to_le_bytes(),
    ]);

    // Walk up the tree
    for sibling in proof.iter() {
        hash = if hash < *sibling {
            hashv(&[&hash, sibling])
        } else {
            hashv(&[sibling, &hash])
        };
    }

    require!(hash == *merkle_root, HelixError::InvalidMerkleProof);

    Ok(())
}

/// Calculate days elapsed since claim period start
fn calculate_days_elapsed(start_slot: u64, current_slot: u64, slots_per_day: u64) -> Result<u64> {
    let elapsed_slots = current_slot
        .checked_sub(start_slot)
        .ok_or(HelixError::Underflow)?;

    // XRAY-3: Use checked_div to prevent division-by-zero
    elapsed_slots
        .checked_div(slots_per_day)
        .ok_or(error!(HelixError::DivisionByZero))
}

/// Calculate speed bonus based on days elapsed
/// Week 1 (days 0-7): +20% bonus
/// Weeks 2-4 (days 8-28): +10% bonus
/// Days 29+: base amount (no bonus)
fn calculate_speed_bonus(snapshot_balance: u64, days_elapsed: u64) -> Result<(u16, u64, u64)> {
    // Base amount: snapshot_balance * HELIX_PER_SOL
    // SOL has 9 decimals, HELIX has 8 decimals
    // snapshot_balance is in lamports (9 decimals)
    // HELIX_PER_SOL = 10000 (HELIX tokens per 1 SOL)
    //
    // Formula: base_amount = (snapshot_balance / 1e9) * 10000 * 1e8
    //                      = snapshot_balance * 10000 / 10
    //                      = snapshot_balance * 1000
    // ADDL-1 FIX: Use mul_div to avoid overflow for large balances
    let base_amount = mul_div(snapshot_balance, HELIX_PER_SOL, 10)?;

    let bonus_bps = if days_elapsed <= SPEED_BONUS_WEEK1_END {
        SPEED_BONUS_WEEK1_BPS // +20%
    } else if days_elapsed <= SPEED_BONUS_WEEK4_END {
        SPEED_BONUS_WEEK2_4_BPS // +10%
    } else {
        0 // No bonus
    };

    // ADDL-3 FIX: Use mul_div to avoid overflow for bonus calculation
    let bonus_amount = mul_div(base_amount, bonus_bps, BPS_SCALER)?;

    Ok((bonus_bps as u16, base_amount, bonus_amount))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::constants::*;

    // ====== calculate_days_elapsed ======

    #[test]
    fn test_days_elapsed_day_zero() {
        // Same slot → 0 days
        let spd = DEFAULT_SLOTS_PER_DAY;
        assert_eq!(calculate_days_elapsed(100, 100, spd).unwrap(), 0);
    }

    #[test]
    fn test_days_elapsed_exact_days() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        // Exactly 1 day
        assert_eq!(calculate_days_elapsed(0, spd, spd).unwrap(), 1);
        // Exactly 7 days
        assert_eq!(calculate_days_elapsed(0, 7 * spd, spd).unwrap(), 7);
        // Exactly 28 days
        assert_eq!(calculate_days_elapsed(0, 28 * spd, spd).unwrap(), 28);
        // Exactly 29 days (past bonus period)
        assert_eq!(calculate_days_elapsed(0, 29 * spd, spd).unwrap(), 29);
    }

    #[test]
    fn test_days_elapsed_with_remainder() {
        let spd = DEFAULT_SLOTS_PER_DAY;
        // 1 day + partial → still 1 day (integer division truncates)
        assert_eq!(calculate_days_elapsed(0, spd + 100, spd).unwrap(), 1);
        // 6 days 23 hours → still 6
        assert_eq!(calculate_days_elapsed(0, spd * 7 - 1, spd).unwrap(), 6);
    }

    #[test]
    fn test_days_elapsed_underflow() {
        // current < start → underflow error
        let spd = DEFAULT_SLOTS_PER_DAY;
        assert!(calculate_days_elapsed(100, 0, spd).is_err());
    }

    #[test]
    fn test_days_elapsed_division_by_zero() {
        // slots_per_day = 0 → division by zero error
        assert!(calculate_days_elapsed(0, 1000, 0).is_err());
    }

    // ====== calculate_speed_bonus ======

    #[test]
    fn test_speed_bonus_week1() {
        // Day 0 (same day as start): +20% bonus
        let (bps, base, bonus) = calculate_speed_bonus(1_000_000_000, 0).unwrap();
        assert_eq!(bps, SPEED_BONUS_WEEK1_BPS as u16);
        // base = 1_000_000_000 * 10000 / 10 = 1_000_000_000_000
        assert_eq!(base, 1_000_000_000_000);
        // bonus = 1_000_000_000_000 * 2000 / 10000 = 200_000_000_000
        assert_eq!(bonus, base * 2000 / 10000);
    }

    #[test]
    fn test_speed_bonus_week1_boundary() {
        // Day 7: last day of week 1 bonus (SPEED_BONUS_WEEK1_END = 7)
        let (bps, base, bonus) =
            calculate_speed_bonus(1_000_000_000, SPEED_BONUS_WEEK1_END).unwrap();
        assert_eq!(bps, SPEED_BONUS_WEEK1_BPS as u16);
        assert_eq!(bonus, base * SPEED_BONUS_WEEK1_BPS / BPS_SCALER);
    }

    #[test]
    fn test_speed_bonus_weeks2to4() {
        // Day 8: start of weeks 2-4 bonus
        let (bps, base, bonus) = calculate_speed_bonus(1_000_000_000, 8).unwrap();
        assert_eq!(bps, SPEED_BONUS_WEEK2_4_BPS as u16);
        assert_eq!(bonus, base * SPEED_BONUS_WEEK2_4_BPS / BPS_SCALER);

        // Day 28: last day of weeks 2-4 bonus (SPEED_BONUS_WEEK4_END = 28)
        let (bps28, _, _) = calculate_speed_bonus(1_000_000_000, SPEED_BONUS_WEEK4_END).unwrap();
        assert_eq!(bps28, SPEED_BONUS_WEEK2_4_BPS as u16);
    }

    #[test]
    fn test_speed_bonus_no_bonus() {
        // Day 29: past bonus period → 0 bonus_bps
        let (bps, base, bonus) = calculate_speed_bonus(1_000_000_000, 29).unwrap();
        assert_eq!(bps, 0);
        assert_eq!(bonus, 0);
        assert!(base > 0);
    }

    #[test]
    fn test_speed_bonus_base_calculation() {
        // 1 SOL = 1_000_000_000 lamports
        // base = 1_000_000_000 * 10000 / 10 = 1_000_000_000_000 (1e12 base units)
        // = 10,000 HELIX tokens (8 decimals) = 1e12 / 1e8 = 1e4
        let (_, base, _) = calculate_speed_bonus(1_000_000_000, 100).unwrap();
        assert_eq!(base, 1_000_000_000_000);

        // 0.1 SOL = 100_000_000 lamports → 100_000_000_000 base units
        let (_, base_small, _) = calculate_speed_bonus(100_000_000, 100).unwrap();
        assert_eq!(base_small, 100_000_000_000);
    }

    // ====== verify_merkle_proof ======

    #[test]
    fn test_merkle_proof_empty_tree() {
        // Single leaf: proof is empty, root = leaf hash
        use anchor_lang::prelude::Pubkey;
        use solana_nostd_keccak::hashv;

        let wallet = Pubkey::new_unique();
        let amount = 1_000_000_000u64;
        let period_id = 1u32;

        let leaf = hashv(&[
            wallet.as_ref(),
            &amount.to_le_bytes(),
            &period_id.to_le_bytes(),
        ]);

        // With empty proof, root must equal leaf
        let root = leaf;
        assert!(verify_merkle_proof(wallet, amount, period_id, &root, &[]).is_ok());
    }

    #[test]
    fn test_merkle_proof_invalid_root() {
        use anchor_lang::prelude::Pubkey;

        let wallet = Pubkey::new_unique();
        let wrong_root = [0u8; 32];
        assert!(verify_merkle_proof(wallet, 100, 1, &wrong_root, &[]).is_err());
    }

    #[test]
    fn test_merkle_proof_too_long() {
        use anchor_lang::prelude::Pubkey;

        let wallet = Pubkey::new_unique();
        let root = [0u8; 32];
        // MAX_MERKLE_PROOF_LEN = 20, provide 21 elements
        let proof = vec![[0u8; 32]; MAX_MERKLE_PROOF_LEN + 1];
        assert!(verify_merkle_proof(wallet, 100, 1, &root, &proof).is_err());
    }

    #[test]
    fn test_merkle_proof_two_leaves() {
        // Two-leaf tree: root = hash(sort(leaf1, leaf2))
        use anchor_lang::prelude::Pubkey;
        use solana_nostd_keccak::hashv;

        let wallet1 = Pubkey::new_unique();
        let wallet2 = Pubkey::new_unique();
        let amount = 500_000_000u64;
        let period_id = 1u32;

        let leaf1 = hashv(&[
            wallet1.as_ref(),
            &amount.to_le_bytes(),
            &period_id.to_le_bytes(),
        ]);
        let leaf2 = hashv(&[
            wallet2.as_ref(),
            &amount.to_le_bytes(),
            &period_id.to_le_bytes(),
        ]);

        // Build root by sorting
        let root = if leaf1 < leaf2 {
            hashv(&[&leaf1, &leaf2])
        } else {
            hashv(&[&leaf2, &leaf1])
        };

        // Proof for wallet1: sibling is leaf2
        let proof1 = vec![leaf2];
        assert!(verify_merkle_proof(wallet1, amount, period_id, &root, &proof1).is_ok());

        // Proof for wallet2: sibling is leaf1
        let proof2 = vec![leaf1];
        assert!(verify_merkle_proof(wallet2, amount, period_id, &root, &proof2).is_ok());
    }
}
