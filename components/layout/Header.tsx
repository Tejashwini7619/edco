'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, BrainCircuit, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
  onReSeed?: () => void;
  isSeeding?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette, onReSeed, isSeeding }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-12 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Micro-Context */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 transition-colors">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs tracking-tight text-foreground flex items-center space-x-1.5">
              <span>DealMemory</span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono font-medium rounded bg-sky-500/15 text-sky-400 border border-sky-500/20">
                HINDSIGHT v0.10
              </span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs">
            <Link
              href="/"
              className={`px-2.5 py-1 rounded-md transition-colors ${
                pathname === '/'
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              Workspace
            </Link>
            <Link
              href="/tactics"
              className={`px-2.5 py-1 rounded-md transition-colors flex items-center space-x-1 ${
                pathname.startsWith('/tactics')
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Tactic Recommender</span>
            </Link>
            <Link
              href="/ingest"
              className={`px-2.5 py-1 rounded-md transition-colors ${
                pathname.startsWith('/ingest')
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              Ingest Studio
            </Link>
          </nav>
        </div>

        {/* Right: Actions, Cmd+K, Theme, Seed */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Search Shortcut */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search Memory...</span>
            <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-background border border-border/80 text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Seed / Refresh Bank Trigger */}
          {onReSeed && (
            <button
              onClick={onReSeed}
              disabled={isSeeding}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border text-xs transition-colors disabled:opacity-50"
              title="Reset and re-retain all 13 deals into Hindsight"
            >
              <RefreshCw className={`w-3 h-3 ${isSeeding ? 'animate-spin text-sky-400' : ''}`} />
              <span className="font-mono text-[11px]">{isSeeding ? 'Seeding Bank...' : 'Seed Data'}</span>
            </button>
          )}

          {/* Memory Defense Badge */}
          <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="w-3 h-3" />
            <span>Defense Active</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
