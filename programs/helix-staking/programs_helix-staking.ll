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
@InitializeParams = internal constant [16 x i8] c"InitializeParams"
@params = internal constant [6 x i8] c"params"
@"Context<Initialize>" = internal constant [19 x i8] c"Context<Initialize>"
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
@"mut,seeds=[STAKE_SEED,stake_account.user.as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,realloc=StakeAccount::LEN,realloc::payer=payer,realloc::zero=false," = internal constant [180 x i8] c"mut,seeds=[STAKE_SEED,stake_account.user.as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,realloc=StakeAccount::LEN,realloc::payer=payer,realloc::zero=false,"
@payer = internal constant [5 x i8] c"payer"
@ctx.accounts.global_state.slots_per_day = internal constant [39 x i8] c"ctx.accounts.global_state.slots_per_day"
@"new_slots_per_day>0" = internal constant [19 x i8] c"new_slots_per_day>0"
@new_slots_per_day = internal constant [17 x i8] c"new_slots_per_day"
@"Context<AdminSetSlotsPerDay>" = internal constant [28 x i8] c"Context<AdminSetSlotsPerDay>"
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
@total_multiplier = internal constant [16 x i8] c"total_multiplier"
@bpb_bonus = internal constant [9 x i8] c"bpb_bonus"
@lpb_bonus = internal constant [9 x i8] c"lpb_bonus"
@"HelixError::InvalidParameter" = internal constant [28 x i8] c"HelixError::InvalidParameter"
@"share_rate>0" = internal constant [12 x i8] c"share_rate>0"
@share_rate = internal constant [10 x i8] c"share_rate"
@BPB_THRESHOLD = internal constant [13 x i8] c"BPB_THRESHOLD"
@amount_div_10 = internal constant [13 x i8] c"amount_div_10"
@days_minus_one = internal constant [14 x i8] c"days_minus_one"
@LPB_MAX_DAYS = internal constant [12 x i8] c"LPB_MAX_DAYS"
@stake_days = internal constant [10 x i8] c"stake_days"
@"2" = internal constant [1 x i8] c"2"
@numerator = internal constant [9 x i8] c"numerator"
@result = internal constant [6 x i8] c"result"
@"c>0" = internal constant [3 x i8] c"c>0"
@c = internal constant [1 x i8] c"c"
@b = internal constant [1 x i8] c"b"
@a = internal constant [1 x i8] c"a"
@"user:stake_user,stake_id,original_amount:staked_amount,return_amount,penalty_amount:penalty,penalty_type,rewards_claimed:pending_rewards.checked_add(bpd_bonus).unwrap_or(pending_rewards),}" = internal constant [188 x i8] c"user:stake_user,stake_id,original_amount:staked_amount,return_amount,penalty_amount:penalty,penalty_type,rewards_claimed:pending_rewards.checked_add(bpd_bonus).unwrap_or(pending_rewards),}"
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
@"HelixError::BpdWindowNotActive" = internal constant [30 x i8] c"HelixError::BpdWindowNotActive"
@"global_state.is_bpd_window_active()" = internal constant [35 x i8] c"global_state.is_bpd_window_active()"
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
@"HelixError::NoRewardsToClaim" = internal constant [28 x i8] c"HelixError::NoRewardsToClaim"
@"total_rewards>0" = internal constant [15 x i8] c"total_rewards>0"
@total_rewards = internal constant [13 x i8] c"total_rewards"
@bpd_bonus = internal constant [9 x i8] c"bpd_bonus"
@pending_rewards = internal constant [15 x i8] c"pending_rewards"
@stake.reward_debt = internal constant [17 x i8] c"stake.reward_debt"
@stake.user = internal constant [10 x i8] c"stake.user"
@stake_id = internal constant [8 x i8] c"stake_id"
@stake.stake_id = internal constant [14 x i8] c"stake.stake_id"
@"Context<ClaimRewards>" = internal constant [21 x i8] c"Context<ClaimRewards>"
@stake_mut.bpd_bonus_pending = internal constant [27 x i8] c"stake_mut.bpd_bonus_pending"
@"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program," = internal constant [111 x i8] c"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,"
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
@"mut,constraint=user_token_account.mint==global_state.mint@HelixError::InvalidParameter,constraint=user_token_account.owner==user.key()@HelixError::InvalidParameter," = internal constant [164 x i8] c"mut,constraint=user_token_account.mint==global_state.mint@HelixError::InvalidParameter,constraint=user_token_account.owner==user.key()@HelixError::InvalidParameter,"
@"Account<'info,StakeAccount>" = internal constant [27 x i8] c"Account<'info,StakeAccount>"
@stake_account = internal constant [13 x i8] c"stake_account"
@"init,payer=user,space=StakeAccount::LEN,seeds=[STAKE_SEED,user.key().as_ref(),&global_state.total_stakes_created.to_le_bytes()],bump," = internal constant [133 x i8] c"init,payer=user,space=StakeAccount::LEN,seeds=[STAKE_SEED,user.key().as_ref(),&global_state.total_stakes_created.to_le_bytes()],bump,"
@user = internal constant [4 x i8] c"user"
@"finalize_bpd_calculation::finalize_bpd_calculation.anon.4.2" = internal constant [57 x i8] c"finalize_bpd_calculation::finalize_bpd_calculation.anon.4"
@unclaimed_amount = internal constant [16 x i8] c"unclaimed_amount"
@is_first_batch = internal constant [14 x i8] c"is_first_batch"
@claim_config.bpd_total_share_days = internal constant [33 x i8] c"claim_config.bpd_total_share_days"
@"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>" = internal constant [56 x i8] c"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>"
@batch_share_days = internal constant [16 x i8] c"batch_share_days"
@MAX_STAKES_PER_FINALIZE = internal constant [23 x i8] c"MAX_STAKES_PER_FINALIZE"
@claim_config.bpd_calculation_complete = internal constant [37 x i8] c"claim_config.bpd_calculation_complete"
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
@claim_config.bpd_snapshot_slot = internal constant [30 x i8] c"claim_config.bpd_snapshot_slot"
@claim_config.bpd_helix_per_share_day = internal constant [36 x i8] c"claim_config.bpd_helix_per_share_day"
@"HelixError::BigPayDayNotAvailable" = internal constant [33 x i8] c"HelixError::BigPayDayNotAvailable"
@"clock.slot>claim_config.end_slot" = internal constant [32 x i8] c"clock.slot>claim_config.end_slot"
@ctx.accounts.claim_config = internal constant [25 x i8] c"ctx.accounts.claim_config"
@"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>" = internal constant [50 x i8] c"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>"
@claim_config.bpd_remaining_unclaimed = internal constant [36 x i8] c"claim_config.bpd_remaining_unclaimed"
@batch_stakes_distributed = internal constant [24 x i8] c"batch_stakes_distributed"
@batch_distributed = internal constant [17 x i8] c"batch_distributed"
@stake.bpd_bonus_pending = internal constant [23 x i8] c"stake.bpd_bonus_pending"
@bonus = internal constant [5 x i8] c"bonus"
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
@expected_pda = internal constant [12 x i8] c"expected_pda"
@"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),&[stake.bump],]" = internal constant [77 x i8] c"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),&[stake.bump],]"
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

declare i8* @"sol.model.struct.new.token_2022::MintTo.3"(i8*, i8*, i8*)

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

declare i8* @"sol.math::calculate_bpb_bonus.anon.2"(i8*)

declare i8* @"sol.math::calculate_bpb_bonus.anon.1"(i8*)

declare i8* @"sol.math::calculate_lpb_bonus.anon.2"(i8*)

declare i8* @"sol.math::calculate_lpb_bonus.anon.1"(i8*)

declare i8* @"sol.*"(i8*, i8*)

declare i8* @"sol.unstake::unstake.anon.6"(i8*)

declare i8* @"sol.unstake::unstake.anon.5"(i8*)

declare i8* @"sol.unstake::unstake.anon.2"(i8*)

declare i8* @"sol.unstake::unstake.anon.1"(i8*)

declare i8* @"sol.unstake::unstake.anon.4"(i8*)

declare i8* @"sol.unstake::unstake.anon.3"(i8*)

declare i8* @sol.calculate_late_penalty.4(i8*, i8*, i8*, i8*)

declare i8* @sol.calculate_early_penalty.4(i8*, i8*, i8*, i8*)

declare i8* @"sol.transfer_authority::transfer_authority.anon.1"(i8*)

declare i8* @"sol.Pubkey::default.0"()

declare i8* @"sol.seal_bpd_finalize::seal_bpd_finalize.anon.1"(i8*)

declare i8* @sol.ifTrueFalse.anon.(i8*, i8*)

declare i8* @"sol.free_claim::calculate_speed_bonus.anon.3"(i8*)

declare i8* @"sol.free_claim::calculate_speed_bonus.anon.2"(i8*)

declare i8* @"sol.free_claim::calculate_speed_bonus.anon.1"(i8*)

declare i8* @"sol./"(i8*, i8*)

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

declare i8* @"sol.claim_rewards::claim_rewards.anon.1"(i8*)

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

declare i8* @sol.map_err.2(i8*, i8*)

declare i8* @"sol.model.macro.error.!1"(i8*)

declare i8* @"sol.u64::try_from.1"(i8*)

declare i8* @sol.try_serialize.2(i8*, i8*)

declare i8* @sol.try_borrow_mut_data.1(i8*)

declare i8* @"sol.StakeAccount::try_deserialize.1"(i8*)

declare i8* @sol.push.2(i8*, i8*)

declare i8* @sol.checked_mul.2(i8*, i8*)

declare i8* @sol.typecast(i8*, i8*)

declare i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.12"(i8*)

declare i8* @sol.unwrap_or.2(i8*, i8*)

declare i8* @sol.checked_div.2(i8*, i8*)

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

declare i8* @"sol.||"(i8*, i8*)

declare i8* @sol.unwrap.1(i8*)

declare i8* @sol.key.1(i8*)

declare i8* @sol.is_err.1(i8*)

declare i8* @"sol.Pubkey::create_program_address.2"(i8*, i8*)

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
  %20 = call i8* @"sol.crate::id.0"(), !dbg !132
  %21 = call i8* @"sol.Pubkey::create_program_address.2"(i8* getelementptr inbounds ([77 x i8], [77 x i8]* @"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),&[stake.bump],]", i64 0, i64 0), i8* %20), !dbg !133
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0), i8* %21), !dbg !134
  %22 = call i8* @sol.is_err.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0)), !dbg !135
  %23 = call i8* @sol.key.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !136
  %24 = call i8* @sol.unwrap.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0)), !dbg !137
  %25 = call i8* @"sol.!="(i8* %23, i8* %24), !dbg !138
  %26 = call i8* @"sol.||"(i8* %22, i8* %25), !dbg !139
  %27 = call i8* @sol.if(i8* %26), !dbg !140
  %28 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.6"(i8* %27), !dbg !141
  %29 = call i8* @sol.ifTrue.anon.(i8* %28), !dbg !141
  %30 = call i8* @"sol.=="(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake.bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !142
  %31 = call i8* @sol.if(i8* %30), !dbg !143
  %32 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.7"(i8* %31), !dbg !144
  %33 = call i8* @sol.ifTrue.anon.(i8* %32), !dbg !144
  %34 = call i8* @"sol.!="(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @stake.bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !145
  %35 = call i8* @sol.if(i8* %34), !dbg !146
  %36 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.8"(i8* %35), !dbg !147
  %37 = call i8* @sol.ifTrue.anon.(i8* %36), !dbg !147
  %38 = call i8* @"sol.!"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @stake.is_active, i64 0, i64 0)), !dbg !148
  %39 = call i8* @sol.if(i8* %38), !dbg !149
  %40 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.9"(i8* %39), !dbg !150
  %41 = call i8* @sol.ifTrue.anon.(i8* %40), !dbg !150
  %42 = call i8* @"sol.<"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0)), !dbg !151
  %43 = call i8* @sol.if(i8* %42), !dbg !152
  %44 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.10"(i8* %43), !dbg !153
  %45 = call i8* @sol.ifTrue.anon.(i8* %44), !dbg !153
  %46 = call i8* @"sol.>"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0)), !dbg !154
  %47 = call i8* @sol.if(i8* %46), !dbg !155
  %48 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.11"(i8* %47), !dbg !156
  %49 = call i8* @sol.ifTrue.anon.(i8* %48), !dbg !156
  %50 = call i8* @"sol.std::cmp::min.2"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.end_slot, i64 0, i64 0)), !dbg !157
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* %50), !dbg !158
  %51 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0)), !dbg !159
  %52 = call i8* @sol.checked_div.2(i8* %51, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !160
  %53 = call i8* @sol.unwrap_or.2(i8* %52, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !161
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* %53), !dbg !162
  %54 = call i8* @"sol.=="(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !163
  %55 = call i8* @sol.if(i8* %54), !dbg !164
  %56 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.12"(i8* %55), !dbg !165
  %57 = call i8* @sol.ifTrue.anon.(i8* %56), !dbg !165
  %58 = call i8* @sol.typecast(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !166
  %59 = call i8* @sol.typecast(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !167
  %60 = call i8* @sol.checked_mul.2(i8* %58, i8* %59), !dbg !168
  %61 = call i8* @sol.ok_or.2(i8* %60, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !169
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0), i8* %61), !dbg !170
  %62 = call i8* @sol.push.2(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @eligible_stakes, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"i,share_days", i64 0, i64 0)), !dbg !171
  ret i8* %0, !dbg !114
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.13"(i8* %0) !dbg !172 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !173
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !175
  %4 = call i8* @sol.return.1(i8* %3), !dbg !176
  ret i8* %0, !dbg !173
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.15"(i8* %0) !dbg !177 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !178
  %3 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !180
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !181
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* %4), !dbg !182
  %5 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !183
  %6 = call i8* @"sol.StakeAccount::try_deserialize.1"(i8* %5), !dbg !184
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %6), !dbg !185
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake.bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !186
  %7 = call i8* @sol.try_borrow_mut_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !187
  %8 = call i8* @sol.try_serialize.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %7), !dbg !188
  ret i8* %0, !dbg !178
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.14"(i8* %0) !dbg !189 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !190
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.remaining_accounts, i64 0, i64 0)), !dbg !192
  %3 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0)), !dbg !193
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !194
  %5 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !195
  %6 = call i8* @sol.checked_div.2(i8* %4, i8* %5), !dbg !196
  %7 = call i8* @sol.ok_or.2(i8* %6, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !197
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @bonus_u128, i64 0, i64 0), i8* %7), !dbg !198
  %8 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @bonus_u128, i64 0, i64 0)), !dbg !199
  %9 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !200
  %10 = call i8* @sol.map_err.2(i8* %8, i8* %9), !dbg !201
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %10), !dbg !202
  %11 = call i8* @"sol.=="(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !203
  %12 = call i8* @sol.if(i8* %11), !dbg !204
  %13 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.15"(i8* %12), !dbg !205
  %14 = call i8* @sol.ifTrue.anon.(i8* %13), !dbg !205
  %15 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !206
  %16 = call i8* @"sol.StakeAccount::try_deserialize.1"(i8* %15), !dbg !207
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %16), !dbg !208
  %17 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !209
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !210
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0), i8* %18), !dbg !211
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake.bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !212
  %19 = call i8* @sol.try_borrow_mut_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !213
  %20 = call i8* @sol.try_serialize.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %19), !dbg !214
  %21 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !215
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !216
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0), i8* %22), !dbg !217
  %23 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !218
  %24 = call i8* @sol.ok_or.2(i8* %23, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !219
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0), i8* %24), !dbg !220
  ret i8* %0, !dbg !190
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.anon.16"(i8* %0) !dbg !221 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !222
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !224
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !225
  %3 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !226
  %4 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"ClaimPeriodEnded{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([175 x i8], [175 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_claimed:claim_config.total_claimed,claims_count:claim_config.claim_count,unclaimed_amount:0,}", i64 0, i64 0)), !dbg !227
  ret i8* %0, !dbg !222
}

define i8* @"trigger_big_pay_day::trigger_big_pay_day.1"(i8* %0) !dbg !228 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([50 x i8], [50 x i8]* @"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>", i64 0, i64 0)), !dbg !229
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !231
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !232
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !233
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !234
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"clock.slot>claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::BigPayDayNotAvailable", i64 0, i64 0)), !dbg !235
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0)), !dbg !236
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0)), !dbg !237
  %5 = call i8* @"sol.=="(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !238
  %6 = call i8* @sol.if(i8* %5), !dbg !239
  %7 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.1"(i8* %6), !dbg !240
  %8 = call i8* @sol.ifTrue.anon.(i8* %7), !dbg !240
  %9 = call i8* @"sol.Vec::new.0"(), !dbg !241
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @eligible_stakes, i64 0, i64 0), i8* %9), !dbg !242
  %10 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([47 x i8], [47 x i8]* @"trigger_big_pay_day::trigger_big_pay_day.anon.2.4", i64 0, i64 0)), !dbg !243
  %11 = call i8* @sol.is_empty.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @eligible_stakes, i64 0, i64 0)), !dbg !244
  %12 = call i8* @sol.if(i8* %11), !dbg !245
  %13 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.13"(i8* %12), !dbg !246
  %14 = call i8* @sol.ifTrue.anon.(i8* %13), !dbg !246
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !247
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !248
  %15 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([48 x i8], [48 x i8]* @"trigger_big_pay_day::trigger_big_pay_day.anon.14.3", i64 0, i64 0)), !dbg !249
  %16 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @claim_config.bpd_total_distributed, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0)), !dbg !250
  %17 = call i8* @sol.ok_or.2(i8* %16, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !251
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @claim_config.bpd_total_distributed, i64 0, i64 0), i8* %17), !dbg !252
  %18 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @batch_stakes_distributed, i64 0, i64 0)), !dbg !253
  %19 = call i8* @sol.ok_or.2(i8* %18, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !254
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* %19), !dbg !255
  %20 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @batch_distributed, i64 0, i64 0)), !dbg !256
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"HelixError::BpdOverDistribution", i64 0, i64 0)), !dbg !257
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* %21), !dbg !258
  %22 = call i8* @"sol.>="(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0)), !dbg !259
  %23 = call i8* @sol.if(i8* %22), !dbg !260
  %24 = call i8* @"sol.trigger_big_pay_day::trigger_big_pay_day.anon.16"(i8* %23), !dbg !261
  %25 = call i8* @sol.ifTrue.anon.(i8* %24), !dbg !261
  %26 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"BigPayDayDistributed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([324 x i8], [324 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id:claim_config.claim_period_id,total_unclaimed:claim_config.bpd_remaining_unclaimed,total_eligible_share_days:claim_config.bpd_total_share_days.min(u64::MAXasu128)asu64,helix_per_share_day:helix_per_share_day.min(u64::MAXasu128)asu64,eligible_stakers:eligible_stakes.len()asu32,}", i64 0, i64 0)), !dbg !262
  %27 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !263
  ret i8* %0, !dbg !229
}

define i8* @sol.model.struct.anchor.WithdrawVested(i8* %0) !dbg !264 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !266
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !268
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @claimer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !269
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !270
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !271
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,", i64 0, i64 0)), !dbg !272
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !273
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([292 x i8], [292 x i8]* @"mut,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],claim_status.snapshot_wallet.as_ref()],bump=claim_status.bump,constraint=claim_status.is_claimed@HelixError::ClaimPeriodNotStarted,constraint=claim_status.snapshot_wallet==claimer.key()@HelixError::Unauthorized,", i64 0, i64 0)), !dbg !274
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimStatus>", i64 0, i64 0)), !dbg !275
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([114 x i8], [114 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=claimer,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !276
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claimer_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !277
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !278
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !279
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !280
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !281
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !282
  ret i8* %0, !dbg !266
}

define i8* @"withdraw_vested::withdraw_vested.1"(i8* %0) !dbg !283 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"Context<WithdrawVested>", i64 0, i64 0)), !dbg !284
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !286
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !287
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_status, i64 0, i64 0)), !dbg !288
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !289
  %4 = call i8* @sol.calculate_vested_amount.4(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @claim_status.claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @claim_status.claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !290
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_vested, i64 0, i64 0), i8* %4), !dbg !291
  %5 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_vested, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0)), !dbg !292
  %6 = call i8* @sol.ok_or.2(i8* %5, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !293
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @available, i64 0, i64 0), i8* %6), !dbg !294
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @"available>0", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::NoVestedTokens", i64 0, i64 0)), !dbg !295
  %8 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @available, i64 0, i64 0)), !dbg !296
  %9 = call i8* @sol.ok_or.2(i8* %8, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !297
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_withdrawn, i64 0, i64 0), i8* %9), !dbg !298
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_withdrawn, i64 0, i64 0)), !dbg !299
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !300
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !301
  %10 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !302
  %11 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !303
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %11), !dbg !304
  %12 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @ctx.accounts.claimer_token_account, i64 0, i64 0)), !dbg !305
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %12), !dbg !306
  %13 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !307
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %13), !dbg !308
  %14 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !309
  %15 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %10, i8* %14, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !310
  %16 = call i8* @"sol.token_2022::mint_to.2"(i8* %15, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @available, i64 0, i64 0)), !dbg !311
  %17 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"VestedTokensWithdrawn{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([195 x i8], [195 x i8]* @"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),amount:available,total_vested,total_withdrawn:new_withdrawn,remaining:claim_status.claimed_amount.saturating_sub(new_withdrawn),}", i64 0, i64 0)), !dbg !312
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !313
  ret i8* %0, !dbg !284
}

define i8* @"withdraw_vested::calculate_vested_amount.anon.1"(i8* %0) !dbg !314 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !315
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @claimed_amount, i64 0, i64 0)), !dbg !317
  %4 = call i8* @sol.return.1(i8* %3), !dbg !318
  ret i8* %0, !dbg !315
}

define i8* @"withdraw_vested::calculate_vested_amount.anon.2"(i8* %0) !dbg !319 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !320
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0)), !dbg !322
  %4 = call i8* @sol.return.1(i8* %3), !dbg !323
  ret i8* %0, !dbg !320
}

define i8* @"withdraw_vested::calculate_vested_amount.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !324 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !325
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !325
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !325
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !325
  %9 = call i8* @sol.mul_div.3(i8* %0, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @IMMEDIATE_RELEASE_BPS, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !327
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0), i8* %9), !dbg !328
  %10 = call i8* @"sol.>="(i8* %3, i8* %2), !dbg !329
  %11 = call i8* @sol.if(i8* %10), !dbg !330
  %12 = call i8* @"sol.withdraw_vested::calculate_vested_amount.anon.1"(i8* %11), !dbg !331
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !331
  %14 = call i8* @"sol.<="(i8* %3, i8* %1), !dbg !332
  %15 = call i8* @sol.if(i8* %14), !dbg !333
  %16 = call i8* @"sol.withdraw_vested::calculate_vested_amount.anon.2"(i8* %15), !dbg !334
  %17 = call i8* @sol.ifTrue.anon.(i8* %16), !dbg !334
  %18 = call i8* @sol.checked_sub.2(i8* %2, i8* %1), !dbg !335
  %19 = call i8* @sol.ok_or.2(i8* %18, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !336
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_duration, i64 0, i64 0), i8* %19), !dbg !337
  %20 = call i8* @sol.checked_sub.2(i8* %3, i8* %1), !dbg !338
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !339
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %21), !dbg !340
  %22 = call i8* @sol.checked_sub.2(i8* %0, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0)), !dbg !341
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !342
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @vesting_portion, i64 0, i64 0), i8* %23), !dbg !343
  %24 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @vesting_portion, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_duration, i64 0, i64 0)), !dbg !344
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unlocked_vesting, i64 0, i64 0), i8* %24), !dbg !345
  %25 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @immediate, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unlocked_vesting, i64 0, i64 0)), !dbg !346
  %26 = call i8* @sol.into.1(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !347
  %27 = call i8* @sol.ok_or.2(i8* %25, i8* %26), !dbg !348
  ret i8* %0, !dbg !325
}

define i8* @sol.model.struct.anchor.FinalizeBpdCalculation(i8* %0) !dbg !349 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !351
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([72 x i8], [72 x i8]* @"constraint=caller.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !353
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @caller, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !354
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !355
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !356
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([308 x i8], [308 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.bpd_calculation_complete@HelixError::BpdCalculationAlreadyComplete,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,", i64 0, i64 0)), !dbg !357
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !358
  ret i8* %0, !dbg !351
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.1"(i8* %0) !dbg !359 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !360
  %3 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0)), !dbg !362
  %4 = call i8* @sol.ok_or.2(i8* %3, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !363
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* %4), !dbg !364
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0)), !dbg !365
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !366
  %5 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !367
  ret i8* %0, !dbg !360
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.2"(i8* %0) !dbg !368 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !369
  ret i8* %0, !dbg !369
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.3"(i8* %0) !dbg !371 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !372
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !374
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !375
  %3 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !376
  %4 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !377
  %5 = call i8* @sol.return.1(i8* %4), !dbg !378
  ret i8* %0, !dbg !372
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.5"(i8* %0) !dbg !379 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !380
  %3 = call i8* @sol.model.break(), !dbg !382
  ret i8* %0, !dbg !380
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.6"(i8* %0) !dbg !383 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !384
  ret i8* %0, !dbg !384
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.7"(i8* %0) !dbg !386 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !387
  ret i8* %0, !dbg !387
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.8"(i8* %0) !dbg !389 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !390
  ret i8* %0, !dbg !390
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.9"(i8* %0) !dbg !392 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !393
  ret i8* %0, !dbg !393
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.10"(i8* %0) !dbg !395 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !396
  ret i8* %0, !dbg !396
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.11"(i8* %0) !dbg !398 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !399
  ret i8* %0, !dbg !399
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.12"(i8* %0) !dbg !401 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !402
  ret i8* %0, !dbg !402
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.13"(i8* %0) !dbg !404 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !405
  ret i8* %0, !dbg !405
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.4"(i8* %0) !dbg !407 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !408
  %3 = call i8* @"sol.>="(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @i, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @MAX_STAKES_PER_FINALIZE, i64 0, i64 0)), !dbg !410
  %4 = call i8* @sol.if(i8* %3), !dbg !411
  %5 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.5"(i8* %4), !dbg !412
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !412
  %7 = call i8* @"sol.crate::id.0"(), !dbg !413
  %8 = call i8* @"sol.!="(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @account_info.owner, i64 0, i64 0), i8* %7), !dbg !414
  %9 = call i8* @sol.if(i8* %8), !dbg !415
  %10 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.6"(i8* %9), !dbg !416
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !416
  %12 = call i8* @sol.try_borrow_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !417
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0), i8* %12), !dbg !418
  %13 = call i8* @sol.len.1(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0)), !dbg !419
  %14 = call i8* @"sol.<"(i8* %13, i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"StakeAccount::LEN", i64 0, i64 0)), !dbg !420
  %15 = call i8* @sol.if(i8* %14), !dbg !421
  %16 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.7"(i8* %15), !dbg !422
  %17 = call i8* @sol.ifTrue.anon.(i8* %16), !dbg !422
  %18 = call i8* @sol.match.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @s, i64 0, i64 0)), !dbg !423
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %18), !dbg !424
  %19 = call i8* @sol.drop.1(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @data, i64 0, i64 0)), !dbg !425
  %20 = call i8* @"sol.=="(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @stake.bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !426
  %21 = call i8* @sol.if(i8* %20), !dbg !427
  %22 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.8"(i8* %21), !dbg !428
  %23 = call i8* @sol.ifTrue.anon.(i8* %22), !dbg !428
  %24 = call i8* @"sol.crate::id.0"(), !dbg !429
  %25 = call i8* @"sol.Pubkey::create_program_address.2"(i8* getelementptr inbounds ([77 x i8], [77 x i8]* @"[STAKE_SEED,stake.user.as_ref(),&stake.stake_id.to_le_bytes(),&[stake.bump],]", i64 0, i64 0), i8* %24), !dbg !430
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0), i8* %25), !dbg !431
  %26 = call i8* @sol.is_err.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0)), !dbg !432
  %27 = call i8* @sol.key.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !433
  %28 = call i8* @sol.unwrap.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0)), !dbg !434
  %29 = call i8* @"sol.!="(i8* %27, i8* %28), !dbg !435
  %30 = call i8* @"sol.||"(i8* %26, i8* %29), !dbg !436
  %31 = call i8* @sol.if(i8* %30), !dbg !437
  %32 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.9"(i8* %31), !dbg !438
  %33 = call i8* @sol.ifTrue.anon.(i8* %32), !dbg !438
  %34 = call i8* @"sol.!"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @stake.is_active, i64 0, i64 0)), !dbg !439
  %35 = call i8* @sol.if(i8* %34), !dbg !440
  %36 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.10"(i8* %35), !dbg !441
  %37 = call i8* @sol.ifTrue.anon.(i8* %36), !dbg !441
  %38 = call i8* @"sol.<"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0)), !dbg !442
  %39 = call i8* @sol.if(i8* %38), !dbg !443
  %40 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.11"(i8* %39), !dbg !444
  %41 = call i8* @sol.ifTrue.anon.(i8* %40), !dbg !444
  %42 = call i8* @"sol.>"(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0)), !dbg !445
  %43 = call i8* @sol.if(i8* %42), !dbg !446
  %44 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.12"(i8* %43), !dbg !447
  %45 = call i8* @sol.ifTrue.anon.(i8* %44), !dbg !447
  %46 = call i8* @"sol.std::cmp::min.2"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.end_slot, i64 0, i64 0)), !dbg !448
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* %46), !dbg !449
  %47 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_end, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0)), !dbg !450
  %48 = call i8* @sol.checked_div.2(i8* %47, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !451
  %49 = call i8* @sol.unwrap_or.2(i8* %48, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !452
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* %49), !dbg !453
  %50 = call i8* @"sol.=="(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !454
  %51 = call i8* @sol.if(i8* %50), !dbg !455
  %52 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.13"(i8* %51), !dbg !456
  %53 = call i8* @sol.ifTrue.anon.(i8* %52), !dbg !456
  %54 = call i8* @sol.typecast(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !457
  %55 = call i8* @sol.typecast(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @days_staked, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !458
  %56 = call i8* @sol.checked_mul.2(i8* %54, i8* %55), !dbg !459
  %57 = call i8* @sol.ok_or.2(i8* %56, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !460
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0), i8* %57), !dbg !461
  %58 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_days, i64 0, i64 0)), !dbg !462
  %59 = call i8* @sol.ok_or.2(i8* %58, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !463
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0), i8* %59), !dbg !464
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @stake.bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0)), !dbg !465
  %60 = call i8* @sol.try_borrow_mut_data.1(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @account_info, i64 0, i64 0)), !dbg !466
  %61 = call i8* @sol.try_serialize.2(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* %60), !dbg !467
  %62 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !468
  %63 = call i8* @sol.ok_or.2(i8* %62, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !469
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* %63), !dbg !470
  ret i8* %0, !dbg !408
}

define i8* @"finalize_bpd_calculation::finalize_bpd_calculation.1"(i8* %0) !dbg !471 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([56 x i8], [56 x i8]* @"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>", i64 0, i64 0)), !dbg !472
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !474
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !475
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !476
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !477
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"clock.slot>claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::BigPayDayNotAvailable", i64 0, i64 0)), !dbg !478
  %5 = call i8* @"sol.=="(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !479
  %6 = call i8* @"sol.=="(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !480
  %7 = call i8* @"sol.&&"(i8* %5, i8* %6), !dbg !479
  %8 = call i8* @"sol.=="(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !481
  %9 = call i8* @"sol.&&"(i8* %7, i8* %8), !dbg !479
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @is_first_batch, i64 0, i64 0), i8* %9), !dbg !482
  %10 = call i8* @sol.if(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @is_first_batch, i64 0, i64 0)), !dbg !483
  %11 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.1"(i8* %10), !dbg !484
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !484
  %13 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.2"(i8* %12), !dbg !485
  %14 = call i8* @sol.ifFalse.anon.(i8* %13), !dbg !485
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* %14), !dbg !486
  %15 = call i8* @"sol.=="(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !487
  %16 = call i8* @sol.if(i8* %15), !dbg !488
  %17 = call i8* @"sol.finalize_bpd_calculation::finalize_bpd_calculation.anon.3"(i8* %16), !dbg !489
  %18 = call i8* @sol.ifTrue.anon.(i8* %17), !dbg !489
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0)), !dbg !490
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !491
  %19 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"finalize_bpd_calculation::finalize_bpd_calculation.anon.4.2", i64 0, i64 0)), !dbg !492
  %20 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @batch_share_days, i64 0, i64 0)), !dbg !493
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !494
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* %21), !dbg !495
  %22 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !496
  ret i8* %0, !dbg !472
}

