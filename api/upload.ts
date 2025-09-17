import { VercelRequest, VercelResponse } from '@vercel/node';
import { PdfParserService } from './services/pdfParser';
import { TextParserService } from './services/textParser';
import { SyllabusParserService } from './services/syllabusParser';
import { ApiResponse, ParsedSyllabus } from './types/shared';

// Helper function to validate file upload
function validateUploadedFile(file: any | undefined): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file uploaded' };
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  // Check if file has content
  if (file.size === 0) {
    return { isValid: false, error: 'File is empty' };
  }

  return { isValid: true };
}

// Helper function to get file type
function getFileType(file: any): 'pdf' | 'text' | 'docx' | 'unknown' {
  const extension = file.originalname.toLowerCase().split('.').pop();
  const mimetype = file.mimetype.toLowerCase();

  if (extension === 'pdf' || mimetype === 'application/pdf') {
    return 'pdf';
  }
  
  if (extension === 'txt' || mimetype === 'text/plain') {
    return 'text';
  }
  
  if (extension === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx';
  }

  return 'unknown';
}

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
    // Parse multipart form data
    const formData = req.body;
    
    // For Vercel, we need to handle the file differently
    // The file will be in req.body as a buffer or base64 string
    if (!formData.syllabus) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      } as ApiResponse<null>);
    }

    // Validate uploaded file
    const validation = validateUploadedFile(formData.syllabus);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      } as ApiResponse<null>);
    }

    const file = formData.syllabus;
    const fileType = getFileType(file);
    
    // Extract additional course information from request body
    const { courseName, courseCode, semester, year } = formData;

    let extractedText: string;
    let parsingMetadata: any = {};

    // Parse file based on type
    switch (fileType) {
      case 'pdf':
        const pdfResult = await PdfParserService.parsePdf(file.buffer || Buffer.from(file.data, 'base64'));
        extractedText = PdfParserService.cleanText(pdfResult.text);
        parsingMetadata = {
          pages: pdfResult.pages,
          info: pdfResult.info,
          isLikelySyllabus: PdfParserService.isLikelySyllabus(extractedText),
        };
        break;

      case 'text':
        const textResult = await TextParserService.parseText(file.buffer || Buffer.from(file.data, 'base64'));
        extractedText = textResult.text;
        parsingMetadata = {
          encoding: textResult.encoding,
          size: textResult.size,
          isLikelySyllabus: TextParserService.isLikelySyllabus(extractedText),
        };
        break;

      case 'docx':
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
        method: parsingResult.method || 'unknown',
        fileType,
        parsingMetadata,
        originalFilename: file.originalname || 'unknown',
        fileSize: file.size || 0,
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
}
