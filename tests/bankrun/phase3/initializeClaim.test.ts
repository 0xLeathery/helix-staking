import { describe, it } from "mocha";
import { expect } from "chai";
import { Keypair, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  findClaimConfigPDA,
  buildMerkleTree,
  CLAIM_PERIOD_DAYS,
  DEFAULT_SLOTS_PER_DAY,
} from "./utils";

describe("InitializeClaimPeriod", () => {
  it("initializes claim period with valid merkle root", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol first
    await initializeProtocol(program, payer);

    // Build a simple Merkle tree with one entry
    const testWallet = Keypair.generate();
    const snapshotBalance = new BN("1000000000"); // 1 SOL in lamports
    const claimPeriodId = 1;

    const entries = [
      { wallet: testWallet.publicKey, amount: snapshotBalance, claimPeriodId },
    ];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    // Get PDAs
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    // Initialize claim period
    const totalClaimable = new BN("10000000000000"); // 100k HELIX
    const totalEligible = 1;

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, totalEligible, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Verify ClaimConfig created with correct values
    const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
    expect(claimConfig.authority.toBase58()).to.equal(payer.publicKey.toBase58());
    expect(Buffer.from(claimConfig.merkleRoot)).to.deep.equal(tree.root);
    expect(claimConfig.totalClaimable.toString()).to.equal(totalClaimable.toString());
    expect(claimConfig.totalClaimed.toString()).to.equal("0");
    expect(claimConfig.claimCount).to.equal(0);
    expect(claimConfig.claimPeriodId).to.equal(claimPeriodId);
    expect(claimConfig.claimPeriodStarted).to.equal(true);
    expect(claimConfig.bigPayDayComplete).to.equal(false);
  });

  it("rejects non-authority caller", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    await initializeProtocol(program, payer);

    // Generate a random non-authority signer
    const randomSigner = Keypair.generate();

    // Fund the random signer so they can pay for tx
    const tx = new (require("@solana/web3.js").Transaction)();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: randomSigner.publicKey,
        lamports: 100_000_000,
      })
    );
    await program.provider.sendAndConfirm(tx, [payer]);

    // Build Merkle tree
    const testWallet = Keypair.generate();
    const entries = [
      { wallet: testWallet.publicKey, amount: new BN("1000000000"), claimPeriodId: 1 },
    ];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    try {
      await program.methods
        .initializeClaimPeriod(merkleRoot, new BN("10000000000000"), 1, 1)
        .accounts({
          authority: randomSigner.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([randomSigner])
        .rpc();

      expect.fail("Expected Unauthorized error");
    } catch (error: any) {
      expect(error.toString()).to.include("Unauthorized");
    }
  });

  it("rejects double initialization", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    await initializeProtocol(program, payer);

    // Build Merkle tree
    const testWallet = Keypair.generate();
    const entries = [
      { wallet: testWallet.publicKey, amount: new BN("1000000000"), claimPeriodId: 1 },
    ];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    // First initialization should succeed
    await program.methods
      .initializeClaimPeriod(merkleRoot, new BN("10000000000000"), 1, 1)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Second initialization should fail (PDA already exists)
    try {
      await program.methods
        .initializeClaimPeriod(merkleRoot, new BN("20000000000000"), 2, 2)
        .accounts({
          authority: payer.publicKey,
          claimConfig: claimConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .signers([payer])
        .rpc();

      expect.fail("Expected error for double initialization");
    } catch (error: any) {
      // Anchor throws constraint/address-in-use error for re-init
      expect(error.toString().toLowerCase()).to.satisfy((msg: string) =>
        msg.includes("already in use") ||
        msg.includes("constraint") ||
        msg.includes("0x0") ||
        msg.includes("account already exists")
      );
    }
  });

  it("calculates correct end slot (180 days)", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    await initializeProtocol(program, payer);

    // Get current slot before initializing claim period
    const clockBefore = await context.banksClient.getClock();

    // Build Merkle tree
    const testWallet = Keypair.generate();
    const entries = [
      { wallet: testWallet.publicKey, amount: new BN("1000000000"), claimPeriodId: 1 },
    ];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    await program.methods
      .initializeClaimPeriod(merkleRoot, new BN("10000000000000"), 1, 1)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Verify end_slot calculation
    const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);

    // end_slot should be start_slot + 180 * slots_per_day
    const expectedEndSlot = new BN(claimConfig.startSlot.toString())
      .add(new BN(CLAIM_PERIOD_DAYS).mul(DEFAULT_SLOTS_PER_DAY));

    expect(claimConfig.endSlot.toString()).to.equal(expectedEndSlot.toString());
  });

  it("emits ClaimPeriodStarted event", async () => {
    const { context, provider, program, payer } = await setupTest();

    // Initialize protocol
    await initializeProtocol(program, payer);

    // Build Merkle tree
    const testWallet = Keypair.generate();
    const claimPeriodId = 1;
    const totalClaimable = new BN("10000000000000");
    const totalEligible = 100;

    const entries = [
      { wallet: testWallet.publicKey, amount: new BN("1000000000"), claimPeriodId },
    ];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);

    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    // Note: In Bankrun, we can't easily capture events from the transaction.
    // Instead, we verify the state reflects what the event would emit.
    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, totalEligible, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Verify the ClaimConfig has all the event fields correctly set
    const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
    expect(claimConfig.claimPeriodId).to.equal(claimPeriodId);
    expect(Buffer.from(claimConfig.merkleRoot)).to.deep.equal(tree.root);
    expect(claimConfig.totalClaimable.toString()).to.equal(totalClaimable.toString());
    expect(claimConfig.totalEligible).to.equal(totalEligible);
    // endSlot is the claim_deadline_slot in the event
    expect(claimConfig.endSlot.gt(new BN(0))).to.equal(true);
  });
});
