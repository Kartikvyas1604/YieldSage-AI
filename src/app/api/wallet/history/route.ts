/**
 * GET /api/wallet/history?address=<wallet>&limit=20&before=<signature>
 * Returns paginated transaction history with DeFi action tagging.
 */

import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RPC_URL =
  process.env.HELIUS_RPC_URL ||
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

const KNOWN_PROTOCOL_PROGRAMS: Record<string, string> = {
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4": "Jupiter",
  "KLend2g3cP87fffoy8q1mQqGKjrL823AyisupAQgGGM": "Kamino",
  "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo": "Meteora",
  "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc": "Orca Whirlpool",
  "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo": "Solend",
  "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD": "Marginfi",
};

function tagProtocol(programId: string): string {
  return KNOWN_PROTOCOL_PROGRAMS[programId] ?? "Unknown";
}

function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const before = searchParams.get("before") ?? undefined;

  if (!address || !isValidSolanaAddress(address)) {
    return NextResponse.json(
      { error: "Invalid or missing Solana wallet address" },
      { status: 400 }
    );
  }

  try {
    const connection = new Connection(RPC_URL, "confirmed");
    const pubkey = new PublicKey(address);

    const signatures = await connection.getSignaturesForAddress(pubkey, {
      limit,
      before,
    });

    const transactions = await Promise.allSettled(
      signatures.map(async (sig) => {
        const tx = await connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });

        const programs = tx?.transaction.message.staticAccountKeys
          ?.map((k) => k.toBase58())
          .filter((k) => KNOWN_PROTOCOL_PROGRAMS[k]) ?? [];

        const protocol = programs.length > 0 ? tagProtocol(programs[0]) : null;

        return {
          signature: sig.signature,
          blockTime: sig.blockTime,
          slot: sig.slot,
          err: sig.err,
          status: sig.err ? "failed" : "success",
          protocol,
          memo: sig.memo ?? null,
        };
      })
    );

    const resolved = transactions
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<unknown>).value);

    return NextResponse.json({
      address,
      transactions: resolved,
      count: resolved.length,
      hasMore: signatures.length === limit,
      nextBefore: signatures[signatures.length - 1]?.signature ?? null,
    });
  } catch (err) {
    console.error("[wallet/history] Error:", err);
    return NextResponse.json({ error: "Failed to fetch transaction history" }, { status: 500 });
  }
}
