import { NextRequest, NextResponse } from 'next/server';
import { memoryService } from '@/lib/memory';

export async function POST(req: NextRequest) {
  try {
    const { items, defaultDealId } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Array of CRM items is required' }, { status: 400 });
    }

    const importedResults = [];

    for (const item of items) {
      const dealId = item.dealId || defaultDealId || 'deal-acme-fintech';
      const content = `${item.sender || 'Unknown'} (${item.timestamp || new Date().toISOString()}): ${item.subject ? `Subject: ${item.subject}\n` : ''}${item.body || item.note || item.content}`;
      const context = item.source === 'outlook' ? 'outlook email' : 'dynamics 365 note';

      const res = await memoryService.retain(
        dealId,
        content,
        context,
        item.timestamp,
        {
          crmSource: item.source || 'dynamics365',
          crmRecordId: item.id || `crm-${Date.now()}`,
          author: item.sender || 'Dynamics System',
        }
      );

      importedResults.push(res);
    }

    return NextResponse.json({
      success: true,
      importedCount: importedResults.length,
      results: importedResults,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Dynamics import failed' }, { status: 500 });
  }
}
