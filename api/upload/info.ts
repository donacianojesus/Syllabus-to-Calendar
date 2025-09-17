import { VercelRequest, VercelResponse } from '@vercel/node';
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
}
