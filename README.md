# LawBandit Calendar

**Live Application:** [https://syllabus-to-calendar-kappa.vercel.app](https://syllabus-to-calendar-kappa.vercel.app)

An intelligent academic calendar application that transforms course syllabi into organized, actionable schedules. LawBandit Calendar uses advanced AI to parse syllabi, extract assignment deadlines, and create visual calendars with seamless Google Calendar integration.

## Overview

LawBandit Calendar streamlines academic planning by automatically converting PDF syllabi into interactive calendar events. The application leverages OpenAI's GPT-4o model to intelligently parse various syllabus formats, extract key dates and assignments, and present them in an intuitive calendar interface. With built-in Google Calendar integration, students can seamlessly sync their academic schedule with their personal calendar system.

## Features

### **Universal Syllabus Parser**
- **AI-Powered Parsing** - Uses OpenAI GPT-4o for intelligent syllabus parsing
- **Smart Fallback System** - Automatically falls back to regex parsing when LLM unavailable
- **Format Flexibility** - Handles any syllabus format including detailed weekly schedules and structured assignment lists
- **Specific Assignment Detection** - Extracts exact case names, page numbers, and assignment details

### **Interactive Calendar**
- **Monthly Calendar View** - Visual representation of assignments and deadlines
- **List View Toggle** - Switch between calendar and list views with sorting options
- **Smart Auto-Navigation** - Calendar automatically opens to correct semester/month
- **Event Visualization** - Color-coded events with priority indicators

### **Professional Interface**
- **Dark Theme Design** - Professional `#171514` background with clean white accents
- **Responsive Layout** - Mobile-friendly sidebar and main content area
- **Drag & Drop Upload** - Easy file upload with validation and progress indicators
- **Clean Typography** - Serif headings with sans-serif body text

### **Google Calendar Integration**
- **OAuth 2.0 Authentication** - Secure connection to Google Calendar with industry-standard security
- **One-Click Sync** - Instantly sync all parsed syllabus events to your Google Calendar
- **Smart Event Mapping** - Intelligent color-coding based on event types (assignments, exams, readings, activities)
- **Calendar Management** - Choose from existing calendars or create dedicated course calendars
- **Real-time Status** - Live sync status with detailed success/failure reporting
- **Event Deduplication** - Prevents duplicate events when re-syncing updated syllabi
- **Cross-Platform Access** - Sync events appear in all your Google Calendar clients (web, mobile, desktop)

### **Technical Features**
- **PDF Processing** - Robust PDF text extraction and parsing
- **Date Recognition** - Intelligent parsing of various date formats
- **Event Classification** - AI-powered categorization and priority assignment
- **Error Handling** - Graceful degradation with detailed error responses

## Getting Started

### Production Usage
1. **Access the application:** [https://syllabus-to-calendar-kappa.vercel.app](https://syllabus-to-calendar-kappa.vercel.app)
2. **Upload a syllabus:** Navigate to Upload page and drag & drop your PDF
3. **Provide course details:** Enter course name, code, semester, and year
4. **View your calendar:** Switch between calendar and list views to see your assignments
5. **Connect Google Calendar:** Click "Connect Google Calendar" to authenticate with your Google account
6. **Sync events:** Use "Sync to Google Calendar" to transfer all parsed events to your Google Calendar

### Application Workflow
1. **Upload** → PDF syllabus file with course details
2. **Parse** → AI extracts assignments, exams, and readings
3. **Navigate** → Calendar auto-opens to relevant semester
4. **Visualize** → Switch between calendar and list views
5. **Sync** → Connect to Google Calendar and sync events
6. **Manage** → View upcoming events and track progress

## Google Calendar Sync

The Google Calendar integration feature allows you to seamlessly transfer your parsed syllabus events to your personal Google Calendar. This ensures all your academic deadlines are integrated with your existing calendar system and accessible across all your devices.

### How It Works

1. **Authentication**: Click "Connect Google Calendar" to securely authenticate with your Google account using OAuth 2.0
2. **Calendar Selection**: Choose an existing calendar or create a new dedicated calendar for your course
3. **Event Sync**: Click "Sync to Google Calendar" to transfer all parsed events with proper formatting
4. **Cross-Platform Access**: Events appear instantly in Google Calendar web, mobile apps, and desktop clients

### Event Mapping

- **Assignments** → Red events with high priority
- **Exams** → Orange events with high priority  
- **Readings** → Blue events with medium priority
- **Activities** → Green events with low priority

### Benefits

- **Unified Schedule**: All academic and personal events in one place
- **Mobile Access**: View and manage events on your phone or tablet
- **Reminder Integration**: Leverage Google Calendar's reminder system
- **Sharing Capability**: Share your academic calendar with family or study groups
- **Offline Access**: View events even when offline through Google Calendar mobile apps

## Technical Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + TypeScript + Express (Vercel Serverless Functions)
- **AI Integration:** OpenAI GPT-4o for intelligent syllabus parsing
- **Google Calendar:** googleapis library for calendar integration
- **File Processing:** pdf-parse for PDF text extraction
- **Date Processing:** date-fns for robust date parsing
- **UI Components:** react-dropzone, react-calendar, lucide-react icons
- **Deployment:** Vercel (Frontend + Backend)

## API Endpoints

### Backend API
- `GET /api/health` - Server health check
- `GET /api` - API information and available endpoints
- `POST /api/upload` - Upload and parse syllabus files
- `GET /api/parse/status` - LLM service status and configuration
- `POST /api/parse/llm` - Direct LLM parsing (text input only)

### Google Calendar API
- `GET /api/google-calendar/auth-url` - Get OAuth authorization URL
- `POST /api/google-calendar/auth-callback` - Exchange code for tokens
- `POST /api/google-calendar/set-credentials` - Set OAuth credentials
- `POST /api/google-calendar/sync-events` - Sync events to Google Calendar
- `GET /api/google-calendar/calendars` - Get user's calendars
- `POST /api/google-calendar/create-calendar` - Create new calendar
- `GET /api/google-calendar/status` - Check authentication status

## Example Usage

### Upload and Parse Syllabus
```bash
curl -X POST https://syllabus-to-calendar.vercel.app/api/upload \
  -F "file=@your-syllabus.pdf" \
  -F "courseName=Constitutional Law" \
  -F "courseCode=LAW 101" \
  -F "semester=Fall" \
  -F "year=2024"
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "courseName": "Constitutional Law",
    "courseCode": "LAW 101",
    "events": [
      {
        "id": "assignment-1-case-brief-2024-09-06",
        "title": "Assignment 1: Case Brief",
        "date": "2024-09-06T04:00:00.000Z",
        "type": "assignment",
        "priority": "high",
        "completed": false
      }
    ]
  },
  "metadata": {
    "confidence": 92,
    "method": "llm",
    "fileType": "pdf",
    "eventsFound": 4
  }
}
```

## Supported Formats

- **PDF files** (.pdf) - Primary supported format
- **Maximum file size:** 10MB
- **Required information:** Course name, code, semester, and year

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- OpenAI API key (for LLM parsing functionality)
- Google Cloud Platform account (for Calendar integration)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/donacianojesus/Syllabus-to-Calendar.git
cd Syllabus-to-Calendar
```

2. **Install dependencies:**
```bash
npm install
npm run install:all
```

3. **Configure environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Set up Google Calendar Integration:**
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3000/google-auth-callback`
   - Copy Client ID and Secret to your `.env` file

5. **Start development servers:**
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend servers
npm run dev:frontend     # Start frontend development server
npm run dev:backend      # Start backend development server

# Building
npm run build            # Build both frontend and backend for production
npm run build:frontend   # Build frontend for production
npm run build:backend    # Build backend for production

# Quality Assurance
npm run lint             # Run ESLint on all code
npm run type-check       # Run TypeScript type checking
npm test                 # Run test suite

# Installation
npm run install:all      # Install dependencies for all packages
```

## Project Architecture

```
Syllabus-to-Calendar/
├── src/
│   ├── frontend/                   # React TypeScript application
│   │   ├── src/
│   │   │   ├── components/        # Reusable UI components
│   │   │   │   ├── Calendar.tsx   # Calendar view component
│   │   │   │   ├── FileUploadComponent.tsx
│   │   │   │   ├── GoogleCalendarAuth.tsx
│   │   │   │   ├── GoogleCalendarSync.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── ListView.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── pages/             # Route components
│   │   │   │   ├── CalendarPage.tsx
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── UploadPage.tsx
│   │   │   │   └── GoogleAuthCallback.tsx
│   │   │   ├── utils/             # API client utilities
│   │   │   │   ├── api.ts
│   │   │   │   └── googleCalendarApi.ts
│   │   │   ├── App.tsx            # Main application component
│   │   │   ├── main.tsx           # Application entry point
│   │   │   └── index.css          # Global styles
│   │   ├── package.json           # Frontend dependencies
│   │   ├── vite.config.ts         # Vite configuration
│   │   ├── tailwind.config.js     # Tailwind CSS configuration
│   │   └── vercel.json            # Vercel deployment configuration
│   ├── backend/                    # Node.js Express API server
│   │   ├── src/
│   │   │   ├── routes/            # API route handlers
│   │   │   │   ├── googleCalendar.ts
│   │   │   │   └── upload.ts
│   │   │   ├── services/          # Business logic services
│   │   │   │   ├── llmParser.ts   # OpenAI integration
│   │   │   │   ├── pdfParser.ts   # PDF processing
│   │   │   │   ├── syllabusParser.ts
│   │   │   │   ├── textParser.ts
│   │   │   │   └── googleCalendarService.ts
│   │   │   ├── types/             # TypeScript type definitions
│   │   │   │   ├── llm-schema.ts
│   │   │   │   └── shared.ts
│   │   │   ├── utils/             # Utility functions
│   │   │   │   ├── dateParser.ts
│   │   │   │   └── fileUpload.ts
│   │   │   └── index.ts           # Express server entry point
│   │   ├── package.json           # Backend dependencies
│   │   ├── tsconfig.json          # TypeScript configuration
│   │   └── vercel.json            # Vercel serverless configuration
│   └── shared/                     # Shared types and utilities
│       ├── types.ts               # Common type definitions
│       └── utils.ts               # Shared utility functions
├── docs/                          # Documentation
│   └── DEVELOPMENT.md             # Development guidelines
├── api/                           # Vercel serverless functions
├── scripts/                       # Build and deployment scripts
├── package.json                   # Root package configuration
├── tsconfig.json                  # Root TypeScript configuration
└── README.md                      # Project documentation
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload Settings
MAX_FILE_SIZE=10MB
ALLOWED_FILE_TYPES=pdf

# OpenAI Integration
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o
LLM_MAX_TOKENS=10000
LLM_TEMPERATURE=0.1
ENABLE_LLM_PARSING=true

# Google Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/google-auth-callback
```

### Required API Keys

- **OpenAI API Key**: Required for AI-powered syllabus parsing
- **Google OAuth Credentials**: Required for Google Calendar integration

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Backend Runtime:** Node.js with Express
- **AI Integration:** OpenAI GPT-4o for intelligent parsing
- **Cloud Platform:** Vercel for deployment and hosting
- **Calendar Integration:** Google Calendar API
- **Styling:** Tailwind CSS with custom design system