import { VercelRequest, VercelResponse } from '@vercel/node';
import { LLMParserService } from '../services/llmParser';
import { SyllabusParserService } from '../services/syllabusParser';
import { ApiResponse } from '../types/shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    } as ApiResponse<null>);
  }

  try {
    const { text, courseName, courseCode, semester, year } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text content is required',
      } as ApiResponse<null>);
    }

    // Run both parsing methods
    const [llmResult, regexResult] = await Promise.allSettled([
      LLMParserService.parseSyllabusWithLLM(text, courseName, courseCode, semester, year),
      SyllabusParserService.parseSyllabus(text, courseName, courseCode, semester, year)
    ]);

    const comparison = {
      llm: {
        success: llmResult.status === 'fulfilled' && llmResult.value.success,
        data: llmResult.status === 'fulfilled' ? llmResult.value.data : null,
        confidence: llmResult.status === 'fulfilled' ? llmResult.value.confidence : 0,
        error: llmResult.status === 'rejected' ? llmResult.reason : (llmResult.status === 'fulfilled' ? llmResult.value.error : null),
        method: 'llm',
      },
      regex: {
        success: regexResult.status === 'fulfilled' && regexResult.value.success,
        data: regexResult.status === 'fulfilled' ? regexResult.value.data : null,
        confidence: regexResult.status === 'fulfilled' ? regexResult.value.confidence : 0,
        error: regexResult.status === 'rejected' ? regexResult.reason : (regexResult.status === 'fulfilled' ? regexResult.value.error : null),
        method: 'regex',
      },
    };

    return res.json({
      success: true,
      data: comparison,
      message: 'Comparison completed',
    } as ApiResponse<any>);

  } catch (error) {
    console.error('Comparison error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during comparison',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'An error occurred while processing your request',
    } as ApiResponse<null>);
  }
}
