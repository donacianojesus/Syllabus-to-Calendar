import { VercelRequest, VercelResponse } from '@vercel/node';
import { LLMParserService } from '../services/llmParser';
import { ApiResponse } from '../types/shared';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    } as ApiResponse<null>);
  }

  try {
    const status = LLMParserService.getStatus();
    
    return res.json({
      success: true,
      data: {
        llm: status,
        regex: { available: true },
        environment: {
          enableLLM: process.env.ENABLE_LLM_PARSING === 'true',
          model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
          maxTokens: process.env.LLM_MAX_TOKENS || '2000',
          temperature: process.env.LLM_TEMPERATURE || '0.1',
        },
      },
      message: 'Parsing service status',
    } as ApiResponse<any>);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get parsing status',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as ApiResponse<null>);
  }
}
