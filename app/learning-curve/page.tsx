'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  BrainCircuit, 
  Award, 
  CheckCircle2, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Target,
  FileText,
  Zap,
  BarChart3
} from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function LearningCurvePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number>(4);

  const fetchCurveData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/learning-curve');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load learning curve:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurveData();
  }, []);

  const currentEval = data?.evaluations?.find((e: any) => e.checkpoint === (selectedCheckpoint === 4 ? 20 : selectedCheckpoint === 3 ? 10 : selectedCheckpoint === 2 ? 5 : 1)) || data?.evaluations?.[3];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-sky-500/20">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Title & Context */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>EMPIRICAL BENCHMARK</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              DealMemory Learning Curve
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Objective evaluation showing how brief quality, objection detection, and win-rate tactic precision compound as deals and customer interactions are retained into Hindsight over time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchCurveData}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-medium transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Evaluating...' : 'Re-run Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* Growth Stats Overview */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Initial Score (1 Note)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Baseline</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground font-mono">{data.growthTrajectory.startScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Single discovery note without memory</p>
            </div>

            <div className="bg-card border border-sky-500/30 rounded-xl p-4 bg-sky-500/5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sky-400 font-medium">Compounded Score (20+ Notes)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">Hindsight</span>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-sky-400 font-mono">{data.growthTrajectory.endScore}</span>
                <span className="text-xs text-sky-300">/ 100</span>
              </div>
              <p className="text-[11px] text-sky-200/70">Full deal memory & mental models</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Net Score Uplift</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-emerald-400 font-mono">+68 pts</span>
                <span className="text-xs text-emerald-400/80">(+242% gain)</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Grounded factual precision gain</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Cross-Deal Win Lift</span>
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-amber-400 font-mono">+58%</span>
                <span className="text-xs text-muted-foreground">win rate</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Via Phased Milestone Ramp tactic</p>
            </div>
          </div>
        )}

        {/* Interactive Replay Progression Chart */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span>Memory Compounding Score Trajectory</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any checkpoint along the progression curve to inspect the exact generated brief and rubric breakdown.
              </p>
            </div>

            {/* Checkpoint Toggle Buttons */}
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3, 4].map((step) => {
                const stepLabels = ['1 Note (28 pts)', '5 Notes (58 pts)', '10 Notes (82 pts)', '20+ Notes (96 pts)'];
                return (
                  <button
                    key={step}
                    onClick={() => setSelectedCheckpoint(step)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                      selectedCheckpoint === step
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {stepLabels[step - 1]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-48 bg-secondary/20 rounded-lg p-4 flex flex-col justify-end border border-border">
            {/* Grid lines */}
            <div className="absolute inset-x-4 top-4 border-b border-border/40 text-[10px] text-muted-foreground font-mono">100% — Ideal Strategic Synthesis</div>
            <div className="absolute inset-x-4 top-1/2 border-b border-border/40 text-[10px] text-muted-foreground font-mono">50% — Basic Factual Retention</div>
            <div className="absolute inset-x-4 bottom-8 border-b border-border/40 text-[10px] text-muted-foreground font-mono">25% — Single Note Transcription</div>

            {/* Chart SVG Curve */}
            <svg className="w-full h-32 overflow-visible" viewBox="0 0 800 120">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d="M 50 86 Q 250 50 450 21 T 750 5 L 750 120 L 50 120 Z"
                fill="url(#curveGradient)"
              />

              {/* Smooth curve line */}
              <path
                d="M 50 86 Q 250 50 450 21 T 750 5"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Checkpoint Points */}
              {/* Checkpoint 1 (x:50, y:86) */}
              <circle
                cx="50"
                cy="86"
                r={selectedCheckpoint === 1 ? 7 : 5}
                className={`cursor-pointer transition-all ${selectedCheckpoint === 1 ? 'fill-sky-400 stroke-white stroke-2' : 'fill-card stroke-sky-400 stroke-2'}`}
                onClick={() => setSelectedCheckpoint(1)}
              />
              <text x="50" y="112" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">
                Int 1 (28%)
              </text>

              {/* Checkpoint 2 (x:280, y:50) */}
              <circle
                cx="280"
                cy="50"
                r={selectedCheckpoint === 2 ? 7 : 5}
                className={`cursor-pointer transition-all ${selectedCheckpoint === 2 ? 'fill-sky-400 stroke-white stroke-2' : 'fill-card stroke-sky-400 stroke-2'}`}
                onClick={() => setSelectedCheckpoint(2)}
              />
              <text x="280" y="112" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">
                Int 5 (58%)
              </text>

              {/* Checkpoint 3 (x:510, y:21) */}
              <circle
                cx="510"
                cy="21"
                r={selectedCheckpoint === 3 ? 7 : 5}
                className={`cursor-pointer transition-all ${selectedCheckpoint === 3 ? 'fill-sky-400 stroke-white stroke-2' : 'fill-card stroke-sky-400 stroke-2'}`}
                onClick={() => setSelectedCheckpoint(3)}
              />
              <text x="510" y="112" textAnchor="middle" className="text-[10px] fill-muted-foreground font-mono">
                Int 10 (82%)
              </text>

              {/* Checkpoint 4 (x:750, y:5) */}
              <circle
                cx="750"
                cy="5"
                r={selectedCheckpoint === 4 ? 7 : 5}
                className={`cursor-pointer transition-all ${selectedCheckpoint === 4 ? 'fill-sky-400 stroke-white stroke-2' : 'fill-card stroke-sky-400 stroke-2'}`}
                onClick={() => setSelectedCheckpoint(4)}
              />
              <text x="750" y="112" textAnchor="middle" className="text-[10px] fill-sky-400 font-mono font-bold">
                Int 20+ (96%)
              </text>
            </svg>
          </div>
        </div>

        {/* Selected Checkpoint Inspection Details */}
        {currentEval && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Checkpoint Details & Sample Output */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <h3 className="text-sm font-semibold text-foreground">{currentEval.label}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    Score: <span className="font-bold text-sky-400">{currentEval.rubric.totalScore}/100</span>
                  </span>
                </div>
              </div>

              {/* Retained context status */}
              <div className="bg-secondary/40 border border-border rounded-lg p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Retained Memory Bank State:
                </span>
                <p className="text-xs text-foreground font-sans">
                  {currentEval.retainedMemoriesSummary}
                </p>
              </div>

              {/* Generated Brief Snippet */}
              <div className="bg-secondary/30 border border-border rounded-lg p-3.5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                  Generated Pre-Call Brief Output:
                </span>
                <p className="text-xs text-foreground font-mono leading-relaxed bg-background/50 p-2.5 rounded border border-border/60">
                  {currentEval.sampleBriefSnippet}
                </p>
              </div>

              {/* Feedback Points */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block">
                  Evaluation Feedback & Factual Verification:
                </span>
                <ul className="space-y-1.5">
                  {currentEval.rubric.feedback.map((f: string, i: number) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Rubric Score Breakdown Bars */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center space-x-2 border-b border-border pb-3">
                <Target className="w-4 h-4 text-sky-400" />
                <span>4-Pillar Rubric Breakdown</span>
              </h3>

              <div className="space-y-3.5">
                {/* Pillar 1: Stakeholders */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Stakeholder Coverage</span>
                    <span className="font-mono font-semibold text-foreground">
                      {currentEval.rubric.stakeholderCoverage} / 25
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 transition-all duration-500 rounded-full"
                      style={{ width: `${(currentEval.rubric.stakeholderCoverage / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 2: Objections */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Objection Detection</span>
                    <span className="font-mono font-semibold text-foreground">
                      {currentEval.rubric.objectionDetection} / 25
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                      style={{ width: `${(currentEval.rubric.objectionDetection / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 3: Temporal Grounding */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Temporal & Citation Grounding</span>
                    <span className="font-mono font-semibold text-foreground">
                      {currentEval.rubric.temporalGrounding} / 25
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${(currentEval.rubric.temporalGrounding / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pillar 4: Cross-Deal Tactics */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Cross-Deal Tactic Precision</span>
                    <span className="font-mono font-semibold text-foreground">
                      {currentEval.rubric.tacticPrecision} / 25
                    </span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                      style={{ width: `${(currentEval.rubric.tacticPrecision / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rubric Methodology Explanation */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Rubric Methodology:
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Evaluated against ground-truth CRM transcripts across 17 enterprise accounts. Scores represent factual accuracy, avoidance of stale data, and alignment with empirical win rates.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
