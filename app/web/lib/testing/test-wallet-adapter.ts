import {
  BaseMessageSignerWalletAdapter,
  WalletName,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import { Keypair, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

/**
 * A programmatic wallet adapter for E2E testing.
 * Signs transactions using a Keypair derived from a base58 secret key.
 * Only used when NEXT_PUBLIC_TEST_WALLET_SECRET is set (devnet only).
 */
export class TestWalletAdapter extends BaseMessageSignerWalletAdapter {
  name = "Test Wallet" as WalletName<"Test Wallet">;
  url = "https://github.com/solhex";
  icon =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiM5OTQ1RkYiLz48L3N2Zz4=" as string;
  readyState = WalletReadyState.Installed;
  connecting = false;
  supportedTransactionVersions = new Set([0 as const, "legacy" as const]);

  private _keypair: Keypair;
  private _publicKey: PublicKey;

  constructor(secretKeyBase58: string) {
    super();
    const secretKey = decodeBase58(secretKeyBase58);
    this._keypair = Keypair.fromSecretKey(secretKey);
    this._publicKey = this._keypair.publicKey;
  }

  get publicKey(): PublicKey {
    return this._publicKey;
  }

  async connect(): Promise<void> {
    this.emit("connect", this._publicKey);
  }

  async disconnect(): Promise<void> {
    this.emit("disconnect");
  }

  async signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T> {
    if (transaction instanceof Transaction) {
      transaction.partialSign(this._keypair);
    } else {
      transaction.sign([this._keypair]);
    }
    return transaction;
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    // Dynamic import to avoid bundling @noble/curves in production
    const { ed25519 } = await import(
      /* webpackIgnore: true */ "@noble/curves/ed25519.js"
    );
    return ed25519.sign(message, this._keypair.secretKey.slice(0, 32));
  }
}

/** Decode a base58 string to Uint8Array (Bitcoin/Solana alphabet). */
function decodeBase58(input: string): Uint8Array {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const bytes: number[] = [];
  for (const char of input) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) throw new Error(`Invalid base58 character: ${char}`);
    let carry = idx;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (const char of input) {
    if (char !== "1") break;
    bytes.push(0);
  }
  bytes.reverse();
  return Uint8Array.from(bytes);
}
