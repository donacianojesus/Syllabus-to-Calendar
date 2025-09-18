import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    message: 'LawBandit Calendar API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      upload: '/api/upload (POST)',
      uploadInfo: '/api/upload/info (GET)',
      parseLLM: '/api/parse/llm (POST)',
      parseCompare: '/api/parse/compare (POST)',
      parseStatus: '/api/parse/status (GET)'
    }
  });
}

