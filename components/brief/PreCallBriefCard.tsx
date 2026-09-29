'use client';

import React, { useState } from 'react';
import { PreCallBrief, SourceMemory } from '@/lib/types';
import { CitationChip } from './CitationChip';
import { CitationDrawer } from './CitationDrawer';
import {
  Sparkles,
  ShieldAlert,
  Users,
  Swords,
  DollarSign,
  MessageSquareQuote,
  HelpCircle,
  Share2,
  CheckCircle2,
  RefreshCw,
  Clock
} from 'lucide-react';

interface PreCallBriefCardProps {
  brief: PreCallBrief;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const PreCallBriefCard: React.FC<PreCallBriefCardProps> = ({ brief, onRefresh, isRefreshing }) => {
  const [selectedSource, setSelectedSource] = useState<SourceMemory | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCitationClick = (citationId: string) => {
    const memory = brief.citations[citationId];
    if (memory) {
      setSelectedSource(memory);
      setDrawerOpen(true);
    }
  };

  const handleShareTeams = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(
      `${window.location.origin}/api/integrations/teams?dealId=${brief.dealId}`
    );
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              30-Second Pre-Call Executive Brief
            </h2>
            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              REFLECT() GROUNDED
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Synthesized across {Object.keys(brief.citations).length} verified interaction memories with zero speculation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-2.5 py-1 text-xs rounded-md bg-secondary hover:bg-secondary/80 text-foreground border border-border flex items-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
              <span>{isRefreshing ? 'Reflecting...' : 'Regenerate'}</span>
            </button>
          )}

          <button
            onClick={handleShareTeams}
            className="px-2.5 py-1 text-xs rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center space-x-1.5 transition-colors"
            title="Export Adaptive Card payload for Microsoft Teams"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? 'Copied Teams JSON!' : 'Share to Teams'}</span>
          </button>
        </div>
      </div>

      {/* 1. Where the Deal Stands (3 concise lines) */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-muted-foreground mb-2.5 font-semibold">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span>Where the Deal Stands</span>
        </div>
        <ul className="space-y-2 text-xs leading-relaxed text-foreground">
          {brief.whereItStands.map((line, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-sky-400 font-mono text-[10px] mt-0.5">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2-Column Grid: Objections & Stakeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Open Objections & Status */}
        <div className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase text-muted-foreground mb-3 font-semibold">
              <span className="flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Objections & Resolution</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                {brief.openObjections.filter((o) => !o.resolved).length} Open
              </span>
            </div>

            <div className="space-y-3">
              {brief.openObjections.map((obj) => (
                <div key={obj.id} className="p-3 rounded-md bg-secondary/30 border border-border/70 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-foreground">
                      {obj.objection}
                      {obj.citationId && (
                        <CitationChip
                          id={obj.citationId}
                          source={brief.citations[obj.citationId]}
                          onClick={() => handleCitationClick(obj.citationId!)}
                        />
                      )}
                    </div>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono shrink-0 ${
                      obj.resolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {obj.resolved ? 'Resolved' : 'Active'}
                    </span>
                  </div>

                  {obj.resolutionStrategy && (
                    <div className="mt-2 text-[11px] text-muted-foreground bg-secondary/40 p-2 rounded border border-border/40">
                      <span className="font-semibold text-foreground">Resolution Tactic:</span> {obj.resolutionStrategy}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stakeholder Map & Sentiment */}
        <div className="p-4 rounded-lg bg-card border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase text-muted-foreground mb-3 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Stakeholder Matrix</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                {brief.stakeholderMap.length} Tracked
              </span>
            </div>

            <div className="space-y-2.5">
              {brief.stakeholderMap.map((person, idx) => (
                <div key={idx} className="p-2.5 rounded-md bg-secondary/30 border border-border/70 flex items-start justify-between text-xs">
                  <div>
                    <div className="font-medium text-foreground flex items-center space-x-1.5">
                      <span>{person.name}</span>
                      <span className="text-muted-foreground font-normal">({person.role})</span>
                      {person.citationId && (
                        <CitationChip
                          id={person.citationId}
                          source={brief.citations[person.citationId]}
                          onClick={() => handleCitationClick(person.citationId!)}
                        />
                      )}
                    </div>
                    {person.notes && (
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {person.notes}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${
                      person.sentiment === 'Champion'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : person.sentiment === 'Blocker'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : person.sentiment === 'Skeptical'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-secondary text-muted-foreground border border-border'
                    }`}>
                      {person.sentiment}
                    </span>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                      Touched {person.lastContact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Competitor Mentions & Pricing History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Competitors Mentioned */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center space-x-1.5 text-xs font-mono uppercase text-muted-foreground mb-3 font-semibold">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>Competitor Mentions & FUD</span>
          </div>

          <div className="space-y-2.5">
            {brief.competitorsMentioned.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-md bg-secondary/30 border border-border/70 text-xs">
                <div className="font-semibold text-foreground flex items-center justify-between">
                  <span>{comp.competitor}</span>
                  {comp.citationId && (
                    <CitationChip
                      id={comp.citationId}
                      source={brief.citations[comp.citationId]}
                      onClick={() => handleCitationClick(comp.citationId!)}
                    />
                  )}
                </div>
                <div className="text-muted-foreground mt-1 text-[11px]">
                  <span className="font-medium text-foreground">Claims:</span> {comp.claims}
                </div>
                {comp.weaknessIdentified && (
                  <div className="text-emerald-400/90 mt-1 text-[11px] bg-emerald-500/5 p-1.5 rounded border border-emerald-500/15">
                    <span className="font-semibold text-emerald-400">Attack Vector:</span> {comp.weaknessIdentified}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing History */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center space-x-1.5 text-xs font-mono uppercase text-muted-foreground mb-3 font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pricing History & Quotations</span>
          </div>

          <div className="space-y-2.5">
            {brief.pricingHistory.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-md bg-secondary/30 border border-border/70 text-xs flex items-start justify-between">
                <div>
                  <div className="font-mono font-semibold text-foreground flex items-center space-x-1.5">
                    <span>{item.amount}</span>
                    <span className="text-[11px] text-muted-foreground font-sans font-normal">({item.tierOrTerms})</span>
                    {item.citationId && (
                      <CitationChip
                        id={item.citationId}
                        source={brief.citations[item.citationId]}
                        onClick={() => handleCitationClick(item.citationId!)}
                      />
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {item.reaction}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Talk Track & 3 Strategic Questions */}
      <div className="p-4 rounded-lg bg-sky-500/5 border border-sky-500/20">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase text-sky-400 mb-2 font-semibold">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>Recommended Talk Track</span>
        </div>
        <p className="text-xs leading-relaxed text-foreground/90 font-medium">
          {brief.recommendedTalkTrack}
        </p>

        <div className="mt-4 pt-3 border-t border-sky-500/20">
          <div className="flex items-center space-x-1.5 text-xs font-mono uppercase text-sky-400 mb-2 font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3 Strategic Questions to Ask on This Call</span>
          </div>
          <div className="space-y-1.5">
            {brief.suggestedQuestions.map((q, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-foreground">
                <span className="font-mono text-[10px] text-sky-400 font-bold mt-0.5">Q{idx + 1}:</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citation Drawer Modal */}
      <CitationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        source={selectedSource}
      />
    </div>
  );
};
