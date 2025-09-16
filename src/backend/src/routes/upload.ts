import express from 'express';
import { upload, validateUploadedFile, getFileType } from '../utils/fileUpload';
import { PdfParserService } from '../services/pdfParser';
import { TextParserService } from '../services/textParser';
import { SyllabusParserService } from '../services/syllabusParser';
import { LLMParserService } from '../services/llmParser';
import { ApiResponse, ParsedSyllabus } from '../types/shared';

const router = express.Router();

/**
 * POST /api/upload
 * Upload and parse a syllabus file
 */
router.post('/', upload.single('syllabus'), async (req, res) => {
  // Set timeout for large file processing
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: 'Request timeout - file processing took too long',
      } as ApiResponse<null>);
    }
  }, 120000); // 2 minute timeout for LLM processing

  try {
    // Validate uploaded file
    const validation = validateUploadedFile(req.file);
    if (!validation.isValid) {
      clearTimeout(timeout);
      return res.status(400).json({
        success: false,
        error: validation.error,
      } as ApiResponse<null>);
    }

    const file = req.file!;
    const fileType = getFileType(file);
    
    // Extract additional course information from request body
    const { courseName, courseCode, semester, year } = req.body;

    let extractedText: string;
    let parsingMetadata: any = {};

    // Parse file based on type
    switch (fileType) {
      case 'pdf':
        const pdfResult = await PdfParserService.parsePdf(file.buffer);
        extractedText = PdfParserService.cleanText(pdfResult.text);
        parsingMetadata = {
          pages: pdfResult.pages,
          info: pdfResult.info,
          isLikelySyllabus: PdfParserService.isLikelySyllabus(extractedText),
        };
        break;

      case 'text':
        const textResult = await TextParserService.parseText(file.buffer);
        extractedText = textResult.text;
        parsingMetadata = {
          encoding: textResult.encoding,
          size: textResult.size,
          isLikelySyllabus: TextParserService.isLikelySyllabus(extractedText),
        };
        break;

      case 'docx':
        // For now, return error for DOCX files
        // TODO: Implement DOCX parsing with mammoth
        clearTimeout(timeout);
        return res.status(400).json({
          success: false,
          error: 'DOCX files are not yet supported. Please convert to PDF or text format.',
        } as ApiResponse<null>);

      default:
        clearTimeout(timeout);
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type',
        } as ApiResponse<null>);
    }

    // Check if the content looks like a syllabus
    if (!parsingMetadata.isLikelySyllabus) {
      clearTimeout(timeout);
      return res.status(400).json({
        success: false,
        error: 'The uploaded file does not appear to be a syllabus. Please upload a valid course syllabus.',
      } as ApiResponse<null>);
    }

    // Parse the syllabus content
    const parsingResult = await SyllabusParserService.parseSyllabus(
      extractedText,
      courseName,
      courseCode,
      semester ? semester : undefined,
      year ? parseInt(year) : undefined
    );

    if (!parsingResult.success) {
      clearTimeout(timeout);
      return res.status(500).json({
        success: false,
        error: parsingResult.error || 'Failed to parse syllabus',
      } as ApiResponse<null>);
    }

    // Clear timeout since we're responding successfully
    clearTimeout(timeout);

    // Return successful response
    return res.json({
      success: true,
      data: parsingResult.data,
      message: `Successfully parsed syllabus with ${parsingResult.data?.events.length || 0} events found`,
      metadata: {
        confidence: parsingResult.confidence,
        method: parsingResult.method || 'unknown',
        fileType,
        parsingMetadata,
        originalFilename: file.originalname,
        fileSize: file.size,
      },
    } as ApiResponse<ParsedSyllabus>);

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clear timeout since we're responding with error
    clearTimeout(timeout);
    
    // Only send response if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error during file processing',
        message: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : 'An error occurred while processing your file',
      } as ApiResponse<null>);
    }
  }
  
  // This return statement ensures all code paths return a value
  return;
});

/**
 * GET /api/upload/info
 * Get information about supported file types and upload limits
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      supportedTypes: ['pdf', 'txt'],
      maxFileSize: '10MB',
      allowedMimeTypes: [
        'application/pdf',
        'text/plain',
      ],
      requiredFields: ['syllabus'],
      optionalFields: ['courseName', 'courseCode', 'semester', 'year'],
    },
    message: 'Upload endpoint information',
  } as ApiResponse<any>);
});

/**
 * POST /api/parse/llm
 * Parse syllabus text using LLM only (no file upload)
 */
router.post('/llm', async (req, res) => {
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
});

/**
 * POST /api/parse/compare
 * Compare LLM parsing vs regex parsing
 */
router.post('/compare', async (req, res) => {
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
});

/**
 * GET /api/parse/status
 * Get LLM service status and configuration
 */
router.get('/status', (req, res) => {
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
});

export default router;
