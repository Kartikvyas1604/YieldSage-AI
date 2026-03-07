'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Brain, Home } from 'lucide-react';

export function Navbar() {
  const { connected } = useWallet();

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-gold to-accent-gold-bright flex items-center justify-center">
              <Brain size={24} className="text-bg-primary" />
            </div>
            <div>
              <div className="font-display text-xl font-bold text-text-primary group-hover:text-accent-gold transition-colors">
                CredChain
              </div>
              <div className="font-mono text-xs text-text-muted uppercase tracking-wider">
                AI Credit Score
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {connected && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
              >
                <Home size={18} />
                Dashboard
              </Link>
            )}
            
            {/* Wallet Connect Button */}
            <WalletMultiButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
