use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod helix_staking {
    use super::*;

    pub fn initialize(ctx: Context<instructions::Initialize>, params: instructions::InitializeParams) -> Result<()> {
        instructions::initialize::handler(ctx, params)
    }
}
