/**
 * POST /api/nft/mint
 * Mint a soulbound credential NFT
 */

import { NextRequest, NextResponse } from "next/server";
import { validateSolanaAddress } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, score } = body;

    // Validate inputs
    if (!walletAddress || !validateSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Valid wallet address is required" },
        { status: 400 }
      );
    }

    if (!score || score < 0 || score > 850) {
      return NextResponse.json(
        { error: "Valid score (0-850) is required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual NFT minting via Metaplex
    // const metaplex = new Metaplex(...);
    // const nft = await metaplex.nfts().create({
    //   uri: metadata.uri,
    //   name: `CredChain Score: ${score}`,
    //   sellerFeeBasisPoints: 0,
    //   tokenStandard: TokenStandard.NonFungible,
    //   ruleSet: {
    //     rules: [{ type: 'Transfer', disallowed: true }], // Soulbound
    //   },
    // });

    // For now, return mock response
    const mockNftAddress = `nft_${walletAddress.slice(0, 8)}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      nftAddress: mockNftAddress,
      explorerUrl: `https://solscan.io/token/${mockNftAddress}`,
      message: "NFT minting will be available in production",
      demo: true,
    });
  } catch (error) {
    console.error("NFT Minting Error:", error);
    return NextResponse.json(
      { error: "Failed to mint NFT" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/nft/check
 * Check if wallet has a credential NFT
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("wallet");

    if (!walletAddress || !validateSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Valid wallet address is required" },
        { status: 400 }
      );
    }

    // TODO: Query Metaplex for existing credential
    // const metaplex = new Metaplex(...);
    // const nfts = await metaplex.nfts().findAllByOwner({ owner: walletAddress });
    // const credential = nfts.find(nft => nft.name.startsWith('CredChain Score'));

    return NextResponse.json({
      hasCredential: false,
      nftAddress: null,
      message: "NFT checking will be available in production",
    });
  } catch (error) {
    console.error("NFT Check Error:", error);
    return NextResponse.json(
      { error: "Failed to check NFT" },
      { status: 500 }
    );
  }
}
