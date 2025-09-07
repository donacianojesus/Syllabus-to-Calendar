import express from 'express';
import { upload, validateUploadedFile, getFileType } from '../utils/fileUpload';
import { PdfParserService } from '../services/pdfParser';
import { TextParserService } from '../services/textParser';
import { SyllabusParserService } from '../services/syllabusParser';
import { ApiResponse, ParsedSyllabus } from '../../../shared/types';

const router = express.Router();

/**
 * POST /api/upload
 * Upload and parse a syllabus file
 */
router.post('/', upload.single('syllabus'), async (req, res) => {
  try {
    // Validate uploaded file
    const validation = validateUploadedFile(req.file);
    if (!validation.isValid) {
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
        return res.status(400).json({
          success: false,
          error: 'DOCX files are not yet supported. Please convert to PDF or text format.',
        } as ApiResponse<null>);

      default:
        return res.status(400).json({
          success: false,
          error: 'Unsupported file type',
        } as ApiResponse<null>);
    }

    // Check if the content looks like a syllabus
    if (!parsingMetadata.isLikelySyllabus) {
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
      return res.status(500).json({
        success: false,
        error: parsingResult.error || 'Failed to parse syllabus',
      } as ApiResponse<null>);
    }

    // Return successful response
    return res.json({
      success: true,
      data: parsingResult.data,
      message: `Successfully parsed syllabus with ${parsingResult.data?.events.length || 0} events found`,
      metadata: {
        confidence: parsingResult.confidence,
        fileType,
        parsingMetadata,
        originalFilename: file.originalname,
        fileSize: file.size,
      },
    } as ApiResponse<ParsedSyllabus>);

  } catch (error) {
    console.error('Upload error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during file processing',
      message: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'An error occurred while processing your file',
    } as ApiResponse<null>);
  }
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

export default router;
