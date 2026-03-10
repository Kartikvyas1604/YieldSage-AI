/**
 * CredChain AI — Real On-Chain Data Tools
 * Fetches live data from Solana mainnet via Helius enhanced API + public RPC.
 * No mock data. Every value comes from the blockchain.
 */

import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL =
  process.env.HELIUS_RPC_URL ||
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL ||
  'https://api.mainnet-beta.solana.com';

const connection = new Connection(RPC_URL, 'confirmed');

function getHeliusApiKey(): string | null {
  if (process.env.HELIUS_API_KEY) return process.env.HELIUS_API_KEY;
  const match = RPC_URL.match(/api-key=([^&]+)/);
  return match?.[1] ?? null;
}

// ── Known on-chain program IDs ────────────────────────────────
const LENDING_PROGRAMS: Record<string, string> = {
  MFv2hWf31Z9kbCa1snEPdcgp8X5jyBygEVP7cqMLYh8: 'Marginfi',
  So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo: 'Solend',
  KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD: 'Kamino',
  'D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ': 'Port Finance',
};

const DEX_PROGRAMS: Record<string, string> = {
  JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: 'Jupiter v6',
  JUP4Fb2cqiRUcaTHdrPC8h2gNsaD4Dm7V6WT7JBgFPJ: 'Jupiter v4',
  whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3sFjNmR: 'Orca Whirlpools',
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': 'Orca v1',
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium AMM',
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK: 'Raydium CLMM',
};

const LP_PROGRAMS: Record<string, string> = {
  whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3sFjNmR: 'Orca Whirlpools',
  LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo: 'Meteora DLMM',
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium AMM',
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK: 'Raydium CLMM',
};

const GOVERNANCE_PROGRAMS: Record<string, string> = {
  GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw: 'SPL Governance (Realms)',
  hgovkRU6Ghe1Qoyb54HdSLdqN7VtxaifBzRmh9jtd3S: 'Helium Governance',
  MVAbLpgQ8D3pDe4qJHBUiaLcEjBmBmNEdDCBnYCissi: 'Mango Governance',
};

const STAKING_PROGRAMS: Record<string, string> = {
  MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD: 'Marinade',
  Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb: 'Jito',
};

// ── Types ─────────────────────────────────────────────────────
export interface DefiActivity {
  lendingProtocols: string[];
  dexProtocols: string[];
  lpProtocols: string[];
  governanceProtocols: string[];
  stakingProtocols: string[];
  lendingTxCount: number;
  tradingTxCount: number;
  lpTxCount: number;
  governanceTxCount: number;
  stakingTxCount: number;
}

export interface WalletOnChainData {
  walletAddress: string;
  solBalance: number;
  totalTransactions: number;
  successfulTransactions: number;
  walletAgeDays: number;
  firstTxDate: string | null;
  lastTxDate: string | null;
  tokenHoldings: Array<{ mint: string; amount: number }>;
  tokenCount: number;
  defiActivity: DefiActivity;
}

