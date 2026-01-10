import { chat } from '@/lib/fireworks';

export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export abstract class BaseAgent<TInput, TOutput> {
  protected name: string;
  protected description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  abstract run(input: TInput): Promise<AgentResult<TOutput>>;

  protected async llm(
    systemPrompt: string,
    userPrompt: string,
    options?: { json?: boolean; temperature?: number }
  ): Promise<string> {
    return chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      options
    );
  }

  protected log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }
}
