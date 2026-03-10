'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletButton } from '@/components/wallet/ClientWalletButton';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LayoutGrid } from 'lucide-react';

export function Navbar() {
  const { connected } = useWallet();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-text-primary rounded-lg flex items-center justify-center">
            <div className="w-3.5 h-3.5 border-2 border-bg-primary rounded-sm" />
          </div>
          <div>
            <span className="font-display font-semibold text-base text-text-primary tracking-tight">CredChain</span>
            <span className="hidden sm:block text-[10px] font-mono text-text-muted tracking-widest uppercase -mt-0.5">AI Credit</span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {connected && (
            <Link
              href="/dashboard"
              className="btn-outline hidden sm:inline-flex items-center gap-1.5 py-2 px-3 text-xs"
            >
              <LayoutGrid size={13} /> Dashboard
            </Link>
          )}
          <ThemeToggle />
          <ClientWalletButton />
        </div>
      </div>
    </header>
  );
}
