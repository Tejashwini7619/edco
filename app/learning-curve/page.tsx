'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BrainCircuit,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Target,
  FileText,
  Zap,
  BarChart3,
  Layers,
  X,
  ShieldCheck,
  Cpu,
  Clock,
  ExternalLink,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { EvaluationRunSummary, AggregatedCheckpointMetric, CheckpointRunResult } from '@/eval/types';

export default function LearningCurvePage() {
  const [evalData, setEvalData] = useState<EvaluationRunSummary | null>(null);
  const [hasResults, setHasResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runningEval, setRunningEval] = useState(false);
  const [evalProgressMsg, setEvalProgressMsg] = useState('');

  // Audit Drawer State
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedAuditCondition, setSelectedAuditCondition] = useState<'ON' | 'OFF' | 'STUFFED'>('ON');
  const [selectedAuditCheckpoint, setSelectedAuditCheckpoint] = useState<number>(1);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/learning-curve');
      const json = await res.json();
      if (json.success && json.hasResults && json.data) {
        setEvalData(json.data);
        setHasResults(true);
        if (json.data.experiment_1?.checkpoints?.length > 0) {
          setSelectedAuditCheckpoint(json.data.experiment_1.checkpoints[json.data.experiment_1.checkpoints.length - 1]);
        }
      } else {
        setHasResults(false);
      }
    } catch (err) {
      console.error('Failed to load learning curve results:', err);
      setHasResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEvaluation = async (quick = true) => {
    setRunningEval(true);
    setEvalProgressMsg(`Starting ${quick ? 'quick' : 'full'} evaluation across Hindsight and LLM...`);
    try {
      const res = await fetch('/api/learning-curve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quick }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setEvalData(json.data);
        setHasResults(true);
      }
    } catch (err) {
      console.error('Evaluation run failed:', err);
    } finally {
      setRunningEval(false);
      setEvalProgressMsg('');
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const exp1 = evalData?.experiment_1;
  const exp2 = evalData?.experiment_2;

  // Selected audit data point
  const selectedMetric = exp1?.conditions[selectedAuditCondition]?.find(
    (m) => m.checkpoint === selectedAuditCheckpoint
  );
  const selectedRun: CheckpointRunResult | undefined = selectedMetric?.runs?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-sky-500/20">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header & Meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>EMPIRICAL BENCHMARK (REAL RUNS ONLY)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              DealMemory Learning Curve & Audit Harness
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Measures how much Hindsight memory improves recall accuracy, eliminates hallucinations, and unlocks cross-deal intelligence compared to Stateless and Context-Stuffed baselines.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleRunEvaluation(true)}
              disabled={runningEval}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${runningEval ? 'animate-spin' : ''}`} />
              <span>{runningEval ? 'Evaluating...' : 'Re-run Evaluation'}</span>
            </button>
          </div>
        </div>

        {/* Running Progress Banner */}
        {runningEval && (
          <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-xl flex items-center space-x-3 animate-pulse">
            <Cpu className="w-5 h-5 text-sky-400 animate-spin" />
            <div className="text-xs">
              <span className="font-semibold text-foreground">Live Evaluation Running: </span>
              <span className="text-sky-300 font-mono">{evalProgressMsg}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasResults && !runningEval && (
          <div className="p-12 text-center bg-card border border-border rounded-xl space-y-4 max-w-xl mx-auto my-12">
            <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border flex items-center justify-center mx-auto text-muted-foreground">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No Evaluation Runs Found</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                DealMemory enforces zero placeholder curves. Run the reproducible evaluation harness to generate real empirical benchmark numbers.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleRunEvaluation(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Run Quick Evaluation (1 repeat)
              </button>
              <code className="text-[11px] font-mono px-3 py-2 rounded bg-secondary text-muted-foreground border border-border">
                npm run eval
              </code>
            </div>
          </div>
        )}

        {/* Results Presentation */}
        {hasResults && evalData && (
          <>
            {/* Stat Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-card border border-border rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Peak Recall</span>
                <div className="text-lg font-bold font-mono text-sky-400">
                  {((exp1?.conditions.ON[exp1.conditions.ON.length - 1]?.mean_recall || 0) * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-muted-foreground">Hindsight ON (Int 6)</span>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Stateless Recall</span>
                <div className="text-lg font-bold font-mono text-zinc-400">
                  {((exp1?.conditions.OFF[exp1.conditions.OFF.length - 1]?.mean_recall || 0) * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-muted-foreground">Memory OFF (Int 6)</span>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Citation Rate</span>
                <div className="text-lg font-bold font-mono text-emerald-400">
                  {((exp1?.conditions.ON[exp1.conditions.ON.length - 1]?.mean_citation_rate || 0) * 100).toFixed(0)}%
                </div>
                <span className="text-[10px] text-muted-foreground">Verified Sources (ON)</span>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Hallucinations</span>
                <div className="text-lg font-bold font-mono text-foreground">
                  {exp1?.conditions.ON[exp1.conditions.ON.length - 1]?.mean_hallucinations || 0}
                </div>
                <span className="text-[10px] text-muted-foreground">Claims Contradicting</span>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Judge Agreement</span>
                <div className="text-lg font-bold font-mono text-amber-400">
                  {evalData.human_agreement_pct}%
                </div>
                <span className="text-[10px] text-muted-foreground">Human Validated</span>
              </div>

              <div className="bg-card border border-border rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">Run Duration</span>
                <div className="text-lg font-bold font-mono text-foreground">
                  {evalData.duration_seconds}s
                </div>
                <span className="text-[10px] text-muted-foreground font-mono truncate block" title={evalData.generator_model}>
                  {evalData.generator_model.split('/')[1] || evalData.generator_model}
                </span>
              </div>
            </div>

            {/* Experiment 1: Multi-Line Learning Curve Chart */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-sky-400" />
                    <span>Experiment 1: Recall Score vs. Interaction Checkpoint</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Account: <span className="text-foreground font-medium">{exp1?.deal_name}</span>. Ground truth: 18 frozen checklist facts. Click any point to open the Audit Drawer.
                  </p>
                </div>

                {/* Direct Line Legend */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                  <div className="flex items-center space-x-1.5 text-sky-400">
                    <span className="w-3 h-3 rounded bg-sky-400" />
                    <span>Memory ON (Hindsight)</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-indigo-400">
                    <span className="w-3 h-3 rounded bg-indigo-400" />
                    <span>Context STUFFED</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-zinc-400">
                    <span className="w-3 h-3 rounded bg-zinc-400" />
                    <span>Memory OFF (Stateless)</span>
                  </div>
                </div>
              </div>

              {/* Custom Scaled SVG Multi-Line Chart */}
              <div className="relative w-full h-64 bg-secondary/20 rounded-lg p-4 flex flex-col justify-end border border-border">
                {/* Y-Axis Gridlines */}
                <div className="absolute inset-x-4 top-4 border-b border-border/40 text-[10px] text-muted-foreground font-mono">100% — Full Factual Coverage</div>
                <div className="absolute inset-x-4 top-1/2 border-b border-border/40 text-[10px] text-muted-foreground font-mono">50% — Partial Retrieval</div>
                <div className="absolute inset-x-4 bottom-8 border-b border-border/40 text-[10px] text-muted-foreground font-mono">0% — Zero Recall</div>

                <svg className="w-full h-48 overflow-visible" viewBox="0 0 900 160">
                  <defs>
                    <linearGradient id="onGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Generate Path Coordinates for Checkpoints 1..6 */}
                  {(() => {
                    const cps = exp1?.checkpoints || [1, 2, 3, 4, 5, 6];
                    const getX = (idx: number) => 60 + idx * ((800 - 60) / Math.max(1, cps.length - 1));
                    const getY = (val: number) => 140 - Math.min(1, Math.max(0, val)) * 120;

                    const onPoints = (exp1?.conditions.ON || []).map((m, idx) => ({
                      x: getX(idx),
                      y: getY(m.mean_recall),
                      val: m.mean_recall,
                      cp: m.checkpoint,
                    }));

                    const stuffedPoints = (exp1?.conditions.STUFFED || []).map((m, idx) => ({
                      x: getX(idx),
                      y: getY(m.mean_recall),
                      val: m.mean_recall,
                      cp: m.checkpoint,
                    }));

                    const offPoints = (exp1?.conditions.OFF || []).map((m, idx) => ({
                      x: getX(idx),
                      y: getY(m.mean_recall),
                      val: m.mean_recall,
                      cp: m.checkpoint,
                    }));

                    const buildPath = (pts: Array<{ x: number; y: number }>) =>
                      pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                    return (
                      <>
                        {/* ON Area Fill */}
                        {onPoints.length > 0 && (
                          <path
                            d={`${buildPath(onPoints)} L ${onPoints[onPoints.length - 1].x} 140 L ${onPoints[0].x} 140 Z`}
                            fill="url(#onGradient)"
                          />
                        )}

                        {/* OFF Line (Zinc) */}
                        <path d={buildPath(offPoints)} fill="none" stroke="#71717a" strokeWidth="2.5" strokeDasharray="4 4" />

                        {/* STUFFED Line (Indigo) */}
                        <path d={buildPath(stuffedPoints)} fill="none" stroke="#818cf8" strokeWidth="2.5" />

                        {/* ON Line (Sky Blue) */}
                        <path d={buildPath(onPoints)} fill="none" stroke="#38bdf8" strokeWidth="3.5" />

                        {/* Data Points - ON */}
                        {onPoints.map((p, i) => (
                          <g key={`on-${i}`}>
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={selectedAuditCheckpoint === p.cp && selectedAuditCondition === 'ON' ? 7 : 5}
                              className="cursor-pointer fill-card stroke-sky-400 stroke-2 hover:r-7 transition-all"
                              onClick={() => {
                                setSelectedAuditCondition('ON');
                                setSelectedAuditCheckpoint(p.cp);
                                setAuditOpen(true);
                              }}
                            />
                            <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] fill-sky-400 font-mono font-bold">
                              {(p.val * 100).toFixed(0)}%
                            </text>
                            <text x={p.x} y="156" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">
                              Int {p.cp}
                            </text>
                          </g>
                        ))}

                        {/* Data Points - STUFFED */}
                        {stuffedPoints.map((p, i) => (
                          <circle
                            key={`st-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={selectedAuditCheckpoint === p.cp && selectedAuditCondition === 'STUFFED' ? 6 : 4}
                            className="cursor-pointer fill-card stroke-indigo-400 stroke-2 hover:r-6 transition-all"
                            onClick={() => {
                              setSelectedAuditCondition('STUFFED');
                              setSelectedAuditCheckpoint(p.cp);
                              setAuditOpen(true);
                            }}
                          />
                        ))}

                        {/* Data Points - OFF */}
                        {offPoints.map((p, i) => (
                          <circle
                            key={`off-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r={selectedAuditCheckpoint === p.cp && selectedAuditCondition === 'OFF' ? 6 : 4}
                            className="cursor-pointer fill-card stroke-zinc-500 stroke-2 hover:r-6 transition-all"
                            onClick={() => {
                              setSelectedAuditCondition('OFF');
                              setSelectedAuditCheckpoint(p.cp);
                              setAuditOpen(true);
                            }}
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Checkpoint Quick Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Click checkpoint to inspect:</span>
                  {(exp1?.checkpoints || []).map((cp) => (
                    <button
                      key={cp}
                      onClick={() => {
                        setSelectedAuditCheckpoint(cp);
                        setAuditOpen(true);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                        selectedAuditCheckpoint === cp
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                          : 'bg-secondary/40 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      Int {cp}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setAuditOpen(true)}
                  className="flex items-center space-x-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  <span>Open Audit Drawer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Experiment 2: Cross-Deal Learning Chart */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Experiment 2: Cross-Deal Tactic Score vs. Closed Deals in Memory</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Query: <span className="text-foreground italic font-sans">"{exp2?.scenario}"</span> (Max score: 4/4)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {(exp2?.memory_runs || []).map((memRun, idx) => {
                  const stuffedRun = exp2?.stuffed_runs[idx];
                  return (
                    <div
                      key={idx}
                      className="bg-secondary/30 border border-border rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {memRun.closed_deals_count} Closed Deals
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {memRun.total_score} / 4 pts
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Recommends Security:</span>
                          <span className={memRun.recommends_security ? 'text-emerald-400' : 'text-zinc-500'}>
                            {memRun.recommends_security ? '✓ Yes (+1)' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Empirical Win/Loss Ratio:</span>
                          <span className={memRun.cites_win_loss_ratio ? 'text-emerald-400' : 'text-zinc-500'}>
                            {memRun.cites_win_loss_ratio ? '✓ 4 of 5 (+1)' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Warns vs Discounting:</span>
                          <span className={memRun.warns_against_discounting ? 'text-emerald-400' : 'text-zinc-500'}>
                            {memRun.warns_against_discounting ? '✓ Yes (+1)' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Cites Past Deal IDs:</span>
                          <span className={memRun.cites_valid_deal_ids ? 'text-emerald-400' : 'text-zinc-500'}>
                            {memRun.cites_valid_deal_ids ? `✓ (${memRun.cited_deal_ids.length}) (+1)` : '✗ No'}
                          </span>
                        </div>
                      </div>

                      {/* Stuffed Context Limit Callout */}
                      <div className="pt-2 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
                        <span>Stuffed Tokens:</span>
                        <span className={stuffedRun?.fits_in_context ? 'text-foreground' : 'text-red-400 font-bold'}>
                          {stuffedRun?.prompt_tokens.toLocaleString()} tok {stuffedRun?.fits_in_context ? '' : '⚠️ LIMIT'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* AUDIT DRAWER MODAL */}
      {auditOpen && selectedMetric && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card border-l border-border max-w-2xl w-full h-full p-6 flex flex-col space-y-5 overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                    Audit Inspection
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary text-foreground font-mono">
                    Checkpoint {selectedAuditCheckpoint} ({selectedAuditCondition})
                  </span>
                </div>
                <h2 className="text-base font-bold text-foreground mt-1">
                  Ground Truth Checklist & Evidence Audit
                </h2>
              </div>
              <button
                onClick={() => setAuditOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Condition Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {(['ON', 'STUFFED', 'OFF'] as const).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedAuditCondition(cond)}
                  className={`text-xs py-2 px-3 rounded-lg border font-mono transition-all ${
                    selectedAuditCondition === cond
                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 font-bold'
                      : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cond === 'ON' ? 'Hindsight ON' : cond === 'STUFFED' ? 'Context STUFFED' : 'Memory OFF'}
                </button>
              ))}
            </div>

            {/* Metric Summary */}
            <div className="bg-secondary/30 border border-border rounded-lg p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] font-mono">RECALL SCORE</span>
                <span className="text-base font-bold font-mono text-sky-400">
                  {(selectedMetric.mean_recall * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-mono">FACTS FOUND</span>
                <span className="text-base font-bold font-mono text-foreground">
                  {selectedRun?.present_accurate_count} / {selectedMetric.knowable_items_count}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-mono">HALLUCINATIONS</span>
                <span className="text-base font-bold font-mono text-foreground">
                  {selectedMetric.mean_hallucinations}
                </span>
              </div>
            </div>

            {/* Fact-by-Fact Checklist Decisions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Knowable Checklist Facts ({selectedMetric.knowable_items_count} total):
              </h3>

              <div className="space-y-2.5">
                {selectedRun?.judgements?.map((j, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                      j.present && j.accurate
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                        : 'bg-destructive/5 border-destructive/20 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2">
                        {j.present && j.accurate ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="text-[10px] font-mono uppercase px-1 py-0.2 rounded bg-secondary text-muted-foreground mr-1.5">
                            {j.category}
                          </span>
                          <span className="font-medium text-foreground">{j.fact}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {j.present && j.accurate ? 'FOUND' : 'MISSED'}
                      </span>
                    </div>

                    {/* Quoted Evidence from Brief */}
                    {j.quote && (
                      <div className="ml-6 p-2 rounded bg-background/60 border border-border/60 text-[11px] font-mono text-sky-300">
                        <span className="text-muted-foreground text-[10px] block mb-0.5 font-sans">Quoted Evidence:</span>
                        "{j.quote}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Raw Generated Brief */}
            {selectedRun?.raw_brief && (
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  Raw Generated Brief Output:
                </span>
                <div className="p-3.5 bg-secondary/40 border border-border rounded-lg text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                  {selectedRun.raw_brief}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