// ── Main entry point ──────────────────────────────────────────
export async function fetchWalletOnChainData(walletAddress: string): Promise<WalletOnChainData> {
  const pubkey = new PublicKey(walletAddress);
  const apiKey = getHeliusApiKey();

  // Fetch in parallel: signatures + SOL balance + SPL token accounts
  const [signatures, lamports, tokenAccountsResp] = await Promise.all([
    connection.getSignaturesForAddress(pubkey, { limit: 1000 }),
    connection.getBalance(pubkey),
    connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    }),
  ]);

  const solBalance = lamports / 1e9;
  const successfulTxs = signatures.filter(s => !s.err);
  const oldest = signatures.at(-1);
  const newest = signatures[0];

  const walletAgeDays = oldest?.blockTime
    ? Math.floor((Date.now() - oldest.blockTime * 1000) / 86_400_000)
    : 0;

  const tokenHoldings = tokenAccountsResp.value
    .map(acc => ({
      mint: acc.account.data.parsed.info.mint as string,
      amount: acc.account.data.parsed.info.tokenAmount.uiAmount as number,
    }))
    .filter(h => h.amount > 0);

  // Try Helius enhanced API for rich parsed transactions
  let heliusParsed: any[] | null = null;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${apiKey}&limit=100`,
        { signal: AbortSignal.timeout(12_000) }
      );
      if (res.ok) heliusParsed = await res.json();
    } catch {
      // Non-fatal — fallback to RPC account-key scanning
    }
  }

  const defiActivity = await detectDefiActivity(walletAddress, signatures, heliusParsed);

  return {
    walletAddress,
    solBalance,
    totalTransactions: signatures.length,
    successfulTransactions: successfulTxs.length,
    walletAgeDays,
    firstTxDate: oldest?.blockTime
      ? new Date(oldest.blockTime * 1000).toISOString()
      : null,
    lastTxDate: newest?.blockTime
      ? new Date(newest.blockTime * 1000).toISOString()
      : null,
    tokenHoldings: tokenHoldings.slice(0, 20),
    tokenCount: tokenHoldings.length,
    defiActivity,
  };
}

// ── DeFi activity detection ───────────────────────────────────
async function detectDefiActivity(
  _walletAddress: string,
  signatures: Awaited<ReturnType<Connection['getSignaturesForAddress']>>,
  heliusParsed: any[] | null
): Promise<DefiActivity> {
  const lendingSet = new Set<string>();
  const dexSet     = new Set<string>();
  const lpSet      = new Set<string>();
  const govSet     = new Set<string>();
  const stakeSet   = new Set<string>();
  let lendingTxCount = 0, tradingTxCount = 0, lpTxCount = 0, govTxCount = 0, stakingTxCount = 0;

  if (heliusParsed && heliusParsed.length > 0) {
    for (const tx of heliusParsed) {
      const type   = (tx.type   as string) ?? '';
      const source = (tx.source as string) ?? '';

      if (['DEPOSIT', 'BORROW', 'REPAY', 'WITHDRAW_FROM_LENDING', 'LIQUIDATION'].includes(type)) {
        if (source) lendingSet.add(source); lendingTxCount++;
      } else if (type === 'SWAP') {
        if (source) dexSet.add(source); tradingTxCount++;
      } else if (['ADD_LIQUIDITY', 'REMOVE_LIQUIDITY'].includes(type)) {
        if (source) lpSet.add(source); lpTxCount++;
      } else if (['VOTE', 'GOVERNANCE'].includes(type)) {
        if (source) govSet.add(source); govTxCount++;
      } else if (['STAKE', 'UNSTAKE'].includes(type)) {
        if (source) stakeSet.add(source); stakingTxCount++;
      }

      // Also scan instruction program IDs
      for (const ix of tx.instructions ?? []) {
        const prog = ix.programId as string;
        if (prog in LENDING_PROGRAMS)    { lendingSet.add(LENDING_PROGRAMS[prog]); }
        if (prog in DEX_PROGRAMS)        { dexSet.add(DEX_PROGRAMS[prog]); }
        if (prog in LP_PROGRAMS)         { lpSet.add(LP_PROGRAMS[prog]); }
        if (prog in GOVERNANCE_PROGRAMS) { govSet.add(GOVERNANCE_PROGRAMS[prog]); }
        if (prog in STAKING_PROGRAMS)    { stakeSet.add(STAKING_PROGRAMS[prog]); }
      }
    }
  } else {
    // Fallback: scan account keys from a sample of full transactions
    const sampleSigs = signatures.slice(0, 40).map(s => s.signature);
    try {
      const txs = await connection.getParsedTransactions(sampleSigs, {
        maxSupportedTransactionVersion: 0,
      });
      for (const tx of txs) {
        if (!tx) continue;
        for (const key of tx.transaction.message.accountKeys) {
          const k = key.pubkey.toBase58();
          if (k in LENDING_PROGRAMS)    { lendingSet.add(LENDING_PROGRAMS[k]);    lendingTxCount++; }
          if (k in DEX_PROGRAMS)        { dexSet.add(DEX_PROGRAMS[k]);            tradingTxCount++; }
          if (k in LP_PROGRAMS)         { lpSet.add(LP_PROGRAMS[k]);              lpTxCount++; }
          if (k in GOVERNANCE_PROGRAMS) { govSet.add(GOVERNANCE_PROGRAMS[k]);     govTxCount++; }
          if (k in STAKING_PROGRAMS)    { stakeSet.add(STAKING_PROGRAMS[k]);      stakingTxCount++; }
        }
      }
    } catch { /* ignore RPC errors */ }
  }

  return {
    lendingProtocols:    Array.from(lendingSet),
    dexProtocols:        Array.from(dexSet),
    lpProtocols:         Array.from(lpSet),
    governanceProtocols: Array.from(govSet),
    stakingProtocols:    Array.from(stakeSet),
    lendingTxCount,
    tradingTxCount,
    lpTxCount,
    governanceTxCount: govTxCount,
    stakingTxCount,
  };
}

/** executeTool dispatcher — kept for API route compatibility */
export async function executeTool(
  toolName: string,
  params: Record<string, string>,
): Promise<WalletOnChainData | { error: string }> {
  const addr = params.wallet_address;
  if (!addr) return { error: 'Missing wallet_address param' };
  return fetchWalletOnChainData(addr);
}
