'use client';

import React from 'react';
import { DealRiskLevel } from '@/lib/types';
import { AlertCircle, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

interface DealRiskBadgeProps {
  level: DealRiskLevel;
  score: number;
  reason?: string;
  showScore?: boolean;
}

export const DealRiskBadge: React.FC<DealRiskBadgeProps> = ({ level, score, reason, showScore = true }) => {
  const config = {
    low: {
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      icon: CheckCircle2,
      label: 'Low Risk',
    },
    medium: {
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      icon: AlertTriangle,
      label: 'Medium Risk',
    },
    high: {
      bg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
      icon: AlertCircle,
      label: 'High Risk',
    },
    critical: {
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      icon: Flame,
      label: 'Critical Risk',
    },
  }[level] || {
    bg: 'bg-secondary border-border text-muted-foreground',
    icon: AlertCircle,
    label: level,
  };

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${config.bg} cursor-help`}
      title={reason || `${config.label} (Risk score: ${score}/100)`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
      {showScore && <span className="opacity-70">({score})</span>}
    </div>
  );
};
