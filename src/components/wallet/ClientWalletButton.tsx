'use client';

import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

/**
 * Client-side only wallet button to prevent hydration mismatches
 * The wallet button depends on browser APIs and should not be server-rendered
 */
export function ClientWalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder on server to match initial client render
  if (!mounted) {
    return (
      <div className="wallet-adapter-button wallet-adapter-button-trigger" style={{ pointerEvents: 'none', opacity: 0 }}>
        <span>Select Wallet</span>
      </div>
    );
  }

  return <WalletMultiButton />;
}
