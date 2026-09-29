'use client';

import React, { useState } from 'react';
import { Interaction } from '@/lib/types';
import { Calendar, User, MessageSquare, Shield, DollarSign, Mail, FileText, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface DealTimelineProps {
  interactions: Interaction[];
}

export const DealTimeline: React.FC<DealTimelineProps> = ({ interactions }) => {
  const [expandedId, setExpandedId] = useState<string | null>(interactions[0]?.id || null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filtered = sortedInteractions.filter((int) => {
    if (typeFilter === 'all') return true;
    return int.type === typeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'security_review':
        return <Shield className="w-3.5 h-3.5 text-amber-400" />;
      case 'pricing_call':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'email_thread':
        return <Mail className="w-3.5 h-3.5 text-sky-400" />;
      case 'crm_note':
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Type Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        {['all', 'discovery_call', 'demo', 'security_review', 'pricing_call', 'email_thread', 'crm_note'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
              typeFilter === t
                ? 'bg-secondary text-foreground border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-border/80 ml-3 pl-6 space-y-6">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-1.5 w-5 h-5 rounded-full bg-card border-2 border-border group-hover:border-sky-500 flex items-center justify-center transition-colors">
                {getIcon(item.type)}
              </div>

              {/* Interaction Card */}
              <div className="p-4 rounded-lg bg-card border border-border shadow-sm hover:border-border/90 transition-colors">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-foreground group-hover:text-sky-400 transition-colors">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono capitalize bg-secondary text-muted-foreground border border-border">
                        {item.context}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-muted-foreground font-mono mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{item.author}</span>
                      </span>
                    </div>
                  </div>

                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Content snippet / expanded body */}
                <div className="mt-3">
                  <div
                    className={`font-mono text-xs leading-relaxed p-3 rounded bg-secondary/30 border border-border/50 whitespace-pre-wrap ${
                      !isExpanded ? 'line-clamp-2 text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.content}
                  </div>
                </div>

                {/* Extracted Entities Bar */}
                {item.extractedEntities && item.extractedEntities.length > 0 && isExpanded && (
                  <div className="mt-3 pt-3 border-t border-border/40 flex items-center space-x-2">
                    <Tag className="w-3 h-3 text-muted-foreground shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {item.extractedEntities.map((entity, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-secondary text-foreground border border-border/70"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
