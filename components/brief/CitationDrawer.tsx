'use client';

import React from 'react';
import { SourceMemory } from '@/lib/types';
import { X, Calendar, User, Database, ShieldCheck, Tag } from 'lucide-react';

interface CitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  source: SourceMemory | null;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({ isOpen, onClose, source }) => {
  if (!isOpen || !source) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border-l border-border h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-mono font-medium rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                SOURCE MEMORY
              </span>
              <span className="text-xs text-muted-foreground font-mono">#{source.id}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Meta Badges */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-2.5 rounded-md bg-secondary/50 border border-border/50 flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">Memory Type</div>
                <div className="text-xs font-medium capitalize">{source.type}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-secondary/50 border border-border/50 flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">Recorded Date</div>
                <div className="text-xs font-medium">
                  {source.timestamp ? new Date(source.timestamp).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-secondary/50 border border-border/50 flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">Author / Source</div>
                <div className="text-xs font-medium truncate">{source.author || 'Interaction Note'}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-secondary/50 border border-border/50 flex items-center space-x-2">
              <Tag className="w-3.5 h-3.5 text-sky-400" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono">Context Label</div>
                <div className="text-xs font-medium truncate capitalize">{source.context || 'General'}</div>
              </div>
            </div>
          </div>

          {/* Exact Grounded Memory Content */}
          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
              Exact Retained Content
            </label>
            <div className="mt-1.5 p-4 rounded-md bg-secondary/30 border border-border font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap selection:bg-sky-500/20">
              {source.text}
            </div>
          </div>

          {/* Linked Entities */}
          {source.entities && source.entities.length > 0 && (
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground uppercase font-mono tracking-wider">
                Extracted Entities & Graph Links
              </label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {source.entities.map((entity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[11px] rounded bg-secondary text-secondary-foreground border border-border/80 font-mono"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Security & Memory Defense Certification */}
          <div className="mt-6 p-3 rounded-md bg-emerald-500/5 border border-emerald-500/20 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="text-[11px] text-emerald-300 leading-tight">
              <span className="font-semibold text-emerald-400">Memory Defense Certified:</span> Scanned for PII and credentials before storage. Grounded fact verified against Hindsight bank directives.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 px-3 text-xs font-medium rounded-md bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-colors text-center"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
