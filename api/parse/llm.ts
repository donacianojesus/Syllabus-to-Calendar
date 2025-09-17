import { VercelRequest, VercelResponse } from '@vercel/node';
import { LLMParserService } from '../services/llmParser';
import { ApiResponse, ParsedSyllabus } from '../types/shared';

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

    const result = await LLMParserService.parseSyllabusWithLLM(
      text,
      courseName,
      courseCode,
      semester,
      year
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'LLM parsing failed',
      } as ApiResponse<null>);
    }

    return res.json({
      success: true,
      data: result.data,
      message: `Successfully parsed syllabus with LLM (${result.method}) - ${result.data?.events.length || 0} events found`,
      metadata: {
        confidence: result.confidence,
        method: result.method,
        model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
      },
    } as ApiResponse<ParsedSyllabus>);

  } catch (error) {
    console.error('LLM parsing error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during LLM parsing',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'An error occurred while processing your request',
    } as ApiResponse<null>);
  }
}
