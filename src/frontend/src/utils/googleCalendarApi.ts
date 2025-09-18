import axios from 'axios';
import { CalendarEvent } from '../../../shared/types.ts';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In production (Vercel), use environment variable or fallback to your backend
  if (import.meta.env.PROD) {
    const url = import.meta.env.VITE_API_URL || 'https://nodejs-serverless-function-express-n4a7upign.vercel.app';
    // Remove trailing slash to prevent double slashes
    return url.replace(/\/$/, '');
  }
  // In development, use localhost
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export interface GoogleCalendarAuthResponse {
  success: boolean;
  data?: {
    authUrl: string;
  };
  error?: string;
}

export interface GoogleCalendarTokensResponse {
  success: boolean;
  data?: {
    tokens: any;
    authenticated: boolean;
  };
  error?: string;
}

export interface GoogleCalendarSyncResponse {
  success: boolean;
  data?: {
    syncedEvents: number;
    failedEvents: number;
    errors: string[];
    calendarId?: string;
  };
  message?: string;
  error?: string;
}

export interface GoogleCalendarStatusResponse {
  success: boolean;
  data?: {
    authenticated: boolean;
  };
  error?: string;
}

export interface GoogleCalendarListResponse {
  success: boolean;
  data?: {
    calendars: any[];
  };
  error?: string;
}

export class GoogleCalendarApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/google-calendar`;
  }

  /**
   * Get Google Calendar OAuth2 authorization URL
   */
  async getAuthUrl(): Promise<GoogleCalendarAuthResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/auth-url`);
      return response.data;
    } catch (error: any) {
      console.error('Error getting auth URL:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get authorization URL'
      };
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<GoogleCalendarTokensResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth-callback`, { code });
      return response.data;
    } catch (error: any) {
      console.error('Error exchanging code for tokens:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to exchange authorization code'
      };
    }
  }

  /**
   * Set OAuth2 credentials
   */
  async setCredentials(tokens: any): Promise<GoogleCalendarStatusResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/set-credentials`, { tokens });
      return response.data;
    } catch (error: any) {
      console.error('Error setting credentials:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to set credentials'
      };
    }
  }

  /**
   * Sync events to Google Calendar
   */
  async syncEvents(events: CalendarEvent[], calendarId?: string): Promise<GoogleCalendarSyncResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/sync-events`, {
        events,
        calendarId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error syncing events:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to sync events'
      };
    }
  }

  /**
   * Get user's calendars
   */
  async getCalendars(): Promise<GoogleCalendarListResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/calendars`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching calendars:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch calendars'
      };
    }
  }

  /**
   * Create a new calendar
   */
  async createCalendar(name: string, description?: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/create-calendar`, {
        name,
        description
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating calendar:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create calendar'
      };
    }
  }

  /**
   * Check authentication status
   */
  async getStatus(): Promise<GoogleCalendarStatusResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/status`);
      return response.data;
    } catch (error: any) {
      console.error('Error checking status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to check status'
      };
    }
  }
}

export default GoogleCalendarApi;
