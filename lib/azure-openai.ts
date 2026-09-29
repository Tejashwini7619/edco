import OpenAI from 'openai';

let llmClient: OpenAI | null = null;
let activeModelName = 'openai/gpt-oss-120b';

try {
  if (typeof process !== 'undefined' && process.loadEnvFile) {
    process.loadEnvFile('.env.local');
  }
} catch {}

export function getLLMClient(): { client: OpenAI; model: string } {
  if (llmClient) return { client: llmClient, model: activeModelName };

  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';
  const groqKey = process.env.GROQ_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  // 1. Azure OpenAI (if configured)
  if (azureKey && azureEndpoint && !azureEndpoint.includes('your-resource-name')) {
    activeModelName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';
    llmClient = new OpenAI({
      apiKey: azureKey,
      baseURL: `${azureEndpoint.replace(/\/$/, '')}/openai/deployments/${activeModelName}`,
      defaultQuery: { 'api-version': azureApiVersion },
      defaultHeaders: { 'api-key': azureKey },
    });
    return { client: llmClient, model: activeModelName };
  }

  // 2. Groq High-Speed LLM
  if (groqKey) {
    activeModelName = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    llmClient = new OpenAI({
      apiKey: groqKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    return { client: llmClient, model: activeModelName };
  }

  // 3. Direct OpenAI / Fallback
  activeModelName = 'gpt-4o';
  llmClient = new OpenAI({
    apiKey: openAiKey || 'dummy-key-for-local-fallback',
  });

  return { client: llmClient, model: activeModelName };
}

export async function generateCompletion(prompt: string, systemPrompt?: string): Promise<string> {
  const { client, model } = getLLMClient();

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: 0.1,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('LLM completion error:', error);
    return '';
  }
}
