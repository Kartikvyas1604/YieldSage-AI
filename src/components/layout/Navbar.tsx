'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { ClientWalletButton } from '@/components/wallet/ClientWalletButton';
import { LayoutGrid, Leaf, Menu, X, Settings } from 'lucide-react';

export function Navbar() {
  const { connected } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handle);
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 h-16 transition-all duration-200"
      style={{
        background: scrolled
          ? 'rgba(250,250,248,0.96)'
          : 'rgba(250,250,248,0.80)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(26,26,46,0.06)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--accent-sage) 0%, var(--accent-sage-dark) 100%)' }}
          >
            <Leaf size={16} color="white" />
          </div>
          <div>
            <span className="font-display font-semibold text-base text-text-primary tracking-tight">YieldSage</span>
            <span className="hidden sm:block text-[10px] font-mono text-text-muted tracking-widest uppercase -mt-0.5">AI</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            How it works
          </Link>
          <Link href="/#strategies" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Strategies
          </Link>
          <Link href="/#sage-token" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            $SAGE
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {connected && (
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border text-text-secondary hover:text-accent-sage hover:border-accent-sage transition-all"
            >
              <LayoutGrid size={14} /> Dashboard
            </Link>
          )}
          {connected && (
            <Link
              href="/dashboard/settings"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border text-text-secondary hover:text-accent-sage hover:border-accent-sage transition-all"
            >
              <Settings size={14} />
            </Link>
          )}
          {!connected && (
            <Link
              href="/onboard"
              className="hidden sm:inline-flex btn-sage text-sm px-4 py-2"
            >
              Start Earning
            </Link>
          )}
          <ClientWalletButton />
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border text-text-secondary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-bg-card border-b border-border shadow-lg p-4 flex flex-col gap-3">
          <Link href="/#how-it-works" className="text-sm text-text-secondary py-3 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="/#strategies" className="text-sm text-text-secondary py-3 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>Strategies</Link>
          <Link href="/#sage-token" className="text-sm text-text-secondary py-3 min-h-[44px] flex items-center" onClick={() => setMenuOpen(false)}>$SAGE Token</Link>
          {connected && (
            <Link href="/dashboard" className="btn-outline text-sm text-center" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
          <Link href="/onboard" className="btn-sage text-sm text-center" onClick={() => setMenuOpen(false)}>Start Earning</Link>
        </div>
      )}
    </header>
  );
}
