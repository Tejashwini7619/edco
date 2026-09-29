import { HindsightClient } from '@vectorize-io/hindsight-client';
import { applyMemoryDefense } from '../lib/memory-defense';

export interface MemoryAdapter {
  createBank(bankId: string, options: { name: string; mission?: string; background?: string; disposition?: any }): Promise<void>;
  retain(bankId: string, content: string, metadata?: any): Promise<void>;
  recall(bankId: string, query: string): Promise<string[]>;
  reflect(bankId: string, query: string): Promise<string>;
}

export class HindsightAdapter implements MemoryAdapter {
  private client: HindsightClient;

  constructor(apiUrl?: string, apiKey?: string) {
    const baseUrl =
      apiUrl ||
      process.env.HINDSIGHT_API_URL ||
      process.env.HINDSIGHT_BASE_URL ||
      'https://api.hindsight.vectorize.io';
    const key = apiKey || process.env.HINDSIGHT_API_KEY;
    this.client = new HindsightClient({
      baseUrl,
      ...(key ? { apiKey: key } : {}),
    });
  }

  async createBank(
    bankId: string,
    options: { name: string; mission?: string; background?: string; disposition?: any }
  ): Promise<void> {
    await this.client.createBank(bankId, {
      name: options.name,
      mission: options.mission || options.background || 'Sales intelligence memory bank',
      background: options.background || options.mission || 'Sales intelligence memory bank',
      disposition: options.disposition || { skepticism: 4, literalism: 4, empathy: 2 },
    });
  }

  async retain(bankId: string, content: string, metadata?: any): Promise<void> {
    const scrubbed = applyMemoryDefense(content).scrubbedContent;
    await this.client.retain(bankId, scrubbed, {
      context: metadata?.context || 'crm_note',
      timestamp: metadata?.timestamp ? new Date(metadata.timestamp) : new Date(),
      documentId: metadata?.documentId,
      metadata: metadata?.metadata,
    });
  }

  async recall(bankId: string, query: string): Promise<string[]> {
    try {
      const resp: any = await this.client.recall(bankId, query);
      if (resp && Array.isArray(resp.results)) {
        return resp.results.map((r: any) => r.text || r.content || (typeof r === 'string' ? r : JSON.stringify(r)));
      }
      return [];
    } catch {
      return [];
    }
  }

  async reflect(bankId: string, query: string): Promise<string> {
    try {
      const resp: any = await this.client.reflect(bankId, query);
      return resp?.response || resp?.text || resp?.answer || '';
    } catch {
      return '';
    }
  }
}
