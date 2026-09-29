import { NextRequest, NextResponse } from 'next/server';
import { SEED_DEALS } from '@/lib/seed-data';
import { generateCompletion } from '@/lib/azure-openai';
import { queryDealMemory } from '@/lib/memory';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { tone = 'executive', focus = 'general', customNotes = '' } = await req.json().catch(() => ({}));

    const deal = SEED_DEALS.find((d) => d.id === id) || SEED_DEALS[0];
    const latestInteraction = deal.interactions[deal.interactions.length - 1];

    // Query Hindsight memory for commitments, promises, and open items
    const memoryQuery = await queryDealMemory(
      deal.id,
      'What commitments, promises, action items, or pricing proposals were discussed in the recent meetings for this deal?'
    );

    const prompt = `You are an expert enterprise sales account executive drafting a high-impact post-call follow-up email.
Deal: ${deal.name}
Company: ${deal.company}
Stage: ${deal.stage}
Tone: ${tone}
Focus: ${focus}

Latest Interaction Context:
"${latestInteraction.content}"

Persistent Memory Context (Past commitments, stakeholder objections, proposals):
"${memoryQuery.answer}"

${customNotes ? `Additional Rep Notes:\n"${customNotes}"` : ''}

Draft a crisp, persuasive follow-up email following these rules:
1. Subject line must be concise, executive, and relevant.
2. Thank the primary attendees by name.
3. Explicitly recap key discussion points and address any voiced objections (e.g. pricing, security, integration) with concrete commitments.
4. List clear next steps with proposed dates/milestones.
5. Keep paragraphs short (2-3 sentences max).
6. Return JSON with format:
{
  "subject": "Subject line",
  "recipient": "Primary stakeholder email/name",
  "body": "Full email body in clean markdown formatting",
  "actionItems": ["Action item 1", "Action item 2", "Action item 3"],
  "promisesReferenced": ["Promise/commitment 1", "Promise/commitment 2"]
}`;

    const completion = await generateCompletion({
      messages: [
        { role: 'system', content: 'You are an enterprise sales strategist. Output only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    });

    let result;
    try {
      const cleaned = completion.replace(/```json\s*|\s*```/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        subject: `Follow-up & Next Steps: ${deal.name} Partnership`,
        recipient: deal.company,
        body: completion,
        actionItems: ['Schedule milestone ramp review with CFO', 'Provide Azure VNet security architecture report'],
        promisesReferenced: ['Phased implementation pricing terms', 'Sub-50ms latency benchmark confirmation']
      };
    }

    return NextResponse.json({
      success: true,
      dealId: deal.id,
      email: result,
      groundedMemorySources: memoryQuery.sources
    });
  } catch (error: any) {
    console.error('Follow-up draft error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
