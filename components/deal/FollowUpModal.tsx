'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2,
  Clock,
  ListTodo
} from 'lucide-react';

interface FollowUpModalProps {
  dealId: string;
  dealName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  dealId,
  dealName,
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('executive');
  const [customNotes, setCustomNotes] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${dealId}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone, customNotes })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedEmail(data.email);
      }
    } catch (err) {
      console.error('Failed to generate follow-up:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedEmail) return;
    const text = `Subject: ${generatedEmail.subject}\nTo: ${generatedEmail.recipient}\n\n${generatedEmail.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center space-x-2">
                <span>Memory-Grounded Follow-Up Drafter</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Hindsight Powered
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">{dealName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!generatedEmail ? (
          /* Input Configuration */
          <div className="space-y-4">
            <div className="bg-secondary/40 border border-border rounded-lg p-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1.5 text-sky-400 font-medium mb-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Automatic Context Injection</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                DealMemory will scan all past commitments, timeline notes, and pricing discussions to craft an email addressing open objections and promised deliverables.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Email Tone & Style</label>
              <div className="grid grid-cols-3 gap-2">
                {['executive', 'collaborative', 'urgent'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`text-xs py-2 px-3 rounded-lg border capitalize transition-all ${
                      tone === t
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 font-medium'
                        : 'bg-secondary/50 border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Additional Notes or Specific Next Steps (Optional)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Include the updated Azure VNet diagram and confirm Thursday 2pm EST for Evelyn."
                rows={3}
                className="w-full bg-secondary/50 border border-border rounded-lg p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-xs font-medium text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Drafting from Memory...' : 'Generate Follow-Up Email'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Email Preview */
          <div className="space-y-4">
            <div className="bg-secondary/30 border border-border rounded-lg p-4 space-y-3">
              <div className="border-b border-border/60 pb-2 space-y-1">
                <div className="text-xs flex items-center space-x-2">
                  <span className="text-muted-foreground font-mono text-[11px] w-14">Subject:</span>
                  <span className="font-semibold text-foreground">{generatedEmail.subject}</span>
                </div>
                <div className="text-xs flex items-center space-x-2">
                  <span className="text-muted-foreground font-mono text-[11px] w-14">To:</span>
                  <span className="text-sky-400 font-mono text-[11px]">{generatedEmail.recipient}</span>
                </div>
              </div>

              <div className="text-xs font-sans text-foreground leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto pr-2">
                {generatedEmail.body}
              </div>
            </div>

            {/* Referenced Promises & Action Items */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-secondary/40 border border-border rounded-lg p-2.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1">
                  <BrainCircuit className="w-3 h-3" />
                  <span>Remembered Promises</span>
                </span>
                <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                  {generatedEmail.promisesReferenced?.map((p: string, i: number) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-sky-400">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary/40 border border-border rounded-lg p-2.5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                  <ListTodo className="w-3 h-3" />
                  <span>Action Items</span>
                </span>
                <ul className="space-y-0.5 text-[11px] text-muted-foreground">
                  {generatedEmail.actionItems?.map((a: string, i: number) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={() => setGeneratedEmail(null)}
                className="text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                ← Back to Edit
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-xs font-medium text-foreground transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
