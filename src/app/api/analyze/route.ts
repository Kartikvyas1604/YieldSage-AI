/**
 * POST /api/analyze
 * Streams a real AI credit analysis as Server-Sent Events.
 */

import { NextRequest } from "next/server";
import { runCredChainAgent, validateSolanaAddress } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress || typeof walletAddress !== "string") {
      return new Response(JSON.stringify({ error: "walletAddress is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!validateSolanaAddress(walletAddress)) {
      return new Response(JSON.stringify({ error: "Invalid Solana wallet address" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const encoder = new TextEncoder();
    const stream  = new TransformStream();
    const writer  = stream.writable.getWriter();

    const send = (obj: object) =>
      writer.write(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

    // Run analysis asynchronously and stream events
    (async () => {
      try {
        const result = await runCredChainAgent({
          walletAddress,
          onReasoningUpdate: (reasoning, category) =>
            send({ type: "reasoning", category, reasoning, timestamp: Date.now() }),
          onProgress: (step) =>
            send({ type: "progress", step, timestamp: Date.now() }),
        });

        if (result.success && result.score) {
          send({ type: "score",    score:   result.score,   timestamp: Date.now() });
          send({ type: "complete", success: true });
        } else {
          send({ type: "error", error: result.error ?? "Analysis failed" });
        }
      } catch (err) {
        send({ type: "error", error: err instanceof Error ? err.message : "Unknown error" });
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
