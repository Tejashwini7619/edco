import OpenAI from 'openai';

let llmClient: OpenAI | null = null;
let activeModelName = 'qwen/qwen3.8-27b';

try {
  if (typeof process !== 'undefined' && process.loadEnvFile) {
    process.loadEnvFile('.env.local');
  }
} catch {}

export function getLLMClient(modelOverride?: string): { client: OpenAI; model: string } {
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';
  const groqKey = process.env.GROQ_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  // 1. Azure OpenAI (if configured)
  if (azureKey && azureEndpoint && !azureEndpoint.includes('your-resource-name')) {
    const model = modelOverride || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o';
    const client = new OpenAI({
      apiKey: azureKey,
      baseURL: `${azureEndpoint.replace(/\/$/, '')}/openai/deployments/${model}`,
      defaultQuery: { 'api-version': azureApiVersion },
      defaultHeaders: { 'api-key': azureKey },
    });
    return { client, model };
  }

  // 2. Groq High-Speed LLM
  if (groqKey) {
    const model = modelOverride || process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';
    const client = new OpenAI({
      apiKey: groqKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    return { client, model };
  }

  // 3. Direct OpenAI / Fallback
  const model = modelOverride || 'gpt-4o';
  const client = new OpenAI({
    apiKey: openAiKey || 'dummy-key-for-local-fallback',
  });

  return { client, model };
}

export interface CompletionOptions {
  messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  prompt?: string;
  systemPrompt?: string;
  temperature?: number;
  max_tokens?: number;
  modelOverride?: string;
}

export async function generateCompletion(
  optionsOrPrompt: string | CompletionOptions,
  legacySystemPrompt?: string
): Promise<string> {
  let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
  let temperature = 0.1;
  let maxTokens = 700;
  let modelOverride: string | undefined;

  if (typeof optionsOrPrompt === 'string') {
    if (legacySystemPrompt) {
      messages.push({ role: 'system', content: legacySystemPrompt });
    }
    messages.push({ role: 'user', content: optionsOrPrompt });
  } else if (typeof optionsOrPrompt === 'object' && optionsOrPrompt !== null) {
    if (optionsOrPrompt.messages && Array.isArray(optionsOrPrompt.messages)) {
      messages = optionsOrPrompt.messages.map((m) => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      }));
    } else if (optionsOrPrompt.prompt) {
      if (optionsOrPrompt.systemPrompt) {
        messages.push({ role: 'system', content: optionsOrPrompt.systemPrompt });
      }
      messages.push({ role: 'user', content: optionsOrPrompt.prompt });
    }
    if (optionsOrPrompt.temperature !== undefined) {
      temperature = optionsOrPrompt.temperature;
    }
    if (optionsOrPrompt.max_tokens !== undefined) {
      maxTokens = optionsOrPrompt.max_tokens;
    }
    modelOverride = optionsOrPrompt.modelOverride;
  }

  if (messages.length === 0) {
    return '';
  }

  const { client, model } = getLLMClient(modelOverride);
  let retries = 5;
  let delay = 1000;

  while (retries > 0) {
    try {
      const response = await client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: any) {
      const isRateLimit =
        error?.status === 429 ||
        error?.statusCode === 429 ||
        (error?.message && error.message.includes('Rate limit'));

      if (isRateLimit && retries > 1) {
        retries--;
        const retryMatch = error?.message?.match(/try again in ([0-9.]+)m?s/i);
        let waitMs = delay;
        if (retryMatch) {
          const num = parseFloat(retryMatch[1]);
          waitMs = error.message.includes('ms') ? Math.ceil(num) + 300 : Math.ceil(num * 1000) + 300;
        }
        console.warn(`[LLM 429] Rate limit hit. Backing off for ${waitMs}ms before retry (${retries} retries left)...`);
        await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 1500)));
        delay = Math.min(delay * 1.5, 8000);
        continue;
      }

      console.warn('[LLM Error]:', error?.message || error);
      return '';
    }
  }

  return '';
}
