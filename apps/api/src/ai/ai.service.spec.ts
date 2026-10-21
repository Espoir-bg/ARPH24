import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;
  const originalFetch = global.fetch;
  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  const originalGeminiKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    service = new AiService();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.GEMINI_API_KEY = 'test-gemini-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;

    if (originalOpenAiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    }

    if (originalGeminiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalGeminiKey;
    }
  });

  it('utilise OpenAI lorsque le fournisseur répond correctement', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: 'Réponse OpenAI de test',
      }),
    }) as unknown as typeof fetch;

    await expect(service.respond('Bonjour')).resolves.toEqual({
      provider: 'openai',
      text: 'Réponse OpenAI de test',
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('bascule vers Gemini si OpenAI échoue', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'Réponse Gemini de secours' }],
              },
            },
          ],
        }),
      }) as unknown as typeof fetch;

    await expect(service.respond('Bonjour')).resolves.toEqual({
      provider: 'gemini',
      text: 'Réponse Gemini de secours',
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
