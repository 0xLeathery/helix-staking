import { NextRequest, NextResponse } from 'next/server';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi, type DasApiInterface } from '@metaplex-foundation/digital-asset-standard-api';
import { publicKey as umiPubkey, type RpcInterface } from '@metaplex-foundation/umi';
import { BADGE_NAMES, BADGE_TYPES, type BadgeType } from '@/lib/badges/badge-types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  // Validate wallet param
  if (!wallet || typeof wallet !== 'string' || wallet.length < 32 || wallet.length > 50) {
    return NextResponse.json(
      { error: 'Missing or invalid wallet address' },
      { status: 400 }
    );
  }

  // Graceful fallback on any error — mint API has its own DAS check as secondary gate
  try {
    const umi = createUmi(process.env.HELIUS_RPC_URL!).use(dasApi());

    const ownerAssets = await (umi.rpc as RpcInterface & DasApiInterface).getAssetsByOwner({
      owner: umiPubkey(wallet),
      limit: 100,
    });

    const collectionAddress = process.env.BADGE_COLLECTION_ADDRESS;

    // Filter to badges from our collection
    const badgesOwned = ownerAssets.items.filter((asset) =>
      asset.grouping?.some(
        (g) => g.group_key === 'collection' && g.group_value === collectionAddress
      )
    );

    // Map asset names back to badge types
    // Build reverse lookup: badge name -> badge type
    const nameToType: Record<string, BadgeType> = {};
    for (const badgeType of BADGE_TYPES) {
      nameToType[BADGE_NAMES[badgeType]] = badgeType;
    }

    const claimedBadgeTypes: string[] = [];
    for (const asset of badgesOwned) {
      const assetName = asset.content?.metadata?.name;
      if (assetName && nameToType[assetName]) {
        claimedBadgeTypes.push(nameToType[assetName]);
      }
    }

    return NextResponse.json(
      { wallet, claimedBadgeTypes },
      {
        headers: {
          'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (err) {
    // DAS API failed — safe fallback so UI still shows Claim buttons
    // The mint API has its own DAS duplicate check
    console.error('[badges/claimed] DAS API error, returning empty fallback:', err);
    return NextResponse.json(
      { wallet, claimedBadgeTypes: [] },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
