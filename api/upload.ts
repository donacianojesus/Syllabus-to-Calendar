import { VercelRequest, VercelResponse } from '@vercel/node';

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
    });
  }

  try {
    // For now, return test data to verify the endpoint works
    return res.json({
      success: true,
      message: 'Upload endpoint is working!',
      data: {
        courseName: 'Test Course',
        courseCode: 'TEST 101',
        events: [
          {
            id: 'test-event-1',
            title: 'Test Assignment',
            date: new Date().toISOString(),
            type: 'assignment',
            priority: 'medium',
            completed: false
          }
        ]
      },
      metadata: {
        confidence: 100,
        method: 'test',
        fileType: 'test',
        eventsFound: 1
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during file processing',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}