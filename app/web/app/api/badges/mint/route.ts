import { NextRequest, NextResponse } from 'next/server';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

// Badge mint: eligibility check (~2s) + DAS check (~2s) + mint TX (~10s) +
// DAS retry loop (up to 10s) + freeze TX (~5s) = ~28s worst case.
// 60s gives 2x headroom. Requires Vercel Fluid Compute (300s max on Hobby).
export const maxDuration = 60;
import {
  mplBubblegum,
  mintV2,
  parseLeafFromMintV2Transaction,
  getAssetWithProof,
  setNonTransferableV2,
} from '@metaplex-foundation/mpl-bubblegum';
import { mplCore } from '@metaplex-foundation/mpl-core';
import {
  keypairIdentity,
  createSignerFromKeypair,
  some,
  publicKey as umiPubkey,
  type RpcInterface,
} from '@metaplex-foundation/umi';
import { dasApi, type DasApiInterface } from '@metaplex-foundation/digital-asset-standard-api';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { Keypair } from '@solana/web3.js';
import { generateBadgeSvg } from '@/lib/badges/badge-svg-server';
import { BADGE_NAMES, BADGE_TYPES, type BadgeType } from '@/lib/badges/badge-types';

export async function POST(req: NextRequest) {
  try {
    // ---------- 1. Parse and validate request ----------
    const body = await req.json() as { wallet?: string; badgeType?: string };
    const { wallet, badgeType } = body;

    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid wallet address' }, { status: 400 });
    }
    if (!badgeType || !BADGE_TYPES.includes(badgeType as BadgeType)) {
      return NextResponse.json({ error: 'Invalid badgeType' }, { status: 400 });
    }

    const typedBadgeType = badgeType as BadgeType;

    // ---------- 1b. Validate server configuration ----------
    const collectionAddress = process.env.BADGE_COLLECTION_ADDRESS;
    const merkleTreeAddress = process.env.BADGE_MERKLE_TREE_ADDRESS;
    if (!collectionAddress || !merkleTreeAddress) {
      return NextResponse.json(
        {
          error:
            'Badge collection not configured. ' +
            'Run scripts/setup-badge-collection.ts and set BADGE_COLLECTION_ADDRESS ' +
            'and BADGE_MERKLE_TREE_ADDRESS in .env.local.',
        },
        { status: 503 }
      );
    }
    const BADGE_COLLECTION = umiPubkey(collectionAddress);
    const MERKLE_TREE = umiPubkey(merkleTreeAddress);

    // ---------- 2. Eligibility check from indexer ----------
    const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL ?? 'http://localhost:3001';
    const eligibilityResp = await fetch(`${indexerUrl}/api/badges?wallet=${wallet}`);
    if (!eligibilityResp.ok) {
      console.error('[badges/mint] Indexer eligibility check failed:', eligibilityResp.status);
      return NextResponse.json({ error: 'Failed to verify badge eligibility' }, { status: 502 });
    }
    const eligibilityData = await eligibilityResp.json() as { badges?: Array<{ badgeType: string; eligible: boolean }> };
    const badge = eligibilityData.badges?.find((b) => b.badgeType === badgeType);
    if (!badge?.eligible) {
      return NextResponse.json({ error: 'Not eligible for this badge' }, { status: 403 });
    }

    // ---------- 3. Check already claimed via DAS ----------
    const umiForDas = createUmi(process.env.HELIUS_RPC_URL!)
      .use(mplBubblegum())
      .use(mplCore())
      .use(dasApi());

    const ownerAssets = await (umiForDas.rpc as RpcInterface & DasApiInterface).getAssetsByOwner({
      owner: umiPubkey(wallet),
      limit: 1000,
    });
    const badgeName = BADGE_NAMES[typedBadgeType];
    const badgeCollectionStr = BADGE_COLLECTION.toString();
    const alreadyClaimed = ownerAssets.items.some((asset) => {
      const inCollection = asset.grouping?.some(
        (g) => g.group_key === 'collection' && g.group_value === badgeCollectionStr
      );
      return inCollection && asset.content?.metadata?.name === badgeName;
    });

    if (alreadyClaimed) {
      return NextResponse.json({ error: 'Badge already claimed' }, { status: 409 });
    }

    // ---------- 4. Create UMI instance with server keypair ----------
    if (!process.env.BADGE_AUTHORITY_SECRET) {
      return NextResponse.json({ error: 'Badge authority not configured' }, { status: 500 });
    }

    const umi = createUmi(process.env.HELIUS_RPC_URL!)
      .use(mplBubblegum())
      .use(mplCore())
      .use(dasApi());

    let serverKeypair: Keypair;
    try {
      serverKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.BADGE_AUTHORITY_SECRET))
      );
    } catch {
      return NextResponse.json(
        { error: 'BADGE_AUTHORITY_SECRET must be a valid JSON array of numbers (64 bytes).' },
        { status: 500 }
      );
    }
    const umiKeypair = fromWeb3JsKeypair(serverKeypair);
    const serverSigner = createSignerFromKeypair(umi, umiKeypair);
    umi.use(keypairIdentity(serverSigner));

    // ---------- 5. Generate badge SVG ----------
    const svgDataUri = generateBadgeSvg(typedBadgeType, {
      wallet,
      claimDate: new Date().toISOString(),
    });

    // ---------- 6. Mint (Step 1) ----------
    const { signature } = await mintV2(umi, {
      collectionAuthority: serverSigner,
      leafOwner: umiPubkey(wallet),
      merkleTree: MERKLE_TREE,
      coreCollection: BADGE_COLLECTION,
      metadata: {
        name: badgeName,
        uri: svgDataUri,
        sellerFeeBasisPoints: 0,
        collection: some(BADGE_COLLECTION),
        creators: [],
      },
    }).sendAndConfirm(umi, { confirm: { commitment: 'finalized' } });

    // ---------- 7. Parse leaf from mint transaction ----------
    const leaf = await parseLeafFromMintV2Transaction(umi, signature);

    // ---------- 8. Freeze (Step 2) — make soulbound ----------
    // Retry loop handles DAS indexing lag between mint confirmation and asset availability
    let assetWithProof;
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        assetWithProof = await getAssetWithProof(
          umi as typeof umi & { rpc: RpcInterface & DasApiInterface },
          leaf.id
        );
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[badges/mint] getAssetWithProof attempt ${attempt + 1}/5 failed, retrying in 2s...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    if (!assetWithProof) {
      console.error('[badges/mint] Failed to get asset with proof after 5 attempts:', lastError);
      // Mint succeeded but freeze failed — badge is minted but transferable
      // Return partial success so user knows their mint is on-chain
      return NextResponse.json(
        {
          error: 'Badge minted but soulbound freeze failed — please contact support',
          signature: Buffer.from(signature).toString('base64'),
          assetId: leaf.id.toString(),
        },
        { status: 500 }
      );
    }

    await setNonTransferableV2(umi, {
      ...assetWithProof,
      authority: serverSigner,
      coreCollection: BADGE_COLLECTION,
    }).sendAndConfirm(umi);

    // ---------- 9. Return success ----------
    return NextResponse.json({
      signature: Buffer.from(signature).toString('base64'),
      assetId: leaf.id.toString(),
    });
  } catch (err) {
    console.error('[badges/mint] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
