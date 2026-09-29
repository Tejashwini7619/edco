'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { CitationDrawer } from '@/components/brief/CitationDrawer';
import { Deal, MentalModelSummary, TacticRecommendation, SourceMemory } from '@/lib/types';
import {
  Sparkles,
  TrendingUp,
  Swords,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Quote,
  Loader2,
  Building2,
  Flame
} from 'lucide-react';

export default function TacticsPage() {
  const [deals, setAllDeals] = useState<Deal[]>([]);
  const [mentalModels, setMentalModels] = useState<MentalModelSummary[]>([]);
  const [query, setQuery] = useState('How to beat ApexCloud Enterprise on price when they offer 30-40% bundle discounts?');
  const [recommendation, setRecommendation] = useState<TacticRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceMemory | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sampleQueries = [
    'How to beat ApexCloud Enterprise on price discounts?',
    'What objection-handling approach wins against High Migration Cost?',
    'How to position against NimbleStack Pro developer pricing?',
    'Which security tactic unblocks InfoSec data residency concerns?',
  ];

  useEffect(() => {
    async function init() {
      try {
        const dealsRes = await fetch('/api/deals');
        const dealsData = await dealsRes.json();
        setAllDeals(dealsData.deals || []);

        const mmRes = await fetch('/api/tactics/models');
        const mmData = await mmRes.json();
        setMentalModels(mmData.mentalModels || []);

        // Run default tactic recommendation
        handleSearch(query);
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  const handleSearch = async (q: string) => {
    if (!q || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/tactics/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (citationId: string) => {
    if (recommendation?.citations && recommendation.citations[citationId]) {
      setSelectedSource(recommendation.citations[citationId]);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onOpenCommandPalette={() => setCmdPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Title & Introduction */}
        <div className="p-5 rounded-lg bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="text-base font-bold text-foreground">
                Tactic Recommender & Cross-Deal Intelligence
              </h1>
              <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                REFLECT() OVER PAST OUTCOMES
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
              Synthesizes winning tactics across closed-won and closed-lost deal cycles. Answers: &quot;Which objection-handling approach has won most often against Competitor X or Objection Y?&quot; with verified empirical deal citations.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="p-3 rounded-md bg-secondary/50 border border-border text-right">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Empirical Win Lift</div>
              <div className="text-base font-bold font-mono text-emerald-400">+49% to +58%</div>
            </div>
          </div>
        </div>

        {/* Query Input Box & Suggested Pills */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-sm space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask how to handle an objection or beat a competitor (e.g. How to beat ApexCloud on price?)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-secondary/40 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/60"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center space-x-1.5 disabled:opacity-50 transition-colors shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Reflecting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommend Tactic</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Query Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-1">
            <span className="text-[11px] font-mono text-muted-foreground shrink-0">Common Playbooks:</span>
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                className="px-2.5 py-1 text-[11px] rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border whitespace-nowrap transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Results */}
        {recommendation && (
          <div className="space-y-4">
            {/* Top Summary Card */}
            <div className="p-5 rounded-lg bg-card border border-border shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <div className="text-[10px] font-mono uppercase text-sky-400 font-semibold">
                    {recommendation.targetCategory}
                  </div>
                  <h2 className="text-sm font-bold text-foreground mt-0.5">
                    Strategic Recommendation & Empirical Proof
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <div className="text-[10px] font-mono uppercase text-emerald-400">With Tactic</div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {recommendation.overallWinRateWithTactic}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-center">
                    <div className="text-[10px] font-mono uppercase text-rose-400">Without Tactic</div>
                    <div className="text-base font-bold font-mono text-rose-400">
                      {recommendation.overallWinRateWithoutTactic}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-sky-500/5 border border-sky-500/20 text-xs leading-relaxed text-foreground font-medium">
                {recommendation.coreRecommendation}
              </div>

              {/* Concrete Tactics */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>Winning Tactics Identified from Memory:</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendation.tactics.map((tac, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-secondary/30 border border-border/80 text-xs space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-foreground">{tac.tactic}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 font-medium">
                            {tac.winRateImpact}
                          </span>
                        </div>

                        <div className="text-[11px] text-muted-foreground mt-1.5">
                          <span className="font-medium text-foreground">Recommended When:</span> {tac.recommendedWhen}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <div className="text-[11px] font-mono text-muted-foreground italic flex items-start space-x-1.5">
                          <Quote className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
                          <span>{tac.directQuote}</span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                          <span>Evidence: {tac.evidenceDeals.join(', ')}</span>
                          {tac.citationId && (
                            <button
                              onClick={() => handleCitationClick(tac.citationId)}
                              className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 transition-colors"
                            >
                              Verify Memory [{tac.citationId.replace(/^cit-/, '')}]
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Past Deals */}
              <div className="pt-2">
                <div className="text-xs font-mono uppercase text-muted-foreground font-semibold mb-2.5">
                  Supporting Empirical Past Deals ({recommendation.supportingDeals.length})
                </div>

                <div className="space-y-2">
                  {recommendation.supportingDeals.map((dealEv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md bg-secondary/20 border border-border/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className="mt-0.5">
                          {dealEv.outcome === 'Won' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground flex items-center space-x-2">
                            <span>{dealEv.dealName}</span>
                            <span className="text-muted-foreground font-mono font-normal">
                              (\${dealEv.value.toLocaleString()} ARR)
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                              dealEv.outcome === 'Won'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              Closed {dealEv.outcome}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground">Tactic:</span> {dealEv.tacticUsed}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground">Lesson:</span> {dealEv.lessonLearned}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-[10px] text-muted-foreground shrink-0">
                        {dealEv.closedDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curated Mental Models & Battlecards Hub */}
        <div className="p-5 rounded-lg bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-foreground">
                Hindsight Mental Models & Curated Battlecards
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {mentalModels.length} Auto-Refreshed Models
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mentalModels.map((mm) => (
              <div key={mm.id} className="p-4 rounded-lg bg-secondary/30 border border-border/80 text-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-foreground">{mm.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      {mm.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    {mm.summary}
                  </p>

                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">Key Core Tactics:</div>
                    {mm.keyTactics.map((kt, i) => (
                      <div key={i} className="text-[11px] text-foreground flex items-start space-x-1.5">
                        <span className="text-sky-400 font-mono text-[10px] mt-0.5">•</span>
                        <span>{kt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span className="text-emerald-400 font-semibold">{mm.winRateImpact}</span>
                  <span>Refreshed: {new Date(mm.lastRefreshed).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Citation Drawer */}
      <CitationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        source={selectedSource}
      />

      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        deals={deals}
      />
    </div>
  );
}
