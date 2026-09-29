'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { QuickStats } from '@/components/deal/QuickStats';
import { DealList } from '@/components/deal/DealList';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { Deal } from '@/lib/types';
import { Sparkles, BrainCircuit, Shield, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/deals');
      const data = await res.json();
      setDeals(data.deals || []);
    } catch (e) {
      console.error('Failed to fetch deals:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleReSeed = async () => {
    setIsSeeding(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      await fetchDeals();
    } catch (e) {
      console.error('Re-seed failed:', e);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header
        onOpenCommandPalette={() => setCmdPaletteOpen(true)}
        onReSeed={handleReSeed}
        isSeeding={isSeeding}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Workspace Banner */}
        <div className="p-5 rounded-lg bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-foreground">
                Enterprise Deal Intelligence Workspace
              </h1>
              <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                ACTIVE BANK
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              Every call transcript, email thread, security review, and pricing objection is retained into Hindsight memory. Click any deal to generate a 30-second pre-call brief with grounded citations.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/tactics"
              className="px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Cross-Deal Learning</span>
            </Link>

            <Link
              href="/ingest"
              className="px-3.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <span>Ingest Transcript</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pipeline & Memory Metrics */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground text-xs font-mono space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            <span>Loading Deal Intelligence Memory...</span>
          </div>
        ) : (
          <>
            <QuickStats deals={deals} />
            <DealList deals={deals} />
          </>
        )}
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        deals={deals}
      />
    </div>
  );
}
