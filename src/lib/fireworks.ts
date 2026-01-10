import OpenAI from 'openai';

// Fireworks uses OpenAI-compatible API
const fireworks = new OpenAI({
  apiKey: process.env.FIREWORKS_API_KEY || '',
  baseURL: 'https://api.fireworks.ai/inference/v1',
});

export async function chat(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    json?: boolean;
  }
): Promise<string> {
  const response = await fireworks.chat.completions.create({
    model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 2000,
    response_format: options?.json ? { type: 'json_object' } : undefined,
  });

  return response.choices[0]?.message?.content || '';
}

export { fireworks };
