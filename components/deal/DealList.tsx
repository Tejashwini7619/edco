'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Deal, DealStage } from '@/lib/types';
import { DealRiskBadge } from './DealRiskBadge';
import { ArrowUpRight, Search, Building2, User, Clock, ChevronRight } from 'lucide-react';

interface DealListProps {
  deals: Deal[];
}

export const DealList: React.FC<DealListProps> = ({ deals }) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();

  const stages: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Deals' },
    { id: 'active', label: 'Active Pipeline' },
    { id: 'Negotiation', label: 'Negotiation' },
    { id: 'Security Review', label: 'Security Review' },
    { id: 'Closed Won', label: 'Closed Won' },
    { id: 'Closed Lost', label: 'Closed Lost' },
  ];

  const filteredDeals = deals.filter((deal) => {
    if (selectedStage === 'active') {
      if (deal.stage === 'Closed Won' || deal.stage === 'Closed Lost') return false;
    } else if (selectedStage !== 'all') {
      if (deal.stage !== selectedStage) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      deal.name.toLowerCase().includes(q) ||
      deal.company.toLowerCase().includes(q) ||
      deal.owner.toLowerCase().includes(q) ||
      deal.industry.toLowerCase().includes(q) ||
      deal.competitors.some((c) => c.toLowerCase().includes(q))
    );
  });

  // Keyboard navigation support: J/K to navigate, Enter to view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, Math.max(0, filteredDeals.length - 1)));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (filteredDeals[selectedIndex]) {
          router.push(`/deals/${filteredDeals[selectedIndex].id}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredDeals, selectedIndex, router]);

  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        {/* Stage Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => {
                setSelectedStage(stage.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap font-medium ${
                selectedStage === stage.id
                  ? 'bg-secondary text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter list..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full pl-8 pr-3 py-1 bg-card border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/50"
          />
        </div>
      </div>

      {/* Dense Deals Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Deal & Account</th>
                <th className="py-2.5 px-3 font-semibold">Stage</th>
                <th className="py-2.5 px-3 font-semibold">ARR Value</th>
                <th className="py-2.5 px-3 font-semibold">Memory Risk Signal</th>
                <th className="py-2.5 px-3 font-semibold">Next Step</th>
                <th className="py-2.5 px-3 font-semibold">Competitors</th>
                <th className="py-2.5 px-4 font-semibold text-right">Last Touched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-sans">
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No deals match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((deal, index) => {
                  const isSelected = selectedIndex === index;

                  return (
                    <tr
                      key={deal.id}
                      onClick={() => router.push(`/deals/${deal.id}`)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected ? 'bg-sky-500/5 hover:bg-sky-500/10' : 'hover:bg-secondary/40'
                      }`}
                    >
                      {/* Deal & Account */}
                      <td className="py-3 px-4">
                        <div className="flex items-start space-x-2.5">
                          <div className="mt-0.5 w-6 h-6 rounded bg-secondary flex items-center justify-center shrink-0 border border-border/60">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-sky-400 transition-colors" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground group-hover:text-sky-400 transition-colors flex items-center space-x-1.5">
                              <span>{deal.name}</span>
                              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-sky-400" />
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center space-x-2">
                              <span>{deal.company}</span>
                              <span>•</span>
                              <span>{deal.industry}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <User className="w-2.5 h-2.5 text-muted-foreground" />
                                <span>{deal.owner}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                          deal.stage === 'Closed Won'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : deal.stage === 'Closed Lost'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-secondary text-foreground border border-border'
                        }`}>
                          {deal.stage}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono font-medium text-foreground">
                        \${deal.value.toLocaleString()}
                      </td>

                      {/* Risk Signal derived from memory */}
                      <td className="py-3 px-3">
                        <DealRiskBadge
                          level={deal.risk.level}
                          score={deal.risk.score}
                          reason={deal.risk.reason}
                        />
                      </td>

                      {/* Next Step */}
                      <td className="py-3 px-3 max-w-xs truncate text-[11px] text-muted-foreground">
                        {deal.nextStep}
                      </td>

                      {/* Competitors */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {deal.competitors.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {deal.competitors.map((comp, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-secondary text-secondary-foreground border border-border/80"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">None</span>
                        )}
                      </td>

                      {/* Last Touched */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        <span className="flex items-center justify-end space-x-1">
                          <Clock className="w-3 h-3 opacity-60" />
                          <span>{deal.lastContactDate}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Keyboard Help */}
        <div className="py-2 px-4 border-t border-border bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground font-mono">{filteredDeals.length}</span> of{' '}
            <span className="font-mono">{deals.length}</span> deals
          </div>
          <div className="hidden sm:flex items-center space-x-3 font-mono text-[10px]">
            <span>Press <kbd className="px-1 py-0.2 bg-card border border-border rounded text-foreground">J</kbd> / <kbd className="px-1 py-0.2 bg-card border border-border rounded text-foreground">K</kbd> to move</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.2 bg-card border border-border rounded text-foreground">↵</kbd> to open deal memory</span>
          </div>
        </div>
      </div>
    </div>
  );
};
