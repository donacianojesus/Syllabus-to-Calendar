import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
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
  });
}
