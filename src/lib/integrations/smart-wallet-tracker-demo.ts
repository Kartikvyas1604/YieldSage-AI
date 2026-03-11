/**
 * Demo helper — re-exports the demo signal generator from the integration module.
 * Provides typed demo data for the dashboard without importing server-side code
 * that tries to reach external APIs during SSR/client render.
 */
import type { SmartWalletSignal } from './smart-wallet-tracker';

export function getDemoSignals(): SmartWalletSignal[] {
  const now = Date.now();
  return [
    {
      walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      action: 'entered',
      pool: 'SOL-USDC',
      poolAddress: 'ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq',
      binRange: { min: 8370, max: 8410 },
      amount: 2400,
      timestamp: now - 4 * 60 * 1000,
      historicalReturnRate: 247,
      confidence: 'HIGH',
    },
    {
      walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      action: 'entered',
      pool: 'BONK-SOL',
      poolAddress: 'Hs3sFBiGkBKXiT4LgCBkNXhQ2SLDkBp2qL1oVjEvD6pY',
      binRange: { min: 21400, max: 21600 },
      amount: 850,
      timestamp: now - 22 * 60 * 1000,
      historicalReturnRate: 189,
      confidence: 'MEDIUM',
    },
    {
      walletAddress: 'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
      action: 'exited',
      pool: 'mSOL-SOL',
      poolAddress: 'EgQ3yNtVzdZuXTmb2hMULZCEeSbLArLhBQFGuVWyBGq7',
      binRange: { min: 980, max: 1020 },
      amount: 3100,
      timestamp: now - 75 * 60 * 1000,
      historicalReturnRate: 98,
      confidence: 'LOW',
    },
  ];
}
