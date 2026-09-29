import { EvaluationEngine } from './engine';

async function main() {
  const args = process.argv.slice(2);
  const isQuick = args.includes('--quick') || args.includes('-q');

  console.log('=====================================================');
  console.log('      DEALMEMORY REPRODUCIBLE EVALUATION HARNESS     ');
  console.log('      Hindsight Memory vs Stateless vs Stuffed       ');
  console.log('=====================================================');
  console.log(`Mode: ${isQuick ? 'QUICK RUN (1 repeat)' : 'FULL BENCHMARK (3 repeats)'}`);

  const engine = new EvaluationEngine();

  try {
    const summary = await engine.executeCompleteEvaluation({
      quick: isQuick,
    });

    console.log('\n-----------------------------------------------------');
    console.log('EXPERIMENT 1: PER-DEAL RECALL RESULTS');
    console.log('-----------------------------------------------------');
    for (const cp of summary.experiment_1.checkpoints) {
      const on = summary.experiment_1.conditions.ON.find((m) => m.checkpoint === cp);
      const off = summary.experiment_1.conditions.OFF.find((m) => m.checkpoint === cp);
      const st = summary.experiment_1.conditions.STUFFED.find((m) => m.checkpoint === cp);

      console.log(
        `Interaction ${cp} | OFF: ${((off?.mean_recall || 0) * 100).toFixed(1)}% | STUFFED: ${((st?.mean_recall || 0) * 100).toFixed(1)}% | ON (Hindsight): ${((on?.mean_recall || 0) * 100).toFixed(1)}% (Citations: ${((on?.mean_citation_rate || 0) * 100).toFixed(0)}%)`
      );
    }

    console.log('\n-----------------------------------------------------');
    console.log('EXPERIMENT 2: CROSS-DEAL TACTIC SCORES (MAX 4)');
    console.log('-----------------------------------------------------');
    for (let i = 0; i < summary.experiment_2.memory_runs.length; i++) {
      const m = summary.experiment_2.memory_runs[i];
      const s = summary.experiment_2.stuffed_runs[i];
      console.log(
        `Closed Deals: ${m.closed_deals_count} | MEMORY_ON: ${m.total_score}/4 | STUFFED: ${s?.total_score || 0}/4 (Prompt Tokens: ${s?.prompt_tokens})`
      );
    }

    console.log('\nEvaluation report written to report.md');
    process.exit(0);
  } catch (error: any) {
    console.error('\n[FATAL EVALUATION ERROR]:', error.message);
    process.exit(1);
  }
}

main();
