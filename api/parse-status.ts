import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    success: true,
    data: {
      llm: { available: false, error: 'OpenAI API key not configured' },
      regex: { available: true },
      environment: {
        enableLLM: process.env.ENABLE_LLM_PARSING === 'true',
        model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
        maxTokens: process.env.LLM_MAX_TOKENS || '2000',
        temperature: process.env.LLM_TEMPERATURE || '0.1',
      },
    },
    message: 'Parsing service status',
  });
}
