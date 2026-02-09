import { describe, it, expect } from "vitest";
import { Keypair, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import BN from "bn.js";
import {
  setupTest,
  initializeProtocol,
  findGlobalStatePDA,
  TOKEN_2022_PROGRAM_ID,
} from "./utils";

const PENDING_AUTHORITY_SEED = Buffer.from("pending_authority");

function findPendingAuthorityPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [PENDING_AUTHORITY_SEED],
    programId
  );
}

describe("AuthorityTransfer", () => {
  it("authority can initiate transfer", async () => {
    const { context, program, payer } = await setupTest();
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
    const { context, program, payer } = await setupTest();
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
    const { context, program, payer } = await setupTest();
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
    const { context, program, payer } = await setupTest();
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
    const { context, program, payer } = await setupTest();
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
  });

  it("after accept, old authority loses access (admin_mint fails)", async () => {
    const { context, program, payer } = await setupTest();
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

  it("after accept, new authority has access (admin_mint succeeds)", async () => {
    const { context, program, payer } = await setupTest();
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
