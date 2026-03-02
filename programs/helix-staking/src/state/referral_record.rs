use anchor_lang::prelude::*;

#[account]
pub struct ReferralRecord {
    pub referrer: Pubkey,
    pub referee: Pubkey,
    pub slot: u64,
    pub bump: u8,
}

impl ReferralRecord {
    // 8 (discriminator) + 32 (referrer) + 32 (referee) + 8 (slot) + 1 (bump) = 81
    pub const LEN: usize = 8 + 32 + 32 + 8 + 1;
}
