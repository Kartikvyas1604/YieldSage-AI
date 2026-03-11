/**
 * GET /api/wallet/balance?address=<wallet>
 * Returns SOL balance + USDC + discovered token positions for a wallet.
 * Uses Helius Enhanced API when key is available, falls back to public RPC.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchWalletOnChainData } from "@/lib/agent/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || !isValidSolanaAddress(address)) {
    return NextResponse.json(
      { error: "Invalid or missing Solana wallet address" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchWalletOnChainData(address);

    return NextResponse.json({
      address,
      solBalance: data.solBalance,
      usdcBalance: data.defiActivity.totalValueLocked ?? 0,
      walletAgeDays: data.walletAgeDays,
      totalTransactions: data.totalTransactions,
      defiActivity: {
        lendingProtocols: data.defiActivity.lendingProtocols,
        lpProtocols: data.defiActivity.lpProtocols,
        hasGovernanceActivity: data.defiActivity.hasGovernanceActivity,
      },
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("[wallet/balance] Error:", err);
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 });
  }
}
