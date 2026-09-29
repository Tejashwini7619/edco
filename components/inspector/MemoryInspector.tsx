'use client';

import React, { useState } from 'react';
import { MemoryObservation, SourceMemory } from '@/lib/types';
import { Brain, History, GitCommit, Database, Tag, ShieldCheck, ArrowRight, Eye } from 'lucide-react';
import { CitationDrawer } from '../brief/CitationDrawer';

interface MemoryInspectorProps {
  observations: MemoryObservation[];
  memories?: SourceMemory[];
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({ observations, memories = [] }) => {
  const [activeTab, setActiveTab] = useState<'observations' | 'facts'>('observations');
  const [selectedSource, setSelectedSource] = useState<SourceMemory | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="p-4 rounded-lg bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Hindsight Memory Inspector & Belief Evolution
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Visualizes auto-consolidated observations, evolving beliefs over time, and grounded factual units.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-md bg-secondary border border-border">
          <button
            onClick={() => setActiveTab('observations')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'observations'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Observations ({observations.length})
          </button>
          <button
            onClick={() => setActiveTab('facts')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'facts'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Raw Fact Graph ({memories.length})
          </button>
        </div>
      </div>

      {/* Observations View: Belief Evolution Timeline */}
      {activeTab === 'observations' && (
        <div className="space-y-4">
          {observations.length === 0 ? (
            <div className="p-8 rounded-lg bg-card border border-border text-center text-xs text-muted-foreground">
              No consolidated observations recorded for this scope yet. Ingest more interactions to trigger auto-consolidation.
            </div>
          ) : (
            observations.map((obs) => (
              <div key={obs.id} className="p-4 rounded-lg bg-card border border-border shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-foreground">{obs.topic}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {obs.confidence} Confidence
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {obs.summary}
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                    Tracked {obs.firstObserved} → {obs.lastUpdated}
                  </div>
                </div>

                {/* Evolution Step-by-Step History */}
                <div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground mb-2 flex items-center space-x-1.5 font-semibold">
                    <History className="w-3 h-3 text-sky-400" />
                    <span>How This Belief Evolved Over Time:</span>
                  </div>

                  <div className="relative border-l border-sky-500/30 ml-2 pl-4 space-y-3">
                    {obs.history.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-card" />
                        <div className="p-2.5 rounded-md bg-secondary/30 border border-border/60 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground flex items-center space-x-1.5">
                              <span>{step.state}</span>
                              <span className="text-[10px] font-mono font-normal text-muted-foreground">({step.sourceContext})</span>
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">{step.date}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1 font-mono">
                            Evidence: {step.evidence}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Entity Badges */}
                <div className="pt-2 flex items-center space-x-2">
                  <Tag className="w-3 h-3 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {obs.entities.map((e, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-secondary text-secondary-foreground border border-border"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Raw Facts View */}
      {activeTab === 'facts' && (
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          <div className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Extracted Atomic Memory Facts</span>
            </span>
            <span>{memories.length} Stored Units</span>
          </div>

          <div className="divide-y divide-border/40">
            {memories.map((mem) => (
              <div key={mem.id} className="py-2.5 flex items-start justify-between gap-3 group text-xs">
                <div>
                  <div className="font-mono text-foreground leading-relaxed">{mem.text}</div>
                  <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-mono mt-1">
                    <span className="capitalize">{mem.type}</span>
                    <span>•</span>
                    <span>{mem.context || 'General'}</span>
                    <span>•</span>
                    <span>{mem.timestamp ? new Date(mem.timestamp).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSource(mem);
                    setDrawerOpen(true);
                  }}
                  className="px-2 py-1 text-[10px] rounded bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border flex items-center space-x-1 shrink-0 font-mono transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citation Drawer */}
      <CitationDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        source={selectedSource}
      />
    </div>
  );
};
