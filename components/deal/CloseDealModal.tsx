'use client';

import React, { useState } from 'react';
import { Deal } from '@/lib/types';
import { Trophy, ThumbsDown, X, Check, Loader2 } from 'lucide-react';

interface CloseDealModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onDealUpdated: (deal: Deal) => void;
}

export const CloseDealModal: React.FC<CloseDealModalProps> = ({ deal, isOpen, onClose, onDealUpdated }) => {
  const [status, setStatus] = useState<'won' | 'lost'>('won');
  const [primaryReason, setPrimaryReason] = useState('');
  const [tactics, setTactics] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryReason || !tactics || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${deal.id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          primaryReason,
          winningOrLosingTactics: tactics,
        }),
      });

      const data = await res.json();
      if (data.deal) {
        onDealUpdated(data.deal);
        onClose();
      }
    } catch (err) {
      console.error('Close deal failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-foreground">Record Deal Outcome & Close</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              LEARNING LOOP
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-muted-foreground uppercase font-mono text-[10px] block mb-1.5 font-semibold">
              Outcome Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('won')}
                className={`py-2.5 px-3 rounded-md border flex items-center justify-center space-x-2 transition-colors ${
                  status === 'won'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Closed Won</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('lost')}
                className={`py-2.5 px-3 rounded-md border flex items-center justify-center space-x-2 transition-colors ${
                  status === 'lost'
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-400 font-semibold'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>Closed Lost</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-muted-foreground uppercase font-mono text-[10px] block mb-1.5 font-semibold">
              Primary Decision Reason
            </label>
            <input
              type="text"
              required
              placeholder={
                status === 'won'
                  ? 'e.g., Superior HIPAA compliance and sub-50ms token routing throughput'
                  : 'e.g., CFO chose competitor ApexCloud bundle due to upfront annual budget constraints'
              }
              value={primaryReason}
              onChange={(e) => setPrimaryReason(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/60 text-xs"
            />
          </div>

          <div>
            <label className="text-muted-foreground uppercase font-mono text-[10px] block mb-1.5 font-semibold">
              {status === 'won' ? 'Winning Tactics & Playbook Used' : 'Tactical Lessons Learned & Missing Capability'}
            </label>
            <textarea
              required
              rows={3}
              placeholder={
                status === 'won'
                  ? 'e.g., Provided a Phased Migration Sandbox with \$15k Solutions Architect credit and exposed ApexCloud egress fees.'
                  : 'e.g., Pushed too hard for 100% upfront annual commitment instead of offering a phased ramp.'
              }
              value={tactics}
              onChange={(e) => setTactics(e.target.value)}
              className="w-full px-3 py-2 bg-secondary/30 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sky-500/60 text-xs resize-none"
            />
          </div>

          <div className="p-3 rounded bg-sky-500/5 border border-sky-500/20 text-[11px] text-sky-300 leading-relaxed">
            <span className="font-semibold text-sky-400">Hindsight Cross-Deal Learning:</span> Retaining this outcome updates the Tactic Recommender and automatically recalculates win-rate statistics across competitor and objection battlecards.
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !primaryReason || !tactics}
              className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center space-x-1.5 disabled:opacity-40 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Retaining Outcome...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Retain into Memory</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
