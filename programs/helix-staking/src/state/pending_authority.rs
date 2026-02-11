use anchor_lang::prelude::*;

#[account]
pub struct PendingAuthority {
    /// The proposed new authority pubkey
    pub new_authority: Pubkey,
    /// Bump seed for this PDA
    pub bump: u8,
}

impl PendingAuthority {
    pub const LEN: usize = 8  // discriminator
        + 32  // new_authority
        + 1; // bump
}
