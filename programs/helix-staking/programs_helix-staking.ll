; ModuleID = 'LLVMDialectModule'
source_filename = "LLVMDialectModule"

@withdrawn_amount = internal constant [16 x i8] c"withdrawn_amount"
@is_claimed = internal constant [10 x i8] c"is_claimed"
@"self.reserved[0]" = internal constant [16 x i8] c"self.reserved[0]"
@active = internal constant [6 x i8] c"active"
@"&mutself" = internal constant [8 x i8] c"&mutself"
@self.reserved = internal constant [13 x i8] c"self.reserved"
@"&self" = internal constant [5 x i8] c"&self"
@"[u64;6]" = internal constant [7 x i8] c"[u64;6]"
@reserved = internal constant [8 x i8] c"reserved"
@total_admin_minted = internal constant [18 x i8] c"total_admin_minted"
@total_shares = internal constant [12 x i8] c"total_shares"
@total_tokens_unstaked = internal constant [21 x i8] c"total_tokens_unstaked"
@total_tokens_staked = internal constant [19 x i8] c"total_tokens_staked"
@total_claims_created = internal constant [20 x i8] c"total_claims_created"
@total_unstakes_created = internal constant [22 x i8] c"total_unstakes_created"
@total_stakes_created = internal constant [20 x i8] c"total_stakes_created"
@mint_authority_bump = internal constant [19 x i8] c"mint_authority_bump"
@bpd_finalize_period_id = internal constant [22 x i8] c"bpd_finalize_period_id"
@bpd_claim_period_id = internal constant [19 x i8] c"bpd_claim_period_id"
@bpd_bonus_pending = internal constant [17 x i8] c"bpd_bonus_pending"
@is_active = internal constant [9 x i8] c"is_active"
@bpd_original_unclaimed = internal constant [22 x i8] c"bpd_original_unclaimed"
@i64 = internal constant [3 x i8] c"i64"
@bpd_finalize_start_timestamp = internal constant [28 x i8] c"bpd_finalize_start_timestamp"
@bpd_stakes_distributed = internal constant [22 x i8] c"bpd_stakes_distributed"
@bpd_stakes_finalized = internal constant [20 x i8] c"bpd_stakes_finalized"
@bpd_snapshot_slot = internal constant [17 x i8] c"bpd_snapshot_slot"
@bpd_calculation_complete = internal constant [24 x i8] c"bpd_calculation_complete"
@bpd_helix_per_share_day = internal constant [23 x i8] c"bpd_helix_per_share_day"
@bpd_total_share_days = internal constant [20 x i8] c"bpd_total_share_days"
@bpd_remaining_unclaimed = internal constant [23 x i8] c"bpd_remaining_unclaimed"
@bump = internal constant [4 x i8] c"bump"
@bpd_total_distributed = internal constant [21 x i8] c"bpd_total_distributed"
@big_pay_day_complete = internal constant [20 x i8] c"big_pay_day_complete"
@bool = internal constant [4 x i8] c"bool"
@claim_period_started = internal constant [20 x i8] c"claim_period_started"
@claim_count = internal constant [11 x i8] c"claim_count"
@total_claimed = internal constant [13 x i8] c"total_claimed"
@"init,payer=authority,seeds=[MINT_SEED],bump,mint::decimals=TOKEN_DECIMALS,mint::authority=mint_authority,mint::token_program=token_program," = internal constant [139 x i8] c"init,payer=authority,seeds=[MINT_SEED],bump,mint::decimals=TOKEN_DECIMALS,mint::authority=mint_authority,mint::token_program=token_program,"
@"seeds=[MINT_AUTHORITY_SEED],bump," = internal constant [33 x i8] c"seeds=[MINT_AUTHORITY_SEED],bump,"
@"init,payer=authority,space=GlobalState::LEN,seeds=[GLOBAL_STATE_SEED],bump," = internal constant [75 x i8] c"init,payer=authority,space=GlobalState::LEN,seeds=[GLOBAL_STATE_SEED],bump,"
@max_admin_mint = internal constant [14 x i8] c"max_admin_mint"
@u8 = internal constant [2 x i8] c"u8"
@claim_period_days = internal constant [17 x i8] c"claim_period_days"
@starting_share_rate = internal constant [19 x i8] c"starting_share_rate"
@min_stake_amount = internal constant [16 x i8] c"min_stake_amount"
@annual_inflation_bp = internal constant [19 x i8] c"annual_inflation_bp"
@program_id = internal constant [10 x i8] c"program_id"
@"ctx:Context<AcceptAuthority>" = internal constant [28 x i8] c"ctx:Context<AcceptAuthority>"
@"new_authority:Pubkey" = internal constant [20 x i8] c"new_authority:Pubkey"
@"ctx:Context<TransferAuthority>" = internal constant [30 x i8] c"ctx:Context<TransferAuthority>"
@"new_slots_per_day:u64" = internal constant [21 x i8] c"new_slots_per_day:u64"
@"ctx:Context<AdminSetSlotsPerDay>" = internal constant [32 x i8] c"ctx:Context<AdminSetSlotsPerDay>"
@"new_end_slot:u64" = internal constant [16 x i8] c"new_end_slot:u64"
@"ctx:Context<AdminSetClaimEndSlot>" = internal constant [33 x i8] c"ctx:Context<AdminSetClaimEndSlot>"
@"ctx:Context<AbortBpd>" = internal constant [21 x i8] c"ctx:Context<AbortBpd>"
@"ctx:Context<MigrateStake>" = internal constant [25 x i8] c"ctx:Context<MigrateStake>"
@"expected_finalized_count:u32" = internal constant [28 x i8] c"expected_finalized_count:u32"
@"ctx:Context<SealBpdFinalize>" = internal constant [28 x i8] c"ctx:Context<SealBpdFinalize>"
@"proof:Vec<[u8;32]>" = internal constant [18 x i8] c"proof:Vec<[u8;32]>"
@"snapshot_balance:u64" = internal constant [20 x i8] c"snapshot_balance:u64"
@"ctx:Context<FreeClaim>" = internal constant [22 x i8] c"ctx:Context<FreeClaim>"
@"ctx:Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>" = internal constant [60 x i8] c"ctx:Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>"
@"ctx:Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>" = internal constant [54 x i8] c"ctx:Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>"
@"ctx:Context<WithdrawVested>" = internal constant [27 x i8] c"ctx:Context<WithdrawVested>"
@"claim_period_id:u32" = internal constant [19 x i8] c"claim_period_id:u32"
@"total_eligible:u32" = internal constant [18 x i8] c"total_eligible:u32"
@"total_claimable:u64" = internal constant [19 x i8] c"total_claimable:u64"
@"merkle_root:[u8;32]" = internal constant [19 x i8] c"merkle_root:[u8;32]"
@"ctx:Context<InitializeClaimPeriod>" = internal constant [34 x i8] c"ctx:Context<InitializeClaimPeriod>"
@"ctx:Context<AdminMint>" = internal constant [22 x i8] c"ctx:Context<AdminMint>"
@"ctx:Context<ClaimRewards>" = internal constant [25 x i8] c"ctx:Context<ClaimRewards>"
@"ctx:Context<Unstake>" = internal constant [20 x i8] c"ctx:Context<Unstake>"
@"ctx:Context<CrankDistribution>" = internal constant [30 x i8] c"ctx:Context<CrankDistribution>"
@"days:u16" = internal constant [8 x i8] c"days:u16"
@"amount:u64" = internal constant [10 x i8] c"amount:u64"
@"ctx:Context<'_,'_,'info,'info,CreateStake<'info>>" = internal constant [49 x i8] c"ctx:Context<'_,'_,'info,'info,CreateStake<'info>>"
@"params:InitializeParams" = internal constant [23 x i8] c"params:InitializeParams"
@"ctx:Context<Initialize>" = internal constant [23 x i8] c"ctx:Context<Initialize>"
@"global_state:global_state.key(),mint:global_state.mint,mint_authority:ctx.accounts.mint_authority.key(),authority:global_state.authority,annual_inflation_bp:global_state.annual_inflation_bp,min_stake_amount:global_state.min_stake_amount,starting_share_rate:global_state.starting_share_rate,slots_per_day:global_state.slots_per_day,}" = internal constant [332 x i8] c"global_state:global_state.key(),mint:global_state.mint,mint_authority:ctx.accounts.mint_authority.key(),authority:global_state.authority,annual_inflation_bp:global_state.annual_inflation_bp,min_stake_amount:global_state.min_stake_amount,starting_share_rate:global_state.starting_share_rate,slots_per_day:global_state.slots_per_day,}"
@"ProtocolInitialized{slot:clock.slot" = internal constant [35 x i8] c"ProtocolInitialized{slot:clock.slot"
@global_state.reserved = internal constant [21 x i8] c"global_state.reserved"
@"[0;6]" = internal constant [5 x i8] c"[0;6]"
@global_state.max_admin_mint = internal constant [27 x i8] c"global_state.max_admin_mint"
@params.max_admin_mint = internal constant [21 x i8] c"params.max_admin_mint"
@global_state.claim_period_days = internal constant [30 x i8] c"global_state.claim_period_days"
@params.claim_period_days = internal constant [24 x i8] c"params.claim_period_days"
@params.slots_per_day = internal constant [20 x i8] c"params.slots_per_day"
@global_state.starting_share_rate = internal constant [32 x i8] c"global_state.starting_share_rate"
@params.starting_share_rate = internal constant [26 x i8] c"params.starting_share_rate"
@global_state.min_stake_amount = internal constant [29 x i8] c"global_state.min_stake_amount"
@params.min_stake_amount = internal constant [23 x i8] c"params.min_stake_amount"
@params.annual_inflation_bp = internal constant [26 x i8] c"params.annual_inflation_bp"
@global_state.bump = internal constant [17 x i8] c"global_state.bump"
@ctx.bumps.global_state = internal constant [22 x i8] c"ctx.bumps.global_state"
@global_state.mint_authority_bump = internal constant [32 x i8] c"global_state.mint_authority_bump"
@ctx.bumps.mint_authority = internal constant [24 x i8] c"ctx.bumps.mint_authority"
@global_state.mint = internal constant [17 x i8] c"global_state.mint"
@global_state.authority = internal constant [22 x i8] c"global_state.authority"
@"params.slots_per_day>0" = internal constant [22 x i8] c"params.slots_per_day>0"
@InitializeParams = internal constant [16 x i8] c"InitializeParams"
@params = internal constant [6 x i8] c"params"
@"Context<Initialize>" = internal constant [19 x i8] c"Context<Initialize>"
@"expected_bump,HelixError::InvalidBumpSeed" = internal constant [41 x i8] c"expected_bump,HelixError::InvalidBumpSeed"
@stake.bump = internal constant [10 x i8] c"stake.bump"
@"expected_pda,HelixError::InvalidPDA" = internal constant [35 x i8] c"expected_pda,HelixError::InvalidPDA"
@"account_info.key()" = internal constant [18 x i8] c"account_info.key()"
@"(expected_pda,expected_bump)" = internal constant [28 x i8] c"(expected_pda,expected_bump)"
@"(HelixError::InvalidPDA)" = internal constant [24 x i8] c"(HelixError::InvalidPDA)"
@"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),]" = internal constant [63 x i8] c"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),]"
@"&StakeAccount" = internal constant [13 x i8] c"&StakeAccount"
@"authority:ctx.accounts.authority.key(),recipient:ctx.accounts.recipient_token_account.key(),amount,}" = internal constant [100 x i8] c"authority:ctx.accounts.authority.key(),recipient:ctx.accounts.recipient_token_account.key(),amount,}"
@"AdminMinted{slot:Clock::get()?.slot" = internal constant [35 x i8] c"AdminMinted{slot:Clock::get()?.slot"
@ctx.accounts.recipient_token_account = internal constant [36 x i8] c"ctx.accounts.recipient_token_account"
@"[&mint_authority_seeds[..]]" = internal constant [27 x i8] c"[&mint_authority_seeds[..]]"
@mint_authority_seeds = internal constant [20 x i8] c"mint_authority_seeds"
@"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump],]" = internal constant [58 x i8] c"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump],]"
@"HelixError::AdminMintCapExceeded" = internal constant [32 x i8] c"HelixError::AdminMintCapExceeded"
@"new_total<=global_state.max_admin_mint" = internal constant [38 x i8] c"new_total<=global_state.max_admin_mint"
@new_total = internal constant [9 x i8] c"new_total"
@global_state.total_admin_minted = internal constant [31 x i8] c"global_state.total_admin_minted"
@"Context<AdminMint>" = internal constant [18 x i8] c"Context<AdminMint>"
@recipient_token_account = internal constant [23 x i8] c"recipient_token_account"
@"mut,constraint=recipient_token_account.mint==global_state.mint@HelixError::InvalidParameter," = internal constant [92 x i8] c"mut,constraint=recipient_token_account.mint==global_state.mint@HelixError::InvalidParameter,"
@"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized," = internal constant [129 x i8] c"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized,"
@"timestamp:clock.unix_timestamp,claim_period_id,merkle_root,total_claimable,total_eligible,claim_deadline_slot:end_slot,}" = internal constant [120 x i8] c"timestamp:clock.unix_timestamp,claim_period_id,merkle_root,total_claimable,total_eligible,claim_deadline_slot:end_slot,}"
@"ClaimPeriodStarted{slot:clock.slot" = internal constant [34 x i8] c"ClaimPeriodStarted{slot:clock.slot"
@claim_config.bump = internal constant [17 x i8] c"claim_config.bump"
@ctx.bumps.claim_config = internal constant [22 x i8] c"ctx.bumps.claim_config"
@claim_config.total_eligible = internal constant [27 x i8] c"claim_config.total_eligible"
@claim_config.authority = internal constant [22 x i8] c"claim_config.authority"
@ctx.accounts.authority = internal constant [22 x i8] c"ctx.accounts.authority"
@CLAIM_PERIOD_DAYS = internal constant [17 x i8] c"CLAIM_PERIOD_DAYS"
@"HelixError::InvalidClaimPeriodId" = internal constant [32 x i8] c"HelixError::InvalidClaimPeriodId"
@"claim_period_id>0" = internal constant [17 x i8] c"claim_period_id>0"
@total_eligible = internal constant [14 x i8] c"total_eligible"
@total_claimable = internal constant [15 x i8] c"total_claimable"
@"[u8;32]" = internal constant [7 x i8] c"[u8;32]"
@"Context<InitializeClaimPeriod>" = internal constant [30 x i8] c"Context<InitializeClaimPeriod>"
@"init,payer=authority,space=ClaimConfig::LEN,seeds=[CLAIM_CONFIG_SEED],bump," = internal constant [75 x i8] c"init,payer=authority,space=ClaimConfig::LEN,seeds=[CLAIM_CONFIG_SEED],bump,"
@"mut,constraint=authority.key()==global_state.authority@HelixError::Unauthorized" = internal constant [79 x i8] c"mut,constraint=authority.key()==global_state.authority@HelixError::Unauthorized"
@"Context<MigrateStake>" = internal constant [21 x i8] c"Context<MigrateStake>"
@_ctx = internal constant [4 x i8] c"_ctx"
@"mut,seeds=[STAKE_SEED,stake_account.user.as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==payer.key()@HelixError::UnauthorizedStakeAccess,realloc=StakeAccount::LEN,realloc::payer=payer,realloc::zero=false," = internal constant [259 x i8] c"mut,seeds=[STAKE_SEED,stake_account.user.as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==payer.key()@HelixError::UnauthorizedStakeAccess,realloc=StakeAccount::LEN,realloc::payer=payer,realloc::zero=false,"
@payer = internal constant [5 x i8] c"payer"
@ctx.accounts.global_state.slots_per_day = internal constant [39 x i8] c"ctx.accounts.global_state.slots_per_day"
@"new_slots_per_day<=upper_bound" = internal constant [30 x i8] c"new_slots_per_day<=upper_bound"
@upper_bound = internal constant [11 x i8] c"upper_bound"
@DEFAULT_SLOTS_PER_DAY = internal constant [21 x i8] c"DEFAULT_SLOTS_PER_DAY"
@"new_slots_per_day>0" = internal constant [19 x i8] c"new_slots_per_day>0"
@new_slots_per_day = internal constant [17 x i8] c"new_slots_per_day"
@"Context<AdminSetSlotsPerDay>" = internal constant [28 x i8] c"Context<AdminSetSlotsPerDay>"
@LOYALTY_MAX_BONUS = internal constant [17 x i8] c"LOYALTY_MAX_BONUS"
@capped_days = internal constant [11 x i8] c"capped_days"
@days_served = internal constant [11 x i8] c"days_served"
@committed_days = internal constant [14 x i8] c"committed_days"
@day = internal constant [3 x i8] c"day"
@init_slot = internal constant [9 x i8] c"init_slot"
@"(HelixError::RewardDebtOverflow)" = internal constant [32 x i8] c"(HelixError::RewardDebtOverflow)"
@pending_128 = internal constant [11 x i8] c"pending_128"
@current_value = internal constant [13 x i8] c"current_value"
@current_share_rate = internal constant [18 x i8] c"current_share_rate"
@capped_bps = internal constant [10 x i8] c"capped_bps"
@LATE_PENALTY_WINDOW_DAYS = internal constant [24 x i8] c"LATE_PENALTY_WINDOW_DAYS"
@penalty_days = internal constant [12 x i8] c"penalty_days"
@GRACE_PERIOD_DAYS = internal constant [17 x i8] c"GRACE_PERIOD_DAYS"
@late_days = internal constant [9 x i8] c"late_days"
@slots_late = internal constant [10 x i8] c"slots_late"
@final_penalty_bps = internal constant [17 x i8] c"final_penalty_bps"
@served_fraction_bps = internal constant [19 x i8] c"served_fraction_bps"
@total_duration = internal constant [14 x i8] c"total_duration"
@penalty_bps = internal constant [11 x i8] c"penalty_bps"
@MIN_PENALTY_BPS = internal constant [15 x i8] c"MIN_PENALTY_BPS"
@t_shares_u128 = internal constant [13 x i8] c"t_shares_u128"
@share_rate_u128 = internal constant [15 x i8] c"share_rate_u128"
@multiplier_u128 = internal constant [15 x i8] c"multiplier_u128"
@amount_u128 = internal constant [11 x i8] c"amount_u128"
@bpb_bonus = internal constant [9 x i8] c"bpb_bonus"
@lpb_bonus = internal constant [9 x i8] c"lpb_bonus"
@"HelixError::InvalidParameter" = internal constant [28 x i8] c"HelixError::InvalidParameter"
@"share_rate>0" = internal constant [12 x i8] c"share_rate>0"
@share_rate = internal constant [10 x i8] c"share_rate"
@final_bonus = internal constant [11 x i8] c"final_bonus"
@BPB_MAX_BONUS = internal constant [13 x i8] c"BPB_MAX_BONUS"
@"150_000_000u128" = internal constant [15 x i8] c"150_000_000u128"
@BPB_TIER_3 = internal constant [10 x i8] c"BPB_TIER_3"
@tier_bonus = internal constant [10 x i8] c"tier_bonus"
@"250_000_000u128" = internal constant [15 x i8] c"250_000_000u128"
@tier_range = internal constant [10 x i8] c"tier_range"
@BPB_TIER_2 = internal constant [10 x i8] c"BPB_TIER_2"
@excess = internal constant [6 x i8] c"excess"
@BPB_THRESHOLD = internal constant [13 x i8] c"BPB_THRESHOLD"
@amount_div_10 = internal constant [13 x i8] c"amount_div_10"
@days_minus_one = internal constant [14 x i8] c"days_minus_one"
@LPB_MAX_DAYS = internal constant [12 x i8] c"LPB_MAX_DAYS"
@stake_days = internal constant [10 x i8] c"stake_days"
@"2" = internal constant [1 x i8] c"2"
@numerator = internal constant [9 x i8] c"numerator"
@rounding = internal constant [8 x i8] c"rounding"
@"(HelixError::InvalidDivisor)" = internal constant [28 x i8] c"(HelixError::InvalidDivisor)"
@product = internal constant [7 x i8] c"product"
@c_u128 = internal constant [6 x i8] c"c_u128"
@b_u128 = internal constant [6 x i8] c"b_u128"
@a_u128 = internal constant [6 x i8] c"a_u128"
@result = internal constant [6 x i8] c"result"
@"c>0" = internal constant [3 x i8] c"c>0"
@c = internal constant [1 x i8] c"c"
@b = internal constant [1 x i8] c"b"
@a = internal constant [1 x i8] c"a"
@"user:stake_user,stake_id,original_amount:staked_amount,return_amount,penalty_amount:penalty,penalty_type,rewards_claimed:loyalty_adjusted_rewards.checked_add(bpd_bonus).ok_or(HelixError::Overflow)?,}" = internal constant [199 x i8] c"user:stake_user,stake_id,original_amount:staked_amount,return_amount,penalty_amount:penalty,penalty_type,rewards_claimed:loyalty_adjusted_rewards.checked_add(bpd_bonus).ok_or(HelixError::Overflow)?,}"
@"StakeEnded{slot:clock.slot" = internal constant [26 x i8] c"StakeEnded{slot:clock.slot"
@global_state.total_tokens_unstaked = internal constant [34 x i8] c"global_state.total_tokens_unstaked"
@global_state.total_unstakes_created = internal constant [35 x i8] c"global_state.total_unstakes_created"
@stake_mut.is_active = internal constant [19 x i8] c"stake_mut.is_active"
@return_amount = internal constant [13 x i8] c"return_amount"
@"(penalty,penalty_type)" = internal constant [22 x i8] c"(penalty,penalty_type)"
@stake.staked_amount = internal constant [19 x i8] c"stake.staked_amount"
@stake_user = internal constant [10 x i8] c"stake_user"
@"HelixError::UnstakeBlockedDuringBpd" = internal constant [35 x i8] c"HelixError::UnstakeBlockedDuringBpd"
@"!global_state.is_bpd_window_active()" = internal constant [36 x i8] c"!global_state.is_bpd_window_active()"
@"Context<Unstake>" = internal constant [16 x i8] c"Context<Unstake>"
@total_mint_amount = internal constant [17 x i8] c"total_mint_amount"
@penalty_share_increase = internal constant [22 x i8] c"penalty_share_increase"
@penalty = internal constant [7 x i8] c"penalty"
@"penalty_amount,2u8" = internal constant [18 x i8] c"penalty_amount,2u8"
@"0u64,0u8" = internal constant [8 x i8] c"0u64,0u8"
@"penalty_amount,1u8" = internal constant [18 x i8] c"penalty_amount,1u8"
@penalty_amount = internal constant [14 x i8] c"penalty_amount"
@staked_amount = internal constant [13 x i8] c"staked_amount"
@"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeAlreadyClosed," = internal constant [249 x i8] c"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeAlreadyClosed,"
@"HelixError::AdminBoundsExceeded" = internal constant [31 x i8] c"HelixError::AdminBoundsExceeded"
@"new_end_slot>=min_end_slot" = internal constant [26 x i8] c"new_end_slot>=min_end_slot"
@min_end_slot = internal constant [12 x i8] c"min_end_slot"
@new_end_slot = internal constant [12 x i8] c"new_end_slot"
@"Context<AdminSetClaimEndSlot>" = internal constant [29 x i8] c"Context<AdminSetClaimEndSlot>"
@"AuthorityTransferInitiated{old_authority:ctx.accounts.authority.key()" = internal constant [69 x i8] c"AuthorityTransferInitiated{old_authority:ctx.accounts.authority.key()"
@pending.bump = internal constant [12 x i8] c"pending.bump"
@ctx.bumps.pending_authority = internal constant [27 x i8] c"ctx.bumps.pending_authority"
@pending.new_authority = internal constant [21 x i8] c"pending.new_authority"
@pending = internal constant [7 x i8] c"pending"
@ctx.accounts.pending_authority = internal constant [30 x i8] c"ctx.accounts.pending_authority"
@"Context<TransferAuthority>" = internal constant [26 x i8] c"Context<TransferAuthority>"
@"cancelled_new_authority:pending.new_authority,}" = internal constant [47 x i8] c"cancelled_new_authority:pending.new_authority,}"
@"AuthorityTransferCancelled{authority:ctx.accounts.authority.key()" = internal constant [65 x i8] c"AuthorityTransferCancelled{authority:ctx.accounts.authority.key()"
@"init_if_needed,payer=authority,space=PendingAuthority::LEN,seeds=[PENDING_AUTHORITY_SEED],bump," = internal constant [95 x i8] c"init_if_needed,payer=authority,space=PendingAuthority::LEN,seeds=[PENDING_AUTHORITY_SEED],bump,"
@"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized," = internal constant [125 x i8] c"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized,"
@"HelixError::BpdFinalizeCountMismatch" = internal constant [36 x i8] c"HelixError::BpdFinalizeCountMismatch"
@"claim_config.bpd_stakes_finalized==expected_finalized_count" = internal constant [59 x i8] c"claim_config.bpd_stakes_finalized==expected_finalized_count"
@"HelixError::BpdSealTooEarly" = internal constant [27 x i8] c"HelixError::BpdSealTooEarly"
@"clock.unix_timestamp>=claim_config.bpd_finalize_start_timestamp.checked_add(BPD_SEAL_DELAY_SECONDS).ok_or(error!(HelixError::Overflow))?" = internal constant [136 x i8] c"clock.unix_timestamp>=claim_config.bpd_finalize_start_timestamp.checked_add(BPD_SEAL_DELAY_SECONDS).ok_or(error!(HelixError::Overflow))?"
@"claim_config.bpd_finalize_start_timestamp>0" = internal constant [43 x i8] c"claim_config.bpd_finalize_start_timestamp>0"
@"HelixError::BpdFinalizationIncomplete" = internal constant [37 x i8] c"HelixError::BpdFinalizationIncomplete"
@"claim_config.bpd_stakes_finalized>0" = internal constant [35 x i8] c"claim_config.bpd_stakes_finalized>0"
@expected_finalized_count = internal constant [24 x i8] c"expected_finalized_count"
@"Context<SealBpdFinalize>" = internal constant [24 x i8] c"Context<SealBpdFinalize>"
@"constraint=authority.key()==global_state.authority@HelixError::Unauthorized" = internal constant [75 x i8] c"constraint=authority.key()==global_state.authority@HelixError::Unauthorized"
@"stakes_finalized,stakes_distributed,}" = internal constant [37 x i8] c"stakes_finalized,stakes_distributed,}"
@"BpdAborted{claim_period_id:claim_config.claim_period_id" = internal constant [55 x i8] c"BpdAborted{claim_period_id:claim_config.claim_period_id"
@stakes_distributed = internal constant [18 x i8] c"stakes_distributed"
@stakes_finalized = internal constant [16 x i8] c"stakes_finalized"
@"HelixError::BpdDistributionAlreadyStarted" = internal constant [41 x i8] c"HelixError::BpdDistributionAlreadyStarted"
@"claim_config.bpd_stakes_distributed==0" = internal constant [38 x i8] c"claim_config.bpd_stakes_distributed==0"
@"Context<AbortBpd>" = internal constant [17 x i8] c"Context<AbortBpd>"
@"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump," = internal constant [53 x i8] c"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,"
@"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,has_one=authority," = internal constant [71 x i8] c"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,has_one=authority,"
@"bonus_bpsasu16,base_amount,bonus_amount" = internal constant [39 x i8] c"bonus_bpsasu16,base_amount,bonus_amount"
@SPEED_BONUS_WEEK4_END = internal constant [21 x i8] c"SPEED_BONUS_WEEK4_END"
@SPEED_BONUS_WEEK1_END = internal constant [21 x i8] c"SPEED_BONUS_WEEK1_END"
@"10" = internal constant [2 x i8] c"10"
@HELIX_PER_SOL = internal constant [13 x i8] c"HELIX_PER_SOL"
@SPEED_BONUS_WEEK2_4_BPS = internal constant [23 x i8] c"SPEED_BONUS_WEEK2_4_BPS"
@SPEED_BONUS_WEEK1_BPS = internal constant [21 x i8] c"SPEED_BONUS_WEEK1_BPS"
@elapsed_slots = internal constant [13 x i8] c"elapsed_slots"
@slots_per_day = internal constant [13 x i8] c"slots_per_day"
@start_slot = internal constant [10 x i8] c"start_slot"
@"hash==*merkle_root" = internal constant [18 x i8] c"hash==*merkle_root"
@"free_claim::verify_merkle_proof.anon.3.1" = internal constant [38 x i8] c"free_claim::verify_merkle_proof.anon.3"
@"[snapshot_wallet.as_ref(),&amount.to_le_bytes(),&claim_period_id.to_le_bytes(),]" = internal constant [80 x i8] c"[snapshot_wallet.as_ref(),&amount.to_le_bytes(),&claim_period_id.to_le_bytes(),]"
@"HelixError::InvalidMerkleProof" = internal constant [30 x i8] c"HelixError::InvalidMerkleProof"
@"proof.len()<=MAX_MERKLE_PROOF_LEN" = internal constant [33 x i8] c"proof.len()<=MAX_MERKLE_PROOF_LEN"
@"&[[u8;32]]" = internal constant [10 x i8] c"&[[u8;32]]"
@"&[u8;32]" = internal constant [8 x i8] c"&[u8;32]"
@merkle_root = internal constant [11 x i8] c"merkle_root"
@u32 = internal constant [3 x i8] c"u32"
@claim_period_id = internal constant [15 x i8] c"claim_period_id"
@sibling = internal constant [7 x i8] c"sibling"
@hash = internal constant [4 x i8] c"hash"
@"[sibling,&hash]" = internal constant [15 x i8] c"[sibling,&hash]"
@"[&hash,sibling]" = internal constant [15 x i8] c"[&hash,sibling]"
@"signed_message==expected_message.as_bytes()" = internal constant [43 x i8] c"signed_message==expected_message.as_bytes()"
@signed_message = internal constant [14 x i8] c"signed_message"
@"ix_data.len()>=msg_offset+msg_len" = internal constant [33 x i8] c"ix_data.len()>=msg_offset+msg_len"
@"signed_pubkey==snapshot_wallet" = internal constant [30 x i8] c"signed_pubkey==snapshot_wallet"
@signed_pubkey = internal constant [13 x i8] c"signed_pubkey"
@"ix_data.len()>=pubkey_offset+32" = internal constant [31 x i8] c"ix_data.len()>=pubkey_offset+32"
@msg_len = internal constant [7 x i8] c"msg_len"
@"[ix_data[12],ix_data[13]]" = internal constant [25 x i8] c"[ix_data[12],ix_data[13]]"
@msg_offset = internal constant [10 x i8] c"msg_offset"
@"[ix_data[10],ix_data[11]]" = internal constant [25 x i8] c"[ix_data[10],ix_data[11]]"
@pubkey_offset = internal constant [13 x i8] c"pubkey_offset"
@"[ix_data[6],ix_data[7]]" = internal constant [23 x i8] c"[ix_data[6],ix_data[7]]"
@"HelixError::InvalidSignature" = internal constant [28 x i8] c"HelixError::InvalidSignature"
@"ix_data.len()>=16" = internal constant [17 x i8] c"ix_data.len()>=16"
@ix_data = internal constant [7 x i8] c"ix_data"
@ed25519_ix.data = internal constant [15 x i8] c"ed25519_ix.data"
@expected_message = internal constant [16 x i8] c"expected_message"
@"(\22HELIX:claim:{}:{}\22,snapshot_wallet,amount)" = internal constant [44 x i8] c"(\22HELIX:claim:{}:{}\22,snapshot_wallet,amount)"
@"ed25519_ix.program_id==ed25519_program::ID" = internal constant [42 x i8] c"ed25519_ix.program_id==ed25519_program::ID"
@ed25519_ix = internal constant [10 x i8] c"ed25519_ix"
@usize = internal constant [5 x i8] c"usize"
@"HelixError::MissingEd25519Instruction" = internal constant [37 x i8] c"HelixError::MissingEd25519Instruction"
@"current_ix_index>0" = internal constant [18 x i8] c"current_ix_index>0"
@current_ix_index = internal constant [16 x i8] c"current_ix_index"
@Pubkey = internal constant [6 x i8] c"Pubkey"
@"&AccountInfo" = internal constant [12 x i8] c"&AccountInfo"
@"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),snapshot_wallet:ctx.accounts.snapshot_wallet.key(),claim_period_id:claim_config.claim_period_id,snapshot_balance,base_amount,bonus_bps,days_elapsed:days_elapsedasu16,total_amount,immediate_amount,vesting_amount,vesting_end_slot,}" = internal constant [295 x i8] c"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),snapshot_wallet:ctx.accounts.snapshot_wallet.key(),claim_period_id:claim_config.claim_period_id,snapshot_balance,base_amount,bonus_bps,days_elapsed:days_elapsedasu16,total_amount,immediate_amount,vesting_amount,vesting_end_slot,}"
@"TokensClaimed{slot:clock.slot" = internal constant [29 x i8] c"TokensClaimed{slot:clock.slot"
@claim_config.claim_count = internal constant [24 x i8] c"claim_config.claim_count"
@claim_status.bump = internal constant [17 x i8] c"claim_status.bump"
@ctx.bumps.claim_status = internal constant [22 x i8] c"ctx.bumps.claim_status"
@claim_status.snapshot_wallet = internal constant [28 x i8] c"claim_status.snapshot_wallet"
@claim_status.bonus_bps = internal constant [22 x i8] c"claim_status.bonus_bps"
@bonus_bps = internal constant [9 x i8] c"bonus_bps"
@claim_status.is_claimed = internal constant [23 x i8] c"claim_status.is_claimed"
@VESTING_DAYS = internal constant [12 x i8] c"VESTING_DAYS"
@vesting_amount = internal constant [14 x i8] c"vesting_amount"
@immediate_amount = internal constant [16 x i8] c"immediate_amount"
@"total_amount>0" = internal constant [14 x i8] c"total_amount>0"
@total_amount = internal constant [12 x i8] c"total_amount"
@bonus_amount = internal constant [12 x i8] c"bonus_amount"
@base_amount = internal constant [11 x i8] c"base_amount"
@"(bonus_bps,base_amount,bonus_amount)" = internal constant [36 x i8] c"(bonus_bps,base_amount,bonus_amount)"
@claim_config.merkle_root = internal constant [24 x i8] c"claim_config.merkle_root"
@ctx.accounts.snapshot_wallet = internal constant [28 x i8] c"ctx.accounts.snapshot_wallet"
@ctx.accounts.instructions_sysvar = internal constant [32 x i8] c"ctx.accounts.instructions_sysvar"
@"HelixError::SnapshotBalanceTooLow" = internal constant [33 x i8] c"HelixError::SnapshotBalanceTooLow"
@"snapshot_balance>=MIN_SOL_BALANCE" = internal constant [33 x i8] c"snapshot_balance>=MIN_SOL_BALANCE"
@"HelixError::ClaimPeriodEnded" = internal constant [28 x i8] c"HelixError::ClaimPeriodEnded"
@"clock.slot<=claim_config.end_slot" = internal constant [33 x i8] c"clock.slot<=claim_config.end_slot"
@"Vec<[u8;32]>" = internal constant [12 x i8] c"Vec<[u8;32]>"
@proof = internal constant [5 x i8] c"proof"
@snapshot_balance = internal constant [16 x i8] c"snapshot_balance"
@"Context<FreeClaim>" = internal constant [18 x i8] c"Context<FreeClaim>"
@instructions_sysvar = internal constant [19 x i8] c"instructions_sysvar"
@"address=ix_sysvar::ID" = internal constant [21 x i8] c"address=ix_sysvar::ID"
@"init,payer=claimer,space=ClaimStatus::LEN,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],snapshot_wallet.key().as_ref()],bump," = internal constant [156 x i8] c"init,payer=claimer,space=ClaimStatus::LEN,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],snapshot_wallet.key().as_ref()],bump,"
@"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted," = internal constant [132 x i8] c"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,"
@snapshot_wallet = internal constant [15 x i8] c"snapshot_wallet"
@"constraint=snapshot_wallet.key()==claimer.key()@HelixError::Unauthorized" = internal constant [72 x i8] c"constraint=snapshot_wallet.key()==claimer.key()@HelixError::Unauthorized"
@"new_authority,}" = internal constant [15 x i8] c"new_authority,}"
@"AuthorityTransferCompleted{old_authority" = internal constant [40 x i8] c"AuthorityTransferCompleted{old_authority"
@ctx.accounts.new_authority = internal constant [26 x i8] c"ctx.accounts.new_authority"
@old_authority = internal constant [13 x i8] c"old_authority"
@ctx.accounts.global_state.authority = internal constant [35 x i8] c"ctx.accounts.global_state.authority"
@"Context<AcceptAuthority>" = internal constant [24 x i8] c"Context<AcceptAuthority>"
@new_authority = internal constant [13 x i8] c"new_authority"
@"mut,constraint=new_authority.key()==pending_authority.new_authority@HelixError::UnauthorizedNewAuthority," = internal constant [105 x i8] c"mut,constraint=new_authority.key()==pending_authority.new_authority@HelixError::UnauthorizedNewAuthority,"
@"Account<'info,PendingAuthority>" = internal constant [31 x i8] c"Account<'info,PendingAuthority>"
@pending_authority = internal constant [17 x i8] c"pending_authority"
@"mut,seeds=[PENDING_AUTHORITY_SEED],bump=pending_authority.bump,close=new_authority," = internal constant [83 x i8] c"mut,seeds=[PENDING_AUTHORITY_SEED],bump=pending_authority.bump,close=new_authority,"
@"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=!global_state.is_bpd_window_active()@HelixError::AuthorityTransferBlockedDuringBpd," = internal constant [147 x i8] c"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=!global_state.is_bpd_window_active()@HelixError::AuthorityTransferBlockedDuringBpd,"
@"user,stake_id,amount:total_rewards,}" = internal constant [36 x i8] c"user,stake_id,amount:total_rewards,}"
@"RewardsClaimed{slot:clock.slot" = internal constant [30 x i8] c"RewardsClaimed{slot:clock.slot"
@cpi_ctx = internal constant [7 x i8] c"cpi_ctx"
@cpi_accounts = internal constant [12 x i8] c"cpi_accounts"
@global_state.total_claims_created = internal constant [33 x i8] c"global_state.total_claims_created"
@stake_mut.reward_debt = internal constant [21 x i8] c"stake_mut.reward_debt"
@stake_mut = internal constant [9 x i8] c"stake_mut"
@"HelixError::ClaimAmountZero" = internal constant [27 x i8] c"HelixError::ClaimAmountZero"
@"total_rewards>0" = internal constant [15 x i8] c"total_rewards>0"
@total_rewards = internal constant [13 x i8] c"total_rewards"
@bpd_bonus = internal constant [9 x i8] c"bpd_bonus"
@loyalty_adjusted_rewards = internal constant [24 x i8] c"loyalty_adjusted_rewards"
@stake.stake_days = internal constant [16 x i8] c"stake.stake_days"
@stake.reward_debt = internal constant [17 x i8] c"stake.reward_debt"
@stake.user = internal constant [10 x i8] c"stake.user"
@stake_id = internal constant [8 x i8] c"stake_id"
@stake.stake_id = internal constant [14 x i8] c"stake.stake_id"
@"Context<ClaimRewards>" = internal constant [21 x i8] c"Context<ClaimRewards>"
@stake_mut.bpd_bonus_pending = internal constant [27 x i8] c"stake_mut.bpd_bonus_pending"
@adjusted = internal constant [8 x i8] c"adjusted"
@"(HelixError::DivisionByZero)" = internal constant [28 x i8] c"(HelixError::DivisionByZero)"
@pending_rewards = internal constant [15 x i8] c"pending_rewards"
@total_multiplier = internal constant [16 x i8] c"total_multiplier"
@loyalty_bonus = internal constant [13 x i8] c"loyalty_bonus"
@"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeNotActive,realloc=StakeAccount::LEN,realloc::payer=user,realloc::zero=false," = internal constant [311 x i8] c"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeNotActive,realloc=StakeAccount::LEN,realloc::payer=user,realloc::zero=false,"
@"user:ctx.accounts.user.key(),stake_id:stake_account.stake_id,amount,t_shares,days,share_rate:global_state.share_rate,}" = internal constant [118 x i8] c"user:ctx.accounts.user.key(),stake_id:stake_account.stake_id,amount,t_shares,days,share_rate:global_state.share_rate,}"
@"StakeCreated{slot:clock.slot" = internal constant [28 x i8] c"StakeCreated{slot:clock.slot"
@from = internal constant [4 x i8] c"from"
@ctx.accounts.user_token_account = internal constant [31 x i8] c"ctx.accounts.user_token_account"
@stake_account.claim_period_start_slot = internal constant [37 x i8] c"stake_account.claim_period_start_slot"
@claim_period_start_slot = internal constant [23 x i8] c"claim_period_start_slot"
@stake_account.bpd_eligible = internal constant [26 x i8] c"stake_account.bpd_eligible"
@bpd_eligible = internal constant [12 x i8] c"bpd_eligible"
@"(bpd_eligible,claim_period_start_slot)" = internal constant [38 x i8] c"(bpd_eligible,claim_period_start_slot)"
@stake_account.bpd_bonus_pending = internal constant [31 x i8] c"stake_account.bpd_bonus_pending"
@stake_account.bump = internal constant [18 x i8] c"stake_account.bump"
@ctx.bumps.stake_account = internal constant [23 x i8] c"ctx.bumps.stake_account"
@stake_account.is_active = internal constant [23 x i8] c"stake_account.is_active"
@stake_account.reward_debt = internal constant [25 x i8] c"stake_account.reward_debt"
@stake_account.stake_days = internal constant [24 x i8] c"stake_account.stake_days"
@stake_account.end_slot = internal constant [22 x i8] c"stake_account.end_slot"
@stake_account.start_slot = internal constant [24 x i8] c"stake_account.start_slot"
@stake_account.t_shares = internal constant [22 x i8] c"stake_account.t_shares"
@stake_account.staked_amount = internal constant [27 x i8] c"stake_account.staked_amount"
@stake_account.stake_id = internal constant [22 x i8] c"stake_account.stake_id"
@global_state.total_stakes_created = internal constant [33 x i8] c"global_state.total_stakes_created"
@stake_account.user = internal constant [18 x i8] c"stake_account.user"
@ctx.accounts.user = internal constant [17 x i8] c"ctx.accounts.user"
@reward_debt = internal constant [11 x i8] c"reward_debt"
@end_slot = internal constant [8 x i8] c"end_slot"
@t_shares = internal constant [8 x i8] c"t_shares"
@"HelixError::InvalidStakeDuration" = internal constant [32 x i8] c"HelixError::InvalidStakeDuration"
@"days>=1&&days<=MAX_STAKE_DAYSasu16" = internal constant [34 x i8] c"days>=1&&days<=MAX_STAKE_DAYSasu16"
@"HelixError::StakeBelowMinimum" = internal constant [29 x i8] c"HelixError::StakeBelowMinimum"
@"amount>=global_state.min_stake_amount" = internal constant [37 x i8] c"amount>=global_state.min_stake_amount"
@ctx.accounts.stake_account = internal constant [26 x i8] c"ctx.accounts.stake_account"
@u16 = internal constant [3 x i8] c"u16"
@days = internal constant [4 x i8] c"days"
@"Context<'_,'_,'info,'info,CreateStake<'info>>" = internal constant [45 x i8] c"Context<'_,'_,'info,'info,CreateStake<'info>>"
@expected_pda = internal constant [12 x i8] c"expected_pda"
@"(expected_pda,_)" = internal constant [16 x i8] c"(expected_pda,_)"
@ctx.program_id = internal constant [14 x i8] c"ctx.program_id"
@"[CLAIM_CONFIG_SEED]" = internal constant [19 x i8] c"[CLAIM_CONFIG_SEED]"
@"Account::<ClaimConfig>::try_from(claim_config_info)" = internal constant [51 x i8] c"Account::<ClaimConfig>::try_from(claim_config_info)"
@claim_config_info = internal constant [17 x i8] c"claim_config_info"
@claim_config.claim_period_started = internal constant [33 x i8] c"claim_config.claim_period_started"
@"false,0" = internal constant [7 x i8] c"false,0"
@"true,claim_config.start_slot" = internal constant [28 x i8] c"true,claim_config.start_slot"
@"Program<'info,System>" = internal constant [21 x i8] c"Program<'info,System>"
@system_program = internal constant [14 x i8] c"system_program"
@user_token_account = internal constant [18 x i8] c"user_token_account"
@"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program," = internal constant [111 x i8] c"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,"
@"Account<'info,StakeAccount>" = internal constant [27 x i8] c"Account<'info,StakeAccount>"
@stake_account = internal constant [13 x i8] c"stake_account"
@"init,payer=user,space=StakeAccount::LEN,seeds=[STAKE_SEED,user.key().as_ref(),&global_state.total_stakes_created.to_le_bytes()],bump," = internal constant [133 x i8] c"init,payer=user,space=StakeAccount::LEN,seeds=[STAKE_SEED,user.key().as_ref(),&global_state.total_stakes_created.to_le_bytes()],bump,"
@user = internal constant [4 x i8] c"user"
@"batch_stakes_processed,total_stakes_finalized:claim_config.bpd_stakes_finalized,cumulative_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,timestamp:clock.unix_timestamp,}" = internal constant [193 x i8] c"batch_stakes_processed,total_stakes_finalized:claim_config.bpd_stakes_finalized,cumulative_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,timestamp:clock.unix_timestamp,}"
@"BpdBatchFinalized{claim_period_id:claim_config.claim_period_id" = internal constant [62 x i8] c"BpdBatchFinalized{claim_period_id:claim_config.claim_period_id"
@batch_stakes_processed = internal constant [22 x i8] c"batch_stakes_processed"
@"finalize_bpd_calculation::finalize_bpd_calculation.anon.4.2" = internal constant [57 x i8] c"finalize_bpd_calculation::finalize_bpd_calculation.anon.4"
@unclaimed_amount = internal constant [16 x i8] c"unclaimed_amount"
@finalized_before = internal constant [16 x i8] c"finalized_before"
@is_first_batch = internal constant [14 x i8] c"is_first_batch"
@claim_config.bpd_total_share_days = internal constant [33 x i8] c"claim_config.bpd_total_share_days"
@"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>" = internal constant [56 x i8] c"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>"
@batch_share_days = internal constant [16 x i8] c"batch_share_days"
@MAX_STAKES_PER_FINALIZE = internal constant [23 x i8] c"MAX_STAKES_PER_FINALIZE"
@claim_config.bpd_calculation_complete = internal constant [37 x i8] c"claim_config.bpd_calculation_complete"
@claim_config.bpd_finalize_start_timestamp = internal constant [41 x i8] c"claim_config.bpd_finalize_start_timestamp"
@clock.unix_timestamp = internal constant [20 x i8] c"clock.unix_timestamp"
@amount = internal constant [6 x i8] c"amount"
@claim_config.total_claimed = internal constant [26 x i8] c"claim_config.total_claimed"
@claim_config.total_claimable = internal constant [28 x i8] c"claim_config.total_claimable"
@"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.bpd_calculation_complete@HelixError::BpdCalculationAlreadyComplete,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered," = internal constant [308 x i8] c"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.bpd_calculation_complete@HelixError::BpdCalculationAlreadyComplete,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,"
@"constraint=caller.key()==global_state.authority@HelixError::Unauthorized" = internal constant [72 x i8] c"constraint=caller.key()==global_state.authority@HelixError::Unauthorized"
@unlocked_vesting = internal constant [16 x i8] c"unlocked_vesting"
@vesting_portion = internal constant [15 x i8] c"vesting_portion"
@elapsed = internal constant [7 x i8] c"elapsed"
@vesting_duration = internal constant [16 x i8] c"vesting_duration"
@BPS_SCALER = internal constant [10 x i8] c"BPS_SCALER"
@IMMEDIATE_RELEASE_BPS = internal constant [21 x i8] c"IMMEDIATE_RELEASE_BPS"
@current_slot = internal constant [12 x i8] c"current_slot"
@vesting_end_slot = internal constant [16 x i8] c"vesting_end_slot"
@claimed_slot = internal constant [12 x i8] c"claimed_slot"
@u64 = internal constant [3 x i8] c"u64"
@immediate = internal constant [9 x i8] c"immediate"
@claimed_amount = internal constant [14 x i8] c"claimed_amount"
@"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),amount:available,total_vested,total_withdrawn:new_withdrawn,remaining:claim_status.claimed_amount.saturating_sub(new_withdrawn),}" = internal constant [195 x i8] c"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),amount:available,total_vested,total_withdrawn:new_withdrawn,remaining:claim_status.claimed_amount.saturating_sub(new_withdrawn),}"
@"VestedTokensWithdrawn{slot:clock.slot" = internal constant [37 x i8] c"VestedTokensWithdrawn{slot:clock.slot"
@authority = internal constant [9 x i8] c"authority"
@ctx.accounts.mint_authority = internal constant [27 x i8] c"ctx.accounts.mint_authority"
@to = internal constant [2 x i8] c"to"
@ctx.accounts.claimer_token_account = internal constant [34 x i8] c"ctx.accounts.claimer_token_account"
@ctx.accounts.mint = internal constant [17 x i8] c"ctx.accounts.mint"
@ctx.accounts.token_program = internal constant [26 x i8] c"ctx.accounts.token_program"
@signer_seeds = internal constant [12 x i8] c"signer_seeds"
@"[&authority_seeds[..]]" = internal constant [22 x i8] c"[&authority_seeds[..]]"
@authority_seeds = internal constant [15 x i8] c"authority_seeds"
@"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]" = internal constant [57 x i8] c"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]"
@new_withdrawn = internal constant [13 x i8] c"new_withdrawn"
@"HelixError::NoVestedTokens" = internal constant [26 x i8] c"HelixError::NoVestedTokens"
@"available>0" = internal constant [11 x i8] c"available>0"
@available = internal constant [9 x i8] c"available"
@claim_status.withdrawn_amount = internal constant [29 x i8] c"claim_status.withdrawn_amount"
@total_vested = internal constant [12 x i8] c"total_vested"
@claim_status.vesting_end_slot = internal constant [29 x i8] c"claim_status.vesting_end_slot"
@claim_status.claimed_slot = internal constant [25 x i8] c"claim_status.claimed_slot"
@claim_status.claimed_amount = internal constant [27 x i8] c"claim_status.claimed_amount"
@ctx.accounts.claim_status = internal constant [25 x i8] c"ctx.accounts.claim_status"
@"Context<WithdrawVested>" = internal constant [23 x i8] c"Context<WithdrawVested>"
@"InterfaceAccount<'info,TokenAccount>" = internal constant [36 x i8] c"InterfaceAccount<'info,TokenAccount>"
@claimer_token_account = internal constant [21 x i8] c"claimer_token_account"
@"mut,associated_token::mint=mint,associated_token::authority=claimer,associated_token::token_program=token_program," = internal constant [114 x i8] c"mut,associated_token::mint=mint,associated_token::authority=claimer,associated_token::token_program=token_program,"
@"Account<'info,ClaimStatus>" = internal constant [26 x i8] c"Account<'info,ClaimStatus>"
@claim_status = internal constant [12 x i8] c"claim_status"
@"mut,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],claim_status.snapshot_wallet.as_ref()],bump=claim_status.bump,constraint=claim_status.is_claimed@HelixError::ClaimPeriodNotStarted,constraint=claim_status.snapshot_wallet==claimer.key()@HelixError::Unauthorized," = internal constant [292 x i8] c"mut,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],claim_status.snapshot_wallet.as_ref()],bump=claim_status.bump,constraint=claim_status.is_claimed@HelixError::ClaimPeriodNotStarted,constraint=claim_status.snapshot_wallet==claimer.key()@HelixError::Unauthorized,"
@"seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump," = internal constant [49 x i8] c"seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,"
@"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump," = internal constant [49 x i8] c"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,"
@claimer = internal constant [7 x i8] c"claimer"
@mut = internal constant [3 x i8] c"mut"
@"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_unclaimed:claim_config.bpd_remaining_unclaimed,total_eligible_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,helix_per_share_day:helix_per_share_day.min(u64::MAXasu128)asu64,eligible_stakers:eligible_stakes.len()asu32,}" = internal constant [324 x i8] c"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_unclaimed:claim_config.bpd_remaining_unclaimed,total_eligible_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,helix_per_share_day:helix_per_share_day.min(u64::MAXasu128)asu64,eligible_stakers:eligible_stakes.len()asu32,}"
@"BigPayDayDistributed{slot:clock.slot" = internal constant [36 x i8] c"BigPayDayDistributed{slot:clock.slot"
@claim_config.bpd_stakes_finalized = internal constant [33 x i8] c"claim_config.bpd_stakes_finalized"
@"HelixError::BpdOverDistribution" = internal constant [31 x i8] c"HelixError::BpdOverDistribution"
@claim_config.bpd_total_distributed = internal constant [34 x i8] c"claim_config.bpd_total_distributed"
@"trigger_big_pay_day::trigger_big_pay_day.anon.14.3" = internal constant [48 x i8] c"trigger_big_pay_day::trigger_big_pay_day.anon.14"
@"trigger_big_pay_day::trigger_big_pay_day.anon.2.4" = internal constant [47 x i8] c"trigger_big_pay_day::trigger_big_pay_day.anon.2"
@"100" = internal constant [3 x i8] c"100"
@BPD_MAX_SHARE_PCT = internal constant [17 x i8] c"BPD_MAX_SHARE_PCT"
@claim_config.bpd_original_unclaimed = internal constant [35 x i8] c"claim_config.bpd_original_unclaimed"
@claim_config.bpd_snapshot_slot = internal constant [30 x i8] c"claim_config.bpd_snapshot_slot"
@claim_config.bpd_helix_per_share_day = internal constant [36 x i8] c"claim_config.bpd_helix_per_share_day"
@"HelixError::BigPayDayNotAvailable" = internal constant [33 x i8] c"HelixError::BigPayDayNotAvailable"
@"clock.slot>claim_config.end_slot" = internal constant [32 x i8] c"clock.slot>claim_config.end_slot"
@"HelixError::InvalidSlotsPerDay" = internal constant [30 x i8] c"HelixError::InvalidSlotsPerDay"
@"global_state.slots_per_day>0" = internal constant [28 x i8] c"global_state.slots_per_day>0"
@ctx.accounts.claim_config = internal constant [25 x i8] c"ctx.accounts.claim_config"
@"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>" = internal constant [50 x i8] c"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>"
@claim_config.bpd_remaining_unclaimed = internal constant [36 x i8] c"claim_config.bpd_remaining_unclaimed"
@batch_stakes_distributed = internal constant [24 x i8] c"batch_stakes_distributed"
@batch_distributed = internal constant [17 x i8] c"batch_distributed"
@stake.bpd_bonus_pending = internal constant [23 x i8] c"stake.bpd_bonus_pending"
@bonus = internal constant [5 x i8] c"bonus"
@max_bonus_per_stake = internal constant [19 x i8] c"max_bonus_per_stake"
@raw_bonus = internal constant [9 x i8] c"raw_bonus"
@"(HelixError::Overflow)" = internal constant [22 x i8] c"(HelixError::Overflow)"
@bonus_u128 = internal constant [10 x i8] c"bonus_u128"
@"HelixError::DivisionByZero" = internal constant [26 x i8] c"HelixError::DivisionByZero"
@helix_per_share_day = internal constant [19 x i8] c"helix_per_share_day"
@ctx.remaining_accounts = internal constant [22 x i8] c"ctx.remaining_accounts"
@"1" = internal constant [1 x i8] c"1"
@claim_config.bpd_stakes_distributed = internal constant [35 x i8] c"claim_config.bpd_stakes_distributed"
@"i,share_days" = internal constant [12 x i8] c"i,share_days"
@eligible_stakes = internal constant [15 x i8] c"eligible_stakes"
@share_days = internal constant [10 x i8] c"share_days"
@u128 = internal constant [4 x i8] c"u128"
@stake.t_shares = internal constant [14 x i8] c"stake.t_shares"
@days_staked = internal constant [11 x i8] c"days_staked"
@stake_end = internal constant [9 x i8] c"stake_end"
@stake.end_slot = internal constant [14 x i8] c"stake.end_slot"
@snapshot_slot = internal constant [13 x i8] c"snapshot_slot"
@claim_config.end_slot = internal constant [21 x i8] c"claim_config.end_slot"
@claim_config.start_slot = internal constant [23 x i8] c"claim_config.start_slot"
@stake.start_slot = internal constant [16 x i8] c"stake.start_slot"
@stake.is_active = internal constant [15 x i8] c"stake.is_active"
@stake.bpd_finalize_period_id = internal constant [28 x i8] c"stake.bpd_finalize_period_id"
@claim_config.claim_period_id = internal constant [28 x i8] c"claim_config.claim_period_id"
@stake.bpd_claim_period_id = internal constant [25 x i8] c"stake.bpd_claim_period_id"
@stake = internal constant [5 x i8] c"stake"
@s = internal constant [1 x i8] c"s"
@"StakeAccount::LEN" = internal constant [17 x i8] c"StakeAccount::LEN"
@data = internal constant [4 x i8] c"data"
@account_info = internal constant [12 x i8] c"account_info"
@account_info.owner = internal constant [18 x i8] c"account_info.owner"
@MAX_STAKES_PER_BPD = internal constant [18 x i8] c"MAX_STAKES_PER_BPD"
@i = internal constant [1 x i8] c"i"
@"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_claimed:claim_config.total_claimed,claims_count:claim_config.claim_count,unclaimed_amount:0,}" = internal constant [175 x i8] c"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_claimed:claim_config.total_claimed,claims_count:claim_config.claim_count,unclaimed_amount:0,}"
@"ClaimPeriodEnded{slot:clock.slot" = internal constant [32 x i8] c"ClaimPeriodEnded{slot:clock.slot"
@false = internal constant [5 x i8] c"false"
@claim_config.big_pay_day_complete = internal constant [33 x i8] c"claim_config.big_pay_day_complete"
@true = internal constant [4 x i8] c"true"
@"Account<'info,ClaimConfig>" = internal constant [26 x i8] c"Account<'info,ClaimConfig>"
@claim_config = internal constant [12 x i8] c"claim_config"
@"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,constraint=claim_config.bpd_calculation_complete@HelixError::BpdCalculationNotComplete," = internal constant [303 x i8] c"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,constraint=claim_config.bpd_calculation_complete@HelixError::BpdCalculationNotComplete,"
@caller = internal constant [6 x i8] c"caller"
@"day:current_day,days_elapsed,amount:daily_inflation_total,new_share_rate:global_state.share_rate,total_shares:global_state.total_shares,}" = internal constant [137 x i8] c"day:current_day,days_elapsed,amount:daily_inflation_total,new_share_rate:global_state.share_rate,total_shares:global_state.total_shares,}"
@"HelixError::Overflow" = internal constant [20 x i8] c"HelixError::Overflow"
@global_state.share_rate = internal constant [23 x i8] c"global_state.share_rate"
@share_rate_increase = internal constant [19 x i8] c"share_rate_increase"
@PRECISION = internal constant [9 x i8] c"PRECISION"
@daily_inflation_total = internal constant [21 x i8] c"daily_inflation_total"
@"365" = internal constant [3 x i8] c"365"
@annual_inflation = internal constant [16 x i8] c"annual_inflation"
@"100_000_000" = internal constant [11 x i8] c"100_000_000"
@global_state.annual_inflation_bp = internal constant [32 x i8] c"global_state.annual_inflation_bp"
@total_staked = internal constant [12 x i8] c"total_staked"
@global_state.total_tokens_staked = internal constant [32 x i8] c"global_state.total_tokens_staked"
@"0" = internal constant [1 x i8] c"0"
@global_state.total_shares = internal constant [25 x i8] c"global_state.total_shares"
@days_elapsed = internal constant [12 x i8] c"days_elapsed"
@"HelixError::Underflow" = internal constant [21 x i8] c"HelixError::Underflow"
@"HelixError::AlreadyDistributedToday" = internal constant [35 x i8] c"HelixError::AlreadyDistributedToday"
@"current_day>global_state.current_day" = internal constant [36 x i8] c"current_day>global_state.current_day"
@global_state.slots_per_day = internal constant [26 x i8] c"global_state.slots_per_day"
@clock.slot = internal constant [10 x i8] c"clock.slot"
@global_state.init_slot = internal constant [22 x i8] c"global_state.init_slot"
@clock = internal constant [5 x i8] c"clock"
@ctx.accounts.global_state = internal constant [25 x i8] c"ctx.accounts.global_state"
@"Context<CrankDistribution>" = internal constant [26 x i8] c"Context<CrankDistribution>"
@ctx = internal constant [3 x i8] c"ctx"
@"()" = internal constant [2 x i8] c"()"
@"day:current_day,days_elapsed,amount:0,new_share_rate:global_state.share_rate,total_shares:0,}" = internal constant [93 x i8] c"day:current_day,days_elapsed,amount:0,new_share_rate:global_state.share_rate,total_shares:0,}"
@"InflationDistributed{slot:clock.slot" = internal constant [36 x i8] c"InflationDistributed{slot:clock.slot"
@global_state.current_day = internal constant [24 x i8] c"global_state.current_day"
@current_day = internal constant [11 x i8] c"current_day"
@"Program<'info,Token2022>" = internal constant [24 x i8] c"Program<'info,Token2022>"
@token_program = internal constant [13 x i8] c"token_program"
@"UncheckedAccount<'info>" = internal constant [23 x i8] c"UncheckedAccount<'info>"
@mint_authority = internal constant [14 x i8] c"mint_authority"
@"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump," = internal constant [66 x i8] c"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,"
@"InterfaceAccount<'info,Mint>" = internal constant [28 x i8] c"InterfaceAccount<'info,Mint>"
@mint = internal constant [4 x i8] c"mint"
@"mut,seeds=[MINT_SEED],bump," = internal constant [27 x i8] c"mut,seeds=[MINT_SEED],bump,"
@"Account<'info,GlobalState>" = internal constant [26 x i8] c"Account<'info,GlobalState>"
@global_state = internal constant [12 x i8] c"global_state"
@"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump," = internal constant [53 x i8] c"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,"
@"Signer<'info>" = internal constant [13 x i8] c"Signer<'info>"
@cranker = internal constant [7 x i8] c"cranker"
@"*i8" = internal constant [3 x i8] c"*i8"
@parser.error = internal constant [12 x i8] c"parser.error"
@E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7 = internal constant [44 x i8] c"E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7"
@dependencies.anchor-spl.version = internal constant [31 x i8] c"dependencies.anchor-spl.version"
@"0.31" = internal constant [4 x i8] c"0.31"
@dependencies.anchor-lang.version = internal constant [32 x i8] c"dependencies.anchor-lang.version"

declare i8* @malloc(i64)

declare void @free(i8*)

declare i8* @"sol.global_state::GlobalState::set_bpd_window_active.anon.2"(i8*)

declare i8* @"sol.global_state::GlobalState::set_bpd_window_active.anon.1"(i8*)

declare i8* @sol.accept_authority.1(i8*)

declare i8* @sol.transfer_authority.2(i8*, i8*)

declare i8* @sol.admin_set_slots_per_day.2(i8*, i8*)

declare i8* @sol.admin_set_claim_end_slot.2(i8*, i8*)

declare i8* @sol.abort_bpd.1(i8*)

declare i8* @sol.migrate_stake.1(i8*)

declare i8* @sol.seal_bpd_finalize.2(i8*, i8*)

declare i8* @sol.free_claim.3(i8*, i8*, i8*)

declare i8* @sol.finalize_bpd_calculation.1(i8*)

declare i8* @sol.trigger_big_pay_day.1(i8*)

declare i8* @sol.withdraw_vested.1(i8*)

declare i8* @sol.initialize_claim_period.5(i8*, i8*, i8*, i8*, i8*)

declare i8* @sol.admin_mint.2(i8*, i8*)

declare i8* @sol.claim_rewards.1(i8*)

declare i8* @sol.unstake.1(i8*)

declare i8* @sol.crank_distribution.1(i8*)

declare i8* @sol.create_stake.3(i8*, i8*, i8*)

declare i8* @sol.initialize.2(i8*, i8*)

declare i8* @"sol.instructions::accept_authority::accept_authority.1"(i8*)

declare i8* @"sol.instructions::transfer_authority::transfer_authority.2"(i8*, i8*)

declare i8* @"sol.instructions::admin_set_slots_per_day::admin_set_slots_per_day.2"(i8*, i8*)

declare i8* @"sol.instructions::admin_set_claim_end_slot::admin_set_claim_end_slot.2"(i8*, i8*)

declare i8* @"sol.instructions::abort_bpd::abort_bpd.1"(i8*)

declare i8* @"sol.instructions::migrate_stake::migrate_stake.1"(i8*)

declare i8* @"sol.instructions::seal_bpd_finalize::seal_bpd_finalize.2"(i8*, i8*)

declare i8* @"sol.instructions::free_claim::free_claim.3"(i8*, i8*, i8*)

declare i8* @"sol.instructions::finalize_bpd_calculation::finalize_bpd_calculation.1"(i8*)

declare i8* @"sol.instructions::trigger_big_pay_day::trigger_big_pay_day.1"(i8*)

declare i8* @"sol.instructions::withdraw_vested::withdraw_vested.1"(i8*)

declare i8* @"sol.instructions::initialize_claim_period::initialize_claim_period.5"(i8*, i8*, i8*, i8*, i8*)

declare i8* @"sol.instructions::admin_mint::admin_mint.2"(i8*, i8*)

declare i8* @"sol.instructions::claim_rewards::claim_rewards.1"(i8*)

declare i8* @"sol.instructions::unstake::unstake.1"(i8*)

declare i8* @"sol.instructions::crank_distribution::crank_distribution.1"(i8*)

declare i8* @"sol.instructions::create_stake::create_stake.3"(i8*, i8*, i8*)

declare i8* @"sol.require_eq.!2"(i8*, i8*)

declare i8* @"sol.require_keys_eq.!2"(i8*, i8*)

declare i8* @"sol.Pubkey::try_find_program_address.2"(i8*, i8*)

declare i8* @"sol.model.struct.new.token_2022::MintTo.3"(i8*, i8*, i8*)

declare i8* @"sol.math::calculate_loyalty_bonus.anon.1"(i8*)

declare i8* @"sol.||"(i8*, i8*)

declare i8* @"sol.math::calculate_late_penalty.anon.4"(i8*)

declare i8* @"sol.math::calculate_late_penalty.anon.3"(i8*)

declare i8* @"sol.math::calculate_late_penalty.anon.2"(i8*)

declare i8* @"sol.math::calculate_late_penalty.anon.1"(i8*)

declare i8* @sol.mul_div_up.3(i8*, i8*, i8*)

declare i8* @"sol.math::calculate_early_penalty.anon.3"(i8*)

declare i8* @"sol.math::calculate_early_penalty.anon.2"(i8*)

declare i8* @"sol.math::calculate_early_penalty.anon.1"(i8*)

declare i8* @sol.calculate_bpb_bonus.1(i8*)

declare i8* @sol.calculate_lpb_bonus.1(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.4"(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.3"(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.2"(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.1"(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.6"(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.5"(i8*)

declare i8* @"sol.math::calculate_lpb_bonus.anon.2"(i8*)

declare i8* @"sol.math::calculate_lpb_bonus.anon.1"(i8*)

declare i8* @"sol.*"(i8*, i8*)

declare i8* @"sol.unstake::unstake.anon.8"(i8*)

declare i8* @"sol.unstake::unstake.anon.7"(i8*)

declare i8* @"sol.unstake::unstake.anon.4"(i8*)

declare i8* @"sol.unstake::unstake.anon.3"(i8*)

declare i8* @"sol.unstake::unstake.anon.2"(i8*)

declare i8* @"sol.unstake::unstake.anon.1"(i8*)

declare i8* @"sol.unstake::unstake.anon.6"(i8*)

declare i8* @"sol.unstake::unstake.anon.5"(i8*)

declare i8* @sol.calculate_late_penalty.4(i8*, i8*, i8*, i8*)

declare i8* @sol.calculate_early_penalty.4(i8*, i8*, i8*, i8*)

declare i8* @"sol.transfer_authority::transfer_authority.anon.1"(i8*)

declare i8* @"sol.Pubkey::default.0"()

declare i8* @"sol.seal_bpd_finalize::seal_bpd_finalize.anon.1"(i8*)

declare i8* @"sol.abort_bpd::abort_bpd.anon.1"(i8*)

declare i8* @sol.is_bpd_window_active.1(i8*)

declare i8* @sol.ifTrueFalse.anon.(i8*, i8*)

declare i8* @"sol.free_claim::calculate_speed_bonus.anon.3"(i8*)

declare i8* @"sol.free_claim::calculate_speed_bonus.anon.2"(i8*)

declare i8* @"sol.free_claim::calculate_speed_bonus.anon.1"(i8*)

declare i8* @"sol.free_claim::verify_merkle_proof.anon.5"(i8*)

declare i8* @"sol.free_claim::verify_merkle_proof.anon.4"(i8*)

declare i8* @sol.hashv.1(i8*)

declare i8* @"sol.Pubkey::try_from.1"(i8*)

declare i8* @"sol.u16::from_le_bytes.1"(i8*)

declare i8* @"sol.model.macro.format.!1"(i8*)

declare i8* @sol.load_instruction_at_checked.2(i8*, i8*)

declare i8* @sol.-(i8*, i8*)

declare i8* @sol.load_current_index_checked.1(i8*)

declare i8* @sol.calculate_speed_bonus.2(i8*, i8*)

declare i8* @sol.calculate_days_elapsed.3(i8*, i8*, i8*)

declare i8* @sol.verify_merkle_proof.5(i8*, i8*, i8*, i8*, i8*)

declare i8* @sol.verify_ed25519_signature.3(i8*, i8*, i8*)

declare i8* @"sol.claim_rewards::claim_rewards.anon.3"(i8*)

declare i8* @"sol.claim_rewards::claim_rewards.anon.2"(i8*)

declare i8* @"sol.claim_rewards::claim_rewards.anon.1"(i8*)

declare i8* @sol.calculate_loyalty_bonus.4(i8*, i8*, i8*, i8*)

declare i8* @sol.calculate_pending_rewards.3(i8*, i8*, i8*)

declare i8* @"sol.token_2022::burn.2"(i8*, i8*)

declare i8* @"sol.CpiContext::new.2"(i8*, i8*)

declare i8* @"sol.model.struct.new.token_2022::Burn.3"(i8*, i8*, i8*)

declare i8* @"sol.create_stake::create_stake.anon.8"(i8*)

declare i8* @"sol.create_stake::create_stake.anon.1"(i8*)

declare i8* @sol.calculate_reward_debt.2(i8*, i8*)

declare i8* @sol.calculate_t_shares.3(i8*, i8*, i8*)

declare i8* @"sol.create_stake::create_stake.anon.7"(i8*)

declare i8* @"sol.create_stake::create_stake.anon.2"(i8*)

declare i8* @sol.key.1(i8*)

declare i8* @"sol.Pubkey::find_program_address.2"(i8*, i8*)

declare i8* @"sol.create_stake::create_stake.anon.6"(i8*)

declare i8* @"sol.create_stake::create_stake.anon.3"(i8*)

declare i8* @"sol.Account::try_from.1"(i8*)

declare i8* @"sol.create_stake::create_stake.anon.5"(i8*)

declare i8* @"sol.create_stake::create_stake.anon.4"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.3"(i8*)

declare i8* @sol.ifFalse.anon.(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.2"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.1"(i8*)

declare i8* @"sol.&&"(i8*, i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.13"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.12"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.11"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.10"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.9"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.8"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.7"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.6"(i8*)

declare i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.5"(i8*)

declare i8* @sol.into.1(i8*)

declare i8* @"sol.withdraw_vested::calculate_vested_amount.anon.2"(i8*)

declare i8* @"sol.<="(i8*, i8*)

declare i8* @"sol.withdraw_vested::calculate_vested_amount.anon.1"(i8*)

declare i8* @"sol.token_2022::mint_to.2"(i8*, i8*)

declare i8* @"sol.CpiContext::new_with_signer.3"(i8*, i8*, i8*)

declare i8* @sol.model.struct.new.MintTo.3(i8*, i8*, i8*)

declare i8* @sol.to_account_info.1(i8*)

declare i8* @sol.calculate_vested_amount.4(i8*, i8*, i8*, i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.16"(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.13"(i8*)

declare i8* @sol.is_empty.1(i8*)

declare i8* @sol.model.loop.for.1(i8*)

declare i8* @"sol.Vec::new.0"()

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.1"(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.15"(i8*)

declare i8* @sol.min.2(i8*, i8*)

declare i8* @sol.map_err.2(i8*, i8*)

declare i8* @"sol.model.macro.error.!1"(i8*)

declare i8* @"sol.u64::try_from.1"(i8*)

declare i8* @sol.checked_div.2(i8*, i8*)

declare i8* @sol.try_serialize.2(i8*, i8*)

declare i8* @sol.try_borrow_mut_data.1(i8*)

declare i8* @"sol.StakeAccount::try_deserialize.1"(i8*)

declare i8* @sol.push.2(i8*, i8*)

declare i8* @sol.checked_mul.2(i8*, i8*)

declare i8* @sol.typecast(i8*, i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.12"(i8*)

declare i8* @"sol./"(i8*, i8*)

declare i8* @sol.saturating_sub.2(i8*, i8*)

declare i8* @"sol.std::cmp::min.2"(i8*, i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.11"(i8*)

declare i8* @"sol.>"(i8*, i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.10"(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.9"(i8*)

declare i8* @"sol.!"(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.8"(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.7"(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.6"(i8*)

declare i8* @sol.is_err.1(i8*)

declare i8* @"sol.crate::security::validate_stake_pda.2"(i8*, i8*)

declare i8* @sol.drop.1(i8*)

declare i8* @sol.match.1(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.5"(i8*)

declare i8* @"sol.<"(i8*, i8*)

declare i8* @sol.len.1(i8*)

declare i8* @sol.try_borrow_data.1(i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.4"(i8*)

declare i8* @"sol.!="(i8*, i8*)

declare i8* @"sol.crate::id.0"()

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.3"(i8*)

declare i8* @"sol.>="(i8*, i8*)

declare i8* @sol.model.break()

declare i8* @sol.set_bpd_window_active.2(i8*, i8*)

declare i8* @sol.checked_add.2(i8*, i8*)

declare i8* @sol.mul_div.3(i8*, i8*, i8*)

declare i8* @sol.ifTrue.anon.(i8*)

declare i8* @"sol.crank_distribution::crank_distribution.anon.1"(i8*)

declare i8* @sol.if(i8*)

declare i8* @"sol.=="(i8*, i8*)

declare i8* @sol.ok_or.2(i8*, i8*)

declare i8* @sol.checked_sub.2(i8*, i8*)

declare i8* @"sol.require.!2"(i8*, i8*)

declare i8* @sol.get_current_day.3(i8*, i8*, i8*)

declare i8* @"sol.Clock::get.0"()

declare i8* @sol.return.1(i8*)

declare i8* @sol.Ok.1(i8*)

declare i8* @"sol.emit.!2"(i8*, i8*)

declare void @sol.model.opaqueAssign(i8*, i8*)

declare i8* @sol.model.struct.constraint(i8*)

declare i8* @sol.model.struct.field(i8*, i8*)

declare i8* @sol.model.funcArg(i8*, i8*)

declare i8* @sol.model.declare_id(i8*)

declare i8* @sol.model.toml(i8*, i8*)

define i64 @sol.model.cargo.toml(i8* %0) !dbg !3 {
  %2 = call i8* @sol.model.toml(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @dependencies.anchor-lang.version, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @"0.31", i64 0, i64 0)), !dbg !7
  %3 = call i8* @sol.model.toml(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @dependencies.anchor-spl.version, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @"0.31", i64 0, i64 0)), !dbg !7
  ret i64 0, !dbg !10
}

define i64 @sol.model.declare_id.address(i8* %0) !dbg !12 {
  %2 = call i8* @sol.model.declare_id(i8* getelementptr inbounds ([44 x i8], [44 x i8]* @E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7, i64 0, i64 0)), !dbg !13
  ret i64 0, !dbg !16
}

define i8* @sol.model.struct.anchor.CrankDistribution(i8* %0) !dbg !18 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !20
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cranker, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !22
  %4 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !23
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !24
  %6 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !25
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !26
  %8 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !27
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !28
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !29
  ret i8* %0, !dbg !20
}

define i8* @"crank_distribution::crank_distribution.anon.1"(i8* %0) !dbg !30 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !31
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @global_state.current_day, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @current_day, i64 0, i64 0)), !dbg !33
  %3 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InflationDistributed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([93 x i8], [93 x i8]* @"day:current_day,days_elapsed,amount:0,new_share_rate:global_state.share_rate,total_shares:0,}", i64 0, i64 0)), !dbg !34
  %4 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !35
  %5 = call i8* @sol.return.1(i8* %4), !dbg !36
  ret i8* %0, !dbg !31
}

define i8* @"crank_distribution::crank_distribution.1"(i8* %0) !dbg !37 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<CrankDistribution>", i64 0, i64 0)), !dbg !38
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !40
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !41
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !42
  %4 = call i8* @sol.get_current_day.3(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @global_state.init_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !43
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @current_day, i64 0, i64 0), i8* %4), !dbg !44
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"current_day>global_state.current_day", i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"HelixError::AlreadyDistributedToday", i64 0, i64 0)), !dbg !45
  %6 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @current_day, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @global_state.current_day, i64 0, i64 0)), !dbg !46
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !47
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0), i8* %7), !dbg !48
  %8 = call i8* @"sol.=="(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !49
  %9 = call i8* @sol.if(i8* %8), !dbg !50
  %10 = call i8* @"sol.crank_distribution::crank_distribution.anon.1"(i8* %9), !dbg !51
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !51
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_staked, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0)), !dbg !52
  %12 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_staked, i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @"100_000_000", i64 0, i64 0)), !dbg !53
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @annual_inflation, i64 0, i64 0), i8* %12), !dbg !54
  %13 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @annual_inflation, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"365", i64 0, i64 0)), !dbg !55
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @daily_inflation_total, i64 0, i64 0), i8* %13), !dbg !56
  %14 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @daily_inflation_total, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0)), !dbg !57
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @share_rate_increase, i64 0, i64 0), i8* %14), !dbg !58
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @share_rate_increase, i64 0, i64 0)), !dbg !59
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !60
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* %16), !dbg !61
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @global_state.current_day, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @current_day, i64 0, i64 0)), !dbg !62
  %17 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InflationDistributed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([137 x i8], [137 x i8]* @"day:current_day,days_elapsed,amount:daily_inflation_total,new_share_rate:global_state.share_rate,total_shares:global_state.total_shares,}", i64 0, i64 0)), !dbg !63
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !64
  ret i8* %0, !dbg !38
}

define i8* @sol.model.struct.anchor.TriggerBigPayDay(i8* %0) !dbg !65 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !67
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @caller, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !69
  %4 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !70
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !71
  %6 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([303 x i8], [303 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,constraint=claim_config.bpd_calculation_complete@HelixError::BpdCalculationNotComplete,", i64 0, i64 0)), !dbg !72
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !73
  ret i8* %0, !dbg !67
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.1"(i8* %0) !dbg !74 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !75
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !77
  %3 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !78
  %4 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"ClaimPeriodEnded{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([175 x i8], [175 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_claimed:claim_config.total_claimed,claims_count:claim_config.claim_count,unclaimed_amount:0,}", i64 0, i64 0)), !dbg !79
  %5 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !80
  %6 = call i8* @sol.return.1(i8* %5), !dbg !81
  ret i8* %0, !dbg !75
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.3"(i8* %0) !dbg !82 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !83
  %3 = call i8* @sol.model.break(), !dbg !85
  ret i8* %0, !dbg !83
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.4"(i8* %0) !dbg !86 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !87
  ret i8* %0, !dbg !87
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.5"(i8* %0) !dbg !89 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !90
  ret i8* %0, !dbg !90
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.6"(i8* %0) !dbg !92 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !93
  ret i8* %0, !dbg !93
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.7"(i8* %0) !dbg !95 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !96
  ret i8* %0, !dbg !96
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.8"(i8* %0) !dbg !98 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !99
  ret i8* %0, !dbg !99
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.9"(i8* %0) !dbg !101 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !102
  ret i8* %0, !dbg !102
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.10"(i8* %0) !dbg !104 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !105
  ret i8* %0, !dbg !105
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.11"(i8* %0) !dbg !107 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !108
  ret i8* %0, !dbg !108
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.12"(i8* %0) !dbg !110 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !111
  ret i8* %0, !dbg !111
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.2"(i8* %0) !dbg !113 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !114
  %3 = call i8* @"sol.>="(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @i, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @MAX_STAKES_PER_BPD, i64 0, i64 0)), !dbg !116
  %4 = call i8* @sol.if(i8* %3), !dbg !117
  %5 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.3"(i8* %4), !dbg !118
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !118
  %7 = call i8* @"sol.crate::id.0"(), !dbg !119
  %8 = call i8* @"sol.!="(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @account_info.owner, i64 0, i64 0), i8* %7), !dbg !120
  %9 = call i8* @sol.if(i8* %8), !dbg !121
  %10 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.4"(i8* %9), !dbg !122
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !122
  %12 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !123
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0), i8* %12), !dbg !124
  %13 = call i8* @sol.len.1(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0)), !dbg !125
  %14 = call i8* @"sol.<"(i8* %13, i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"StakeAccount::LEN", i64 0, i64 0)), !dbg !126
  %15 = call i8* @sol.if(i8* %14), !dbg !127
  %16 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.5"(i8* %15), !dbg !128
  %17 = call i8* @sol.ifTrue.anon.(i8* %16), !dbg !128
  %18 = call i8* @sol.match.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @s, i64 0, i64 0)), !dbg !129
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %18), !dbg !130
  %19 = call i8* @sol.drop.1(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0)), !dbg !131
  %20 = call i8* @"sol.crate::security::validate_stake_pda.2"(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0)), !dbg !132
  %21 = call i8* @sol.is_err.1(i8* %20), !dbg !133
  %22 = call i8* @sol.if(i8* %21), !dbg !134
  %23 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.6"(i8* %22), !dbg !135
  %24 = call i8* @sol.ifTrue.anon.(i8* %23), !dbg !135
  %25 = call i8* @"sol.=="(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake.bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !136
  %26 = call i8* @sol.if(i8* %25), !dbg !137
  %27 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.7"(i8* %26), !dbg !138
  %28 = call i8* @sol.ifTrue.anon.(i8* %27), !dbg !138
  %29 = call i8* @"sol.!="(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @stake.bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !139
  %30 = call i8* @sol.if(i8* %29), !dbg !140
  %31 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.8"(i8* %30), !dbg !141
  %32 = call i8* @sol.ifTrue.anon.(i8* %31), !dbg !141
  %33 = call i8* @"sol.!"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @stake.is_active, i64 0, i64 0)), !dbg !142
  %34 = call i8* @sol.if(i8* %33), !dbg !143
  %35 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.9"(i8* %34), !dbg !144
  %36 = call i8* @sol.ifTrue.anon.(i8* %35), !dbg !144
  %37 = call i8* @"sol.<"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0)), !dbg !145
  %38 = call i8* @sol.if(i8* %37), !dbg !146
  %39 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.10"(i8* %38), !dbg !147
  %40 = call i8* @sol.ifTrue.anon.(i8* %39), !dbg !147
  %41 = call i8* @"sol.>"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0)), !dbg !148
  %42 = call i8* @sol.if(i8* %41), !dbg !149
  %43 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.11"(i8* %42), !dbg !150
  %44 = call i8* @sol.ifTrue.anon.(i8* %43), !dbg !150
  %45 = call i8* @"sol.std::cmp::min.2"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.end_slot, i64 0, i64 0)), !dbg !151
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* %45), !dbg !152
  %46 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0)), !dbg !153
  %47 = call i8* @"sol./"(i8* %46, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !154
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* %47), !dbg !155
  %48 = call i8* @"sol.=="(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !156
  %49 = call i8* @sol.if(i8* %48), !dbg !157
  %50 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.12"(i8* %49), !dbg !158
  %51 = call i8* @sol.ifTrue.anon.(i8* %50), !dbg !158
  %52 = call i8* @sol.typecast(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !159
  %53 = call i8* @sol.typecast(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !160
  %54 = call i8* @sol.checked_mul.2(i8* %52, i8* %53), !dbg !161
  %55 = call i8* @sol.ok_or.2(i8* %54, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !162
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0), i8* %55), !dbg !163
  %56 = call i8* @sol.push.2(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @eligible_stakes, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"i,share_days", i64 0, i64 0)), !dbg !164
  ret i8* %0, !dbg !114
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.13"(i8* %0) !dbg !165 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !166
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !168
  %4 = call i8* @sol.return.1(i8* %3), !dbg !169
  ret i8* %0, !dbg !166
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.15"(i8* %0) !dbg !170 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !171
  %3 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !173
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !174
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* %4), !dbg !175
  %5 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !176
  %6 = call i8* @"sol.StakeAccount::try_deserialize.1"(i8* %5), !dbg !177
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %6), !dbg !178
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake.bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !179
  %7 = call i8* @sol.try_borrow_mut_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !180
  %8 = call i8* @sol.try_serialize.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %7), !dbg !181
  ret i8* %0, !dbg !171
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.14"(i8* %0) !dbg !182 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !183
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.remaining_accounts, i64 0, i64 0)), !dbg !185
  %3 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0)), !dbg !186
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !187
  %5 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !188
  %6 = call i8* @sol.checked_div.2(i8* %4, i8* %5), !dbg !189
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !190
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @bonus_u128, i64 0, i64 0), i8* %7), !dbg !191
  %8 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @bonus_u128, i64 0, i64 0)), !dbg !192
  %9 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !193
  %10 = call i8* @sol.map_err.2(i8* %8, i8* %9), !dbg !194
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @raw_bonus, i64 0, i64 0), i8* %10), !dbg !195
  %11 = call i8* @sol.min.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @raw_bonus, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @max_bonus_per_stake, i64 0, i64 0)), !dbg !196
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %11), !dbg !197
  %12 = call i8* @"sol.=="(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !198
  %13 = call i8* @sol.if(i8* %12), !dbg !199
  %14 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.15"(i8* %13), !dbg !200
  %15 = call i8* @sol.ifTrue.anon.(i8* %14), !dbg !200
  %16 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !201
  %17 = call i8* @"sol.StakeAccount::try_deserialize.1"(i8* %16), !dbg !202
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %17), !dbg !203
  %18 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !204
  %19 = call i8* @sol.ok_or.2(i8* %18, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !205
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0), i8* %19), !dbg !206
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake.bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !207
  %20 = call i8* @sol.try_borrow_mut_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !208
  %21 = call i8* @sol.try_serialize.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %20), !dbg !209
  %22 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !210
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !211
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0), i8* %23), !dbg !212
  %24 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !213
  %25 = call i8* @sol.ok_or.2(i8* %24, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !214
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0), i8* %25), !dbg !215
  ret i8* %0, !dbg !183
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.16"(i8* %0) !dbg !216 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !217
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !219
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !220
  %3 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !221
  %4 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"ClaimPeriodEnded{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([175 x i8], [175 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_claimed:claim_config.total_claimed,claims_count:claim_config.claim_count,unclaimed_amount:0,}", i64 0, i64 0)), !dbg !222
  ret i8* %0, !dbg !217
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.1"(i8* %0) !dbg !223 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([50 x i8], [50 x i8]* @"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>", i64 0, i64 0)), !dbg !224
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !226
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !227
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !228
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !229
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"global_state.slots_per_day>0", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::InvalidSlotsPerDay", i64 0, i64 0)), !dbg !230
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"clock.slot>claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::BigPayDayNotAvailable", i64 0, i64 0)), !dbg !231
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0)), !dbg !232
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0)), !dbg !233
  %6 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_original_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @BPD_MAX_SHARE_PCT, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"100", i64 0, i64 0)), !dbg !234
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @max_bonus_per_stake, i64 0, i64 0), i8* %6), !dbg !235
  %7 = call i8* @"sol.=="(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !236
  %8 = call i8* @sol.if(i8* %7), !dbg !237
  %9 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.1"(i8* %8), !dbg !238
  %10 = call i8* @sol.ifTrue.anon.(i8* %9), !dbg !238
  %11 = call i8* @"sol.Vec::new.0"(), !dbg !239
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @eligible_stakes, i64 0, i64 0), i8* %11), !dbg !240
  %12 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([47 x i8], [47 x i8]* @"trigger_big_pay_day::trigger_big_pay_day.anon.2.4", i64 0, i64 0)), !dbg !241
  %13 = call i8* @sol.is_empty.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @eligible_stakes, i64 0, i64 0)), !dbg !242
  %14 = call i8* @sol.if(i8* %13), !dbg !243
  %15 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.13"(i8* %14), !dbg !244
  %16 = call i8* @sol.ifTrue.anon.(i8* %15), !dbg !244
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !245
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !246
  %17 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([48 x i8], [48 x i8]* @"trigger_big_pay_day::trigger_big_pay_day.anon.14.3", i64 0, i64 0)), !dbg !247
  %18 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @claim_config.bpd_total_distributed, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0)), !dbg !248
  %19 = call i8* @sol.ok_or.2(i8* %18, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !249
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @claim_config.bpd_total_distributed, i64 0, i64 0), i8* %19), !dbg !250
  %20 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0)), !dbg !251
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !252
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* %21), !dbg !253
  %22 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0)), !dbg !254
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"HelixError::BpdOverDistribution", i64 0, i64 0)), !dbg !255
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* %23), !dbg !256
  %24 = call i8* @"sol.>="(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0)), !dbg !257
  %25 = call i8* @sol.if(i8* %24), !dbg !258
  %26 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.16"(i8* %25), !dbg !259
  %27 = call i8* @sol.ifTrue.anon.(i8* %26), !dbg !259
  %28 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"BigPayDayDistributed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([324 x i8], [324 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_unclaimed:claim_config.bpd_remaining_unclaimed,total_eligible_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,helix_per_share_day:helix_per_share_day.min(u64::MAXasu128)asu64,eligible_stakers:eligible_stakes.len()asu32,}", i64 0, i64 0)), !dbg !260
  %29 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !261
  ret i8* %0, !dbg !224
}

define i8* @sol.model.struct.anchor.WithdrawVested(i8* %0) !dbg !262 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !264
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !266
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @claimer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !267
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !268
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !269
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,", i64 0, i64 0)), !dbg !270
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !271
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([292 x i8], [292 x i8]* @"mut,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],claim_status.snapshot_wallet.as_ref()],bump=claim_status.bump,constraint=claim_status.is_claimed@HelixError::ClaimPeriodNotStarted,constraint=claim_status.snapshot_wallet==claimer.key()@HelixError::Unauthorized,", i64 0, i64 0)), !dbg !272
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimStatus>", i64 0, i64 0)), !dbg !273
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([114 x i8], [114 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=claimer,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !274
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claimer_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !275
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !276
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !277
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !278
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !279
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !280
  ret i8* %0, !dbg !264
}

define i8* @"withdraw_vested::withdraw_vested.1"(i8* %0) !dbg !281 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"Context<WithdrawVested>", i64 0, i64 0)), !dbg !282
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !284
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !285
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_status, i64 0, i64 0)), !dbg !286
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !287
  %4 = call i8* @sol.calculate_vested_amount.4(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @claim_status.claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @claim_status.claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !288
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_vested, i64 0, i64 0), i8* %4), !dbg !289
  %5 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_vested, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0)), !dbg !290
  %6 = call i8* @sol.ok_or.2(i8* %5, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !291
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @available, i64 0, i64 0), i8* %6), !dbg !292
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @"available>0", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::NoVestedTokens", i64 0, i64 0)), !dbg !293
  %8 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @available, i64 0, i64 0)), !dbg !294
  %9 = call i8* @sol.ok_or.2(i8* %8, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !295
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_withdrawn, i64 0, i64 0), i8* %9), !dbg !296
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_withdrawn, i64 0, i64 0)), !dbg !297
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !298
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !299
  %10 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !300
  %11 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !301
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %11), !dbg !302
  %12 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @ctx.accounts.claimer_token_account, i64 0, i64 0)), !dbg !303
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %12), !dbg !304
  %13 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !305
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %13), !dbg !306
  %14 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !307
  %15 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %10, i8* %14, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !308
  %16 = call i8* @"sol.token_2022::mint_to.2"(i8* %15, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @available, i64 0, i64 0)), !dbg !309
  %17 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"VestedTokensWithdrawn{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([195 x i8], [195 x i8]* @"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),amount:available,total_vested,total_withdrawn:new_withdrawn,remaining:claim_status.claimed_amount.saturating_sub(new_withdrawn),}", i64 0, i64 0)), !dbg !310
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !311
  ret i8* %0, !dbg !282
}

define i8* @"withdraw_vested::calculate_vested_amount.anon.1"(i8* %0) !dbg !312 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !313
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @claimed_amount, i64 0, i64 0)), !dbg !315
  %4 = call i8* @sol.return.1(i8* %3), !dbg !316
  ret i8* %0, !dbg !313
}

define i8* @"withdraw_vested::calculate_vested_amount.anon.2"(i8* %0) !dbg !317 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !318
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0)), !dbg !320
  %4 = call i8* @sol.return.1(i8* %3), !dbg !321
  ret i8* %0, !dbg !318
}

define i8* @"withdraw_vested::calculate_vested_amount.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !322 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !323
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !323
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !323
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !323
  %9 = call i8* @sol.mul_div.3(i8* %0, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @IMMEDIATE_RELEASE_BPS, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !325
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0), i8* %9), !dbg !326
  %10 = call i8* @"sol.>="(i8* %3, i8* %2), !dbg !327
  %11 = call i8* @sol.if(i8* %10), !dbg !328
  %12 = call i8* @"sol.withdraw_vested::calculate_vested_amount.anon.1"(i8* %11), !dbg !329
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !329
  %14 = call i8* @"sol.<="(i8* %3, i8* %1), !dbg !330
  %15 = call i8* @sol.if(i8* %14), !dbg !331
  %16 = call i8* @"sol.withdraw_vested::calculate_vested_amount.anon.2"(i8* %15), !dbg !332
  %17 = call i8* @sol.ifTrue.anon.(i8* %16), !dbg !332
  %18 = call i8* @sol.checked_sub.2(i8* %2, i8* %1), !dbg !333
  %19 = call i8* @sol.ok_or.2(i8* %18, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !334
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_duration, i64 0, i64 0), i8* %19), !dbg !335
  %20 = call i8* @sol.checked_sub.2(i8* %3, i8* %1), !dbg !336
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !337
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %21), !dbg !338
  %22 = call i8* @sol.checked_sub.2(i8* %0, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0)), !dbg !339
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !340
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @vesting_portion, i64 0, i64 0), i8* %23), !dbg !341
  %24 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @vesting_portion, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_duration, i64 0, i64 0)), !dbg !342
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unlocked_vesting, i64 0, i64 0), i8* %24), !dbg !343
  %25 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unlocked_vesting, i64 0, i64 0)), !dbg !344
  %26 = call i8* @sol.into.1(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !345
  %27 = call i8* @sol.ok_or.2(i8* %25, i8* %26), !dbg !346
  ret i8* %0, !dbg !323
}

define i8* @sol.model.struct.anchor.FinalizeBpdCalculation(i8* %0) !dbg !347 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !349
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([72 x i8], [72 x i8]* @"constraint=caller.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !351
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @caller, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !352
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !353
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !354
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([308 x i8], [308 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.bpd_calculation_complete@HelixError::BpdCalculationAlreadyComplete,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,", i64 0, i64 0)), !dbg !355
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !356
  ret i8* %0, !dbg !349
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.1"(i8* %0) !dbg !357 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !358
  %3 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0)), !dbg !360
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* %3), !dbg !361
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0)), !dbg !362
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !363
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([41 x i8], [41 x i8]* @claim_config.bpd_finalize_start_timestamp, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @clock.unix_timestamp, i64 0, i64 0)), !dbg !364
  %4 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !365
  ret i8* %0, !dbg !358
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.2"(i8* %0) !dbg !366 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !367
  ret i8* %0, !dbg !367
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.3"(i8* %0) !dbg !369 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !370
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !372
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !373
  %3 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !374
  %4 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !375
  %5 = call i8* @sol.return.1(i8* %4), !dbg !376
  ret i8* %0, !dbg !370
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.5"(i8* %0) !dbg !377 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !378
  %3 = call i8* @sol.model.break(), !dbg !380
  ret i8* %0, !dbg !378
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.6"(i8* %0) !dbg !381 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !382
  ret i8* %0, !dbg !382
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.7"(i8* %0) !dbg !384 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !385
  ret i8* %0, !dbg !385
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.8"(i8* %0) !dbg !387 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !388
  ret i8* %0, !dbg !388
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.9"(i8* %0) !dbg !390 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !391
  ret i8* %0, !dbg !391
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.10"(i8* %0) !dbg !393 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !394
  ret i8* %0, !dbg !394
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.11"(i8* %0) !dbg !396 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !397
  ret i8* %0, !dbg !397
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.12"(i8* %0) !dbg !399 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !400
  ret i8* %0, !dbg !400
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.13"(i8* %0) !dbg !402 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !403
  ret i8* %0, !dbg !403
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.4"(i8* %0) !dbg !405 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !406
  %3 = call i8* @"sol.>="(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @i, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @MAX_STAKES_PER_FINALIZE, i64 0, i64 0)), !dbg !408
  %4 = call i8* @sol.if(i8* %3), !dbg !409
  %5 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.5"(i8* %4), !dbg !410
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !410
  %7 = call i8* @"sol.crate::id.0"(), !dbg !411
  %8 = call i8* @"sol.!="(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @account_info.owner, i64 0, i64 0), i8* %7), !dbg !412
  %9 = call i8* @sol.if(i8* %8), !dbg !413
  %10 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.6"(i8* %9), !dbg !414
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !414
  %12 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !415
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0), i8* %12), !dbg !416
  %13 = call i8* @sol.len.1(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0)), !dbg !417
  %14 = call i8* @"sol.<"(i8* %13, i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"StakeAccount::LEN", i64 0, i64 0)), !dbg !418
  %15 = call i8* @sol.if(i8* %14), !dbg !419
  %16 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.7"(i8* %15), !dbg !420
  %17 = call i8* @sol.ifTrue.anon.(i8* %16), !dbg !420
  %18 = call i8* @sol.match.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @s, i64 0, i64 0)), !dbg !421
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %18), !dbg !422
  %19 = call i8* @sol.drop.1(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0)), !dbg !423
  %20 = call i8* @"sol.=="(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @stake.bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !424
  %21 = call i8* @sol.if(i8* %20), !dbg !425
  %22 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.8"(i8* %21), !dbg !426
  %23 = call i8* @sol.ifTrue.anon.(i8* %22), !dbg !426
  %24 = call i8* @"sol.crate::security::validate_stake_pda.2"(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0)), !dbg !427
  %25 = call i8* @sol.is_err.1(i8* %24), !dbg !428
  %26 = call i8* @sol.if(i8* %25), !dbg !429
  %27 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.9"(i8* %26), !dbg !430
  %28 = call i8* @sol.ifTrue.anon.(i8* %27), !dbg !430
  %29 = call i8* @"sol.!"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @stake.is_active, i64 0, i64 0)), !dbg !431
  %30 = call i8* @sol.if(i8* %29), !dbg !432
  %31 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.10"(i8* %30), !dbg !433
  %32 = call i8* @sol.ifTrue.anon.(i8* %31), !dbg !433
  %33 = call i8* @"sol.<"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0)), !dbg !434
  %34 = call i8* @sol.if(i8* %33), !dbg !435
  %35 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.11"(i8* %34), !dbg !436
  %36 = call i8* @sol.ifTrue.anon.(i8* %35), !dbg !436
  %37 = call i8* @"sol.>"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0)), !dbg !437
  %38 = call i8* @sol.if(i8* %37), !dbg !438
  %39 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.12"(i8* %38), !dbg !439
  %40 = call i8* @sol.ifTrue.anon.(i8* %39), !dbg !439
  %41 = call i8* @"sol.std::cmp::min.2"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.end_slot, i64 0, i64 0)), !dbg !440
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* %41), !dbg !441
  %42 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0)), !dbg !442
  %43 = call i8* @"sol./"(i8* %42, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !443
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* %43), !dbg !444
  %44 = call i8* @"sol.=="(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !445
  %45 = call i8* @sol.if(i8* %44), !dbg !446
  %46 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.13"(i8* %45), !dbg !447
  %47 = call i8* @sol.ifTrue.anon.(i8* %46), !dbg !447
  %48 = call i8* @sol.typecast(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !448
  %49 = call i8* @sol.typecast(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !449
  %50 = call i8* @sol.checked_mul.2(i8* %48, i8* %49), !dbg !450
  %51 = call i8* @sol.ok_or.2(i8* %50, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !451
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0), i8* %51), !dbg !452
  %52 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0)), !dbg !453
  %53 = call i8* @sol.ok_or.2(i8* %52, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !454
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0), i8* %53), !dbg !455
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @stake.bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !456
  %54 = call i8* @sol.try_borrow_mut_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !457
  %55 = call i8* @sol.try_serialize.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %54), !dbg !458
  %56 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !459
  %57 = call i8* @sol.ok_or.2(i8* %56, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !460
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* %57), !dbg !461
  ret i8* %0, !dbg !406
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.1"(i8* %0) !dbg !462 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([56 x i8], [56 x i8]* @"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>", i64 0, i64 0)), !dbg !463
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !465
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !466
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !467
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !468
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"global_state.slots_per_day>0", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::InvalidSlotsPerDay", i64 0, i64 0)), !dbg !469
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"clock.slot>claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::BigPayDayNotAvailable", i64 0, i64 0)), !dbg !470
  %6 = call i8* @"sol.=="(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !471
  %7 = call i8* @"sol.=="(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !472
  %8 = call i8* @"sol.&&"(i8* %6, i8* %7), !dbg !471
  %9 = call i8* @"sol.=="(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !473
  %10 = call i8* @"sol.&&"(i8* %8, i8* %9), !dbg !471
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @is_first_batch, i64 0, i64 0), i8* %10), !dbg !474
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @finalized_before, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0)), !dbg !475
  %11 = call i8* @sol.if(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @is_first_batch, i64 0, i64 0)), !dbg !476
  %12 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.1"(i8* %11), !dbg !477
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !477
  %14 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.2"(i8* %13), !dbg !478
  %15 = call i8* @sol.ifFalse.anon.(i8* %14), !dbg !478
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* %15), !dbg !479
  %16 = call i8* @"sol.=="(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !480
  %17 = call i8* @sol.if(i8* %16), !dbg !481
  %18 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.3"(i8* %17), !dbg !482
  %19 = call i8* @sol.ifTrue.anon.(i8* %18), !dbg !482
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0)), !dbg !483
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !484
  %20 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.4.2", i64 0, i64 0)), !dbg !485
  %21 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0)), !dbg !486
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !487
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* %22), !dbg !488
  %23 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @finalized_before, i64 0, i64 0)), !dbg !489
  %24 = call i8* @sol.ok_or.2(i8* %23, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !490
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @batch_stakes_processed, i64 0, i64 0), i8* %24), !dbg !491
  %25 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([62 x i8], [62 x i8]* @"BpdBatchFinalized{claim_period_id:claim_config.claim_period_id", i64 0, i64 0), i8* getelementptr inbounds ([193 x i8], [193 x i8]* @"batch_stakes_processed,total_stakes_finalized:claim_config.bpd_stakes_finalized,cumulative_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,timestamp:clock.unix_timestamp,}", i64 0, i64 0)), !dbg !492
  %26 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !493
  ret i8* %0, !dbg !463
}

define i8* @sol.model.struct.anchor.CreateStake(i8* %0) !dbg !494 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !496
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !498
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !499
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !500
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !501
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([133 x i8], [133 x i8]* @"init,payer=user,space=StakeAccount::LEN,seeds=[STAKE_SEED,user.key().as_ref(),&global_state.total_stakes_created.to_le_bytes()],bump,", i64 0, i64 0)), !dbg !502
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !503
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([111 x i8], [111 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !504
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !505
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !506
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !507
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !508
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !509
  ret i8* %0, !dbg !496
}

define i8* @"create_stake::create_stake.anon.4"(i8* %0) !dbg !510 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !511
  ret i8* %0, !dbg !511
}

define i8* @"create_stake::create_stake.anon.5"(i8* %0) !dbg !513 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !514
  ret i8* %0, !dbg !514
}

define i8* @"create_stake::create_stake.anon.3"(i8* %0) !dbg !516 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !517
  %3 = call i8* @"sol.<="(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0)), !dbg !519
  %4 = call i8* @"sol.&&"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.claim_period_started, i64 0, i64 0), i8* %3), !dbg !520
  %5 = call i8* @sol.if(i8* %4), !dbg !521
  %6 = call i8* @"sol.create_stake::create_stake.anon.4"(i8* %5), !dbg !522
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !522
  %8 = call i8* @"sol.create_stake::create_stake.anon.5"(i8* %7), !dbg !523
  %9 = call i8* @sol.ifFalse.anon.(i8* %8), !dbg !523
  ret i8* %0, !dbg !517
}

define i8* @"create_stake::create_stake.anon.6"(i8* %0) !dbg !524 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !525
  ret i8* %0, !dbg !525
}

define i8* @"create_stake::create_stake.anon.2"(i8* %0) !dbg !527 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !528
  %3 = call i8* @"sol.Account::try_from.1"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config_info, i64 0, i64 0)), !dbg !530
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([51 x i8], [51 x i8]* @"Account::<ClaimConfig>::try_from(claim_config_info)", i64 0, i64 0), i8* %3), !dbg !531
  %4 = call i8* @"sol.create_stake::create_stake.anon.3"(i8* getelementptr inbounds ([51 x i8], [51 x i8]* @"Account::<ClaimConfig>::try_from(claim_config_info)", i64 0, i64 0)), !dbg !532
  %5 = call i8* @sol.ifTrue.anon.(i8* %4), !dbg !532
  %6 = call i8* @"sol.create_stake::create_stake.anon.6"(i8* %5), !dbg !533
  %7 = call i8* @sol.ifFalse.anon.(i8* %6), !dbg !533
  ret i8* %0, !dbg !528
}

define i8* @"create_stake::create_stake.anon.7"(i8* %0) !dbg !534 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !535
  ret i8* %0, !dbg !535
}

define i8* @"create_stake::create_stake.anon.1"(i8* %0) !dbg !537 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !538
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config_info, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.remaining_accounts, i64 0, i64 0)), !dbg !540
  %3 = call i8* @"sol.Pubkey::find_program_address.2"(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"[CLAIM_CONFIG_SEED]", i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @ctx.program_id, i64 0, i64 0)), !dbg !541
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"(expected_pda,_)", i64 0, i64 0), i8* %3), !dbg !542
  %4 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config_info, i64 0, i64 0)), !dbg !543
  %5 = call i8* @"sol.=="(i8* %4, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0)), !dbg !544
  %6 = call i8* @sol.if(i8* %5), !dbg !545
  %7 = call i8* @"sol.create_stake::create_stake.anon.2"(i8* %6), !dbg !546
  %8 = call i8* @sol.ifTrue.anon.(i8* %7), !dbg !546
  %9 = call i8* @"sol.create_stake::create_stake.anon.7"(i8* %8), !dbg !547
  %10 = call i8* @sol.ifFalse.anon.(i8* %9), !dbg !547
  ret i8* %0, !dbg !538
}

define i8* @"create_stake::create_stake.anon.8"(i8* %0) !dbg !548 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !549
  ret i8* %0, !dbg !549
}

define i8* @"create_stake::create_stake.3"(i8* %0, i8* %1, i8* %2) !dbg !551 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([45 x i8], [45 x i8]* @"Context<'_,'_,'info,'info,CreateStake<'info>>", i64 0, i64 0)), !dbg !552
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !552
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !552
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !554
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !555
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"amount>=global_state.min_stake_amount", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"HelixError::StakeBelowMinimum", i64 0, i64 0)), !dbg !556
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"days>=1&&days<=MAX_STAKE_DAYSasu16", i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"HelixError::InvalidStakeDuration", i64 0, i64 0)), !dbg !557
  %9 = call i8* @"sol.Clock::get.0"(), !dbg !558
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %9), !dbg !559
  %10 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !560
  %11 = call i8* @sol.calculate_t_shares.3(i8* %1, i8* %10, i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0)), !dbg !561
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* %11), !dbg !562
  %12 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !563
  %13 = call i8* @sol.checked_mul.2(i8* %12, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !564
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !565
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %14), !dbg !566
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !567
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* %16), !dbg !568
  %17 = call i8* @sol.calculate_reward_debt.2(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0)), !dbg !569
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* %17), !dbg !570
  %18 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !571
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @stake_account.user, i64 0, i64 0), i8* %18), !dbg !572
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @stake_account.stake_id, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0)), !dbg !573
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @stake_account.staked_amount, i64 0, i64 0), i8* %1), !dbg !574
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @stake_account.t_shares, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !575
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @stake_account.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !576
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @stake_account.end_slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !577
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @stake_account.stake_days, i64 0, i64 0), i8* %2), !dbg !578
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake_account.reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0)), !dbg !579
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake_account.is_active, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !580
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @stake_account.bump, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @ctx.bumps.stake_account, i64 0, i64 0)), !dbg !581
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @stake_account.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !582
  %19 = call i8* @sol.is_empty.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.remaining_accounts, i64 0, i64 0)), !dbg !583
  %20 = call i8* @"sol.!"(i8* %19), !dbg !584
  %21 = call i8* @sol.if(i8* %20), !dbg !585
  %22 = call i8* @"sol.create_stake::create_stake.anon.1"(i8* %21), !dbg !586
  %23 = call i8* @sol.ifTrue.anon.(i8* %22), !dbg !586
  %24 = call i8* @"sol.create_stake::create_stake.anon.8"(i8* %23), !dbg !587
  %25 = call i8* @sol.ifFalse.anon.(i8* %24), !dbg !587
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"(bpd_eligible,claim_period_start_slot)", i64 0, i64 0), i8* %25), !dbg !588
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @stake_account.bpd_eligible, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bpd_eligible, i64 0, i64 0)), !dbg !589
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @stake_account.claim_period_start_slot, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_period_start_slot, i64 0, i64 0)), !dbg !590
  %26 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !591
  %27 = call i8* @sol.ok_or.2(i8* %26, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !592
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0), i8* %27), !dbg !593
  %28 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* %1), !dbg !594
  %29 = call i8* @sol.ok_or.2(i8* %28, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !595
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* %29), !dbg !596
  %30 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !597
  %31 = call i8* @sol.ok_or.2(i8* %30, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !598
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* %31), !dbg !599
  %32 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !600
  %33 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !601
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %33), !dbg !602
  %34 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !603
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %34), !dbg !604
  %35 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !605
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %35), !dbg !606
  %36 = call i8* @"sol.model.struct.new.token_2022::Burn.3"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !607
  %37 = call i8* @"sol.CpiContext::new.2"(i8* %32, i8* %36), !dbg !608
  %38 = call i8* @"sol.token_2022::burn.2"(i8* %37, i8* %1), !dbg !609
  %39 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"StakeCreated{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([118 x i8], [118 x i8]* @"user:ctx.accounts.user.key(),stake_id:stake_account.stake_id,amount,t_shares,days,share_rate:global_state.share_rate,}", i64 0, i64 0)), !dbg !610
  %40 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !611
  ret i8* %0, !dbg !552
}

define i8* @sol.model.struct.anchor.ClaimRewards(i8* %0) !dbg !612 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !614
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !616
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !617
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !618
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !619
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([311 x i8], [311 x i8]* @"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeNotActive,realloc=StakeAccount::LEN,realloc::payer=user,realloc::zero=false,", i64 0, i64 0)), !dbg !620
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !621
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([111 x i8], [111 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !622
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !623
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !624
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !625
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !626
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !627
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !628
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !629
  ret i8* %0, !dbg !614
}

define i8* @"claim_rewards::claim_rewards.anon.1"(i8* %0) !dbg !630 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !631
  %3 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !633
  %4 = call i8* @sol.typecast(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @loyalty_bonus, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !634
  %5 = call i8* @sol.checked_add.2(i8* %3, i8* %4), !dbg !635
  %6 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !636
  %7 = call i8* @sol.ok_or.2(i8* %5, i8* %6), !dbg !637
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0), i8* %7), !dbg !638
  %8 = call i8* @sol.typecast(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !639
  %9 = call i8* @sol.checked_mul.2(i8* %8, i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0)), !dbg !640
  %10 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !641
  %11 = call i8* @sol.ok_or.2(i8* %9, i8* %10), !dbg !642
  %12 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !643
  %13 = call i8* @sol.checked_div.2(i8* %11, i8* %12), !dbg !644
  %14 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"(HelixError::DivisionByZero)", i64 0, i64 0)), !dbg !645
  %15 = call i8* @sol.ok_or.2(i8* %13, i8* %14), !dbg !646
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @adjusted, i64 0, i64 0), i8* %15), !dbg !647
  %16 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @adjusted, i64 0, i64 0)), !dbg !648
  %17 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !649
  %18 = call i8* @sol.map_err.2(i8* %16, i8* %17), !dbg !650
  ret i8* %0, !dbg !631
}

define i8* @"claim_rewards::claim_rewards.anon.2"(i8* %0) !dbg !651 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !652
  ret i8* %0, !dbg !652
}

define i8* @"claim_rewards::claim_rewards.anon.3"(i8* %0) !dbg !654 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !655
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @stake_mut.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !657
  ret i8* %0, !dbg !655
}

define i8* @"claim_rewards::claim_rewards.1"(i8* %0) !dbg !658 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<ClaimRewards>", i64 0, i64 0)), !dbg !659
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !661
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !662
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !663
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !664
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @stake_id, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.stake_id, i64 0, i64 0)), !dbg !665
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0)), !dbg !666
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake.user, i64 0, i64 0)), !dbg !667
  %4 = call i8* @sol.calculate_pending_rewards.3(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @stake.reward_debt, i64 0, i64 0)), !dbg !668
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* %4), !dbg !669
  %5 = call i8* @sol.typecast(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !670
  %6 = call i8* @sol.calculate_loyalty_bonus.4(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %5, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !671
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @loyalty_bonus, i64 0, i64 0), i8* %6), !dbg !672
  %7 = call i8* @"sol.>"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @loyalty_bonus, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !673
  %8 = call i8* @"sol.>"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !674
  %9 = call i8* @"sol.&&"(i8* %7, i8* %8), !dbg !673
  %10 = call i8* @sol.if(i8* %9), !dbg !675
  %11 = call i8* @"sol.claim_rewards::claim_rewards.anon.1"(i8* %10), !dbg !676
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !676
  %13 = call i8* @"sol.claim_rewards::claim_rewards.anon.2"(i8* %12), !dbg !677
  %14 = call i8* @sol.ifFalse.anon.(i8* %13), !dbg !677
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @loyalty_adjusted_rewards, i64 0, i64 0), i8* %14), !dbg !678
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0)), !dbg !679
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @loyalty_adjusted_rewards, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0)), !dbg !680
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !681
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_rewards, i64 0, i64 0), i8* %16), !dbg !682
  %17 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"total_rewards>0", i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"HelixError::ClaimAmountZero", i64 0, i64 0)), !dbg !683
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_mut, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !684
  %18 = call i8* @sol.calculate_reward_debt.2(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0)), !dbg !685
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @stake_mut.reward_debt, i64 0, i64 0), i8* %18), !dbg !686
  %19 = call i8* @"sol.>"(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !687
  %20 = call i8* @sol.if(i8* %19), !dbg !688
  %21 = call i8* @"sol.claim_rewards::claim_rewards.anon.3"(i8* %20), !dbg !689
  %22 = call i8* @sol.ifTrue.anon.(i8* %21), !dbg !689
  %23 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_claims_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !690
  %24 = call i8* @sol.ok_or.2(i8* %23, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !691
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_claims_created, i64 0, i64 0), i8* %24), !dbg !692
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !693
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !694
  %25 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !695
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %25), !dbg !696
  %26 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !697
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %26), !dbg !698
  %27 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !699
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %27), !dbg !700
  %28 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !701
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %28), !dbg !702
  %29 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !703
  %30 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %29, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !704
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %30), !dbg !705
  %31 = call i8* @"sol.token_2022::mint_to.2"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_rewards, i64 0, i64 0)), !dbg !706
  %32 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"RewardsClaimed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"user,stake_id,amount:total_rewards,}", i64 0, i64 0)), !dbg !707
  %33 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !708
  ret i8* %0, !dbg !659
}

define i8* @sol.model.struct.anchor.AcceptAuthority(i8* %0) !dbg !709 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !711
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([147 x i8], [147 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=!global_state.is_bpd_window_active()@HelixError::AuthorityTransferBlockedDuringBpd,", i64 0, i64 0)), !dbg !713
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !714
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([83 x i8], [83 x i8]* @"mut,seeds=[PENDING_AUTHORITY_SEED],bump=pending_authority.bump,close=new_authority,", i64 0, i64 0)), !dbg !715
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @pending_authority, i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"Account<'info,PendingAuthority>", i64 0, i64 0)), !dbg !716
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([105 x i8], [105 x i8]* @"mut,constraint=new_authority.key()==pending_authority.new_authority@HelixError::UnauthorizedNewAuthority,", i64 0, i64 0)), !dbg !717
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !718
  ret i8* %0, !dbg !711
}

define i8* @"accept_authority::accept_authority.1"(i8* %0) !dbg !719 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<AcceptAuthority>", i64 0, i64 0)), !dbg !720
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @old_authority, i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @ctx.accounts.global_state.authority, i64 0, i64 0)), !dbg !722
  %3 = call i8* @sol.key.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.new_authority, i64 0, i64 0)), !dbg !723
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* %3), !dbg !724
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @ctx.accounts.global_state.authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0)), !dbg !725
  %4 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([40 x i8], [40 x i8]* @"AuthorityTransferCompleted{old_authority", i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"new_authority,}", i64 0, i64 0)), !dbg !726
  %5 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !727
  ret i8* %0, !dbg !720
}

define i8* @sol.model.struct.anchor.FreeClaim(i8* %0) !dbg !728 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !730
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !732
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @claimer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !733
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([72 x i8], [72 x i8]* @"constraint=snapshot_wallet.key()==claimer.key()@HelixError::Unauthorized", i64 0, i64 0)), !dbg !734
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !735
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !736
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !737
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([132 x i8], [132 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,", i64 0, i64 0)), !dbg !738
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !739
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([156 x i8], [156 x i8]* @"init,payer=claimer,space=ClaimStatus::LEN,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],snapshot_wallet.key().as_ref()],bump,", i64 0, i64 0)), !dbg !740
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimStatus>", i64 0, i64 0)), !dbg !741
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([114 x i8], [114 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=claimer,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !742
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claimer_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !743
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !744
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !745
  %17 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !746
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !747
  %19 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"address=ix_sysvar::ID", i64 0, i64 0)), !dbg !748
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @instructions_sysvar, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !749
  %21 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !750
  %22 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !751
  ret i8* %0, !dbg !730
}

define i8* @"free_claim::free_claim.3"(i8* %0, i8* %1, i8* %2) !dbg !752 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<FreeClaim>", i64 0, i64 0)), !dbg !753
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @snapshot_balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !753
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @proof, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"Vec<[u8;32]>", i64 0, i64 0)), !dbg !753
  %7 = call i8* @"sol.Clock::get.0"(), !dbg !755
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %7), !dbg !756
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !757
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_status, i64 0, i64 0)), !dbg !758
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !759
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"clock.slot<=claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::ClaimPeriodEnded", i64 0, i64 0)), !dbg !760
  %9 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"snapshot_balance>=MIN_SOL_BALANCE", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::SnapshotBalanceTooLow", i64 0, i64 0)), !dbg !761
  %10 = call i8* @sol.key.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.accounts.snapshot_wallet, i64 0, i64 0)), !dbg !762
  %11 = call i8* @sol.verify_ed25519_signature.3(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @ctx.accounts.instructions_sysvar, i64 0, i64 0), i8* %10, i8* %1), !dbg !763
  %12 = call i8* @sol.key.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.accounts.snapshot_wallet, i64 0, i64 0)), !dbg !764
  %13 = call i8* @sol.verify_merkle_proof.5(i8* %12, i8* %1, i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.merkle_root, i64 0, i64 0), i8* %2), !dbg !765
  %14 = call i8* @sol.calculate_days_elapsed.3(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !766
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0), i8* %14), !dbg !767
  %15 = call i8* @sol.calculate_speed_bonus.2(i8* %1, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0)), !dbg !768
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"(bonus_bps,base_amount,bonus_amount)", i64 0, i64 0), i8* %15), !dbg !769
  %16 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @base_amount, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bonus_amount, i64 0, i64 0)), !dbg !770
  %17 = call i8* @sol.ok_or.2(i8* %16, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !771
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0), i8* %17), !dbg !772
  %18 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @"total_amount>0", i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"HelixError::ClaimAmountZero", i64 0, i64 0)), !dbg !773
  %19 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @IMMEDIATE_RELEASE_BPS, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !774
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0), i8* %19), !dbg !775
  %20 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0)), !dbg !776
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !777
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @vesting_amount, i64 0, i64 0), i8* %21), !dbg !778
  %22 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @VESTING_DAYS, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !779
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !780
  %24 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %23), !dbg !781
  %25 = call i8* @sol.ok_or.2(i8* %24, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !782
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0), i8* %25), !dbg !783
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_status.is_claimed, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !784
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @claim_status.claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0)), !dbg !785
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @claim_status.claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !786
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @claim_status.bonus_bps, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0)), !dbg !787
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0)), !dbg !788
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0)), !dbg !789
  %26 = call i8* @sol.key.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.accounts.snapshot_wallet, i64 0, i64 0)), !dbg !790
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_status.snapshot_wallet, i64 0, i64 0), i8* %26), !dbg !791
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_status.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.claim_status, i64 0, i64 0)), !dbg !792
  %27 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0)), !dbg !793
  %28 = call i8* @sol.ok_or.2(i8* %27, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !794
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0), i8* %28), !dbg !795
  %29 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.claim_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !796
  %30 = call i8* @sol.ok_or.2(i8* %29, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !797
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.claim_count, i64 0, i64 0), i8* %30), !dbg !798
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !799
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !800
  %31 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !801
  %32 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !802
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %32), !dbg !803
  %33 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @ctx.accounts.claimer_token_account, i64 0, i64 0)), !dbg !804
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %33), !dbg !805
  %34 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !806
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %34), !dbg !807
  %35 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !808
  %36 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %31, i8* %35, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !809
  %37 = call i8* @"sol.token_2022::mint_to.2"(i8* %36, i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0)), !dbg !810
  %38 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"TokensClaimed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([295 x i8], [295 x i8]* @"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),snapshot_wallet:ctx.accounts.snapshot_wallet.key(),claim_period_id:claim_config.claim_period_id,snapshot_balance,base_amount,bonus_bps,days_elapsed:days_elapsedasu16,total_amount,immediate_amount,vesting_amount,vesting_end_slot,}", i64 0, i64 0)), !dbg !811
  %39 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !812
  ret i8* %0, !dbg !753
}

define i8* @"free_claim::verify_ed25519_signature.3"(i8* %0, i8* %1, i8* %2) !dbg !813 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @instructions_sysvar, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"&AccountInfo", i64 0, i64 0)), !dbg !814
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !814
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !814
  %7 = call i8* @sol.load_current_index_checked.1(i8* %0), !dbg !816
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @current_ix_index, i64 0, i64 0), i8* %7), !dbg !817
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"current_ix_index>0", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::MissingEd25519Instruction", i64 0, i64 0)), !dbg !818
  %9 = call i8* @sol.-(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @current_ix_index, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !819
  %10 = call i8* @sol.typecast(i8* %9, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !820
  %11 = call i8* @sol.load_instruction_at_checked.2(i8* %10, i8* %0), !dbg !821
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @ed25519_ix, i64 0, i64 0), i8* %11), !dbg !822
  %12 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([42 x i8], [42 x i8]* @"ed25519_ix.program_id==ed25519_program::ID", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::MissingEd25519Instruction", i64 0, i64 0)), !dbg !823
  %13 = call i8* @"sol.model.macro.format.!1"(i8* getelementptr inbounds ([44 x i8], [44 x i8]* @"(\22HELIX:claim:{}:{}\22,snapshot_wallet,amount)", i64 0, i64 0)), !dbg !824
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @expected_message, i64 0, i64 0), i8* %13), !dbg !825
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @ix_data, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @ed25519_ix.data, i64 0, i64 0)), !dbg !826
  %14 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"ix_data.len()>=16", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !827
  %15 = call i8* @"sol.u16::from_le_bytes.1"(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"[ix_data[6],ix_data[7]]", i64 0, i64 0)), !dbg !828
  %16 = call i8* @sol.typecast(i8* %15, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !828
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pubkey_offset, i64 0, i64 0), i8* %16), !dbg !829
  %17 = call i8* @"sol.u16::from_le_bytes.1"(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"[ix_data[10],ix_data[11]]", i64 0, i64 0)), !dbg !830
  %18 = call i8* @sol.typecast(i8* %17, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !830
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @msg_offset, i64 0, i64 0), i8* %18), !dbg !831
  %19 = call i8* @"sol.u16::from_le_bytes.1"(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"[ix_data[12],ix_data[13]]", i64 0, i64 0)), !dbg !832
  %20 = call i8* @sol.typecast(i8* %19, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !832
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @msg_len, i64 0, i64 0), i8* %20), !dbg !833
  %21 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"ix_data.len()>=pubkey_offset+32", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !834
  %22 = call i8* @"sol.Pubkey::try_from.1"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @ix_data, i64 0, i64 0)), !dbg !835
  %23 = call i8* @sol.map_err.2(i8* %22, i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !836
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @signed_pubkey, i64 0, i64 0), i8* %23), !dbg !837
  %24 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"signed_pubkey==snapshot_wallet", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !838
  %25 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"ix_data.len()>=msg_offset+msg_len", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !839
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @signed_message, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @ix_data, i64 0, i64 0)), !dbg !840
  %26 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([43 x i8], [43 x i8]* @"signed_message==expected_message.as_bytes()", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !841
  %27 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !842
  ret i8* %0, !dbg !814
}

define i8* @"free_claim::verify_merkle_proof.anon.1"(i8* %0) !dbg !843 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !844
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[&hash,sibling]", i64 0, i64 0)), !dbg !846
  ret i8* %0, !dbg !844
}

define i8* @"free_claim::verify_merkle_proof.anon.2"(i8* %0) !dbg !847 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !848
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[sibling,&hash]", i64 0, i64 0)), !dbg !850
  ret i8* %0, !dbg !848
}

define i8* @"free_claim::verify_merkle_proof.anon.4"(i8* %0) !dbg !851 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !852
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[&hash,sibling]", i64 0, i64 0)), !dbg !854
  ret i8* %0, !dbg !852
}

define i8* @"free_claim::verify_merkle_proof.anon.5"(i8* %0) !dbg !855 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !856
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[sibling,&hash]", i64 0, i64 0)), !dbg !858
  ret i8* %0, !dbg !856
}

define i8* @"free_claim::verify_merkle_proof.anon.3"(i8* %0) !dbg !859 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !860
  %3 = call i8* @"sol.<"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @hash, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @sibling, i64 0, i64 0)), !dbg !862
  %4 = call i8* @sol.if(i8* %3), !dbg !863
  %5 = call i8* @"sol.free_claim::verify_merkle_proof.anon.4"(i8* %4), !dbg !864
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !864
  %7 = call i8* @"sol.free_claim::verify_merkle_proof.anon.5"(i8* %6), !dbg !865
  %8 = call i8* @sol.ifFalse.anon.(i8* %7), !dbg !865
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @hash, i64 0, i64 0), i8* %8), !dbg !866
  ret i8* %0, !dbg !860
}

define i8* @"free_claim::verify_merkle_proof.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4) !dbg !867 {
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !868
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !868
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !868
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"&[u8;32]", i64 0, i64 0)), !dbg !868
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @proof, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"&[[u8;32]]", i64 0, i64 0)), !dbg !868
  %11 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"proof.len()<=MAX_MERKLE_PROOF_LEN", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::InvalidMerkleProof", i64 0, i64 0)), !dbg !870
  %12 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"[snapshot_wallet.as_ref(),&amount.to_le_bytes(),&claim_period_id.to_le_bytes(),]", i64 0, i64 0)), !dbg !871
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @hash, i64 0, i64 0), i8* %12), !dbg !872
  %13 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"free_claim::verify_merkle_proof.anon.3.1", i64 0, i64 0)), !dbg !873
  %14 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"hash==*merkle_root", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::InvalidMerkleProof", i64 0, i64 0)), !dbg !874
  %15 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !875
  ret i8* %0, !dbg !868
}

define i8* @"free_claim::calculate_days_elapsed.3"(i8* %0, i8* %1, i8* %2) !dbg !876 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !877
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !877
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !877
  %7 = call i8* @sol.checked_sub.2(i8* %1, i8* %0), !dbg !879
  %8 = call i8* @sol.ok_or.2(i8* %7, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !880
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @elapsed_slots, i64 0, i64 0), i8* %8), !dbg !881
  %9 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @elapsed_slots, i64 0, i64 0), i8* %2), !dbg !882
  %10 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"(HelixError::DivisionByZero)", i64 0, i64 0)), !dbg !883
  %11 = call i8* @sol.ok_or.2(i8* %9, i8* %10), !dbg !884
  ret i8* %0, !dbg !877
}

define i8* @"free_claim::calculate_speed_bonus.anon.1"(i8* %0) !dbg !885 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !886
  ret i8* %0, !dbg !886
}

define i8* @"free_claim::calculate_speed_bonus.anon.2"(i8* %0) !dbg !888 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !889
  ret i8* %0, !dbg !889
}

define i8* @"free_claim::calculate_speed_bonus.anon.3"(i8* %0) !dbg !891 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !892
  ret i8* %0, !dbg !892
}

define i8* @"free_claim::calculate_speed_bonus.2"(i8* %0, i8* %1) !dbg !894 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @snapshot_balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !895
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !895
  %5 = call i8* @sol.mul_div.3(i8* %0, i8* getelementptr inbounds ([13 x i8], [13 x i8]* @HELIX_PER_SOL, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !897
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @base_amount, i64 0, i64 0), i8* %5), !dbg !898
  %6 = call i8* @"sol.<="(i8* %1, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @SPEED_BONUS_WEEK1_END, i64 0, i64 0)), !dbg !899
  %7 = call i8* @sol.if(i8* %6), !dbg !900
  %8 = call i8* @"sol.free_claim::calculate_speed_bonus.anon.1"(i8* %7), !dbg !901
  %9 = call i8* @sol.ifTrue.anon.(i8* %8), !dbg !901
  %10 = call i8* @"sol.<="(i8* %1, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @SPEED_BONUS_WEEK4_END, i64 0, i64 0)), !dbg !902
  %11 = call i8* @sol.if(i8* %10), !dbg !903
  %12 = call i8* @"sol.free_claim::calculate_speed_bonus.anon.2"(i8* %11), !dbg !904
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !904
  %14 = call i8* @"sol.free_claim::calculate_speed_bonus.anon.3"(i8* %13), !dbg !905
  %15 = call i8* @sol.ifFalse.anon.(i8* %14), !dbg !905
  %16 = call i8* @sol.ifTrueFalse.anon.(i8* %9, i8* %15), !dbg !903
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0), i8* %16), !dbg !906
  %17 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @base_amount, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !907
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bonus_amount, i64 0, i64 0), i8* %17), !dbg !908
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([39 x i8], [39 x i8]* @"bonus_bpsasu16,base_amount,bonus_amount", i64 0, i64 0)), !dbg !909
  ret i8* %0, !dbg !895
}

define i8* @sol.model.struct.anchor.AbortBpd(i8* %0) !dbg !910 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !912
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([71 x i8], [71 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,has_one=authority,", i64 0, i64 0)), !dbg !914
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !915
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,", i64 0, i64 0)), !dbg !916
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !917
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !918
  ret i8* %0, !dbg !912
}

define i8* @"abort_bpd::abort_bpd.anon.1"(i8* %0) !dbg !919 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !920
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !922
  %4 = call i8* @sol.return.1(i8* %3), !dbg !923
  ret i8* %0, !dbg !920
}

define i8* @"abort_bpd::abort_bpd.1"(i8* %0) !dbg !924 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"Context<AbortBpd>", i64 0, i64 0)), !dbg !925
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !927
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !928
  %3 = call i8* @sol.is_bpd_window_active.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0)), !dbg !929
  %4 = call i8* @"sol.!"(i8* %3), !dbg !930
  %5 = call i8* @sol.if(i8* %4), !dbg !931
  %6 = call i8* @"sol.abort_bpd::abort_bpd.anon.1"(i8* %5), !dbg !932
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !932
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"claim_config.bpd_stakes_distributed==0", i64 0, i64 0), i8* getelementptr inbounds ([41 x i8], [41 x i8]* @"HelixError::BpdDistributionAlreadyStarted", i64 0, i64 0)), !dbg !933
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0)), !dbg !934
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0)), !dbg !935
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !936
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !937
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !938
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !939
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !940
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !941
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !942
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([41 x i8], [41 x i8]* @claim_config.bpd_finalize_start_timestamp, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !943
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_original_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !944
  %9 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !945
  %10 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([55 x i8], [55 x i8]* @"BpdAborted{claim_period_id:claim_config.claim_period_id", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"stakes_finalized,stakes_distributed,}", i64 0, i64 0)), !dbg !946
  %11 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !947
  ret i8* %0, !dbg !925
}

define i8* @sol.model.struct.anchor.SealBpdFinalize(i8* %0) !dbg !948 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !950
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !952
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !953
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !954
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !955
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([308 x i8], [308 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.bpd_calculation_complete@HelixError::BpdCalculationAlreadyComplete,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,", i64 0, i64 0)), !dbg !956
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !957
  ret i8* %0, !dbg !950
}

define i8* @"seal_bpd_finalize::seal_bpd_finalize.anon.1"(i8* %0) !dbg !958 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !959
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !961
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !962
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !963
  %4 = call i8* @sol.return.1(i8* %3), !dbg !964
  ret i8* %0, !dbg !959
}

define i8* @"seal_bpd_finalize::seal_bpd_finalize.2"(i8* %0, i8* %1) !dbg !965 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<SealBpdFinalize>", i64 0, i64 0)), !dbg !966
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @expected_finalized_count, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !966
  %5 = call i8* @"sol.Clock::get.0"(), !dbg !968
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %5), !dbg !969
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !970
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"clock.slot>claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::BigPayDayNotAvailable", i64 0, i64 0)), !dbg !971
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"claim_config.bpd_stakes_finalized>0", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::BpdFinalizationIncomplete", i64 0, i64 0)), !dbg !972
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([43 x i8], [43 x i8]* @"claim_config.bpd_finalize_start_timestamp>0", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::BpdFinalizationIncomplete", i64 0, i64 0)), !dbg !973
  %9 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([136 x i8], [136 x i8]* @"clock.unix_timestamp>=claim_config.bpd_finalize_start_timestamp.checked_add(BPD_SEAL_DELAY_SECONDS).ok_or(error!(HelixError::Overflow))?", i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"HelixError::BpdSealTooEarly", i64 0, i64 0)), !dbg !974
  %10 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([59 x i8], [59 x i8]* @"claim_config.bpd_stakes_finalized==expected_finalized_count", i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"HelixError::BpdFinalizeCountMismatch", i64 0, i64 0)), !dbg !975
  %11 = call i8* @"sol.=="(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !976
  %12 = call i8* @sol.if(i8* %11), !dbg !977
  %13 = call i8* @"sol.seal_bpd_finalize::seal_bpd_finalize.anon.1"(i8* %12), !dbg !978
  %14 = call i8* @sol.ifTrue.anon.(i8* %13), !dbg !978
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0)), !dbg !979
  %15 = call i8* @sol.typecast(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !980
  %16 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !981
  %17 = call i8* @sol.checked_mul.2(i8* %15, i8* %16), !dbg !982
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !983
  %19 = call i8* @sol.checked_div.2(i8* %18, i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0)), !dbg !984
  %20 = call i8* @sol.ok_or.2(i8* %19, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !985
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0), i8* %20), !dbg !986
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0)), !dbg !987
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !988
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_original_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0)), !dbg !989
  %21 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !990
  ret i8* %0, !dbg !966
}

define i8* @sol.model.struct.anchor.TransferAuthority(i8* %0) !dbg !991 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !993
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([125 x i8], [125 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized,", i64 0, i64 0)), !dbg !995
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !996
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([95 x i8], [95 x i8]* @"init_if_needed,payer=authority,space=PendingAuthority::LEN,seeds=[PENDING_AUTHORITY_SEED],bump,", i64 0, i64 0)), !dbg !997
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @pending_authority, i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"Account<'info,PendingAuthority>", i64 0, i64 0)), !dbg !998
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !999
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1000
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1001
  ret i8* %0, !dbg !993
}

define i8* @"transfer_authority::transfer_authority.anon.1"(i8* %0) !dbg !1002 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1003
  %3 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([65 x i8], [65 x i8]* @"AuthorityTransferCancelled{authority:ctx.accounts.authority.key()", i64 0, i64 0), i8* getelementptr inbounds ([47 x i8], [47 x i8]* @"cancelled_new_authority:pending.new_authority,}", i64 0, i64 0)), !dbg !1005
  ret i8* %0, !dbg !1003
}

define i8* @"transfer_authority::transfer_authority.2"(i8* %0, i8* %1) !dbg !1006 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<TransferAuthority>", i64 0, i64 0)), !dbg !1007
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1007
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @pending, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @ctx.accounts.pending_authority, i64 0, i64 0)), !dbg !1009
  %5 = call i8* @"sol.Pubkey::default.0"(), !dbg !1010
  %6 = call i8* @"sol.!="(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @pending.new_authority, i64 0, i64 0), i8* %5), !dbg !1011
  %7 = call i8* @"sol.!="(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @pending.new_authority, i64 0, i64 0), i8* %1), !dbg !1012
  %8 = call i8* @"sol.&&"(i8* %6, i8* %7), !dbg !1011
  %9 = call i8* @sol.if(i8* %8), !dbg !1013
  %10 = call i8* @"sol.transfer_authority::transfer_authority.anon.1"(i8* %9), !dbg !1014
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !1014
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @pending.new_authority, i64 0, i64 0), i8* %1), !dbg !1015
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @pending.bump, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.bumps.pending_authority, i64 0, i64 0)), !dbg !1016
  %12 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"AuthorityTransferInitiated{old_authority:ctx.accounts.authority.key()", i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"new_authority,}", i64 0, i64 0)), !dbg !1017
  %13 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1018
  ret i8* %0, !dbg !1007
}

define i8* @sol.model.struct.anchor.AdminSetClaimEndSlot(i8* %0) !dbg !1019 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1021
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !1023
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1024
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !1025
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1026
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([132 x i8], [132 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,", i64 0, i64 0)), !dbg !1027
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !1028
  ret i8* %0, !dbg !1021
}

define i8* @"admin_set_claim_end_slot::admin_set_claim_end_slot.2"(i8* %0, i8* %1) !dbg !1029 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"Context<AdminSetClaimEndSlot>", i64 0, i64 0)), !dbg !1030
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @new_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1030
  %5 = call i8* @"sol.Clock::get.0"(), !dbg !1032
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %5), !dbg !1033
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !1034
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1035
  %6 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !1036
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1037
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @min_end_slot, i64 0, i64 0), i8* %7), !dbg !1038
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"new_end_slot>=min_end_slot", i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"HelixError::AdminBoundsExceeded", i64 0, i64 0)), !dbg !1039
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0), i8* %1), !dbg !1040
  %9 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1041
  ret i8* %0, !dbg !1030
}

define i8* @sol.model.struct.anchor.Unstake(i8* %0) !dbg !1042 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1044
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1046
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1047
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !1048
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1049
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([249 x i8], [249 x i8]* @"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeAlreadyClosed,", i64 0, i64 0)), !dbg !1050
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !1051
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([111 x i8], [111 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !1052
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !1053
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !1054
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !1055
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !1056
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !1057
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !1058
  ret i8* %0, !dbg !1044
}

define i8* @"unstake::unstake.anon.1"(i8* %0) !dbg !1059 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1060
  %3 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1062
  %4 = call i8* @sol.typecast(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @loyalty_bonus, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1063
  %5 = call i8* @sol.checked_add.2(i8* %3, i8* %4), !dbg !1064
  %6 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1065
  %7 = call i8* @sol.ok_or.2(i8* %5, i8* %6), !dbg !1066
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0), i8* %7), !dbg !1067
  %8 = call i8* @sol.typecast(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1068
  %9 = call i8* @sol.checked_mul.2(i8* %8, i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0)), !dbg !1069
  %10 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1070
  %11 = call i8* @sol.ok_or.2(i8* %9, i8* %10), !dbg !1071
  %12 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1072
  %13 = call i8* @sol.checked_div.2(i8* %11, i8* %12), !dbg !1073
  %14 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"(HelixError::DivisionByZero)", i64 0, i64 0)), !dbg !1074
  %15 = call i8* @sol.ok_or.2(i8* %13, i8* %14), !dbg !1075
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @adjusted, i64 0, i64 0), i8* %15), !dbg !1076
  %16 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @adjusted, i64 0, i64 0)), !dbg !1077
  %17 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1078
  %18 = call i8* @sol.map_err.2(i8* %16, i8* %17), !dbg !1079
  ret i8* %0, !dbg !1060
}

define i8* @"unstake::unstake.anon.2"(i8* %0) !dbg !1080 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1081
  ret i8* %0, !dbg !1081
}

define i8* @"unstake::unstake.anon.3"(i8* %0) !dbg !1083 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1084
  %3 = call i8* @sol.calculate_early_penalty.4(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !1086
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %3), !dbg !1087
  ret i8* %0, !dbg !1084
}

define i8* @"unstake::unstake.anon.5"(i8* %0) !dbg !1088 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1089
  ret i8* %0, !dbg !1089
}

define i8* @"unstake::unstake.anon.6"(i8* %0) !dbg !1091 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1092
  ret i8* %0, !dbg !1092
}

define i8* @"unstake::unstake.anon.4"(i8* %0) !dbg !1094 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1095
  %3 = call i8* @sol.calculate_late_penalty.4(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !1097
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %3), !dbg !1098
  %4 = call i8* @"sol.=="(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1099
  %5 = call i8* @sol.if(i8* %4), !dbg !1100
  %6 = call i8* @"sol.unstake::unstake.anon.5"(i8* %5), !dbg !1101
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !1101
  %8 = call i8* @"sol.unstake::unstake.anon.6"(i8* %7), !dbg !1102
  %9 = call i8* @sol.ifFalse.anon.(i8* %8), !dbg !1102
  ret i8* %0, !dbg !1095
}

define i8* @"unstake::unstake.anon.7"(i8* %0) !dbg !1103 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1104
  %3 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @penalty, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0)), !dbg !1106
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @penalty_share_increase, i64 0, i64 0), i8* %3), !dbg !1107
  %4 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @penalty_share_increase, i64 0, i64 0)), !dbg !1108
  %5 = call i8* @sol.ok_or.2(i8* %4, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1109
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* %5), !dbg !1110
  ret i8* %0, !dbg !1104
}

define i8* @"unstake::unstake.anon.8"(i8* %0) !dbg !1111 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1112
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !1114
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !1115
  %3 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !1116
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %3), !dbg !1117
  %4 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !1118
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %4), !dbg !1119
  %5 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !1120
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %5), !dbg !1121
  %6 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !1122
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %6), !dbg !1123
  %7 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !1124
  %8 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %7, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !1125
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %8), !dbg !1126
  %9 = call i8* @"sol.token_2022::mint_to.2"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @total_mint_amount, i64 0, i64 0)), !dbg !1127
  ret i8* %0, !dbg !1112
}

define i8* @"unstake::unstake.1"(i8* %0) !dbg !1128 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"Context<Unstake>", i64 0, i64 0)), !dbg !1129
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !1131
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !1132
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1133
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !1134
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"!global_state.is_bpd_window_active()", i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"HelixError::UnstakeBlockedDuringBpd", i64 0, i64 0)), !dbg !1135
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_user, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake.user, i64 0, i64 0)), !dbg !1136
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @stake_id, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.stake_id, i64 0, i64 0)), !dbg !1137
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @stake.staked_amount, i64 0, i64 0)), !dbg !1138
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0)), !dbg !1139
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0)), !dbg !1140
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.end_slot, i64 0, i64 0)), !dbg !1141
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @stake.reward_debt, i64 0, i64 0)), !dbg !1142
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0)), !dbg !1143
  %5 = call i8* @sol.calculate_pending_rewards.3(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0)), !dbg !1144
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* %5), !dbg !1145
  %6 = call i8* @sol.typecast(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1146
  %7 = call i8* @sol.calculate_loyalty_bonus.4(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %6, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !1147
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @loyalty_bonus, i64 0, i64 0), i8* %7), !dbg !1148
  %8 = call i8* @"sol.>"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @loyalty_bonus, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1149
  %9 = call i8* @"sol.>"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1150
  %10 = call i8* @"sol.&&"(i8* %8, i8* %9), !dbg !1149
  %11 = call i8* @sol.if(i8* %10), !dbg !1151
  %12 = call i8* @"sol.unstake::unstake.anon.1"(i8* %11), !dbg !1152
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !1152
  %14 = call i8* @"sol.unstake::unstake.anon.2"(i8* %13), !dbg !1153
  %15 = call i8* @sol.ifFalse.anon.(i8* %14), !dbg !1153
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @loyalty_adjusted_rewards, i64 0, i64 0), i8* %15), !dbg !1154
  %16 = call i8* @"sol.<"(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !1155
  %17 = call i8* @sol.if(i8* %16), !dbg !1156
  %18 = call i8* @"sol.unstake::unstake.anon.3"(i8* %17), !dbg !1157
  %19 = call i8* @sol.ifTrue.anon.(i8* %18), !dbg !1157
  %20 = call i8* @"sol.unstake::unstake.anon.4"(i8* %19), !dbg !1158
  %21 = call i8* @sol.ifFalse.anon.(i8* %20), !dbg !1158
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(penalty,penalty_type)", i64 0, i64 0), i8* %21), !dbg !1159
  %22 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @penalty, i64 0, i64 0)), !dbg !1160
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1161
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @return_amount, i64 0, i64 0), i8* %23), !dbg !1162
  %24 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @return_amount, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @loyalty_adjusted_rewards, i64 0, i64 0)), !dbg !1163
  %25 = call i8* @sol.ok_or.2(i8* %24, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1164
  %26 = call i8* @sol.checked_add.2(i8* %25, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0)), !dbg !1165
  %27 = call i8* @sol.ok_or.2(i8* %26, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1166
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @total_mint_amount, i64 0, i64 0), i8* %27), !dbg !1167
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_mut, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !1168
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @stake_mut.is_active, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !1169
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @stake_mut.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1170
  %28 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @global_state.total_unstakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !1171
  %29 = call i8* @sol.ok_or.2(i8* %28, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1172
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @global_state.total_unstakes_created, i64 0, i64 0), i8* %29), !dbg !1173
  %30 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @global_state.total_tokens_unstaked, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0)), !dbg !1174
  %31 = call i8* @sol.ok_or.2(i8* %30, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1175
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @global_state.total_tokens_unstaked, i64 0, i64 0), i8* %31), !dbg !1176
  %32 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !1177
  %33 = call i8* @sol.ok_or.2(i8* %32, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1178
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* %33), !dbg !1179
  %34 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0)), !dbg !1180
  %35 = call i8* @sol.ok_or.2(i8* %34, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1181
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* %35), !dbg !1182
  %36 = call i8* @"sol.>"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @penalty, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1183
  %37 = call i8* @"sol.>"(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1184
  %38 = call i8* @"sol.&&"(i8* %36, i8* %37), !dbg !1183
  %39 = call i8* @sol.if(i8* %38), !dbg !1185
  %40 = call i8* @"sol.unstake::unstake.anon.7"(i8* %39), !dbg !1186
  %41 = call i8* @sol.ifTrue.anon.(i8* %40), !dbg !1186
  %42 = call i8* @"sol.>"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @total_mint_amount, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1187
  %43 = call i8* @sol.if(i8* %42), !dbg !1188
  %44 = call i8* @"sol.unstake::unstake.anon.8"(i8* %43), !dbg !1189
  %45 = call i8* @sol.ifTrue.anon.(i8* %44), !dbg !1189
  %46 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"StakeEnded{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([199 x i8], [199 x i8]* @"user:stake_user,stake_id,original_amount:staked_amount,return_amount,penalty_amount:penalty,penalty_type,rewards_claimed:loyalty_adjusted_rewards.checked_add(bpd_bonus).ok_or(HelixError::Overflow)?,}", i64 0, i64 0)), !dbg !1190
  %47 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1191
  ret i8* %0, !dbg !1129
}

define i8* @"math::mul_div.3"(i8* %0, i8* %1, i8* %2) !dbg !1192 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @a, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1194
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @b, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1194
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @c, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1194
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"c>0", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !1196
  %8 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1197
  %9 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1198
  %10 = call i8* @sol.checked_mul.2(i8* %8, i8* %9), !dbg !1199
  %11 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1200
  %12 = call i8* @sol.ok_or.2(i8* %10, i8* %11), !dbg !1201
  %13 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1202
  %14 = call i8* @sol.checked_div.2(i8* %12, i8* %13), !dbg !1203
  %15 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1204
  %16 = call i8* @sol.ok_or.2(i8* %14, i8* %15), !dbg !1205
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0), i8* %16), !dbg !1206
  %17 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0)), !dbg !1207
  %18 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1208
  %19 = call i8* @sol.map_err.2(i8* %17, i8* %18), !dbg !1209
  ret i8* %0, !dbg !1194
}

define i8* @"math::mul_div_up.3"(i8* %0, i8* %1, i8* %2) !dbg !1210 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @a, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1211
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @b, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1211
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @c, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1211
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"c>0", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !1213
  %8 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1214
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @a_u128, i64 0, i64 0), i8* %8), !dbg !1215
  %9 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1216
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @b_u128, i64 0, i64 0), i8* %9), !dbg !1217
  %10 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1218
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @c_u128, i64 0, i64 0), i8* %10), !dbg !1219
  %11 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @a_u128, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @b_u128, i64 0, i64 0)), !dbg !1220
  %12 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1221
  %13 = call i8* @sol.ok_or.2(i8* %11, i8* %12), !dbg !1222
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @product, i64 0, i64 0), i8* %13), !dbg !1223
  %14 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @c_u128, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !1224
  %15 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"(HelixError::InvalidDivisor)", i64 0, i64 0)), !dbg !1225
  %16 = call i8* @sol.ok_or.2(i8* %14, i8* %15), !dbg !1226
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @rounding, i64 0, i64 0), i8* %16), !dbg !1227
  %17 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @product, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @rounding, i64 0, i64 0)), !dbg !1228
  %18 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1229
  %19 = call i8* @sol.ok_or.2(i8* %17, i8* %18), !dbg !1230
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* %19), !dbg !1231
  %20 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @c_u128, i64 0, i64 0)), !dbg !1232
  %21 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1233
  %22 = call i8* @sol.ok_or.2(i8* %20, i8* %21), !dbg !1234
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0), i8* %22), !dbg !1235
  %23 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0)), !dbg !1236
  %24 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1237
  %25 = call i8* @sol.map_err.2(i8* %23, i8* %24), !dbg !1238
  ret i8* %0, !dbg !1211
}

define i8* @"math::calculate_lpb_bonus.anon.1"(i8* %0) !dbg !1239 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1240
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1242
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1243
  ret i8* %0, !dbg !1240
}

define i8* @"math::calculate_lpb_bonus.anon.2"(i8* %0) !dbg !1244 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1245
  %3 = call i8* @"sol.*"(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"2", i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0)), !dbg !1247
  %4 = call i8* @sol.Ok.1(i8* %3), !dbg !1248
  %5 = call i8* @sol.return.1(i8* %4), !dbg !1249
  ret i8* %0, !dbg !1245
}

define i8* @"math::calculate_lpb_bonus.1"(i8* %0) !dbg !1250 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1251
  %3 = call i8* @"sol.=="(i8* %0, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1253
  %4 = call i8* @sol.if(i8* %3), !dbg !1254
  %5 = call i8* @"sol.math::calculate_lpb_bonus.anon.1"(i8* %4), !dbg !1255
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !1255
  %7 = call i8* @"sol.>="(i8* %0, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @LPB_MAX_DAYS, i64 0, i64 0)), !dbg !1256
  %8 = call i8* @sol.if(i8* %7), !dbg !1257
  %9 = call i8* @"sol.math::calculate_lpb_bonus.anon.2"(i8* %8), !dbg !1258
  %10 = call i8* @sol.ifTrue.anon.(i8* %9), !dbg !1258
  %11 = call i8* @sol.checked_sub.2(i8* %0, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !1259
  %12 = call i8* @sol.ok_or.2(i8* %11, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1260
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @days_minus_one, i64 0, i64 0), i8* %12), !dbg !1261
  %13 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @days_minus_one, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"2", i64 0, i64 0)), !dbg !1262
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1263
  %15 = call i8* @sol.checked_mul.2(i8* %14, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0)), !dbg !1264
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1265
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* %16), !dbg !1266
  %17 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @LPB_MAX_DAYS, i64 0, i64 0)), !dbg !1267
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1268
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %18), !dbg !1269
  %19 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !1270
  ret i8* %0, !dbg !1251
}

define i8* @"math::calculate_bpb_bonus.anon.1"(i8* %0) !dbg !1271 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1272
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1274
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1275
  ret i8* %0, !dbg !1272
}

define i8* @"math::calculate_bpb_bonus.anon.2"(i8* %0) !dbg !1276 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1277
  %3 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @amount_div_10, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_THRESHOLD, i64 0, i64 0)), !dbg !1279
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1280
  ret i8* %0, !dbg !1277
}

define i8* @"math::calculate_bpb_bonus.anon.3"(i8* %0) !dbg !1281 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1282
  %3 = call i8* @"sol.*"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_THRESHOLD, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !1284
  %4 = call i8* @sol.-(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* %3), !dbg !1285
  %5 = call i8* @sol.typecast(i8* %4, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1286
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @excess, i64 0, i64 0), i8* %5), !dbg !1287
  %6 = call i8* @"sol.*"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_THRESHOLD, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !1288
  %7 = call i8* @sol.-(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPB_TIER_2, i64 0, i64 0), i8* %6), !dbg !1289
  %8 = call i8* @sol.typecast(i8* %7, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1290
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_range, i64 0, i64 0), i8* %8), !dbg !1291
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_bonus, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"250_000_000u128", i64 0, i64 0)), !dbg !1292
  %9 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @excess, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_bonus, i64 0, i64 0)), !dbg !1293
  %10 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1294
  %11 = call i8* @sol.ok_or.2(i8* %9, i8* %10), !dbg !1295
  %12 = call i8* @sol.checked_div.2(i8* %11, i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_range, i64 0, i64 0)), !dbg !1296
  %13 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1297
  %14 = call i8* @sol.ok_or.2(i8* %12, i8* %13), !dbg !1298
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %14), !dbg !1299
  %16 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1300
  %17 = call i8* @sol.ok_or.2(i8* %15, i8* %16), !dbg !1301
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %17), !dbg !1302
  ret i8* %0, !dbg !1282
}

define i8* @"math::calculate_bpb_bonus.anon.5"(i8* %0) !dbg !1303 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1304
  %3 = call i8* @sol.-(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPB_TIER_2, i64 0, i64 0)), !dbg !1306
  %4 = call i8* @sol.typecast(i8* %3, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1307
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @excess, i64 0, i64 0), i8* %4), !dbg !1308
  %5 = call i8* @sol.-(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPB_TIER_3, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPB_TIER_2, i64 0, i64 0)), !dbg !1309
  %6 = call i8* @sol.typecast(i8* %5, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1310
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_range, i64 0, i64 0), i8* %6), !dbg !1311
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_bonus, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"150_000_000u128", i64 0, i64 0)), !dbg !1312
  %7 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @excess, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_bonus, i64 0, i64 0)), !dbg !1313
  %8 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1314
  %9 = call i8* @sol.ok_or.2(i8* %7, i8* %8), !dbg !1315
  %10 = call i8* @sol.checked_div.2(i8* %9, i8* getelementptr inbounds ([10 x i8], [10 x i8]* @tier_range, i64 0, i64 0)), !dbg !1316
  %11 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1317
  %12 = call i8* @sol.ok_or.2(i8* %10, i8* %11), !dbg !1318
  %13 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %12), !dbg !1319
  %14 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1320
  %15 = call i8* @sol.ok_or.2(i8* %13, i8* %14), !dbg !1321
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %15), !dbg !1322
  ret i8* %0, !dbg !1304
}

define i8* @"math::calculate_bpb_bonus.anon.6"(i8* %0) !dbg !1323 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1324
  %3 = call i8* @sol.typecast(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_MAX_BONUS, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1326
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %3), !dbg !1327
  ret i8* %0, !dbg !1324
}

define i8* @"math::calculate_bpb_bonus.anon.4"(i8* %0) !dbg !1328 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1329
  %3 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"250_000_000u128", i64 0, i64 0)), !dbg !1331
  %4 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1332
  %5 = call i8* @sol.ok_or.2(i8* %3, i8* %4), !dbg !1333
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %5), !dbg !1334
  %6 = call i8* @"sol.<="(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPB_TIER_3, i64 0, i64 0)), !dbg !1335
  %7 = call i8* @sol.if(i8* %6), !dbg !1336
  %8 = call i8* @"sol.math::calculate_bpb_bonus.anon.5"(i8* %7), !dbg !1337
  %9 = call i8* @sol.ifTrue.anon.(i8* %8), !dbg !1337
  %10 = call i8* @"sol.math::calculate_bpb_bonus.anon.6"(i8* %9), !dbg !1338
  %11 = call i8* @sol.ifFalse.anon.(i8* %10), !dbg !1338
  ret i8* %0, !dbg !1329
}

define i8* @"math::calculate_bpb_bonus.1"(i8* %0) !dbg !1339 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1340
  %3 = call i8* @"sol.=="(i8* %0, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1342
  %4 = call i8* @sol.if(i8* %3), !dbg !1343
  %5 = call i8* @"sol.math::calculate_bpb_bonus.anon.1"(i8* %4), !dbg !1344
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !1344
  %7 = call i8* @"sol./"(i8* %0, i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !1345
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @amount_div_10, i64 0, i64 0), i8* %7), !dbg !1346
  %8 = call i8* @"sol.<"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @amount_div_10, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_THRESHOLD, i64 0, i64 0)), !dbg !1347
  %9 = call i8* @sol.if(i8* %8), !dbg !1348
  %10 = call i8* @"sol.math::calculate_bpb_bonus.anon.2"(i8* %9), !dbg !1349
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !1349
  %12 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1350
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %12), !dbg !1351
  %13 = call i8* @"sol.<="(i8* %0, i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPB_TIER_2, i64 0, i64 0)), !dbg !1352
  %14 = call i8* @sol.if(i8* %13), !dbg !1353
  %15 = call i8* @"sol.math::calculate_bpb_bonus.anon.3"(i8* %14), !dbg !1354
  %16 = call i8* @sol.ifTrue.anon.(i8* %15), !dbg !1354
  %17 = call i8* @"sol.math::calculate_bpb_bonus.anon.4"(i8* %16), !dbg !1355
  %18 = call i8* @sol.ifFalse.anon.(i8* %17), !dbg !1355
  %19 = call i8* @sol.typecast(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_MAX_BONUS, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1356
  %20 = call i8* @sol.min.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %19), !dbg !1357
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @final_bonus, i64 0, i64 0), i8* %20), !dbg !1358
  %21 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @final_bonus, i64 0, i64 0)), !dbg !1359
  %22 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1360
  %23 = call i8* @sol.map_err.2(i8* %21, i8* %22), !dbg !1361
  %24 = call i8* @sol.Ok.1(i8* %23), !dbg !1362
  ret i8* %0, !dbg !1340
}

define i8* @"math::calculate_t_shares.3"(i8* %0, i8* %1, i8* %2) !dbg !1363 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1364
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1364
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1364
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"share_rate>0", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidParameter", i64 0, i64 0)), !dbg !1366
  %8 = call i8* @sol.calculate_lpb_bonus.1(i8* %1), !dbg !1367
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @lpb_bonus, i64 0, i64 0), i8* %8), !dbg !1368
  %9 = call i8* @sol.calculate_bpb_bonus.1(i8* %0), !dbg !1369
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpb_bonus, i64 0, i64 0), i8* %9), !dbg !1370
  %10 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @lpb_bonus, i64 0, i64 0)), !dbg !1371
  %11 = call i8* @sol.ok_or.2(i8* %10, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1372
  %12 = call i8* @sol.checked_add.2(i8* %11, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpb_bonus, i64 0, i64 0)), !dbg !1373
  %13 = call i8* @sol.ok_or.2(i8* %12, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1374
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0), i8* %13), !dbg !1375
  %14 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1376
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @amount_u128, i64 0, i64 0), i8* %14), !dbg !1377
  %15 = call i8* @sol.typecast(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1378
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @multiplier_u128, i64 0, i64 0), i8* %15), !dbg !1379
  %16 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1380
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @share_rate_u128, i64 0, i64 0), i8* %16), !dbg !1381
  %17 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @amount_u128, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @multiplier_u128, i64 0, i64 0)), !dbg !1382
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1383
  %19 = call i8* @sol.checked_div.2(i8* %18, i8* getelementptr inbounds ([15 x i8], [15 x i8]* @share_rate_u128, i64 0, i64 0)), !dbg !1384
  %20 = call i8* @sol.ok_or.2(i8* %19, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1385
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @t_shares_u128, i64 0, i64 0), i8* %20), !dbg !1386
  %21 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @t_shares_u128, i64 0, i64 0)), !dbg !1387
  %22 = call i8* @sol.map_err.2(i8* %21, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1388
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* %22), !dbg !1389
  %23 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !1390
  ret i8* %0, !dbg !1364
}

define i8* @"math::calculate_early_penalty.anon.1"(i8* %0) !dbg !1391 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1392
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1394
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1395
  ret i8* %0, !dbg !1392
}

define i8* @"math::calculate_early_penalty.anon.2"(i8* %0) !dbg !1396 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1397
  ret i8* %0, !dbg !1397
}

define i8* @"math::calculate_early_penalty.anon.3"(i8* %0) !dbg !1399 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1400
  ret i8* %0, !dbg !1400
}

define i8* @"math::calculate_early_penalty.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !1402 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1403
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1403
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1403
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1403
  %9 = call i8* @"sol.>="(i8* %2, i8* %3), !dbg !1405
  %10 = call i8* @sol.if(i8* %9), !dbg !1406
  %11 = call i8* @"sol.math::calculate_early_penalty.anon.1"(i8* %10), !dbg !1407
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !1407
  %13 = call i8* @sol.checked_sub.2(i8* %3, i8* %1), !dbg !1408
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1409
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_duration, i64 0, i64 0), i8* %14), !dbg !1410
  %15 = call i8* @sol.checked_sub.2(i8* %2, i8* %1), !dbg !1411
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1412
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %16), !dbg !1413
  %17 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1414
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1415
  %19 = call i8* @sol.checked_div.2(i8* %18, i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_duration, i64 0, i64 0)), !dbg !1416
  %20 = call i8* @sol.ok_or.2(i8* %19, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1417
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @served_fraction_bps, i64 0, i64 0), i8* %20), !dbg !1418
  %21 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @served_fraction_bps, i64 0, i64 0)), !dbg !1419
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1420
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* %22), !dbg !1421
  %23 = call i8* @"sol.<"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @MIN_PENALTY_BPS, i64 0, i64 0)), !dbg !1422
  %24 = call i8* @sol.if(i8* %23), !dbg !1423
  %25 = call i8* @"sol.math::calculate_early_penalty.anon.2"(i8* %24), !dbg !1424
  %26 = call i8* @sol.ifTrue.anon.(i8* %25), !dbg !1424
  %27 = call i8* @"sol.math::calculate_early_penalty.anon.3"(i8* %26), !dbg !1425
  %28 = call i8* @sol.ifFalse.anon.(i8* %27), !dbg !1425
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @final_penalty_bps, i64 0, i64 0), i8* %28), !dbg !1426
  %29 = call i8* @sol.mul_div_up.3(i8* %0, i8* getelementptr inbounds ([17 x i8], [17 x i8]* @final_penalty_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1427
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %29), !dbg !1428
  %30 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0)), !dbg !1429
  ret i8* %0, !dbg !1403
}

define i8* @"math::calculate_late_penalty.anon.1"(i8* %0) !dbg !1430 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1431
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1433
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1434
  ret i8* %0, !dbg !1431
}

define i8* @"math::calculate_late_penalty.anon.2"(i8* %0) !dbg !1435 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1436
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1438
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1439
  ret i8* %0, !dbg !1436
}

define i8* @"math::calculate_late_penalty.anon.3"(i8* %0) !dbg !1440 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1441
  ret i8* %0, !dbg !1441
}

define i8* @"math::calculate_late_penalty.anon.4"(i8* %0) !dbg !1443 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1444
  ret i8* %0, !dbg !1444
}

define i8* @"math::calculate_late_penalty.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !1446 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1447
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1447
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1447
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1447
  %9 = call i8* @"sol.<="(i8* %2, i8* %1), !dbg !1449
  %10 = call i8* @sol.if(i8* %9), !dbg !1450
  %11 = call i8* @"sol.math::calculate_late_penalty.anon.1"(i8* %10), !dbg !1451
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !1451
  %13 = call i8* @sol.checked_sub.2(i8* %2, i8* %1), !dbg !1452
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1453
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @slots_late, i64 0, i64 0), i8* %14), !dbg !1454
  %15 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @slots_late, i64 0, i64 0), i8* %3), !dbg !1455
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1456
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @late_days, i64 0, i64 0), i8* %16), !dbg !1457
  %17 = call i8* @"sol.<="(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @late_days, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @GRACE_PERIOD_DAYS, i64 0, i64 0)), !dbg !1458
  %18 = call i8* @sol.if(i8* %17), !dbg !1459
  %19 = call i8* @"sol.math::calculate_late_penalty.anon.2"(i8* %18), !dbg !1460
  %20 = call i8* @sol.ifTrue.anon.(i8* %19), !dbg !1460
  %21 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @late_days, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @GRACE_PERIOD_DAYS, i64 0, i64 0)), !dbg !1461
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1462
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @penalty_days, i64 0, i64 0), i8* %22), !dbg !1463
  %23 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @penalty_days, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @LATE_PENALTY_WINDOW_DAYS, i64 0, i64 0)), !dbg !1464
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* %23), !dbg !1465
  %24 = call i8* @"sol.>"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1466
  %25 = call i8* @sol.if(i8* %24), !dbg !1467
  %26 = call i8* @"sol.math::calculate_late_penalty.anon.3"(i8* %25), !dbg !1468
  %27 = call i8* @sol.ifTrue.anon.(i8* %26), !dbg !1468
  %28 = call i8* @"sol.math::calculate_late_penalty.anon.4"(i8* %27), !dbg !1469
  %29 = call i8* @sol.ifFalse.anon.(i8* %28), !dbg !1469
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @capped_bps, i64 0, i64 0), i8* %29), !dbg !1470
  %30 = call i8* @sol.mul_div_up.3(i8* %0, i8* getelementptr inbounds ([10 x i8], [10 x i8]* @capped_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1471
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %30), !dbg !1472
  %31 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0)), !dbg !1473
  ret i8* %0, !dbg !1447
}

define i8* @"math::calculate_pending_rewards.3"(i8* %0, i8* %1, i8* %2) !dbg !1474 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1475
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @current_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1475
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1475
  %7 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1477
  %8 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1478
  %9 = call i8* @sol.checked_mul.2(i8* %7, i8* %8), !dbg !1479
  %10 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1480
  %11 = call i8* @sol.ok_or.2(i8* %9, i8* %10), !dbg !1481
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @current_value, i64 0, i64 0), i8* %11), !dbg !1482
  %12 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1483
  %13 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @current_value, i64 0, i64 0), i8* %12), !dbg !1484
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @pending_128, i64 0, i64 0), i8* %13), !dbg !1485
  %14 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @pending_128, i64 0, i64 0)), !dbg !1486
  %15 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1487
  %16 = call i8* @sol.map_err.2(i8* %14, i8* %15), !dbg !1488
  ret i8* %0, !dbg !1475
}

define i8* @"math::calculate_reward_debt.2"(i8* %0, i8* %1) !dbg !1489 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1490
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1490
  %5 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1492
  %6 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1493
  %7 = call i8* @sol.checked_mul.2(i8* %5, i8* %6), !dbg !1494
  %8 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1495
  %9 = call i8* @sol.ok_or.2(i8* %7, i8* %8), !dbg !1496
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0), i8* %9), !dbg !1497
  %10 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0)), !dbg !1498
  %11 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"(HelixError::RewardDebtOverflow)", i64 0, i64 0)), !dbg !1499
  %12 = call i8* @sol.map_err.2(i8* %10, i8* %11), !dbg !1500
  ret i8* %0, !dbg !1490
}

define i8* @"math::get_current_day.3"(i8* %0, i8* %1, i8* %2) !dbg !1501 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @init_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1502
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1502
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1502
  %7 = call i8* @sol.checked_sub.2(i8* %1, i8* %0), !dbg !1504
  %8 = call i8* @sol.ok_or.2(i8* %7, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1505
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %8), !dbg !1506
  %9 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %2), !dbg !1507
  %10 = call i8* @sol.ok_or.2(i8* %9, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1508
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @day, i64 0, i64 0), i8* %10), !dbg !1509
  %11 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @day, i64 0, i64 0)), !dbg !1510
  ret i8* %0, !dbg !1502
}

define i8* @"math::calculate_loyalty_bonus.anon.1"(i8* %0) !dbg !1511 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1512
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1514
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1515
  ret i8* %0, !dbg !1512
}

define i8* @"math::calculate_loyalty_bonus.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !1516 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1517
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1517
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @committed_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1517
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1517
  %9 = call i8* @"sol.=="(i8* %2, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1519
  %10 = call i8* @"sol.=="(i8* %3, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1520
  %11 = call i8* @"sol.||"(i8* %9, i8* %10), !dbg !1519
  %12 = call i8* @sol.if(i8* %11), !dbg !1521
  %13 = call i8* @"sol.math::calculate_loyalty_bonus.anon.1"(i8* %12), !dbg !1522
  %14 = call i8* @sol.ifTrue.anon.(i8* %13), !dbg !1522
  %15 = call i8* @sol.saturating_sub.2(i8* %1, i8* %0), !dbg !1523
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @elapsed_slots, i64 0, i64 0), i8* %15), !dbg !1524
  %16 = call i8* @"sol./"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @elapsed_slots, i64 0, i64 0), i8* %3), !dbg !1525
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_served, i64 0, i64 0), i8* %16), !dbg !1526
  %17 = call i8* @sol.min.2(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_served, i64 0, i64 0), i8* %2), !dbg !1527
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @capped_days, i64 0, i64 0), i8* %17), !dbg !1528
  %18 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @capped_days, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @LOYALTY_MAX_BONUS, i64 0, i64 0), i8* %2), !dbg !1529
  ret i8* %0, !dbg !1517
}

define i8* @sol.model.struct.anchor.AdminSetSlotsPerDay(i8* %0) !dbg !1530 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1532
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !1534
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1535
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !1536
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1537
  ret i8* %0, !dbg !1532
}

define i8* @"admin_set_slots_per_day::admin_set_slots_per_day.2"(i8* %0, i8* %1) !dbg !1538 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Context<AdminSetSlotsPerDay>", i64 0, i64 0)), !dbg !1539
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @new_slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1539
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"new_slots_per_day>0", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidParameter", i64 0, i64 0)), !dbg !1541
  %6 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @DEFAULT_SLOTS_PER_DAY, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !1542
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1543
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @upper_bound, i64 0, i64 0), i8* %7), !dbg !1544
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"new_slots_per_day<=upper_bound", i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"HelixError::AdminBoundsExceeded", i64 0, i64 0)), !dbg !1545
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([39 x i8], [39 x i8]* @ctx.accounts.global_state.slots_per_day, i64 0, i64 0), i8* %1), !dbg !1546
  %9 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1547
  ret i8* %0, !dbg !1539
}

define i8* @sol.model.struct.anchor.MigrateStake(i8* %0) !dbg !1548 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1550
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1552
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @payer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1553
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([259 x i8], [259 x i8]* @"mut,seeds=[STAKE_SEED,stake_account.user.as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==payer.key()@HelixError::UnauthorizedStakeAccess,realloc=StakeAccount::LEN,realloc::payer=payer,realloc::zero=false,", i64 0, i64 0)), !dbg !1554
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !1555
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1556
  ret i8* %0, !dbg !1550
}

define i8* @"migrate_stake::migrate_stake.1"(i8* %0) !dbg !1557 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @_ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<MigrateStake>", i64 0, i64 0)), !dbg !1558
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1560
  ret i8* %0, !dbg !1558
}

define i8* @sol.model.struct.anchor.InitializeClaimPeriod(i8* %0) !dbg !1561 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1563
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([79 x i8], [79 x i8]* @"mut,constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !1565
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1566
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !1567
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1568
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"init,payer=authority,space=ClaimConfig::LEN,seeds=[CLAIM_CONFIG_SEED],bump,", i64 0, i64 0)), !dbg !1569
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !1570
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1571
  ret i8* %0, !dbg !1563
}

define i8* @"initialize_claim_period::initialize_claim_period.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4) !dbg !1572 {
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Context<InitializeClaimPeriod>", i64 0, i64 0)), !dbg !1573
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !1573
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1573
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_eligible, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1573
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1573
  %11 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"claim_period_id>0", i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"HelixError::InvalidClaimPeriodId", i64 0, i64 0)), !dbg !1575
  %12 = call i8* @"sol.Clock::get.0"(), !dbg !1576
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %12), !dbg !1577
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !1578
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1579
  %13 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @CLAIM_PERIOD_DAYS, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !1580
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1581
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %14), !dbg !1582
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1583
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* %16), !dbg !1584
  %17 = call i8* @sol.key.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.authority, i64 0, i64 0)), !dbg !1585
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @claim_config.authority, i64 0, i64 0), i8* %17), !dbg !1586
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.merkle_root, i64 0, i64 0), i8* %1), !dbg !1587
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.total_claimable, i64 0, i64 0), i8* %2), !dbg !1588
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1589
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.claim_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1590
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !1591
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !1592
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0), i8* %4), !dbg !1593
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.claim_period_started, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !1594
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !1595
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @claim_config.bpd_total_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1596
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @claim_config.total_eligible, i64 0, i64 0), i8* %3), !dbg !1597
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.claim_config, i64 0, i64 0)), !dbg !1598
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1599
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1600
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1601
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !1602
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1603
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1604
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1605
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([41 x i8], [41 x i8]* @claim_config.bpd_finalize_start_timestamp, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1606
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_original_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1607
  %18 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"ClaimPeriodStarted{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([120 x i8], [120 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id,merkle_root,total_claimable,total_eligible,claim_deadline_slot:end_slot,}", i64 0, i64 0)), !dbg !1608
  %19 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1609
  ret i8* %0, !dbg !1573
}

define i8* @sol.model.struct.anchor.AdminMint(i8* %0) !dbg !1610 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1612
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1614
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1615
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([129 x i8], [129 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized,", i64 0, i64 0)), !dbg !1616
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1617
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !1618
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !1619
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !1620
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !1621
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([92 x i8], [92 x i8]* @"mut,constraint=recipient_token_account.mint==global_state.mint@HelixError::InvalidParameter,", i64 0, i64 0)), !dbg !1622
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @recipient_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !1623
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !1624
  ret i8* %0, !dbg !1612
}

define i8* @"admin_mint::admin_mint.2"(i8* %0, i8* %1) !dbg !1625 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<AdminMint>", i64 0, i64 0)), !dbg !1626
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1626
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1628
  %5 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @global_state.total_admin_minted, i64 0, i64 0), i8* %1), !dbg !1629
  %6 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1630
  %7 = call i8* @sol.ok_or.2(i8* %5, i8* %6), !dbg !1631
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @new_total, i64 0, i64 0), i8* %7), !dbg !1632
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"new_total<=global_state.max_admin_mint", i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"HelixError::AdminMintCapExceeded", i64 0, i64 0)), !dbg !1633
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @global_state.total_admin_minted, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @new_total, i64 0, i64 0)), !dbg !1634
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @mint_authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([58 x i8], [58 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump],]", i64 0, i64 0)), !dbg !1635
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"[&mint_authority_seeds[..]]", i64 0, i64 0)), !dbg !1636
  %9 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !1637
  %10 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !1638
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %10), !dbg !1639
  %11 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @ctx.accounts.recipient_token_account, i64 0, i64 0)), !dbg !1640
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %11), !dbg !1641
  %12 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !1642
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %12), !dbg !1643
  %13 = call i8* @"sol.model.struct.new.token_2022::MintTo.3"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !1644
  %14 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %9, i8* %13, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !1645
  %15 = call i8* @"sol.token_2022::mint_to.2"(i8* %14, i8* %1), !dbg !1646
  %16 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"AdminMinted{slot:Clock::get()?.slot", i64 0, i64 0), i8* getelementptr inbounds ([100 x i8], [100 x i8]* @"authority:ctx.accounts.authority.key(),recipient:ctx.accounts.recipient_token_account.key(),amount,}", i64 0, i64 0)), !dbg !1647
  %17 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1648
  ret i8* %0, !dbg !1626
}

define i8* @"pda::validate_stake_pda.2"(i8* %0, i8* %1) !dbg !1649 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"&AccountInfo", i64 0, i64 0)), !dbg !1651
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"&StakeAccount", i64 0, i64 0)), !dbg !1651
  %5 = call i8* @"sol.crate::id.0"(), !dbg !1653
  %6 = call i8* @"sol.Pubkey::try_find_program_address.2"(i8* getelementptr inbounds ([63 x i8], [63 x i8]* @"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),]", i64 0, i64 0), i8* %5), !dbg !1654
  %7 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"(HelixError::InvalidPDA)", i64 0, i64 0)), !dbg !1655
  %8 = call i8* @sol.ok_or.2(i8* %6, i8* %7), !dbg !1656
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"(expected_pda,expected_bump)", i64 0, i64 0), i8* %8), !dbg !1657
  %9 = call i8* @"sol.require_keys_eq.!2"(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"account_info.key()", i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"expected_pda,HelixError::InvalidPDA", i64 0, i64 0)), !dbg !1658
  %10 = call i8* @"sol.require_eq.!2"(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake.bump, i64 0, i64 0), i8* getelementptr inbounds ([41 x i8], [41 x i8]* @"expected_bump,HelixError::InvalidBumpSeed", i64 0, i64 0)), !dbg !1659
  %11 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1660
  ret i8* %0, !dbg !1651
}

define i8* @"lib::initialize.2"(i8* %0, i8* %1) !dbg !1661 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"Context<Initialize>", i64 0, i64 0)), !dbg !1663
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @params, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @InitializeParams, i64 0, i64 0)), !dbg !1663
  %5 = call i8* @"sol.Clock::get.0"(), !dbg !1665
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %5), !dbg !1666
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1667
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"params.slots_per_day>0", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidParameter", i64 0, i64 0)), !dbg !1668
  %7 = call i8* @sol.key.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.authority, i64 0, i64 0)), !dbg !1669
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @global_state.authority, i64 0, i64 0), i8* %7), !dbg !1670
  %8 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !1671
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @global_state.mint, i64 0, i64 0), i8* %8), !dbg !1672
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.mint_authority_bump, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.bumps.mint_authority, i64 0, i64 0)), !dbg !1673
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @global_state.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.global_state, i64 0, i64 0)), !dbg !1674
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @params.annual_inflation_bp, i64 0, i64 0)), !dbg !1675
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @global_state.min_stake_amount, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @params.min_stake_amount, i64 0, i64 0)), !dbg !1676
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @params.starting_share_rate, i64 0, i64 0)), !dbg !1677
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.starting_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @params.starting_share_rate, i64 0, i64 0)), !dbg !1678
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @params.slots_per_day, i64 0, i64 0)), !dbg !1679
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @global_state.claim_period_days, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @params.claim_period_days, i64 0, i64 0)), !dbg !1680
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @global_state.init_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !1681
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1682
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @global_state.total_unstakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1683
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_claims_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1684
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1685
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @global_state.total_tokens_unstaked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1686
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1687
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @global_state.current_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1688
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @global_state.total_admin_minted, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1689
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @global_state.max_admin_mint, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @params.max_admin_mint, i64 0, i64 0)), !dbg !1690
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @global_state.reserved, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"[0;6]", i64 0, i64 0)), !dbg !1691
  %9 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"ProtocolInitialized{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([332 x i8], [332 x i8]* @"global_state:global_state.key(),mint:global_state.mint,mint_authority:ctx.accounts.mint_authority.key(),authority:global_state.authority,annual_inflation_bp:global_state.annual_inflation_bp,min_stake_amount:global_state.min_stake_amount,starting_share_rate:global_state.starting_share_rate,slots_per_day:global_state.slots_per_day,}", i64 0, i64 0)), !dbg !1692
  %10 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1693
  ret i8* %0, !dbg !1663
}

define i8* @"lib::create_stake.3"(i8* %0, i8* %1, i8* %2) !dbg !1694 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([45 x i8], [45 x i8]* @"Context<'_,'_,'info,'info,CreateStake<'info>>", i64 0, i64 0)), !dbg !1695
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1695
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !1695
  %7 = call i8* @"sol.instructions::create_stake::create_stake.3"(i8* %0, i8* %1, i8* %2), !dbg !1697
  ret i8* %0, !dbg !1695
}

define i8* @"lib::crank_distribution.1"(i8* %0) !dbg !1698 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<CrankDistribution>", i64 0, i64 0)), !dbg !1699
  %3 = call i8* @"sol.instructions::crank_distribution::crank_distribution.1"(i8* %0), !dbg !1701
  ret i8* %0, !dbg !1699
}

define i8* @"lib::unstake.1"(i8* %0) !dbg !1702 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"Context<Unstake>", i64 0, i64 0)), !dbg !1703
  %3 = call i8* @"sol.instructions::unstake::unstake.1"(i8* %0), !dbg !1705
  ret i8* %0, !dbg !1703
}

define i8* @"lib::claim_rewards.1"(i8* %0) !dbg !1706 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<ClaimRewards>", i64 0, i64 0)), !dbg !1707
  %3 = call i8* @"sol.instructions::claim_rewards::claim_rewards.1"(i8* %0), !dbg !1709
  ret i8* %0, !dbg !1707
}

define i8* @"lib::admin_mint.2"(i8* %0, i8* %1) !dbg !1710 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<AdminMint>", i64 0, i64 0)), !dbg !1711
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1711
  %5 = call i8* @"sol.instructions::admin_mint::admin_mint.2"(i8* %0, i8* %1), !dbg !1713
  ret i8* %0, !dbg !1711
}

define i8* @"lib::initialize_claim_period.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4) !dbg !1714 {
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Context<InitializeClaimPeriod>", i64 0, i64 0)), !dbg !1715
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !1715
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1715
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_eligible, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1715
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1715
  %11 = call i8* @"sol.instructions::initialize_claim_period::initialize_claim_period.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4), !dbg !1717
  ret i8* %0, !dbg !1715
}

define i8* @"lib::withdraw_vested.1"(i8* %0) !dbg !1718 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"Context<WithdrawVested>", i64 0, i64 0)), !dbg !1719
  %3 = call i8* @"sol.instructions::withdraw_vested::withdraw_vested.1"(i8* %0), !dbg !1721
  ret i8* %0, !dbg !1719
}

define i8* @"lib::trigger_big_pay_day.1"(i8* %0) !dbg !1722 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([50 x i8], [50 x i8]* @"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>", i64 0, i64 0)), !dbg !1723
  %3 = call i8* @"sol.instructions::trigger_big_pay_day::trigger_big_pay_day.1"(i8* %0), !dbg !1725
  ret i8* %0, !dbg !1723
}

define i8* @"lib::finalize_bpd_calculation.1"(i8* %0) !dbg !1726 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([56 x i8], [56 x i8]* @"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>", i64 0, i64 0)), !dbg !1727
  %3 = call i8* @"sol.instructions::finalize_bpd_calculation::finalize_bpd_calculation.1"(i8* %0), !dbg !1729
  ret i8* %0, !dbg !1727
}

define i8* @"lib::free_claim.3"(i8* %0, i8* %1, i8* %2) !dbg !1730 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<FreeClaim>", i64 0, i64 0)), !dbg !1731
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @snapshot_balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1731
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @proof, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"Vec<[u8;32]>", i64 0, i64 0)), !dbg !1731
  %7 = call i8* @"sol.instructions::free_claim::free_claim.3"(i8* %0, i8* %1, i8* %2), !dbg !1733
  ret i8* %0, !dbg !1731
}

define i8* @"lib::seal_bpd_finalize.2"(i8* %0, i8* %1) !dbg !1734 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<SealBpdFinalize>", i64 0, i64 0)), !dbg !1735
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @expected_finalized_count, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1735
  %5 = call i8* @"sol.instructions::seal_bpd_finalize::seal_bpd_finalize.2"(i8* %0, i8* %1), !dbg !1737
  ret i8* %0, !dbg !1735
}

define i8* @"lib::migrate_stake.1"(i8* %0) !dbg !1738 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<MigrateStake>", i64 0, i64 0)), !dbg !1739
  %3 = call i8* @"sol.instructions::migrate_stake::migrate_stake.1"(i8* %0), !dbg !1741
  ret i8* %0, !dbg !1739
}

define i8* @"lib::abort_bpd.1"(i8* %0) !dbg !1742 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"Context<AbortBpd>", i64 0, i64 0)), !dbg !1743
  %3 = call i8* @"sol.instructions::abort_bpd::abort_bpd.1"(i8* %0), !dbg !1745
  ret i8* %0, !dbg !1743
}

define i8* @"lib::admin_set_claim_end_slot.2"(i8* %0, i8* %1) !dbg !1746 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"Context<AdminSetClaimEndSlot>", i64 0, i64 0)), !dbg !1747
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @new_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1747
  %5 = call i8* @"sol.instructions::admin_set_claim_end_slot::admin_set_claim_end_slot.2"(i8* %0, i8* %1), !dbg !1749
  ret i8* %0, !dbg !1747
}

define i8* @"lib::admin_set_slots_per_day.2"(i8* %0, i8* %1) !dbg !1750 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Context<AdminSetSlotsPerDay>", i64 0, i64 0)), !dbg !1751
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @new_slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1751
  %5 = call i8* @"sol.instructions::admin_set_slots_per_day::admin_set_slots_per_day.2"(i8* %0, i8* %1), !dbg !1753
  ret i8* %0, !dbg !1751
}

define i8* @"lib::transfer_authority.2"(i8* %0, i8* %1) !dbg !1754 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<TransferAuthority>", i64 0, i64 0)), !dbg !1755
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1755
  %5 = call i8* @"sol.instructions::transfer_authority::transfer_authority.2"(i8* %0, i8* %1), !dbg !1757
  ret i8* %0, !dbg !1755
}

define i8* @"lib::accept_authority.1"(i8* %0) !dbg !1758 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<AcceptAuthority>", i64 0, i64 0)), !dbg !1759
  %3 = call i8* @"sol.instructions::accept_authority::accept_authority.1"(i8* %0), !dbg !1761
  ret i8* %0, !dbg !1759
}

define i8* @sol.model.anchor.program.helix_staking(i8* %0) !dbg !1762 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1763
  %3 = call i8* @sol.initialize.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"ctx:Context<Initialize>", i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"params:InitializeParams", i64 0, i64 0)), !dbg !1765
  %4 = call i8* @sol.create_stake.3(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"ctx:Context<'_,'_,'info,'info,CreateStake<'info>>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"amount:u64", i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"days:u16", i64 0, i64 0)), !dbg !1766
  %5 = call i8* @sol.crank_distribution.1(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx:Context<CrankDistribution>", i64 0, i64 0)), !dbg !1767
  %6 = call i8* @sol.unstake.1(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"ctx:Context<Unstake>", i64 0, i64 0)), !dbg !1768
  %7 = call i8* @sol.claim_rewards.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"ctx:Context<ClaimRewards>", i64 0, i64 0)), !dbg !1769
  %8 = call i8* @sol.admin_mint.2(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"ctx:Context<AdminMint>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"amount:u64", i64 0, i64 0)), !dbg !1770
  %9 = call i8* @sol.initialize_claim_period.5(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"ctx:Context<InitializeClaimPeriod>", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"merkle_root:[u8;32]", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"total_claimable:u64", i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"total_eligible:u32", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"claim_period_id:u32", i64 0, i64 0)), !dbg !1771
  %10 = call i8* @sol.withdraw_vested.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"ctx:Context<WithdrawVested>", i64 0, i64 0)), !dbg !1772
  %11 = call i8* @sol.trigger_big_pay_day.1(i8* getelementptr inbounds ([54 x i8], [54 x i8]* @"ctx:Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>", i64 0, i64 0)), !dbg !1773
  %12 = call i8* @sol.finalize_bpd_calculation.1(i8* getelementptr inbounds ([60 x i8], [60 x i8]* @"ctx:Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>", i64 0, i64 0)), !dbg !1774
  %13 = call i8* @sol.free_claim.3(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"ctx:Context<FreeClaim>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"snapshot_balance:u64", i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"proof:Vec<[u8;32]>", i64 0, i64 0)), !dbg !1775
  %14 = call i8* @sol.seal_bpd_finalize.2(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"ctx:Context<SealBpdFinalize>", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"expected_finalized_count:u32", i64 0, i64 0)), !dbg !1776
  %15 = call i8* @sol.migrate_stake.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"ctx:Context<MigrateStake>", i64 0, i64 0)), !dbg !1777
  %16 = call i8* @sol.abort_bpd.1(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"ctx:Context<AbortBpd>", i64 0, i64 0)), !dbg !1778
  %17 = call i8* @sol.admin_set_claim_end_slot.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"ctx:Context<AdminSetClaimEndSlot>", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"new_end_slot:u64", i64 0, i64 0)), !dbg !1779
  %18 = call i8* @sol.admin_set_slots_per_day.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"ctx:Context<AdminSetSlotsPerDay>", i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"new_slots_per_day:u64", i64 0, i64 0)), !dbg !1780
  %19 = call i8* @sol.transfer_authority.2(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx:Context<TransferAuthority>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"new_authority:Pubkey", i64 0, i64 0)), !dbg !1781
  %20 = call i8* @sol.accept_authority.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"ctx:Context<AcceptAuthority>", i64 0, i64 0)), !dbg !1782
  ret i8* %0, !dbg !1763
}

define i8* @main(i8* %0) !dbg !1783 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1784
  %3 = call i8* @sol.model.anchor.program.helix_staking(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @program_id, i64 0, i64 0)), !dbg !1784
  ret i8* %0, !dbg !1784
}

define i8* @sol.model.struct.InitializeParams(i8* %0) !dbg !1786 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1787
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1789
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_stake_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1790
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @starting_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1791
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1792
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_period_days, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1793
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @max_admin_mint, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1794
  ret i8* %0, !dbg !1787
}

define i8* @sol.model.struct.anchor.Initialize(i8* %0) !dbg !1795 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1796
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1798
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1799
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"init,payer=authority,space=GlobalState::LEN,seeds=[GLOBAL_STATE_SEED],bump,", i64 0, i64 0)), !dbg !1800
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1801
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump,", i64 0, i64 0)), !dbg !1802
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !1803
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([139 x i8], [139 x i8]* @"init,payer=authority,seeds=[MINT_SEED],bump,mint::decimals=TOKEN_DECIMALS,mint::authority=mint_authority,mint::token_program=token_program,", i64 0, i64 0)), !dbg !1804
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !1805
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !1806
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1807
  ret i8* %0, !dbg !1796
}

define i8* @sol.model.struct.anchor.ClaimConfig(i8* %0) !dbg !1808 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1810
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1812
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !1813
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1814
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1815
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @claim_count, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1816
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1817
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1818
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1819
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @claim_period_started, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1820
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1821
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @bpd_total_distributed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1822
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_eligible, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1823
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1824
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1825
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1826
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1827
  %19 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1828
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1829
  %21 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1830
  %22 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1831
  %23 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @bpd_finalize_start_timestamp, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @i64, i64 0, i64 0)), !dbg !1832
  %24 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @bpd_original_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1833
  ret i8* %0, !dbg !1810
}

define i8* @sol.model.struct.anchor.StakeAccount(i8* %0) !dbg !1834 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1836
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1838
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @stake_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1839
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1840
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1841
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1842
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1843
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !1844
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1845
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @is_active, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1846
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1847
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1848
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bpd_eligible, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1849
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_period_start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1850
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1851
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1852
  ret i8* %0, !dbg !1836
}

define i8* @sol.model.struct.anchor.PendingAuthority(i8* %0) !dbg !1853 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1855
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1857
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1858
  ret i8* %0, !dbg !1855
}

define i8* @sol.model.struct.anchor.GlobalState(i8* %0) !dbg !1859 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1861
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1863
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1864
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @mint_authority_bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1865
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1866
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1867
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_stake_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1868
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1869
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @starting_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1870
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1871
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_period_days, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1872
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @init_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1873
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @total_stakes_created, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1874
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @total_unstakes_created, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1875
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @total_claims_created, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1876
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @total_tokens_staked, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1877
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @total_tokens_unstaked, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1878
  %19 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1879
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @current_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1880
  %21 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @total_admin_minted, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1881
  %22 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @max_admin_mint, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1882
  %23 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @reserved, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u64;6]", i64 0, i64 0)), !dbg !1883
  ret i8* %0, !dbg !1861
}

define i8* @"global_state::GlobalState::is_bpd_window_active.1"(i8* %0) !dbg !1884 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"&self", i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"&self", i64 0, i64 0)), !dbg !1885
  %3 = call i8* @"sol.!="(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @self.reserved, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1887
  ret i8* %0, !dbg !1885
}

define i8* @"global_state::GlobalState::set_bpd_window_active.anon.1"(i8* %0) !dbg !1888 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1889
  ret i8* %0, !dbg !1889
}

define i8* @"global_state::GlobalState::set_bpd_window_active.anon.2"(i8* %0) !dbg !1891 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1892
  ret i8* %0, !dbg !1892
}

define i8* @"global_state::GlobalState::set_bpd_window_active.2"(i8* %0, i8* %1) !dbg !1894 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"&mutself", i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"&mutself", i64 0, i64 0)), !dbg !1895
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @active, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1895
  %5 = call i8* @sol.if(i8* %1), !dbg !1897
  %6 = call i8* @"sol.global_state::GlobalState::set_bpd_window_active.anon.1"(i8* %5), !dbg !1898
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !1898
  %8 = call i8* @"sol.global_state::GlobalState::set_bpd_window_active.anon.2"(i8* %7), !dbg !1899
  %9 = call i8* @sol.ifFalse.anon.(i8* %8), !dbg !1899
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"self.reserved[0]", i64 0, i64 0), i8* %9), !dbg !1900
  ret i8* %0, !dbg !1895
}

define i8* @sol.model.struct.anchor.ClaimStatus(i8* %0) !dbg !1901 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1903
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @is_claimed, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1905
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1906
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1907
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !1908
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1909
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1910
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1911
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1912
  ret i8* %0, !dbg !1903
}

!llvm.dbg.cu = !{!0}
!llvm.module.flags = !{!2}

!0 = distinct !DICompileUnit(language: DW_LANG_C, file: !1, producer: "mlir", isOptimized: true, runtimeVersion: 0, emissionKind: FullDebug)
!1 = !DIFile(filename: "LLVMDialectModule", directory: "/")
!2 = !{i32 2, !"Debug Info Version", i32 3}
!3 = distinct !DISubprogram(name: "sol.model.cargo.toml", linkageName: "sol.model.cargo.toml", scope: null, file: !4, type: !5, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!4 = !DIFile(filename: "programs/helix-staking/Xargo.toml", directory: "/workspace")
!5 = !DISubroutineType(types: !6)
!6 = !{}
!7 = !DILocation(line: 0, scope: !8)
!8 = !DILexicalBlockFile(scope: !3, file: !9, discriminator: 0)
!9 = !DIFile(filename: "Cargo.toml", directory: "/workspace")
!10 = !DILocation(line: 0, scope: !11)
!11 = !DILexicalBlockFile(scope: !3, file: !4, discriminator: 0)
!12 = distinct !DISubprogram(name: "sol.model.declare_id.address", linkageName: "sol.model.declare_id.address", scope: null, file: !4, type: !5, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!13 = !DILocation(line: 0, scope: !14)
!14 = !DILexicalBlockFile(scope: !12, file: !15, discriminator: 0)
!15 = !DIFile(filename: "lib.rs", directory: "/workspace")
!16 = !DILocation(line: 0, scope: !17)
!17 = !DILexicalBlockFile(scope: !12, file: !4, discriminator: 0)
!18 = distinct !DISubprogram(name: "sol.model.struct.anchor.CrankDistribution", linkageName: "sol.model.struct.anchor.CrankDistribution", scope: null, file: !19, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!19 = !DIFile(filename: "programs/helix-staking/src/instructions/crank_distribution.rs", directory: "/workspace")
!20 = !DILocation(line: 11, column: 4, scope: !21)
!21 = !DILexicalBlockFile(scope: !18, file: !19, discriminator: 0)
!22 = !DILocation(line: 13, column: 8, scope: !21)
!23 = !DILocation(line: 15, column: 6, scope: !21)
!24 = !DILocation(line: 20, column: 8, scope: !21)
!25 = !DILocation(line: 22, column: 6, scope: !21)
!26 = !DILocation(line: 27, column: 8, scope: !21)
!27 = !DILocation(line: 30, column: 6, scope: !21)
!28 = !DILocation(line: 34, column: 8, scope: !21)
!29 = !DILocation(line: 36, column: 8, scope: !21)
!30 = distinct !DISubprogram(name: "crank_distribution::crank_distribution.anon.1", linkageName: "crank_distribution::crank_distribution.anon.1", scope: null, file: !19, line: 64, type: !5, scopeLine: 64, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!31 = !DILocation(line: 64, column: 38, scope: !32)
!32 = !DILexicalBlockFile(scope: !30, file: !19, discriminator: 0)
!33 = !DILocation(line: 65, column: 8, scope: !32)
!34 = !DILocation(line: 67, column: 8, scope: !32)
!35 = !DILocation(line: 76, column: 15, scope: !32)
!36 = !DILocation(line: 76, column: 8, scope: !32)
!37 = distinct !DISubprogram(name: "crank_distribution::crank_distribution.1", linkageName: "crank_distribution::crank_distribution.1", scope: null, file: !19, line: 39, type: !5, scopeLine: 39, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!38 = !DILocation(line: 39, column: 4, scope: !39)
!39 = !DILexicalBlockFile(scope: !37, file: !19, discriminator: 0)
!40 = !DILocation(line: 40, column: 4, scope: !39)
!41 = !DILocation(line: 43, column: 16, scope: !39)
!42 = !DILocation(line: 43, column: 4, scope: !39)
!43 = !DILocation(line: 46, column: 22, scope: !39)
!44 = !DILocation(line: 46, column: 4, scope: !39)
!45 = !DILocation(line: 53, column: 4, scope: !39)
!46 = !DILocation(line: 60, column: 9, scope: !39)
!47 = !DILocation(line: 61, column: 9, scope: !39)
!48 = !DILocation(line: 59, column: 4, scope: !39)
!49 = !DILocation(line: 64, column: 7, scope: !39)
!50 = !DILocation(line: 64, column: 4, scope: !39)
!51 = !DILocation(line: 64, column: 38, scope: !39)
!52 = !DILocation(line: 82, column: 4, scope: !39)
!53 = !DILocation(line: 88, column: 27, scope: !39)
!54 = !DILocation(line: 88, column: 4, scope: !39)
!55 = !DILocation(line: 94, column: 32, scope: !39)
!56 = !DILocation(line: 94, column: 4, scope: !39)
!57 = !DILocation(line: 98, column: 30, scope: !39)
!58 = !DILocation(line: 98, column: 4, scope: !39)
!59 = !DILocation(line: 101, column: 9, scope: !39)
!60 = !DILocation(line: 102, column: 9, scope: !39)
!61 = !DILocation(line: 100, column: 4, scope: !39)
!62 = !DILocation(line: 105, column: 4, scope: !39)
!63 = !DILocation(line: 108, column: 4, scope: !39)
!64 = !DILocation(line: 117, column: 4, scope: !39)
!65 = distinct !DISubprogram(name: "sol.model.struct.anchor.TriggerBigPayDay", linkageName: "sol.model.struct.anchor.TriggerBigPayDay", scope: null, file: !66, line: 14, type: !5, scopeLine: 14, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!66 = !DIFile(filename: "programs/helix-staking/src/instructions/trigger_big_pay_day.rs", directory: "/workspace")
!67 = !DILocation(line: 14, column: 4, scope: !68)
!68 = !DILexicalBlockFile(scope: !65, file: !66, discriminator: 0)
!69 = !DILocation(line: 16, column: 8, scope: !68)
!70 = !DILocation(line: 18, column: 6, scope: !68)
!71 = !DILocation(line: 23, column: 8, scope: !68)
!72 = !DILocation(line: 25, column: 6, scope: !68)
!73 = !DILocation(line: 33, column: 8, scope: !68)
!74 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.1", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.1", scope: null, file: !66, line: 75, type: !5, scopeLine: 75, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!75 = !DILocation(line: 75, column: 32, scope: !76)
!76 = !DILexicalBlockFile(scope: !74, file: !66, discriminator: 0)
!77 = !DILocation(line: 76, column: 8, scope: !76)
!78 = !DILocation(line: 77, column: 21, scope: !76)
!79 = !DILocation(line: 78, column: 8, scope: !76)
!80 = !DILocation(line: 86, column: 15, scope: !76)
!81 = !DILocation(line: 86, column: 8, scope: !76)
!82 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.3", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.3", scope: null, file: !66, line: 96, type: !5, scopeLine: 96, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!83 = !DILocation(line: 96, column: 35, scope: !84)
!84 = !DILexicalBlockFile(scope: !82, file: !66, discriminator: 0)
!85 = !DILocation(line: 97, column: 12, scope: !84)
!86 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.4", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.4", scope: null, file: !66, line: 101, type: !5, scopeLine: 101, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!87 = !DILocation(line: 101, column: 46, scope: !88)
!88 = !DILexicalBlockFile(scope: !86, file: !66, discriminator: 0)
!89 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.5", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.5", scope: null, file: !66, line: 107, type: !5, scopeLine: 107, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!90 = !DILocation(line: 107, column: 42, scope: !91)
!91 = !DILexicalBlockFile(scope: !89, file: !66, discriminator: 0)
!92 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.6", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.6", scope: null, file: !66, line: 123, type: !5, scopeLine: 123, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!93 = !DILocation(line: 123, column: 78, scope: !94)
!94 = !DILexicalBlockFile(scope: !92, file: !66, discriminator: 0)
!95 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.7", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.7", scope: null, file: !66, line: 129, type: !5, scopeLine: 129, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!96 = !DILocation(line: 129, column: 69, scope: !97)
!97 = !DILexicalBlockFile(scope: !95, file: !66, discriminator: 0)
!98 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.8", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.8", scope: null, file: !66, line: 134, type: !5, scopeLine: 134, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!99 = !DILocation(line: 134, column: 72, scope: !100)
!100 = !DILexicalBlockFile(scope: !98, file: !66, discriminator: 0)
!101 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.9", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.9", scope: null, file: !66, line: 142, type: !5, scopeLine: 142, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!102 = !DILocation(line: 142, column: 28, scope: !103)
!103 = !DILexicalBlockFile(scope: !101, file: !66, discriminator: 0)
!104 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.10", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.10", scope: null, file: !66, line: 146, type: !5, scopeLine: 146, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!105 = !DILocation(line: 146, column: 54, scope: !106)
!106 = !DILexicalBlockFile(scope: !104, file: !66, discriminator: 0)
!107 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.11", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.11", scope: null, file: !66, line: 150, type: !5, scopeLine: 150, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!108 = !DILocation(line: 150, column: 52, scope: !109)
!109 = !DILexicalBlockFile(scope: !107, file: !66, discriminator: 0)
!110 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.12", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.12", scope: null, file: !66, line: 161, type: !5, scopeLine: 161, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!111 = !DILocation(line: 161, column: 28, scope: !112)
!112 = !DILexicalBlockFile(scope: !110, file: !66, discriminator: 0)
!113 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.2", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.2", scope: null, file: !66, line: 95, type: !5, scopeLine: 95, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!114 = !DILocation(line: 95, column: 71, scope: !115)
!115 = !DILexicalBlockFile(scope: !113, file: !66, discriminator: 0)
!116 = !DILocation(line: 96, column: 11, scope: !115)
!117 = !DILocation(line: 96, column: 8, scope: !115)
!118 = !DILocation(line: 96, column: 35, scope: !115)
!119 = !DILocation(line: 101, column: 34, scope: !115)
!120 = !DILocation(line: 101, column: 11, scope: !115)
!121 = !DILocation(line: 101, column: 8, scope: !115)
!122 = !DILocation(line: 101, column: 46, scope: !115)
!123 = !DILocation(line: 106, column: 32, scope: !115)
!124 = !DILocation(line: 106, column: 8, scope: !115)
!125 = !DILocation(line: 107, column: 16, scope: !115)
!126 = !DILocation(line: 107, column: 11, scope: !115)
!127 = !DILocation(line: 107, column: 8, scope: !115)
!128 = !DILocation(line: 107, column: 42, scope: !115)
!129 = !DILocation(line: 112, column: 20, scope: !115)
!130 = !DILocation(line: 112, column: 8, scope: !115)
!131 = !DILocation(line: 116, column: 8, scope: !115)
!132 = !DILocation(line: 123, column: 11, scope: !115)
!133 = !DILocation(line: 123, column: 69, scope: !115)
!134 = !DILocation(line: 123, column: 8, scope: !115)
!135 = !DILocation(line: 123, column: 78, scope: !115)
!136 = !DILocation(line: 129, column: 11, scope: !115)
!137 = !DILocation(line: 129, column: 8, scope: !115)
!138 = !DILocation(line: 129, column: 69, scope: !115)
!139 = !DILocation(line: 134, column: 11, scope: !115)
!140 = !DILocation(line: 134, column: 8, scope: !115)
!141 = !DILocation(line: 134, column: 72, scope: !115)
!142 = !DILocation(line: 142, column: 11, scope: !115)
!143 = !DILocation(line: 142, column: 8, scope: !115)
!144 = !DILocation(line: 142, column: 28, scope: !115)
!145 = !DILocation(line: 146, column: 11, scope: !115)
!146 = !DILocation(line: 146, column: 8, scope: !115)
!147 = !DILocation(line: 146, column: 54, scope: !115)
!148 = !DILocation(line: 150, column: 11, scope: !115)
!149 = !DILocation(line: 150, column: 8, scope: !115)
!150 = !DILocation(line: 150, column: 52, scope: !115)
!151 = !DILocation(line: 155, column: 24, scope: !115)
!152 = !DILocation(line: 155, column: 8, scope: !115)
!153 = !DILocation(line: 158, column: 13, scope: !115)
!154 = !DILocation(line: 157, column: 26, scope: !115)
!155 = !DILocation(line: 157, column: 8, scope: !115)
!156 = !DILocation(line: 161, column: 11, scope: !115)
!157 = !DILocation(line: 161, column: 8, scope: !115)
!158 = !DILocation(line: 161, column: 28, scope: !115)
!159 = !DILocation(line: 166, column: 26, scope: !115)
!160 = !DILocation(line: 167, column: 25, scope: !115)
!161 = !DILocation(line: 167, column: 13, scope: !115)
!162 = !DILocation(line: 168, column: 13, scope: !115)
!163 = !DILocation(line: 166, column: 8, scope: !115)
!164 = !DILocation(line: 170, column: 24, scope: !115)
!165 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.13", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.13", scope: null, file: !66, line: 175, type: !5, scopeLine: 175, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!166 = !DILocation(line: 175, column: 34, scope: !167)
!167 = !DILexicalBlockFile(scope: !165, file: !66, discriminator: 0)
!168 = !DILocation(line: 176, column: 15, scope: !167)
!169 = !DILocation(line: 176, column: 8, scope: !167)
!170 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.15", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.15", scope: null, file: !66, line: 200, type: !5, scopeLine: 200, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!171 = !DILocation(line: 200, column: 22, scope: !172)
!172 = !DILexicalBlockFile(scope: !170, file: !66, discriminator: 0)
!173 = !DILocation(line: 202, column: 17, scope: !172)
!174 = !DILocation(line: 203, column: 17, scope: !172)
!175 = !DILocation(line: 201, column: 12, scope: !172)
!176 = !DILocation(line: 206, column: 35, scope: !172)
!177 = !DILocation(line: 205, column: 42, scope: !172)
!178 = !DILocation(line: 205, column: 12, scope: !172)
!179 = !DILocation(line: 208, column: 12, scope: !172)
!180 = !DILocation(line: 209, column: 55, scope: !172)
!181 = !DILocation(line: 209, column: 18, scope: !172)
!182 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.14", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.14", scope: null, file: !66, line: 183, type: !5, scopeLine: 183, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!183 = !DILocation(line: 183, column: 52, scope: !184)
!184 = !DILexicalBlockFile(scope: !182, file: !66, discriminator: 0)
!185 = !DILocation(line: 184, column: 8, scope: !184)
!186 = !DILocation(line: 189, column: 13, scope: !184)
!187 = !DILocation(line: 190, column: 13, scope: !184)
!188 = !DILocation(line: 191, column: 25, scope: !184)
!189 = !DILocation(line: 191, column: 13, scope: !184)
!190 = !DILocation(line: 192, column: 13, scope: !184)
!191 = !DILocation(line: 188, column: 8, scope: !184)
!192 = !DILocation(line: 195, column: 24, scope: !184)
!193 = !DILocation(line: 195, column: 62, scope: !184)
!194 = !DILocation(line: 195, column: 50, scope: !184)
!195 = !DILocation(line: 195, column: 8, scope: !184)
!196 = !DILocation(line: 198, column: 30, scope: !184)
!197 = !DILocation(line: 198, column: 8, scope: !184)
!198 = !DILocation(line: 200, column: 11, scope: !184)
!199 = !DILocation(line: 200, column: 8, scope: !184)
!200 = !DILocation(line: 200, column: 22, scope: !184)
!201 = !DILocation(line: 215, column: 31, scope: !184)
!202 = !DILocation(line: 214, column: 38, scope: !184)
!203 = !DILocation(line: 214, column: 8, scope: !184)
!204 = !DILocation(line: 218, column: 13, scope: !184)
!205 = !DILocation(line: 219, column: 13, scope: !184)
!206 = !DILocation(line: 217, column: 8, scope: !184)
!207 = !DILocation(line: 223, column: 8, scope: !184)
!208 = !DILocation(line: 225, column: 51, scope: !184)
!209 = !DILocation(line: 225, column: 14, scope: !184)
!210 = !DILocation(line: 228, column: 13, scope: !184)
!211 = !DILocation(line: 229, column: 13, scope: !184)
!212 = !DILocation(line: 227, column: 8, scope: !184)
!213 = !DILocation(line: 232, column: 13, scope: !184)
!214 = !DILocation(line: 233, column: 13, scope: !184)
!215 = !DILocation(line: 231, column: 8, scope: !184)
!216 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.16", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.16", scope: null, file: !66, line: 252, type: !5, scopeLine: 252, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!217 = !DILocation(line: 252, column: 80, scope: !218)
!218 = !DILexicalBlockFile(scope: !216, file: !66, discriminator: 0)
!219 = !DILocation(line: 253, column: 8, scope: !218)
!220 = !DILocation(line: 254, column: 8, scope: !218)
!221 = !DILocation(line: 255, column: 21, scope: !218)
!222 = !DILocation(line: 257, column: 8, scope: !218)
!223 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.1", linkageName: "trigger_big_pay_day::trigger_big_pay_day.1", scope: null, file: !66, line: 39, type: !5, scopeLine: 39, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!224 = !DILocation(line: 39, column: 4, scope: !225)
!225 = !DILexicalBlockFile(scope: !223, file: !66, discriminator: 0)
!226 = !DILocation(line: 42, column: 16, scope: !225)
!227 = !DILocation(line: 42, column: 4, scope: !225)
!228 = !DILocation(line: 43, column: 4, scope: !225)
!229 = !DILocation(line: 44, column: 4, scope: !225)
!230 = !DILocation(line: 49, column: 4, scope: !225)
!231 = !DILocation(line: 55, column: 4, scope: !225)
!232 = !DILocation(line: 62, column: 4, scope: !225)
!233 = !DILocation(line: 63, column: 4, scope: !225)
!234 = !DILocation(line: 68, column: 30, scope: !225)
!235 = !DILocation(line: 68, column: 4, scope: !225)
!236 = !DILocation(line: 75, column: 7, scope: !225)
!237 = !DILocation(line: 75, column: 4, scope: !225)
!238 = !DILocation(line: 75, column: 32, scope: !225)
!239 = !DILocation(line: 93, column: 50, scope: !225)
!240 = !DILocation(line: 93, column: 4, scope: !225)
!241 = !DILocation(line: 95, column: 4, scope: !225)
!242 = !DILocation(line: 175, column: 23, scope: !225)
!243 = !DILocation(line: 175, column: 4, scope: !225)
!244 = !DILocation(line: 175, column: 34, scope: !225)
!245 = !DILocation(line: 180, column: 4, scope: !225)
!246 = !DILocation(line: 181, column: 4, scope: !225)
!247 = !DILocation(line: 183, column: 4, scope: !225)
!248 = !DILocation(line: 238, column: 9, scope: !225)
!249 = !DILocation(line: 239, column: 9, scope: !225)
!250 = !DILocation(line: 237, column: 4, scope: !225)
!251 = !DILocation(line: 242, column: 9, scope: !225)
!252 = !DILocation(line: 243, column: 9, scope: !225)
!253 = !DILocation(line: 241, column: 4, scope: !225)
!254 = !DILocation(line: 247, column: 9, scope: !225)
!255 = !DILocation(line: 248, column: 9, scope: !225)
!256 = !DILocation(line: 246, column: 4, scope: !225)
!257 = !DILocation(line: 252, column: 7, scope: !225)
!258 = !DILocation(line: 252, column: 4, scope: !225)
!259 = !DILocation(line: 252, column: 80, scope: !225)
!260 = !DILocation(line: 268, column: 4, scope: !225)
!261 = !DILocation(line: 278, column: 4, scope: !225)
!262 = distinct !DISubprogram(name: "sol.model.struct.anchor.WithdrawVested", linkageName: "sol.model.struct.anchor.WithdrawVested", scope: null, file: !263, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!263 = !DIFile(filename: "programs/helix-staking/src/instructions/withdraw_vested.rs", directory: "/workspace")
!264 = !DILocation(line: 12, column: 4, scope: !265)
!265 = !DILexicalBlockFile(scope: !262, file: !263, discriminator: 0)
!266 = !DILocation(line: 13, column: 6, scope: !265)
!267 = !DILocation(line: 14, column: 8, scope: !265)
!268 = !DILocation(line: 16, column: 6, scope: !265)
!269 = !DILocation(line: 20, column: 8, scope: !265)
!270 = !DILocation(line: 22, column: 6, scope: !265)
!271 = !DILocation(line: 26, column: 8, scope: !265)
!272 = !DILocation(line: 28, column: 6, scope: !265)
!273 = !DILocation(line: 39, column: 8, scope: !265)
!274 = !DILocation(line: 41, column: 6, scope: !265)
!275 = !DILocation(line: 47, column: 8, scope: !265)
!276 = !DILocation(line: 49, column: 6, scope: !265)
!277 = !DILocation(line: 54, column: 8, scope: !265)
!278 = !DILocation(line: 57, column: 6, scope: !265)
!279 = !DILocation(line: 61, column: 8, scope: !265)
!280 = !DILocation(line: 63, column: 8, scope: !265)
!281 = distinct !DISubprogram(name: "withdraw_vested::withdraw_vested.1", linkageName: "withdraw_vested::withdraw_vested.1", scope: null, file: !263, line: 66, type: !5, scopeLine: 66, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!282 = !DILocation(line: 66, column: 4, scope: !283)
!283 = !DILexicalBlockFile(scope: !281, file: !263, discriminator: 0)
!284 = !DILocation(line: 67, column: 16, scope: !283)
!285 = !DILocation(line: 67, column: 4, scope: !283)
!286 = !DILocation(line: 68, column: 4, scope: !283)
!287 = !DILocation(line: 69, column: 4, scope: !283)
!288 = !DILocation(line: 72, column: 23, scope: !283)
!289 = !DILocation(line: 72, column: 4, scope: !283)
!290 = !DILocation(line: 81, column: 9, scope: !283)
!291 = !DILocation(line: 82, column: 9, scope: !283)
!292 = !DILocation(line: 80, column: 4, scope: !283)
!293 = !DILocation(line: 84, column: 4, scope: !283)
!294 = !DILocation(line: 88, column: 9, scope: !283)
!295 = !DILocation(line: 89, column: 9, scope: !283)
!296 = !DILocation(line: 87, column: 4, scope: !283)
!297 = !DILocation(line: 90, column: 4, scope: !283)
!298 = !DILocation(line: 93, column: 4, scope: !283)
!299 = !DILocation(line: 94, column: 4, scope: !283)
!300 = !DILocation(line: 98, column: 39, scope: !283)
!301 = !DILocation(line: 100, column: 40, scope: !283)
!302 = !DILocation(line: 100, column: 16, scope: !283)
!303 = !DILocation(line: 101, column: 55, scope: !283)
!304 = !DILocation(line: 101, column: 16, scope: !283)
!305 = !DILocation(line: 102, column: 55, scope: !283)
!306 = !DILocation(line: 102, column: 16, scope: !283)
!307 = !DILocation(line: 99, column: 12, scope: !283)
!308 = !DILocation(line: 97, column: 8, scope: !283)
!309 = !DILocation(line: 96, column: 4, scope: !283)
!310 = !DILocation(line: 110, column: 4, scope: !283)
!311 = !DILocation(line: 120, column: 4, scope: !283)
!312 = distinct !DISubprogram(name: "withdraw_vested::calculate_vested_amount.anon.1", linkageName: "withdraw_vested::calculate_vested_amount.anon.1", scope: null, file: !263, line: 136, type: !5, scopeLine: 136, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!313 = !DILocation(line: 136, column: 40, scope: !314)
!314 = !DILexicalBlockFile(scope: !312, file: !263, discriminator: 0)
!315 = !DILocation(line: 137, column: 15, scope: !314)
!316 = !DILocation(line: 137, column: 8, scope: !314)
!317 = distinct !DISubprogram(name: "withdraw_vested::calculate_vested_amount.anon.2", linkageName: "withdraw_vested::calculate_vested_amount.anon.2", scope: null, file: !263, line: 141, type: !5, scopeLine: 141, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!318 = !DILocation(line: 141, column: 36, scope: !319)
!319 = !DILexicalBlockFile(scope: !317, file: !263, discriminator: 0)
!320 = !DILocation(line: 142, column: 15, scope: !319)
!321 = !DILocation(line: 142, column: 8, scope: !319)
!322 = distinct !DISubprogram(name: "withdraw_vested::calculate_vested_amount.4", linkageName: "withdraw_vested::calculate_vested_amount.4", scope: null, file: !263, line: 126, type: !5, scopeLine: 126, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!323 = !DILocation(line: 126, scope: !324)
!324 = !DILexicalBlockFile(scope: !322, file: !263, discriminator: 0)
!325 = !DILocation(line: 133, column: 20, scope: !324)
!326 = !DILocation(line: 133, column: 4, scope: !324)
!327 = !DILocation(line: 136, column: 7, scope: !324)
!328 = !DILocation(line: 136, column: 4, scope: !324)
!329 = !DILocation(line: 136, column: 40, scope: !324)
!330 = !DILocation(line: 141, column: 7, scope: !324)
!331 = !DILocation(line: 141, column: 4, scope: !324)
!332 = !DILocation(line: 141, column: 36, scope: !324)
!333 = !DILocation(line: 147, column: 9, scope: !324)
!334 = !DILocation(line: 148, column: 9, scope: !324)
!335 = !DILocation(line: 146, column: 4, scope: !324)
!336 = !DILocation(line: 151, column: 9, scope: !324)
!337 = !DILocation(line: 152, column: 9, scope: !324)
!338 = !DILocation(line: 150, column: 4, scope: !324)
!339 = !DILocation(line: 156, column: 9, scope: !324)
!340 = !DILocation(line: 157, column: 9, scope: !324)
!341 = !DILocation(line: 155, column: 4, scope: !324)
!342 = !DILocation(line: 160, column: 27, scope: !324)
!343 = !DILocation(line: 160, column: 4, scope: !324)
!344 = !DILocation(line: 164, column: 9, scope: !324)
!345 = !DILocation(line: 165, column: 36, scope: !324)
!346 = !DILocation(line: 165, column: 9, scope: !324)
!347 = distinct !DISubprogram(name: "sol.model.struct.anchor.FinalizeBpdCalculation", linkageName: "sol.model.struct.anchor.FinalizeBpdCalculation", scope: null, file: !348, line: 13, type: !5, scopeLine: 13, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!348 = !DIFile(filename: "programs/helix-staking/src/instructions/finalize_bpd_calculation.rs", directory: "/workspace")
!349 = !DILocation(line: 13, column: 4, scope: !350)
!350 = !DILexicalBlockFile(scope: !347, file: !348, discriminator: 0)
!351 = !DILocation(line: 15, column: 6, scope: !350)
!352 = !DILocation(line: 18, column: 8, scope: !350)
!353 = !DILocation(line: 20, column: 6, scope: !350)
!354 = !DILocation(line: 25, column: 8, scope: !350)
!355 = !DILocation(line: 27, column: 6, scope: !350)
!356 = !DILocation(line: 35, column: 8, scope: !350)
!357 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.1", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.1", scope: null, file: !348, line: 70, type: !5, scopeLine: 70, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!358 = !DILocation(line: 70, column: 45, scope: !359)
!359 = !DILexicalBlockFile(scope: !357, file: !348, discriminator: 0)
!360 = !DILocation(line: 74, column: 13, scope: !359)
!361 = !DILocation(line: 73, column: 8, scope: !359)
!362 = !DILocation(line: 77, column: 8, scope: !359)
!363 = !DILocation(line: 80, column: 8, scope: !359)
!364 = !DILocation(line: 83, column: 8, scope: !359)
!365 = !DILocation(line: 86, column: 21, scope: !359)
!366 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.2", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.2", scope: null, file: !348, line: 89, type: !5, scopeLine: 89, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!367 = !DILocation(line: 89, column: 11, scope: !368)
!368 = !DILexicalBlockFile(scope: !366, file: !348, discriminator: 0)
!369 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.3", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.3", scope: null, file: !348, line: 94, type: !5, scopeLine: 94, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!370 = !DILocation(line: 94, column: 29, scope: !371)
!371 = !DILexicalBlockFile(scope: !369, file: !348, discriminator: 0)
!372 = !DILocation(line: 95, column: 8, scope: !371)
!373 = !DILocation(line: 96, column: 8, scope: !371)
!374 = !DILocation(line: 97, column: 21, scope: !371)
!375 = !DILocation(line: 98, column: 15, scope: !371)
!376 = !DILocation(line: 98, column: 8, scope: !371)
!377 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.5", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.5", scope: null, file: !348, line: 108, type: !5, scopeLine: 108, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!378 = !DILocation(line: 108, column: 40, scope: !379)
!379 = !DILexicalBlockFile(scope: !377, file: !348, discriminator: 0)
!380 = !DILocation(line: 109, column: 12, scope: !379)
!381 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.6", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.6", scope: null, file: !348, line: 113, type: !5, scopeLine: 113, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!382 = !DILocation(line: 113, column: 46, scope: !383)
!383 = !DILexicalBlockFile(scope: !381, file: !348, discriminator: 0)
!384 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.7", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.7", scope: null, file: !348, line: 119, type: !5, scopeLine: 119, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!385 = !DILocation(line: 119, column: 42, scope: !386)
!386 = !DILexicalBlockFile(scope: !384, file: !348, discriminator: 0)
!387 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.8", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.8", scope: null, file: !348, line: 134, type: !5, scopeLine: 134, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!388 = !DILocation(line: 134, column: 72, scope: !389)
!389 = !DILexicalBlockFile(scope: !387, file: !348, discriminator: 0)
!390 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.9", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.9", scope: null, file: !348, line: 143, type: !5, scopeLine: 143, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!391 = !DILocation(line: 143, column: 78, scope: !392)
!392 = !DILexicalBlockFile(scope: !390, file: !348, discriminator: 0)
!393 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.10", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.10", scope: null, file: !348, line: 148, type: !5, scopeLine: 148, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!394 = !DILocation(line: 148, column: 28, scope: !395)
!395 = !DILexicalBlockFile(scope: !393, file: !348, discriminator: 0)
!396 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.11", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.11", scope: null, file: !348, line: 152, type: !5, scopeLine: 152, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!397 = !DILocation(line: 152, column: 54, scope: !398)
!398 = !DILexicalBlockFile(scope: !396, file: !348, discriminator: 0)
!399 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.12", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.12", scope: null, file: !348, line: 156, type: !5, scopeLine: 156, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!400 = !DILocation(line: 156, column: 52, scope: !401)
!401 = !DILexicalBlockFile(scope: !399, file: !348, discriminator: 0)
!402 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.13", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.13", scope: null, file: !348, line: 167, type: !5, scopeLine: 167, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!403 = !DILocation(line: 167, column: 28, scope: !404)
!404 = !DILexicalBlockFile(scope: !402, file: !348, discriminator: 0)
!405 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.4", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.4", scope: null, file: !348, line: 107, type: !5, scopeLine: 107, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!406 = !DILocation(line: 107, column: 71, scope: !407)
!407 = !DILexicalBlockFile(scope: !405, file: !348, discriminator: 0)
!408 = !DILocation(line: 108, column: 11, scope: !407)
!409 = !DILocation(line: 108, column: 8, scope: !407)
!410 = !DILocation(line: 108, column: 40, scope: !407)
!411 = !DILocation(line: 113, column: 34, scope: !407)
!412 = !DILocation(line: 113, column: 11, scope: !407)
!413 = !DILocation(line: 113, column: 8, scope: !407)
!414 = !DILocation(line: 113, column: 46, scope: !407)
!415 = !DILocation(line: 118, column: 32, scope: !407)
!416 = !DILocation(line: 118, column: 8, scope: !407)
!417 = !DILocation(line: 119, column: 16, scope: !407)
!418 = !DILocation(line: 119, column: 11, scope: !407)
!419 = !DILocation(line: 119, column: 8, scope: !407)
!420 = !DILocation(line: 119, column: 42, scope: !407)
!421 = !DILocation(line: 124, column: 24, scope: !407)
!422 = !DILocation(line: 124, column: 8, scope: !407)
!423 = !DILocation(line: 128, column: 8, scope: !407)
!424 = !DILocation(line: 134, column: 11, scope: !407)
!425 = !DILocation(line: 134, column: 8, scope: !407)
!426 = !DILocation(line: 134, column: 72, scope: !407)
!427 = !DILocation(line: 143, column: 11, scope: !407)
!428 = !DILocation(line: 143, column: 69, scope: !407)
!429 = !DILocation(line: 143, column: 8, scope: !407)
!430 = !DILocation(line: 143, column: 78, scope: !407)
!431 = !DILocation(line: 148, column: 11, scope: !407)
!432 = !DILocation(line: 148, column: 8, scope: !407)
!433 = !DILocation(line: 148, column: 28, scope: !407)
!434 = !DILocation(line: 152, column: 11, scope: !407)
!435 = !DILocation(line: 152, column: 8, scope: !407)
!436 = !DILocation(line: 152, column: 54, scope: !407)
!437 = !DILocation(line: 156, column: 11, scope: !407)
!438 = !DILocation(line: 156, column: 8, scope: !407)
!439 = !DILocation(line: 156, column: 52, scope: !407)
!440 = !DILocation(line: 161, column: 24, scope: !407)
!441 = !DILocation(line: 161, column: 8, scope: !407)
!442 = !DILocation(line: 164, column: 13, scope: !407)
!443 = !DILocation(line: 163, column: 26, scope: !407)
!444 = !DILocation(line: 163, column: 8, scope: !407)
!445 = !DILocation(line: 167, column: 11, scope: !407)
!446 = !DILocation(line: 167, column: 8, scope: !407)
!447 = !DILocation(line: 167, column: 28, scope: !407)
!448 = !DILocation(line: 172, column: 26, scope: !407)
!449 = !DILocation(line: 173, column: 25, scope: !407)
!450 = !DILocation(line: 173, column: 13, scope: !407)
!451 = !DILocation(line: 174, column: 13, scope: !407)
!452 = !DILocation(line: 172, column: 8, scope: !407)
!453 = !DILocation(line: 177, column: 13, scope: !407)
!454 = !DILocation(line: 178, column: 13, scope: !407)
!455 = !DILocation(line: 176, column: 8, scope: !407)
!456 = !DILocation(line: 181, column: 8, scope: !407)
!457 = !DILocation(line: 184, column: 51, scope: !407)
!458 = !DILocation(line: 184, column: 14, scope: !407)
!459 = !DILocation(line: 188, column: 13, scope: !407)
!460 = !DILocation(line: 189, column: 13, scope: !407)
!461 = !DILocation(line: 187, column: 8, scope: !407)
!462 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.1", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.1", scope: null, file: !348, line: 40, type: !5, scopeLine: 40, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!463 = !DILocation(line: 40, column: 4, scope: !464)
!464 = !DILexicalBlockFile(scope: !462, file: !348, discriminator: 0)
!465 = !DILocation(line: 43, column: 16, scope: !464)
!466 = !DILocation(line: 43, column: 4, scope: !464)
!467 = !DILocation(line: 44, column: 4, scope: !464)
!468 = !DILocation(line: 45, column: 4, scope: !464)
!469 = !DILocation(line: 50, column: 4, scope: !464)
!470 = !DILocation(line: 56, column: 4, scope: !464)
!471 = !DILocation(line: 62, column: 25, scope: !464)
!472 = !DILocation(line: 63, column: 11, scope: !464)
!473 = !DILocation(line: 64, column: 11, scope: !464)
!474 = !DILocation(line: 62, column: 4, scope: !464)
!475 = !DILocation(line: 67, column: 4, scope: !464)
!476 = !DILocation(line: 70, column: 27, scope: !464)
!477 = !DILocation(line: 70, column: 45, scope: !464)
!478 = !DILocation(line: 89, column: 11, scope: !464)
!479 = !DILocation(line: 70, column: 4, scope: !464)
!480 = !DILocation(line: 94, column: 7, scope: !464)
!481 = !DILocation(line: 94, column: 4, scope: !464)
!482 = !DILocation(line: 94, column: 29, scope: !464)
!483 = !DILocation(line: 102, column: 4, scope: !464)
!484 = !DILocation(line: 105, column: 4, scope: !464)
!485 = !DILocation(line: 107, column: 4, scope: !464)
!486 = !DILocation(line: 194, column: 9, scope: !464)
!487 = !DILocation(line: 195, column: 9, scope: !464)
!488 = !DILocation(line: 193, column: 4, scope: !464)
!489 = !DILocation(line: 201, column: 9, scope: !464)
!490 = !DILocation(line: 202, column: 9, scope: !464)
!491 = !DILocation(line: 200, column: 4, scope: !464)
!492 = !DILocation(line: 203, column: 4, scope: !464)
!493 = !DILocation(line: 215, column: 4, scope: !464)
!494 = distinct !DISubprogram(name: "sol.model.struct.anchor.CreateStake", linkageName: "sol.model.struct.anchor.CreateStake", scope: null, file: !495, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!495 = !DIFile(filename: "programs/helix-staking/src/instructions/create_stake.rs", directory: "/workspace")
!496 = !DILocation(line: 12, column: 4, scope: !497)
!497 = !DILexicalBlockFile(scope: !494, file: !495, discriminator: 0)
!498 = !DILocation(line: 13, column: 6, scope: !497)
!499 = !DILocation(line: 14, column: 8, scope: !497)
!500 = !DILocation(line: 16, column: 6, scope: !497)
!501 = !DILocation(line: 21, column: 8, scope: !497)
!502 = !DILocation(line: 23, column: 6, scope: !497)
!503 = !DILocation(line: 34, column: 8, scope: !497)
!504 = !DILocation(line: 36, column: 6, scope: !497)
!505 = !DILocation(line: 42, column: 8, scope: !497)
!506 = !DILocation(line: 44, column: 6, scope: !497)
!507 = !DILocation(line: 49, column: 8, scope: !497)
!508 = !DILocation(line: 51, column: 8, scope: !497)
!509 = !DILocation(line: 52, column: 8, scope: !497)
!510 = distinct !DISubprogram(name: "create_stake::create_stake.anon.4", linkageName: "create_stake::create_stake.anon.4", scope: null, file: !495, line: 122, type: !5, scopeLine: 122, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!511 = !DILocation(line: 122, column: 92, scope: !512)
!512 = !DILexicalBlockFile(scope: !510, file: !495, discriminator: 0)
!513 = distinct !DISubprogram(name: "create_stake::create_stake.anon.5", linkageName: "create_stake::create_stake.anon.5", scope: null, file: !495, line: 124, type: !5, scopeLine: 124, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!514 = !DILocation(line: 124, column: 23, scope: !515)
!515 = !DILexicalBlockFile(scope: !513, file: !495, discriminator: 0)
!516 = distinct !DISubprogram(name: "create_stake::create_stake.anon.3", linkageName: "create_stake::create_stake.anon.3", scope: null, file: !495, line: 121, type: !5, scopeLine: 121, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!517 = !DILocation(line: 121, column: 90, scope: !518)
!518 = !DILexicalBlockFile(scope: !516, file: !495, discriminator: 0)
!519 = !DILocation(line: 122, column: 56, scope: !518)
!520 = !DILocation(line: 122, column: 19, scope: !518)
!521 = !DILocation(line: 122, column: 16, scope: !518)
!522 = !DILocation(line: 122, column: 92, scope: !518)
!523 = !DILocation(line: 124, column: 23, scope: !518)
!524 = distinct !DISubprogram(name: "create_stake::create_stake.anon.6", linkageName: "create_stake::create_stake.anon.6", scope: null, file: !495, line: 127, type: !5, scopeLine: 127, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!525 = !DILocation(line: 127, column: 19, scope: !526)
!526 = !DILexicalBlockFile(scope: !524, file: !495, discriminator: 0)
!527 = distinct !DISubprogram(name: "create_stake::create_stake.anon.2", linkageName: "create_stake::create_stake.anon.2", scope: null, file: !495, line: 119, type: !5, scopeLine: 119, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!528 = !DILocation(line: 119, column: 51, scope: !529)
!529 = !DILexicalBlockFile(scope: !527, file: !495, discriminator: 0)
!530 = !DILocation(line: 121, column: 38, scope: !529)
!531 = !DILocation(line: 121, column: 12, scope: !529)
!532 = !DILocation(line: 121, column: 90, scope: !529)
!533 = !DILocation(line: 127, column: 19, scope: !529)
!534 = distinct !DISubprogram(name: "create_stake::create_stake.anon.7", linkageName: "create_stake::create_stake.anon.7", scope: null, file: !495, line: 130, type: !5, scopeLine: 130, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!535 = !DILocation(line: 130, column: 15, scope: !536)
!536 = !DILexicalBlockFile(scope: !534, file: !495, discriminator: 0)
!537 = distinct !DISubprogram(name: "create_stake::create_stake.anon.1", linkageName: "create_stake::create_stake.anon.1", scope: null, file: !495, line: 110, type: !5, scopeLine: 110, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!538 = !DILocation(line: 110, column: 88, scope: !539)
!539 = !DILexicalBlockFile(scope: !537, file: !495, discriminator: 0)
!540 = !DILocation(line: 111, column: 8, scope: !539)
!541 = !DILocation(line: 114, column: 32, scope: !539)
!542 = !DILocation(line: 114, column: 8, scope: !539)
!543 = !DILocation(line: 119, column: 29, scope: !539)
!544 = !DILocation(line: 119, column: 11, scope: !539)
!545 = !DILocation(line: 119, column: 8, scope: !539)
!546 = !DILocation(line: 119, column: 51, scope: !539)
!547 = !DILocation(line: 130, column: 15, scope: !539)
!548 = distinct !DISubprogram(name: "create_stake::create_stake.anon.8", linkageName: "create_stake::create_stake.anon.8", scope: null, file: !495, line: 133, type: !5, scopeLine: 133, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!549 = !DILocation(line: 133, column: 11, scope: !550)
!550 = !DILexicalBlockFile(scope: !548, file: !495, discriminator: 0)
!551 = distinct !DISubprogram(name: "create_stake::create_stake.3", linkageName: "create_stake::create_stake.3", scope: null, file: !495, line: 55, type: !5, scopeLine: 55, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!552 = !DILocation(line: 55, column: 4, scope: !553)
!553 = !DILexicalBlockFile(scope: !551, file: !495, discriminator: 0)
!554 = !DILocation(line: 60, column: 4, scope: !553)
!555 = !DILocation(line: 61, column: 4, scope: !553)
!556 = !DILocation(line: 64, column: 4, scope: !553)
!557 = !DILocation(line: 70, column: 4, scope: !553)
!558 = !DILocation(line: 76, column: 16, scope: !553)
!559 = !DILocation(line: 76, column: 4, scope: !553)
!560 = !DILocation(line: 79, column: 46, scope: !553)
!561 = !DILocation(line: 79, column: 19, scope: !553)
!562 = !DILocation(line: 79, column: 4, scope: !553)
!563 = !DILocation(line: 84, column: 13, scope: !553)
!564 = !DILocation(line: 85, column: 17, scope: !553)
!565 = !DILocation(line: 86, column: 17, scope: !553)
!566 = !DILocation(line: 83, column: 9, scope: !553)
!567 = !DILocation(line: 88, column: 9, scope: !553)
!568 = !DILocation(line: 82, column: 4, scope: !553)
!569 = !DILocation(line: 92, column: 22, scope: !553)
!570 = !DILocation(line: 92, column: 4, scope: !553)
!571 = !DILocation(line: 95, column: 43, scope: !553)
!572 = !DILocation(line: 95, column: 4, scope: !553)
!573 = !DILocation(line: 96, column: 4, scope: !553)
!574 = !DILocation(line: 97, column: 4, scope: !553)
!575 = !DILocation(line: 98, column: 4, scope: !553)
!576 = !DILocation(line: 99, column: 4, scope: !553)
!577 = !DILocation(line: 100, column: 4, scope: !553)
!578 = !DILocation(line: 101, column: 4, scope: !553)
!579 = !DILocation(line: 102, column: 4, scope: !553)
!580 = !DILocation(line: 103, column: 4, scope: !553)
!581 = !DILocation(line: 104, column: 4, scope: !553)
!582 = !DILocation(line: 107, column: 4, scope: !553)
!583 = !DILocation(line: 110, column: 77, scope: !553)
!584 = !DILocation(line: 110, column: 53, scope: !553)
!585 = !DILocation(line: 110, column: 50, scope: !553)
!586 = !DILocation(line: 110, column: 88, scope: !553)
!587 = !DILocation(line: 133, column: 11, scope: !553)
!588 = !DILocation(line: 110, column: 4, scope: !553)
!589 = !DILocation(line: 137, column: 4, scope: !553)
!590 = !DILocation(line: 138, column: 4, scope: !553)
!591 = !DILocation(line: 142, column: 9, scope: !553)
!592 = !DILocation(line: 143, column: 9, scope: !553)
!593 = !DILocation(line: 141, column: 4, scope: !553)
!594 = !DILocation(line: 146, column: 9, scope: !553)
!595 = !DILocation(line: 147, column: 9, scope: !553)
!596 = !DILocation(line: 145, column: 4, scope: !553)
!597 = !DILocation(line: 150, column: 9, scope: !553)
!598 = !DILocation(line: 151, column: 9, scope: !553)
!599 = !DILocation(line: 149, column: 4, scope: !553)
!600 = !DILocation(line: 156, column: 39, scope: !553)
!601 = !DILocation(line: 158, column: 40, scope: !553)
!602 = !DILocation(line: 158, column: 16, scope: !553)
!603 = !DILocation(line: 159, column: 54, scope: !553)
!604 = !DILocation(line: 159, column: 16, scope: !553)
!605 = !DILocation(line: 160, column: 45, scope: !553)
!606 = !DILocation(line: 160, column: 16, scope: !553)
!607 = !DILocation(line: 157, column: 12, scope: !553)
!608 = !DILocation(line: 155, column: 8, scope: !553)
!609 = !DILocation(line: 154, column: 4, scope: !553)
!610 = !DILocation(line: 167, column: 4, scope: !553)
!611 = !DILocation(line: 177, column: 4, scope: !553)
!612 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimRewards", linkageName: "sol.model.struct.anchor.ClaimRewards", scope: null, file: !613, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!613 = !DIFile(filename: "programs/helix-staking/src/instructions/claim_rewards.rs", directory: "/workspace")
!614 = !DILocation(line: 12, column: 4, scope: !615)
!615 = !DILexicalBlockFile(scope: !612, file: !613, discriminator: 0)
!616 = !DILocation(line: 13, column: 6, scope: !615)
!617 = !DILocation(line: 14, column: 8, scope: !615)
!618 = !DILocation(line: 16, column: 6, scope: !615)
!619 = !DILocation(line: 21, column: 8, scope: !615)
!620 = !DILocation(line: 23, column: 6, scope: !615)
!621 = !DILocation(line: 33, column: 8, scope: !615)
!622 = !DILocation(line: 35, column: 6, scope: !615)
!623 = !DILocation(line: 41, column: 8, scope: !615)
!624 = !DILocation(line: 43, column: 6, scope: !615)
!625 = !DILocation(line: 48, column: 8, scope: !615)
!626 = !DILocation(line: 51, column: 6, scope: !615)
!627 = !DILocation(line: 55, column: 8, scope: !615)
!628 = !DILocation(line: 57, column: 8, scope: !615)
!629 = !DILocation(line: 58, column: 8, scope: !615)
!630 = distinct !DISubprogram(name: "claim_rewards::claim_rewards.anon.1", linkageName: "claim_rewards::claim_rewards.anon.1", scope: null, file: !613, line: 87, type: !5, scopeLine: 87, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!631 = !DILocation(line: 87, column: 79, scope: !632)
!632 = !DILexicalBlockFile(scope: !630, file: !613, discriminator: 0)
!633 = !DILocation(line: 88, column: 32, scope: !632)
!634 = !DILocation(line: 89, column: 25, scope: !632)
!635 = !DILocation(line: 89, column: 13, scope: !632)
!636 = !DILocation(line: 90, column: 19, scope: !632)
!637 = !DILocation(line: 90, column: 13, scope: !632)
!638 = !DILocation(line: 88, column: 8, scope: !632)
!639 = !DILocation(line: 91, column: 24, scope: !632)
!640 = !DILocation(line: 92, column: 13, scope: !632)
!641 = !DILocation(line: 93, column: 19, scope: !632)
!642 = !DILocation(line: 93, column: 13, scope: !632)
!643 = !DILocation(line: 94, column: 25, scope: !632)
!644 = !DILocation(line: 94, column: 13, scope: !632)
!645 = !DILocation(line: 95, column: 19, scope: !632)
!646 = !DILocation(line: 95, column: 13, scope: !632)
!647 = !DILocation(line: 91, column: 8, scope: !632)
!648 = !DILocation(line: 96, column: 8, scope: !632)
!649 = !DILocation(line: 96, column: 44, scope: !632)
!650 = !DILocation(line: 96, column: 32, scope: !632)
!651 = distinct !DISubprogram(name: "claim_rewards::claim_rewards.anon.2", linkageName: "claim_rewards::claim_rewards.anon.2", scope: null, file: !613, line: 97, type: !5, scopeLine: 97, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!652 = !DILocation(line: 97, column: 11, scope: !653)
!653 = !DILexicalBlockFile(scope: !651, file: !613, discriminator: 0)
!654 = distinct !DISubprogram(name: "claim_rewards::claim_rewards.anon.3", linkageName: "claim_rewards::claim_rewards.anon.3", scope: null, file: !613, line: 116, type: !5, scopeLine: 116, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!655 = !DILocation(line: 116, column: 21, scope: !656)
!656 = !DILexicalBlockFile(scope: !654, file: !613, discriminator: 0)
!657 = !DILocation(line: 117, column: 8, scope: !656)
!658 = distinct !DISubprogram(name: "claim_rewards::claim_rewards.1", linkageName: "claim_rewards::claim_rewards.1", scope: null, file: !613, line: 61, type: !5, scopeLine: 61, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!659 = !DILocation(line: 61, column: 4, scope: !660)
!660 = !DILexicalBlockFile(scope: !658, file: !613, discriminator: 0)
!661 = !DILocation(line: 62, column: 16, scope: !660)
!662 = !DILocation(line: 62, column: 4, scope: !660)
!663 = !DILocation(line: 63, column: 4, scope: !660)
!664 = !DILocation(line: 64, column: 4, scope: !660)
!665 = !DILocation(line: 67, column: 4, scope: !660)
!666 = !DILocation(line: 68, column: 4, scope: !660)
!667 = !DILocation(line: 69, column: 4, scope: !660)
!668 = !DILocation(line: 72, column: 26, scope: !660)
!669 = !DILocation(line: 72, column: 4, scope: !660)
!670 = !DILocation(line: 82, column: 8, scope: !660)
!671 = !DILocation(line: 79, column: 24, scope: !660)
!672 = !DILocation(line: 79, column: 4, scope: !660)
!673 = !DILocation(line: 87, column: 38, scope: !660)
!674 = !DILocation(line: 87, column: 59, scope: !660)
!675 = !DILocation(line: 87, column: 35, scope: !660)
!676 = !DILocation(line: 87, column: 79, scope: !660)
!677 = !DILocation(line: 97, column: 11, scope: !660)
!678 = !DILocation(line: 87, column: 4, scope: !660)
!679 = !DILocation(line: 102, column: 4, scope: !660)
!680 = !DILocation(line: 104, column: 9, scope: !660)
!681 = !DILocation(line: 105, column: 9, scope: !660)
!682 = !DILocation(line: 103, column: 4, scope: !660)
!683 = !DILocation(line: 108, column: 4, scope: !660)
!684 = !DILocation(line: 112, column: 4, scope: !660)
!685 = !DILocation(line: 113, column: 28, scope: !660)
!686 = !DILocation(line: 113, column: 4, scope: !660)
!687 = !DILocation(line: 116, column: 7, scope: !660)
!688 = !DILocation(line: 116, column: 4, scope: !660)
!689 = !DILocation(line: 116, column: 21, scope: !660)
!690 = !DILocation(line: 122, column: 9, scope: !660)
!691 = !DILocation(line: 123, column: 9, scope: !660)
!692 = !DILocation(line: 121, column: 4, scope: !660)
!693 = !DILocation(line: 126, column: 4, scope: !660)
!694 = !DILocation(line: 127, column: 4, scope: !660)
!695 = !DILocation(line: 130, column: 32, scope: !660)
!696 = !DILocation(line: 130, column: 8, scope: !660)
!697 = !DILocation(line: 131, column: 44, scope: !660)
!698 = !DILocation(line: 131, column: 8, scope: !660)
!699 = !DILocation(line: 132, column: 47, scope: !660)
!700 = !DILocation(line: 132, column: 8, scope: !660)
!701 = !DILocation(line: 129, column: 23, scope: !660)
!702 = !DILocation(line: 129, column: 4, scope: !660)
!703 = !DILocation(line: 136, column: 35, scope: !660)
!704 = !DILocation(line: 135, column: 18, scope: !660)
!705 = !DILocation(line: 135, column: 4, scope: !660)
!706 = !DILocation(line: 141, column: 4, scope: !660)
!707 = !DILocation(line: 144, column: 4, scope: !660)
!708 = !DILocation(line: 151, column: 4, scope: !660)
!709 = distinct !DISubprogram(name: "sol.model.struct.anchor.AcceptAuthority", linkageName: "sol.model.struct.anchor.AcceptAuthority", scope: null, file: !710, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!710 = !DIFile(filename: "programs/helix-staking/src/instructions/accept_authority.rs", directory: "/workspace")
!711 = !DILocation(line: 9, column: 4, scope: !712)
!712 = !DILexicalBlockFile(scope: !709, file: !710, discriminator: 0)
!713 = !DILocation(line: 10, column: 6, scope: !712)
!714 = !DILocation(line: 16, column: 8, scope: !712)
!715 = !DILocation(line: 18, column: 6, scope: !712)
!716 = !DILocation(line: 24, column: 8, scope: !712)
!717 = !DILocation(line: 26, column: 6, scope: !712)
!718 = !DILocation(line: 30, column: 8, scope: !712)
!719 = distinct !DISubprogram(name: "accept_authority::accept_authority.1", linkageName: "accept_authority::accept_authority.1", scope: null, file: !710, line: 33, type: !5, scopeLine: 33, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!720 = !DILocation(line: 33, column: 4, scope: !721)
!721 = !DILexicalBlockFile(scope: !719, file: !710, discriminator: 0)
!722 = !DILocation(line: 34, column: 4, scope: !721)
!723 = !DILocation(line: 35, column: 51, scope: !721)
!724 = !DILocation(line: 35, column: 4, scope: !721)
!725 = !DILocation(line: 37, column: 4, scope: !721)
!726 = !DILocation(line: 39, column: 4, scope: !721)
!727 = !DILocation(line: 44, column: 4, scope: !721)
!728 = distinct !DISubprogram(name: "sol.model.struct.anchor.FreeClaim", linkageName: "sol.model.struct.anchor.FreeClaim", scope: null, file: !729, line: 18, type: !5, scopeLine: 18, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!729 = !DIFile(filename: "programs/helix-staking/src/instructions/free_claim.rs", directory: "/workspace")
!730 = !DILocation(line: 18, column: 4, scope: !731)
!731 = !DILexicalBlockFile(scope: !728, file: !729, discriminator: 0)
!732 = !DILocation(line: 20, column: 6, scope: !731)
!733 = !DILocation(line: 21, column: 8, scope: !731)
!734 = !DILocation(line: 26, column: 6, scope: !731)
!735 = !DILocation(line: 29, column: 8, scope: !731)
!736 = !DILocation(line: 31, column: 6, scope: !731)
!737 = !DILocation(line: 36, column: 8, scope: !731)
!738 = !DILocation(line: 38, column: 6, scope: !731)
!739 = !DILocation(line: 44, column: 8, scope: !731)
!740 = !DILocation(line: 46, column: 6, scope: !731)
!741 = !DILocation(line: 57, column: 8, scope: !731)
!742 = !DILocation(line: 59, column: 6, scope: !731)
!743 = !DILocation(line: 65, column: 8, scope: !731)
!744 = !DILocation(line: 67, column: 6, scope: !731)
!745 = !DILocation(line: 72, column: 8, scope: !731)
!746 = !DILocation(line: 75, column: 6, scope: !731)
!747 = !DILocation(line: 79, column: 8, scope: !731)
!748 = !DILocation(line: 82, column: 6, scope: !731)
!749 = !DILocation(line: 83, column: 8, scope: !731)
!750 = !DILocation(line: 85, column: 8, scope: !731)
!751 = !DILocation(line: 86, column: 8, scope: !731)
!752 = distinct !DISubprogram(name: "free_claim::free_claim.3", linkageName: "free_claim::free_claim.3", scope: null, file: !729, line: 89, type: !5, scopeLine: 89, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!753 = !DILocation(line: 89, column: 4, scope: !754)
!754 = !DILexicalBlockFile(scope: !752, file: !729, discriminator: 0)
!755 = !DILocation(line: 94, column: 16, scope: !754)
!756 = !DILocation(line: 94, column: 4, scope: !754)
!757 = !DILocation(line: 95, column: 4, scope: !754)
!758 = !DILocation(line: 96, column: 4, scope: !754)
!759 = !DILocation(line: 97, column: 4, scope: !754)
!760 = !DILocation(line: 100, column: 4, scope: !754)
!761 = !DILocation(line: 106, column: 4, scope: !754)
!762 = !DILocation(line: 114, column: 37, scope: !754)
!763 = !DILocation(line: 112, column: 4, scope: !754)
!764 = !DILocation(line: 120, column: 37, scope: !754)
!765 = !DILocation(line: 119, column: 4, scope: !754)
!766 = !DILocation(line: 128, column: 23, scope: !754)
!767 = !DILocation(line: 128, column: 4, scope: !754)
!768 = !DILocation(line: 134, column: 49, scope: !754)
!769 = !DILocation(line: 134, column: 4, scope: !754)
!770 = !DILocation(line: 140, column: 9, scope: !754)
!771 = !DILocation(line: 141, column: 9, scope: !754)
!772 = !DILocation(line: 139, column: 4, scope: !754)
!773 = !DILocation(line: 144, column: 4, scope: !754)
!774 = !DILocation(line: 148, column: 27, scope: !754)
!775 = !DILocation(line: 148, column: 4, scope: !754)
!776 = !DILocation(line: 151, column: 9, scope: !754)
!777 = !DILocation(line: 152, column: 9, scope: !754)
!778 = !DILocation(line: 150, column: 4, scope: !754)
!779 = !DILocation(line: 157, column: 17, scope: !754)
!780 = !DILocation(line: 158, column: 17, scope: !754)
!781 = !DILocation(line: 155, column: 9, scope: !754)
!782 = !DILocation(line: 160, column: 9, scope: !754)
!783 = !DILocation(line: 154, column: 4, scope: !754)
!784 = !DILocation(line: 163, column: 4, scope: !754)
!785 = !DILocation(line: 164, column: 4, scope: !754)
!786 = !DILocation(line: 165, column: 4, scope: !754)
!787 = !DILocation(line: 166, column: 4, scope: !754)
!788 = !DILocation(line: 167, column: 4, scope: !754)
!789 = !DILocation(line: 168, column: 4, scope: !754)
!790 = !DILocation(line: 169, column: 64, scope: !754)
!791 = !DILocation(line: 169, column: 4, scope: !754)
!792 = !DILocation(line: 170, column: 4, scope: !754)
!793 = !DILocation(line: 174, column: 9, scope: !754)
!794 = !DILocation(line: 175, column: 9, scope: !754)
!795 = !DILocation(line: 173, column: 4, scope: !754)
!796 = !DILocation(line: 177, column: 9, scope: !754)
!797 = !DILocation(line: 178, column: 9, scope: !754)
!798 = !DILocation(line: 176, column: 4, scope: !754)
!799 = !DILocation(line: 181, column: 4, scope: !754)
!800 = !DILocation(line: 182, column: 4, scope: !754)
!801 = !DILocation(line: 186, column: 39, scope: !754)
!802 = !DILocation(line: 188, column: 40, scope: !754)
!803 = !DILocation(line: 188, column: 16, scope: !754)
!804 = !DILocation(line: 189, column: 55, scope: !754)
!805 = !DILocation(line: 189, column: 16, scope: !754)
!806 = !DILocation(line: 190, column: 55, scope: !754)
!807 = !DILocation(line: 190, column: 16, scope: !754)
!808 = !DILocation(line: 187, column: 12, scope: !754)
!809 = !DILocation(line: 185, column: 8, scope: !754)
!810 = !DILocation(line: 184, column: 4, scope: !754)
!811 = !DILocation(line: 198, column: 4, scope: !754)
!812 = !DILocation(line: 214, column: 4, scope: !754)
!813 = distinct !DISubprogram(name: "free_claim::verify_ed25519_signature.3", linkageName: "free_claim::verify_ed25519_signature.3", scope: null, file: !729, line: 219, type: !5, scopeLine: 219, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!814 = !DILocation(line: 219, scope: !815)
!815 = !DILexicalBlockFile(scope: !813, file: !729, discriminator: 0)
!816 = !DILocation(line: 224, column: 27, scope: !815)
!817 = !DILocation(line: 224, column: 4, scope: !815)
!818 = !DILocation(line: 227, column: 4, scope: !815)
!819 = !DILocation(line: 230, column: 9, scope: !815)
!820 = !DILocation(line: 230, column: 8, scope: !815)
!821 = !DILocation(line: 229, column: 21, scope: !815)
!822 = !DILocation(line: 229, column: 4, scope: !815)
!823 = !DILocation(line: 235, column: 4, scope: !815)
!824 = !DILocation(line: 241, column: 27, scope: !815)
!825 = !DILocation(line: 241, column: 4, scope: !815)
!826 = !DILocation(line: 256, column: 4, scope: !815)
!827 = !DILocation(line: 257, column: 4, scope: !815)
!828 = !DILocation(line: 260, column: 24, scope: !815)
!829 = !DILocation(line: 260, column: 4, scope: !815)
!830 = !DILocation(line: 261, column: 21, scope: !815)
!831 = !DILocation(line: 261, column: 4, scope: !815)
!832 = !DILocation(line: 262, column: 18, scope: !815)
!833 = !DILocation(line: 262, column: 4, scope: !815)
!834 = !DILocation(line: 265, column: 4, scope: !815)
!835 = !DILocation(line: 269, column: 24, scope: !815)
!836 = !DILocation(line: 270, column: 9, scope: !815)
!837 = !DILocation(line: 269, column: 4, scope: !815)
!838 = !DILocation(line: 271, column: 4, scope: !815)
!839 = !DILocation(line: 277, column: 4, scope: !815)
!840 = !DILocation(line: 281, column: 4, scope: !815)
!841 = !DILocation(line: 282, column: 4, scope: !815)
!842 = !DILocation(line: 287, column: 4, scope: !815)
!843 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.1", linkageName: "free_claim::verify_merkle_proof.anon.1", scope: null, file: !729, line: 310, type: !5, scopeLine: 310, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!844 = !DILocation(line: 310, column: 34, scope: !845)
!845 = !DILexicalBlockFile(scope: !843, file: !729, discriminator: 0)
!846 = !DILocation(line: 311, column: 12, scope: !845)
!847 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.2", linkageName: "free_claim::verify_merkle_proof.anon.2", scope: null, file: !729, line: 312, type: !5, scopeLine: 312, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!848 = !DILocation(line: 312, column: 15, scope: !849)
!849 = !DILexicalBlockFile(scope: !847, file: !729, discriminator: 0)
!850 = !DILocation(line: 313, column: 12, scope: !849)
!851 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.4", linkageName: "free_claim::verify_merkle_proof.anon.4", scope: null, file: !729, line: 310, type: !5, scopeLine: 310, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!852 = !DILocation(line: 310, column: 34, scope: !853)
!853 = !DILexicalBlockFile(scope: !851, file: !729, discriminator: 0)
!854 = !DILocation(line: 311, column: 12, scope: !853)
!855 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.5", linkageName: "free_claim::verify_merkle_proof.anon.5", scope: null, file: !729, line: 312, type: !5, scopeLine: 312, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!856 = !DILocation(line: 312, column: 15, scope: !857)
!857 = !DILexicalBlockFile(scope: !855, file: !729, discriminator: 0)
!858 = !DILocation(line: 313, column: 12, scope: !857)
!859 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.3", linkageName: "free_claim::verify_merkle_proof.anon.3", scope: null, file: !729, line: 309, type: !5, scopeLine: 309, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!860 = !DILocation(line: 309, column: 32, scope: !861)
!861 = !DILexicalBlockFile(scope: !859, file: !729, discriminator: 0)
!862 = !DILocation(line: 310, column: 18, scope: !861)
!863 = !DILocation(line: 310, column: 15, scope: !861)
!864 = !DILocation(line: 310, column: 34, scope: !861)
!865 = !DILocation(line: 312, column: 15, scope: !861)
!866 = !DILocation(line: 310, column: 8, scope: !861)
!867 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.5", linkageName: "free_claim::verify_merkle_proof.5", scope: null, file: !729, line: 292, type: !5, scopeLine: 292, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!868 = !DILocation(line: 292, scope: !869)
!869 = !DILexicalBlockFile(scope: !867, file: !729, discriminator: 0)
!870 = !DILocation(line: 299, column: 4, scope: !869)
!871 = !DILocation(line: 302, column: 19, scope: !869)
!872 = !DILocation(line: 302, column: 4, scope: !869)
!873 = !DILocation(line: 309, column: 4, scope: !869)
!874 = !DILocation(line: 317, column: 4, scope: !869)
!875 = !DILocation(line: 319, column: 4, scope: !869)
!876 = distinct !DISubprogram(name: "free_claim::calculate_days_elapsed.3", linkageName: "free_claim::calculate_days_elapsed.3", scope: null, file: !729, line: 323, type: !5, scopeLine: 323, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!877 = !DILocation(line: 323, scope: !878)
!878 = !DILexicalBlockFile(scope: !876, file: !729, discriminator: 0)
!879 = !DILocation(line: 329, column: 9, scope: !878)
!880 = !DILocation(line: 330, column: 9, scope: !878)
!881 = !DILocation(line: 328, column: 4, scope: !878)
!882 = !DILocation(line: 334, column: 9, scope: !878)
!883 = !DILocation(line: 335, column: 15, scope: !878)
!884 = !DILocation(line: 335, column: 9, scope: !878)
!885 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.anon.1", linkageName: "free_claim::calculate_speed_bonus.anon.1", scope: null, file: !729, line: 357, type: !5, scopeLine: 357, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!886 = !DILocation(line: 357, column: 61, scope: !887)
!887 = !DILexicalBlockFile(scope: !885, file: !729, discriminator: 0)
!888 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.anon.2", linkageName: "free_claim::calculate_speed_bonus.anon.2", scope: null, file: !729, line: 359, type: !5, scopeLine: 359, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!889 = !DILocation(line: 359, column: 52, scope: !890)
!890 = !DILexicalBlockFile(scope: !888, file: !729, discriminator: 0)
!891 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.anon.3", linkageName: "free_claim::calculate_speed_bonus.anon.3", scope: null, file: !729, line: 361, type: !5, scopeLine: 361, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!892 = !DILocation(line: 361, column: 11, scope: !893)
!893 = !DILexicalBlockFile(scope: !891, file: !729, discriminator: 0)
!894 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.2", linkageName: "free_claim::calculate_speed_bonus.2", scope: null, file: !729, line: 342, type: !5, scopeLine: 342, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!895 = !DILocation(line: 342, scope: !896)
!896 = !DILexicalBlockFile(scope: !894, file: !729, discriminator: 0)
!897 = !DILocation(line: 355, column: 22, scope: !896)
!898 = !DILocation(line: 355, column: 4, scope: !896)
!899 = !DILocation(line: 357, column: 23, scope: !896)
!900 = !DILocation(line: 357, column: 20, scope: !896)
!901 = !DILocation(line: 357, column: 61, scope: !896)
!902 = !DILocation(line: 359, column: 14, scope: !896)
!903 = !DILocation(line: 359, column: 11, scope: !896)
!904 = !DILocation(line: 359, column: 52, scope: !896)
!905 = !DILocation(line: 361, column: 11, scope: !896)
!906 = !DILocation(line: 357, column: 4, scope: !896)
!907 = !DILocation(line: 366, column: 23, scope: !896)
!908 = !DILocation(line: 366, column: 4, scope: !896)
!909 = !DILocation(line: 368, column: 4, scope: !896)
!910 = distinct !DISubprogram(name: "sol.model.struct.anchor.AbortBpd", linkageName: "sol.model.struct.anchor.AbortBpd", scope: null, file: !911, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!911 = !DIFile(filename: "programs/helix-staking/src/instructions/abort_bpd.rs", directory: "/workspace")
!912 = !DILocation(line: 9, column: 4, scope: !913)
!913 = !DILexicalBlockFile(scope: !910, file: !911, discriminator: 0)
!914 = !DILocation(line: 10, column: 6, scope: !913)
!915 = !DILocation(line: 16, column: 8, scope: !913)
!916 = !DILocation(line: 18, column: 6, scope: !913)
!917 = !DILocation(line: 23, column: 8, scope: !913)
!918 = !DILocation(line: 25, column: 8, scope: !913)
!919 = distinct !DISubprogram(name: "abort_bpd::abort_bpd.anon.1", linkageName: "abort_bpd::abort_bpd.anon.1", scope: null, file: !911, line: 45, type: !5, scopeLine: 45, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!920 = !DILocation(line: 45, column: 44, scope: !921)
!921 = !DILexicalBlockFile(scope: !919, file: !911, discriminator: 0)
!922 = !DILocation(line: 46, column: 15, scope: !921)
!923 = !DILocation(line: 46, column: 8, scope: !921)
!924 = distinct !DISubprogram(name: "abort_bpd::abort_bpd.1", linkageName: "abort_bpd::abort_bpd.1", scope: null, file: !911, line: 38, type: !5, scopeLine: 38, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!925 = !DILocation(line: 38, column: 4, scope: !926)
!926 = !DILexicalBlockFile(scope: !924, file: !911, discriminator: 0)
!927 = !DILocation(line: 39, column: 4, scope: !926)
!928 = !DILocation(line: 40, column: 4, scope: !926)
!929 = !DILocation(line: 45, column: 21, scope: !926)
!930 = !DILocation(line: 45, column: 7, scope: !926)
!931 = !DILocation(line: 45, column: 4, scope: !926)
!932 = !DILocation(line: 45, column: 44, scope: !926)
!933 = !DILocation(line: 51, column: 4, scope: !926)
!934 = !DILocation(line: 57, column: 4, scope: !926)
!935 = !DILocation(line: 58, column: 4, scope: !926)
!936 = !DILocation(line: 61, column: 4, scope: !926)
!937 = !DILocation(line: 62, column: 4, scope: !926)
!938 = !DILocation(line: 63, column: 4, scope: !926)
!939 = !DILocation(line: 64, column: 4, scope: !926)
!940 = !DILocation(line: 65, column: 4, scope: !926)
!941 = !DILocation(line: 66, column: 4, scope: !926)
!942 = !DILocation(line: 67, column: 4, scope: !926)
!943 = !DILocation(line: 68, column: 4, scope: !926)
!944 = !DILocation(line: 69, column: 4, scope: !926)
!945 = !DILocation(line: 72, column: 17, scope: !926)
!946 = !DILocation(line: 74, column: 4, scope: !926)
!947 = !DILocation(line: 80, column: 4, scope: !926)
!948 = distinct !DISubprogram(name: "sol.model.struct.anchor.SealBpdFinalize", linkageName: "sol.model.struct.anchor.SealBpdFinalize", scope: null, file: !949, line: 8, type: !5, scopeLine: 8, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!949 = !DIFile(filename: "programs/helix-staking/src/instructions/seal_bpd_finalize.rs", directory: "/workspace")
!950 = !DILocation(line: 8, column: 4, scope: !951)
!951 = !DILexicalBlockFile(scope: !948, file: !949, discriminator: 0)
!952 = !DILocation(line: 10, column: 6, scope: !951)
!953 = !DILocation(line: 13, column: 8, scope: !951)
!954 = !DILocation(line: 15, column: 6, scope: !951)
!955 = !DILocation(line: 19, column: 8, scope: !951)
!956 = !DILocation(line: 21, column: 6, scope: !951)
!957 = !DILocation(line: 29, column: 8, scope: !951)
!958 = distinct !DISubprogram(name: "seal_bpd_finalize::seal_bpd_finalize.anon.1", linkageName: "seal_bpd_finalize::seal_bpd_finalize.anon.1", scope: null, file: !949, line: 69, type: !5, scopeLine: 69, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!959 = !DILocation(line: 69, column: 46, scope: !960)
!960 = !DILexicalBlockFile(scope: !958, file: !949, discriminator: 0)
!961 = !DILocation(line: 70, column: 8, scope: !960)
!962 = !DILocation(line: 71, column: 8, scope: !960)
!963 = !DILocation(line: 72, column: 15, scope: !960)
!964 = !DILocation(line: 72, column: 8, scope: !960)
!965 = distinct !DISubprogram(name: "seal_bpd_finalize::seal_bpd_finalize.2", linkageName: "seal_bpd_finalize::seal_bpd_finalize.2", scope: null, file: !949, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!966 = !DILocation(line: 32, column: 4, scope: !967)
!967 = !DILexicalBlockFile(scope: !965, file: !949, discriminator: 0)
!968 = !DILocation(line: 33, column: 16, scope: !967)
!969 = !DILocation(line: 33, column: 4, scope: !967)
!970 = !DILocation(line: 34, column: 4, scope: !967)
!971 = !DILocation(line: 37, column: 4, scope: !967)
!972 = !DILocation(line: 43, column: 4, scope: !967)
!973 = !DILocation(line: 49, column: 4, scope: !967)
!974 = !DILocation(line: 53, column: 4, scope: !967)
!975 = !DILocation(line: 63, column: 4, scope: !967)
!976 = !DILocation(line: 69, column: 7, scope: !967)
!977 = !DILocation(line: 69, column: 4, scope: !967)
!978 = !DILocation(line: 69, column: 46, scope: !967)
!979 = !DILocation(line: 76, column: 4, scope: !967)
!980 = !DILocation(line: 78, column: 31, scope: !967)
!981 = !DILocation(line: 79, column: 21, scope: !967)
!982 = !DILocation(line: 79, column: 9, scope: !967)
!983 = !DILocation(line: 80, column: 9, scope: !967)
!984 = !DILocation(line: 81, column: 9, scope: !967)
!985 = !DILocation(line: 82, column: 9, scope: !967)
!986 = !DILocation(line: 78, column: 4, scope: !967)
!987 = !DILocation(line: 84, column: 4, scope: !967)
!988 = !DILocation(line: 85, column: 4, scope: !967)
!989 = !DILocation(line: 88, column: 4, scope: !967)
!990 = !DILocation(line: 90, column: 4, scope: !967)
!991 = distinct !DISubprogram(name: "sol.model.struct.anchor.TransferAuthority", linkageName: "sol.model.struct.anchor.TransferAuthority", scope: null, file: !992, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!992 = !DIFile(filename: "programs/helix-staking/src/instructions/transfer_authority.rs", directory: "/workspace")
!993 = !DILocation(line: 9, column: 4, scope: !994)
!994 = !DILexicalBlockFile(scope: !991, file: !992, discriminator: 0)
!995 = !DILocation(line: 10, column: 6, scope: !994)
!996 = !DILocation(line: 15, column: 8, scope: !994)
!997 = !DILocation(line: 17, column: 6, scope: !994)
!998 = !DILocation(line: 24, column: 8, scope: !994)
!999 = !DILocation(line: 26, column: 6, scope: !994)
!1000 = !DILocation(line: 27, column: 8, scope: !994)
!1001 = !DILocation(line: 29, column: 8, scope: !994)
!1002 = distinct !DISubprogram(name: "transfer_authority::transfer_authority.anon.1", linkageName: "transfer_authority::transfer_authority.anon.1", scope: null, file: !992, line: 36, type: !5, scopeLine: 36, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1003 = !DILocation(line: 36, column: 92, scope: !1004)
!1004 = !DILexicalBlockFile(scope: !1002, file: !992, discriminator: 0)
!1005 = !DILocation(line: 37, column: 8, scope: !1004)
!1006 = distinct !DISubprogram(name: "transfer_authority::transfer_authority.2", linkageName: "transfer_authority::transfer_authority.2", scope: null, file: !992, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1007 = !DILocation(line: 32, column: 4, scope: !1008)
!1008 = !DILexicalBlockFile(scope: !1006, file: !992, discriminator: 0)
!1009 = !DILocation(line: 33, column: 4, scope: !1008)
!1010 = !DILocation(line: 36, column: 32, scope: !1008)
!1011 = !DILocation(line: 36, column: 7, scope: !1008)
!1012 = !DILocation(line: 36, column: 53, scope: !1008)
!1013 = !DILocation(line: 36, column: 4, scope: !1008)
!1014 = !DILocation(line: 36, column: 92, scope: !1008)
!1015 = !DILocation(line: 43, column: 4, scope: !1008)
!1016 = !DILocation(line: 44, column: 4, scope: !1008)
!1017 = !DILocation(line: 46, column: 4, scope: !1008)
!1018 = !DILocation(line: 51, column: 4, scope: !1008)
!1019 = distinct !DISubprogram(name: "sol.model.struct.anchor.AdminSetClaimEndSlot", linkageName: "sol.model.struct.anchor.AdminSetClaimEndSlot", scope: null, file: !1020, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1020 = !DIFile(filename: "programs/helix-staking/src/instructions/admin_set_claim_end_slot.rs", directory: "/workspace")
!1021 = !DILocation(line: 11, column: 4, scope: !1022)
!1022 = !DILexicalBlockFile(scope: !1019, file: !1020, discriminator: 0)
!1023 = !DILocation(line: 12, column: 6, scope: !1022)
!1024 = !DILocation(line: 15, column: 8, scope: !1022)
!1025 = !DILocation(line: 17, column: 6, scope: !1022)
!1026 = !DILocation(line: 21, column: 8, scope: !1022)
!1027 = !DILocation(line: 23, column: 6, scope: !1022)
!1028 = !DILocation(line: 29, column: 8, scope: !1022)
!1029 = distinct !DISubprogram(name: "admin_set_claim_end_slot::admin_set_claim_end_slot.2", linkageName: "admin_set_claim_end_slot::admin_set_claim_end_slot.2", scope: null, file: !1020, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1030 = !DILocation(line: 32, column: 4, scope: !1031)
!1031 = !DILexicalBlockFile(scope: !1029, file: !1020, discriminator: 0)
!1032 = !DILocation(line: 36, column: 16, scope: !1031)
!1033 = !DILocation(line: 36, column: 4, scope: !1031)
!1034 = !DILocation(line: 37, column: 4, scope: !1031)
!1035 = !DILocation(line: 38, column: 4, scope: !1031)
!1036 = !DILocation(line: 43, column: 9, scope: !1031)
!1037 = !DILocation(line: 44, column: 9, scope: !1031)
!1038 = !DILocation(line: 42, column: 4, scope: !1031)
!1039 = !DILocation(line: 45, column: 4, scope: !1031)
!1040 = !DILocation(line: 50, column: 4, scope: !1031)
!1041 = !DILocation(line: 51, column: 4, scope: !1031)
!1042 = distinct !DISubprogram(name: "sol.model.struct.anchor.Unstake", linkageName: "sol.model.struct.anchor.Unstake", scope: null, file: !1043, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1043 = !DIFile(filename: "programs/helix-staking/src/instructions/unstake.rs", directory: "/workspace")
!1044 = !DILocation(line: 11, column: 4, scope: !1045)
!1045 = !DILexicalBlockFile(scope: !1042, file: !1043, discriminator: 0)
!1046 = !DILocation(line: 12, column: 6, scope: !1045)
!1047 = !DILocation(line: 13, column: 8, scope: !1045)
!1048 = !DILocation(line: 15, column: 6, scope: !1045)
!1049 = !DILocation(line: 20, column: 8, scope: !1045)
!1050 = !DILocation(line: 22, column: 6, scope: !1045)
!1051 = !DILocation(line: 29, column: 8, scope: !1045)
!1052 = !DILocation(line: 31, column: 6, scope: !1045)
!1053 = !DILocation(line: 37, column: 8, scope: !1045)
!1054 = !DILocation(line: 39, column: 6, scope: !1045)
!1055 = !DILocation(line: 44, column: 8, scope: !1045)
!1056 = !DILocation(line: 47, column: 6, scope: !1045)
!1057 = !DILocation(line: 51, column: 8, scope: !1045)
!1058 = !DILocation(line: 53, column: 8, scope: !1045)
!1059 = distinct !DISubprogram(name: "unstake::unstake.anon.1", linkageName: "unstake::unstake.anon.1", scope: null, file: !1043, line: 90, type: !5, scopeLine: 90, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1060 = !DILocation(line: 90, column: 79, scope: !1061)
!1061 = !DILexicalBlockFile(scope: !1059, file: !1043, discriminator: 0)
!1062 = !DILocation(line: 91, column: 32, scope: !1061)
!1063 = !DILocation(line: 92, column: 25, scope: !1061)
!1064 = !DILocation(line: 92, column: 13, scope: !1061)
!1065 = !DILocation(line: 93, column: 19, scope: !1061)
!1066 = !DILocation(line: 93, column: 13, scope: !1061)
!1067 = !DILocation(line: 91, column: 8, scope: !1061)
!1068 = !DILocation(line: 94, column: 24, scope: !1061)
!1069 = !DILocation(line: 95, column: 13, scope: !1061)
!1070 = !DILocation(line: 96, column: 19, scope: !1061)
!1071 = !DILocation(line: 96, column: 13, scope: !1061)
!1072 = !DILocation(line: 97, column: 25, scope: !1061)
!1073 = !DILocation(line: 97, column: 13, scope: !1061)
!1074 = !DILocation(line: 98, column: 19, scope: !1061)
!1075 = !DILocation(line: 98, column: 13, scope: !1061)
!1076 = !DILocation(line: 94, column: 8, scope: !1061)
!1077 = !DILocation(line: 99, column: 8, scope: !1061)
!1078 = !DILocation(line: 99, column: 44, scope: !1061)
!1079 = !DILocation(line: 99, column: 32, scope: !1061)
!1080 = distinct !DISubprogram(name: "unstake::unstake.anon.2", linkageName: "unstake::unstake.anon.2", scope: null, file: !1043, line: 100, type: !5, scopeLine: 100, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1081 = !DILocation(line: 100, column: 11, scope: !1082)
!1082 = !DILexicalBlockFile(scope: !1080, file: !1043, discriminator: 0)
!1083 = distinct !DISubprogram(name: "unstake::unstake.anon.3", linkageName: "unstake::unstake.anon.3", scope: null, file: !1043, line: 105, type: !5, scopeLine: 105, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1084 = !DILocation(line: 105, column: 59, scope: !1085)
!1085 = !DILexicalBlockFile(scope: !1083, file: !1043, discriminator: 0)
!1086 = !DILocation(line: 107, column: 29, scope: !1085)
!1087 = !DILocation(line: 107, column: 8, scope: !1085)
!1088 = distinct !DISubprogram(name: "unstake::unstake.anon.5", linkageName: "unstake::unstake.anon.5", scope: null, file: !1043, line: 122, type: !5, scopeLine: 122, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1089 = !DILocation(line: 122, column: 31, scope: !1090)
!1090 = !DILexicalBlockFile(scope: !1088, file: !1043, discriminator: 0)
!1091 = distinct !DISubprogram(name: "unstake::unstake.anon.6", linkageName: "unstake::unstake.anon.6", scope: null, file: !1043, line: 124, type: !5, scopeLine: 124, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1092 = !DILocation(line: 124, column: 15, scope: !1093)
!1093 = !DILexicalBlockFile(scope: !1091, file: !1043, discriminator: 0)
!1094 = distinct !DISubprogram(name: "unstake::unstake.anon.4", linkageName: "unstake::unstake.anon.4", scope: null, file: !1043, line: 114, type: !5, scopeLine: 114, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1095 = !DILocation(line: 114, column: 11, scope: !1096)
!1096 = !DILexicalBlockFile(scope: !1094, file: !1043, discriminator: 0)
!1097 = !DILocation(line: 116, column: 29, scope: !1096)
!1098 = !DILocation(line: 116, column: 8, scope: !1096)
!1099 = !DILocation(line: 122, column: 11, scope: !1096)
!1100 = !DILocation(line: 122, column: 8, scope: !1096)
!1101 = !DILocation(line: 122, column: 31, scope: !1096)
!1102 = !DILocation(line: 124, column: 15, scope: !1096)
!1103 = distinct !DISubprogram(name: "unstake::unstake.anon.7", linkageName: "unstake::unstake.anon.7", scope: null, file: !1043, line: 169, type: !5, scopeLine: 169, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1104 = !DILocation(line: 169, column: 52, scope: !1105)
!1105 = !DILexicalBlockFile(scope: !1103, file: !1043, discriminator: 0)
!1106 = !DILocation(line: 170, column: 37, scope: !1105)
!1107 = !DILocation(line: 170, column: 8, scope: !1105)
!1108 = !DILocation(line: 172, column: 13, scope: !1105)
!1109 = !DILocation(line: 173, column: 13, scope: !1105)
!1110 = !DILocation(line: 171, column: 8, scope: !1105)
!1111 = distinct !DISubprogram(name: "unstake::unstake.anon.8", linkageName: "unstake::unstake.anon.8", scope: null, file: !1043, line: 177, type: !5, scopeLine: 177, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1112 = !DILocation(line: 177, column: 29, scope: !1113)
!1113 = !DILexicalBlockFile(scope: !1111, file: !1043, discriminator: 0)
!1114 = !DILocation(line: 178, column: 8, scope: !1113)
!1115 = !DILocation(line: 179, column: 8, scope: !1113)
!1116 = !DILocation(line: 182, column: 36, scope: !1113)
!1117 = !DILocation(line: 182, column: 12, scope: !1113)
!1118 = !DILocation(line: 183, column: 48, scope: !1113)
!1119 = !DILocation(line: 183, column: 12, scope: !1113)
!1120 = !DILocation(line: 184, column: 51, scope: !1113)
!1121 = !DILocation(line: 184, column: 12, scope: !1113)
!1122 = !DILocation(line: 181, column: 27, scope: !1113)
!1123 = !DILocation(line: 181, column: 8, scope: !1113)
!1124 = !DILocation(line: 188, column: 39, scope: !1113)
!1125 = !DILocation(line: 187, column: 22, scope: !1113)
!1126 = !DILocation(line: 187, column: 8, scope: !1113)
!1127 = !DILocation(line: 193, column: 8, scope: !1113)
!1128 = distinct !DISubprogram(name: "unstake::unstake.1", linkageName: "unstake::unstake.1", scope: null, file: !1043, line: 56, type: !5, scopeLine: 56, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1129 = !DILocation(line: 56, column: 4, scope: !1130)
!1130 = !DILexicalBlockFile(scope: !1128, file: !1043, discriminator: 0)
!1131 = !DILocation(line: 57, column: 16, scope: !1130)
!1132 = !DILocation(line: 57, column: 4, scope: !1130)
!1133 = !DILocation(line: 58, column: 4, scope: !1130)
!1134 = !DILocation(line: 59, column: 4, scope: !1130)
!1135 = !DILocation(line: 62, column: 4, scope: !1130)
!1136 = !DILocation(line: 65, column: 4, scope: !1130)
!1137 = !DILocation(line: 66, column: 4, scope: !1130)
!1138 = !DILocation(line: 67, column: 4, scope: !1130)
!1139 = !DILocation(line: 68, column: 4, scope: !1130)
!1140 = !DILocation(line: 69, column: 4, scope: !1130)
!1141 = !DILocation(line: 70, column: 4, scope: !1130)
!1142 = !DILocation(line: 71, column: 4, scope: !1130)
!1143 = !DILocation(line: 72, column: 4, scope: !1130)
!1144 = !DILocation(line: 75, column: 26, scope: !1130)
!1145 = !DILocation(line: 75, column: 4, scope: !1130)
!1146 = !DILocation(line: 85, column: 8, scope: !1130)
!1147 = !DILocation(line: 82, column: 24, scope: !1130)
!1148 = !DILocation(line: 82, column: 4, scope: !1130)
!1149 = !DILocation(line: 90, column: 38, scope: !1130)
!1150 = !DILocation(line: 90, column: 59, scope: !1130)
!1151 = !DILocation(line: 90, column: 35, scope: !1130)
!1152 = !DILocation(line: 90, column: 79, scope: !1130)
!1153 = !DILocation(line: 100, column: 11, scope: !1130)
!1154 = !DILocation(line: 90, column: 4, scope: !1130)
!1155 = !DILocation(line: 105, column: 37, scope: !1130)
!1156 = !DILocation(line: 105, column: 34, scope: !1130)
!1157 = !DILocation(line: 105, column: 59, scope: !1130)
!1158 = !DILocation(line: 114, column: 11, scope: !1130)
!1159 = !DILocation(line: 105, column: 4, scope: !1130)
!1160 = !DILocation(line: 131, column: 9, scope: !1130)
!1161 = !DILocation(line: 132, column: 9, scope: !1130)
!1162 = !DILocation(line: 130, column: 4, scope: !1130)
!1163 = !DILocation(line: 136, column: 9, scope: !1130)
!1164 = !DILocation(line: 137, column: 9, scope: !1130)
!1165 = !DILocation(line: 138, column: 9, scope: !1130)
!1166 = !DILocation(line: 139, column: 9, scope: !1130)
!1167 = !DILocation(line: 135, column: 4, scope: !1130)
!1168 = !DILocation(line: 142, column: 4, scope: !1130)
!1169 = !DILocation(line: 143, column: 4, scope: !1130)
!1170 = !DILocation(line: 146, column: 4, scope: !1130)
!1171 = !DILocation(line: 150, column: 9, scope: !1130)
!1172 = !DILocation(line: 151, column: 9, scope: !1130)
!1173 = !DILocation(line: 149, column: 4, scope: !1130)
!1174 = !DILocation(line: 154, column: 9, scope: !1130)
!1175 = !DILocation(line: 155, column: 9, scope: !1130)
!1176 = !DILocation(line: 153, column: 4, scope: !1130)
!1177 = !DILocation(line: 158, column: 9, scope: !1130)
!1178 = !DILocation(line: 159, column: 9, scope: !1130)
!1179 = !DILocation(line: 157, column: 4, scope: !1130)
!1180 = !DILocation(line: 162, column: 9, scope: !1130)
!1181 = !DILocation(line: 163, column: 9, scope: !1130)
!1182 = !DILocation(line: 161, column: 4, scope: !1130)
!1183 = !DILocation(line: 169, column: 7, scope: !1130)
!1184 = !DILocation(line: 169, column: 22, scope: !1130)
!1185 = !DILocation(line: 169, column: 4, scope: !1130)
!1186 = !DILocation(line: 169, column: 52, scope: !1130)
!1187 = !DILocation(line: 177, column: 7, scope: !1130)
!1188 = !DILocation(line: 177, column: 4, scope: !1130)
!1189 = !DILocation(line: 177, column: 29, scope: !1130)
!1190 = !DILocation(line: 197, column: 4, scope: !1130)
!1191 = !DILocation(line: 209, column: 4, scope: !1130)
!1192 = distinct !DISubprogram(name: "math::mul_div.3", linkageName: "math::mul_div.3", scope: null, file: !1193, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1193 = !DIFile(filename: "programs/helix-staking/src/instructions/math.rs", directory: "/workspace")
!1194 = !DILocation(line: 9, column: 4, scope: !1195)
!1195 = !DILexicalBlockFile(scope: !1192, file: !1193, discriminator: 0)
!1196 = !DILocation(line: 10, column: 4, scope: !1195)
!1197 = !DILocation(line: 11, column: 18, scope: !1195)
!1198 = !DILocation(line: 12, column: 21, scope: !1195)
!1199 = !DILocation(line: 12, column: 9, scope: !1195)
!1200 = !DILocation(line: 13, column: 15, scope: !1195)
!1201 = !DILocation(line: 13, column: 9, scope: !1195)
!1202 = !DILocation(line: 14, column: 21, scope: !1195)
!1203 = !DILocation(line: 14, column: 9, scope: !1195)
!1204 = !DILocation(line: 15, column: 15, scope: !1195)
!1205 = !DILocation(line: 15, column: 9, scope: !1195)
!1206 = !DILocation(line: 11, column: 4, scope: !1195)
!1207 = !DILocation(line: 16, column: 4, scope: !1195)
!1208 = !DILocation(line: 16, column: 38, scope: !1195)
!1209 = !DILocation(line: 16, column: 26, scope: !1195)
!1210 = distinct !DISubprogram(name: "math::mul_div_up.3", linkageName: "math::mul_div_up.3", scope: null, file: !1193, line: 28, type: !5, scopeLine: 28, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1211 = !DILocation(line: 28, column: 4, scope: !1212)
!1212 = !DILexicalBlockFile(scope: !1210, file: !1193, discriminator: 0)
!1213 = !DILocation(line: 29, column: 4, scope: !1212)
!1214 = !DILocation(line: 32, column: 17, scope: !1212)
!1215 = !DILocation(line: 32, column: 4, scope: !1212)
!1216 = !DILocation(line: 33, column: 17, scope: !1212)
!1217 = !DILocation(line: 33, column: 4, scope: !1212)
!1218 = !DILocation(line: 34, column: 17, scope: !1212)
!1219 = !DILocation(line: 34, column: 4, scope: !1212)
!1220 = !DILocation(line: 38, column: 9, scope: !1212)
!1221 = !DILocation(line: 39, column: 15, scope: !1212)
!1222 = !DILocation(line: 39, column: 9, scope: !1212)
!1223 = !DILocation(line: 37, column: 4, scope: !1212)
!1224 = !DILocation(line: 44, column: 9, scope: !1212)
!1225 = !DILocation(line: 45, column: 15, scope: !1212)
!1226 = !DILocation(line: 45, column: 9, scope: !1212)
!1227 = !DILocation(line: 43, column: 4, scope: !1212)
!1228 = !DILocation(line: 47, column: 9, scope: !1212)
!1229 = !DILocation(line: 48, column: 15, scope: !1212)
!1230 = !DILocation(line: 48, column: 9, scope: !1212)
!1231 = !DILocation(line: 46, column: 4, scope: !1212)
!1232 = !DILocation(line: 52, column: 9, scope: !1212)
!1233 = !DILocation(line: 53, column: 15, scope: !1212)
!1234 = !DILocation(line: 53, column: 9, scope: !1212)
!1235 = !DILocation(line: 51, column: 4, scope: !1212)
!1236 = !DILocation(line: 54, column: 4, scope: !1212)
!1237 = !DILocation(line: 55, column: 21, scope: !1212)
!1238 = !DILocation(line: 55, column: 9, scope: !1212)
!1239 = distinct !DISubprogram(name: "math::calculate_lpb_bonus.anon.1", linkageName: "math::calculate_lpb_bonus.anon.1", scope: null, file: !1193, line: 62, type: !5, scopeLine: 62, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1240 = !DILocation(line: 62, column: 23, scope: !1241)
!1241 = !DILexicalBlockFile(scope: !1239, file: !1193, discriminator: 0)
!1242 = !DILocation(line: 63, column: 15, scope: !1241)
!1243 = !DILocation(line: 63, column: 8, scope: !1241)
!1244 = distinct !DISubprogram(name: "math::calculate_lpb_bonus.anon.2", linkageName: "math::calculate_lpb_bonus.anon.2", scope: null, file: !1193, line: 67, type: !5, scopeLine: 67, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1245 = !DILocation(line: 67, column: 34, scope: !1246)
!1246 = !DILexicalBlockFile(scope: !1244, file: !1193, discriminator: 0)
!1247 = !DILocation(line: 68, column: 18, scope: !1246)
!1248 = !DILocation(line: 68, column: 15, scope: !1246)
!1249 = !DILocation(line: 68, column: 8, scope: !1246)
!1250 = distinct !DISubprogram(name: "math::calculate_lpb_bonus.1", linkageName: "math::calculate_lpb_bonus.1", scope: null, file: !1193, line: 61, type: !5, scopeLine: 61, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1251 = !DILocation(line: 61, column: 4, scope: !1252)
!1252 = !DILexicalBlockFile(scope: !1250, file: !1193, discriminator: 0)
!1253 = !DILocation(line: 62, column: 7, scope: !1252)
!1254 = !DILocation(line: 62, column: 4, scope: !1252)
!1255 = !DILocation(line: 62, column: 23, scope: !1252)
!1256 = !DILocation(line: 67, column: 7, scope: !1252)
!1257 = !DILocation(line: 67, column: 4, scope: !1252)
!1258 = !DILocation(line: 67, column: 34, scope: !1252)
!1259 = !DILocation(line: 75, column: 9, scope: !1252)
!1260 = !DILocation(line: 76, column: 9, scope: !1252)
!1261 = !DILocation(line: 74, column: 4, scope: !1252)
!1262 = !DILocation(line: 79, column: 9, scope: !1252)
!1263 = !DILocation(line: 80, column: 9, scope: !1252)
!1264 = !DILocation(line: 81, column: 9, scope: !1252)
!1265 = !DILocation(line: 82, column: 9, scope: !1252)
!1266 = !DILocation(line: 78, column: 4, scope: !1252)
!1267 = !DILocation(line: 85, column: 9, scope: !1252)
!1268 = !DILocation(line: 86, column: 9, scope: !1252)
!1269 = !DILocation(line: 84, column: 4, scope: !1252)
!1270 = !DILocation(line: 88, column: 4, scope: !1252)
!1271 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.1", linkageName: "math::calculate_bpb_bonus.anon.1", scope: null, file: !1193, line: 102, type: !5, scopeLine: 102, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1272 = !DILocation(line: 102, column: 26, scope: !1273)
!1273 = !DILexicalBlockFile(scope: !1271, file: !1193, discriminator: 0)
!1274 = !DILocation(line: 103, column: 15, scope: !1273)
!1275 = !DILocation(line: 103, column: 8, scope: !1273)
!1276 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.2", linkageName: "math::calculate_bpb_bonus.anon.2", scope: null, file: !1193, line: 109, type: !5, scopeLine: 109, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1277 = !DILocation(line: 109, column: 37, scope: !1278)
!1278 = !DILexicalBlockFile(scope: !1276, file: !1193, discriminator: 0)
!1279 = !DILocation(line: 111, column: 15, scope: !1278)
!1280 = !DILocation(line: 111, column: 8, scope: !1278)
!1281 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.3", linkageName: "math::calculate_bpb_bonus.anon.3", scope: null, file: !1193, line: 120, type: !5, scopeLine: 120, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1282 = !DILocation(line: 120, column: 35, scope: !1283)
!1283 = !DILexicalBlockFile(scope: !1281, file: !1193, discriminator: 0)
!1284 = !DILocation(line: 121, column: 38, scope: !1283)
!1285 = !DILocation(line: 121, column: 22, scope: !1283)
!1286 = !DILocation(line: 121, column: 21, scope: !1283)
!1287 = !DILocation(line: 121, column: 8, scope: !1283)
!1288 = !DILocation(line: 122, column: 39, scope: !1283)
!1289 = !DILocation(line: 122, column: 26, scope: !1283)
!1290 = !DILocation(line: 122, column: 25, scope: !1283)
!1291 = !DILocation(line: 122, column: 8, scope: !1283)
!1292 = !DILocation(line: 123, column: 8, scope: !1283)
!1293 = !DILocation(line: 125, column: 19, scope: !1283)
!1294 = !DILocation(line: 125, column: 49, scope: !1283)
!1295 = !DILocation(line: 125, column: 43, scope: !1283)
!1296 = !DILocation(line: 126, column: 17, scope: !1283)
!1297 = !DILocation(line: 126, column: 47, scope: !1283)
!1298 = !DILocation(line: 126, column: 41, scope: !1283)
!1299 = !DILocation(line: 124, column: 22, scope: !1283)
!1300 = !DILocation(line: 127, column: 16, scope: !1283)
!1301 = !DILocation(line: 127, column: 10, scope: !1283)
!1302 = !DILocation(line: 124, column: 8, scope: !1283)
!1303 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.5", linkageName: "math::calculate_bpb_bonus.anon.5", scope: null, file: !1193, line: 133, type: !5, scopeLine: 133, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1304 = !DILocation(line: 133, column: 39, scope: !1305)
!1305 = !DILexicalBlockFile(scope: !1303, file: !1193, discriminator: 0)
!1306 = !DILocation(line: 134, column: 26, scope: !1305)
!1307 = !DILocation(line: 134, column: 25, scope: !1305)
!1308 = !DILocation(line: 134, column: 12, scope: !1305)
!1309 = !DILocation(line: 135, column: 30, scope: !1305)
!1310 = !DILocation(line: 135, column: 29, scope: !1305)
!1311 = !DILocation(line: 135, column: 12, scope: !1305)
!1312 = !DILocation(line: 136, column: 12, scope: !1305)
!1313 = !DILocation(line: 138, column: 23, scope: !1305)
!1314 = !DILocation(line: 138, column: 53, scope: !1305)
!1315 = !DILocation(line: 138, column: 47, scope: !1305)
!1316 = !DILocation(line: 139, column: 21, scope: !1305)
!1317 = !DILocation(line: 139, column: 51, scope: !1305)
!1318 = !DILocation(line: 139, column: 45, scope: !1305)
!1319 = !DILocation(line: 137, column: 26, scope: !1305)
!1320 = !DILocation(line: 140, column: 20, scope: !1305)
!1321 = !DILocation(line: 140, column: 14, scope: !1305)
!1322 = !DILocation(line: 137, column: 12, scope: !1305)
!1323 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.6", linkageName: "math::calculate_bpb_bonus.anon.6", scope: null, file: !1193, line: 141, type: !5, scopeLine: 141, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1324 = !DILocation(line: 141, column: 15, scope: !1325)
!1325 = !DILexicalBlockFile(scope: !1323, file: !1193, discriminator: 0)
!1326 = !DILocation(line: 143, column: 20, scope: !1325)
!1327 = !DILocation(line: 143, column: 12, scope: !1325)
!1328 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.4", linkageName: "math::calculate_bpb_bonus.anon.4", scope: null, file: !1193, line: 128, type: !5, scopeLine: 128, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1329 = !DILocation(line: 128, column: 11, scope: !1330)
!1330 = !DILexicalBlockFile(scope: !1328, file: !1193, discriminator: 0)
!1331 = !DILocation(line: 130, column: 22, scope: !1330)
!1332 = !DILocation(line: 130, column: 57, scope: !1330)
!1333 = !DILocation(line: 130, column: 51, scope: !1330)
!1334 = !DILocation(line: 130, column: 8, scope: !1330)
!1335 = !DILocation(line: 133, column: 11, scope: !1330)
!1336 = !DILocation(line: 133, column: 8, scope: !1330)
!1337 = !DILocation(line: 133, column: 39, scope: !1330)
!1338 = !DILocation(line: 141, column: 15, scope: !1330)
!1339 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.1", linkageName: "math::calculate_bpb_bonus.1", scope: null, file: !1193, line: 101, type: !5, scopeLine: 101, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1340 = !DILocation(line: 101, column: 4, scope: !1341)
!1341 = !DILexicalBlockFile(scope: !1339, file: !1193, discriminator: 0)
!1342 = !DILocation(line: 102, column: 7, scope: !1341)
!1343 = !DILocation(line: 102, column: 4, scope: !1341)
!1344 = !DILocation(line: 102, column: 26, scope: !1341)
!1345 = !DILocation(line: 107, column: 24, scope: !1341)
!1346 = !DILocation(line: 107, column: 4, scope: !1341)
!1347 = !DILocation(line: 109, column: 7, scope: !1341)
!1348 = !DILocation(line: 109, column: 4, scope: !1341)
!1349 = !DILocation(line: 109, column: 37, scope: !1341)
!1350 = !DILocation(line: 115, column: 26, scope: !1341)
!1351 = !DILocation(line: 115, column: 4, scope: !1341)
!1352 = !DILocation(line: 120, column: 7, scope: !1341)
!1353 = !DILocation(line: 120, column: 4, scope: !1341)
!1354 = !DILocation(line: 120, column: 35, scope: !1341)
!1355 = !DILocation(line: 128, column: 11, scope: !1341)
!1356 = !DILocation(line: 148, column: 32, scope: !1341)
!1357 = !DILocation(line: 148, column: 28, scope: !1341)
!1358 = !DILocation(line: 148, column: 4, scope: !1341)
!1359 = !DILocation(line: 149, column: 7, scope: !1341)
!1360 = !DILocation(line: 149, column: 46, scope: !1341)
!1361 = !DILocation(line: 149, column: 34, scope: !1341)
!1362 = !DILocation(line: 149, column: 4, scope: !1341)
!1363 = distinct !DISubprogram(name: "math::calculate_t_shares.3", linkageName: "math::calculate_t_shares.3", scope: null, file: !1193, line: 154, type: !5, scopeLine: 154, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1364 = !DILocation(line: 154, column: 4, scope: !1365)
!1365 = !DILexicalBlockFile(scope: !1363, file: !1193, discriminator: 0)
!1366 = !DILocation(line: 159, column: 4, scope: !1365)
!1367 = !DILocation(line: 161, column: 20, scope: !1365)
!1368 = !DILocation(line: 161, column: 4, scope: !1365)
!1369 = !DILocation(line: 162, column: 20, scope: !1365)
!1370 = !DILocation(line: 162, column: 4, scope: !1365)
!1371 = !DILocation(line: 166, column: 9, scope: !1365)
!1372 = !DILocation(line: 167, column: 9, scope: !1365)
!1373 = !DILocation(line: 168, column: 9, scope: !1365)
!1374 = !DILocation(line: 169, column: 9, scope: !1365)
!1375 = !DILocation(line: 165, column: 4, scope: !1365)
!1376 = !DILocation(line: 173, column: 22, scope: !1365)
!1377 = !DILocation(line: 173, column: 4, scope: !1365)
!1378 = !DILocation(line: 174, column: 26, scope: !1365)
!1379 = !DILocation(line: 174, column: 4, scope: !1365)
!1380 = !DILocation(line: 175, column: 26, scope: !1365)
!1381 = !DILocation(line: 175, column: 4, scope: !1365)
!1382 = !DILocation(line: 178, column: 9, scope: !1365)
!1383 = !DILocation(line: 179, column: 9, scope: !1365)
!1384 = !DILocation(line: 180, column: 9, scope: !1365)
!1385 = !DILocation(line: 181, column: 9, scope: !1365)
!1386 = !DILocation(line: 177, column: 4, scope: !1365)
!1387 = !DILocation(line: 184, column: 19, scope: !1365)
!1388 = !DILocation(line: 185, column: 9, scope: !1365)
!1389 = !DILocation(line: 184, column: 4, scope: !1365)
!1390 = !DILocation(line: 187, column: 4, scope: !1365)
!1391 = distinct !DISubprogram(name: "math::calculate_early_penalty.anon.1", linkageName: "math::calculate_early_penalty.anon.1", scope: null, file: !1193, line: 202, type: !5, scopeLine: 202, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1392 = !DILocation(line: 202, column: 32, scope: !1393)
!1393 = !DILexicalBlockFile(scope: !1391, file: !1193, discriminator: 0)
!1394 = !DILocation(line: 203, column: 15, scope: !1393)
!1395 = !DILocation(line: 203, column: 8, scope: !1393)
!1396 = distinct !DISubprogram(name: "math::calculate_early_penalty.anon.2", linkageName: "math::calculate_early_penalty.anon.2", scope: null, file: !1193, line: 227, type: !5, scopeLine: 227, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1397 = !DILocation(line: 227, column: 61, scope: !1398)
!1398 = !DILexicalBlockFile(scope: !1396, file: !1193, discriminator: 0)
!1399 = distinct !DISubprogram(name: "math::calculate_early_penalty.anon.3", linkageName: "math::calculate_early_penalty.anon.3", scope: null, file: !1193, line: 229, type: !5, scopeLine: 229, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1400 = !DILocation(line: 229, column: 11, scope: !1401)
!1401 = !DILexicalBlockFile(scope: !1399, file: !1193, discriminator: 0)
!1402 = distinct !DISubprogram(name: "math::calculate_early_penalty.4", linkageName: "math::calculate_early_penalty.4", scope: null, file: !1193, line: 195, type: !5, scopeLine: 195, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1403 = !DILocation(line: 195, column: 4, scope: !1404)
!1404 = !DILexicalBlockFile(scope: !1402, file: !1193, discriminator: 0)
!1405 = !DILocation(line: 202, column: 7, scope: !1404)
!1406 = !DILocation(line: 202, column: 4, scope: !1404)
!1407 = !DILocation(line: 202, column: 32, scope: !1404)
!1408 = !DILocation(line: 207, column: 9, scope: !1404)
!1409 = !DILocation(line: 208, column: 9, scope: !1404)
!1410 = !DILocation(line: 206, column: 4, scope: !1404)
!1411 = !DILocation(line: 211, column: 9, scope: !1404)
!1412 = !DILocation(line: 212, column: 9, scope: !1404)
!1413 = !DILocation(line: 210, column: 4, scope: !1404)
!1414 = !DILocation(line: 216, column: 9, scope: !1404)
!1415 = !DILocation(line: 217, column: 9, scope: !1404)
!1416 = !DILocation(line: 218, column: 9, scope: !1404)
!1417 = !DILocation(line: 219, column: 9, scope: !1404)
!1418 = !DILocation(line: 215, column: 4, scope: !1404)
!1419 = !DILocation(line: 223, column: 9, scope: !1404)
!1420 = !DILocation(line: 224, column: 9, scope: !1404)
!1421 = !DILocation(line: 222, column: 4, scope: !1404)
!1422 = !DILocation(line: 227, column: 31, scope: !1404)
!1423 = !DILocation(line: 227, column: 28, scope: !1404)
!1424 = !DILocation(line: 227, column: 61, scope: !1404)
!1425 = !DILocation(line: 229, column: 11, scope: !1404)
!1426 = !DILocation(line: 227, column: 4, scope: !1404)
!1427 = !DILocation(line: 234, column: 25, scope: !1404)
!1428 = !DILocation(line: 234, column: 4, scope: !1404)
!1429 = !DILocation(line: 236, column: 4, scope: !1404)
!1430 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.1", linkageName: "math::calculate_late_penalty.anon.1", scope: null, file: !1193, line: 253, type: !5, scopeLine: 253, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1431 = !DILocation(line: 253, column: 32, scope: !1432)
!1432 = !DILexicalBlockFile(scope: !1430, file: !1193, discriminator: 0)
!1433 = !DILocation(line: 254, column: 15, scope: !1432)
!1434 = !DILocation(line: 254, column: 8, scope: !1432)
!1435 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.2", linkageName: "math::calculate_late_penalty.anon.2", scope: null, file: !1193, line: 266, type: !5, scopeLine: 266, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1436 = !DILocation(line: 266, column: 38, scope: !1437)
!1437 = !DILexicalBlockFile(scope: !1435, file: !1193, discriminator: 0)
!1438 = !DILocation(line: 267, column: 15, scope: !1437)
!1439 = !DILocation(line: 267, column: 8, scope: !1437)
!1440 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.3", linkageName: "math::calculate_late_penalty.anon.3", scope: null, file: !1193, line: 278, type: !5, scopeLine: 278, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1441 = !DILocation(line: 278, column: 49, scope: !1442)
!1442 = !DILexicalBlockFile(scope: !1440, file: !1193, discriminator: 0)
!1443 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.4", linkageName: "math::calculate_late_penalty.anon.4", scope: null, file: !1193, line: 280, type: !5, scopeLine: 280, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1444 = !DILocation(line: 280, column: 11, scope: !1445)
!1445 = !DILexicalBlockFile(scope: !1443, file: !1193, discriminator: 0)
!1446 = distinct !DISubprogram(name: "math::calculate_late_penalty.4", linkageName: "math::calculate_late_penalty.4", scope: null, file: !1193, line: 246, type: !5, scopeLine: 246, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1447 = !DILocation(line: 246, column: 4, scope: !1448)
!1448 = !DILexicalBlockFile(scope: !1446, file: !1193, discriminator: 0)
!1449 = !DILocation(line: 253, column: 7, scope: !1448)
!1450 = !DILocation(line: 253, column: 4, scope: !1448)
!1451 = !DILocation(line: 253, column: 32, scope: !1448)
!1452 = !DILocation(line: 258, column: 9, scope: !1448)
!1453 = !DILocation(line: 259, column: 9, scope: !1448)
!1454 = !DILocation(line: 257, column: 4, scope: !1448)
!1455 = !DILocation(line: 262, column: 9, scope: !1448)
!1456 = !DILocation(line: 263, column: 9, scope: !1448)
!1457 = !DILocation(line: 261, column: 4, scope: !1448)
!1458 = !DILocation(line: 266, column: 7, scope: !1448)
!1459 = !DILocation(line: 266, column: 4, scope: !1448)
!1460 = !DILocation(line: 266, column: 38, scope: !1448)
!1461 = !DILocation(line: 271, column: 9, scope: !1448)
!1462 = !DILocation(line: 272, column: 9, scope: !1448)
!1463 = !DILocation(line: 270, column: 4, scope: !1448)
!1464 = !DILocation(line: 275, column: 22, scope: !1448)
!1465 = !DILocation(line: 275, column: 4, scope: !1448)
!1466 = !DILocation(line: 278, column: 24, scope: !1448)
!1467 = !DILocation(line: 278, column: 21, scope: !1448)
!1468 = !DILocation(line: 278, column: 49, scope: !1448)
!1469 = !DILocation(line: 280, column: 11, scope: !1448)
!1470 = !DILocation(line: 278, column: 4, scope: !1448)
!1471 = !DILocation(line: 285, column: 25, scope: !1448)
!1472 = !DILocation(line: 285, column: 4, scope: !1448)
!1473 = !DILocation(line: 287, column: 4, scope: !1448)
!1474 = distinct !DISubprogram(name: "math::calculate_pending_rewards.3", linkageName: "math::calculate_pending_rewards.3", scope: null, file: !1193, line: 294, type: !5, scopeLine: 294, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1475 = !DILocation(line: 294, column: 4, scope: !1476)
!1476 = !DILexicalBlockFile(scope: !1474, file: !1193, discriminator: 0)
!1477 = !DILocation(line: 299, column: 25, scope: !1476)
!1478 = !DILocation(line: 300, column: 21, scope: !1476)
!1479 = !DILocation(line: 300, column: 9, scope: !1476)
!1480 = !DILocation(line: 301, column: 15, scope: !1476)
!1481 = !DILocation(line: 301, column: 9, scope: !1476)
!1482 = !DILocation(line: 299, column: 4, scope: !1476)
!1483 = !DILocation(line: 304, column: 51, scope: !1476)
!1484 = !DILocation(line: 304, column: 36, scope: !1476)
!1485 = !DILocation(line: 304, column: 4, scope: !1476)
!1486 = !DILocation(line: 306, column: 4, scope: !1476)
!1487 = !DILocation(line: 306, column: 43, scope: !1476)
!1488 = !DILocation(line: 306, column: 31, scope: !1476)
!1489 = distinct !DISubprogram(name: "math::calculate_reward_debt.2", linkageName: "math::calculate_reward_debt.2", scope: null, file: !1193, line: 313, type: !5, scopeLine: 313, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1490 = !DILocation(line: 313, column: 4, scope: !1491)
!1491 = !DILexicalBlockFile(scope: !1489, file: !1193, discriminator: 0)
!1492 = !DILocation(line: 314, column: 18, scope: !1491)
!1493 = !DILocation(line: 315, column: 21, scope: !1491)
!1494 = !DILocation(line: 315, column: 9, scope: !1491)
!1495 = !DILocation(line: 316, column: 15, scope: !1491)
!1496 = !DILocation(line: 316, column: 9, scope: !1491)
!1497 = !DILocation(line: 314, column: 4, scope: !1491)
!1498 = !DILocation(line: 318, column: 4, scope: !1491)
!1499 = !DILocation(line: 318, column: 38, scope: !1491)
!1500 = !DILocation(line: 318, column: 26, scope: !1491)
!1501 = distinct !DISubprogram(name: "math::get_current_day.3", linkageName: "math::get_current_day.3", scope: null, file: !1193, line: 323, type: !5, scopeLine: 323, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1502 = !DILocation(line: 323, column: 4, scope: !1503)
!1503 = !DILexicalBlockFile(scope: !1501, file: !1193, discriminator: 0)
!1504 = !DILocation(line: 329, column: 9, scope: !1503)
!1505 = !DILocation(line: 330, column: 9, scope: !1503)
!1506 = !DILocation(line: 328, column: 4, scope: !1503)
!1507 = !DILocation(line: 333, column: 9, scope: !1503)
!1508 = !DILocation(line: 334, column: 9, scope: !1503)
!1509 = !DILocation(line: 332, column: 4, scope: !1503)
!1510 = !DILocation(line: 336, column: 4, scope: !1503)
!1511 = distinct !DISubprogram(name: "math::calculate_loyalty_bonus.anon.1", linkageName: "math::calculate_loyalty_bonus.anon.1", scope: null, file: !1193, line: 355, type: !5, scopeLine: 355, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1512 = !DILocation(line: 355, column: 49, scope: !1513)
!1513 = !DILexicalBlockFile(scope: !1511, file: !1193, discriminator: 0)
!1514 = !DILocation(line: 356, column: 15, scope: !1513)
!1515 = !DILocation(line: 356, column: 8, scope: !1513)
!1516 = distinct !DISubprogram(name: "math::calculate_loyalty_bonus.4", linkageName: "math::calculate_loyalty_bonus.4", scope: null, file: !1193, line: 349, type: !5, scopeLine: 349, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1517 = !DILocation(line: 349, column: 4, scope: !1518)
!1518 = !DILexicalBlockFile(scope: !1516, file: !1193, discriminator: 0)
!1519 = !DILocation(line: 355, column: 7, scope: !1518)
!1520 = !DILocation(line: 355, column: 30, scope: !1518)
!1521 = !DILocation(line: 355, column: 4, scope: !1518)
!1522 = !DILocation(line: 355, column: 49, scope: !1518)
!1523 = !DILocation(line: 359, column: 37, scope: !1518)
!1524 = !DILocation(line: 359, column: 4, scope: !1518)
!1525 = !DILocation(line: 361, column: 22, scope: !1518)
!1526 = !DILocation(line: 361, column: 4, scope: !1518)
!1527 = !DILocation(line: 364, column: 34, scope: !1518)
!1528 = !DILocation(line: 364, column: 4, scope: !1518)
!1529 = !DILocation(line: 367, column: 4, scope: !1518)
!1530 = distinct !DISubprogram(name: "sol.model.struct.anchor.AdminSetSlotsPerDay", linkageName: "sol.model.struct.anchor.AdminSetSlotsPerDay", scope: null, file: !1531, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1531 = !DIFile(filename: "programs/helix-staking/src/instructions/admin_set_slots_per_day.rs", directory: "/workspace")
!1532 = !DILocation(line: 11, column: 4, scope: !1533)
!1533 = !DILexicalBlockFile(scope: !1530, file: !1531, discriminator: 0)
!1534 = !DILocation(line: 12, column: 6, scope: !1533)
!1535 = !DILocation(line: 15, column: 8, scope: !1533)
!1536 = !DILocation(line: 17, column: 6, scope: !1533)
!1537 = !DILocation(line: 22, column: 8, scope: !1533)
!1538 = distinct !DISubprogram(name: "admin_set_slots_per_day::admin_set_slots_per_day.2", linkageName: "admin_set_slots_per_day::admin_set_slots_per_day.2", scope: null, file: !1531, line: 25, type: !5, scopeLine: 25, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1539 = !DILocation(line: 25, column: 4, scope: !1540)
!1540 = !DILexicalBlockFile(scope: !1538, file: !1531, discriminator: 0)
!1541 = !DILocation(line: 29, column: 4, scope: !1540)
!1542 = !DILocation(line: 36, column: 9, scope: !1540)
!1543 = !DILocation(line: 37, column: 9, scope: !1540)
!1544 = !DILocation(line: 35, column: 4, scope: !1540)
!1545 = !DILocation(line: 38, column: 4, scope: !1540)
!1546 = !DILocation(line: 43, column: 4, scope: !1540)
!1547 = !DILocation(line: 44, column: 4, scope: !1540)
!1548 = distinct !DISubprogram(name: "sol.model.struct.anchor.MigrateStake", linkageName: "sol.model.struct.anchor.MigrateStake", scope: null, file: !1549, line: 8, type: !5, scopeLine: 8, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1549 = !DIFile(filename: "programs/helix-staking/src/instructions/migrate_stake.rs", directory: "/workspace")
!1550 = !DILocation(line: 8, column: 4, scope: !1551)
!1551 = !DILexicalBlockFile(scope: !1548, file: !1549, discriminator: 0)
!1552 = !DILocation(line: 9, column: 6, scope: !1551)
!1553 = !DILocation(line: 10, column: 8, scope: !1551)
!1554 = !DILocation(line: 12, column: 6, scope: !1551)
!1555 = !DILocation(line: 27, column: 8, scope: !1551)
!1556 = !DILocation(line: 29, column: 8, scope: !1551)
!1557 = distinct !DISubprogram(name: "migrate_stake::migrate_stake.1", linkageName: "migrate_stake::migrate_stake.1", scope: null, file: !1549, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1558 = !DILocation(line: 32, column: 4, scope: !1559)
!1559 = !DILexicalBlockFile(scope: !1557, file: !1549, discriminator: 0)
!1560 = !DILocation(line: 33, column: 4, scope: !1559)
!1561 = distinct !DISubprogram(name: "sol.model.struct.anchor.InitializeClaimPeriod", linkageName: "sol.model.struct.anchor.InitializeClaimPeriod", scope: null, file: !1562, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1562 = !DIFile(filename: "programs/helix-staking/src/instructions/initialize_claim_period.rs", directory: "/workspace")
!1563 = !DILocation(line: 9, column: 4, scope: !1564)
!1564 = !DILexicalBlockFile(scope: !1561, file: !1562, discriminator: 0)
!1565 = !DILocation(line: 11, column: 6, scope: !1564)
!1566 = !DILocation(line: 15, column: 8, scope: !1564)
!1567 = !DILocation(line: 17, column: 6, scope: !1564)
!1568 = !DILocation(line: 21, column: 8, scope: !1564)
!1569 = !DILocation(line: 23, column: 6, scope: !1564)
!1570 = !DILocation(line: 30, column: 8, scope: !1564)
!1571 = !DILocation(line: 32, column: 8, scope: !1564)
!1572 = distinct !DISubprogram(name: "initialize_claim_period::initialize_claim_period.5", linkageName: "initialize_claim_period::initialize_claim_period.5", scope: null, file: !1562, line: 35, type: !5, scopeLine: 35, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1573 = !DILocation(line: 35, column: 4, scope: !1574)
!1574 = !DILexicalBlockFile(scope: !1572, file: !1562, discriminator: 0)
!1575 = !DILocation(line: 45, column: 4, scope: !1574)
!1576 = !DILocation(line: 47, column: 16, scope: !1574)
!1577 = !DILocation(line: 47, column: 4, scope: !1574)
!1578 = !DILocation(line: 48, column: 4, scope: !1574)
!1579 = !DILocation(line: 49, column: 4, scope: !1574)
!1580 = !DILocation(line: 55, column: 17, scope: !1574)
!1581 = !DILocation(line: 56, column: 17, scope: !1574)
!1582 = !DILocation(line: 53, column: 9, scope: !1574)
!1583 = !DILocation(line: 58, column: 9, scope: !1574)
!1584 = !DILocation(line: 52, column: 4, scope: !1574)
!1585 = !DILocation(line: 61, column: 52, scope: !1574)
!1586 = !DILocation(line: 61, column: 4, scope: !1574)
!1587 = !DILocation(line: 62, column: 4, scope: !1574)
!1588 = !DILocation(line: 63, column: 4, scope: !1574)
!1589 = !DILocation(line: 64, column: 4, scope: !1574)
!1590 = !DILocation(line: 65, column: 4, scope: !1574)
!1591 = !DILocation(line: 66, column: 4, scope: !1574)
!1592 = !DILocation(line: 67, column: 4, scope: !1574)
!1593 = !DILocation(line: 68, column: 4, scope: !1574)
!1594 = !DILocation(line: 69, column: 4, scope: !1574)
!1595 = !DILocation(line: 70, column: 4, scope: !1574)
!1596 = !DILocation(line: 71, column: 4, scope: !1574)
!1597 = !DILocation(line: 72, column: 4, scope: !1574)
!1598 = !DILocation(line: 73, column: 4, scope: !1574)
!1599 = !DILocation(line: 76, column: 4, scope: !1574)
!1600 = !DILocation(line: 77, column: 4, scope: !1574)
!1601 = !DILocation(line: 78, column: 4, scope: !1574)
!1602 = !DILocation(line: 79, column: 4, scope: !1574)
!1603 = !DILocation(line: 82, column: 4, scope: !1574)
!1604 = !DILocation(line: 83, column: 4, scope: !1574)
!1605 = !DILocation(line: 84, column: 4, scope: !1574)
!1606 = !DILocation(line: 87, column: 4, scope: !1574)
!1607 = !DILocation(line: 88, column: 4, scope: !1574)
!1608 = !DILocation(line: 91, column: 4, scope: !1574)
!1609 = !DILocation(line: 101, column: 4, scope: !1574)
!1610 = distinct !DISubprogram(name: "sol.model.struct.anchor.AdminMint", linkageName: "sol.model.struct.anchor.AdminMint", scope: null, file: !1611, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1611 = !DIFile(filename: "programs/helix-staking/src/instructions/admin_mint.rs", directory: "/workspace")
!1612 = !DILocation(line: 11, column: 4, scope: !1613)
!1613 = !DILexicalBlockFile(scope: !1610, file: !1611, discriminator: 0)
!1614 = !DILocation(line: 12, column: 6, scope: !1613)
!1615 = !DILocation(line: 13, column: 8, scope: !1613)
!1616 = !DILocation(line: 15, column: 6, scope: !1613)
!1617 = !DILocation(line: 21, column: 8, scope: !1613)
!1618 = !DILocation(line: 24, column: 6, scope: !1613)
!1619 = !DILocation(line: 28, column: 8, scope: !1613)
!1620 = !DILocation(line: 30, column: 6, scope: !1613)
!1621 = !DILocation(line: 35, column: 8, scope: !1613)
!1622 = !DILocation(line: 37, column: 6, scope: !1613)
!1623 = !DILocation(line: 41, column: 8, scope: !1613)
!1624 = !DILocation(line: 43, column: 8, scope: !1613)
!1625 = distinct !DISubprogram(name: "admin_mint::admin_mint.2", linkageName: "admin_mint::admin_mint.2", scope: null, file: !1611, line: 46, type: !5, scopeLine: 46, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1626 = !DILocation(line: 46, column: 4, scope: !1627)
!1627 = !DILexicalBlockFile(scope: !1625, file: !1611, discriminator: 0)
!1628 = !DILocation(line: 47, column: 4, scope: !1627)
!1629 = !DILocation(line: 51, column: 9, scope: !1627)
!1630 = !DILocation(line: 52, column: 15, scope: !1627)
!1631 = !DILocation(line: 52, column: 9, scope: !1627)
!1632 = !DILocation(line: 50, column: 4, scope: !1627)
!1633 = !DILocation(line: 53, column: 4, scope: !1627)
!1634 = !DILocation(line: 59, column: 4, scope: !1627)
!1635 = !DILocation(line: 62, column: 4, scope: !1627)
!1636 = !DILocation(line: 66, column: 4, scope: !1627)
!1637 = !DILocation(line: 71, column: 39, scope: !1627)
!1638 = !DILocation(line: 73, column: 40, scope: !1627)
!1639 = !DILocation(line: 73, column: 16, scope: !1627)
!1640 = !DILocation(line: 74, column: 57, scope: !1627)
!1641 = !DILocation(line: 74, column: 16, scope: !1627)
!1642 = !DILocation(line: 75, column: 55, scope: !1627)
!1643 = !DILocation(line: 75, column: 16, scope: !1627)
!1644 = !DILocation(line: 72, column: 12, scope: !1627)
!1645 = !DILocation(line: 70, column: 8, scope: !1627)
!1646 = !DILocation(line: 69, column: 4, scope: !1627)
!1647 = !DILocation(line: 83, column: 4, scope: !1627)
!1648 = !DILocation(line: 90, column: 4, scope: !1627)
!1649 = distinct !DISubprogram(name: "pda::validate_stake_pda.2", linkageName: "pda::validate_stake_pda.2", scope: null, file: !1650, line: 42, type: !5, scopeLine: 42, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1650 = !DIFile(filename: "programs/helix-staking/src/security/pda.rs", directory: "/workspace")
!1651 = !DILocation(line: 42, column: 4, scope: !1652)
!1652 = !DILexicalBlockFile(scope: !1649, file: !1650, discriminator: 0)
!1653 = !DILocation(line: 53, column: 9, scope: !1652)
!1654 = !DILocation(line: 47, column: 40, scope: !1652)
!1655 = !DILocation(line: 54, column: 12, scope: !1652)
!1656 = !DILocation(line: 54, column: 6, scope: !1652)
!1657 = !DILocation(line: 47, column: 4, scope: !1652)
!1658 = !DILocation(line: 57, column: 4, scope: !1652)
!1659 = !DILocation(line: 64, column: 4, scope: !1652)
!1660 = !DILocation(line: 70, column: 4, scope: !1652)
!1661 = distinct !DISubprogram(name: "lib::initialize.2", linkageName: "lib::initialize.2", scope: null, file: !1662, line: 23, type: !5, scopeLine: 23, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1662 = !DIFile(filename: "programs/helix-staking/src/lib.rs", directory: "/workspace")
!1663 = !DILocation(line: 23, column: 8, scope: !1664)
!1664 = !DILexicalBlockFile(scope: !1661, file: !1662, discriminator: 0)
!1665 = !DILocation(line: 24, column: 20, scope: !1664)
!1666 = !DILocation(line: 24, column: 8, scope: !1664)
!1667 = !DILocation(line: 25, column: 8, scope: !1664)
!1668 = !DILocation(line: 28, column: 8, scope: !1664)
!1669 = !DILocation(line: 31, column: 56, scope: !1664)
!1670 = !DILocation(line: 31, column: 8, scope: !1664)
!1671 = !DILocation(line: 32, column: 46, scope: !1664)
!1672 = !DILocation(line: 32, column: 8, scope: !1664)
!1673 = !DILocation(line: 33, column: 8, scope: !1664)
!1674 = !DILocation(line: 34, column: 8, scope: !1664)
!1675 = !DILocation(line: 35, column: 8, scope: !1664)
!1676 = !DILocation(line: 36, column: 8, scope: !1664)
!1677 = !DILocation(line: 37, column: 8, scope: !1664)
!1678 = !DILocation(line: 38, column: 8, scope: !1664)
!1679 = !DILocation(line: 39, column: 8, scope: !1664)
!1680 = !DILocation(line: 40, column: 8, scope: !1664)
!1681 = !DILocation(line: 41, column: 8, scope: !1664)
!1682 = !DILocation(line: 44, column: 8, scope: !1664)
!1683 = !DILocation(line: 45, column: 8, scope: !1664)
!1684 = !DILocation(line: 46, column: 8, scope: !1664)
!1685 = !DILocation(line: 47, column: 8, scope: !1664)
!1686 = !DILocation(line: 48, column: 8, scope: !1664)
!1687 = !DILocation(line: 49, column: 8, scope: !1664)
!1688 = !DILocation(line: 50, column: 8, scope: !1664)
!1689 = !DILocation(line: 51, column: 8, scope: !1664)
!1690 = !DILocation(line: 52, column: 8, scope: !1664)
!1691 = !DILocation(line: 53, column: 8, scope: !1664)
!1692 = !DILocation(line: 56, column: 8, scope: !1664)
!1693 = !DILocation(line: 68, column: 8, scope: !1664)
!1694 = distinct !DISubprogram(name: "lib::create_stake.3", linkageName: "lib::create_stake.3", scope: null, file: !1662, line: 71, type: !5, scopeLine: 71, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1695 = !DILocation(line: 71, column: 8, scope: !1696)
!1696 = !DILexicalBlockFile(scope: !1694, file: !1662, discriminator: 0)
!1697 = !DILocation(line: 76, column: 8, scope: !1696)
!1698 = distinct !DISubprogram(name: "lib::crank_distribution.1", linkageName: "lib::crank_distribution.1", scope: null, file: !1662, line: 79, type: !5, scopeLine: 79, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1699 = !DILocation(line: 79, column: 8, scope: !1700)
!1700 = !DILexicalBlockFile(scope: !1698, file: !1662, discriminator: 0)
!1701 = !DILocation(line: 80, column: 8, scope: !1700)
!1702 = distinct !DISubprogram(name: "lib::unstake.1", linkageName: "lib::unstake.1", scope: null, file: !1662, line: 83, type: !5, scopeLine: 83, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1703 = !DILocation(line: 83, column: 8, scope: !1704)
!1704 = !DILexicalBlockFile(scope: !1702, file: !1662, discriminator: 0)
!1705 = !DILocation(line: 84, column: 8, scope: !1704)
!1706 = distinct !DISubprogram(name: "lib::claim_rewards.1", linkageName: "lib::claim_rewards.1", scope: null, file: !1662, line: 87, type: !5, scopeLine: 87, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1707 = !DILocation(line: 87, column: 8, scope: !1708)
!1708 = !DILexicalBlockFile(scope: !1706, file: !1662, discriminator: 0)
!1709 = !DILocation(line: 88, column: 8, scope: !1708)
!1710 = distinct !DISubprogram(name: "lib::admin_mint.2", linkageName: "lib::admin_mint.2", scope: null, file: !1662, line: 91, type: !5, scopeLine: 91, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1711 = !DILocation(line: 91, column: 8, scope: !1712)
!1712 = !DILexicalBlockFile(scope: !1710, file: !1662, discriminator: 0)
!1713 = !DILocation(line: 92, column: 8, scope: !1712)
!1714 = distinct !DISubprogram(name: "lib::initialize_claim_period.5", linkageName: "lib::initialize_claim_period.5", scope: null, file: !1662, line: 95, type: !5, scopeLine: 95, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1715 = !DILocation(line: 95, column: 8, scope: !1716)
!1716 = !DILexicalBlockFile(scope: !1714, file: !1662, discriminator: 0)
!1717 = !DILocation(line: 102, column: 8, scope: !1716)
!1718 = distinct !DISubprogram(name: "lib::withdraw_vested.1", linkageName: "lib::withdraw_vested.1", scope: null, file: !1662, line: 111, type: !5, scopeLine: 111, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1719 = !DILocation(line: 111, column: 8, scope: !1720)
!1720 = !DILexicalBlockFile(scope: !1718, file: !1662, discriminator: 0)
!1721 = !DILocation(line: 112, column: 8, scope: !1720)
!1722 = distinct !DISubprogram(name: "lib::trigger_big_pay_day.1", linkageName: "lib::trigger_big_pay_day.1", scope: null, file: !1662, line: 115, type: !5, scopeLine: 115, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1723 = !DILocation(line: 115, column: 8, scope: !1724)
!1724 = !DILexicalBlockFile(scope: !1722, file: !1662, discriminator: 0)
!1725 = !DILocation(line: 118, column: 8, scope: !1724)
!1726 = distinct !DISubprogram(name: "lib::finalize_bpd_calculation.1", linkageName: "lib::finalize_bpd_calculation.1", scope: null, file: !1662, line: 121, type: !5, scopeLine: 121, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1727 = !DILocation(line: 121, column: 8, scope: !1728)
!1728 = !DILexicalBlockFile(scope: !1726, file: !1662, discriminator: 0)
!1729 = !DILocation(line: 124, column: 8, scope: !1728)
!1730 = distinct !DISubprogram(name: "lib::free_claim.3", linkageName: "lib::free_claim.3", scope: null, file: !1662, line: 127, type: !5, scopeLine: 127, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1731 = !DILocation(line: 127, column: 8, scope: !1732)
!1732 = !DILexicalBlockFile(scope: !1730, file: !1662, discriminator: 0)
!1733 = !DILocation(line: 132, column: 8, scope: !1732)
!1734 = distinct !DISubprogram(name: "lib::seal_bpd_finalize.2", linkageName: "lib::seal_bpd_finalize.2", scope: null, file: !1662, line: 135, type: !5, scopeLine: 135, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1735 = !DILocation(line: 135, column: 8, scope: !1736)
!1736 = !DILexicalBlockFile(scope: !1734, file: !1662, discriminator: 0)
!1737 = !DILocation(line: 136, column: 8, scope: !1736)
!1738 = distinct !DISubprogram(name: "lib::migrate_stake.1", linkageName: "lib::migrate_stake.1", scope: null, file: !1662, line: 139, type: !5, scopeLine: 139, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1739 = !DILocation(line: 139, column: 8, scope: !1740)
!1740 = !DILexicalBlockFile(scope: !1738, file: !1662, discriminator: 0)
!1741 = !DILocation(line: 140, column: 8, scope: !1740)
!1742 = distinct !DISubprogram(name: "lib::abort_bpd.1", linkageName: "lib::abort_bpd.1", scope: null, file: !1662, line: 143, type: !5, scopeLine: 143, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1743 = !DILocation(line: 143, column: 8, scope: !1744)
!1744 = !DILexicalBlockFile(scope: !1742, file: !1662, discriminator: 0)
!1745 = !DILocation(line: 144, column: 8, scope: !1744)
!1746 = distinct !DISubprogram(name: "lib::admin_set_claim_end_slot.2", linkageName: "lib::admin_set_claim_end_slot.2", scope: null, file: !1662, line: 147, type: !5, scopeLine: 147, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1747 = !DILocation(line: 147, column: 8, scope: !1748)
!1748 = !DILexicalBlockFile(scope: !1746, file: !1662, discriminator: 0)
!1749 = !DILocation(line: 151, column: 8, scope: !1748)
!1750 = distinct !DISubprogram(name: "lib::admin_set_slots_per_day.2", linkageName: "lib::admin_set_slots_per_day.2", scope: null, file: !1662, line: 154, type: !5, scopeLine: 154, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1751 = !DILocation(line: 154, column: 8, scope: !1752)
!1752 = !DILexicalBlockFile(scope: !1750, file: !1662, discriminator: 0)
!1753 = !DILocation(line: 158, column: 8, scope: !1752)
!1754 = distinct !DISubprogram(name: "lib::transfer_authority.2", linkageName: "lib::transfer_authority.2", scope: null, file: !1662, line: 161, type: !5, scopeLine: 161, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1755 = !DILocation(line: 161, column: 8, scope: !1756)
!1756 = !DILexicalBlockFile(scope: !1754, file: !1662, discriminator: 0)
!1757 = !DILocation(line: 162, column: 8, scope: !1756)
!1758 = distinct !DISubprogram(name: "lib::accept_authority.1", linkageName: "lib::accept_authority.1", scope: null, file: !1662, line: 165, type: !5, scopeLine: 165, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1759 = !DILocation(line: 165, column: 8, scope: !1760)
!1760 = !DILexicalBlockFile(scope: !1758, file: !1662, discriminator: 0)
!1761 = !DILocation(line: 166, column: 8, scope: !1760)
!1762 = distinct !DISubprogram(name: "sol.model.anchor.program.helix_staking", linkageName: "sol.model.anchor.program.helix_staking", scope: null, file: !1662, line: 19, type: !5, scopeLine: 19, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1763 = !DILocation(line: 19, scope: !1764)
!1764 = !DILexicalBlockFile(scope: !1762, file: !1662, discriminator: 0)
!1765 = !DILocation(line: 23, column: 4, scope: !1764)
!1766 = !DILocation(line: 71, column: 4, scope: !1764)
!1767 = !DILocation(line: 79, column: 4, scope: !1764)
!1768 = !DILocation(line: 83, column: 4, scope: !1764)
!1769 = !DILocation(line: 87, column: 4, scope: !1764)
!1770 = !DILocation(line: 91, column: 4, scope: !1764)
!1771 = !DILocation(line: 95, column: 4, scope: !1764)
!1772 = !DILocation(line: 111, column: 4, scope: !1764)
!1773 = !DILocation(line: 115, column: 4, scope: !1764)
!1774 = !DILocation(line: 121, column: 4, scope: !1764)
!1775 = !DILocation(line: 127, column: 4, scope: !1764)
!1776 = !DILocation(line: 135, column: 4, scope: !1764)
!1777 = !DILocation(line: 139, column: 4, scope: !1764)
!1778 = !DILocation(line: 143, column: 4, scope: !1764)
!1779 = !DILocation(line: 147, column: 4, scope: !1764)
!1780 = !DILocation(line: 154, column: 4, scope: !1764)
!1781 = !DILocation(line: 161, column: 4, scope: !1764)
!1782 = !DILocation(line: 165, column: 4, scope: !1764)
!1783 = distinct !DISubprogram(name: "main", linkageName: "main", scope: null, file: !1662, line: 19, type: !5, scopeLine: 19, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1784 = !DILocation(line: 19, scope: !1785)
!1785 = !DILexicalBlockFile(scope: !1783, file: !1662, discriminator: 0)
!1786 = distinct !DISubprogram(name: "sol.model.struct.InitializeParams", linkageName: "sol.model.struct.InitializeParams", scope: null, file: !1662, line: 171, type: !5, scopeLine: 171, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1787 = !DILocation(line: 171, column: 4, scope: !1788)
!1788 = !DILexicalBlockFile(scope: !1786, file: !1662, discriminator: 0)
!1789 = !DILocation(line: 172, column: 8, scope: !1788)
!1790 = !DILocation(line: 173, column: 8, scope: !1788)
!1791 = !DILocation(line: 174, column: 8, scope: !1788)
!1792 = !DILocation(line: 175, column: 8, scope: !1788)
!1793 = !DILocation(line: 176, column: 8, scope: !1788)
!1794 = !DILocation(line: 177, column: 8, scope: !1788)
!1795 = distinct !DISubprogram(name: "sol.model.struct.anchor.Initialize", linkageName: "sol.model.struct.anchor.Initialize", scope: null, file: !1662, line: 181, type: !5, scopeLine: 181, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1796 = !DILocation(line: 181, column: 4, scope: !1797)
!1797 = !DILexicalBlockFile(scope: !1795, file: !1662, discriminator: 0)
!1798 = !DILocation(line: 182, column: 6, scope: !1797)
!1799 = !DILocation(line: 183, column: 8, scope: !1797)
!1800 = !DILocation(line: 185, column: 6, scope: !1797)
!1801 = !DILocation(line: 192, column: 8, scope: !1797)
!1802 = !DILocation(line: 195, column: 6, scope: !1797)
!1803 = !DILocation(line: 199, column: 8, scope: !1797)
!1804 = !DILocation(line: 201, column: 6, scope: !1797)
!1805 = !DILocation(line: 210, column: 8, scope: !1797)
!1806 = !DILocation(line: 212, column: 8, scope: !1797)
!1807 = !DILocation(line: 213, column: 8, scope: !1797)
!1808 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimConfig", linkageName: "sol.model.struct.anchor.ClaimConfig", scope: null, file: !1809, line: 6, type: !5, scopeLine: 6, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1809 = !DIFile(filename: "programs/helix-staking/src/state/claim_config.rs", directory: "/workspace")
!1810 = !DILocation(line: 6, column: 4, scope: !1811)
!1811 = !DILexicalBlockFile(scope: !1808, file: !1809, discriminator: 0)
!1812 = !DILocation(line: 8, column: 8, scope: !1811)
!1813 = !DILocation(line: 10, column: 8, scope: !1811)
!1814 = !DILocation(line: 12, column: 8, scope: !1811)
!1815 = !DILocation(line: 14, column: 8, scope: !1811)
!1816 = !DILocation(line: 16, column: 8, scope: !1811)
!1817 = !DILocation(line: 18, column: 8, scope: !1811)
!1818 = !DILocation(line: 20, column: 8, scope: !1811)
!1819 = !DILocation(line: 22, column: 8, scope: !1811)
!1820 = !DILocation(line: 24, column: 8, scope: !1811)
!1821 = !DILocation(line: 26, column: 8, scope: !1811)
!1822 = !DILocation(line: 28, column: 8, scope: !1811)
!1823 = !DILocation(line: 30, column: 8, scope: !1811)
!1824 = !DILocation(line: 32, column: 8, scope: !1811)
!1825 = !DILocation(line: 37, column: 8, scope: !1811)
!1826 = !DILocation(line: 40, column: 8, scope: !1811)
!1827 = !DILocation(line: 42, column: 8, scope: !1811)
!1828 = !DILocation(line: 44, column: 8, scope: !1811)
!1829 = !DILocation(line: 46, column: 8, scope: !1811)
!1830 = !DILocation(line: 48, column: 8, scope: !1811)
!1831 = !DILocation(line: 50, column: 8, scope: !1811)
!1832 = !DILocation(line: 56, column: 8, scope: !1811)
!1833 = !DILocation(line: 59, column: 8, scope: !1811)
!1834 = distinct !DISubprogram(name: "sol.model.struct.anchor.StakeAccount", linkageName: "sol.model.struct.anchor.StakeAccount", scope: null, file: !1835, line: 4, type: !5, scopeLine: 4, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1835 = !DIFile(filename: "programs/helix-staking/src/state/stake_account.rs", directory: "/workspace")
!1836 = !DILocation(line: 4, column: 4, scope: !1837)
!1837 = !DILexicalBlockFile(scope: !1834, file: !1835, discriminator: 0)
!1838 = !DILocation(line: 6, column: 8, scope: !1837)
!1839 = !DILocation(line: 8, column: 8, scope: !1837)
!1840 = !DILocation(line: 10, column: 8, scope: !1837)
!1841 = !DILocation(line: 12, column: 8, scope: !1837)
!1842 = !DILocation(line: 14, column: 8, scope: !1837)
!1843 = !DILocation(line: 16, column: 8, scope: !1837)
!1844 = !DILocation(line: 18, column: 8, scope: !1837)
!1845 = !DILocation(line: 20, column: 8, scope: !1837)
!1846 = !DILocation(line: 22, column: 8, scope: !1837)
!1847 = !DILocation(line: 24, column: 8, scope: !1837)
!1848 = !DILocation(line: 26, column: 8, scope: !1837)
!1849 = !DILocation(line: 28, column: 8, scope: !1837)
!1850 = !DILocation(line: 30, column: 8, scope: !1837)
!1851 = !DILocation(line: 32, column: 8, scope: !1837)
!1852 = !DILocation(line: 34, column: 8, scope: !1837)
!1853 = distinct !DISubprogram(name: "sol.model.struct.anchor.PendingAuthority", linkageName: "sol.model.struct.anchor.PendingAuthority", scope: null, file: !1854, line: 4, type: !5, scopeLine: 4, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1854 = !DIFile(filename: "programs/helix-staking/src/state/pending_authority.rs", directory: "/workspace")
!1855 = !DILocation(line: 4, column: 4, scope: !1856)
!1856 = !DILexicalBlockFile(scope: !1853, file: !1854, discriminator: 0)
!1857 = !DILocation(line: 6, column: 8, scope: !1856)
!1858 = !DILocation(line: 8, column: 8, scope: !1856)
!1859 = distinct !DISubprogram(name: "sol.model.struct.anchor.GlobalState", linkageName: "sol.model.struct.anchor.GlobalState", scope: null, file: !1860, line: 4, type: !5, scopeLine: 4, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1860 = !DIFile(filename: "programs/helix-staking/src/state/global_state.rs", directory: "/workspace")
!1861 = !DILocation(line: 4, column: 4, scope: !1862)
!1862 = !DILexicalBlockFile(scope: !1859, file: !1860, discriminator: 0)
!1863 = !DILocation(line: 6, column: 8, scope: !1862)
!1864 = !DILocation(line: 8, column: 8, scope: !1862)
!1865 = !DILocation(line: 10, column: 8, scope: !1862)
!1866 = !DILocation(line: 12, column: 8, scope: !1862)
!1867 = !DILocation(line: 16, column: 8, scope: !1862)
!1868 = !DILocation(line: 18, column: 8, scope: !1862)
!1869 = !DILocation(line: 20, column: 8, scope: !1862)
!1870 = !DILocation(line: 22, column: 8, scope: !1862)
!1871 = !DILocation(line: 26, column: 8, scope: !1862)
!1872 = !DILocation(line: 28, column: 8, scope: !1862)
!1873 = !DILocation(line: 30, column: 8, scope: !1862)
!1874 = !DILocation(line: 34, column: 8, scope: !1862)
!1875 = !DILocation(line: 36, column: 8, scope: !1862)
!1876 = !DILocation(line: 38, column: 8, scope: !1862)
!1877 = !DILocation(line: 42, column: 8, scope: !1862)
!1878 = !DILocation(line: 44, column: 8, scope: !1862)
!1879 = !DILocation(line: 46, column: 8, scope: !1862)
!1880 = !DILocation(line: 48, column: 8, scope: !1862)
!1881 = !DILocation(line: 52, column: 8, scope: !1862)
!1882 = !DILocation(line: 54, column: 8, scope: !1862)
!1883 = !DILocation(line: 57, column: 8, scope: !1862)
!1884 = distinct !DISubprogram(name: "global_state::GlobalState::is_bpd_window_active.1", linkageName: "global_state::GlobalState::is_bpd_window_active.1", scope: null, file: !1860, line: 62, type: !5, scopeLine: 62, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1885 = !DILocation(line: 62, column: 8, scope: !1886)
!1886 = !DILexicalBlockFile(scope: !1884, file: !1860, discriminator: 0)
!1887 = !DILocation(line: 63, column: 8, scope: !1886)
!1888 = distinct !DISubprogram(name: "global_state::GlobalState::set_bpd_window_active.anon.1", linkageName: "global_state::GlobalState::set_bpd_window_active.anon.1", scope: null, file: !1860, line: 68, type: !5, scopeLine: 68, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1889 = !DILocation(line: 68, column: 37, scope: !1890)
!1890 = !DILexicalBlockFile(scope: !1888, file: !1860, discriminator: 0)
!1891 = distinct !DISubprogram(name: "global_state::GlobalState::set_bpd_window_active.anon.2", linkageName: "global_state::GlobalState::set_bpd_window_active.anon.2", scope: null, file: !1860, line: 68, type: !5, scopeLine: 68, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1892 = !DILocation(line: 68, column: 48, scope: !1893)
!1893 = !DILexicalBlockFile(scope: !1891, file: !1860, discriminator: 0)
!1894 = distinct !DISubprogram(name: "global_state::GlobalState::set_bpd_window_active.2", linkageName: "global_state::GlobalState::set_bpd_window_active.2", scope: null, file: !1860, line: 67, type: !5, scopeLine: 67, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1895 = !DILocation(line: 67, column: 8, scope: !1896)
!1896 = !DILexicalBlockFile(scope: !1894, file: !1860, discriminator: 0)
!1897 = !DILocation(line: 68, column: 27, scope: !1896)
!1898 = !DILocation(line: 68, column: 37, scope: !1896)
!1899 = !DILocation(line: 68, column: 48, scope: !1896)
!1900 = !DILocation(line: 68, column: 8, scope: !1896)
!1901 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimStatus", linkageName: "sol.model.struct.anchor.ClaimStatus", scope: null, file: !1902, line: 7, type: !5, scopeLine: 7, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1902 = !DIFile(filename: "programs/helix-staking/src/state/claim_status.rs", directory: "/workspace")
!1903 = !DILocation(line: 7, column: 4, scope: !1904)
!1904 = !DILexicalBlockFile(scope: !1901, file: !1902, discriminator: 0)
!1905 = !DILocation(line: 9, column: 8, scope: !1904)
!1906 = !DILocation(line: 11, column: 8, scope: !1904)
!1907 = !DILocation(line: 13, column: 8, scope: !1904)
!1908 = !DILocation(line: 15, column: 8, scope: !1904)
!1909 = !DILocation(line: 17, column: 8, scope: !1904)
!1910 = !DILocation(line: 19, column: 8, scope: !1904)
!1911 = !DILocation(line: 21, column: 8, scope: !1904)
!1912 = !DILocation(line: 23, column: 8, scope: !1904)
