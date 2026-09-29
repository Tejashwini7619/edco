'use client';

import React from 'react';
import { Deal } from '@/lib/types';
import { DollarSign, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  deals: Deal[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ deals }) => {
  const activeDeals = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const totalPipeline = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const atRiskCount = activeDeals.filter((d) => d.risk.level === 'high' || d.risk.level === 'critical').length;
  const wonCount = deals.filter((d) => d.stage === 'Closed Won').length;
  const totalWonValue = deals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Active Pipeline */}
      <div className="p-3.5 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
          <span>Active Pipeline</span>
          <DollarSign className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <div className="text-xl font-bold font-mono text-foreground mt-1.5">
          \${(totalPipeline / 1000).toFixed(0)}k
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {activeDeals.length} active enterprise deals
        </div>
      </div>

      {/* Memory Risk Alert */}
      <div className="p-3.5 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
          <span>Memory Risk Signals</span>
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-xl font-bold font-mono text-amber-400 mt-1.5">
          {atRiskCount} Deals
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          Blockers or competitor FUD flagged
        </div>
      </div>

      {/* Closed Won */}
      <div className="p-3.5 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
          <span>Closed Won ARR</span>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-xl font-bold font-mono text-emerald-400 mt-1.5">
          \${(totalWonValue / 1000).toFixed(0)}k
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          {wonCount} verified customer wins
        </div>
      </div>

      {/* Cross-Deal Intelligence */}
      <div className="p-3.5 rounded-lg bg-card border border-border">
        <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
          <span>Memory Bank Intelligence</span>
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        </div>
        <div className="text-xl font-bold font-mono text-foreground mt-1.5">
          3 Playbooks
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5">
          86% win rate on phased migration
        </div>
      </div>
    </div>
  );
};