define i8* @sol.model.struct.anchor.CreateStake(i8* %0) !dbg !497 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !499
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !501
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !502
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !503
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !504
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([133 x i8], [133 x i8]* @"init,payer=user,space=StakeAccount::LEN,seeds=[STAKE_SEED,user.key().as_ref(),&global_state.total_stakes_created.to_le_bytes()],bump,", i64 0, i64 0)), !dbg !505
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !506
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([164 x i8], [164 x i8]* @"mut,constraint=user_token_account.mint==global_state.mint@HelixError::InvalidParameter,constraint=user_token_account.owner==user.key()@HelixError::InvalidParameter,", i64 0, i64 0)), !dbg !507
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !508
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !509
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !510
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !511
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !512
  ret i8* %0, !dbg !499
}

define i8* @"create_stake::create_stake.anon.4"(i8* %0) !dbg !513 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !514
  ret i8* %0, !dbg !514
}

define i8* @"create_stake::create_stake.anon.5"(i8* %0) !dbg !516 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !517
  ret i8* %0, !dbg !517
}

define i8* @"create_stake::create_stake.anon.3"(i8* %0) !dbg !519 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !520
  %3 = call i8* @"sol.<="(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0)), !dbg !522
  %4 = call i8* @"sol.&&"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.claim_period_started, i64 0, i64 0), i8* %3), !dbg !523
  %5 = call i8* @sol.if(i8* %4), !dbg !524
  %6 = call i8* @"sol.create_stake::create_stake.anon.4"(i8* %5), !dbg !525
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !525
  %8 = call i8* @"sol.create_stake::create_stake.anon.5"(i8* %7), !dbg !526
  %9 = call i8* @sol.ifFalse.anon.(i8* %8), !dbg !526
  ret i8* %0, !dbg !520
}

define i8* @"create_stake::create_stake.anon.6"(i8* %0) !dbg !527 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !528
  ret i8* %0, !dbg !528
}

define i8* @"create_stake::create_stake.anon.2"(i8* %0) !dbg !530 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !531
  %3 = call i8* @"sol.Account::try_from.1"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config_info, i64 0, i64 0)), !dbg !533
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([51 x i8], [51 x i8]* @"Account::<ClaimConfig>::try_from(claim_config_info)", i64 0, i64 0), i8* %3), !dbg !534
  %4 = call i8* @"sol.create_stake::create_stake.anon.3"(i8* getelementptr inbounds ([51 x i8], [51 x i8]* @"Account::<ClaimConfig>::try_from(claim_config_info)", i64 0, i64 0)), !dbg !535
  %5 = call i8* @sol.ifTrue.anon.(i8* %4), !dbg !535
  %6 = call i8* @"sol.create_stake::create_stake.anon.6"(i8* %5), !dbg !536
  %7 = call i8* @sol.ifFalse.anon.(i8* %6), !dbg !536
  ret i8* %0, !dbg !531
}

define i8* @"create_stake::create_stake.anon.7"(i8* %0) !dbg !537 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !538
  ret i8* %0, !dbg !538
}

define i8* @"create_stake::create_stake.anon.1"(i8* %0) !dbg !540 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !541
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config_info, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.remaining_accounts, i64 0, i64 0)), !dbg !543
  %3 = call i8* @"sol.Pubkey::find_program_address.2"(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"[CLAIM_CONFIG_SEED]", i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @ctx.program_id, i64 0, i64 0)), !dbg !544
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"(expected_pda,_)", i64 0, i64 0), i8* %3), !dbg !545
  %4 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config_info, i64 0, i64 0)), !dbg !546
  %5 = call i8* @"sol.=="(i8* %4, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @expected_pda, i64 0, i64 0)), !dbg !547
  %6 = call i8* @sol.if(i8* %5), !dbg !548
  %7 = call i8* @"sol.create_stake::create_stake.anon.2"(i8* %6), !dbg !549
  %8 = call i8* @sol.ifTrue.anon.(i8* %7), !dbg !549
  %9 = call i8* @"sol.create_stake::create_stake.anon.7"(i8* %8), !dbg !550
  %10 = call i8* @sol.ifFalse.anon.(i8* %9), !dbg !550
  ret i8* %0, !dbg !541
}

define i8* @"create_stake::create_stake.anon.8"(i8* %0) !dbg !551 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !552
  ret i8* %0, !dbg !552
}

define i8* @"create_stake::create_stake.3"(i8* %0, i8* %1, i8* %2) !dbg !554 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([45 x i8], [45 x i8]* @"Context<'_,'_,'info,'info,CreateStake<'info>>", i64 0, i64 0)), !dbg !555
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !555
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !555
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !557
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !558
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"amount>=global_state.min_stake_amount", i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"HelixError::StakeBelowMinimum", i64 0, i64 0)), !dbg !559
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"days>=1&&days<=MAX_STAKE_DAYSasu16", i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"HelixError::InvalidStakeDuration", i64 0, i64 0)), !dbg !560
  %9 = call i8* @"sol.Clock::get.0"(), !dbg !561
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %9), !dbg !562
  %10 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !563
  %11 = call i8* @sol.calculate_t_shares.3(i8* %1, i8* %10, i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0)), !dbg !564
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* %11), !dbg !565
  %12 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !566
  %13 = call i8* @sol.checked_mul.2(i8* %12, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !567
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !568
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %14), !dbg !569
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !570
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* %16), !dbg !571
  %17 = call i8* @sol.calculate_reward_debt.2(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0)), !dbg !572
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* %17), !dbg !573
  %18 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !574
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @stake_account.user, i64 0, i64 0), i8* %18), !dbg !575
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @stake_account.stake_id, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0)), !dbg !576
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @stake_account.staked_amount, i64 0, i64 0), i8* %1), !dbg !577
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @stake_account.t_shares, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !578
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @stake_account.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !579
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @stake_account.end_slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !580
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @stake_account.stake_days, i64 0, i64 0), i8* %2), !dbg !581
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @stake_account.reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0)), !dbg !582
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake_account.is_active, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !583
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @stake_account.bump, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @ctx.bumps.stake_account, i64 0, i64 0)), !dbg !584
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @stake_account.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !585
  %19 = call i8* @sol.is_empty.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.remaining_accounts, i64 0, i64 0)), !dbg !586
  %20 = call i8* @"sol.!"(i8* %19), !dbg !587
  %21 = call i8* @sol.if(i8* %20), !dbg !588
  %22 = call i8* @"sol.create_stake::create_stake.anon.1"(i8* %21), !dbg !589
  %23 = call i8* @sol.ifTrue.anon.(i8* %22), !dbg !589
  %24 = call i8* @"sol.create_stake::create_stake.anon.8"(i8* %23), !dbg !590
  %25 = call i8* @sol.ifFalse.anon.(i8* %24), !dbg !590
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"(bpd_eligible,claim_period_start_slot)", i64 0, i64 0), i8* %25), !dbg !591
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @stake_account.bpd_eligible, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bpd_eligible, i64 0, i64 0)), !dbg !592
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @stake_account.claim_period_start_slot, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_period_start_slot, i64 0, i64 0)), !dbg !593
  %26 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !594
  %27 = call i8* @sol.ok_or.2(i8* %26, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !595
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0), i8* %27), !dbg !596
  %28 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* %1), !dbg !597
  %29 = call i8* @sol.ok_or.2(i8* %28, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !598
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* %29), !dbg !599
  %30 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !600
  %31 = call i8* @sol.ok_or.2(i8* %30, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !601
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* %31), !dbg !602
  %32 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !603
  %33 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !604
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %33), !dbg !605
  %34 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !606
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* %34), !dbg !607
  %35 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.user, i64 0, i64 0)), !dbg !608
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %35), !dbg !609
  %36 = call i8* @"sol.model.struct.new.token_2022::Burn.3"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @from, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !610
  %37 = call i8* @"sol.CpiContext::new.2"(i8* %32, i8* %36), !dbg !611
  %38 = call i8* @"sol.token_2022::burn.2"(i8* %37, i8* %1), !dbg !612
  %39 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"StakeCreated{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([118 x i8], [118 x i8]* @"user:ctx.accounts.user.key(),stake_id:stake_account.stake_id,amount,t_shares,days,share_rate:global_state.share_rate,}", i64 0, i64 0)), !dbg !613
  %40 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !614
  ret i8* %0, !dbg !555
}

define i8* @sol.model.struct.anchor.ClaimRewards(i8* %0) !dbg !615 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !617
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !619
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !620
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !621
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !622
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([311 x i8], [311 x i8]* @"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeNotActive,realloc=StakeAccount::LEN,realloc::payer=user,realloc::zero=false,", i64 0, i64 0)), !dbg !623
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !624
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([111 x i8], [111 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !625
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !626
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !627
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !628
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !629
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !630
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !631
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !632
  ret i8* %0, !dbg !617
}

define i8* @"claim_rewards::claim_rewards.anon.1"(i8* %0) !dbg !633 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !634
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @stake_mut.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !636
  ret i8* %0, !dbg !634
}

define i8* @"claim_rewards::claim_rewards.1"(i8* %0) !dbg !637 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<ClaimRewards>", i64 0, i64 0)), !dbg !638
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !640
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !641
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !642
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !643
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @stake_id, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.stake_id, i64 0, i64 0)), !dbg !644
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0)), !dbg !645
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake.user, i64 0, i64 0)), !dbg !646
  %4 = call i8* @sol.calculate_pending_rewards.3(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @stake.reward_debt, i64 0, i64 0)), !dbg !647
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* %4), !dbg !648
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0)), !dbg !649
  %5 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0)), !dbg !650
  %6 = call i8* @sol.ok_or.2(i8* %5, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !651
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_rewards, i64 0, i64 0), i8* %6), !dbg !652
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"total_rewards>0", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::NoRewardsToClaim", i64 0, i64 0)), !dbg !653
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_mut, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !654
  %8 = call i8* @sol.calculate_reward_debt.2(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0)), !dbg !655
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @stake_mut.reward_debt, i64 0, i64 0), i8* %8), !dbg !656
  %9 = call i8* @"sol.>"(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !657
  %10 = call i8* @sol.if(i8* %9), !dbg !658
  %11 = call i8* @"sol.claim_rewards::claim_rewards.anon.1"(i8* %10), !dbg !659
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !659
  %13 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_claims_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !660
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !661
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_claims_created, i64 0, i64 0), i8* %14), !dbg !662
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !663
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !664
  %15 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !665
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %15), !dbg !666
  %16 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !667
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %16), !dbg !668
  %17 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !669
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %17), !dbg !670
  %18 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !671
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %18), !dbg !672
  %19 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !673
  %20 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %19, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !674
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %20), !dbg !675
  %21 = call i8* @"sol.token_2022::mint_to.2"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_rewards, i64 0, i64 0)), !dbg !676
  %22 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"RewardsClaimed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"user,stake_id,amount:total_rewards,}", i64 0, i64 0)), !dbg !677
  %23 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !678
  ret i8* %0, !dbg !638
}

define i8* @sol.model.struct.anchor.AcceptAuthority(i8* %0) !dbg !679 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !681
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([147 x i8], [147 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=!global_state.is_bpd_window_active()@HelixError::AuthorityTransferBlockedDuringBpd,", i64 0, i64 0)), !dbg !683
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !684
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([83 x i8], [83 x i8]* @"mut,seeds=[PENDING_AUTHORITY_SEED],bump=pending_authority.bump,close=new_authority,", i64 0, i64 0)), !dbg !685
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @pending_authority, i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"Account<'info,PendingAuthority>", i64 0, i64 0)), !dbg !686
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([105 x i8], [105 x i8]* @"mut,constraint=new_authority.key()==pending_authority.new_authority@HelixError::UnauthorizedNewAuthority,", i64 0, i64 0)), !dbg !687
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !688
  ret i8* %0, !dbg !681
}

define i8* @"accept_authority::accept_authority.1"(i8* %0) !dbg !689 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<AcceptAuthority>", i64 0, i64 0)), !dbg !690
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @old_authority, i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @ctx.accounts.global_state.authority, i64 0, i64 0)), !dbg !692
  %3 = call i8* @sol.key.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.new_authority, i64 0, i64 0)), !dbg !693
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* %3), !dbg !694
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @ctx.accounts.global_state.authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0)), !dbg !695
  %4 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([40 x i8], [40 x i8]* @"AuthorityTransferCompleted{old_authority", i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"new_authority,}", i64 0, i64 0)), !dbg !696
  %5 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !697
  ret i8* %0, !dbg !690
}

define i8* @sol.model.struct.anchor.FreeClaim(i8* %0) !dbg !698 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !700
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !702
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @claimer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !703
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([72 x i8], [72 x i8]* @"constraint=snapshot_wallet.key()==claimer.key()@HelixError::Unauthorized", i64 0, i64 0)), !dbg !704
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !705
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !706
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !707
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([132 x i8], [132 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,", i64 0, i64 0)), !dbg !708
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !709
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([156 x i8], [156 x i8]* @"init,payer=claimer,space=ClaimStatus::LEN,seeds=[CLAIM_STATUS_SEED,&claim_config.merkle_root[..MERKLE_ROOT_PREFIX_LEN],snapshot_wallet.key().as_ref()],bump,", i64 0, i64 0)), !dbg !710
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimStatus>", i64 0, i64 0)), !dbg !711
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([114 x i8], [114 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=claimer,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !712
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claimer_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !713
  %15 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !714
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !715
  %17 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !716
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !717
  %19 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"address=ix_sysvar::ID", i64 0, i64 0)), !dbg !718
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @instructions_sysvar, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !719
  %21 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !720
  %22 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !721
  ret i8* %0, !dbg !700
}

define i8* @"free_claim::free_claim.3"(i8* %0, i8* %1, i8* %2) !dbg !722 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<FreeClaim>", i64 0, i64 0)), !dbg !723
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @snapshot_balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !723
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @proof, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"Vec<[u8;32]>", i64 0, i64 0)), !dbg !723
  %7 = call i8* @"sol.Clock::get.0"(), !dbg !725
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %7), !dbg !726
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !727
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_status, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_status, i64 0, i64 0)), !dbg !728
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !729
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"clock.slot<=claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::ClaimPeriodEnded", i64 0, i64 0)), !dbg !730
  %9 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"snapshot_balance>=MIN_SOL_BALANCE", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::SnapshotBalanceTooLow", i64 0, i64 0)), !dbg !731
  %10 = call i8* @sol.key.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.accounts.snapshot_wallet, i64 0, i64 0)), !dbg !732
  %11 = call i8* @sol.verify_ed25519_signature.3(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @ctx.accounts.instructions_sysvar, i64 0, i64 0), i8* %10, i8* %1), !dbg !733
  %12 = call i8* @sol.key.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.accounts.snapshot_wallet, i64 0, i64 0)), !dbg !734
  %13 = call i8* @sol.verify_merkle_proof.5(i8* %12, i8* %1, i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.merkle_root, i64 0, i64 0), i8* %2), !dbg !735
  %14 = call i8* @sol.calculate_days_elapsed.3(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !736
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0), i8* %14), !dbg !737
  %15 = call i8* @sol.calculate_speed_bonus.2(i8* %1, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0)), !dbg !738
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"(bonus_bps,base_amount,bonus_amount)", i64 0, i64 0), i8* %15), !dbg !739
  %16 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @base_amount, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bonus_amount, i64 0, i64 0)), !dbg !740
  %17 = call i8* @sol.ok_or.2(i8* %16, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !741
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0), i8* %17), !dbg !742
  %18 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @IMMEDIATE_RELEASE_BPS, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !743
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0), i8* %18), !dbg !744
  %19 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0)), !dbg !745
  %20 = call i8* @sol.ok_or.2(i8* %19, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !746
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @vesting_amount, i64 0, i64 0), i8* %20), !dbg !747
  %21 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @VESTING_DAYS, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !748
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !749
  %23 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %22), !dbg !750
  %24 = call i8* @sol.ok_or.2(i8* %23, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !751
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0), i8* %24), !dbg !752
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_status.is_claimed, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !753
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @claim_status.claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0)), !dbg !754
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @claim_status.claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !755
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @claim_status.bonus_bps, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0)), !dbg !756
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0)), !dbg !757
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @claim_status.vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0)), !dbg !758
  %25 = call i8* @sol.key.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @ctx.accounts.snapshot_wallet, i64 0, i64 0)), !dbg !759
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_status.snapshot_wallet, i64 0, i64 0), i8* %25), !dbg !760
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_status.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.claim_status, i64 0, i64 0)), !dbg !761
  %26 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_amount, i64 0, i64 0)), !dbg !762
  %27 = call i8* @sol.ok_or.2(i8* %26, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !763
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0), i8* %27), !dbg !764
  %28 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.claim_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !765
  %29 = call i8* @sol.ok_or.2(i8* %28, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !766
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.claim_count, i64 0, i64 0), i8* %29), !dbg !767
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !768
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !769
  %30 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !770
  %31 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !771
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %31), !dbg !772
  %32 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @ctx.accounts.claimer_token_account, i64 0, i64 0)), !dbg !773
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %32), !dbg !774
  %33 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !775
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %33), !dbg !776
  %34 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !777
  %35 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %30, i8* %34, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !778
  %36 = call i8* @"sol.token_2022::mint_to.2"(i8* %35, i8* getelementptr inbounds ([16 x i8], [16 x i8]* @immediate_amount, i64 0, i64 0)), !dbg !779
  %37 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"TokensClaimed{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([295 x i8], [295 x i8]* @"timestamp:clock.unix_timestamp,claimer:ctx.accounts.claimer.key(),snapshot_wallet:ctx.accounts.snapshot_wallet.key(),claim_period_id:claim_config.claim_period_id,snapshot_balance,base_amount,bonus_bps,days_elapsed:days_elapsedasu16,total_amount,immediate_amount,vesting_amount,vesting_end_slot,}", i64 0, i64 0)), !dbg !780
  %38 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !781
  ret i8* %0, !dbg !723
}

define i8* @"free_claim::verify_ed25519_signature.3"(i8* %0, i8* %1, i8* %2) !dbg !782 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @instructions_sysvar, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"&AccountInfo", i64 0, i64 0)), !dbg !783
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !783
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !783
  %7 = call i8* @sol.load_current_index_checked.1(i8* %0), !dbg !785
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @current_ix_index, i64 0, i64 0), i8* %7), !dbg !786
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"current_ix_index>0", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::MissingEd25519Instruction", i64 0, i64 0)), !dbg !787
  %9 = call i8* @sol.-(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @current_ix_index, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !788
  %10 = call i8* @sol.typecast(i8* %9, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !789
  %11 = call i8* @sol.load_instruction_at_checked.2(i8* %10, i8* %0), !dbg !790
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @ed25519_ix, i64 0, i64 0), i8* %11), !dbg !791
  %12 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([42 x i8], [42 x i8]* @"ed25519_ix.program_id==ed25519_program::ID", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::MissingEd25519Instruction", i64 0, i64 0)), !dbg !792
  %13 = call i8* @"sol.model.macro.format.!1"(i8* getelementptr inbounds ([44 x i8], [44 x i8]* @"(\22HELIX:claim:{}:{}\22,snapshot_wallet,amount)", i64 0, i64 0)), !dbg !793
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @expected_message, i64 0, i64 0), i8* %13), !dbg !794
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @ix_data, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @ed25519_ix.data, i64 0, i64 0)), !dbg !795
  %14 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"ix_data.len()>=16", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !796
  %15 = call i8* @"sol.u16::from_le_bytes.1"(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"[ix_data[6],ix_data[7]]", i64 0, i64 0)), !dbg !797
  %16 = call i8* @sol.typecast(i8* %15, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !797
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @pubkey_offset, i64 0, i64 0), i8* %16), !dbg !798
  %17 = call i8* @"sol.u16::from_le_bytes.1"(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"[ix_data[10],ix_data[11]]", i64 0, i64 0)), !dbg !799
  %18 = call i8* @sol.typecast(i8* %17, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !799
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @msg_offset, i64 0, i64 0), i8* %18), !dbg !800
  %19 = call i8* @"sol.u16::from_le_bytes.1"(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"[ix_data[12],ix_data[13]]", i64 0, i64 0)), !dbg !801
  %20 = call i8* @sol.typecast(i8* %19, i8* getelementptr inbounds ([5 x i8], [5 x i8]* @usize, i64 0, i64 0)), !dbg !801
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @msg_len, i64 0, i64 0), i8* %20), !dbg !802
  %21 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"ix_data.len()>=pubkey_offset+32", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !803
  %22 = call i8* @"sol.Pubkey::try_from.1"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @ix_data, i64 0, i64 0)), !dbg !804
  %23 = call i8* @sol.map_err.2(i8* %22, i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !805
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @signed_pubkey, i64 0, i64 0), i8* %23), !dbg !806
  %24 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"signed_pubkey==snapshot_wallet", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !807
  %25 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"ix_data.len()>=msg_offset+msg_len", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !808
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @signed_message, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @ix_data, i64 0, i64 0)), !dbg !809
  %26 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([43 x i8], [43 x i8]* @"signed_message==expected_message.as_bytes()", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidSignature", i64 0, i64 0)), !dbg !810
  %27 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !811
  ret i8* %0, !dbg !783
}

define i8* @"free_claim::verify_merkle_proof.anon.1"(i8* %0) !dbg !812 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !813
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[&hash,sibling]", i64 0, i64 0)), !dbg !815
  ret i8* %0, !dbg !813
}

define i8* @"free_claim::verify_merkle_proof.anon.2"(i8* %0) !dbg !816 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !817
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[sibling,&hash]", i64 0, i64 0)), !dbg !819
  ret i8* %0, !dbg !817
}

define i8* @"free_claim::verify_merkle_proof.anon.4"(i8* %0) !dbg !820 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !821
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[&hash,sibling]", i64 0, i64 0)), !dbg !823
  ret i8* %0, !dbg !821
}

define i8* @"free_claim::verify_merkle_proof.anon.5"(i8* %0) !dbg !824 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !825
  %3 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"[sibling,&hash]", i64 0, i64 0)), !dbg !827
  ret i8* %0, !dbg !825
}

define i8* @"free_claim::verify_merkle_proof.anon.3"(i8* %0) !dbg !828 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !829
  %3 = call i8* @"sol.<"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @hash, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @sibling, i64 0, i64 0)), !dbg !831
  %4 = call i8* @sol.if(i8* %3), !dbg !832
  %5 = call i8* @"sol.free_claim::verify_merkle_proof.anon.4"(i8* %4), !dbg !833
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !833
  %7 = call i8* @"sol.free_claim::verify_merkle_proof.anon.5"(i8* %6), !dbg !834
  %8 = call i8* @sol.ifFalse.anon.(i8* %7), !dbg !834
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @hash, i64 0, i64 0), i8* %8), !dbg !835
  ret i8* %0, !dbg !829
}

define i8* @"free_claim::verify_merkle_proof.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4) !dbg !836 {
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !837
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !837
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !837
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"&[u8;32]", i64 0, i64 0)), !dbg !837
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @proof, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"&[[u8;32]]", i64 0, i64 0)), !dbg !837
  %11 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"proof.len()<=MAX_MERKLE_PROOF_LEN", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::InvalidMerkleProof", i64 0, i64 0)), !dbg !839
  %12 = call i8* @sol.hashv.1(i8* getelementptr inbounds ([80 x i8], [80 x i8]* @"[snapshot_wallet.as_ref(),&amount.to_le_bytes(),&claim_period_id.to_le_bytes(),]", i64 0, i64 0)), !dbg !840
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @hash, i64 0, i64 0), i8* %12), !dbg !841
  %13 = call i8* @sol.model.loop.for.1(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"free_claim::verify_merkle_proof.anon.3.1", i64 0, i64 0)), !dbg !842
  %14 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"hash==*merkle_root", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::InvalidMerkleProof", i64 0, i64 0)), !dbg !843
  %15 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !844
  ret i8* %0, !dbg !837
}

define i8* @"free_claim::calculate_days_elapsed.3"(i8* %0, i8* %1, i8* %2) !dbg !845 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !846
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !846
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !846
  %7 = call i8* @sol.checked_sub.2(i8* %1, i8* %0), !dbg !848
  %8 = call i8* @sol.ok_or.2(i8* %7, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !849
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @elapsed_slots, i64 0, i64 0), i8* %8), !dbg !850
  %9 = call i8* @"sol./"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @elapsed_slots, i64 0, i64 0), i8* %2), !dbg !851
  %10 = call i8* @sol.Ok.1(i8* %9), !dbg !852
  ret i8* %0, !dbg !846
}

define i8* @"free_claim::calculate_speed_bonus.anon.1"(i8* %0) !dbg !853 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !854
  ret i8* %0, !dbg !854
}

define i8* @"free_claim::calculate_speed_bonus.anon.2"(i8* %0) !dbg !856 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !857
  ret i8* %0, !dbg !857
}

define i8* @"free_claim::calculate_speed_bonus.anon.3"(i8* %0) !dbg !859 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !860
  ret i8* %0, !dbg !860
}

define i8* @"free_claim::calculate_speed_bonus.2"(i8* %0, i8* %1) !dbg !862 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @snapshot_balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !863
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @days_elapsed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !863
  %5 = call i8* @sol.mul_div.3(i8* %0, i8* getelementptr inbounds ([13 x i8], [13 x i8]* @HELIX_PER_SOL, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !865
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @base_amount, i64 0, i64 0), i8* %5), !dbg !866
  %6 = call i8* @"sol.<="(i8* %1, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @SPEED_BONUS_WEEK1_END, i64 0, i64 0)), !dbg !867
  %7 = call i8* @sol.if(i8* %6), !dbg !868
  %8 = call i8* @"sol.free_claim::calculate_speed_bonus.anon.1"(i8* %7), !dbg !869
  %9 = call i8* @sol.ifTrue.anon.(i8* %8), !dbg !869
  %10 = call i8* @"sol.<="(i8* %1, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @SPEED_BONUS_WEEK4_END, i64 0, i64 0)), !dbg !870
  %11 = call i8* @sol.if(i8* %10), !dbg !871
  %12 = call i8* @"sol.free_claim::calculate_speed_bonus.anon.2"(i8* %11), !dbg !872
  %13 = call i8* @sol.ifTrue.anon.(i8* %12), !dbg !872
  %14 = call i8* @"sol.free_claim::calculate_speed_bonus.anon.3"(i8* %13), !dbg !873
  %15 = call i8* @sol.ifFalse.anon.(i8* %14), !dbg !873
  %16 = call i8* @sol.ifTrueFalse.anon.(i8* %9, i8* %15), !dbg !871
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0), i8* %16), !dbg !874
  %17 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @base_amount, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !875
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bonus_amount, i64 0, i64 0), i8* %17), !dbg !876
  %18 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([39 x i8], [39 x i8]* @"bonus_bpsasu16,base_amount,bonus_amount", i64 0, i64 0)), !dbg !877
  ret i8* %0, !dbg !863
}

define i8* @sol.model.struct.anchor.AbortBpd(i8* %0) !dbg !878 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !880
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([71 x i8], [71 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,has_one=authority,", i64 0, i64 0)), !dbg !882
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !883
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,", i64 0, i64 0)), !dbg !884
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !885
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !886
  ret i8* %0, !dbg !880
}

define i8* @"abort_bpd::abort_bpd.1"(i8* %0) !dbg !887 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"Context<AbortBpd>", i64 0, i64 0)), !dbg !888
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !890
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !891
  %3 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"global_state.is_bpd_window_active()", i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"HelixError::BpdWindowNotActive", i64 0, i64 0)), !dbg !892
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"claim_config.bpd_stakes_distributed==0", i64 0, i64 0), i8* getelementptr inbounds ([41 x i8], [41 x i8]* @"HelixError::BpdDistributionAlreadyStarted", i64 0, i64 0)), !dbg !893
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0)), !dbg !894
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0)), !dbg !895
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !896
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !897
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !898
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !899
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !900
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !901
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !902
  %5 = call i8* @sol.set_bpd_window_active.2(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !903
  %6 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([55 x i8], [55 x i8]* @"BpdAborted{claim_period_id:claim_config.claim_period_id", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"stakes_finalized,stakes_distributed,}", i64 0, i64 0)), !dbg !904
  %7 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !905
  ret i8* %0, !dbg !888
}

define i8* @sol.model.struct.anchor.SealBpdFinalize(i8* %0) !dbg !906 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !908
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !910
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !911
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !912
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !913
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([308 x i8], [308 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,constraint=!claim_config.bpd_calculation_complete@HelixError::BpdCalculationAlreadyComplete,constraint=!claim_config.big_pay_day_complete@HelixError::BigPayDayAlreadyTriggered,", i64 0, i64 0)), !dbg !914
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !915
  ret i8* %0, !dbg !908
}

define i8* @"seal_bpd_finalize::seal_bpd_finalize.anon.1"(i8* %0) !dbg !916 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !917
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !919
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !920
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !921
  %4 = call i8* @sol.return.1(i8* %3), !dbg !922
  ret i8* %0, !dbg !917
}

define i8* @"seal_bpd_finalize::seal_bpd_finalize.2"(i8* %0, i8* %1) !dbg !923 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<SealBpdFinalize>", i64 0, i64 0)), !dbg !924
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @expected_finalized_count, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !924
  %5 = call i8* @"sol.Clock::get.0"(), !dbg !926
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %5), !dbg !927
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !928
  %6 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"clock.slot>claim_config.end_slot", i64 0, i64 0), i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"HelixError::BigPayDayNotAvailable", i64 0, i64 0)), !dbg !929
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"claim_config.bpd_stakes_finalized>0", i64 0, i64 0), i8* getelementptr inbounds ([37 x i8], [37 x i8]* @"HelixError::BpdFinalizationIncomplete", i64 0, i64 0)), !dbg !930
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([59 x i8], [59 x i8]* @"claim_config.bpd_stakes_finalized==expected_finalized_count", i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"HelixError::BpdFinalizeCountMismatch", i64 0, i64 0)), !dbg !931
  %9 = call i8* @"sol.=="(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !932
  %10 = call i8* @sol.if(i8* %9), !dbg !933
  %11 = call i8* @"sol.seal_bpd_finalize::seal_bpd_finalize.anon.1"(i8* %10), !dbg !934
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !934
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0)), !dbg !935
  %13 = call i8* @sol.typecast(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @unclaimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !936
  %14 = call i8* @sol.typecast(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !937
  %15 = call i8* @sol.checked_mul.2(i8* %13, i8* %14), !dbg !938
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !939
  %17 = call i8* @sol.checked_div.2(i8* %16, i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0)), !dbg !940
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !941
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0), i8* %18), !dbg !942
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @helix_per_share_day, i64 0, i64 0)), !dbg !943
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !944
  %19 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !945
  ret i8* %0, !dbg !924
}

define i8* @sol.model.struct.anchor.TransferAuthority(i8* %0) !dbg !946 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !948
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([125 x i8], [125 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized,", i64 0, i64 0)), !dbg !950
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !951
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([95 x i8], [95 x i8]* @"init_if_needed,payer=authority,space=PendingAuthority::LEN,seeds=[PENDING_AUTHORITY_SEED],bump,", i64 0, i64 0)), !dbg !952
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @pending_authority, i64 0, i64 0), i8* getelementptr inbounds ([31 x i8], [31 x i8]* @"Account<'info,PendingAuthority>", i64 0, i64 0)), !dbg !953
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !954
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !955
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !956
  ret i8* %0, !dbg !948
}

