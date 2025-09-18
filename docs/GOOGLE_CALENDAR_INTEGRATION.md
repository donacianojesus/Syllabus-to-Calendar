# Google Calendar Integration

This document explains how to set up and use the Google Calendar integration feature in the LawBandit Calendar application.

## Overview

The Google Calendar integration allows users to:
- Authenticate with their Google Calendar account
- Sync parsed syllabus events directly to Google Calendar
- Choose which calendar to sync events to
- Create new calendars for specific courses
- View sync status and results

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### 2. OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted
4. Set the application type to "Web application"
5. Add authorized redirect URIs:
   - For development: `http://localhost:3000/google-auth-callback`
   - For production: `https://your-domain.com/google-auth-callback`
6. Copy the Client ID and Client Secret

### 3. Environment Variables

Add the following variables to your `.env` file:

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/google-auth-callback
```

For production, update the redirect URI to match your domain.

## Features

### Authentication

- **OAuth 2.0 Flow**: Secure authentication using Google's OAuth 2.0
- **Popup Window**: Authentication happens in a popup to avoid disrupting the user experience
- **Token Management**: Automatic token refresh and credential management
- **Status Checking**: Real-time authentication status

### Event Syncing

- **Smart Filtering**: Automatically filters out events with placeholder dates (2099)
- **Event Mapping**: Converts internal event format to Google Calendar format
- **Color Coding**: Events are color-coded based on type:
  - Assignments: Blue
  - Exams: Red
  - Readings: Green
  - Classes: Purple
  - Deadlines: Orange
  - Other: Gray

### Calendar Management

- **Calendar Selection**: Choose which Google Calendar to sync to
- **Calendar Creation**: Create new calendars for specific courses
- **Primary Calendar**: Default option to sync to user's primary calendar

### Error Handling

- **Comprehensive Error Messages**: Clear error messages for different failure scenarios
- **Partial Sync Results**: Shows how many events synced successfully vs failed
- **Retry Mechanisms**: Easy retry for failed operations

## API Endpoints

### Backend Endpoints

- `GET /api/google-calendar/auth-url` - Get OAuth authorization URL
- `POST /api/google-calendar/auth-callback` - Exchange code for tokens
- `POST /api/google-calendar/set-credentials` - Set OAuth credentials
- `POST /api/google-calendar/sync-events` - Sync events to Google Calendar
- `GET /api/google-calendar/calendars` - Get user's calendars
- `POST /api/google-calendar/create-calendar` - Create new calendar
- `GET /api/google-calendar/status` - Check authentication status

### Frontend Components

- `GoogleCalendarAuth` - Handles authentication flow
- `GoogleCalendarSync` - Manages event syncing
- `GoogleAuthCallback` - OAuth callback page

## Usage Flow

1. **Upload Syllabus**: User uploads a syllabus and parses it
2. **Navigate to Calendar**: Go to the calendar view
3. **Connect Google Calendar**: Click "Connect Google Calendar" button
4. **Authenticate**: Complete OAuth flow in popup window
5. **Choose Calendar**: Select which calendar to sync to (optional)
6. **Sync Events**: Click "Sync to Google Calendar" button
7. **View Results**: See sync status and results

## Event Format

Events are synced with the following Google Calendar format:

```json
{
  "summary": "Assignment Title",
  "description": "Course: Course Name\nPriority: HIGH\nAssignment description",
  "start": {
    "dateTime": "2024-09-06T10:00:00.000Z"
  },
  "end": {
    "dateTime": "2024-09-06T11:00:00.000Z"
  },
  "colorId": "1",
  "reminders": {
    "useDefault": true
  }
}
```

## Security Considerations

- **OAuth 2.0**: Uses industry-standard OAuth 2.0 for secure authentication
- **Token Storage**: Tokens are stored securely and refreshed automatically
- **HTTPS Required**: Production deployment requires HTTPS for OAuth
- **Scope Limitation**: Only requests necessary calendar permissions

## Troubleshooting

### Common Issues

1. **"Popup blocked"**: Allow popups for the site
2. **"Authentication failed"**: Check Google Cloud Console configuration
3. **"Failed to sync events"**: Verify calendar permissions and API quotas
4. **"Invalid redirect URI"**: Ensure redirect URI matches exactly in Google Cloud Console

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Test OAuth flow in Google Cloud Console
4. Check Google Calendar API quotas and limits

## Development Notes

- The integration uses the `googleapis` library for backend operations
- Frontend uses popup-based OAuth for better UX
- Events are filtered to exclude placeholder dates (2099)
- Color coding helps users quickly identify event types
- Comprehensive error handling provides clear feedback

## Future Enhancements

- **Bidirectional Sync**: Sync changes from Google Calendar back to the app
- **Event Updates**: Update existing events instead of creating duplicates
- **Calendar Templates**: Pre-configured calendar templates for different course types
- **Batch Operations**: More efficient syncing for large numbers of events
- **Sync Scheduling**: Automatic periodic syncing
