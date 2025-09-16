// API utility functions for LawBandit Calendar

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In production (Vercel), use environment variable or fallback to Railway
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://your-backend-url.railway.app';
  }
  // In development, use relative path (Vite proxy)
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    courseName: string;
    courseCode?: string;
    semester?: string;
    year?: number;
    events: Array<{
      id: string;
      title: string;
      date: string;
      type: string;
      priority?: string;
      description?: string;
    }>;
  };
  error?: string;
  metadata?: {
    confidence: number;
    method: string;
    fileType: string;
    eventsFound: number;
  };
}

/**
 * Upload and parse a syllabus file
 */
export async function uploadSyllabus(formData: FormData): Promise<UploadResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload API error:', error);
    throw error;
  }
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const healthUrl = import.meta.env.PROD 
      ? `${API_BASE_URL}/health`
      : '/health';
    const response = await fetch(healthUrl);
    return response.ok;
  } catch (error) {
    console.error('Health check error:', error);
    return false;
  }
}

/**
 * Get LLM service status
 */
export async function getLLMStatus(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/parse/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('LLM status error:', error);
    throw error;
  }
}

/**
 * Parse text directly with LLM
 */
export async function parseWithLLM(text: string, courseName?: string, courseCode?: string, semester?: string, year?: number): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/parse/llm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        courseName,
        courseCode,
        semester,
        year,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('LLM parsing error:', error);
    throw error;
  }
}