define i8* @"transfer_authority::transfer_authority.anon.1"(i8* %0) !dbg !957 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !958
  %3 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([65 x i8], [65 x i8]* @"AuthorityTransferCancelled{authority:ctx.accounts.authority.key()", i64 0, i64 0), i8* getelementptr inbounds ([47 x i8], [47 x i8]* @"cancelled_new_authority:pending.new_authority,}", i64 0, i64 0)), !dbg !960
  ret i8* %0, !dbg !958
}

define i8* @"transfer_authority::transfer_authority.2"(i8* %0, i8* %1) !dbg !961 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<TransferAuthority>", i64 0, i64 0)), !dbg !962
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !962
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @pending, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @ctx.accounts.pending_authority, i64 0, i64 0)), !dbg !964
  %5 = call i8* @"sol.Pubkey::default.0"(), !dbg !965
  %6 = call i8* @"sol.!="(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @pending.new_authority, i64 0, i64 0), i8* %5), !dbg !966
  %7 = call i8* @"sol.!="(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @pending.new_authority, i64 0, i64 0), i8* %1), !dbg !967
  %8 = call i8* @"sol.&&"(i8* %6, i8* %7), !dbg !966
  %9 = call i8* @sol.if(i8* %8), !dbg !968
  %10 = call i8* @"sol.transfer_authority::transfer_authority.anon.1"(i8* %9), !dbg !969
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !969
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @pending.new_authority, i64 0, i64 0), i8* %1), !dbg !970
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @pending.bump, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.bumps.pending_authority, i64 0, i64 0)), !dbg !971
  %12 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([69 x i8], [69 x i8]* @"AuthorityTransferInitiated{old_authority:ctx.accounts.authority.key()", i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @"new_authority,}", i64 0, i64 0)), !dbg !972
  %13 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !973
  ret i8* %0, !dbg !962
}

define i8* @sol.model.struct.anchor.AdminSetClaimEndSlot(i8* %0) !dbg !974 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !976
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !978
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !979
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !980
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !981
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([132 x i8], [132 x i8]* @"mut,seeds=[CLAIM_CONFIG_SEED],bump=claim_config.bump,constraint=claim_config.claim_period_started@HelixError::ClaimPeriodNotStarted,", i64 0, i64 0)), !dbg !982
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !983
  ret i8* %0, !dbg !976
}

define i8* @"admin_set_claim_end_slot::admin_set_claim_end_slot.2"(i8* %0, i8* %1) !dbg !984 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"Context<AdminSetClaimEndSlot>", i64 0, i64 0)), !dbg !985
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @new_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !985
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !987
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0), i8* %1), !dbg !988
  %5 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !989
  ret i8* %0, !dbg !985
}

define i8* @sol.model.struct.anchor.Unstake(i8* %0) !dbg !990 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !992
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !994
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !995
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !996
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !997
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([249 x i8], [249 x i8]* @"mut,seeds=[STAKE_SEED,user.key().as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,constraint=stake_account.user==user.key()@HelixError::UnauthorizedStakeAccess,constraint=stake_account.is_active@HelixError::StakeAlreadyClosed,", i64 0, i64 0)), !dbg !998
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !999
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([111 x i8], [111 x i8]* @"mut,associated_token::mint=mint,associated_token::authority=user,associated_token::token_program=token_program,", i64 0, i64 0)), !dbg !1000
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @user_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !1001
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !1002
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !1003
  %13 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !1004
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !1005
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !1006
  ret i8* %0, !dbg !992
}

define i8* @"unstake::unstake.anon.1"(i8* %0) !dbg !1007 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1008
  %3 = call i8* @sol.calculate_early_penalty.4(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !1010
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %3), !dbg !1011
  ret i8* %0, !dbg !1008
}

define i8* @"unstake::unstake.anon.3"(i8* %0) !dbg !1012 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1013
  ret i8* %0, !dbg !1013
}

define i8* @"unstake::unstake.anon.4"(i8* %0) !dbg !1015 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1016
  ret i8* %0, !dbg !1016
}

define i8* @"unstake::unstake.anon.2"(i8* %0) !dbg !1018 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1019
  %3 = call i8* @sol.calculate_late_penalty.4(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !1021
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %3), !dbg !1022
  %4 = call i8* @"sol.=="(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1023
  %5 = call i8* @sol.if(i8* %4), !dbg !1024
  %6 = call i8* @"sol.unstake::unstake.anon.3"(i8* %5), !dbg !1025
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !1025
  %8 = call i8* @"sol.unstake::unstake.anon.4"(i8* %7), !dbg !1026
  %9 = call i8* @sol.ifFalse.anon.(i8* %8), !dbg !1026
  ret i8* %0, !dbg !1019
}

define i8* @"unstake::unstake.anon.5"(i8* %0) !dbg !1027 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1028
  %3 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @penalty, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0)), !dbg !1030
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @penalty_share_increase, i64 0, i64 0), i8* %3), !dbg !1031
  %4 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @penalty_share_increase, i64 0, i64 0)), !dbg !1032
  %5 = call i8* @sol.ok_or.2(i8* %4, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1033
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* %5), !dbg !1034
  ret i8* %0, !dbg !1028
}

define i8* @"unstake::unstake.anon.6"(i8* %0) !dbg !1035 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1036
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([57 x i8], [57 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump]]", i64 0, i64 0)), !dbg !1038
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"[&authority_seeds[..]]", i64 0, i64 0)), !dbg !1039
  %3 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !1040
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %3), !dbg !1041
  %4 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @ctx.accounts.user_token_account, i64 0, i64 0)), !dbg !1042
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %4), !dbg !1043
  %5 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !1044
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %5), !dbg !1045
  %6 = call i8* @sol.model.struct.new.MintTo.3(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !1046
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* %6), !dbg !1047
  %7 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !1048
  %8 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %7, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @cpi_accounts, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !1049
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* %8), !dbg !1050
  %9 = call i8* @"sol.token_2022::mint_to.2"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @cpi_ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @total_mint_amount, i64 0, i64 0)), !dbg !1051
  ret i8* %0, !dbg !1036
}

define i8* @"unstake::unstake.1"(i8* %0) !dbg !1052 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"Context<Unstake>", i64 0, i64 0)), !dbg !1053
  %3 = call i8* @"sol.Clock::get.0"(), !dbg !1055
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %3), !dbg !1056
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1057
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @stake, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !1058
  %4 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"!global_state.is_bpd_window_active()", i64 0, i64 0), i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"HelixError::UnstakeBlockedDuringBpd", i64 0, i64 0)), !dbg !1059
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_user, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake.user, i64 0, i64 0)), !dbg !1060
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @stake_id, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.stake_id, i64 0, i64 0)), !dbg !1061
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @stake.staked_amount, i64 0, i64 0)), !dbg !1062
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.t_shares, i64 0, i64 0)), !dbg !1063
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @stake.start_slot, i64 0, i64 0)), !dbg !1064
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([14 x i8], [14 x i8]* @stake.end_slot, i64 0, i64 0)), !dbg !1065
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @stake.reward_debt, i64 0, i64 0)), !dbg !1066
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @stake.bpd_bonus_pending, i64 0, i64 0)), !dbg !1067
  %5 = call i8* @sol.calculate_pending_rewards.3(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0)), !dbg !1068
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0), i8* %5), !dbg !1069
  %6 = call i8* @"sol.<"(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !1070
  %7 = call i8* @sol.if(i8* %6), !dbg !1071
  %8 = call i8* @"sol.unstake::unstake.anon.1"(i8* %7), !dbg !1072
  %9 = call i8* @sol.ifTrue.anon.(i8* %8), !dbg !1072
  %10 = call i8* @"sol.unstake::unstake.anon.2"(i8* %9), !dbg !1073
  %11 = call i8* @sol.ifFalse.anon.(i8* %10), !dbg !1073
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(penalty,penalty_type)", i64 0, i64 0), i8* %11), !dbg !1074
  %12 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @penalty, i64 0, i64 0)), !dbg !1075
  %13 = call i8* @sol.ok_or.2(i8* %12, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1076
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @return_amount, i64 0, i64 0), i8* %13), !dbg !1077
  %14 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @return_amount, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @pending_rewards, i64 0, i64 0)), !dbg !1078
  %15 = call i8* @sol.ok_or.2(i8* %14, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1079
  %16 = call i8* @sol.checked_add.2(i8* %15, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpd_bonus, i64 0, i64 0)), !dbg !1080
  %17 = call i8* @sol.ok_or.2(i8* %16, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1081
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @total_mint_amount, i64 0, i64 0), i8* %17), !dbg !1082
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @stake_mut, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.stake_account, i64 0, i64 0)), !dbg !1083
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @stake_mut.is_active, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !1084
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @stake_mut.bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1085
  %18 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @global_state.total_unstakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !1086
  %19 = call i8* @sol.ok_or.2(i8* %18, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1087
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @global_state.total_unstakes_created, i64 0, i64 0), i8* %19), !dbg !1088
  %20 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @global_state.total_tokens_unstaked, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0)), !dbg !1089
  %21 = call i8* @sol.ok_or.2(i8* %20, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1090
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @global_state.total_tokens_unstaked, i64 0, i64 0), i8* %21), !dbg !1091
  %22 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !1092
  %23 = call i8* @sol.ok_or.2(i8* %22, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1093
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* %23), !dbg !1094
  %24 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0)), !dbg !1095
  %25 = call i8* @sol.ok_or.2(i8* %24, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1096
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* %25), !dbg !1097
  %26 = call i8* @"sol.>"(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @penalty, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1098
  %27 = call i8* @"sol.>"(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1099
  %28 = call i8* @"sol.&&"(i8* %26, i8* %27), !dbg !1098
  %29 = call i8* @sol.if(i8* %28), !dbg !1100
  %30 = call i8* @"sol.unstake::unstake.anon.5"(i8* %29), !dbg !1101
  %31 = call i8* @sol.ifTrue.anon.(i8* %30), !dbg !1101
  %32 = call i8* @"sol.>"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @total_mint_amount, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1102
  %33 = call i8* @sol.if(i8* %32), !dbg !1103
  %34 = call i8* @"sol.unstake::unstake.anon.6"(i8* %33), !dbg !1104
  %35 = call i8* @sol.ifTrue.anon.(i8* %34), !dbg !1104
  %36 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"StakeEnded{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([188 x i8], [188 x i8]* @"user:stake_user,stake_id,original_amount:staked_amount,return_amount,penalty_amount:penalty,penalty_type,rewards_claimed:pending_rewards.checked_add(bpd_bonus).unwrap_or(pending_rewards),}", i64 0, i64 0)), !dbg !1105
  %37 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1106
  ret i8* %0, !dbg !1053
}

define i8* @"math::mul_div.3"(i8* %0, i8* %1, i8* %2) !dbg !1107 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @a, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1109
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @b, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1109
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @c, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1109
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"c>0", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !1111
  %8 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1112
  %9 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1113
  %10 = call i8* @sol.checked_mul.2(i8* %8, i8* %9), !dbg !1114
  %11 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1115
  %12 = call i8* @sol.ok_or.2(i8* %10, i8* %11), !dbg !1116
  %13 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1117
  %14 = call i8* @sol.checked_div.2(i8* %12, i8* %13), !dbg !1118
  %15 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1119
  %16 = call i8* @sol.ok_or.2(i8* %14, i8* %15), !dbg !1120
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0), i8* %16), !dbg !1121
  %17 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0)), !dbg !1122
  %18 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1123
  %19 = call i8* @sol.map_err.2(i8* %17, i8* %18), !dbg !1124
  ret i8* %0, !dbg !1109
}

define i8* @"math::mul_div_up.3"(i8* %0, i8* %1, i8* %2) !dbg !1125 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @a, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1126
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @b, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1126
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @c, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1126
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"c>0", i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"HelixError::DivisionByZero", i64 0, i64 0)), !dbg !1128
  %8 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1129
  %9 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1130
  %10 = call i8* @sol.checked_mul.2(i8* %8, i8* %9), !dbg !1131
  %11 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1132
  %12 = call i8* @sol.ok_or.2(i8* %10, i8* %11), !dbg !1133
  %13 = call i8* @sol.-(i8* %2, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !1134
  %14 = call i8* @sol.typecast(i8* %13, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1135
  %15 = call i8* @sol.checked_add.2(i8* %12, i8* %14), !dbg !1136
  %16 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1137
  %17 = call i8* @sol.ok_or.2(i8* %15, i8* %16), !dbg !1138
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* %17), !dbg !1139
  %18 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1140
  %19 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* %18), !dbg !1141
  %20 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1142
  %21 = call i8* @sol.ok_or.2(i8* %19, i8* %20), !dbg !1143
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0), i8* %21), !dbg !1144
  %22 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0)), !dbg !1145
  %23 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1146
  %24 = call i8* @sol.map_err.2(i8* %22, i8* %23), !dbg !1147
  ret i8* %0, !dbg !1126
}

define i8* @"math::calculate_lpb_bonus.anon.1"(i8* %0) !dbg !1148 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1149
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1151
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1152
  ret i8* %0, !dbg !1149
}

define i8* @"math::calculate_lpb_bonus.anon.2"(i8* %0) !dbg !1153 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1154
  %3 = call i8* @"sol.*"(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"2", i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0)), !dbg !1156
  %4 = call i8* @sol.Ok.1(i8* %3), !dbg !1157
  %5 = call i8* @sol.return.1(i8* %4), !dbg !1158
  ret i8* %0, !dbg !1154
}

define i8* @"math::calculate_lpb_bonus.1"(i8* %0) !dbg !1159 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1160
  %3 = call i8* @"sol.=="(i8* %0, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1162
  %4 = call i8* @sol.if(i8* %3), !dbg !1163
  %5 = call i8* @"sol.math::calculate_lpb_bonus.anon.1"(i8* %4), !dbg !1164
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !1164
  %7 = call i8* @"sol.>="(i8* %0, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @LPB_MAX_DAYS, i64 0, i64 0)), !dbg !1165
  %8 = call i8* @sol.if(i8* %7), !dbg !1166
  %9 = call i8* @"sol.math::calculate_lpb_bonus.anon.2"(i8* %8), !dbg !1167
  %10 = call i8* @sol.ifTrue.anon.(i8* %9), !dbg !1167
  %11 = call i8* @sol.checked_sub.2(i8* %0, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"1", i64 0, i64 0)), !dbg !1168
  %12 = call i8* @sol.ok_or.2(i8* %11, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1169
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @days_minus_one, i64 0, i64 0), i8* %12), !dbg !1170
  %13 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @days_minus_one, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"2", i64 0, i64 0)), !dbg !1171
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1172
  %15 = call i8* @sol.checked_mul.2(i8* %14, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0)), !dbg !1173
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1174
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* %16), !dbg !1175
  %17 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @numerator, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @LPB_MAX_DAYS, i64 0, i64 0)), !dbg !1176
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1177
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %18), !dbg !1178
  %19 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !1179
  ret i8* %0, !dbg !1160
}

define i8* @"math::calculate_bpb_bonus.anon.1"(i8* %0) !dbg !1180 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1181
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1183
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1184
  ret i8* %0, !dbg !1181
}

define i8* @"math::calculate_bpb_bonus.anon.2"(i8* %0) !dbg !1185 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1186
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0)), !dbg !1188
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1189
  ret i8* %0, !dbg !1186
}

define i8* @"math::calculate_bpb_bonus.1"(i8* %0) !dbg !1190 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1191
  %3 = call i8* @"sol.=="(i8* %0, i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1193
  %4 = call i8* @sol.if(i8* %3), !dbg !1194
  %5 = call i8* @"sol.math::calculate_bpb_bonus.anon.1"(i8* %4), !dbg !1195
  %6 = call i8* @sol.ifTrue.anon.(i8* %5), !dbg !1195
  %7 = call i8* @"sol./"(i8* %0, i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"10", i64 0, i64 0)), !dbg !1196
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @amount_div_10, i64 0, i64 0), i8* %7), !dbg !1197
  %8 = call i8* @"sol.>="(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @amount_div_10, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_THRESHOLD, i64 0, i64 0)), !dbg !1198
  %9 = call i8* @sol.if(i8* %8), !dbg !1199
  %10 = call i8* @"sol.math::calculate_bpb_bonus.anon.2"(i8* %9), !dbg !1200
  %11 = call i8* @sol.ifTrue.anon.(i8* %10), !dbg !1200
  %12 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @amount_div_10, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @BPB_THRESHOLD, i64 0, i64 0)), !dbg !1201
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0), i8* %12), !dbg !1202
  %13 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @bonus, i64 0, i64 0)), !dbg !1203
  ret i8* %0, !dbg !1191
}

define i8* @"math::calculate_t_shares.3"(i8* %0, i8* %1, i8* %2) !dbg !1204 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1205
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1205
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1205
  %7 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"share_rate>0", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidParameter", i64 0, i64 0)), !dbg !1207
  %8 = call i8* @sol.calculate_lpb_bonus.1(i8* %1), !dbg !1208
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @lpb_bonus, i64 0, i64 0), i8* %8), !dbg !1209
  %9 = call i8* @sol.calculate_bpb_bonus.1(i8* %0), !dbg !1210
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpb_bonus, i64 0, i64 0), i8* %9), !dbg !1211
  %10 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @PRECISION, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @lpb_bonus, i64 0, i64 0)), !dbg !1212
  %11 = call i8* @sol.ok_or.2(i8* %10, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1213
  %12 = call i8* @sol.checked_add.2(i8* %11, i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bpb_bonus, i64 0, i64 0)), !dbg !1214
  %13 = call i8* @sol.ok_or.2(i8* %12, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1215
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0), i8* %13), !dbg !1216
  %14 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1217
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @amount_u128, i64 0, i64 0), i8* %14), !dbg !1218
  %15 = call i8* @sol.typecast(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @total_multiplier, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1219
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @multiplier_u128, i64 0, i64 0), i8* %15), !dbg !1220
  %16 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1221
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @share_rate_u128, i64 0, i64 0), i8* %16), !dbg !1222
  %17 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @amount_u128, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @multiplier_u128, i64 0, i64 0)), !dbg !1223
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1224
  %19 = call i8* @sol.checked_div.2(i8* %18, i8* getelementptr inbounds ([15 x i8], [15 x i8]* @share_rate_u128, i64 0, i64 0)), !dbg !1225
  %20 = call i8* @sol.ok_or.2(i8* %19, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1226
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @t_shares_u128, i64 0, i64 0), i8* %20), !dbg !1227
  %21 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @t_shares_u128, i64 0, i64 0)), !dbg !1228
  %22 = call i8* @sol.map_err.2(i8* %21, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1229
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* %22), !dbg !1230
  %23 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0)), !dbg !1231
  ret i8* %0, !dbg !1205
}

define i8* @"math::calculate_early_penalty.anon.1"(i8* %0) !dbg !1232 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1233
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1235
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1236
  ret i8* %0, !dbg !1233
}

define i8* @"math::calculate_early_penalty.anon.2"(i8* %0) !dbg !1237 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1238
  ret i8* %0, !dbg !1238
}

define i8* @"math::calculate_early_penalty.anon.3"(i8* %0) !dbg !1240 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1241
  ret i8* %0, !dbg !1241
}

define i8* @"math::calculate_early_penalty.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !1243 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1244
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1244
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1244
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1244
  %9 = call i8* @"sol.>="(i8* %2, i8* %3), !dbg !1246
  %10 = call i8* @sol.if(i8* %9), !dbg !1247
  %11 = call i8* @"sol.math::calculate_early_penalty.anon.1"(i8* %10), !dbg !1248
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !1248
  %13 = call i8* @sol.checked_sub.2(i8* %3, i8* %1), !dbg !1249
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1250
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_duration, i64 0, i64 0), i8* %14), !dbg !1251
  %15 = call i8* @sol.checked_sub.2(i8* %2, i8* %1), !dbg !1252
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1253
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %16), !dbg !1254
  %17 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1255
  %18 = call i8* @sol.ok_or.2(i8* %17, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1256
  %19 = call i8* @sol.checked_div.2(i8* %18, i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_duration, i64 0, i64 0)), !dbg !1257
  %20 = call i8* @sol.ok_or.2(i8* %19, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1258
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @served_fraction_bps, i64 0, i64 0), i8* %20), !dbg !1259
  %21 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @served_fraction_bps, i64 0, i64 0)), !dbg !1260
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1261
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* %22), !dbg !1262
  %23 = call i8* @"sol.<"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* getelementptr inbounds ([15 x i8], [15 x i8]* @MIN_PENALTY_BPS, i64 0, i64 0)), !dbg !1263
  %24 = call i8* @sol.if(i8* %23), !dbg !1264
  %25 = call i8* @"sol.math::calculate_early_penalty.anon.2"(i8* %24), !dbg !1265
  %26 = call i8* @sol.ifTrue.anon.(i8* %25), !dbg !1265
  %27 = call i8* @"sol.math::calculate_early_penalty.anon.3"(i8* %26), !dbg !1266
  %28 = call i8* @sol.ifFalse.anon.(i8* %27), !dbg !1266
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @final_penalty_bps, i64 0, i64 0), i8* %28), !dbg !1267
  %29 = call i8* @sol.mul_div_up.3(i8* %0, i8* getelementptr inbounds ([17 x i8], [17 x i8]* @final_penalty_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1268
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %29), !dbg !1269
  %30 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0)), !dbg !1270
  ret i8* %0, !dbg !1244
}

define i8* @"math::calculate_late_penalty.anon.1"(i8* %0) !dbg !1271 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1272
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1274
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1275
  ret i8* %0, !dbg !1272
}

define i8* @"math::calculate_late_penalty.anon.2"(i8* %0) !dbg !1276 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1277
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1279
  %4 = call i8* @sol.return.1(i8* %3), !dbg !1280
  ret i8* %0, !dbg !1277
}

define i8* @"math::calculate_late_penalty.anon.3"(i8* %0) !dbg !1281 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1282
  ret i8* %0, !dbg !1282
}

define i8* @"math::calculate_late_penalty.anon.4"(i8* %0) !dbg !1284 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1285
  ret i8* %0, !dbg !1285
}

define i8* @"math::calculate_late_penalty.4"(i8* %0, i8* %1, i8* %2, i8* %3) !dbg !1287 {
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1288
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1288
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1288
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1288
  %9 = call i8* @"sol.<="(i8* %2, i8* %1), !dbg !1290
  %10 = call i8* @sol.if(i8* %9), !dbg !1291
  %11 = call i8* @"sol.math::calculate_late_penalty.anon.1"(i8* %10), !dbg !1292
  %12 = call i8* @sol.ifTrue.anon.(i8* %11), !dbg !1292
  %13 = call i8* @sol.checked_sub.2(i8* %2, i8* %1), !dbg !1293
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1294
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @slots_late, i64 0, i64 0), i8* %14), !dbg !1295
  %15 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @slots_late, i64 0, i64 0), i8* %3), !dbg !1296
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1297
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @late_days, i64 0, i64 0), i8* %16), !dbg !1298
  %17 = call i8* @"sol.<="(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @late_days, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @GRACE_PERIOD_DAYS, i64 0, i64 0)), !dbg !1299
  %18 = call i8* @sol.if(i8* %17), !dbg !1300
  %19 = call i8* @"sol.math::calculate_late_penalty.anon.2"(i8* %18), !dbg !1301
  %20 = call i8* @sol.ifTrue.anon.(i8* %19), !dbg !1301
  %21 = call i8* @sol.checked_sub.2(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @late_days, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @GRACE_PERIOD_DAYS, i64 0, i64 0)), !dbg !1302
  %22 = call i8* @sol.ok_or.2(i8* %21, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1303
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @penalty_days, i64 0, i64 0), i8* %22), !dbg !1304
  %23 = call i8* @sol.mul_div.3(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @penalty_days, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @LATE_PENALTY_WINDOW_DAYS, i64 0, i64 0)), !dbg !1305
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* %23), !dbg !1306
  %24 = call i8* @"sol.>"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @penalty_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1307
  %25 = call i8* @sol.if(i8* %24), !dbg !1308
  %26 = call i8* @"sol.math::calculate_late_penalty.anon.3"(i8* %25), !dbg !1309
  %27 = call i8* @sol.ifTrue.anon.(i8* %26), !dbg !1309
  %28 = call i8* @"sol.math::calculate_late_penalty.anon.4"(i8* %27), !dbg !1310
  %29 = call i8* @sol.ifFalse.anon.(i8* %28), !dbg !1310
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @capped_bps, i64 0, i64 0), i8* %29), !dbg !1311
  %30 = call i8* @sol.mul_div_up.3(i8* %0, i8* getelementptr inbounds ([10 x i8], [10 x i8]* @capped_bps, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @BPS_SCALER, i64 0, i64 0)), !dbg !1312
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0), i8* %30), !dbg !1313
  %31 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @penalty_amount, i64 0, i64 0)), !dbg !1314
  ret i8* %0, !dbg !1288
}

define i8* @"math::calculate_pending_rewards.3"(i8* %0, i8* %1, i8* %2) !dbg !1315 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1316
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @current_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1316
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1316
  %7 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1318
  %8 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1319
  %9 = call i8* @sol.checked_mul.2(i8* %7, i8* %8), !dbg !1320
  %10 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1321
  %11 = call i8* @sol.ok_or.2(i8* %9, i8* %10), !dbg !1322
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @current_value, i64 0, i64 0), i8* %11), !dbg !1323
  %12 = call i8* @sol.typecast(i8* %2, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1324
  %13 = call i8* @sol.saturating_sub.2(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @current_value, i64 0, i64 0), i8* %12), !dbg !1325
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @pending_128, i64 0, i64 0), i8* %13), !dbg !1326
  %14 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @pending_128, i64 0, i64 0)), !dbg !1327
  %15 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1328
  %16 = call i8* @sol.map_err.2(i8* %14, i8* %15), !dbg !1329
  ret i8* %0, !dbg !1316
}

define i8* @"math::calculate_reward_debt.2"(i8* %0, i8* %1) !dbg !1330 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1331
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1331
  %5 = call i8* @sol.typecast(i8* %0, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1333
  %6 = call i8* @sol.typecast(i8* %1, i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1334
  %7 = call i8* @sol.checked_mul.2(i8* %5, i8* %6), !dbg !1335
  %8 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1336
  %9 = call i8* @sol.ok_or.2(i8* %7, i8* %8), !dbg !1337
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0), i8* %9), !dbg !1338
  %10 = call i8* @"sol.u64::try_from.1"(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @result, i64 0, i64 0)), !dbg !1339
  %11 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"(HelixError::RewardDebtOverflow)", i64 0, i64 0)), !dbg !1340
  %12 = call i8* @sol.map_err.2(i8* %10, i8* %11), !dbg !1341
  ret i8* %0, !dbg !1331
}

define i8* @"math::get_current_day.3"(i8* %0, i8* %1, i8* %2) !dbg !1342 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @init_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1343
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @current_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1343
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1343
  %7 = call i8* @sol.checked_sub.2(i8* %1, i8* %0), !dbg !1345
  %8 = call i8* @sol.ok_or.2(i8* %7, i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"HelixError::Underflow", i64 0, i64 0)), !dbg !1346
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %8), !dbg !1347
  %9 = call i8* @sol.checked_div.2(i8* getelementptr inbounds ([7 x i8], [7 x i8]* @elapsed, i64 0, i64 0), i8* %2), !dbg !1348
  %10 = call i8* @sol.ok_or.2(i8* %9, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1349
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @day, i64 0, i64 0), i8* %10), !dbg !1350
  %11 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @day, i64 0, i64 0)), !dbg !1351
  ret i8* %0, !dbg !1343
}

define i8* @sol.model.struct.anchor.AdminSetSlotsPerDay(i8* %0) !dbg !1352 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1354
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !1356
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1357
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([53 x i8], [53 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !1358
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1359
  ret i8* %0, !dbg !1354
}

define i8* @"admin_set_slots_per_day::admin_set_slots_per_day.2"(i8* %0, i8* %1) !dbg !1360 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Context<AdminSetSlotsPerDay>", i64 0, i64 0)), !dbg !1361
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @new_slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1361
  %5 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"new_slots_per_day>0", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"HelixError::InvalidParameter", i64 0, i64 0)), !dbg !1363
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([39 x i8], [39 x i8]* @ctx.accounts.global_state.slots_per_day, i64 0, i64 0), i8* %1), !dbg !1364
  %6 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1365
  ret i8* %0, !dbg !1361
}

define i8* @sol.model.struct.anchor.MigrateStake(i8* %0) !dbg !1366 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1368
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1370
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @payer, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1371
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([180 x i8], [180 x i8]* @"mut,seeds=[STAKE_SEED,stake_account.user.as_ref(),&stake_account.stake_id.to_le_bytes()],bump=stake_account.bump,realloc=StakeAccount::LEN,realloc::payer=payer,realloc::zero=false,", i64 0, i64 0)), !dbg !1372
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @stake_account, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"Account<'info,StakeAccount>", i64 0, i64 0)), !dbg !1373
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1374
  ret i8* %0, !dbg !1368
}

define i8* @"migrate_stake::migrate_stake.1"(i8* %0) !dbg !1375 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @_ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<MigrateStake>", i64 0, i64 0)), !dbg !1376
  %3 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1378
  ret i8* %0, !dbg !1376
}

define i8* @sol.model.struct.anchor.InitializeClaimPeriod(i8* %0) !dbg !1379 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1381
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([79 x i8], [79 x i8]* @"mut,constraint=authority.key()==global_state.authority@HelixError::Unauthorized", i64 0, i64 0)), !dbg !1383
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1384
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,", i64 0, i64 0)), !dbg !1385
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1386
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"init,payer=authority,space=ClaimConfig::LEN,seeds=[CLAIM_CONFIG_SEED],bump,", i64 0, i64 0)), !dbg !1387
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,ClaimConfig>", i64 0, i64 0)), !dbg !1388
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1389
  ret i8* %0, !dbg !1381
}

define i8* @"initialize_claim_period::initialize_claim_period.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4) !dbg !1390 {
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Context<InitializeClaimPeriod>", i64 0, i64 0)), !dbg !1391
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !1391
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1391
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_eligible, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1391
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1391
  %11 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"claim_period_id>0", i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"HelixError::InvalidClaimPeriodId", i64 0, i64 0)), !dbg !1393
  %12 = call i8* @"sol.Clock::get.0"(), !dbg !1394
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %12), !dbg !1395
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claim_config, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.claim_config, i64 0, i64 0)), !dbg !1396
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1397
  %13 = call i8* @sol.checked_mul.2(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @CLAIM_PERIOD_DAYS, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0)), !dbg !1398
  %14 = call i8* @sol.ok_or.2(i8* %13, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1399
  %15 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0), i8* %14), !dbg !1400
  %16 = call i8* @sol.ok_or.2(i8* %15, i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"HelixError::Overflow", i64 0, i64 0)), !dbg !1401
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* %16), !dbg !1402
  %17 = call i8* @sol.key.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.authority, i64 0, i64 0)), !dbg !1403
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @claim_config.authority, i64 0, i64 0), i8* %17), !dbg !1404
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.merkle_root, i64 0, i64 0), i8* %1), !dbg !1405
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.total_claimable, i64 0, i64 0), i8* %2), !dbg !1406
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @claim_config.total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1407
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @claim_config.claim_count, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1408
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_config.start_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !1409
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @claim_config.end_slot, i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0)), !dbg !1410
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @claim_config.claim_period_id, i64 0, i64 0), i8* %4), !dbg !1411
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.claim_period_started, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @true, i64 0, i64 0)), !dbg !1412
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !1413
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @claim_config.bpd_total_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1414
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @claim_config.total_eligible, i64 0, i64 0), i8* %3), !dbg !1415
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_config.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.claim_config, i64 0, i64 0)), !dbg !1416
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1417
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1418
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @claim_config.bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1419
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([37 x i8], [37 x i8]* @claim_config.bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @false, i64 0, i64 0)), !dbg !1420
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @claim_config.bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1421
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @claim_config.bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1422
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @claim_config.bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1423
  %18 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"ClaimPeriodStarted{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([120 x i8], [120 x i8]* @"timestamp:clock.unix_timestamp,claim_period_id,merkle_root,total_claimable,total_eligible,claim_deadline_slot:end_slot,}", i64 0, i64 0)), !dbg !1424
  %19 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1425
  ret i8* %0, !dbg !1391
}

