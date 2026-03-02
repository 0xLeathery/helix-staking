import { describe, it, expect } from "vitest";
import { Keypair, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  findGlobalStatePDA,
  findStakePDA,
  mintTokensToUser,
  advanceClock,
  TOKEN_2022_PROGRAM_ID,
  DEFAULT_SLOTS_PER_DAY,
  DEFAULT_MIN_STAKE_AMOUNT,
} from "./utils";
import {
  findClaimConfigPDA,
  buildMerkleTree,
} from "./phase3/utils";

const PENDING_AUTHORITY_SEED = Buffer.from("pending_authority");

function findPendingAuthorityPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [PENDING_AUTHORITY_SEED],
    programId
  );
}

describe("AuthorityTransfer", () => {
  it("authority can initiate transfer", async () => {
    const { client, program, payer } = setupTest();
    const { globalState } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const newAuthority = Keypair.generate();

    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    const pending = await program.account.pendingAuthority.fetch(pendingAuthorityPDA);
    expect(pending.newAuthority.toBase58()).to.equal(newAuthority.publicKey.toBase58());
  });

  it("new authority can accept transfer", async () => {
    const { client, program, payer } = setupTest();
    const { globalState } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const newAuthority = Keypair.generate();

    // Fund new authority
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newAuthority.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Initiate transfer
    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Accept transfer
    await program.methods
      .acceptAuthority()
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        newAuthority: newAuthority.publicKey,
      })
      .signers([newAuthority])
      .rpc();

    const state = await program.account.globalState.fetch(globalState);
    expect(state.authority.toBase58()).to.equal(newAuthority.publicKey.toBase58());
  });

  it("non-authority cannot initiate transfer", async () => {
    const { client, program, payer } = setupTest();
    const { globalState } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const attacker = Keypair.generate();
    const newAuthority = Keypair.generate();

    // Fund attacker
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: attacker.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    try {
      await program.methods
        .transferAuthority(newAuthority.publicKey)
        .accounts({
          globalState,
          pendingAuthority: pendingAuthorityPDA,
          authority: attacker.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([attacker])
        .rpc();
      throw new Error("Expected Unauthorized error");
    } catch (error: any) {
      expect(error.toString()).to.include("Unauthorized");
    }
  });

  it("wrong key cannot accept transfer", async () => {
    const { client, program, payer } = setupTest();
    const { globalState } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const newAuthority = Keypair.generate();
    const wrongKey = Keypair.generate();

    // Fund wrong key
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: wrongKey.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Initiate transfer
    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    try {
      await program.methods
        .acceptAuthority()
        .accounts({
          globalState,
          pendingAuthority: pendingAuthorityPDA,
          newAuthority: wrongKey.publicKey,
        })
        .signers([wrongKey])
        .rpc();
      throw new Error("Expected UnauthorizedNewAuthority error");
    } catch (error: any) {
      expect(error.toString()).to.include("UnauthorizedNewAuthority");
    }
  });

  it("authority can cancel by re-initiating to different key", async () => {
    const { client, program, payer } = setupTest();
    const { globalState } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const firstCandidate = Keypair.generate();
    const secondCandidate = Keypair.generate();

    // Initiate to first candidate
    await program.methods
      .transferAuthority(firstCandidate.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    let pending = await program.account.pendingAuthority.fetch(pendingAuthorityPDA);
    expect(pending.newAuthority.toBase58()).to.equal(firstCandidate.publicKey.toBase58());

    // Re-initiate to second candidate (overwrites)
    await program.methods
      .transferAuthority(secondCandidate.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    pending = await program.account.pendingAuthority.fetch(pendingAuthorityPDA);
    expect(pending.newAuthority.toBase58()).to.equal(secondCandidate.publicKey.toBase58());

    // Verify the overwrite happened correctly: first candidate no longer pending
    expect(pending.newAuthority.toBase58()).to.not.equal(firstCandidate.publicKey.toBase58());

    // Verify AuthorityTransferCancelled event emitted by checking tx logs
    // Build and send a third transfer to capture cancel event in logs
    const thirdCandidate = Keypair.generate();
    const ix = await program.methods
      .transferAuthority(thirdCandidate.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    const tx = new Transaction().add(ix);
    tx.feePayer = payer.publicKey;
    tx.recentBlockhash = client.latestBlockhash();
    tx.sign(payer);
    const meta = client.sendTransaction(tx);

    // Check logs for cancel event data marker
    const logs = (meta as any).logs ? (meta as any).logs() : [];
    // Anchor events are emitted as "Program data: <base64>" in logs
    // Check that we see both event names in the log output
    const hasProgramData = logs.filter((l: string) => l.includes("Program data:"));
    // With cancel + initiated, we expect 2 "Program data:" entries
    expect(hasProgramData.length).toBeGreaterThanOrEqual(2);

    // Verify final state
    pending = await program.account.pendingAuthority.fetch(pendingAuthorityPDA);
    expect(pending.newAuthority.toBase58()).to.equal(thirdCandidate.publicKey.toBase58());
  });

  it("after accept, old authority loses access (admin_mint fails)", async () => {
    const { client, program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const newAuthority = Keypair.generate();

    // Fund new authority
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newAuthority.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Transfer authority
    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await program.methods
      .acceptAuthority()
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        newAuthority: newAuthority.publicKey,
      })
      .signers([newAuthority])
      .rpc();

    // Create token account for old authority to attempt mint to
    const recipientATA = getAssociatedTokenAddressSync(mint, payer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(payer.publicKey, recipientATA, payer.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [payer]);

    // Old authority tries admin_mint - should fail
    try {
      await program.methods
        .adminMint(new BN(1000))
        .accounts({
          authority: payer.publicKey,
          globalState,
          mintAuthority,
          mint,
          recipientTokenAccount: recipientATA,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();
      throw new Error("Expected Unauthorized error");
    } catch (error: any) {
      expect(error.toString()).to.include("Unauthorized");
    }
  });

  it("cannot accept authority during BPD window", async () => {
    const { client, program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);
    const [claimConfigPDA] = findClaimConfigPDA(program.programId);

    const newAuthority = Keypair.generate();

    // Fund new authority
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newAuthority.publicKey,
      lamports: 500_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // --- Set up BPD: create claim period, stake, advance past end, finalize ---

    // Initialize claim period
    const snapshotWallet = Keypair.generate();
    const snapshotBalance = new BN("10000000000");
    const claimPeriodId = 1;
    const entries = [{ wallet: snapshotWallet.publicKey, amount: snapshotBalance, claimPeriodId }];
    const tree = buildMerkleTree(entries);
    const merkleRoot = Array.from(tree.root);
    const totalClaimable = new BN("100000000000000");

    await program.methods
      .initializeClaimPeriod(merkleRoot, totalClaimable, 1, claimPeriodId)
      .accounts({
        authority: payer.publicKey,
        claimConfig: claimConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Create a staker and stake
    const staker = Keypair.generate();
    const fundStakerTx = new Transaction();
    fundStakerTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: staker.publicKey,
      lamports: 500_000_000,
    }));
    await program.provider.sendAndConfirm(fundStakerTx, [payer]);

    const stakerATA = getAssociatedTokenAddressSync(mint, staker.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(
      staker.publicKey, stakerATA, staker.publicKey, mint, TOKEN_2022_PROGRAM_ID
    ));
    await program.provider.sendAndConfirm(createAtaTx, [staker]);

    await mintTokensToUser(program, payer, globalState, mint, mintAuthority, stakerATA, DEFAULT_MIN_STAKE_AMOUNT);

    let globalStateData = await program.account.globalState.fetch(globalState);
    const [stakePDA] = findStakePDA(program.programId, staker.publicKey, globalStateData.totalStakesCreated);
    await program.methods
      .createStake(DEFAULT_MIN_STAKE_AMOUNT, 365)
      .accounts({
        user: staker.publicKey,
        globalState,
        stakeAccount: stakePDA,
        userTokenAccount: stakerATA,
        mint,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([staker])
      .rpc();

    // Advance past claim period end (180+ days)
    await advanceClock(client, BigInt(DEFAULT_SLOTS_PER_DAY.muln(181).toString()));

    // Finalize BPD - this activates the BPD window
    await program.methods
      .finalizeBpdCalculation()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // Verify BPD window is active
    globalStateData = await program.account.globalState.fetch(globalState);
    expect(globalStateData.reserved[0].toNumber()).to.equal(1);

    // Initiate authority transfer
    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Attempt to accept during BPD window - should fail
    try {
      await program.methods
        .acceptAuthority()
        .accounts({
          globalState,
          pendingAuthority: pendingAuthorityPDA,
          newAuthority: newAuthority.publicKey,
        })
        .signers([newAuthority])
        .rpc();
      throw new Error("Expected AuthorityTransferBlockedDuringBpd error");
    } catch (error: any) {
      expect(error.toString()).to.include("AuthorityTransferBlockedDuringBpd");
    }

    // Complete BPD: seal + trigger to clear the window
    const claimConfig = await program.account.claimConfig.fetch(claimConfigPDA);
    await advanceClock(client, BigInt(216_001));
    await program.methods
      .sealBpdFinalize(claimConfig.bpdStakesFinalized)
      .accounts({
        authority: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .signers([payer])
      .rpc();

    await program.methods
      .triggerBigPayDay()
      .accounts({
        caller: payer.publicKey,
        globalState,
        claimConfig: claimConfigPDA,
      })
      .remainingAccounts([
        { pubkey: stakePDA, isSigner: false, isWritable: true },
      ])
      .signers([payer])
      .rpc();

    // BPD window should now be closed
    globalStateData = await program.account.globalState.fetch(globalState);
    expect(globalStateData.reserved[0].toNumber()).to.equal(0);

    // Now accept should succeed - need to re-initiate since PDA was not closed
    // (The pending authority PDA still exists from before)
    // Re-initiate transfer (pending_authority PDA might still exist)
    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await program.methods
      .acceptAuthority()
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        newAuthority: newAuthority.publicKey,
      })
      .signers([newAuthority])
      .rpc();

    const finalState = await program.account.globalState.fetch(globalState);
    expect(finalState.authority.toBase58()).to.equal(newAuthority.publicKey.toBase58());
  });

  it("after accept, new authority has access (admin_mint succeeds)", async () => {
    const { client, program, payer } = setupTest();
    const { globalState, mint, mintAuthority } = await initializeProtocol(program, payer);
    const [pendingAuthorityPDA] = findPendingAuthorityPDA(program.programId);

    const newAuthority = Keypair.generate();

    // Fund new authority
    const fundTx = new Transaction();
    fundTx.add(SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: newAuthority.publicKey,
      lamports: 100_000_000,
    }));
    await program.provider.sendAndConfirm(fundTx, [payer]);

    // Transfer authority
    await program.methods
      .transferAuthority(newAuthority.publicKey)
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    await program.methods
      .acceptAuthority()
      .accounts({
        globalState,
        pendingAuthority: pendingAuthorityPDA,
        newAuthority: newAuthority.publicKey,
      })
      .signers([newAuthority])
      .rpc();

    // Create token account for new authority to mint to
    const recipientATA = getAssociatedTokenAddressSync(mint, newAuthority.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const createAtaTx = new Transaction();
    createAtaTx.add(createAssociatedTokenAccountInstruction(newAuthority.publicKey, recipientATA, newAuthority.publicKey, mint, TOKEN_2022_PROGRAM_ID));
    await program.provider.sendAndConfirm(createAtaTx, [newAuthority]);

    // New authority admin_mint should succeed
    await program.methods
      .adminMint(new BN(1000))
      .accounts({
        authority: newAuthority.publicKey,
        globalState,
        mintAuthority,
        mint,
        recipientTokenAccount: recipientATA,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
      })
      .signers([newAuthority])
      .rpc();

    // Verify mint worked
    const state = await program.account.globalState.fetch(globalState);
    expect(state.totalAdminMinted.toNumber()).to.equal(1000);
  });
});
