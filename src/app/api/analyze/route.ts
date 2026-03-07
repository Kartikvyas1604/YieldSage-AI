/**
 * POST /api/analyze
 * Main endpoint for triggering AI credit analysis
 * Streams results via Server-Sent Events (SSE)
 */

import { NextRequest, NextResponse } from "next/server";
import { runCredChainAgent, validateSolanaAddress } from "@/lib/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, demoMode = false } = body;

    // Validate wallet address
    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!demoMode && !validateSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start analysis in background
    (async () => {
      try {
        const result = await runCredChainAgent({
          walletAddress,
          demoMode,
          onReasoningUpdate: (reasoning, category) => {
            // Send reasoning update via SSE
            const data = JSON.stringify({
              type: "reasoning",
              category,
              reasoning,
              timestamp: Date.now(),
            });
            writer.write(encoder.encode(`data: ${data}\n\n`));
          },
          onProgress: (step) => {
            // Send progress update via SSE
            const data = JSON.stringify({
              type: "progress",
              step,
              timestamp: Date.now(),
            });
            writer.write(encoder.encode(`data: ${data}\n\n`));
          },
        });

        if (result.success && result.score) {
          // Send final score
          const data = JSON.stringify({
            type: "score",
            score: result.score,
            timestamp: Date.now(),
          });
          writer.write(encoder.encode(`data: ${data}\n\n`));

          // Send completion event
          const completeData = JSON.stringify({
            type: "complete",
            success: true,
          });
          writer.write(encoder.encode(`data: ${completeData}\n\n`));
        } else {
          // Send error
          const errorData = JSON.stringify({
            type: "error",
            error: result.error || "Analysis failed",
          });
          writer.write(encoder.encode(`data: ${errorData}\n\n`));
        }
      } catch (error) {
        // Send error event
        const errorData = JSON.stringify({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        writer.write(encoder.encode(`data: ${errorData}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    // Return SSE response
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