define i8* @sol.model.struct.anchor.AdminMint(i8* %0) !dbg !1426 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1428
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1430
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1431
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([129 x i8], [129 x i8]* @"mut,seeds=[GLOBAL_STATE_SEED],bump=global_state.bump,constraint=global_state.authority==authority.key()@HelixError::Unauthorized,", i64 0, i64 0)), !dbg !1432
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1433
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([66 x i8], [66 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump=global_state.mint_authority_bump,", i64 0, i64 0)), !dbg !1434
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !1435
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"mut,seeds=[MINT_SEED],bump,", i64 0, i64 0)), !dbg !1436
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !1437
  %11 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([92 x i8], [92 x i8]* @"mut,constraint=recipient_token_account.mint==global_state.mint@HelixError::InvalidParameter,", i64 0, i64 0)), !dbg !1438
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @recipient_token_account, i64 0, i64 0), i8* getelementptr inbounds ([36 x i8], [36 x i8]* @"InterfaceAccount<'info,TokenAccount>", i64 0, i64 0)), !dbg !1439
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !1440
  ret i8* %0, !dbg !1428
}

define i8* @"admin_mint::admin_mint.2"(i8* %0, i8* %1) !dbg !1441 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<AdminMint>", i64 0, i64 0)), !dbg !1442
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1442
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1444
  %5 = call i8* @sol.checked_add.2(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @global_state.total_admin_minted, i64 0, i64 0), i8* %1), !dbg !1445
  %6 = call i8* @"sol.model.macro.error.!1"(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"(HelixError::Overflow)", i64 0, i64 0)), !dbg !1446
  %7 = call i8* @sol.ok_or.2(i8* %5, i8* %6), !dbg !1447
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @new_total, i64 0, i64 0), i8* %7), !dbg !1448
  %8 = call i8* @"sol.require.!2"(i8* getelementptr inbounds ([38 x i8], [38 x i8]* @"new_total<=global_state.max_admin_mint", i64 0, i64 0), i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"HelixError::AdminMintCapExceeded", i64 0, i64 0)), !dbg !1449
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @global_state.total_admin_minted, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @new_total, i64 0, i64 0)), !dbg !1450
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @mint_authority_seeds, i64 0, i64 0), i8* getelementptr inbounds ([58 x i8], [58 x i8]* @"[MINT_AUTHORITY_SEED,&[global_state.mint_authority_bump],]", i64 0, i64 0)), !dbg !1451
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0), i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"[&mint_authority_seeds[..]]", i64 0, i64 0)), !dbg !1452
  %9 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @ctx.accounts.token_program, i64 0, i64 0)), !dbg !1453
  %10 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !1454
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* %10), !dbg !1455
  %11 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([36 x i8], [36 x i8]* @ctx.accounts.recipient_token_account, i64 0, i64 0)), !dbg !1456
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* %11), !dbg !1457
  %12 = call i8* @sol.to_account_info.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @ctx.accounts.mint_authority, i64 0, i64 0)), !dbg !1458
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* %12), !dbg !1459
  %13 = call i8* @"sol.model.struct.new.token_2022::MintTo.3"(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @to, i64 0, i64 0), i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0)), !dbg !1460
  %14 = call i8* @"sol.CpiContext::new_with_signer.3"(i8* %9, i8* %13, i8* getelementptr inbounds ([12 x i8], [12 x i8]* @signer_seeds, i64 0, i64 0)), !dbg !1461
  %15 = call i8* @"sol.token_2022::mint_to.2"(i8* %14, i8* %1), !dbg !1462
  %16 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"AdminMinted{slot:Clock::get()?.slot", i64 0, i64 0), i8* getelementptr inbounds ([100 x i8], [100 x i8]* @"authority:ctx.accounts.authority.key(),recipient:ctx.accounts.recipient_token_account.key(),amount,}", i64 0, i64 0)), !dbg !1463
  %17 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1464
  ret i8* %0, !dbg !1442
}

define i8* @"lib::initialize.2"(i8* %0, i8* %1) !dbg !1465 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"Context<Initialize>", i64 0, i64 0)), !dbg !1467
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @params, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @InitializeParams, i64 0, i64 0)), !dbg !1467
  %5 = call i8* @"sol.Clock::get.0"(), !dbg !1469
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @clock, i64 0, i64 0), i8* %5), !dbg !1470
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([25 x i8], [25 x i8]* @ctx.accounts.global_state, i64 0, i64 0)), !dbg !1471
  %6 = call i8* @sol.key.1(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.accounts.authority, i64 0, i64 0)), !dbg !1472
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @global_state.authority, i64 0, i64 0), i8* %6), !dbg !1473
  %7 = call i8* @sol.key.1(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @ctx.accounts.mint, i64 0, i64 0)), !dbg !1474
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @global_state.mint, i64 0, i64 0), i8* %7), !dbg !1475
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.mint_authority_bump, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @ctx.bumps.mint_authority, i64 0, i64 0)), !dbg !1476
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @global_state.bump, i64 0, i64 0), i8* getelementptr inbounds ([22 x i8], [22 x i8]* @ctx.bumps.global_state, i64 0, i64 0)), !dbg !1477
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @params.annual_inflation_bp, i64 0, i64 0)), !dbg !1478
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([29 x i8], [29 x i8]* @global_state.min_stake_amount, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @params.min_stake_amount, i64 0, i64 0)), !dbg !1479
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @global_state.share_rate, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @params.starting_share_rate, i64 0, i64 0)), !dbg !1480
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.starting_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @params.starting_share_rate, i64 0, i64 0)), !dbg !1481
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([26 x i8], [26 x i8]* @global_state.slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @params.slots_per_day, i64 0, i64 0)), !dbg !1482
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @global_state.claim_period_days, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @params.claim_period_days, i64 0, i64 0)), !dbg !1483
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @global_state.init_slot, i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @clock.slot, i64 0, i64 0)), !dbg !1484
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_stakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1485
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @global_state.total_unstakes_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1486
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @global_state.total_claims_created, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1487
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @global_state.total_tokens_staked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1488
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @global_state.total_tokens_unstaked, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1489
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @global_state.total_shares, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1490
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @global_state.current_day, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1491
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([31 x i8], [31 x i8]* @global_state.total_admin_minted, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1492
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @global_state.max_admin_mint, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @params.max_admin_mint, i64 0, i64 0)), !dbg !1493
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @global_state.reserved, i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"[0;6]", i64 0, i64 0)), !dbg !1494
  %8 = call i8* @"sol.emit.!2"(i8* getelementptr inbounds ([35 x i8], [35 x i8]* @"ProtocolInitialized{slot:clock.slot", i64 0, i64 0), i8* getelementptr inbounds ([332 x i8], [332 x i8]* @"global_state:global_state.key(),mint:global_state.mint,mint_authority:ctx.accounts.mint_authority.key(),authority:global_state.authority,annual_inflation_bp:global_state.annual_inflation_bp,min_stake_amount:global_state.min_stake_amount,starting_share_rate:global_state.starting_share_rate,slots_per_day:global_state.slots_per_day,}", i64 0, i64 0)), !dbg !1495
  %9 = call i8* @sol.Ok.1(i8* getelementptr inbounds ([2 x i8], [2 x i8]* @"()", i64 0, i64 0)), !dbg !1496
  ret i8* %0, !dbg !1467
}

define i8* @"lib::create_stake.3"(i8* %0, i8* %1, i8* %2) !dbg !1497 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([45 x i8], [45 x i8]* @"Context<'_,'_,'info,'info,CreateStake<'info>>", i64 0, i64 0)), !dbg !1498
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1498
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !1498
  %7 = call i8* @"sol.instructions::create_stake::create_stake.3"(i8* %0, i8* %1, i8* %2), !dbg !1500
  ret i8* %0, !dbg !1498
}

define i8* @"lib::crank_distribution.1"(i8* %0) !dbg !1501 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<CrankDistribution>", i64 0, i64 0)), !dbg !1502
  %3 = call i8* @"sol.instructions::crank_distribution::crank_distribution.1"(i8* %0), !dbg !1504
  ret i8* %0, !dbg !1502
}

define i8* @"lib::unstake.1"(i8* %0) !dbg !1505 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"Context<Unstake>", i64 0, i64 0)), !dbg !1506
  %3 = call i8* @"sol.instructions::unstake::unstake.1"(i8* %0), !dbg !1508
  ret i8* %0, !dbg !1506
}

define i8* @"lib::claim_rewards.1"(i8* %0) !dbg !1509 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<ClaimRewards>", i64 0, i64 0)), !dbg !1510
  %3 = call i8* @"sol.instructions::claim_rewards::claim_rewards.1"(i8* %0), !dbg !1512
  ret i8* %0, !dbg !1510
}

define i8* @"lib::admin_mint.2"(i8* %0, i8* %1) !dbg !1513 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<AdminMint>", i64 0, i64 0)), !dbg !1514
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1514
  %5 = call i8* @"sol.instructions::admin_mint::admin_mint.2"(i8* %0, i8* %1), !dbg !1516
  ret i8* %0, !dbg !1514
}

define i8* @"lib::initialize_claim_period.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4) !dbg !1517 {
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"Context<InitializeClaimPeriod>", i64 0, i64 0)), !dbg !1518
  %7 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !1518
  %8 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1518
  %9 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_eligible, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1518
  %10 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1518
  %11 = call i8* @"sol.instructions::initialize_claim_period::initialize_claim_period.5"(i8* %0, i8* %1, i8* %2, i8* %3, i8* %4), !dbg !1520
  ret i8* %0, !dbg !1518
}

define i8* @"lib::withdraw_vested.1"(i8* %0) !dbg !1521 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"Context<WithdrawVested>", i64 0, i64 0)), !dbg !1522
  %3 = call i8* @"sol.instructions::withdraw_vested::withdraw_vested.1"(i8* %0), !dbg !1524
  ret i8* %0, !dbg !1522
}

define i8* @"lib::trigger_big_pay_day.1"(i8* %0) !dbg !1525 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([50 x i8], [50 x i8]* @"Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>", i64 0, i64 0)), !dbg !1526
  %3 = call i8* @"sol.instructions::trigger_big_pay_day::trigger_big_pay_day.1"(i8* %0), !dbg !1528
  ret i8* %0, !dbg !1526
}

define i8* @"lib::finalize_bpd_calculation.1"(i8* %0) !dbg !1529 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([56 x i8], [56 x i8]* @"Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>", i64 0, i64 0)), !dbg !1530
  %3 = call i8* @"sol.instructions::finalize_bpd_calculation::finalize_bpd_calculation.1"(i8* %0), !dbg !1532
  ret i8* %0, !dbg !1530
}

define i8* @"lib::free_claim.3"(i8* %0, i8* %1, i8* %2) !dbg !1533 {
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"Context<FreeClaim>", i64 0, i64 0)), !dbg !1534
  %5 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @snapshot_balance, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1534
  %6 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @proof, i64 0, i64 0), i8* getelementptr inbounds ([12 x i8], [12 x i8]* @"Vec<[u8;32]>", i64 0, i64 0)), !dbg !1534
  %7 = call i8* @"sol.instructions::free_claim::free_claim.3"(i8* %0, i8* %1, i8* %2), !dbg !1536
  ret i8* %0, !dbg !1534
}

define i8* @"lib::seal_bpd_finalize.2"(i8* %0, i8* %1) !dbg !1537 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<SealBpdFinalize>", i64 0, i64 0)), !dbg !1538
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @expected_finalized_count, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1538
  %5 = call i8* @"sol.instructions::seal_bpd_finalize::seal_bpd_finalize.2"(i8* %0, i8* %1), !dbg !1540
  ret i8* %0, !dbg !1538
}

define i8* @"lib::migrate_stake.1"(i8* %0) !dbg !1541 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Context<MigrateStake>", i64 0, i64 0)), !dbg !1542
  %3 = call i8* @"sol.instructions::migrate_stake::migrate_stake.1"(i8* %0), !dbg !1544
  ret i8* %0, !dbg !1542
}

define i8* @"lib::abort_bpd.1"(i8* %0) !dbg !1545 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([17 x i8], [17 x i8]* @"Context<AbortBpd>", i64 0, i64 0)), !dbg !1546
  %3 = call i8* @"sol.instructions::abort_bpd::abort_bpd.1"(i8* %0), !dbg !1548
  ret i8* %0, !dbg !1546
}

define i8* @"lib::admin_set_claim_end_slot.2"(i8* %0, i8* %1) !dbg !1549 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([29 x i8], [29 x i8]* @"Context<AdminSetClaimEndSlot>", i64 0, i64 0)), !dbg !1550
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @new_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1550
  %5 = call i8* @"sol.instructions::admin_set_claim_end_slot::admin_set_claim_end_slot.2"(i8* %0, i8* %1), !dbg !1552
  ret i8* %0, !dbg !1550
}

define i8* @"lib::admin_set_slots_per_day.2"(i8* %0, i8* %1) !dbg !1553 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"Context<AdminSetSlotsPerDay>", i64 0, i64 0)), !dbg !1554
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @new_slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1554
  %5 = call i8* @"sol.instructions::admin_set_slots_per_day::admin_set_slots_per_day.2"(i8* %0, i8* %1), !dbg !1556
  ret i8* %0, !dbg !1554
}

define i8* @"lib::transfer_authority.2"(i8* %0, i8* %1) !dbg !1557 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Context<TransferAuthority>", i64 0, i64 0)), !dbg !1558
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1558
  %5 = call i8* @"sol.instructions::transfer_authority::transfer_authority.2"(i8* %0, i8* %1), !dbg !1560
  ret i8* %0, !dbg !1558
}

define i8* @"lib::accept_authority.1"(i8* %0) !dbg !1561 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @ctx, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Context<AcceptAuthority>", i64 0, i64 0)), !dbg !1562
  %3 = call i8* @"sol.instructions::accept_authority::accept_authority.1"(i8* %0), !dbg !1564
  ret i8* %0, !dbg !1562
}

define i8* @sol.model.anchor.program.helix_staking(i8* %0) !dbg !1565 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1566
  %3 = call i8* @sol.initialize.2(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"ctx:Context<Initialize>", i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"params:InitializeParams", i64 0, i64 0)), !dbg !1568
  %4 = call i8* @sol.create_stake.3(i8* getelementptr inbounds ([49 x i8], [49 x i8]* @"ctx:Context<'_,'_,'info,'info,CreateStake<'info>>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"amount:u64", i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"days:u16", i64 0, i64 0)), !dbg !1569
  %5 = call i8* @sol.crank_distribution.1(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx:Context<CrankDistribution>", i64 0, i64 0)), !dbg !1570
  %6 = call i8* @sol.unstake.1(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"ctx:Context<Unstake>", i64 0, i64 0)), !dbg !1571
  %7 = call i8* @sol.claim_rewards.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"ctx:Context<ClaimRewards>", i64 0, i64 0)), !dbg !1572
  %8 = call i8* @sol.admin_mint.2(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"ctx:Context<AdminMint>", i64 0, i64 0), i8* getelementptr inbounds ([10 x i8], [10 x i8]* @"amount:u64", i64 0, i64 0)), !dbg !1573
  %9 = call i8* @sol.initialize_claim_period.5(i8* getelementptr inbounds ([34 x i8], [34 x i8]* @"ctx:Context<InitializeClaimPeriod>", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"merkle_root:[u8;32]", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"total_claimable:u64", i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"total_eligible:u32", i64 0, i64 0), i8* getelementptr inbounds ([19 x i8], [19 x i8]* @"claim_period_id:u32", i64 0, i64 0)), !dbg !1574
  %10 = call i8* @sol.withdraw_vested.1(i8* getelementptr inbounds ([27 x i8], [27 x i8]* @"ctx:Context<WithdrawVested>", i64 0, i64 0)), !dbg !1575
  %11 = call i8* @sol.trigger_big_pay_day.1(i8* getelementptr inbounds ([54 x i8], [54 x i8]* @"ctx:Context<'_,'_,'info,'info,TriggerBigPayDay<'info>>", i64 0, i64 0)), !dbg !1576
  %12 = call i8* @sol.finalize_bpd_calculation.1(i8* getelementptr inbounds ([60 x i8], [60 x i8]* @"ctx:Context<'_,'_,'info,'info,FinalizeBpdCalculation<'info>>", i64 0, i64 0)), !dbg !1577
  %13 = call i8* @sol.free_claim.3(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @"ctx:Context<FreeClaim>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"snapshot_balance:u64", i64 0, i64 0), i8* getelementptr inbounds ([18 x i8], [18 x i8]* @"proof:Vec<[u8;32]>", i64 0, i64 0)), !dbg !1578
  %14 = call i8* @sol.seal_bpd_finalize.2(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"ctx:Context<SealBpdFinalize>", i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"expected_finalized_count:u32", i64 0, i64 0)), !dbg !1579
  %15 = call i8* @sol.migrate_stake.1(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @"ctx:Context<MigrateStake>", i64 0, i64 0)), !dbg !1580
  %16 = call i8* @sol.abort_bpd.1(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"ctx:Context<AbortBpd>", i64 0, i64 0)), !dbg !1581
  %17 = call i8* @sol.admin_set_claim_end_slot.2(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"ctx:Context<AdminSetClaimEndSlot>", i64 0, i64 0), i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"new_end_slot:u64", i64 0, i64 0)), !dbg !1582
  %18 = call i8* @sol.admin_set_slots_per_day.2(i8* getelementptr inbounds ([32 x i8], [32 x i8]* @"ctx:Context<AdminSetSlotsPerDay>", i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"new_slots_per_day:u64", i64 0, i64 0)), !dbg !1583
  %19 = call i8* @sol.transfer_authority.2(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @"ctx:Context<TransferAuthority>", i64 0, i64 0), i8* getelementptr inbounds ([20 x i8], [20 x i8]* @"new_authority:Pubkey", i64 0, i64 0)), !dbg !1584
  %20 = call i8* @sol.accept_authority.1(i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"ctx:Context<AcceptAuthority>", i64 0, i64 0)), !dbg !1585
  ret i8* %0, !dbg !1566
}

define i8* @main(i8* %0) !dbg !1586 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1587
  %3 = call i8* @sol.model.anchor.program.helix_staking(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @program_id, i64 0, i64 0)), !dbg !1587
  ret i8* %0, !dbg !1587
}

define i8* @sol.model.struct.InitializeParams(i8* %0) !dbg !1589 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1590
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1592
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_stake_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1593
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @starting_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1594
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1595
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_period_days, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1596
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @max_admin_mint, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1597
  ret i8* %0, !dbg !1590
}

define i8* @sol.model.struct.anchor.Initialize(i8* %0) !dbg !1598 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1599
  %3 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([3 x i8], [3 x i8]* @mut, i64 0, i64 0)), !dbg !1601
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([13 x i8], [13 x i8]* @"Signer<'info>", i64 0, i64 0)), !dbg !1602
  %5 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([75 x i8], [75 x i8]* @"init,payer=authority,space=GlobalState::LEN,seeds=[GLOBAL_STATE_SEED],bump,", i64 0, i64 0)), !dbg !1603
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @global_state, i64 0, i64 0), i8* getelementptr inbounds ([26 x i8], [26 x i8]* @"Account<'info,GlobalState>", i64 0, i64 0)), !dbg !1604
  %7 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([33 x i8], [33 x i8]* @"seeds=[MINT_AUTHORITY_SEED],bump,", i64 0, i64 0)), !dbg !1605
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @mint_authority, i64 0, i64 0), i8* getelementptr inbounds ([23 x i8], [23 x i8]* @"UncheckedAccount<'info>", i64 0, i64 0)), !dbg !1606
  %9 = call i8* @sol.model.struct.constraint(i8* getelementptr inbounds ([139 x i8], [139 x i8]* @"init,payer=authority,seeds=[MINT_SEED],bump,mint::decimals=TOKEN_DECIMALS,mint::authority=mint_authority,mint::token_program=token_program,", i64 0, i64 0)), !dbg !1607
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([28 x i8], [28 x i8]* @"InterfaceAccount<'info,Mint>", i64 0, i64 0)), !dbg !1608
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @token_program, i64 0, i64 0), i8* getelementptr inbounds ([24 x i8], [24 x i8]* @"Program<'info,Token2022>", i64 0, i64 0)), !dbg !1609
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @system_program, i64 0, i64 0), i8* getelementptr inbounds ([21 x i8], [21 x i8]* @"Program<'info,System>", i64 0, i64 0)), !dbg !1610
  ret i8* %0, !dbg !1599
}

define i8* @sol.model.struct.anchor.ClaimConfig(i8* %0) !dbg !1611 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1613
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1615
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @merkle_root, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u8;32]", i64 0, i64 0)), !dbg !1616
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @total_claimable, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1617
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @total_claimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1618
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @claim_count, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1619
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1620
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1621
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1622
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @claim_period_started, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1623
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @big_pay_day_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1624
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @bpd_total_distributed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1625
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @total_eligible, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1626
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1627
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @bpd_remaining_unclaimed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1628
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @bpd_total_share_days, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1629
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @bpd_helix_per_share_day, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @u128, i64 0, i64 0)), !dbg !1630
  %19 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([24 x i8], [24 x i8]* @bpd_calculation_complete, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1631
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @bpd_snapshot_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1632
  %21 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @bpd_stakes_finalized, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1633
  %22 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @bpd_stakes_distributed, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1634
  ret i8* %0, !dbg !1613
}

define i8* @sol.model.struct.anchor.StakeAccount(i8* %0) !dbg !1635 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1637
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @user, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1639
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @stake_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1640
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @staked_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1641
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @t_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1642
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1643
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1644
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @stake_days, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !1645
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @reward_debt, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1646
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @is_active, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1647
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1648
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @bpd_bonus_pending, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1649
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @bpd_eligible, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1650
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([23 x i8], [23 x i8]* @claim_period_start_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1651
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @bpd_claim_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1652
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @bpd_finalize_period_id, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u32, i64 0, i64 0)), !dbg !1653
  ret i8* %0, !dbg !1637
}

define i8* @sol.model.struct.anchor.PendingAuthority(i8* %0) !dbg !1654 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1656
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @new_authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1658
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1659
  ret i8* %0, !dbg !1656
}

define i8* @sol.model.struct.anchor.GlobalState(i8* %0) !dbg !1660 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1662
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @authority, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1664
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @mint, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1665
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @mint_authority_bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1666
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1667
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @annual_inflation_bp, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1668
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @min_stake_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1669
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1670
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @starting_share_rate, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1671
  %11 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @slots_per_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1672
  %12 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([17 x i8], [17 x i8]* @claim_period_days, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1673
  %13 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @init_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1674
  %14 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @total_stakes_created, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1675
  %15 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([22 x i8], [22 x i8]* @total_unstakes_created, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1676
  %16 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @total_claims_created, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1677
  %17 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([19 x i8], [19 x i8]* @total_tokens_staked, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1678
  %18 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([21 x i8], [21 x i8]* @total_tokens_unstaked, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1679
  %19 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @total_shares, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1680
  %20 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([11 x i8], [11 x i8]* @current_day, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1681
  %21 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([18 x i8], [18 x i8]* @total_admin_minted, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1682
  %22 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @max_admin_mint, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1683
  %23 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @reserved, i64 0, i64 0), i8* getelementptr inbounds ([7 x i8], [7 x i8]* @"[u64;6]", i64 0, i64 0)), !dbg !1684
  ret i8* %0, !dbg !1662
}

define i8* @"global_state::GlobalState::is_bpd_window_active.1"(i8* %0) !dbg !1685 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"&self", i64 0, i64 0), i8* getelementptr inbounds ([5 x i8], [5 x i8]* @"&self", i64 0, i64 0)), !dbg !1686
  %3 = call i8* @"sol.!="(i8* getelementptr inbounds ([13 x i8], [13 x i8]* @self.reserved, i64 0, i64 0), i8* getelementptr inbounds ([1 x i8], [1 x i8]* @"0", i64 0, i64 0)), !dbg !1688
  ret i8* %0, !dbg !1686
}

define i8* @"global_state::GlobalState::set_bpd_window_active.anon.1"(i8* %0) !dbg !1689 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1690
  ret i8* %0, !dbg !1690
}

define i8* @"global_state::GlobalState::set_bpd_window_active.anon.2"(i8* %0) !dbg !1692 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1693
  ret i8* %0, !dbg !1693
}

define i8* @"global_state::GlobalState::set_bpd_window_active.2"(i8* %0, i8* %1) !dbg !1695 {
  %3 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"&mutself", i64 0, i64 0), i8* getelementptr inbounds ([8 x i8], [8 x i8]* @"&mutself", i64 0, i64 0)), !dbg !1696
  %4 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([6 x i8], [6 x i8]* @active, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1696
  %5 = call i8* @sol.if(i8* %1), !dbg !1698
  %6 = call i8* @"sol.global_state::GlobalState::set_bpd_window_active.anon.1"(i8* %5), !dbg !1699
  %7 = call i8* @sol.ifTrue.anon.(i8* %6), !dbg !1699
  %8 = call i8* @"sol.global_state::GlobalState::set_bpd_window_active.anon.2"(i8* %7), !dbg !1700
  %9 = call i8* @sol.ifFalse.anon.(i8* %8), !dbg !1700
  call void @sol.model.opaqueAssign(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @"self.reserved[0]", i64 0, i64 0), i8* %9), !dbg !1701
  ret i8* %0, !dbg !1696
}

