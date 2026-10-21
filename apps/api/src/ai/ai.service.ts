import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';

type AiProvider = 'openai' | 'gemini';

export interface AiResponse {
  provider: AiProvider;
  text: string;
}

@Injectable()
export class AiService {
  private readonly timeoutMs = 30_000;

  async respond(prompt: string): Promise<AiResponse> {
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openAiKey) {
      try {
        const text = await this.askOpenAI(prompt, openAiKey);
        return { provider: 'openai', text };
      } catch {
        // Ne pas exposer les erreurs du fournisseur au client.
      }
    }

    if (geminiKey) {
      try {
        const text = await this.askGemini(prompt, geminiKey);
        return { provider: 'gemini', text };
      } catch {
        // Ne pas exposer les erreurs du fournisseur au client.
      }
    }

    throw new ServiceUnavailableException(
      'Le service IA est temporairement indisponible.',
    );
  }

  private async askOpenAI(
    prompt: string,
    apiKey: string,
  ): Promise<string> {
    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
          input: prompt,
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      },
    );

    if (!response.ok) {
      throw new Error('OpenAI request failed');
    }

    const payload = (await response.json()) as {
      output_text?: string;
      output?: Array<{
        content?: Array<{ type?: string; text?: string }>;
      }>;
    };

    const text =
      payload.output_text ??
      payload.output
        ?.flatMap((item) => item.content ?? [])
        .filter(
          (item) => item.type === 'output_text' && item.text,
        )
        .map((item) => item.text)
        .join('\n');

    if (!text?.trim()) {
      throw new Error('OpenAI returned an empty response');
    }

    return text.trim();
  }

  private async askGemini(
    prompt: string,
    apiKey: string,
  ): Promise<string> {
    const model =
      process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      },
    );

    if (!response.ok) {
      throw new Error('Gemini request failed');
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text = payload.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('\n')
      .trim();

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    return text;
  }
}
