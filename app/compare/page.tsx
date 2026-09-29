'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Zap, 
  History, 
  Layers, 
  Clock, 
  ChevronRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { CitationChip } from '@/components/brief/CitationChip';
import { CitationDrawer } from '@/components/brief/CitationDrawer';
import { Citation } from '@/lib/types';

export default function ComparePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedDealId, setSelectedDealId] = useState('deal-acme-fintech');
  const [query, setQuery] = useState('Prep me for my call with the leadership team. What is the status, active objections, and what should I ask?');
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  useEffect(() => {
    fetch('/api/deals')
      .then((res) => res.json())
      .then((data) => {
        if (data.deals) setDeals(data.deals);
      })
      .catch((err) => console.error(err));
  }, []);

  const runComparison = async (dealId = selectedDealId, userQuery = query) => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, query: userQuery })
      });
      const data = await res.json();
      if (data.success) {
        setCompareData(data);
      }
    } catch (err) {
      console.error('Error running comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComparison('deal-acme-fintech');
  }, []);

  const presetQueries = [
    { label: 'Full Pre-Call Brief', q: 'Prep me for my call with the leadership team. What is the status, active objections, and what should I ask?' },
    { label: 'Pricing & Budget History', q: 'What did the CFO say about our pricing in previous meetings, and what discount or structure did they request?' },
    { label: 'Competitor FUD & Objections', q: 'What competitor was mentioned, what was their pricing pitch, and how did we debunk their claims?' },
    { label: 'Champion & Blocker Shift', q: 'Who is the internal champion and has their sentiment or stance shifted over time?' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-sky-500/20">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono mb-2">
              <Zap className="w-3 h-3" />
              <span>THE SIGNATURE MEMORY DIFFERENCE</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Memory ON vs. Memory OFF Split View
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Compare side-by-side what a standard stateless LLM sees with only the latest CRM note versus what the Hindsight Deal Intelligence Agent generates with persistent temporal memory.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedDealId}
              onChange={(e) => {
                setSelectedDealId(e.target.value);
                runComparison(e.target.value, query);
              }}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
            >
              {deals.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.company})
                </option>
              ))}
            </select>

            <button
              onClick={() => runComparison()}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Comparing...' : 'Re-run Comparison'}</span>
            </button>
          </div>
        </div>

        {/* Prompt Selector & Custom Query */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Try Scenario:</span>
            {presetQueries.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(preset.q);
                  runComparison(selectedDealId, preset.q);
                }}
                className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                  query === preset.q
                    ? 'bg-sky-500/15 border-sky-500/30 text-sky-400 font-medium'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runComparison()}
              placeholder="Ask a deal preparation question..."
              className="flex-1 bg-secondary/50 border border-border rounded-lg px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              onClick={() => runComparison()}
              disabled={loading}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-xs font-medium text-foreground transition-colors"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* Comparison Delta Highlights */}
        {compareData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground">Stateless LLM Blindspots</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Missed {compareData.deal.totalInteractions - 1} earlier meetings, historic CFO price caps, and competitor FUD rebuttals.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground">Hindsight TEMPR Grounding</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Multi-strategy recall connected {compareData.memory.groundedFactsCount} grounded facts across all timeline events with citations.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground">Cross-Deal Intelligence</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Surfaced empirical winning tactics (+58% win rate) from similar closed enterprise accounts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Memory OFF (Stateless LLM) */}
          <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-zinc-500" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Memory OFF • Stateless LLM
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Prompted with only the single latest CRM note</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
                0 Temporal Memory
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col space-y-4">
              {loading ? (
                <div className="py-16 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-muted-foreground font-mono">Querying stateless model...</p>
                </div>
              ) : compareData ? (
                <>
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-destructive text-xs font-medium mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Context Window Limitation</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Only has access to 1 note ({compareData.deal.latestInteractionDate.split('T')[0]}). Does not know the previous negotiations or stakeholder objections.
                    </p>
                  </div>

                  <div className="bg-secondary/30 border border-border rounded-lg p-4 font-sans text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                    {compareData.stateless.content}
                  </div>

                  <div className="mt-auto pt-4 border-t border-border space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Failure Modes:
                    </span>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-center space-x-2 text-red-400/90">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Missed historic CFO pricing cap and counter-proposal terms</span>
                      </li>
                      <li className="flex items-center space-x-2 text-red-400/90">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Cannot verify whether security audit or SOC 2 was cleared</span>
                      </li>
                      <li className="flex items-center space-x-2 text-red-400/90">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Generates generic boilerplate questions instead of targeted deal strategy</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Right: Memory ON (Hindsight Deal Engine) */}
          <div className="bg-card border border-sky-500/40 rounded-xl flex flex-col overflow-hidden shadow-lg shadow-sky-500/5">
            <div className="p-4 border-b border-sky-500/20 bg-sky-500/5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                    <span>Memory ON • Hindsight Agent</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Full TEMPR Recall + Auto-Consolidated Observations + reflect()</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 border border-sky-500/30 text-sky-300">
                100% Deal Memory
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col space-y-4">
              {loading ? (
                <div className="py-16 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-sky-400 font-mono">Running Hindsight TEMPR recall & reflect()...</p>
                </div>
              ) : compareData ? (
                <>
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sky-400 text-xs font-medium mb-1">
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>Persistent Temporal Memory Active</span>
                    </div>
                    <p className="text-[11px] text-sky-200/80">
                      Grounded in all {compareData.deal.totalInteractions} interactions with exact timestamps, stakeholder stance changes, and verified citations.
                    </p>
                  </div>

                  {/* Scoped Answer / Brief Display */}
                  {compareData.memory.brief ? (
                    <div className="space-y-4 text-xs">
                      {/* 3-line status */}
                      <div className="bg-secondary/40 border border-border rounded-lg p-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                          Current Deal Status:
                        </span>
                        <p className="text-foreground leading-relaxed">
                          {compareData.memory.brief.statusSummary}
                        </p>
                      </div>

                      {/* Active Objections with citations */}
                      <div className="bg-secondary/40 border border-border rounded-lg p-3 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                          Active Objections & Resolutions:
                        </span>
                        {compareData.memory.brief.openObjections?.map((obj: any, i: number) => (
                          <div key={i} className="text-muted-foreground flex items-start space-x-2">
                            <span className="text-amber-400 font-mono">•</span>
                            <div className="flex-1">
                              <span className="text-foreground font-medium">{obj.topic}: </span>
                              <span>{obj.description}</span>
                              {obj.citation && (
                                <CitationChip
                                  citation={obj.citation}
                                  onClick={() => setActiveCitation(obj.citation)}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tactical Questions to Ask */}
                      <div className="bg-secondary/40 border border-border rounded-lg p-3 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                          3 High-Impact Call Questions:
                        </span>
                        {compareData.memory.brief.questionsToAsk?.map((q: string, i: number) => (
                          <div key={i} className="text-foreground flex items-start space-x-2">
                            <span className="text-sky-400 font-mono font-bold">{i + 1}.</span>
                            <span>{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-secondary/30 border border-border rounded-lg p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                      {compareData.memory.answer}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-border space-y-2">
                    <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                      Verified Advantage:
                    </span>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Cites exact quote and \$240k counter-proposal from CFO Evelyn Vance</span>
                      </li>
                      <li className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Knows InfoSec SOC2 cleared on August 28 and ApexCloud lock-in was rejected</span>
                      </li>
                      <li className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Applies cross-deal win-rate tactic (+58% win-rate for phased ramp)</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom CTA to Deal Deep-Dive */}
        <div className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-xl">
          <div className="flex items-center space-x-3">
            <BrainCircuit className="w-5 h-5 text-sky-400" />
            <div>
              <span className="text-xs font-semibold text-foreground">Want to inspect raw memory graphs & observations?</span>
              <p className="text-[11px] text-muted-foreground">
                View the Memory Inspector to see auto-consolidated belief shifts and entity relationships.
              </p>
            </div>
          </div>
          <Link
            href={`/deals/${selectedDealId}`}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-xs font-medium text-foreground transition-colors"
          >
            <span>Open Deal Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Citation Drawer Modal */}
      {activeCitation && (
        <CitationDrawer
          citation={activeCitation}
          isOpen={!!activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      )}
    </div>
  );
}
