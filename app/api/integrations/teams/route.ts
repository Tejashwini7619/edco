import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dealId = searchParams.get('dealId') || 'deal-acme-fintech';

  try {
    const brief = await memoryService.generatePreCallBrief(dealId);
    const deal = memoryService.getDealById(dealId);

    // Microsoft Teams Adaptive Card schema (v1.5)
    const adaptiveCard = {
      type: 'AdaptiveCard',
      $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
      version: '1.5',
      body: [
        {
          type: 'Container',
          items: [
            {
              type: 'TextBlock',
              text: `⚡ DealMemory: 30-Sec Pre-Call Brief`,
              weight: 'Bolder',
              size: 'Medium',
              color: 'Accent',
            },
            {
              type: 'TextBlock',
              text: `${deal?.name || brief.dealName} • \$${deal?.value.toLocaleString()} ARR • Stage: ${deal?.stage}`,
              isSubtle: true,
              spacing: 'None',
            },
          ],
        },
        {
          type: 'Container',
          spacing: 'Medium',
          items: [
            {
              type: 'TextBlock',
              text: '📍 Where the Deal Stands',
              weight: 'Bolder',
            },
            ...brief.whereItStands.map((line) => ({
              type: 'TextBlock',
              text: `• ${line}`,
              wrap: true,
              spacing: 'Small',
            })),
          ],
        },
        {
          type: 'Container',
          spacing: 'Medium',
          items: [
            {
              type: 'TextBlock',
              text: '🛡️ Open Objections & Resolution',
              weight: 'Bolder',
            },
            ...brief.openObjections.map((obj) => ({
              type: 'FactSet',
              facts: [
                { title: 'Objection', value: obj.objection },
                { title: 'Status', value: obj.resolved ? 'Resolved' : 'Active' },
                { title: 'Tactic', value: obj.resolutionStrategy || 'Pending' },
              ],
            })),
          ],
        },
        {
          type: 'Container',
          spacing: 'Medium',
          items: [
            {
              type: 'TextBlock',
              text: '🎯 Recommended Talk Track',
              weight: 'Bolder',
            },
            {
              type: 'TextBlock',
              text: brief.recommendedTalkTrack,
              wrap: true,
            },
          ],
        },
      ],
      actions: [
        {
          type: 'Action.OpenUrl',
          title: 'Open in DealMemory',
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/deals/${dealId}`,
        },
      ],
    };

    return NextResponse.json({
      dealId,
      adaptiveCard,
      brief,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Teams payload generation failed' }, { status: 500 });
  }
}