define i8* @sol.model.struct.anchor.ClaimStatus(i8* %0) !dbg !1702 {
  %2 = call i8* @sol.model.funcArg(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @parser.error, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @"*i8", i64 0, i64 0)), !dbg !1704
  %3 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([10 x i8], [10 x i8]* @is_claimed, i64 0, i64 0), i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bool, i64 0, i64 0)), !dbg !1706
  %4 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @claimed_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1707
  %5 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([12 x i8], [12 x i8]* @claimed_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1708
  %6 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([9 x i8], [9 x i8]* @bonus_bps, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u16, i64 0, i64 0)), !dbg !1709
  %7 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @withdrawn_amount, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1710
  %8 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([16 x i8], [16 x i8]* @vesting_end_slot, i64 0, i64 0), i8* getelementptr inbounds ([3 x i8], [3 x i8]* @u64, i64 0, i64 0)), !dbg !1711
  %9 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @snapshot_wallet, i64 0, i64 0), i8* getelementptr inbounds ([6 x i8], [6 x i8]* @Pubkey, i64 0, i64 0)), !dbg !1712
  %10 = call i8* @sol.model.struct.field(i8* getelementptr inbounds ([4 x i8], [4 x i8]* @bump, i64 0, i64 0), i8* getelementptr inbounds ([2 x i8], [2 x i8]* @u8, i64 0, i64 0)), !dbg !1713
  ret i8* %0, !dbg !1704
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
!65 = distinct !DISubprogram(name: "sol.model.struct.anchor.TriggerBigPayDay", linkageName: "sol.model.struct.anchor.TriggerBigPayDay", scope: null, file: !66, line: 13, type: !5, scopeLine: 13, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!66 = !DIFile(filename: "programs/helix-staking/src/instructions/trigger_big_pay_day.rs", directory: "/workspace")
!67 = !DILocation(line: 13, column: 4, scope: !68)
!68 = !DILexicalBlockFile(scope: !65, file: !66, discriminator: 0)
!69 = !DILocation(line: 15, column: 8, scope: !68)
!70 = !DILocation(line: 17, column: 6, scope: !68)
!71 = !DILocation(line: 22, column: 8, scope: !68)
!72 = !DILocation(line: 24, column: 6, scope: !68)
!73 = !DILocation(line: 32, column: 8, scope: !68)
!74 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.1", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.1", scope: null, file: !66, line: 57, type: !5, scopeLine: 57, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!75 = !DILocation(line: 57, column: 32, scope: !76)
!76 = !DILexicalBlockFile(scope: !74, file: !66, discriminator: 0)
!77 = !DILocation(line: 58, column: 8, scope: !76)
!78 = !DILocation(line: 59, column: 21, scope: !76)
!79 = !DILocation(line: 60, column: 8, scope: !76)
!80 = !DILocation(line: 68, column: 15, scope: !76)
!81 = !DILocation(line: 68, column: 8, scope: !76)
!82 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.3", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.3", scope: null, file: !66, line: 78, type: !5, scopeLine: 78, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!83 = !DILocation(line: 78, column: 35, scope: !84)
!84 = !DILexicalBlockFile(scope: !82, file: !66, discriminator: 0)
!85 = !DILocation(line: 79, column: 12, scope: !84)
!86 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.4", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.4", scope: null, file: !66, line: 83, type: !5, scopeLine: 83, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!87 = !DILocation(line: 83, column: 46, scope: !88)
!88 = !DILexicalBlockFile(scope: !86, file: !66, discriminator: 0)
!89 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.5", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.5", scope: null, file: !66, line: 89, type: !5, scopeLine: 89, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!90 = !DILocation(line: 89, column: 42, scope: !91)
!91 = !DILexicalBlockFile(scope: !89, file: !66, discriminator: 0)
!92 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.6", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.6", scope: null, file: !66, line: 110, type: !5, scopeLine: 110, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!93 = !DILocation(line: 110, column: 80, scope: !94)
!94 = !DILexicalBlockFile(scope: !92, file: !66, discriminator: 0)
!95 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.7", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.7", scope: null, file: !66, line: 116, type: !5, scopeLine: 116, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!96 = !DILocation(line: 116, column: 69, scope: !97)
!97 = !DILexicalBlockFile(scope: !95, file: !66, discriminator: 0)
!98 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.8", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.8", scope: null, file: !66, line: 121, type: !5, scopeLine: 121, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!99 = !DILocation(line: 121, column: 72, scope: !100)
!100 = !DILexicalBlockFile(scope: !98, file: !66, discriminator: 0)
!101 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.9", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.9", scope: null, file: !66, line: 129, type: !5, scopeLine: 129, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!102 = !DILocation(line: 129, column: 28, scope: !103)
!103 = !DILexicalBlockFile(scope: !101, file: !66, discriminator: 0)
!104 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.10", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.10", scope: null, file: !66, line: 133, type: !5, scopeLine: 133, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!105 = !DILocation(line: 133, column: 54, scope: !106)
!106 = !DILexicalBlockFile(scope: !104, file: !66, discriminator: 0)
!107 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.11", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.11", scope: null, file: !66, line: 137, type: !5, scopeLine: 137, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!108 = !DILocation(line: 137, column: 52, scope: !109)
!109 = !DILexicalBlockFile(scope: !107, file: !66, discriminator: 0)
!110 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.12", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.12", scope: null, file: !66, line: 148, type: !5, scopeLine: 148, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!111 = !DILocation(line: 148, column: 28, scope: !112)
!112 = !DILexicalBlockFile(scope: !110, file: !66, discriminator: 0)
!113 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.2", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.2", scope: null, file: !66, line: 77, type: !5, scopeLine: 77, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!114 = !DILocation(line: 77, column: 71, scope: !115)
!115 = !DILexicalBlockFile(scope: !113, file: !66, discriminator: 0)
!116 = !DILocation(line: 78, column: 11, scope: !115)
!117 = !DILocation(line: 78, column: 8, scope: !115)
!118 = !DILocation(line: 78, column: 35, scope: !115)
!119 = !DILocation(line: 83, column: 34, scope: !115)
!120 = !DILocation(line: 83, column: 11, scope: !115)
!121 = !DILocation(line: 83, column: 8, scope: !115)
!122 = !DILocation(line: 83, column: 46, scope: !115)
!123 = !DILocation(line: 88, column: 32, scope: !115)
!124 = !DILocation(line: 88, column: 8, scope: !115)
!125 = !DILocation(line: 89, column: 16, scope: !115)
!126 = !DILocation(line: 89, column: 11, scope: !115)
!127 = !DILocation(line: 89, column: 8, scope: !115)
!128 = !DILocation(line: 89, column: 42, scope: !115)
!129 = !DILocation(line: 94, column: 20, scope: !115)
!130 = !DILocation(line: 94, column: 8, scope: !115)
!131 = !DILocation(line: 98, column: 8, scope: !115)
!132 = !DILocation(line: 108, column: 13, scope: !115)
!133 = !DILocation(line: 101, column: 27, scope: !115)
!134 = !DILocation(line: 101, column: 8, scope: !115)
!135 = !DILocation(line: 110, column: 24, scope: !115)
!136 = !DILocation(line: 110, column: 49, scope: !115)
!137 = !DILocation(line: 110, column: 71, scope: !115)
!138 = !DILocation(line: 110, column: 36, scope: !115)
!139 = !DILocation(line: 110, column: 11, scope: !115)
!140 = !DILocation(line: 110, column: 8, scope: !115)
!141 = !DILocation(line: 110, column: 80, scope: !115)
!142 = !DILocation(line: 116, column: 11, scope: !115)
!143 = !DILocation(line: 116, column: 8, scope: !115)
!144 = !DILocation(line: 116, column: 69, scope: !115)
!145 = !DILocation(line: 121, column: 11, scope: !115)
!146 = !DILocation(line: 121, column: 8, scope: !115)
!147 = !DILocation(line: 121, column: 72, scope: !115)
!148 = !DILocation(line: 129, column: 11, scope: !115)
!149 = !DILocation(line: 129, column: 8, scope: !115)
!150 = !DILocation(line: 129, column: 28, scope: !115)
!151 = !DILocation(line: 133, column: 11, scope: !115)
!152 = !DILocation(line: 133, column: 8, scope: !115)
!153 = !DILocation(line: 133, column: 54, scope: !115)
!154 = !DILocation(line: 137, column: 11, scope: !115)
!155 = !DILocation(line: 137, column: 8, scope: !115)
!156 = !DILocation(line: 137, column: 52, scope: !115)
!157 = !DILocation(line: 142, column: 24, scope: !115)
!158 = !DILocation(line: 142, column: 8, scope: !115)
!159 = !DILocation(line: 144, column: 13, scope: !115)
!160 = !DILocation(line: 145, column: 13, scope: !115)
!161 = !DILocation(line: 146, column: 13, scope: !115)
!162 = !DILocation(line: 143, column: 8, scope: !115)
!163 = !DILocation(line: 148, column: 11, scope: !115)
!164 = !DILocation(line: 148, column: 8, scope: !115)
!165 = !DILocation(line: 148, column: 28, scope: !115)
!166 = !DILocation(line: 153, column: 26, scope: !115)
!167 = !DILocation(line: 154, column: 25, scope: !115)
!168 = !DILocation(line: 154, column: 13, scope: !115)
!169 = !DILocation(line: 155, column: 13, scope: !115)
!170 = !DILocation(line: 153, column: 8, scope: !115)
!171 = !DILocation(line: 157, column: 24, scope: !115)
!172 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.13", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.13", scope: null, file: !66, line: 162, type: !5, scopeLine: 162, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!173 = !DILocation(line: 162, column: 34, scope: !174)
!174 = !DILexicalBlockFile(scope: !172, file: !66, discriminator: 0)
!175 = !DILocation(line: 163, column: 15, scope: !174)
!176 = !DILocation(line: 163, column: 8, scope: !174)
!177 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.15", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.15", scope: null, file: !66, line: 184, type: !5, scopeLine: 184, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!178 = !DILocation(line: 184, column: 22, scope: !179)
!179 = !DILexicalBlockFile(scope: !177, file: !66, discriminator: 0)
!180 = !DILocation(line: 186, column: 17, scope: !179)
!181 = !DILocation(line: 187, column: 17, scope: !179)
!182 = !DILocation(line: 185, column: 12, scope: !179)
!183 = !DILocation(line: 190, column: 35, scope: !179)
!184 = !DILocation(line: 189, column: 42, scope: !179)
!185 = !DILocation(line: 189, column: 12, scope: !179)
!186 = !DILocation(line: 192, column: 12, scope: !179)
!187 = !DILocation(line: 193, column: 55, scope: !179)
!188 = !DILocation(line: 193, column: 18, scope: !179)
!189 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.14", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.14", scope: null, file: !66, line: 170, type: !5, scopeLine: 170, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!190 = !DILocation(line: 170, column: 52, scope: !191)
!191 = !DILexicalBlockFile(scope: !189, file: !66, discriminator: 0)
!192 = !DILocation(line: 171, column: 8, scope: !191)
!193 = !DILocation(line: 176, column: 13, scope: !191)
!194 = !DILocation(line: 177, column: 13, scope: !191)
!195 = !DILocation(line: 178, column: 25, scope: !191)
!196 = !DILocation(line: 178, column: 13, scope: !191)
!197 = !DILocation(line: 179, column: 13, scope: !191)
!198 = !DILocation(line: 175, column: 8, scope: !191)
!199 = !DILocation(line: 182, column: 20, scope: !191)
!200 = !DILocation(line: 182, column: 58, scope: !191)
!201 = !DILocation(line: 182, column: 46, scope: !191)
!202 = !DILocation(line: 182, column: 8, scope: !191)
!203 = !DILocation(line: 184, column: 11, scope: !191)
!204 = !DILocation(line: 184, column: 8, scope: !191)
!205 = !DILocation(line: 184, column: 22, scope: !191)
!206 = !DILocation(line: 199, column: 31, scope: !191)
!207 = !DILocation(line: 198, column: 38, scope: !191)
!208 = !DILocation(line: 198, column: 8, scope: !191)
!209 = !DILocation(line: 202, column: 13, scope: !191)
!210 = !DILocation(line: 203, column: 13, scope: !191)
!211 = !DILocation(line: 201, column: 8, scope: !191)
!212 = !DILocation(line: 207, column: 8, scope: !191)
!213 = !DILocation(line: 209, column: 51, scope: !191)
!214 = !DILocation(line: 209, column: 14, scope: !191)
!215 = !DILocation(line: 212, column: 13, scope: !191)
!216 = !DILocation(line: 213, column: 13, scope: !191)
!217 = !DILocation(line: 211, column: 8, scope: !191)
!218 = !DILocation(line: 216, column: 13, scope: !191)
!219 = !DILocation(line: 217, column: 13, scope: !191)
!220 = !DILocation(line: 215, column: 8, scope: !191)
!221 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.anon.16", linkageName: "trigger_big_pay_day::trigger_big_pay_day.anon.16", scope: null, file: !66, line: 236, type: !5, scopeLine: 236, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!222 = !DILocation(line: 236, column: 80, scope: !223)
!223 = !DILexicalBlockFile(scope: !221, file: !66, discriminator: 0)
!224 = !DILocation(line: 237, column: 8, scope: !223)
!225 = !DILocation(line: 238, column: 8, scope: !223)
!226 = !DILocation(line: 239, column: 21, scope: !223)
!227 = !DILocation(line: 241, column: 8, scope: !223)
!228 = distinct !DISubprogram(name: "trigger_big_pay_day::trigger_big_pay_day.1", linkageName: "trigger_big_pay_day::trigger_big_pay_day.1", scope: null, file: !66, line: 38, type: !5, scopeLine: 38, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!229 = !DILocation(line: 38, column: 4, scope: !230)
!230 = !DILexicalBlockFile(scope: !228, file: !66, discriminator: 0)
!231 = !DILocation(line: 41, column: 16, scope: !230)
!232 = !DILocation(line: 41, column: 4, scope: !230)
!233 = !DILocation(line: 42, column: 4, scope: !230)
!234 = !DILocation(line: 43, column: 4, scope: !230)
!235 = !DILocation(line: 46, column: 4, scope: !230)
!236 = !DILocation(line: 53, column: 4, scope: !230)
!237 = !DILocation(line: 54, column: 4, scope: !230)
!238 = !DILocation(line: 57, column: 7, scope: !230)
!239 = !DILocation(line: 57, column: 4, scope: !230)
!240 = !DILocation(line: 57, column: 32, scope: !230)
!241 = !DILocation(line: 75, column: 50, scope: !230)
!242 = !DILocation(line: 75, column: 4, scope: !230)
!243 = !DILocation(line: 77, column: 4, scope: !230)
!244 = !DILocation(line: 162, column: 23, scope: !230)
!245 = !DILocation(line: 162, column: 4, scope: !230)
!246 = !DILocation(line: 162, column: 34, scope: !230)
!247 = !DILocation(line: 167, column: 4, scope: !230)
!248 = !DILocation(line: 168, column: 4, scope: !230)
!249 = !DILocation(line: 170, column: 4, scope: !230)
!250 = !DILocation(line: 222, column: 9, scope: !230)
!251 = !DILocation(line: 223, column: 9, scope: !230)
!252 = !DILocation(line: 221, column: 4, scope: !230)
!253 = !DILocation(line: 226, column: 9, scope: !230)
!254 = !DILocation(line: 227, column: 9, scope: !230)
!255 = !DILocation(line: 225, column: 4, scope: !230)
!256 = !DILocation(line: 231, column: 9, scope: !230)
!257 = !DILocation(line: 232, column: 9, scope: !230)
!258 = !DILocation(line: 230, column: 4, scope: !230)
!259 = !DILocation(line: 236, column: 7, scope: !230)
!260 = !DILocation(line: 236, column: 4, scope: !230)
!261 = !DILocation(line: 236, column: 80, scope: !230)
!262 = !DILocation(line: 252, column: 4, scope: !230)
!263 = !DILocation(line: 262, column: 4, scope: !230)
!264 = distinct !DISubprogram(name: "sol.model.struct.anchor.WithdrawVested", linkageName: "sol.model.struct.anchor.WithdrawVested", scope: null, file: !265, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!265 = !DIFile(filename: "programs/helix-staking/src/instructions/withdraw_vested.rs", directory: "/workspace")
!266 = !DILocation(line: 12, column: 4, scope: !267)
!267 = !DILexicalBlockFile(scope: !264, file: !265, discriminator: 0)
!268 = !DILocation(line: 13, column: 6, scope: !267)
!269 = !DILocation(line: 14, column: 8, scope: !267)
!270 = !DILocation(line: 16, column: 6, scope: !267)
!271 = !DILocation(line: 20, column: 8, scope: !267)
!272 = !DILocation(line: 22, column: 6, scope: !267)
!273 = !DILocation(line: 26, column: 8, scope: !267)
!274 = !DILocation(line: 28, column: 6, scope: !267)
!275 = !DILocation(line: 39, column: 8, scope: !267)
!276 = !DILocation(line: 41, column: 6, scope: !267)
!277 = !DILocation(line: 47, column: 8, scope: !267)
!278 = !DILocation(line: 49, column: 6, scope: !267)
!279 = !DILocation(line: 54, column: 8, scope: !267)
!280 = !DILocation(line: 57, column: 6, scope: !267)
!281 = !DILocation(line: 61, column: 8, scope: !267)
!282 = !DILocation(line: 63, column: 8, scope: !267)
!283 = distinct !DISubprogram(name: "withdraw_vested::withdraw_vested.1", linkageName: "withdraw_vested::withdraw_vested.1", scope: null, file: !265, line: 66, type: !5, scopeLine: 66, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!284 = !DILocation(line: 66, column: 4, scope: !285)
!285 = !DILexicalBlockFile(scope: !283, file: !265, discriminator: 0)
!286 = !DILocation(line: 67, column: 16, scope: !285)
!287 = !DILocation(line: 67, column: 4, scope: !285)
!288 = !DILocation(line: 68, column: 4, scope: !285)
!289 = !DILocation(line: 69, column: 4, scope: !285)
!290 = !DILocation(line: 72, column: 23, scope: !285)
!291 = !DILocation(line: 72, column: 4, scope: !285)
!292 = !DILocation(line: 81, column: 9, scope: !285)
!293 = !DILocation(line: 82, column: 9, scope: !285)
!294 = !DILocation(line: 80, column: 4, scope: !285)
!295 = !DILocation(line: 84, column: 4, scope: !285)
!296 = !DILocation(line: 88, column: 9, scope: !285)
!297 = !DILocation(line: 89, column: 9, scope: !285)
!298 = !DILocation(line: 87, column: 4, scope: !285)
!299 = !DILocation(line: 90, column: 4, scope: !285)
!300 = !DILocation(line: 93, column: 4, scope: !285)
!301 = !DILocation(line: 94, column: 4, scope: !285)
!302 = !DILocation(line: 98, column: 39, scope: !285)
!303 = !DILocation(line: 100, column: 40, scope: !285)
!304 = !DILocation(line: 100, column: 16, scope: !285)
!305 = !DILocation(line: 101, column: 55, scope: !285)
!306 = !DILocation(line: 101, column: 16, scope: !285)
!307 = !DILocation(line: 102, column: 55, scope: !285)
!308 = !DILocation(line: 102, column: 16, scope: !285)
!309 = !DILocation(line: 99, column: 12, scope: !285)
!310 = !DILocation(line: 97, column: 8, scope: !285)
!311 = !DILocation(line: 96, column: 4, scope: !285)
!312 = !DILocation(line: 110, column: 4, scope: !285)
!313 = !DILocation(line: 120, column: 4, scope: !285)
!314 = distinct !DISubprogram(name: "withdraw_vested::calculate_vested_amount.anon.1", linkageName: "withdraw_vested::calculate_vested_amount.anon.1", scope: null, file: !265, line: 136, type: !5, scopeLine: 136, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!315 = !DILocation(line: 136, column: 40, scope: !316)
!316 = !DILexicalBlockFile(scope: !314, file: !265, discriminator: 0)
!317 = !DILocation(line: 137, column: 15, scope: !316)
!318 = !DILocation(line: 137, column: 8, scope: !316)
!319 = distinct !DISubprogram(name: "withdraw_vested::calculate_vested_amount.anon.2", linkageName: "withdraw_vested::calculate_vested_amount.anon.2", scope: null, file: !265, line: 141, type: !5, scopeLine: 141, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!320 = !DILocation(line: 141, column: 36, scope: !321)
!321 = !DILexicalBlockFile(scope: !319, file: !265, discriminator: 0)
!322 = !DILocation(line: 142, column: 15, scope: !321)
!323 = !DILocation(line: 142, column: 8, scope: !321)
!324 = distinct !DISubprogram(name: "withdraw_vested::calculate_vested_amount.4", linkageName: "withdraw_vested::calculate_vested_amount.4", scope: null, file: !265, line: 126, type: !5, scopeLine: 126, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!325 = !DILocation(line: 126, scope: !326)
!326 = !DILexicalBlockFile(scope: !324, file: !265, discriminator: 0)
!327 = !DILocation(line: 133, column: 20, scope: !326)
!328 = !DILocation(line: 133, column: 4, scope: !326)
!329 = !DILocation(line: 136, column: 7, scope: !326)
!330 = !DILocation(line: 136, column: 4, scope: !326)
!331 = !DILocation(line: 136, column: 40, scope: !326)
!332 = !DILocation(line: 141, column: 7, scope: !326)
!333 = !DILocation(line: 141, column: 4, scope: !326)
!334 = !DILocation(line: 141, column: 36, scope: !326)
!335 = !DILocation(line: 147, column: 9, scope: !326)
!336 = !DILocation(line: 148, column: 9, scope: !326)
!337 = !DILocation(line: 146, column: 4, scope: !326)
!338 = !DILocation(line: 151, column: 9, scope: !326)
!339 = !DILocation(line: 152, column: 9, scope: !326)
!340 = !DILocation(line: 150, column: 4, scope: !326)
!341 = !DILocation(line: 156, column: 9, scope: !326)
!342 = !DILocation(line: 157, column: 9, scope: !326)
!343 = !DILocation(line: 155, column: 4, scope: !326)
!344 = !DILocation(line: 160, column: 27, scope: !326)
!345 = !DILocation(line: 160, column: 4, scope: !326)
!346 = !DILocation(line: 164, column: 9, scope: !326)
!347 = !DILocation(line: 165, column: 36, scope: !326)
!348 = !DILocation(line: 165, column: 9, scope: !326)
!349 = distinct !DISubprogram(name: "sol.model.struct.anchor.FinalizeBpdCalculation", linkageName: "sol.model.struct.anchor.FinalizeBpdCalculation", scope: null, file: !350, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!350 = !DIFile(filename: "programs/helix-staking/src/instructions/finalize_bpd_calculation.rs", directory: "/workspace")
!351 = !DILocation(line: 12, column: 4, scope: !352)
!352 = !DILexicalBlockFile(scope: !349, file: !350, discriminator: 0)
!353 = !DILocation(line: 14, column: 6, scope: !352)
!354 = !DILocation(line: 17, column: 8, scope: !352)
!355 = !DILocation(line: 19, column: 6, scope: !352)
!356 = !DILocation(line: 24, column: 8, scope: !352)
!357 = !DILocation(line: 26, column: 6, scope: !352)
!358 = !DILocation(line: 34, column: 8, scope: !352)
!359 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.1", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.1", scope: null, file: !350, line: 58, type: !5, scopeLine: 58, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!360 = !DILocation(line: 58, column: 45, scope: !361)
!361 = !DILexicalBlockFile(scope: !359, file: !350, discriminator: 0)
!362 = !DILocation(line: 60, column: 13, scope: !361)
!363 = !DILocation(line: 61, column: 13, scope: !361)
!364 = !DILocation(line: 59, column: 8, scope: !361)
!365 = !DILocation(line: 64, column: 8, scope: !361)
!366 = !DILocation(line: 67, column: 8, scope: !361)
!367 = !DILocation(line: 70, column: 21, scope: !361)
!368 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.2", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.2", scope: null, file: !350, line: 73, type: !5, scopeLine: 73, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!369 = !DILocation(line: 73, column: 11, scope: !370)
!370 = !DILexicalBlockFile(scope: !368, file: !350, discriminator: 0)
!371 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.3", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.3", scope: null, file: !350, line: 78, type: !5, scopeLine: 78, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!372 = !DILocation(line: 78, column: 29, scope: !373)
!373 = !DILexicalBlockFile(scope: !371, file: !350, discriminator: 0)
!374 = !DILocation(line: 79, column: 8, scope: !373)
!375 = !DILocation(line: 80, column: 8, scope: !373)
!376 = !DILocation(line: 81, column: 21, scope: !373)
!377 = !DILocation(line: 82, column: 15, scope: !373)
!378 = !DILocation(line: 82, column: 8, scope: !373)
!379 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.5", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.5", scope: null, file: !350, line: 92, type: !5, scopeLine: 92, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!380 = !DILocation(line: 92, column: 40, scope: !381)
!381 = !DILexicalBlockFile(scope: !379, file: !350, discriminator: 0)
!382 = !DILocation(line: 93, column: 12, scope: !381)
!383 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.6", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.6", scope: null, file: !350, line: 97, type: !5, scopeLine: 97, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!384 = !DILocation(line: 97, column: 46, scope: !385)
!385 = !DILexicalBlockFile(scope: !383, file: !350, discriminator: 0)
!386 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.7", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.7", scope: null, file: !350, line: 103, type: !5, scopeLine: 103, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!387 = !DILocation(line: 103, column: 42, scope: !388)
!388 = !DILexicalBlockFile(scope: !386, file: !350, discriminator: 0)
!389 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.8", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.8", scope: null, file: !350, line: 118, type: !5, scopeLine: 118, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!390 = !DILocation(line: 118, column: 72, scope: !391)
!391 = !DILexicalBlockFile(scope: !389, file: !350, discriminator: 0)
!392 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.9", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.9", scope: null, file: !350, line: 132, type: !5, scopeLine: 132, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!393 = !DILocation(line: 132, column: 80, scope: !394)
!394 = !DILexicalBlockFile(scope: !392, file: !350, discriminator: 0)
!395 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.10", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.10", scope: null, file: !350, line: 137, type: !5, scopeLine: 137, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!396 = !DILocation(line: 137, column: 28, scope: !397)
!397 = !DILexicalBlockFile(scope: !395, file: !350, discriminator: 0)
!398 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.11", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.11", scope: null, file: !350, line: 141, type: !5, scopeLine: 141, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!399 = !DILocation(line: 141, column: 54, scope: !400)
!400 = !DILexicalBlockFile(scope: !398, file: !350, discriminator: 0)
!401 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.12", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.12", scope: null, file: !350, line: 145, type: !5, scopeLine: 145, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!402 = !DILocation(line: 145, column: 52, scope: !403)
!403 = !DILexicalBlockFile(scope: !401, file: !350, discriminator: 0)
!404 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.13", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.13", scope: null, file: !350, line: 156, type: !5, scopeLine: 156, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!405 = !DILocation(line: 156, column: 28, scope: !406)
!406 = !DILexicalBlockFile(scope: !404, file: !350, discriminator: 0)
!407 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.anon.4", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.anon.4", scope: null, file: !350, line: 91, type: !5, scopeLine: 91, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!408 = !DILocation(line: 91, column: 71, scope: !409)
!409 = !DILexicalBlockFile(scope: !407, file: !350, discriminator: 0)
!410 = !DILocation(line: 92, column: 11, scope: !409)
!411 = !DILocation(line: 92, column: 8, scope: !409)
!412 = !DILocation(line: 92, column: 40, scope: !409)
!413 = !DILocation(line: 97, column: 34, scope: !409)
!414 = !DILocation(line: 97, column: 11, scope: !409)
!415 = !DILocation(line: 97, column: 8, scope: !409)
!416 = !DILocation(line: 97, column: 46, scope: !409)
!417 = !DILocation(line: 102, column: 32, scope: !409)
!418 = !DILocation(line: 102, column: 8, scope: !409)
!419 = !DILocation(line: 103, column: 16, scope: !409)
!420 = !DILocation(line: 103, column: 11, scope: !409)
!421 = !DILocation(line: 103, column: 8, scope: !409)
!422 = !DILocation(line: 103, column: 42, scope: !409)
!423 = !DILocation(line: 108, column: 24, scope: !409)
!424 = !DILocation(line: 108, column: 8, scope: !409)
!425 = !DILocation(line: 112, column: 8, scope: !409)
!426 = !DILocation(line: 118, column: 11, scope: !409)
!427 = !DILocation(line: 118, column: 8, scope: !409)
!428 = !DILocation(line: 118, column: 72, scope: !409)
!429 = !DILocation(line: 130, column: 13, scope: !409)
!430 = !DILocation(line: 123, column: 27, scope: !409)
!431 = !DILocation(line: 123, column: 8, scope: !409)
!432 = !DILocation(line: 132, column: 24, scope: !409)
!433 = !DILocation(line: 132, column: 49, scope: !409)
!434 = !DILocation(line: 132, column: 71, scope: !409)
!435 = !DILocation(line: 132, column: 36, scope: !409)
!436 = !DILocation(line: 132, column: 11, scope: !409)
!437 = !DILocation(line: 132, column: 8, scope: !409)
!438 = !DILocation(line: 132, column: 80, scope: !409)
!439 = !DILocation(line: 137, column: 11, scope: !409)
!440 = !DILocation(line: 137, column: 8, scope: !409)
!441 = !DILocation(line: 137, column: 28, scope: !409)
!442 = !DILocation(line: 141, column: 11, scope: !409)
!443 = !DILocation(line: 141, column: 8, scope: !409)
!444 = !DILocation(line: 141, column: 54, scope: !409)
!445 = !DILocation(line: 145, column: 11, scope: !409)
!446 = !DILocation(line: 145, column: 8, scope: !409)
!447 = !DILocation(line: 145, column: 52, scope: !409)
!448 = !DILocation(line: 150, column: 24, scope: !409)
!449 = !DILocation(line: 150, column: 8, scope: !409)
!450 = !DILocation(line: 152, column: 13, scope: !409)
!451 = !DILocation(line: 153, column: 13, scope: !409)
!452 = !DILocation(line: 154, column: 13, scope: !409)
!453 = !DILocation(line: 151, column: 8, scope: !409)
!454 = !DILocation(line: 156, column: 11, scope: !409)
!455 = !DILocation(line: 156, column: 8, scope: !409)
!456 = !DILocation(line: 156, column: 28, scope: !409)
!457 = !DILocation(line: 161, column: 26, scope: !409)
!458 = !DILocation(line: 162, column: 25, scope: !409)
!459 = !DILocation(line: 162, column: 13, scope: !409)
!460 = !DILocation(line: 163, column: 13, scope: !409)
!461 = !DILocation(line: 161, column: 8, scope: !409)
!462 = !DILocation(line: 166, column: 13, scope: !409)
!463 = !DILocation(line: 167, column: 13, scope: !409)
!464 = !DILocation(line: 165, column: 8, scope: !409)
!465 = !DILocation(line: 170, column: 8, scope: !409)
!466 = !DILocation(line: 173, column: 51, scope: !409)
!467 = !DILocation(line: 173, column: 14, scope: !409)
!468 = !DILocation(line: 177, column: 13, scope: !409)
!469 = !DILocation(line: 178, column: 13, scope: !409)
!470 = !DILocation(line: 176, column: 8, scope: !409)
!471 = distinct !DISubprogram(name: "finalize_bpd_calculation::finalize_bpd_calculation.1", linkageName: "finalize_bpd_calculation::finalize_bpd_calculation.1", scope: null, file: !350, line: 39, type: !5, scopeLine: 39, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!472 = !DILocation(line: 39, column: 4, scope: !473)
!473 = !DILexicalBlockFile(scope: !471, file: !350, discriminator: 0)
!474 = !DILocation(line: 42, column: 16, scope: !473)
!475 = !DILocation(line: 42, column: 4, scope: !473)
!476 = !DILocation(line: 43, column: 4, scope: !473)
!477 = !DILocation(line: 44, column: 4, scope: !473)
!478 = !DILocation(line: 47, column: 4, scope: !473)
!479 = !DILocation(line: 53, column: 25, scope: !473)
!480 = !DILocation(line: 54, column: 11, scope: !473)
!481 = !DILocation(line: 55, column: 11, scope: !473)
!482 = !DILocation(line: 53, column: 4, scope: !473)
!483 = !DILocation(line: 58, column: 27, scope: !473)
!484 = !DILocation(line: 58, column: 45, scope: !473)
!485 = !DILocation(line: 73, column: 11, scope: !473)
!486 = !DILocation(line: 58, column: 4, scope: !473)
!487 = !DILocation(line: 78, column: 7, scope: !473)
!488 = !DILocation(line: 78, column: 4, scope: !473)
!489 = !DILocation(line: 78, column: 29, scope: !473)
!490 = !DILocation(line: 86, column: 4, scope: !473)
!491 = !DILocation(line: 89, column: 4, scope: !473)
!492 = !DILocation(line: 91, column: 4, scope: !473)
!493 = !DILocation(line: 183, column: 9, scope: !473)
!494 = !DILocation(line: 184, column: 9, scope: !473)
!495 = !DILocation(line: 182, column: 4, scope: !473)
!496 = !DILocation(line: 189, column: 4, scope: !473)
!497 = distinct !DISubprogram(name: "sol.model.struct.anchor.CreateStake", linkageName: "sol.model.struct.anchor.CreateStake", scope: null, file: !498, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!498 = !DIFile(filename: "programs/helix-staking/src/instructions/create_stake.rs", directory: "/workspace")
!499 = !DILocation(line: 12, column: 4, scope: !500)
!500 = !DILexicalBlockFile(scope: !497, file: !498, discriminator: 0)
!501 = !DILocation(line: 13, column: 6, scope: !500)
!502 = !DILocation(line: 14, column: 8, scope: !500)
!503 = !DILocation(line: 16, column: 6, scope: !500)
!504 = !DILocation(line: 21, column: 8, scope: !500)
!505 = !DILocation(line: 23, column: 6, scope: !500)
!506 = !DILocation(line: 34, column: 8, scope: !500)
!507 = !DILocation(line: 36, column: 6, scope: !500)
!508 = !DILocation(line: 41, column: 8, scope: !500)
!509 = !DILocation(line: 43, column: 6, scope: !500)
!510 = !DILocation(line: 48, column: 8, scope: !500)
!511 = !DILocation(line: 50, column: 8, scope: !500)
!512 = !DILocation(line: 51, column: 8, scope: !500)
!513 = distinct !DISubprogram(name: "create_stake::create_stake.anon.4", linkageName: "create_stake::create_stake.anon.4", scope: null, file: !498, line: 121, type: !5, scopeLine: 121, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!514 = !DILocation(line: 121, column: 92, scope: !515)
!515 = !DILexicalBlockFile(scope: !513, file: !498, discriminator: 0)
!516 = distinct !DISubprogram(name: "create_stake::create_stake.anon.5", linkageName: "create_stake::create_stake.anon.5", scope: null, file: !498, line: 123, type: !5, scopeLine: 123, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!517 = !DILocation(line: 123, column: 23, scope: !518)
!518 = !DILexicalBlockFile(scope: !516, file: !498, discriminator: 0)
!519 = distinct !DISubprogram(name: "create_stake::create_stake.anon.3", linkageName: "create_stake::create_stake.anon.3", scope: null, file: !498, line: 120, type: !5, scopeLine: 120, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!520 = !DILocation(line: 120, column: 90, scope: !521)
!521 = !DILexicalBlockFile(scope: !519, file: !498, discriminator: 0)
!522 = !DILocation(line: 121, column: 56, scope: !521)
!523 = !DILocation(line: 121, column: 19, scope: !521)
!524 = !DILocation(line: 121, column: 16, scope: !521)
!525 = !DILocation(line: 121, column: 92, scope: !521)
!526 = !DILocation(line: 123, column: 23, scope: !521)
!527 = distinct !DISubprogram(name: "create_stake::create_stake.anon.6", linkageName: "create_stake::create_stake.anon.6", scope: null, file: !498, line: 126, type: !5, scopeLine: 126, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!528 = !DILocation(line: 126, column: 19, scope: !529)
!529 = !DILexicalBlockFile(scope: !527, file: !498, discriminator: 0)
!530 = distinct !DISubprogram(name: "create_stake::create_stake.anon.2", linkageName: "create_stake::create_stake.anon.2", scope: null, file: !498, line: 118, type: !5, scopeLine: 118, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!531 = !DILocation(line: 118, column: 51, scope: !532)
!532 = !DILexicalBlockFile(scope: !530, file: !498, discriminator: 0)
!533 = !DILocation(line: 120, column: 38, scope: !532)
!534 = !DILocation(line: 120, column: 12, scope: !532)
!535 = !DILocation(line: 120, column: 90, scope: !532)
!536 = !DILocation(line: 126, column: 19, scope: !532)
!537 = distinct !DISubprogram(name: "create_stake::create_stake.anon.7", linkageName: "create_stake::create_stake.anon.7", scope: null, file: !498, line: 129, type: !5, scopeLine: 129, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!538 = !DILocation(line: 129, column: 15, scope: !539)
!539 = !DILexicalBlockFile(scope: !537, file: !498, discriminator: 0)
!540 = distinct !DISubprogram(name: "create_stake::create_stake.anon.1", linkageName: "create_stake::create_stake.anon.1", scope: null, file: !498, line: 109, type: !5, scopeLine: 109, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!541 = !DILocation(line: 109, column: 88, scope: !542)
!542 = !DILexicalBlockFile(scope: !540, file: !498, discriminator: 0)
!543 = !DILocation(line: 110, column: 8, scope: !542)
!544 = !DILocation(line: 113, column: 32, scope: !542)
!545 = !DILocation(line: 113, column: 8, scope: !542)
!546 = !DILocation(line: 118, column: 29, scope: !542)
!547 = !DILocation(line: 118, column: 11, scope: !542)
!548 = !DILocation(line: 118, column: 8, scope: !542)
!549 = !DILocation(line: 118, column: 51, scope: !542)
!550 = !DILocation(line: 129, column: 15, scope: !542)
!551 = distinct !DISubprogram(name: "create_stake::create_stake.anon.8", linkageName: "create_stake::create_stake.anon.8", scope: null, file: !498, line: 132, type: !5, scopeLine: 132, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!552 = !DILocation(line: 132, column: 11, scope: !553)
!553 = !DILexicalBlockFile(scope: !551, file: !498, discriminator: 0)
!554 = distinct !DISubprogram(name: "create_stake::create_stake.3", linkageName: "create_stake::create_stake.3", scope: null, file: !498, line: 54, type: !5, scopeLine: 54, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!555 = !DILocation(line: 54, column: 4, scope: !556)
!556 = !DILexicalBlockFile(scope: !554, file: !498, discriminator: 0)
!557 = !DILocation(line: 59, column: 4, scope: !556)
!558 = !DILocation(line: 60, column: 4, scope: !556)
!559 = !DILocation(line: 63, column: 4, scope: !556)
!560 = !DILocation(line: 69, column: 4, scope: !556)
!561 = !DILocation(line: 75, column: 16, scope: !556)
!562 = !DILocation(line: 75, column: 4, scope: !556)
!563 = !DILocation(line: 78, column: 46, scope: !556)
!564 = !DILocation(line: 78, column: 19, scope: !556)
!565 = !DILocation(line: 78, column: 4, scope: !556)
!566 = !DILocation(line: 83, column: 13, scope: !556)
!567 = !DILocation(line: 84, column: 17, scope: !556)
!568 = !DILocation(line: 85, column: 17, scope: !556)
!569 = !DILocation(line: 82, column: 9, scope: !556)
!570 = !DILocation(line: 87, column: 9, scope: !556)
!571 = !DILocation(line: 81, column: 4, scope: !556)
!572 = !DILocation(line: 91, column: 22, scope: !556)
!573 = !DILocation(line: 91, column: 4, scope: !556)
!574 = !DILocation(line: 94, column: 43, scope: !556)
!575 = !DILocation(line: 94, column: 4, scope: !556)
!576 = !DILocation(line: 95, column: 4, scope: !556)
!577 = !DILocation(line: 96, column: 4, scope: !556)
!578 = !DILocation(line: 97, column: 4, scope: !556)
!579 = !DILocation(line: 98, column: 4, scope: !556)
!580 = !DILocation(line: 99, column: 4, scope: !556)
!581 = !DILocation(line: 100, column: 4, scope: !556)
!582 = !DILocation(line: 101, column: 4, scope: !556)
!583 = !DILocation(line: 102, column: 4, scope: !556)
!584 = !DILocation(line: 103, column: 4, scope: !556)
!585 = !DILocation(line: 106, column: 4, scope: !556)
!586 = !DILocation(line: 109, column: 77, scope: !556)
!587 = !DILocation(line: 109, column: 53, scope: !556)
!588 = !DILocation(line: 109, column: 50, scope: !556)
!589 = !DILocation(line: 109, column: 88, scope: !556)
!590 = !DILocation(line: 132, column: 11, scope: !556)
!591 = !DILocation(line: 109, column: 4, scope: !556)
!592 = !DILocation(line: 136, column: 4, scope: !556)
!593 = !DILocation(line: 137, column: 4, scope: !556)
!594 = !DILocation(line: 141, column: 9, scope: !556)
!595 = !DILocation(line: 142, column: 9, scope: !556)
!596 = !DILocation(line: 140, column: 4, scope: !556)
!597 = !DILocation(line: 145, column: 9, scope: !556)
!598 = !DILocation(line: 146, column: 9, scope: !556)
!599 = !DILocation(line: 144, column: 4, scope: !556)
!600 = !DILocation(line: 149, column: 9, scope: !556)
!601 = !DILocation(line: 150, column: 9, scope: !556)
!602 = !DILocation(line: 148, column: 4, scope: !556)
!603 = !DILocation(line: 155, column: 39, scope: !556)
!604 = !DILocation(line: 157, column: 40, scope: !556)
!605 = !DILocation(line: 157, column: 16, scope: !556)
!606 = !DILocation(line: 158, column: 54, scope: !556)
!607 = !DILocation(line: 158, column: 16, scope: !556)
!608 = !DILocation(line: 159, column: 45, scope: !556)
!609 = !DILocation(line: 159, column: 16, scope: !556)
!610 = !DILocation(line: 156, column: 12, scope: !556)
!611 = !DILocation(line: 154, column: 8, scope: !556)
!612 = !DILocation(line: 153, column: 4, scope: !556)
!613 = !DILocation(line: 166, column: 4, scope: !556)
!614 = !DILocation(line: 176, column: 4, scope: !556)
!615 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimRewards", linkageName: "sol.model.struct.anchor.ClaimRewards", scope: null, file: !616, line: 12, type: !5, scopeLine: 12, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!616 = !DIFile(filename: "programs/helix-staking/src/instructions/claim_rewards.rs", directory: "/workspace")
!617 = !DILocation(line: 12, column: 4, scope: !618)
!618 = !DILexicalBlockFile(scope: !615, file: !616, discriminator: 0)
!619 = !DILocation(line: 13, column: 6, scope: !618)
!620 = !DILocation(line: 14, column: 8, scope: !618)
!621 = !DILocation(line: 16, column: 6, scope: !618)
!622 = !DILocation(line: 21, column: 8, scope: !618)
!623 = !DILocation(line: 23, column: 6, scope: !618)
!624 = !DILocation(line: 33, column: 8, scope: !618)
!625 = !DILocation(line: 35, column: 6, scope: !618)
!626 = !DILocation(line: 41, column: 8, scope: !618)
!627 = !DILocation(line: 43, column: 6, scope: !618)
!628 = !DILocation(line: 48, column: 8, scope: !618)
!629 = !DILocation(line: 51, column: 6, scope: !618)
!630 = !DILocation(line: 55, column: 8, scope: !618)
!631 = !DILocation(line: 57, column: 8, scope: !618)
!632 = !DILocation(line: 58, column: 8, scope: !618)
!633 = distinct !DISubprogram(name: "claim_rewards::claim_rewards.anon.1", linkageName: "claim_rewards::claim_rewards.anon.1", scope: null, file: !616, line: 93, type: !5, scopeLine: 93, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!634 = !DILocation(line: 93, column: 21, scope: !635)
!635 = !DILexicalBlockFile(scope: !633, file: !616, discriminator: 0)
!636 = !DILocation(line: 94, column: 8, scope: !635)
!637 = distinct !DISubprogram(name: "claim_rewards::claim_rewards.1", linkageName: "claim_rewards::claim_rewards.1", scope: null, file: !616, line: 61, type: !5, scopeLine: 61, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!638 = !DILocation(line: 61, column: 4, scope: !639)
!639 = !DILexicalBlockFile(scope: !637, file: !616, discriminator: 0)
!640 = !DILocation(line: 62, column: 16, scope: !639)
!641 = !DILocation(line: 62, column: 4, scope: !639)
!642 = !DILocation(line: 63, column: 4, scope: !639)
!643 = !DILocation(line: 64, column: 4, scope: !639)
!644 = !DILocation(line: 67, column: 4, scope: !639)
!645 = !DILocation(line: 68, column: 4, scope: !639)
!646 = !DILocation(line: 69, column: 4, scope: !639)
!647 = !DILocation(line: 72, column: 26, scope: !639)
!648 = !DILocation(line: 72, column: 4, scope: !639)
!649 = !DILocation(line: 79, column: 4, scope: !639)
!650 = !DILocation(line: 81, column: 9, scope: !639)
!651 = !DILocation(line: 82, column: 9, scope: !639)
!652 = !DILocation(line: 80, column: 4, scope: !639)
!653 = !DILocation(line: 85, column: 4, scope: !639)
!654 = !DILocation(line: 89, column: 4, scope: !639)
!655 = !DILocation(line: 90, column: 28, scope: !639)
!656 = !DILocation(line: 90, column: 4, scope: !639)
!657 = !DILocation(line: 93, column: 7, scope: !639)
!658 = !DILocation(line: 93, column: 4, scope: !639)
!659 = !DILocation(line: 93, column: 21, scope: !639)
!660 = !DILocation(line: 99, column: 9, scope: !639)
!661 = !DILocation(line: 100, column: 9, scope: !639)
!662 = !DILocation(line: 98, column: 4, scope: !639)
!663 = !DILocation(line: 103, column: 4, scope: !639)
!664 = !DILocation(line: 104, column: 4, scope: !639)
!665 = !DILocation(line: 107, column: 32, scope: !639)
!666 = !DILocation(line: 107, column: 8, scope: !639)
!667 = !DILocation(line: 108, column: 44, scope: !639)
!668 = !DILocation(line: 108, column: 8, scope: !639)
!669 = !DILocation(line: 109, column: 47, scope: !639)
!670 = !DILocation(line: 109, column: 8, scope: !639)
!671 = !DILocation(line: 106, column: 23, scope: !639)
!672 = !DILocation(line: 106, column: 4, scope: !639)
!673 = !DILocation(line: 113, column: 35, scope: !639)
!674 = !DILocation(line: 112, column: 18, scope: !639)
!675 = !DILocation(line: 112, column: 4, scope: !639)
!676 = !DILocation(line: 118, column: 4, scope: !639)
!677 = !DILocation(line: 121, column: 4, scope: !639)
!678 = !DILocation(line: 128, column: 4, scope: !639)
!679 = distinct !DISubprogram(name: "sol.model.struct.anchor.AcceptAuthority", linkageName: "sol.model.struct.anchor.AcceptAuthority", scope: null, file: !680, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!680 = !DIFile(filename: "programs/helix-staking/src/instructions/accept_authority.rs", directory: "/workspace")
!681 = !DILocation(line: 9, column: 4, scope: !682)
!682 = !DILexicalBlockFile(scope: !679, file: !680, discriminator: 0)
!683 = !DILocation(line: 10, column: 6, scope: !682)
!684 = !DILocation(line: 16, column: 8, scope: !682)
!685 = !DILocation(line: 18, column: 6, scope: !682)
!686 = !DILocation(line: 24, column: 8, scope: !682)
!687 = !DILocation(line: 26, column: 6, scope: !682)
!688 = !DILocation(line: 30, column: 8, scope: !682)
!689 = distinct !DISubprogram(name: "accept_authority::accept_authority.1", linkageName: "accept_authority::accept_authority.1", scope: null, file: !680, line: 33, type: !5, scopeLine: 33, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!690 = !DILocation(line: 33, column: 4, scope: !691)
!691 = !DILexicalBlockFile(scope: !689, file: !680, discriminator: 0)
!692 = !DILocation(line: 34, column: 4, scope: !691)
!693 = !DILocation(line: 35, column: 51, scope: !691)
!694 = !DILocation(line: 35, column: 4, scope: !691)
!695 = !DILocation(line: 37, column: 4, scope: !691)
!696 = !DILocation(line: 39, column: 4, scope: !691)
!697 = !DILocation(line: 44, column: 4, scope: !691)
!698 = distinct !DISubprogram(name: "sol.model.struct.anchor.FreeClaim", linkageName: "sol.model.struct.anchor.FreeClaim", scope: null, file: !699, line: 18, type: !5, scopeLine: 18, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!699 = !DIFile(filename: "programs/helix-staking/src/instructions/free_claim.rs", directory: "/workspace")
!700 = !DILocation(line: 18, column: 4, scope: !701)
!701 = !DILexicalBlockFile(scope: !698, file: !699, discriminator: 0)
!702 = !DILocation(line: 20, column: 6, scope: !701)
!703 = !DILocation(line: 21, column: 8, scope: !701)
!704 = !DILocation(line: 26, column: 6, scope: !701)
!705 = !DILocation(line: 29, column: 8, scope: !701)
!706 = !DILocation(line: 31, column: 6, scope: !701)
!707 = !DILocation(line: 36, column: 8, scope: !701)
!708 = !DILocation(line: 38, column: 6, scope: !701)
!709 = !DILocation(line: 44, column: 8, scope: !701)
!710 = !DILocation(line: 46, column: 6, scope: !701)
!711 = !DILocation(line: 57, column: 8, scope: !701)
!712 = !DILocation(line: 59, column: 6, scope: !701)
!713 = !DILocation(line: 65, column: 8, scope: !701)
!714 = !DILocation(line: 67, column: 6, scope: !701)
!715 = !DILocation(line: 72, column: 8, scope: !701)
!716 = !DILocation(line: 75, column: 6, scope: !701)
!717 = !DILocation(line: 79, column: 8, scope: !701)
!718 = !DILocation(line: 82, column: 6, scope: !701)
!719 = !DILocation(line: 83, column: 8, scope: !701)
!720 = !DILocation(line: 85, column: 8, scope: !701)
!721 = !DILocation(line: 86, column: 8, scope: !701)
!722 = distinct !DISubprogram(name: "free_claim::free_claim.3", linkageName: "free_claim::free_claim.3", scope: null, file: !699, line: 89, type: !5, scopeLine: 89, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!723 = !DILocation(line: 89, column: 4, scope: !724)
!724 = !DILexicalBlockFile(scope: !722, file: !699, discriminator: 0)
!725 = !DILocation(line: 94, column: 16, scope: !724)
!726 = !DILocation(line: 94, column: 4, scope: !724)
!727 = !DILocation(line: 95, column: 4, scope: !724)
!728 = !DILocation(line: 96, column: 4, scope: !724)
!729 = !DILocation(line: 97, column: 4, scope: !724)
!730 = !DILocation(line: 100, column: 4, scope: !724)
!731 = !DILocation(line: 106, column: 4, scope: !724)
!732 = !DILocation(line: 114, column: 37, scope: !724)
!733 = !DILocation(line: 112, column: 4, scope: !724)
!734 = !DILocation(line: 120, column: 37, scope: !724)
!735 = !DILocation(line: 119, column: 4, scope: !724)
!736 = !DILocation(line: 128, column: 23, scope: !724)
!737 = !DILocation(line: 128, column: 4, scope: !724)
!738 = !DILocation(line: 134, column: 49, scope: !724)
!739 = !DILocation(line: 134, column: 4, scope: !724)
!740 = !DILocation(line: 140, column: 9, scope: !724)
!741 = !DILocation(line: 141, column: 9, scope: !724)
!742 = !DILocation(line: 139, column: 4, scope: !724)
!743 = !DILocation(line: 145, column: 27, scope: !724)
!744 = !DILocation(line: 145, column: 4, scope: !724)
!745 = !DILocation(line: 148, column: 9, scope: !724)
!746 = !DILocation(line: 149, column: 9, scope: !724)
!747 = !DILocation(line: 147, column: 4, scope: !724)
!748 = !DILocation(line: 154, column: 17, scope: !724)
!749 = !DILocation(line: 155, column: 17, scope: !724)
!750 = !DILocation(line: 152, column: 9, scope: !724)
!751 = !DILocation(line: 157, column: 9, scope: !724)
!752 = !DILocation(line: 151, column: 4, scope: !724)
!753 = !DILocation(line: 160, column: 4, scope: !724)
!754 = !DILocation(line: 161, column: 4, scope: !724)
!755 = !DILocation(line: 162, column: 4, scope: !724)
!756 = !DILocation(line: 163, column: 4, scope: !724)
!757 = !DILocation(line: 164, column: 4, scope: !724)
!758 = !DILocation(line: 165, column: 4, scope: !724)
!759 = !DILocation(line: 166, column: 64, scope: !724)
!760 = !DILocation(line: 166, column: 4, scope: !724)
!761 = !DILocation(line: 167, column: 4, scope: !724)
!762 = !DILocation(line: 171, column: 9, scope: !724)
!763 = !DILocation(line: 172, column: 9, scope: !724)
!764 = !DILocation(line: 170, column: 4, scope: !724)
!765 = !DILocation(line: 174, column: 9, scope: !724)
!766 = !DILocation(line: 175, column: 9, scope: !724)
!767 = !DILocation(line: 173, column: 4, scope: !724)
!768 = !DILocation(line: 178, column: 4, scope: !724)
!769 = !DILocation(line: 179, column: 4, scope: !724)
!770 = !DILocation(line: 183, column: 39, scope: !724)
!771 = !DILocation(line: 185, column: 40, scope: !724)
!772 = !DILocation(line: 185, column: 16, scope: !724)
!773 = !DILocation(line: 186, column: 55, scope: !724)
!774 = !DILocation(line: 186, column: 16, scope: !724)
!775 = !DILocation(line: 187, column: 55, scope: !724)
!776 = !DILocation(line: 187, column: 16, scope: !724)
!777 = !DILocation(line: 184, column: 12, scope: !724)
!778 = !DILocation(line: 182, column: 8, scope: !724)
!779 = !DILocation(line: 181, column: 4, scope: !724)
!780 = !DILocation(line: 195, column: 4, scope: !724)
!781 = !DILocation(line: 211, column: 4, scope: !724)
!782 = distinct !DISubprogram(name: "free_claim::verify_ed25519_signature.3", linkageName: "free_claim::verify_ed25519_signature.3", scope: null, file: !699, line: 216, type: !5, scopeLine: 216, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!783 = !DILocation(line: 216, scope: !784)
!784 = !DILexicalBlockFile(scope: !782, file: !699, discriminator: 0)
!785 = !DILocation(line: 221, column: 27, scope: !784)
!786 = !DILocation(line: 221, column: 4, scope: !784)
!787 = !DILocation(line: 224, column: 4, scope: !784)
!788 = !DILocation(line: 227, column: 9, scope: !784)
!789 = !DILocation(line: 227, column: 8, scope: !784)
!790 = !DILocation(line: 226, column: 21, scope: !784)
!791 = !DILocation(line: 226, column: 4, scope: !784)
!792 = !DILocation(line: 232, column: 4, scope: !784)
!793 = !DILocation(line: 238, column: 27, scope: !784)
!794 = !DILocation(line: 238, column: 4, scope: !784)
!795 = !DILocation(line: 253, column: 4, scope: !784)
!796 = !DILocation(line: 254, column: 4, scope: !784)
!797 = !DILocation(line: 257, column: 24, scope: !784)
!798 = !DILocation(line: 257, column: 4, scope: !784)
!799 = !DILocation(line: 258, column: 21, scope: !784)
!800 = !DILocation(line: 258, column: 4, scope: !784)
!801 = !DILocation(line: 259, column: 18, scope: !784)
!802 = !DILocation(line: 259, column: 4, scope: !784)
!803 = !DILocation(line: 262, column: 4, scope: !784)
!804 = !DILocation(line: 266, column: 24, scope: !784)
!805 = !DILocation(line: 267, column: 9, scope: !784)
!806 = !DILocation(line: 266, column: 4, scope: !784)
!807 = !DILocation(line: 268, column: 4, scope: !784)
!808 = !DILocation(line: 274, column: 4, scope: !784)
!809 = !DILocation(line: 278, column: 4, scope: !784)
!810 = !DILocation(line: 279, column: 4, scope: !784)
!811 = !DILocation(line: 284, column: 4, scope: !784)
!812 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.1", linkageName: "free_claim::verify_merkle_proof.anon.1", scope: null, file: !699, line: 307, type: !5, scopeLine: 307, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!813 = !DILocation(line: 307, column: 34, scope: !814)
!814 = !DILexicalBlockFile(scope: !812, file: !699, discriminator: 0)
!815 = !DILocation(line: 308, column: 12, scope: !814)
!816 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.2", linkageName: "free_claim::verify_merkle_proof.anon.2", scope: null, file: !699, line: 309, type: !5, scopeLine: 309, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!817 = !DILocation(line: 309, column: 15, scope: !818)
!818 = !DILexicalBlockFile(scope: !816, file: !699, discriminator: 0)
!819 = !DILocation(line: 310, column: 12, scope: !818)
!820 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.4", linkageName: "free_claim::verify_merkle_proof.anon.4", scope: null, file: !699, line: 307, type: !5, scopeLine: 307, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!821 = !DILocation(line: 307, column: 34, scope: !822)
!822 = !DILexicalBlockFile(scope: !820, file: !699, discriminator: 0)
!823 = !DILocation(line: 308, column: 12, scope: !822)
!824 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.5", linkageName: "free_claim::verify_merkle_proof.anon.5", scope: null, file: !699, line: 309, type: !5, scopeLine: 309, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!825 = !DILocation(line: 309, column: 15, scope: !826)
!826 = !DILexicalBlockFile(scope: !824, file: !699, discriminator: 0)
!827 = !DILocation(line: 310, column: 12, scope: !826)
!828 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.anon.3", linkageName: "free_claim::verify_merkle_proof.anon.3", scope: null, file: !699, line: 306, type: !5, scopeLine: 306, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!829 = !DILocation(line: 306, column: 32, scope: !830)
!830 = !DILexicalBlockFile(scope: !828, file: !699, discriminator: 0)
!831 = !DILocation(line: 307, column: 18, scope: !830)
!832 = !DILocation(line: 307, column: 15, scope: !830)
!833 = !DILocation(line: 307, column: 34, scope: !830)
!834 = !DILocation(line: 309, column: 15, scope: !830)
!835 = !DILocation(line: 307, column: 8, scope: !830)
!836 = distinct !DISubprogram(name: "free_claim::verify_merkle_proof.5", linkageName: "free_claim::verify_merkle_proof.5", scope: null, file: !699, line: 289, type: !5, scopeLine: 289, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!837 = !DILocation(line: 289, scope: !838)
!838 = !DILexicalBlockFile(scope: !836, file: !699, discriminator: 0)
!839 = !DILocation(line: 296, column: 4, scope: !838)
!840 = !DILocation(line: 299, column: 19, scope: !838)
!841 = !DILocation(line: 299, column: 4, scope: !838)
!842 = !DILocation(line: 306, column: 4, scope: !838)
!843 = !DILocation(line: 314, column: 4, scope: !838)
!844 = !DILocation(line: 316, column: 4, scope: !838)
!845 = distinct !DISubprogram(name: "free_claim::calculate_days_elapsed.3", linkageName: "free_claim::calculate_days_elapsed.3", scope: null, file: !699, line: 320, type: !5, scopeLine: 320, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!846 = !DILocation(line: 320, scope: !847)
!847 = !DILexicalBlockFile(scope: !845, file: !699, discriminator: 0)
!848 = !DILocation(line: 326, column: 9, scope: !847)
!849 = !DILocation(line: 327, column: 9, scope: !847)
!850 = !DILocation(line: 325, column: 4, scope: !847)
!851 = !DILocation(line: 329, column: 7, scope: !847)
!852 = !DILocation(line: 329, column: 4, scope: !847)
!853 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.anon.1", linkageName: "free_claim::calculate_speed_bonus.anon.1", scope: null, file: !699, line: 351, type: !5, scopeLine: 351, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!854 = !DILocation(line: 351, column: 61, scope: !855)
!855 = !DILexicalBlockFile(scope: !853, file: !699, discriminator: 0)
!856 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.anon.2", linkageName: "free_claim::calculate_speed_bonus.anon.2", scope: null, file: !699, line: 353, type: !5, scopeLine: 353, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!857 = !DILocation(line: 353, column: 52, scope: !858)
!858 = !DILexicalBlockFile(scope: !856, file: !699, discriminator: 0)
!859 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.anon.3", linkageName: "free_claim::calculate_speed_bonus.anon.3", scope: null, file: !699, line: 355, type: !5, scopeLine: 355, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!860 = !DILocation(line: 355, column: 11, scope: !861)
!861 = !DILexicalBlockFile(scope: !859, file: !699, discriminator: 0)
!862 = distinct !DISubprogram(name: "free_claim::calculate_speed_bonus.2", linkageName: "free_claim::calculate_speed_bonus.2", scope: null, file: !699, line: 336, type: !5, scopeLine: 336, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!863 = !DILocation(line: 336, scope: !864)
!864 = !DILexicalBlockFile(scope: !862, file: !699, discriminator: 0)
!865 = !DILocation(line: 349, column: 22, scope: !864)
!866 = !DILocation(line: 349, column: 4, scope: !864)
!867 = !DILocation(line: 351, column: 23, scope: !864)
!868 = !DILocation(line: 351, column: 20, scope: !864)
!869 = !DILocation(line: 351, column: 61, scope: !864)
!870 = !DILocation(line: 353, column: 14, scope: !864)
!871 = !DILocation(line: 353, column: 11, scope: !864)
!872 = !DILocation(line: 353, column: 52, scope: !864)
!873 = !DILocation(line: 355, column: 11, scope: !864)
!874 = !DILocation(line: 351, column: 4, scope: !864)
!875 = !DILocation(line: 360, column: 23, scope: !864)
!876 = !DILocation(line: 360, column: 4, scope: !864)
!877 = !DILocation(line: 362, column: 4, scope: !864)
!878 = distinct !DISubprogram(name: "sol.model.struct.anchor.AbortBpd", linkageName: "sol.model.struct.anchor.AbortBpd", scope: null, file: !879, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!879 = !DIFile(filename: "programs/helix-staking/src/instructions/abort_bpd.rs", directory: "/workspace")
!880 = !DILocation(line: 9, column: 4, scope: !881)
!881 = !DILexicalBlockFile(scope: !878, file: !879, discriminator: 0)
!882 = !DILocation(line: 10, column: 6, scope: !881)
!883 = !DILocation(line: 16, column: 8, scope: !881)
!884 = !DILocation(line: 18, column: 6, scope: !881)
!885 = !DILocation(line: 23, column: 8, scope: !881)
!886 = !DILocation(line: 25, column: 8, scope: !881)
!887 = distinct !DISubprogram(name: "abort_bpd::abort_bpd.1", linkageName: "abort_bpd::abort_bpd.1", scope: null, file: !879, line: 38, type: !5, scopeLine: 38, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!888 = !DILocation(line: 38, column: 4, scope: !889)
!889 = !DILexicalBlockFile(scope: !887, file: !879, discriminator: 0)
!890 = !DILocation(line: 39, column: 4, scope: !889)
!891 = !DILocation(line: 40, column: 4, scope: !889)
!892 = !DILocation(line: 43, column: 4, scope: !889)
!893 = !DILocation(line: 50, column: 4, scope: !889)
!894 = !DILocation(line: 56, column: 4, scope: !889)
!895 = !DILocation(line: 57, column: 4, scope: !889)
!896 = !DILocation(line: 60, column: 4, scope: !889)
!897 = !DILocation(line: 61, column: 4, scope: !889)
!898 = !DILocation(line: 62, column: 4, scope: !889)
!899 = !DILocation(line: 63, column: 4, scope: !889)
!900 = !DILocation(line: 64, column: 4, scope: !889)
!901 = !DILocation(line: 65, column: 4, scope: !889)
!902 = !DILocation(line: 66, column: 4, scope: !889)
!903 = !DILocation(line: 69, column: 17, scope: !889)
!904 = !DILocation(line: 71, column: 4, scope: !889)
!905 = !DILocation(line: 77, column: 4, scope: !889)
!906 = distinct !DISubprogram(name: "sol.model.struct.anchor.SealBpdFinalize", linkageName: "sol.model.struct.anchor.SealBpdFinalize", scope: null, file: !907, line: 8, type: !5, scopeLine: 8, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!907 = !DIFile(filename: "programs/helix-staking/src/instructions/seal_bpd_finalize.rs", directory: "/workspace")
!908 = !DILocation(line: 8, column: 4, scope: !909)
!909 = !DILexicalBlockFile(scope: !906, file: !907, discriminator: 0)
!910 = !DILocation(line: 10, column: 6, scope: !909)
!911 = !DILocation(line: 13, column: 8, scope: !909)
!912 = !DILocation(line: 15, column: 6, scope: !909)
!913 = !DILocation(line: 19, column: 8, scope: !909)
!914 = !DILocation(line: 21, column: 6, scope: !909)
!915 = !DILocation(line: 29, column: 8, scope: !909)
!916 = distinct !DISubprogram(name: "seal_bpd_finalize::seal_bpd_finalize.anon.1", linkageName: "seal_bpd_finalize::seal_bpd_finalize.anon.1", scope: null, file: !907, line: 57, type: !5, scopeLine: 57, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!917 = !DILocation(line: 57, column: 46, scope: !918)
!918 = !DILexicalBlockFile(scope: !916, file: !907, discriminator: 0)
!919 = !DILocation(line: 58, column: 8, scope: !918)
!920 = !DILocation(line: 59, column: 8, scope: !918)
!921 = !DILocation(line: 60, column: 15, scope: !918)
!922 = !DILocation(line: 60, column: 8, scope: !918)
!923 = distinct !DISubprogram(name: "seal_bpd_finalize::seal_bpd_finalize.2", linkageName: "seal_bpd_finalize::seal_bpd_finalize.2", scope: null, file: !907, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!924 = !DILocation(line: 32, column: 4, scope: !925)
!925 = !DILexicalBlockFile(scope: !923, file: !907, discriminator: 0)
!926 = !DILocation(line: 33, column: 16, scope: !925)
!927 = !DILocation(line: 33, column: 4, scope: !925)
!928 = !DILocation(line: 34, column: 4, scope: !925)
!929 = !DILocation(line: 37, column: 4, scope: !925)
!930 = !DILocation(line: 43, column: 4, scope: !925)
!931 = !DILocation(line: 51, column: 4, scope: !925)
!932 = !DILocation(line: 57, column: 7, scope: !925)
!933 = !DILocation(line: 57, column: 4, scope: !925)
!934 = !DILocation(line: 57, column: 46, scope: !925)
!935 = !DILocation(line: 64, column: 4, scope: !925)
!936 = !DILocation(line: 66, column: 31, scope: !925)
!937 = !DILocation(line: 67, column: 21, scope: !925)
!938 = !DILocation(line: 67, column: 9, scope: !925)
!939 = !DILocation(line: 68, column: 9, scope: !925)
!940 = !DILocation(line: 69, column: 9, scope: !925)
!941 = !DILocation(line: 70, column: 9, scope: !925)
!942 = !DILocation(line: 66, column: 4, scope: !925)
!943 = !DILocation(line: 72, column: 4, scope: !925)
!944 = !DILocation(line: 73, column: 4, scope: !925)
!945 = !DILocation(line: 75, column: 4, scope: !925)
!946 = distinct !DISubprogram(name: "sol.model.struct.anchor.TransferAuthority", linkageName: "sol.model.struct.anchor.TransferAuthority", scope: null, file: !947, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!947 = !DIFile(filename: "programs/helix-staking/src/instructions/transfer_authority.rs", directory: "/workspace")
!948 = !DILocation(line: 9, column: 4, scope: !949)
!949 = !DILexicalBlockFile(scope: !946, file: !947, discriminator: 0)
!950 = !DILocation(line: 10, column: 6, scope: !949)
!951 = !DILocation(line: 15, column: 8, scope: !949)
!952 = !DILocation(line: 17, column: 6, scope: !949)
!953 = !DILocation(line: 24, column: 8, scope: !949)
!954 = !DILocation(line: 26, column: 6, scope: !949)
!955 = !DILocation(line: 27, column: 8, scope: !949)
!956 = !DILocation(line: 29, column: 8, scope: !949)
!957 = distinct !DISubprogram(name: "transfer_authority::transfer_authority.anon.1", linkageName: "transfer_authority::transfer_authority.anon.1", scope: null, file: !947, line: 36, type: !5, scopeLine: 36, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!958 = !DILocation(line: 36, column: 92, scope: !959)
!959 = !DILexicalBlockFile(scope: !957, file: !947, discriminator: 0)
!960 = !DILocation(line: 37, column: 8, scope: !959)
!961 = distinct !DISubprogram(name: "transfer_authority::transfer_authority.2", linkageName: "transfer_authority::transfer_authority.2", scope: null, file: !947, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!962 = !DILocation(line: 32, column: 4, scope: !963)
!963 = !DILexicalBlockFile(scope: !961, file: !947, discriminator: 0)
!964 = !DILocation(line: 33, column: 4, scope: !963)
!965 = !DILocation(line: 36, column: 32, scope: !963)
!966 = !DILocation(line: 36, column: 7, scope: !963)
!967 = !DILocation(line: 36, column: 53, scope: !963)
!968 = !DILocation(line: 36, column: 4, scope: !963)
!969 = !DILocation(line: 36, column: 92, scope: !963)
!970 = !DILocation(line: 43, column: 4, scope: !963)
!971 = !DILocation(line: 44, column: 4, scope: !963)
!972 = !DILocation(line: 46, column: 4, scope: !963)
!973 = !DILocation(line: 51, column: 4, scope: !963)
!974 = distinct !DISubprogram(name: "sol.model.struct.anchor.AdminSetClaimEndSlot", linkageName: "sol.model.struct.anchor.AdminSetClaimEndSlot", scope: null, file: !975, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!975 = !DIFile(filename: "programs/helix-staking/src/instructions/admin_set_claim_end_slot.rs", directory: "/workspace")
!976 = !DILocation(line: 11, column: 4, scope: !977)
!977 = !DILexicalBlockFile(scope: !974, file: !975, discriminator: 0)
!978 = !DILocation(line: 12, column: 6, scope: !977)
!979 = !DILocation(line: 15, column: 8, scope: !977)
!980 = !DILocation(line: 17, column: 6, scope: !977)
!981 = !DILocation(line: 21, column: 8, scope: !977)
!982 = !DILocation(line: 23, column: 6, scope: !977)
!983 = !DILocation(line: 29, column: 8, scope: !977)
!984 = distinct !DISubprogram(name: "admin_set_claim_end_slot::admin_set_claim_end_slot.2", linkageName: "admin_set_claim_end_slot::admin_set_claim_end_slot.2", scope: null, file: !975, line: 32, type: !5, scopeLine: 32, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!985 = !DILocation(line: 32, column: 4, scope: !986)
!986 = !DILexicalBlockFile(scope: !984, file: !975, discriminator: 0)
!987 = !DILocation(line: 36, column: 4, scope: !986)
!988 = !DILocation(line: 37, column: 4, scope: !986)
!989 = !DILocation(line: 38, column: 4, scope: !986)
!990 = distinct !DISubprogram(name: "sol.model.struct.anchor.Unstake", linkageName: "sol.model.struct.anchor.Unstake", scope: null, file: !991, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!991 = !DIFile(filename: "programs/helix-staking/src/instructions/unstake.rs", directory: "/workspace")
!992 = !DILocation(line: 11, column: 4, scope: !993)
!993 = !DILexicalBlockFile(scope: !990, file: !991, discriminator: 0)
!994 = !DILocation(line: 12, column: 6, scope: !993)
!995 = !DILocation(line: 13, column: 8, scope: !993)
!996 = !DILocation(line: 15, column: 6, scope: !993)
!997 = !DILocation(line: 20, column: 8, scope: !993)
!998 = !DILocation(line: 22, column: 6, scope: !993)
!999 = !DILocation(line: 29, column: 8, scope: !993)
!1000 = !DILocation(line: 31, column: 6, scope: !993)
!1001 = !DILocation(line: 37, column: 8, scope: !993)
!1002 = !DILocation(line: 39, column: 6, scope: !993)
!1003 = !DILocation(line: 44, column: 8, scope: !993)
!1004 = !DILocation(line: 47, column: 6, scope: !993)
!1005 = !DILocation(line: 51, column: 8, scope: !993)
!1006 = !DILocation(line: 53, column: 8, scope: !993)
!1007 = distinct !DISubprogram(name: "unstake::unstake.anon.1", linkageName: "unstake::unstake.anon.1", scope: null, file: !991, line: 82, type: !5, scopeLine: 82, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1008 = !DILocation(line: 82, column: 59, scope: !1009)
!1009 = !DILexicalBlockFile(scope: !1007, file: !991, discriminator: 0)
!1010 = !DILocation(line: 84, column: 29, scope: !1009)
!1011 = !DILocation(line: 84, column: 8, scope: !1009)
!1012 = distinct !DISubprogram(name: "unstake::unstake.anon.3", linkageName: "unstake::unstake.anon.3", scope: null, file: !991, line: 99, type: !5, scopeLine: 99, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1013 = !DILocation(line: 99, column: 31, scope: !1014)
!1014 = !DILexicalBlockFile(scope: !1012, file: !991, discriminator: 0)
!1015 = distinct !DISubprogram(name: "unstake::unstake.anon.4", linkageName: "unstake::unstake.anon.4", scope: null, file: !991, line: 101, type: !5, scopeLine: 101, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1016 = !DILocation(line: 101, column: 15, scope: !1017)
!1017 = !DILexicalBlockFile(scope: !1015, file: !991, discriminator: 0)
!1018 = distinct !DISubprogram(name: "unstake::unstake.anon.2", linkageName: "unstake::unstake.anon.2", scope: null, file: !991, line: 91, type: !5, scopeLine: 91, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1019 = !DILocation(line: 91, column: 11, scope: !1020)
!1020 = !DILexicalBlockFile(scope: !1018, file: !991, discriminator: 0)
!1021 = !DILocation(line: 93, column: 29, scope: !1020)
!1022 = !DILocation(line: 93, column: 8, scope: !1020)
!1023 = !DILocation(line: 99, column: 11, scope: !1020)
!1024 = !DILocation(line: 99, column: 8, scope: !1020)
!1025 = !DILocation(line: 99, column: 31, scope: !1020)
!1026 = !DILocation(line: 101, column: 15, scope: !1020)
!1027 = distinct !DISubprogram(name: "unstake::unstake.anon.5", linkageName: "unstake::unstake.anon.5", scope: null, file: !991, line: 146, type: !5, scopeLine: 146, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1028 = !DILocation(line: 146, column: 52, scope: !1029)
!1029 = !DILexicalBlockFile(scope: !1027, file: !991, discriminator: 0)
!1030 = !DILocation(line: 147, column: 37, scope: !1029)
!1031 = !DILocation(line: 147, column: 8, scope: !1029)
!1032 = !DILocation(line: 149, column: 13, scope: !1029)
!1033 = !DILocation(line: 150, column: 13, scope: !1029)
!1034 = !DILocation(line: 148, column: 8, scope: !1029)
!1035 = distinct !DISubprogram(name: "unstake::unstake.anon.6", linkageName: "unstake::unstake.anon.6", scope: null, file: !991, line: 154, type: !5, scopeLine: 154, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1036 = !DILocation(line: 154, column: 29, scope: !1037)
!1037 = !DILexicalBlockFile(scope: !1035, file: !991, discriminator: 0)
!1038 = !DILocation(line: 155, column: 8, scope: !1037)
!1039 = !DILocation(line: 156, column: 8, scope: !1037)
!1040 = !DILocation(line: 159, column: 36, scope: !1037)
!1041 = !DILocation(line: 159, column: 12, scope: !1037)
!1042 = !DILocation(line: 160, column: 48, scope: !1037)
!1043 = !DILocation(line: 160, column: 12, scope: !1037)
!1044 = !DILocation(line: 161, column: 51, scope: !1037)
!1045 = !DILocation(line: 161, column: 12, scope: !1037)
!1046 = !DILocation(line: 158, column: 27, scope: !1037)
!1047 = !DILocation(line: 158, column: 8, scope: !1037)
!1048 = !DILocation(line: 165, column: 39, scope: !1037)
!1049 = !DILocation(line: 164, column: 22, scope: !1037)
!1050 = !DILocation(line: 164, column: 8, scope: !1037)
!1051 = !DILocation(line: 170, column: 8, scope: !1037)
!1052 = distinct !DISubprogram(name: "unstake::unstake.1", linkageName: "unstake::unstake.1", scope: null, file: !991, line: 56, type: !5, scopeLine: 56, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1053 = !DILocation(line: 56, column: 4, scope: !1054)
!1054 = !DILexicalBlockFile(scope: !1052, file: !991, discriminator: 0)
!1055 = !DILocation(line: 57, column: 16, scope: !1054)
!1056 = !DILocation(line: 57, column: 4, scope: !1054)
!1057 = !DILocation(line: 58, column: 4, scope: !1054)
!1058 = !DILocation(line: 59, column: 4, scope: !1054)
!1059 = !DILocation(line: 62, column: 4, scope: !1054)
!1060 = !DILocation(line: 65, column: 4, scope: !1054)
!1061 = !DILocation(line: 66, column: 4, scope: !1054)
!1062 = !DILocation(line: 67, column: 4, scope: !1054)
!1063 = !DILocation(line: 68, column: 4, scope: !1054)
!1064 = !DILocation(line: 69, column: 4, scope: !1054)
!1065 = !DILocation(line: 70, column: 4, scope: !1054)
!1066 = !DILocation(line: 71, column: 4, scope: !1054)
!1067 = !DILocation(line: 72, column: 4, scope: !1054)
!1068 = !DILocation(line: 75, column: 26, scope: !1054)
!1069 = !DILocation(line: 75, column: 4, scope: !1054)
!1070 = !DILocation(line: 82, column: 37, scope: !1054)
!1071 = !DILocation(line: 82, column: 34, scope: !1054)
!1072 = !DILocation(line: 82, column: 59, scope: !1054)
!1073 = !DILocation(line: 91, column: 11, scope: !1054)
!1074 = !DILocation(line: 82, column: 4, scope: !1054)
!1075 = !DILocation(line: 108, column: 9, scope: !1054)
!1076 = !DILocation(line: 109, column: 9, scope: !1054)
!1077 = !DILocation(line: 107, column: 4, scope: !1054)
!1078 = !DILocation(line: 113, column: 9, scope: !1054)
!1079 = !DILocation(line: 114, column: 9, scope: !1054)
!1080 = !DILocation(line: 115, column: 9, scope: !1054)
!1081 = !DILocation(line: 116, column: 9, scope: !1054)
!1082 = !DILocation(line: 112, column: 4, scope: !1054)
!1083 = !DILocation(line: 119, column: 4, scope: !1054)
!1084 = !DILocation(line: 120, column: 4, scope: !1054)
!1085 = !DILocation(line: 123, column: 4, scope: !1054)
!1086 = !DILocation(line: 127, column: 9, scope: !1054)
!1087 = !DILocation(line: 128, column: 9, scope: !1054)
!1088 = !DILocation(line: 126, column: 4, scope: !1054)
!1089 = !DILocation(line: 131, column: 9, scope: !1054)
!1090 = !DILocation(line: 132, column: 9, scope: !1054)
!1091 = !DILocation(line: 130, column: 4, scope: !1054)
!1092 = !DILocation(line: 135, column: 9, scope: !1054)
!1093 = !DILocation(line: 136, column: 9, scope: !1054)
!1094 = !DILocation(line: 134, column: 4, scope: !1054)
!1095 = !DILocation(line: 139, column: 9, scope: !1054)
!1096 = !DILocation(line: 140, column: 9, scope: !1054)
!1097 = !DILocation(line: 138, column: 4, scope: !1054)
!1098 = !DILocation(line: 146, column: 7, scope: !1054)
!1099 = !DILocation(line: 146, column: 22, scope: !1054)
!1100 = !DILocation(line: 146, column: 4, scope: !1054)
!1101 = !DILocation(line: 146, column: 52, scope: !1054)
!1102 = !DILocation(line: 154, column: 7, scope: !1054)
!1103 = !DILocation(line: 154, column: 4, scope: !1054)
!1104 = !DILocation(line: 154, column: 29, scope: !1054)
!1105 = !DILocation(line: 174, column: 4, scope: !1054)
!1106 = !DILocation(line: 185, column: 4, scope: !1054)
!1107 = distinct !DISubprogram(name: "math::mul_div.3", linkageName: "math::mul_div.3", scope: null, file: !1108, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1108 = !DIFile(filename: "programs/helix-staking/src/instructions/math.rs", directory: "/workspace")
!1109 = !DILocation(line: 9, column: 4, scope: !1110)
!1110 = !DILexicalBlockFile(scope: !1107, file: !1108, discriminator: 0)
!1111 = !DILocation(line: 10, column: 4, scope: !1110)
!1112 = !DILocation(line: 11, column: 18, scope: !1110)
!1113 = !DILocation(line: 12, column: 21, scope: !1110)
!1114 = !DILocation(line: 12, column: 9, scope: !1110)
!1115 = !DILocation(line: 13, column: 15, scope: !1110)
!1116 = !DILocation(line: 13, column: 9, scope: !1110)
!1117 = !DILocation(line: 14, column: 21, scope: !1110)
!1118 = !DILocation(line: 14, column: 9, scope: !1110)
!1119 = !DILocation(line: 15, column: 15, scope: !1110)
!1120 = !DILocation(line: 15, column: 9, scope: !1110)
!1121 = !DILocation(line: 11, column: 4, scope: !1110)
!1122 = !DILocation(line: 16, column: 4, scope: !1110)
!1123 = !DILocation(line: 16, column: 38, scope: !1110)
!1124 = !DILocation(line: 16, column: 26, scope: !1110)
!1125 = distinct !DISubprogram(name: "math::mul_div_up.3", linkageName: "math::mul_div_up.3", scope: null, file: !1108, line: 22, type: !5, scopeLine: 22, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1126 = !DILocation(line: 22, column: 4, scope: !1127)
!1127 = !DILexicalBlockFile(scope: !1125, file: !1108, discriminator: 0)
!1128 = !DILocation(line: 23, column: 4, scope: !1127)
!1129 = !DILocation(line: 24, column: 21, scope: !1127)
!1130 = !DILocation(line: 25, column: 21, scope: !1127)
!1131 = !DILocation(line: 25, column: 9, scope: !1127)
!1132 = !DILocation(line: 26, column: 15, scope: !1127)
!1133 = !DILocation(line: 26, column: 9, scope: !1127)
!1134 = !DILocation(line: 27, column: 22, scope: !1127)
!1135 = !DILocation(line: 27, column: 21, scope: !1127)
!1136 = !DILocation(line: 27, column: 9, scope: !1127)
!1137 = !DILocation(line: 28, column: 15, scope: !1127)
!1138 = !DILocation(line: 28, column: 9, scope: !1127)
!1139 = !DILocation(line: 24, column: 4, scope: !1127)
!1140 = !DILocation(line: 30, column: 21, scope: !1127)
!1141 = !DILocation(line: 30, column: 9, scope: !1127)
!1142 = !DILocation(line: 31, column: 15, scope: !1127)
!1143 = !DILocation(line: 31, column: 9, scope: !1127)
!1144 = !DILocation(line: 29, column: 4, scope: !1127)
!1145 = !DILocation(line: 32, column: 4, scope: !1127)
!1146 = !DILocation(line: 32, column: 38, scope: !1127)
!1147 = !DILocation(line: 32, column: 26, scope: !1127)
!1148 = distinct !DISubprogram(name: "math::calculate_lpb_bonus.anon.1", linkageName: "math::calculate_lpb_bonus.anon.1", scope: null, file: !1108, line: 39, type: !5, scopeLine: 39, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1149 = !DILocation(line: 39, column: 23, scope: !1150)
!1150 = !DILexicalBlockFile(scope: !1148, file: !1108, discriminator: 0)
!1151 = !DILocation(line: 40, column: 15, scope: !1150)
!1152 = !DILocation(line: 40, column: 8, scope: !1150)
!1153 = distinct !DISubprogram(name: "math::calculate_lpb_bonus.anon.2", linkageName: "math::calculate_lpb_bonus.anon.2", scope: null, file: !1108, line: 44, type: !5, scopeLine: 44, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1154 = !DILocation(line: 44, column: 34, scope: !1155)
!1155 = !DILexicalBlockFile(scope: !1153, file: !1108, discriminator: 0)
!1156 = !DILocation(line: 45, column: 18, scope: !1155)
!1157 = !DILocation(line: 45, column: 15, scope: !1155)
!1158 = !DILocation(line: 45, column: 8, scope: !1155)
!1159 = distinct !DISubprogram(name: "math::calculate_lpb_bonus.1", linkageName: "math::calculate_lpb_bonus.1", scope: null, file: !1108, line: 38, type: !5, scopeLine: 38, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1160 = !DILocation(line: 38, column: 4, scope: !1161)
!1161 = !DILexicalBlockFile(scope: !1159, file: !1108, discriminator: 0)
!1162 = !DILocation(line: 39, column: 7, scope: !1161)
!1163 = !DILocation(line: 39, column: 4, scope: !1161)
!1164 = !DILocation(line: 39, column: 23, scope: !1161)
!1165 = !DILocation(line: 44, column: 7, scope: !1161)
!1166 = !DILocation(line: 44, column: 4, scope: !1161)
!1167 = !DILocation(line: 44, column: 34, scope: !1161)
!1168 = !DILocation(line: 52, column: 9, scope: !1161)
!1169 = !DILocation(line: 53, column: 9, scope: !1161)
!1170 = !DILocation(line: 51, column: 4, scope: !1161)
!1171 = !DILocation(line: 56, column: 9, scope: !1161)
!1172 = !DILocation(line: 57, column: 9, scope: !1161)
!1173 = !DILocation(line: 58, column: 9, scope: !1161)
!1174 = !DILocation(line: 59, column: 9, scope: !1161)
!1175 = !DILocation(line: 55, column: 4, scope: !1161)
!1176 = !DILocation(line: 62, column: 9, scope: !1161)
!1177 = !DILocation(line: 63, column: 9, scope: !1161)
!1178 = !DILocation(line: 61, column: 4, scope: !1161)
!1179 = !DILocation(line: 65, column: 4, scope: !1161)
!1180 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.1", linkageName: "math::calculate_bpb_bonus.anon.1", scope: null, file: !1108, line: 72, type: !5, scopeLine: 72, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1181 = !DILocation(line: 72, column: 26, scope: !1182)
!1182 = !DILexicalBlockFile(scope: !1180, file: !1108, discriminator: 0)
!1183 = !DILocation(line: 73, column: 15, scope: !1182)
!1184 = !DILocation(line: 73, column: 8, scope: !1182)
!1185 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.anon.2", linkageName: "math::calculate_bpb_bonus.anon.2", scope: null, file: !1108, line: 80, type: !5, scopeLine: 80, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1186 = !DILocation(line: 80, column: 38, scope: !1187)
!1187 = !DILexicalBlockFile(scope: !1185, file: !1108, discriminator: 0)
!1188 = !DILocation(line: 81, column: 15, scope: !1187)
!1189 = !DILocation(line: 81, column: 8, scope: !1187)
!1190 = distinct !DISubprogram(name: "math::calculate_bpb_bonus.1", linkageName: "math::calculate_bpb_bonus.1", scope: null, file: !1108, line: 71, type: !5, scopeLine: 71, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1191 = !DILocation(line: 71, column: 4, scope: !1192)
!1192 = !DILexicalBlockFile(scope: !1190, file: !1108, discriminator: 0)
!1193 = !DILocation(line: 72, column: 7, scope: !1192)
!1194 = !DILocation(line: 72, column: 4, scope: !1192)
!1195 = !DILocation(line: 72, column: 26, scope: !1192)
!1196 = !DILocation(line: 78, column: 24, scope: !1192)
!1197 = !DILocation(line: 78, column: 4, scope: !1192)
!1198 = !DILocation(line: 80, column: 7, scope: !1192)
!1199 = !DILocation(line: 80, column: 4, scope: !1192)
!1200 = !DILocation(line: 80, column: 38, scope: !1192)
!1201 = !DILocation(line: 86, column: 16, scope: !1192)
!1202 = !DILocation(line: 86, column: 4, scope: !1192)
!1203 = !DILocation(line: 88, column: 4, scope: !1192)
!1204 = distinct !DISubprogram(name: "math::calculate_t_shares.3", linkageName: "math::calculate_t_shares.3", scope: null, file: !1108, line: 93, type: !5, scopeLine: 93, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1205 = !DILocation(line: 93, column: 4, scope: !1206)
!1206 = !DILexicalBlockFile(scope: !1204, file: !1108, discriminator: 0)
!1207 = !DILocation(line: 98, column: 4, scope: !1206)
!1208 = !DILocation(line: 100, column: 20, scope: !1206)
!1209 = !DILocation(line: 100, column: 4, scope: !1206)
!1210 = !DILocation(line: 101, column: 20, scope: !1206)
!1211 = !DILocation(line: 101, column: 4, scope: !1206)
!1212 = !DILocation(line: 105, column: 9, scope: !1206)
!1213 = !DILocation(line: 106, column: 9, scope: !1206)
!1214 = !DILocation(line: 107, column: 9, scope: !1206)
!1215 = !DILocation(line: 108, column: 9, scope: !1206)
!1216 = !DILocation(line: 104, column: 4, scope: !1206)
!1217 = !DILocation(line: 112, column: 22, scope: !1206)
!1218 = !DILocation(line: 112, column: 4, scope: !1206)
!1219 = !DILocation(line: 113, column: 26, scope: !1206)
!1220 = !DILocation(line: 113, column: 4, scope: !1206)
!1221 = !DILocation(line: 114, column: 26, scope: !1206)
!1222 = !DILocation(line: 114, column: 4, scope: !1206)
!1223 = !DILocation(line: 117, column: 9, scope: !1206)
!1224 = !DILocation(line: 118, column: 9, scope: !1206)
!1225 = !DILocation(line: 119, column: 9, scope: !1206)
!1226 = !DILocation(line: 120, column: 9, scope: !1206)
!1227 = !DILocation(line: 116, column: 4, scope: !1206)
!1228 = !DILocation(line: 123, column: 19, scope: !1206)
!1229 = !DILocation(line: 124, column: 9, scope: !1206)
!1230 = !DILocation(line: 123, column: 4, scope: !1206)
!1231 = !DILocation(line: 126, column: 4, scope: !1206)
!1232 = distinct !DISubprogram(name: "math::calculate_early_penalty.anon.1", linkageName: "math::calculate_early_penalty.anon.1", scope: null, file: !1108, line: 141, type: !5, scopeLine: 141, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1233 = !DILocation(line: 141, column: 32, scope: !1234)
!1234 = !DILexicalBlockFile(scope: !1232, file: !1108, discriminator: 0)
!1235 = !DILocation(line: 142, column: 15, scope: !1234)
!1236 = !DILocation(line: 142, column: 8, scope: !1234)
!1237 = distinct !DISubprogram(name: "math::calculate_early_penalty.anon.2", linkageName: "math::calculate_early_penalty.anon.2", scope: null, file: !1108, line: 166, type: !5, scopeLine: 166, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1238 = !DILocation(line: 166, column: 61, scope: !1239)
!1239 = !DILexicalBlockFile(scope: !1237, file: !1108, discriminator: 0)
!1240 = distinct !DISubprogram(name: "math::calculate_early_penalty.anon.3", linkageName: "math::calculate_early_penalty.anon.3", scope: null, file: !1108, line: 168, type: !5, scopeLine: 168, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1241 = !DILocation(line: 168, column: 11, scope: !1242)
!1242 = !DILexicalBlockFile(scope: !1240, file: !1108, discriminator: 0)
!1243 = distinct !DISubprogram(name: "math::calculate_early_penalty.4", linkageName: "math::calculate_early_penalty.4", scope: null, file: !1108, line: 134, type: !5, scopeLine: 134, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1244 = !DILocation(line: 134, column: 4, scope: !1245)
!1245 = !DILexicalBlockFile(scope: !1243, file: !1108, discriminator: 0)
!1246 = !DILocation(line: 141, column: 7, scope: !1245)
!1247 = !DILocation(line: 141, column: 4, scope: !1245)
!1248 = !DILocation(line: 141, column: 32, scope: !1245)
!1249 = !DILocation(line: 146, column: 9, scope: !1245)
!1250 = !DILocation(line: 147, column: 9, scope: !1245)
!1251 = !DILocation(line: 145, column: 4, scope: !1245)
!1252 = !DILocation(line: 150, column: 9, scope: !1245)
!1253 = !DILocation(line: 151, column: 9, scope: !1245)
!1254 = !DILocation(line: 149, column: 4, scope: !1245)
!1255 = !DILocation(line: 155, column: 9, scope: !1245)
!1256 = !DILocation(line: 156, column: 9, scope: !1245)
!1257 = !DILocation(line: 157, column: 9, scope: !1245)
!1258 = !DILocation(line: 158, column: 9, scope: !1245)
!1259 = !DILocation(line: 154, column: 4, scope: !1245)
!1260 = !DILocation(line: 162, column: 9, scope: !1245)
!1261 = !DILocation(line: 163, column: 9, scope: !1245)
!1262 = !DILocation(line: 161, column: 4, scope: !1245)
!1263 = !DILocation(line: 166, column: 31, scope: !1245)
!1264 = !DILocation(line: 166, column: 28, scope: !1245)
!1265 = !DILocation(line: 166, column: 61, scope: !1245)
!1266 = !DILocation(line: 168, column: 11, scope: !1245)
!1267 = !DILocation(line: 166, column: 4, scope: !1245)
!1268 = !DILocation(line: 173, column: 25, scope: !1245)
!1269 = !DILocation(line: 173, column: 4, scope: !1245)
!1270 = !DILocation(line: 175, column: 4, scope: !1245)
!1271 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.1", linkageName: "math::calculate_late_penalty.anon.1", scope: null, file: !1108, line: 192, type: !5, scopeLine: 192, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1272 = !DILocation(line: 192, column: 32, scope: !1273)
!1273 = !DILexicalBlockFile(scope: !1271, file: !1108, discriminator: 0)
!1274 = !DILocation(line: 193, column: 15, scope: !1273)
!1275 = !DILocation(line: 193, column: 8, scope: !1273)
!1276 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.2", linkageName: "math::calculate_late_penalty.anon.2", scope: null, file: !1108, line: 205, type: !5, scopeLine: 205, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1277 = !DILocation(line: 205, column: 38, scope: !1278)
!1278 = !DILexicalBlockFile(scope: !1276, file: !1108, discriminator: 0)
!1279 = !DILocation(line: 206, column: 15, scope: !1278)
!1280 = !DILocation(line: 206, column: 8, scope: !1278)
!1281 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.3", linkageName: "math::calculate_late_penalty.anon.3", scope: null, file: !1108, line: 217, type: !5, scopeLine: 217, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1282 = !DILocation(line: 217, column: 49, scope: !1283)
!1283 = !DILexicalBlockFile(scope: !1281, file: !1108, discriminator: 0)
!1284 = distinct !DISubprogram(name: "math::calculate_late_penalty.anon.4", linkageName: "math::calculate_late_penalty.anon.4", scope: null, file: !1108, line: 219, type: !5, scopeLine: 219, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1285 = !DILocation(line: 219, column: 11, scope: !1286)
!1286 = !DILexicalBlockFile(scope: !1284, file: !1108, discriminator: 0)
!1287 = distinct !DISubprogram(name: "math::calculate_late_penalty.4", linkageName: "math::calculate_late_penalty.4", scope: null, file: !1108, line: 185, type: !5, scopeLine: 185, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1288 = !DILocation(line: 185, column: 4, scope: !1289)
!1289 = !DILexicalBlockFile(scope: !1287, file: !1108, discriminator: 0)
!1290 = !DILocation(line: 192, column: 7, scope: !1289)
!1291 = !DILocation(line: 192, column: 4, scope: !1289)
!1292 = !DILocation(line: 192, column: 32, scope: !1289)
!1293 = !DILocation(line: 197, column: 9, scope: !1289)
!1294 = !DILocation(line: 198, column: 9, scope: !1289)
!1295 = !DILocation(line: 196, column: 4, scope: !1289)
!1296 = !DILocation(line: 201, column: 9, scope: !1289)
!1297 = !DILocation(line: 202, column: 9, scope: !1289)
!1298 = !DILocation(line: 200, column: 4, scope: !1289)
!1299 = !DILocation(line: 205, column: 7, scope: !1289)
!1300 = !DILocation(line: 205, column: 4, scope: !1289)
!1301 = !DILocation(line: 205, column: 38, scope: !1289)
!1302 = !DILocation(line: 210, column: 9, scope: !1289)
!1303 = !DILocation(line: 211, column: 9, scope: !1289)
!1304 = !DILocation(line: 209, column: 4, scope: !1289)
!1305 = !DILocation(line: 214, column: 22, scope: !1289)
!1306 = !DILocation(line: 214, column: 4, scope: !1289)
!1307 = !DILocation(line: 217, column: 24, scope: !1289)
!1308 = !DILocation(line: 217, column: 21, scope: !1289)
!1309 = !DILocation(line: 217, column: 49, scope: !1289)
!1310 = !DILocation(line: 219, column: 11, scope: !1289)
!1311 = !DILocation(line: 217, column: 4, scope: !1289)
!1312 = !DILocation(line: 224, column: 25, scope: !1289)
!1313 = !DILocation(line: 224, column: 4, scope: !1289)
!1314 = !DILocation(line: 226, column: 4, scope: !1289)
!1315 = distinct !DISubprogram(name: "math::calculate_pending_rewards.3", linkageName: "math::calculate_pending_rewards.3", scope: null, file: !1108, line: 233, type: !5, scopeLine: 233, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1316 = !DILocation(line: 233, column: 4, scope: !1317)
!1317 = !DILexicalBlockFile(scope: !1315, file: !1108, discriminator: 0)
!1318 = !DILocation(line: 238, column: 25, scope: !1317)
!1319 = !DILocation(line: 239, column: 21, scope: !1317)
!1320 = !DILocation(line: 239, column: 9, scope: !1317)
!1321 = !DILocation(line: 240, column: 15, scope: !1317)
!1322 = !DILocation(line: 240, column: 9, scope: !1317)
!1323 = !DILocation(line: 238, column: 4, scope: !1317)
!1324 = !DILocation(line: 243, column: 51, scope: !1317)
!1325 = !DILocation(line: 243, column: 36, scope: !1317)
!1326 = !DILocation(line: 243, column: 4, scope: !1317)
!1327 = !DILocation(line: 245, column: 4, scope: !1317)
!1328 = !DILocation(line: 245, column: 43, scope: !1317)
!1329 = !DILocation(line: 245, column: 31, scope: !1317)
!1330 = distinct !DISubprogram(name: "math::calculate_reward_debt.2", linkageName: "math::calculate_reward_debt.2", scope: null, file: !1108, line: 252, type: !5, scopeLine: 252, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1331 = !DILocation(line: 252, column: 4, scope: !1332)
!1332 = !DILexicalBlockFile(scope: !1330, file: !1108, discriminator: 0)
!1333 = !DILocation(line: 253, column: 18, scope: !1332)
!1334 = !DILocation(line: 254, column: 21, scope: !1332)
!1335 = !DILocation(line: 254, column: 9, scope: !1332)
!1336 = !DILocation(line: 255, column: 15, scope: !1332)
!1337 = !DILocation(line: 255, column: 9, scope: !1332)
!1338 = !DILocation(line: 253, column: 4, scope: !1332)
!1339 = !DILocation(line: 257, column: 4, scope: !1332)
!1340 = !DILocation(line: 257, column: 38, scope: !1332)
!1341 = !DILocation(line: 257, column: 26, scope: !1332)
!1342 = distinct !DISubprogram(name: "math::get_current_day.3", linkageName: "math::get_current_day.3", scope: null, file: !1108, line: 262, type: !5, scopeLine: 262, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1343 = !DILocation(line: 262, column: 4, scope: !1344)
!1344 = !DILexicalBlockFile(scope: !1342, file: !1108, discriminator: 0)
!1345 = !DILocation(line: 268, column: 9, scope: !1344)
!1346 = !DILocation(line: 269, column: 9, scope: !1344)
!1347 = !DILocation(line: 267, column: 4, scope: !1344)
!1348 = !DILocation(line: 272, column: 9, scope: !1344)
!1349 = !DILocation(line: 273, column: 9, scope: !1344)
!1350 = !DILocation(line: 271, column: 4, scope: !1344)
!1351 = !DILocation(line: 275, column: 4, scope: !1344)
!1352 = distinct !DISubprogram(name: "sol.model.struct.anchor.AdminSetSlotsPerDay", linkageName: "sol.model.struct.anchor.AdminSetSlotsPerDay", scope: null, file: !1353, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1353 = !DIFile(filename: "programs/helix-staking/src/instructions/admin_set_slots_per_day.rs", directory: "/workspace")
!1354 = !DILocation(line: 11, column: 4, scope: !1355)
!1355 = !DILexicalBlockFile(scope: !1352, file: !1353, discriminator: 0)
!1356 = !DILocation(line: 12, column: 6, scope: !1355)
!1357 = !DILocation(line: 15, column: 8, scope: !1355)
!1358 = !DILocation(line: 17, column: 6, scope: !1355)
!1359 = !DILocation(line: 22, column: 8, scope: !1355)
!1360 = distinct !DISubprogram(name: "admin_set_slots_per_day::admin_set_slots_per_day.2", linkageName: "admin_set_slots_per_day::admin_set_slots_per_day.2", scope: null, file: !1353, line: 25, type: !5, scopeLine: 25, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1361 = !DILocation(line: 25, column: 4, scope: !1362)
!1362 = !DILexicalBlockFile(scope: !1360, file: !1353, discriminator: 0)
!1363 = !DILocation(line: 29, column: 4, scope: !1362)
!1364 = !DILocation(line: 30, column: 4, scope: !1362)
!1365 = !DILocation(line: 31, column: 4, scope: !1362)
!1366 = distinct !DISubprogram(name: "sol.model.struct.anchor.MigrateStake", linkageName: "sol.model.struct.anchor.MigrateStake", scope: null, file: !1367, line: 7, type: !5, scopeLine: 7, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1367 = !DIFile(filename: "programs/helix-staking/src/instructions/migrate_stake.rs", directory: "/workspace")
!1368 = !DILocation(line: 7, column: 4, scope: !1369)
!1369 = !DILexicalBlockFile(scope: !1366, file: !1367, discriminator: 0)
!1370 = !DILocation(line: 8, column: 6, scope: !1369)
!1371 = !DILocation(line: 9, column: 8, scope: !1369)
!1372 = !DILocation(line: 11, column: 6, scope: !1369)
!1373 = !DILocation(line: 23, column: 8, scope: !1369)
!1374 = !DILocation(line: 25, column: 8, scope: !1369)
!1375 = distinct !DISubprogram(name: "migrate_stake::migrate_stake.1", linkageName: "migrate_stake::migrate_stake.1", scope: null, file: !1367, line: 28, type: !5, scopeLine: 28, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1376 = !DILocation(line: 28, column: 4, scope: !1377)
!1377 = !DILexicalBlockFile(scope: !1375, file: !1367, discriminator: 0)
!1378 = !DILocation(line: 29, column: 4, scope: !1377)
!1379 = distinct !DISubprogram(name: "sol.model.struct.anchor.InitializeClaimPeriod", linkageName: "sol.model.struct.anchor.InitializeClaimPeriod", scope: null, file: !1380, line: 9, type: !5, scopeLine: 9, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1380 = !DIFile(filename: "programs/helix-staking/src/instructions/initialize_claim_period.rs", directory: "/workspace")
!1381 = !DILocation(line: 9, column: 4, scope: !1382)
!1382 = !DILexicalBlockFile(scope: !1379, file: !1380, discriminator: 0)
!1383 = !DILocation(line: 11, column: 6, scope: !1382)
!1384 = !DILocation(line: 15, column: 8, scope: !1382)
!1385 = !DILocation(line: 17, column: 6, scope: !1382)
!1386 = !DILocation(line: 21, column: 8, scope: !1382)
!1387 = !DILocation(line: 23, column: 6, scope: !1382)
!1388 = !DILocation(line: 30, column: 8, scope: !1382)
!1389 = !DILocation(line: 32, column: 8, scope: !1382)
!1390 = distinct !DISubprogram(name: "initialize_claim_period::initialize_claim_period.5", linkageName: "initialize_claim_period::initialize_claim_period.5", scope: null, file: !1380, line: 35, type: !5, scopeLine: 35, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1391 = !DILocation(line: 35, column: 4, scope: !1392)
!1392 = !DILexicalBlockFile(scope: !1390, file: !1380, discriminator: 0)
!1393 = !DILocation(line: 45, column: 4, scope: !1392)
!1394 = !DILocation(line: 47, column: 16, scope: !1392)
!1395 = !DILocation(line: 47, column: 4, scope: !1392)
!1396 = !DILocation(line: 48, column: 4, scope: !1392)
!1397 = !DILocation(line: 49, column: 4, scope: !1392)
!1398 = !DILocation(line: 55, column: 17, scope: !1392)
!1399 = !DILocation(line: 56, column: 17, scope: !1392)
!1400 = !DILocation(line: 53, column: 9, scope: !1392)
!1401 = !DILocation(line: 58, column: 9, scope: !1392)
!1402 = !DILocation(line: 52, column: 4, scope: !1392)
!1403 = !DILocation(line: 61, column: 52, scope: !1392)
!1404 = !DILocation(line: 61, column: 4, scope: !1392)
!1405 = !DILocation(line: 62, column: 4, scope: !1392)
!1406 = !DILocation(line: 63, column: 4, scope: !1392)
!1407 = !DILocation(line: 64, column: 4, scope: !1392)
!1408 = !DILocation(line: 65, column: 4, scope: !1392)
!1409 = !DILocation(line: 66, column: 4, scope: !1392)
!1410 = !DILocation(line: 67, column: 4, scope: !1392)
!1411 = !DILocation(line: 68, column: 4, scope: !1392)
!1412 = !DILocation(line: 69, column: 4, scope: !1392)
!1413 = !DILocation(line: 70, column: 4, scope: !1392)
!1414 = !DILocation(line: 71, column: 4, scope: !1392)
!1415 = !DILocation(line: 72, column: 4, scope: !1392)
!1416 = !DILocation(line: 73, column: 4, scope: !1392)
!1417 = !DILocation(line: 76, column: 4, scope: !1392)
!1418 = !DILocation(line: 77, column: 4, scope: !1392)
!1419 = !DILocation(line: 78, column: 4, scope: !1392)
!1420 = !DILocation(line: 79, column: 4, scope: !1392)
!1421 = !DILocation(line: 82, column: 4, scope: !1392)
!1422 = !DILocation(line: 83, column: 4, scope: !1392)
!1423 = !DILocation(line: 84, column: 4, scope: !1392)
!1424 = !DILocation(line: 87, column: 4, scope: !1392)
!1425 = !DILocation(line: 97, column: 4, scope: !1392)
!1426 = distinct !DISubprogram(name: "sol.model.struct.anchor.AdminMint", linkageName: "sol.model.struct.anchor.AdminMint", scope: null, file: !1427, line: 11, type: !5, scopeLine: 11, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1427 = !DIFile(filename: "programs/helix-staking/src/instructions/admin_mint.rs", directory: "/workspace")
!1428 = !DILocation(line: 11, column: 4, scope: !1429)
!1429 = !DILexicalBlockFile(scope: !1426, file: !1427, discriminator: 0)
!1430 = !DILocation(line: 12, column: 6, scope: !1429)
!1431 = !DILocation(line: 13, column: 8, scope: !1429)
!1432 = !DILocation(line: 15, column: 6, scope: !1429)
!1433 = !DILocation(line: 21, column: 8, scope: !1429)
!1434 = !DILocation(line: 24, column: 6, scope: !1429)
!1435 = !DILocation(line: 28, column: 8, scope: !1429)
!1436 = !DILocation(line: 30, column: 6, scope: !1429)
!1437 = !DILocation(line: 35, column: 8, scope: !1429)
!1438 = !DILocation(line: 37, column: 6, scope: !1429)
!1439 = !DILocation(line: 41, column: 8, scope: !1429)
!1440 = !DILocation(line: 43, column: 8, scope: !1429)
!1441 = distinct !DISubprogram(name: "admin_mint::admin_mint.2", linkageName: "admin_mint::admin_mint.2", scope: null, file: !1427, line: 46, type: !5, scopeLine: 46, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1442 = !DILocation(line: 46, column: 4, scope: !1443)
!1443 = !DILexicalBlockFile(scope: !1441, file: !1427, discriminator: 0)
!1444 = !DILocation(line: 47, column: 4, scope: !1443)
!1445 = !DILocation(line: 51, column: 9, scope: !1443)
!1446 = !DILocation(line: 52, column: 15, scope: !1443)
!1447 = !DILocation(line: 52, column: 9, scope: !1443)
!1448 = !DILocation(line: 50, column: 4, scope: !1443)
!1449 = !DILocation(line: 53, column: 4, scope: !1443)
!1450 = !DILocation(line: 59, column: 4, scope: !1443)
!1451 = !DILocation(line: 62, column: 4, scope: !1443)
!1452 = !DILocation(line: 66, column: 4, scope: !1443)
!1453 = !DILocation(line: 71, column: 39, scope: !1443)
!1454 = !DILocation(line: 73, column: 40, scope: !1443)
!1455 = !DILocation(line: 73, column: 16, scope: !1443)
!1456 = !DILocation(line: 74, column: 57, scope: !1443)
!1457 = !DILocation(line: 74, column: 16, scope: !1443)
!1458 = !DILocation(line: 75, column: 55, scope: !1443)
!1459 = !DILocation(line: 75, column: 16, scope: !1443)
!1460 = !DILocation(line: 72, column: 12, scope: !1443)
!1461 = !DILocation(line: 70, column: 8, scope: !1443)
!1462 = !DILocation(line: 69, column: 4, scope: !1443)
!1463 = !DILocation(line: 83, column: 4, scope: !1443)
!1464 = !DILocation(line: 90, column: 4, scope: !1443)
!1465 = distinct !DISubprogram(name: "lib::initialize.2", linkageName: "lib::initialize.2", scope: null, file: !1466, line: 21, type: !5, scopeLine: 21, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1466 = !DIFile(filename: "programs/helix-staking/src/lib.rs", directory: "/workspace")
!1467 = !DILocation(line: 21, column: 8, scope: !1468)
!1468 = !DILexicalBlockFile(scope: !1465, file: !1466, discriminator: 0)
!1469 = !DILocation(line: 22, column: 20, scope: !1468)
!1470 = !DILocation(line: 22, column: 8, scope: !1468)
!1471 = !DILocation(line: 23, column: 8, scope: !1468)
!1472 = !DILocation(line: 26, column: 56, scope: !1468)
!1473 = !DILocation(line: 26, column: 8, scope: !1468)
!1474 = !DILocation(line: 27, column: 46, scope: !1468)
!1475 = !DILocation(line: 27, column: 8, scope: !1468)
!1476 = !DILocation(line: 28, column: 8, scope: !1468)
!1477 = !DILocation(line: 29, column: 8, scope: !1468)
!1478 = !DILocation(line: 30, column: 8, scope: !1468)
!1479 = !DILocation(line: 31, column: 8, scope: !1468)
!1480 = !DILocation(line: 32, column: 8, scope: !1468)
!1481 = !DILocation(line: 33, column: 8, scope: !1468)
!1482 = !DILocation(line: 34, column: 8, scope: !1468)
!1483 = !DILocation(line: 35, column: 8, scope: !1468)
!1484 = !DILocation(line: 36, column: 8, scope: !1468)
!1485 = !DILocation(line: 39, column: 8, scope: !1468)
!1486 = !DILocation(line: 40, column: 8, scope: !1468)
!1487 = !DILocation(line: 41, column: 8, scope: !1468)
!1488 = !DILocation(line: 42, column: 8, scope: !1468)
!1489 = !DILocation(line: 43, column: 8, scope: !1468)
!1490 = !DILocation(line: 44, column: 8, scope: !1468)
!1491 = !DILocation(line: 45, column: 8, scope: !1468)
!1492 = !DILocation(line: 46, column: 8, scope: !1468)
!1493 = !DILocation(line: 47, column: 8, scope: !1468)
!1494 = !DILocation(line: 48, column: 8, scope: !1468)
!1495 = !DILocation(line: 51, column: 8, scope: !1468)
!1496 = !DILocation(line: 63, column: 8, scope: !1468)
!1497 = distinct !DISubprogram(name: "lib::create_stake.3", linkageName: "lib::create_stake.3", scope: null, file: !1466, line: 66, type: !5, scopeLine: 66, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1498 = !DILocation(line: 66, column: 8, scope: !1499)
!1499 = !DILexicalBlockFile(scope: !1497, file: !1466, discriminator: 0)
!1500 = !DILocation(line: 71, column: 8, scope: !1499)
!1501 = distinct !DISubprogram(name: "lib::crank_distribution.1", linkageName: "lib::crank_distribution.1", scope: null, file: !1466, line: 74, type: !5, scopeLine: 74, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1502 = !DILocation(line: 74, column: 8, scope: !1503)
!1503 = !DILexicalBlockFile(scope: !1501, file: !1466, discriminator: 0)
!1504 = !DILocation(line: 75, column: 8, scope: !1503)
!1505 = distinct !DISubprogram(name: "lib::unstake.1", linkageName: "lib::unstake.1", scope: null, file: !1466, line: 78, type: !5, scopeLine: 78, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1506 = !DILocation(line: 78, column: 8, scope: !1507)
!1507 = !DILexicalBlockFile(scope: !1505, file: !1466, discriminator: 0)
!1508 = !DILocation(line: 79, column: 8, scope: !1507)
!1509 = distinct !DISubprogram(name: "lib::claim_rewards.1", linkageName: "lib::claim_rewards.1", scope: null, file: !1466, line: 82, type: !5, scopeLine: 82, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1510 = !DILocation(line: 82, column: 8, scope: !1511)
!1511 = !DILexicalBlockFile(scope: !1509, file: !1466, discriminator: 0)
!1512 = !DILocation(line: 83, column: 8, scope: !1511)
!1513 = distinct !DISubprogram(name: "lib::admin_mint.2", linkageName: "lib::admin_mint.2", scope: null, file: !1466, line: 86, type: !5, scopeLine: 86, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1514 = !DILocation(line: 86, column: 8, scope: !1515)
!1515 = !DILexicalBlockFile(scope: !1513, file: !1466, discriminator: 0)
!1516 = !DILocation(line: 87, column: 8, scope: !1515)
!1517 = distinct !DISubprogram(name: "lib::initialize_claim_period.5", linkageName: "lib::initialize_claim_period.5", scope: null, file: !1466, line: 90, type: !5, scopeLine: 90, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1518 = !DILocation(line: 90, column: 8, scope: !1519)
!1519 = !DILexicalBlockFile(scope: !1517, file: !1466, discriminator: 0)
!1520 = !DILocation(line: 97, column: 8, scope: !1519)
!1521 = distinct !DISubprogram(name: "lib::withdraw_vested.1", linkageName: "lib::withdraw_vested.1", scope: null, file: !1466, line: 106, type: !5, scopeLine: 106, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1522 = !DILocation(line: 106, column: 8, scope: !1523)
!1523 = !DILexicalBlockFile(scope: !1521, file: !1466, discriminator: 0)
!1524 = !DILocation(line: 107, column: 8, scope: !1523)
!1525 = distinct !DISubprogram(name: "lib::trigger_big_pay_day.1", linkageName: "lib::trigger_big_pay_day.1", scope: null, file: !1466, line: 110, type: !5, scopeLine: 110, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1526 = !DILocation(line: 110, column: 8, scope: !1527)
!1527 = !DILexicalBlockFile(scope: !1525, file: !1466, discriminator: 0)
!1528 = !DILocation(line: 113, column: 8, scope: !1527)
!1529 = distinct !DISubprogram(name: "lib::finalize_bpd_calculation.1", linkageName: "lib::finalize_bpd_calculation.1", scope: null, file: !1466, line: 116, type: !5, scopeLine: 116, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1530 = !DILocation(line: 116, column: 8, scope: !1531)
!1531 = !DILexicalBlockFile(scope: !1529, file: !1466, discriminator: 0)
!1532 = !DILocation(line: 119, column: 8, scope: !1531)
!1533 = distinct !DISubprogram(name: "lib::free_claim.3", linkageName: "lib::free_claim.3", scope: null, file: !1466, line: 122, type: !5, scopeLine: 122, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1534 = !DILocation(line: 122, column: 8, scope: !1535)
!1535 = !DILexicalBlockFile(scope: !1533, file: !1466, discriminator: 0)
!1536 = !DILocation(line: 127, column: 8, scope: !1535)
!1537 = distinct !DISubprogram(name: "lib::seal_bpd_finalize.2", linkageName: "lib::seal_bpd_finalize.2", scope: null, file: !1466, line: 130, type: !5, scopeLine: 130, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1538 = !DILocation(line: 130, column: 8, scope: !1539)
!1539 = !DILexicalBlockFile(scope: !1537, file: !1466, discriminator: 0)
!1540 = !DILocation(line: 131, column: 8, scope: !1539)
!1541 = distinct !DISubprogram(name: "lib::migrate_stake.1", linkageName: "lib::migrate_stake.1", scope: null, file: !1466, line: 134, type: !5, scopeLine: 134, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1542 = !DILocation(line: 134, column: 8, scope: !1543)
!1543 = !DILexicalBlockFile(scope: !1541, file: !1466, discriminator: 0)
!1544 = !DILocation(line: 135, column: 8, scope: !1543)
!1545 = distinct !DISubprogram(name: "lib::abort_bpd.1", linkageName: "lib::abort_bpd.1", scope: null, file: !1466, line: 138, type: !5, scopeLine: 138, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1546 = !DILocation(line: 138, column: 8, scope: !1547)
!1547 = !DILexicalBlockFile(scope: !1545, file: !1466, discriminator: 0)
!1548 = !DILocation(line: 139, column: 8, scope: !1547)
!1549 = distinct !DISubprogram(name: "lib::admin_set_claim_end_slot.2", linkageName: "lib::admin_set_claim_end_slot.2", scope: null, file: !1466, line: 142, type: !5, scopeLine: 142, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1550 = !DILocation(line: 142, column: 8, scope: !1551)
!1551 = !DILexicalBlockFile(scope: !1549, file: !1466, discriminator: 0)
!1552 = !DILocation(line: 146, column: 8, scope: !1551)
!1553 = distinct !DISubprogram(name: "lib::admin_set_slots_per_day.2", linkageName: "lib::admin_set_slots_per_day.2", scope: null, file: !1466, line: 149, type: !5, scopeLine: 149, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1554 = !DILocation(line: 149, column: 8, scope: !1555)
!1555 = !DILexicalBlockFile(scope: !1553, file: !1466, discriminator: 0)
!1556 = !DILocation(line: 153, column: 8, scope: !1555)
!1557 = distinct !DISubprogram(name: "lib::transfer_authority.2", linkageName: "lib::transfer_authority.2", scope: null, file: !1466, line: 156, type: !5, scopeLine: 156, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1558 = !DILocation(line: 156, column: 8, scope: !1559)
!1559 = !DILexicalBlockFile(scope: !1557, file: !1466, discriminator: 0)
!1560 = !DILocation(line: 157, column: 8, scope: !1559)
!1561 = distinct !DISubprogram(name: "lib::accept_authority.1", linkageName: "lib::accept_authority.1", scope: null, file: !1466, line: 160, type: !5, scopeLine: 160, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1562 = !DILocation(line: 160, column: 8, scope: !1563)
!1563 = !DILexicalBlockFile(scope: !1561, file: !1466, discriminator: 0)
!1564 = !DILocation(line: 161, column: 8, scope: !1563)
!1565 = distinct !DISubprogram(name: "sol.model.anchor.program.helix_staking", linkageName: "sol.model.anchor.program.helix_staking", scope: null, file: !1466, line: 17, type: !5, scopeLine: 17, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1566 = !DILocation(line: 17, scope: !1567)
!1567 = !DILexicalBlockFile(scope: !1565, file: !1466, discriminator: 0)
!1568 = !DILocation(line: 21, column: 4, scope: !1567)
!1569 = !DILocation(line: 66, column: 4, scope: !1567)
!1570 = !DILocation(line: 74, column: 4, scope: !1567)
!1571 = !DILocation(line: 78, column: 4, scope: !1567)
!1572 = !DILocation(line: 82, column: 4, scope: !1567)
!1573 = !DILocation(line: 86, column: 4, scope: !1567)
!1574 = !DILocation(line: 90, column: 4, scope: !1567)
!1575 = !DILocation(line: 106, column: 4, scope: !1567)
!1576 = !DILocation(line: 110, column: 4, scope: !1567)
!1577 = !DILocation(line: 116, column: 4, scope: !1567)
!1578 = !DILocation(line: 122, column: 4, scope: !1567)
!1579 = !DILocation(line: 130, column: 4, scope: !1567)
!1580 = !DILocation(line: 134, column: 4, scope: !1567)
!1581 = !DILocation(line: 138, column: 4, scope: !1567)
!1582 = !DILocation(line: 142, column: 4, scope: !1567)
!1583 = !DILocation(line: 149, column: 4, scope: !1567)
!1584 = !DILocation(line: 156, column: 4, scope: !1567)
!1585 = !DILocation(line: 160, column: 4, scope: !1567)
!1586 = distinct !DISubprogram(name: "main", linkageName: "main", scope: null, file: !1466, line: 17, type: !5, scopeLine: 17, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1587 = !DILocation(line: 17, scope: !1588)
!1588 = !DILexicalBlockFile(scope: !1586, file: !1466, discriminator: 0)
!1589 = distinct !DISubprogram(name: "sol.model.struct.InitializeParams", linkageName: "sol.model.struct.InitializeParams", scope: null, file: !1466, line: 166, type: !5, scopeLine: 166, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1590 = !DILocation(line: 166, column: 4, scope: !1591)
!1591 = !DILexicalBlockFile(scope: !1589, file: !1466, discriminator: 0)
!1592 = !DILocation(line: 167, column: 8, scope: !1591)
!1593 = !DILocation(line: 168, column: 8, scope: !1591)
!1594 = !DILocation(line: 169, column: 8, scope: !1591)
!1595 = !DILocation(line: 170, column: 8, scope: !1591)
!1596 = !DILocation(line: 171, column: 8, scope: !1591)
!1597 = !DILocation(line: 172, column: 8, scope: !1591)
!1598 = distinct !DISubprogram(name: "sol.model.struct.anchor.Initialize", linkageName: "sol.model.struct.anchor.Initialize", scope: null, file: !1466, line: 176, type: !5, scopeLine: 176, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1599 = !DILocation(line: 176, column: 4, scope: !1600)
!1600 = !DILexicalBlockFile(scope: !1598, file: !1466, discriminator: 0)
!1601 = !DILocation(line: 177, column: 6, scope: !1600)
!1602 = !DILocation(line: 178, column: 8, scope: !1600)
!1603 = !DILocation(line: 180, column: 6, scope: !1600)
!1604 = !DILocation(line: 187, column: 8, scope: !1600)
!1605 = !DILocation(line: 190, column: 6, scope: !1600)
!1606 = !DILocation(line: 194, column: 8, scope: !1600)
!1607 = !DILocation(line: 196, column: 6, scope: !1600)
!1608 = !DILocation(line: 205, column: 8, scope: !1600)
!1609 = !DILocation(line: 207, column: 8, scope: !1600)
!1610 = !DILocation(line: 208, column: 8, scope: !1600)
!1611 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimConfig", linkageName: "sol.model.struct.anchor.ClaimConfig", scope: null, file: !1612, line: 6, type: !5, scopeLine: 6, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1612 = !DIFile(filename: "programs/helix-staking/src/state/claim_config.rs", directory: "/workspace")
!1613 = !DILocation(line: 6, column: 4, scope: !1614)
!1614 = !DILexicalBlockFile(scope: !1611, file: !1612, discriminator: 0)
!1615 = !DILocation(line: 8, column: 8, scope: !1614)
!1616 = !DILocation(line: 10, column: 8, scope: !1614)
!1617 = !DILocation(line: 12, column: 8, scope: !1614)
!1618 = !DILocation(line: 14, column: 8, scope: !1614)
!1619 = !DILocation(line: 16, column: 8, scope: !1614)
!1620 = !DILocation(line: 18, column: 8, scope: !1614)
!1621 = !DILocation(line: 20, column: 8, scope: !1614)
!1622 = !DILocation(line: 22, column: 8, scope: !1614)
!1623 = !DILocation(line: 24, column: 8, scope: !1614)
!1624 = !DILocation(line: 26, column: 8, scope: !1614)
!1625 = !DILocation(line: 28, column: 8, scope: !1614)
!1626 = !DILocation(line: 30, column: 8, scope: !1614)
!1627 = !DILocation(line: 32, column: 8, scope: !1614)
!1628 = !DILocation(line: 37, column: 8, scope: !1614)
!1629 = !DILocation(line: 40, column: 8, scope: !1614)
!1630 = !DILocation(line: 42, column: 8, scope: !1614)
!1631 = !DILocation(line: 44, column: 8, scope: !1614)
!1632 = !DILocation(line: 46, column: 8, scope: !1614)
!1633 = !DILocation(line: 48, column: 8, scope: !1614)
!1634 = !DILocation(line: 50, column: 8, scope: !1614)
!1635 = distinct !DISubprogram(name: "sol.model.struct.anchor.StakeAccount", linkageName: "sol.model.struct.anchor.StakeAccount", scope: null, file: !1636, line: 4, type: !5, scopeLine: 4, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1636 = !DIFile(filename: "programs/helix-staking/src/state/stake_account.rs", directory: "/workspace")
!1637 = !DILocation(line: 4, column: 4, scope: !1638)
!1638 = !DILexicalBlockFile(scope: !1635, file: !1636, discriminator: 0)
!1639 = !DILocation(line: 6, column: 8, scope: !1638)
!1640 = !DILocation(line: 8, column: 8, scope: !1638)
!1641 = !DILocation(line: 10, column: 8, scope: !1638)
!1642 = !DILocation(line: 12, column: 8, scope: !1638)
!1643 = !DILocation(line: 14, column: 8, scope: !1638)
!1644 = !DILocation(line: 16, column: 8, scope: !1638)
!1645 = !DILocation(line: 18, column: 8, scope: !1638)
!1646 = !DILocation(line: 20, column: 8, scope: !1638)
!1647 = !DILocation(line: 22, column: 8, scope: !1638)
!1648 = !DILocation(line: 24, column: 8, scope: !1638)
!1649 = !DILocation(line: 26, column: 8, scope: !1638)
!1650 = !DILocation(line: 28, column: 8, scope: !1638)
!1651 = !DILocation(line: 30, column: 8, scope: !1638)
!1652 = !DILocation(line: 32, column: 8, scope: !1638)
!1653 = !DILocation(line: 34, column: 8, scope: !1638)
!1654 = distinct !DISubprogram(name: "sol.model.struct.anchor.PendingAuthority", linkageName: "sol.model.struct.anchor.PendingAuthority", scope: null, file: !1655, line: 4, type: !5, scopeLine: 4, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1655 = !DIFile(filename: "programs/helix-staking/src/state/pending_authority.rs", directory: "/workspace")
!1656 = !DILocation(line: 4, column: 4, scope: !1657)
!1657 = !DILexicalBlockFile(scope: !1654, file: !1655, discriminator: 0)
!1658 = !DILocation(line: 6, column: 8, scope: !1657)
!1659 = !DILocation(line: 8, column: 8, scope: !1657)
!1660 = distinct !DISubprogram(name: "sol.model.struct.anchor.GlobalState", linkageName: "sol.model.struct.anchor.GlobalState", scope: null, file: !1661, line: 4, type: !5, scopeLine: 4, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1661 = !DIFile(filename: "programs/helix-staking/src/state/global_state.rs", directory: "/workspace")
!1662 = !DILocation(line: 4, column: 4, scope: !1663)
!1663 = !DILexicalBlockFile(scope: !1660, file: !1661, discriminator: 0)
!1664 = !DILocation(line: 6, column: 8, scope: !1663)
!1665 = !DILocation(line: 8, column: 8, scope: !1663)
!1666 = !DILocation(line: 10, column: 8, scope: !1663)
!1667 = !DILocation(line: 12, column: 8, scope: !1663)
!1668 = !DILocation(line: 16, column: 8, scope: !1663)
!1669 = !DILocation(line: 18, column: 8, scope: !1663)
!1670 = !DILocation(line: 20, column: 8, scope: !1663)
!1671 = !DILocation(line: 22, column: 8, scope: !1663)
!1672 = !DILocation(line: 26, column: 8, scope: !1663)
!1673 = !DILocation(line: 28, column: 8, scope: !1663)
!1674 = !DILocation(line: 30, column: 8, scope: !1663)
!1675 = !DILocation(line: 34, column: 8, scope: !1663)
!1676 = !DILocation(line: 36, column: 8, scope: !1663)
!1677 = !DILocation(line: 38, column: 8, scope: !1663)
!1678 = !DILocation(line: 42, column: 8, scope: !1663)
!1679 = !DILocation(line: 44, column: 8, scope: !1663)
!1680 = !DILocation(line: 46, column: 8, scope: !1663)
!1681 = !DILocation(line: 48, column: 8, scope: !1663)
!1682 = !DILocation(line: 52, column: 8, scope: !1663)
!1683 = !DILocation(line: 54, column: 8, scope: !1663)
!1684 = !DILocation(line: 57, column: 8, scope: !1663)
!1685 = distinct !DISubprogram(name: "global_state::GlobalState::is_bpd_window_active.1", linkageName: "global_state::GlobalState::is_bpd_window_active.1", scope: null, file: !1661, line: 62, type: !5, scopeLine: 62, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1686 = !DILocation(line: 62, column: 8, scope: !1687)
!1687 = !DILexicalBlockFile(scope: !1685, file: !1661, discriminator: 0)
!1688 = !DILocation(line: 63, column: 8, scope: !1687)
!1689 = distinct !DISubprogram(name: "global_state::GlobalState::set_bpd_window_active.anon.1", linkageName: "global_state::GlobalState::set_bpd_window_active.anon.1", scope: null, file: !1661, line: 68, type: !5, scopeLine: 68, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1690 = !DILocation(line: 68, column: 37, scope: !1691)
!1691 = !DILexicalBlockFile(scope: !1689, file: !1661, discriminator: 0)
!1692 = distinct !DISubprogram(name: "global_state::GlobalState::set_bpd_window_active.anon.2", linkageName: "global_state::GlobalState::set_bpd_window_active.anon.2", scope: null, file: !1661, line: 68, type: !5, scopeLine: 68, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1693 = !DILocation(line: 68, column: 48, scope: !1694)
!1694 = !DILexicalBlockFile(scope: !1692, file: !1661, discriminator: 0)
!1695 = distinct !DISubprogram(name: "global_state::GlobalState::set_bpd_window_active.2", linkageName: "global_state::GlobalState::set_bpd_window_active.2", scope: null, file: !1661, line: 67, type: !5, scopeLine: 67, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1696 = !DILocation(line: 67, column: 8, scope: !1697)
!1697 = !DILexicalBlockFile(scope: !1695, file: !1661, discriminator: 0)
!1698 = !DILocation(line: 68, column: 27, scope: !1697)
!1699 = !DILocation(line: 68, column: 37, scope: !1697)
!1700 = !DILocation(line: 68, column: 48, scope: !1697)
!1701 = !DILocation(line: 68, column: 8, scope: !1697)
!1702 = distinct !DISubprogram(name: "sol.model.struct.anchor.ClaimStatus", linkageName: "sol.model.struct.anchor.ClaimStatus", scope: null, file: !1703, line: 7, type: !5, scopeLine: 7, spFlags: DISPFlagDefinition | DISPFlagOptimized, unit: !0, retainedNodes: !6)
!1703 = !DIFile(filename: "programs/helix-staking/src/state/claim_status.rs", directory: "/workspace")
!1704 = !DILocation(line: 7, column: 4, scope: !1705)
!1705 = !DILexicalBlockFile(scope: !1702, file: !1703, discriminator: 0)
!1706 = !DILocation(line: 9, column: 8, scope: !1705)
!1707 = !DILocation(line: 11, column: 8, scope: !1705)
!1708 = !DILocation(line: 13, column: 8, scope: !1705)
!1709 = !DILocation(line: 15, column: 8, scope: !1705)
!1710 = !DILocation(line: 17, column: 8, scope: !1705)
!1711 = !DILocation(line: 19, column: 8, scope: !1705)
!1712 = !DILocation(line: 21, column: 8, scope: !1705)
!1713 = !DILocation(line: 23, column: 8, scope: !1705)
