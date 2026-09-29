'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Deal, PreCallBrief, MemoryObservation, SourceMemory } from '@/lib/types';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { PreCallBriefCard } from '@/components/brief/PreCallBriefCard';
import { DealTimeline } from '@/components/deal/DealTimeline';
import { AskTheDealChat } from '@/components/chat/AskTheDealChat';
import { MemoryInspector } from '@/components/inspector/MemoryInspector';
import { CloseDealModal } from '@/components/deal/CloseDealModal';
import { DealRiskBadge } from '@/components/deal/DealRiskBadge';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  MessageSquare,
  Brain,
  Trophy,
  CheckCircle2,
  Building2,
  User,
  Calendar,
  Layers,
  Loader2,
  Flame
} from 'lucide-react';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [brief, setBrief] = useState<PreCallBrief | null>(null);
  const [observations, setObservations] = useState<MemoryObservation[]>([]);
  const [memories, setMemories] = useState<SourceMemory[]>([]);
  const [activeTab, setActiveTab] = useState<'brief' | 'timeline' | 'chat' | 'inspector'>('brief');
  const [loading, setLoading] = useState(true);
  const [refreshingBrief, setRefreshingBrief] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load deal details
        const dealRes = await fetch(`/api/deals/${dealId}`);
        const dealData = await dealRes.json();
        setDeal(dealData.deal || null);

        // Load all deals for command palette
        const allDealsRes = await fetch('/api/deals');
        const allDealsData = await allDealsRes.json();
        setAllDeals(allDealsData.deals || []);

        // Load pre-call brief
        const briefRes = await fetch(`/api/deals/${dealId}/brief`, { method: 'POST' });
        const briefData = await briefRes.json();
        setBrief(briefData.brief || null);

        // Load memory inspector data
        const inspRes = await fetch(`/api/deals/${dealId}/inspector`);
        const inspData = await inspRes.json();
        setObservations(inspData.observations || []);
        setMemories(inspData.memories || []);
      } catch (err) {
        console.error('Error loading deal:', err);
      } finally {
        setLoading(false);
      }
    }

    if (dealId) {
      loadData();
    }
  }, [dealId]);

  const handleRefreshBrief = async () => {
    setRefreshingBrief(true);
    try {
      const briefRes = await fetch(`/api/deals/${dealId}/brief`, { method: 'POST' });
      const briefData = await briefRes.json();
      setBrief(briefData.brief || null);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshingBrief(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onOpenCommandPalette={() => setCmdPaletteOpen(true)} />
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          <div className="text-xs font-mono text-muted-foreground">
            Recalling memories and synthesizing executive brief...
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header onOpenCommandPalette={() => setCmdPaletteOpen(true)} />
        <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
          <div className="text-sm font-semibold">Deal not found</div>
          <Link href="/" className="inline-flex items-center space-x-1 text-xs text-sky-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onOpenCommandPalette={() => setCmdPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
            <span>/</span>
            <span className="text-foreground">{deal.company}</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCloseModalOpen(true)}
              className="px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Record Outcome / Close</span>
            </button>
          </div>
        </div>

        {/* Deal Header Overview Card */}
        <div className="p-5 rounded-lg bg-card border border-border shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground leading-tight">{deal.name}</h1>
                  <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans">
                    <span>{deal.company}</span>
                    <span>•</span>
                    <span>{deal.industry}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span>{deal.owner}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 font-mono">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>Target Close: {deal.closeDate}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-muted-foreground">Deal Value</div>
                <div className="text-base font-bold font-mono text-foreground">\${deal.value.toLocaleString()} ARR</div>
              </div>

              <div className="h-8 w-px bg-border/80" />

              <div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground mb-1">Memory Risk</div>
                <DealRiskBadge level={deal.risk.level} score={deal.risk.score} reason={deal.risk.reason} />
              </div>
            </div>
          </div>

          {/* Contributing Risk Factors & Next Step Callout */}
          <div className="p-3 rounded-md bg-secondary/30 border border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
            <div className="flex items-start space-x-2">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Risk Assessment:</span>{' '}
                <span className="text-muted-foreground">{deal.risk.reason}</span>
              </div>
            </div>

            <div className="text-right shrink-0 font-mono text-[11px] text-muted-foreground">
              Last touched: <span className="text-foreground font-medium">{deal.lastContactDate}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 border-b border-border pb-0 text-xs">
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'brief'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>30-Sec Pre-Call Brief</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'timeline'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline ({deal.interactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'chat'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask the Deal</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'inspector'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Memory Inspector</span>
            {observations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/20 text-sky-400 font-mono">
                {observations.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'brief' && brief && (
            <PreCallBriefCard
              brief={brief}
              onRefresh={handleRefreshBrief}
              isRefreshing={refreshingBrief}
            />
          )}

          {activeTab === 'timeline' && (
            <DealTimeline interactions={deal.interactions} />
          )}

          {activeTab === 'chat' && (
            <AskTheDealChat dealId={deal.id} dealName={deal.name} />
          )}

          {activeTab === 'inspector' && (
            <MemoryInspector observations={observations} memories={memories} />
          )}
        </div>
      </main>

      {/* Close Deal Modal */}
      <CloseDealModal
        deal={deal}
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        onDealUpdated={(updated) => setDeal(updated)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        deals={allDeals}
      />
    </div>
  );
}
