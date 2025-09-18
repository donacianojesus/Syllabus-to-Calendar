import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { CalendarEvent, EventType, Priority } from '../../../shared/types';

export interface GoogleCalendarEvent {
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  colorId?: string;
  reminders?: {
    useDefault: boolean;
  };
}

export interface GoogleCalendarSyncResult {
  success: boolean;
  syncedEvents: number;
  failedEvents: number;
  errors: string[];
  calendarId?: string;
}

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: any;

  constructor() {
    // Initialize OAuth2 client with environment variables
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Set credentials for the OAuth2 client
   */
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Generate OAuth2 authorization URL
   */
  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  /**
   * Refresh access token if needed
   */
  async refreshToken(): Promise<boolean> {
    try {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  /**
   * Convert CalendarEvent to Google Calendar event format
   */
  private mapEventToGoogleCalendar(event: CalendarEvent): GoogleCalendarEvent {
    const eventDate = new Date(event.date);
    const isAllDay = !event.time;
    
    // Determine color based on event type
    const colorId = this.getColorIdForEventType(event.type);
    
    // Create description with additional info
    let description = event.description || '';
    if (event.course) {
      description = `Course: ${event.course}\n${description}`;
    }
    if (event.priority && event.priority !== Priority.LOW) {
      description += `\nPriority: ${event.priority.toUpperCase()}`;
    }

    const googleEvent: GoogleCalendarEvent = {
      summary: event.title,
      description: description.trim(),
      colorId,
      reminders: {
        useDefault: true
      },
      start: {},
      end: {}
    };

    if (isAllDay) {
      // All-day event
      const dateStr = eventDate.toISOString().split('T')[0];
      googleEvent.start = { date: dateStr };
      googleEvent.end = { date: dateStr };
    } else {
      // Timed event
      const startDateTime = eventDate.toISOString();
      const endDateTime = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString(); // Default 1 hour duration
      
      googleEvent.start = { dateTime: startDateTime };
      googleEvent.end = { dateTime: endDateTime };
    }

    return googleEvent;
  }

  /**
   * Get color ID for event type
   */
  private getColorIdForEventType(type: EventType): string {
    switch (type) {
      case EventType.ASSIGNMENT:
        return '1'; // Blue
      case EventType.EXAM:
        return '11'; // Red
      case EventType.READING:
        return '10'; // Green
      case EventType.CLASS:
        return '5'; // Purple
      case EventType.DEADLINE:
        return '6'; // Orange
      default:
        return '8'; // Gray
    }
  }

  /**
   * Create a single event in Google Calendar
   */
  async createEvent(event: CalendarEvent, calendarId: string = 'primary'): Promise<any> {
    try {
      const googleEvent = this.mapEventToGoogleCalendar(event);
      
      const response = await this.calendar.events.insert({
        calendarId,
        resource: googleEvent
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw new Error(`Failed to create event: ${event.title}`);
    }
  }

  /**
   * Sync multiple events to Google Calendar
   */
  async syncEvents(events: CalendarEvent[], calendarId: string = 'primary'): Promise<GoogleCalendarSyncResult> {
    const result: GoogleCalendarSyncResult = {
      success: true,
      syncedEvents: 0,
      failedEvents: 0,
      errors: [],
      calendarId
    };

    // Filter out events with placeholder dates (2099)
    const validEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() !== 2099;
    });

    console.log(`Syncing ${validEvents.length} events to Google Calendar`);

    for (const event of validEvents) {
      try {
        await this.createEvent(event, calendarId);
        result.syncedEvents++;
      } catch (error) {
        result.failedEvents++;
        result.errors.push(`Failed to sync "${event.title}": ${error}`);
        console.error(`Failed to sync event "${event.title}":`, error);
      }
    }

    result.success = result.failedEvents === 0;
    return result;
  }

  /**
   * Get list of user's calendars
   */
  async getCalendars(): Promise<any[]> {
    try {
      const response = await this.calendar.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw new Error('Failed to fetch calendars');
    }
  }

  /**
   * Create a new calendar
   */
  async createCalendar(name: string, description?: string): Promise<any> {
    try {
      const response = await this.calendar.calendars.insert({
        requestBody: {
          summary: name,
          description: description || `Calendar created by LawBandit for ${name}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating calendar:', error);
      throw new Error('Failed to create calendar');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.oauth2Client.credentials.access_token !== undefined;
  }
}

export default GoogleCalendarService;
