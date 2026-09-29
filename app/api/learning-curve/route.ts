import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { EvaluationEngine } from '@/eval/engine';

export async function GET(req: NextRequest) {
  try {
    const runsDir = path.join(process.cwd(), 'eval', 'runs');
    const latestPath = path.join(runsDir, 'latest.json');

    if (fs.existsSync(latestPath)) {
      const content = fs.readFileSync(latestPath, 'utf8');
      const data = JSON.parse(content);
      return NextResponse.json({
        success: true,
        hasResults: true,
        data,
      });
    }

    // Check if any run-* directories exist
    if (fs.existsSync(runsDir)) {
      const runFolders = fs
        .readdirSync(runsDir)
        .filter((f) => f.startsWith('run-') && fs.statSync(path.join(runsDir, f)).isDirectory())
        .sort()
        .reverse();

      if (runFolders.length > 0) {
        const runJson = path.join(runsDir, runFolders[0], 'results.json');
        if (fs.existsSync(runJson)) {
          const content = fs.readFileSync(runJson, 'utf8');
          const data = JSON.parse(content);
          return NextResponse.json({
            success: true,
            hasResults: true,
            data,
          });
        }
      }
    }

    // No run yet
    return NextResponse.json({
      success: true,
      hasResults: false,
      message: 'No evaluation runs found. Execute `npm run eval` in terminal or click "Run Evaluation".',
    });
  } catch (error: any) {
    console.error('Learning Curve API GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const quick = body.quick !== undefined ? body.quick : true;

    const engine = new EvaluationEngine();
    const summary = await engine.executeCompleteEvaluation({ quick });

    return NextResponse.json({
      success: true,
      hasResults: true,
      data: summary,
    });
  } catch (error: any) {
    console.error('Learning Curve API POST trigger error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
