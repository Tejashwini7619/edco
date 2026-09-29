'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Building2, Flame, ArrowRight, X } from 'lucide-react';
import { Deal } from '@/lib/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, deals }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredDeals = deals.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.company.toLowerCase().includes(query.toLowerCase()) ||
      d.industry.toLowerCase().includes(query.toLowerCase()) ||
      d.owner.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-secondary/20">
          <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search deals, companies, competitors, or reps (e.g. Acme, ApexCloud, Sarah)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none text-foreground font-sans"
          />
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/30">
          {filteredDeals.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching deals found for &quot;{query}&quot;
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <button
                key={deal.id}
                onClick={() => {
                  router.push(`/deals/${deal.id}`);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-secondary/60 text-left transition-colors group"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-7 h-7 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-medium text-foreground group-hover:text-sky-400 transition-colors truncate">
                      {deal.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center space-x-2 mt-0.5">
                      <span>{deal.company}</span>
                      <span>•</span>
                      <span>{deal.stage}</span>
                      <span>•</span>
                      <span className="font-mono text-foreground font-medium">\${deal.value.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {deal.risk.level === 'high' || deal.risk.level === 'critical' ? (
                    <span className="flex items-center text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                      <Flame className="w-3 h-3 mr-1" /> Risk
                    </span>
                  ) : null}
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <div>Hindsight Deal Intelligence Memory Graph</div>
          <div className="flex items-center space-x-2">
            <span>Navigate with J / K</span>
            <span>•</span>
            <span>↵ Select</span>
          </div>
        </div>
      </div>
    </div>
  );
};
