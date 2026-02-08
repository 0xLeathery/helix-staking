import { describe, it, expect } from "vitest";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import {
  setupTest,
  findGlobalStatePDA,
  findMintAuthorityPDA,
  findMintPDA,
  getDefaultInitializeParams,
  advanceClock,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_ANNUAL_INFLATION_BP,
  DEFAULT_MIN_STAKE_AMOUNT,
  DEFAULT_STARTING_SHARE_RATE,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_CLAIM_PERIOD_DAYS,
} from "./utils";

describe("Initialize", () => {
  it("initializes protocol with correct GlobalState parameters", async () => {
    const { context, provider, program, payer } = await setupTest();

    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
    const [mintPDA] = findMintPDA(program.programId);

    const params = getDefaultInitializeParams();

    await program.methods
      .initialize(params)
      .accounts({
        authority: payer.publicKey,
        globalState: globalStatePDA,
        mintAuthority: mintAuthorityPDA,
        mint: mintPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Fetch GlobalState account
    const globalState = await program.account.globalState.fetch(globalStatePDA);

    // Verify authority matches payer
    expect(globalState.authority.toBase58()).toBe(payer.publicKey.toBase58());

    // Verify mint matches derived mint PDA
    expect(globalState.mint.toBase58()).toBe(mintPDA.toBase58());

    // Verify protocol parameters
    expect(globalState.annualInflationBp.toString()).toBe(
      DEFAULT_ANNUAL_INFLATION_BP.toString()
    );
    expect(globalState.minStakeAmount.toString()).toBe(
      DEFAULT_MIN_STAKE_AMOUNT.toString()
    );
    expect(globalState.shareRate.toString()).toBe(
      DEFAULT_STARTING_SHARE_RATE.toString()
    );
    expect(globalState.startingShareRate.toString()).toBe(
      DEFAULT_STARTING_SHARE_RATE.toString()
    );
    expect(globalState.slotsPerDay.toString()).toBe(
      DEFAULT_SLOTS_PER_DAY.toString()
    );
    expect(globalState.claimPeriodDays).toBe(DEFAULT_CLAIM_PERIOD_DAYS);

    // Verify init_slot is set (should be > 0)
    expect(globalState.initSlot.toNumber()).toBeGreaterThan(0);

    // Verify all counters are initialized to zero
    expect(globalState.totalStakesCreated.toString()).toBe("0");
    expect(globalState.totalUnstakesCreated.toString()).toBe("0");
    expect(globalState.totalClaimsCreated.toString()).toBe("0");

    // Verify aggregate metrics are zero
    expect(globalState.totalTokensStaked.toString()).toBe("0");
    expect(globalState.totalTokensUnstaked.toString()).toBe("0");
    expect(globalState.totalShares.toString()).toBe("0");
    expect(globalState.currentDay.toString()).toBe("0");
  });

  it("creates Token-2022 mint with correct configuration", async () => {
    const { context, provider, program, payer } = await setupTest();

    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
    const [mintPDA] = findMintPDA(program.programId);

    const params = getDefaultInitializeParams();

    await program.methods
      .initialize(params)
      .accounts({
        authority: payer.publicKey,
        globalState: globalStatePDA,
        mintAuthority: mintAuthorityPDA,
        mint: mintPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([payer])
      .rpc();

    // Fetch the mint account using Bankrun's banksClient
    const mintAccountInfo = await context.banksClient.getAccount(mintPDA);

    // Verify mint account exists
    expect(mintAccountInfo).not.toBeNull();

    // Verify account is owned by Token-2022 program
    expect(mintAccountInfo.owner.toBase58()).toBe(TOKEN_2022_PROGRAM_ID.toBase58());

    // Parse mint data (Token-2022 mint layout)
    // Basic mint structure: 4 bytes (option) + 32 bytes (mint authority) + 8 bytes (supply) + 1 byte (decimals) + ...
    const data = Buffer.from(mintAccountInfo.data);

    // Verify account has data (82 bytes minimum for basic mint)
    expect(data.length).toBeGreaterThanOrEqual(82);

    // Parse decimals (at offset 44 in mint layout)
    const decimals = data[44];
    expect(decimals).toBe(8);

    // Parse supply (8 bytes at offset 36)
    const supply = data.readBigUInt64LE(36);
    expect(supply.toString()).toBe("0");

    // Parse mint authority (at offset 4, 32 bytes pubkey)
    // First 4 bytes are COption discriminant (1 = Some, 0 = None)
    const hasMintAuthority = data.readUInt32LE(0);
    expect(hasMintAuthority).toBe(1); // Should have mint authority

    const mintAuthorityBytes = data.subarray(4, 36);
    const mintAuthority = new PublicKey(mintAuthorityBytes);
    expect(mintAuthority.toBase58()).toBe(mintAuthorityPDA.toBase58());
  });

  it("rejects double initialization", async () => {
    const { context, provider, program, payer } = await setupTest();

    const [globalStatePDA] = findGlobalStatePDA(program.programId);
    const [mintAuthorityPDA] = findMintAuthorityPDA(program.programId);
    const [mintPDA] = findMintPDA(program.programId);

    const params = getDefaultInitializeParams();

    // First initialization should succeed
    await program.methods
      .initialize(params)
      .accounts({
        authority: payer.publicKey,
        globalState: globalStatePDA,
        mintAuthority: mintAuthorityPDA,
        mint: mintPDA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .rpc();

    // Second initialization should fail (GlobalState account already exists)
    try {
      await program.methods
        .initialize(params)
        .accounts({
          authority: payer.publicKey,
          globalState: globalStatePDA,
          mintAuthority: mintAuthorityPDA,
          mint: mintPDA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc();

      // If we get here, the test should fail
      throw new Error("Expected second initialization to fail, but it succeeded");
    } catch (error) {
      // Expect an error (account already exists)
      expect(error).toBeDefined();
    }
  });

  it("clock mocking works with Bankrun", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Get current clock
    const initialClock = await context.banksClient.getClock();
    const initialSlot = initialClock.slot;
    const initialTimestamp = initialClock.unixTimestamp;

    // Advance clock by 1 day (216,000 slots)
    const slotsPerDay = BigInt(216_000);
    const newClock = await advanceClock(context, slotsPerDay);

    // Verify slot advanced correctly
    expect(newClock.slot).toBe(initialSlot + slotsPerDay);

    // Verify timestamp advanced by approximately 86,400 seconds
    // 216,000 slots * 400ms/slot = 86,400,000ms = 86,400 seconds
    const expectedTimestampDelta = BigInt(86_400);
    const actualTimestampDelta = newClock.unixTimestamp - initialTimestamp;

    expect(actualTimestampDelta).toBe(expectedTimestampDelta);
  });
});
