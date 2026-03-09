'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletButton } from '@/components/wallet/ClientWalletButton';
import { Brain, Home } from 'lucide-react';

export function Navbar() {
  const { connected } = useWallet();

  return (
    <nav className="fixed top-6 inset-x-0 mx-auto max-w-5xl z-50 px-6 py-3 rounded-full glass-strong border border-white/10 shadow-2xl backdrop--xl">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-gold  opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-10 h-10 rounded-xl bg-accent-gold flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              <Brain size={20} className="text-bg-primary" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-text-primary tracking-tight group-hover:text-accent-gold transition-colors">
              CredChain
            </span>
            <span className="font-mono text-[10px] text-accent-gold/80 uppercase tracking-[0.2em]">
              AI Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {connected && (
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
            >
              <Home size={16} />
              Dashboard
            </Link>
          )}
          
          {/* Wallet Connect Button */}
          <div className="relative">
            <div className="absolute -inset-1 bg-accent-gold rounded-lg  opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <ClientWalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
