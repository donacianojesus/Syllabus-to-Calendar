# LawBandit Calendar

**Live Application:** [https://syllabus-to-calendar-jesus-donacianos-projects.vercel.app](https://syllabus-to-calendar-jesus-donacianos-projects.vercel.app)

An AI-powered web application that automatically parses law school syllabi and converts them into an interactive calendar. Simply upload your PDF syllabus, and the app will extract all important dates, assignments, and exams, presenting them in an easy-to-use interface with both calendar and list views.

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

### **Google Calendar Integration** 🆕
- **OAuth 2.0 Authentication** - Secure connection to Google Calendar
- **One-Click Sync** - Sync all parsed events to Google Calendar with a single click
- **Smart Event Mapping** - Color-coded events based on type (assignments, exams, readings)
- **Calendar Management** - Choose existing calendars or create new ones for courses
- **Real-time Status** - Live sync status and detailed results

### **Technical Features**
- **PDF Processing** - Robust PDF text extraction and parsing
- **Date Recognition** - Intelligent parsing of various date formats
- **Event Classification** - AI-powered categorization and priority assignment
- **Error Handling** - Graceful degradation with detailed error responses

## Getting Started

### Quick Start
1. **Visit the live application:** [https://syllabus-to-calendar-jesus-donacianos-projects.vercel.app](https://syllabus-to-calendar-jesus-donacianos-projects.vercel.app)
2. **Upload a syllabus:** Navigate to Upload page and drag & drop your PDF
3. **Fill in course information:** Provide course name, code, semester, and year
4. **View your calendar:** Switch between calendar and list views to see your assignments

### Demo Workflow
1. **Upload** → PDF syllabus file
2. **Parse** → AI extracts assignments, exams, readings
3. **Navigate** → Calendar auto-opens to correct semester
4. **Visualize** → Switch between calendar and list views
5. **Sync** → Connect to Google Calendar and sync events
6. **Manage** → View upcoming events and activity summaries

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

### Google Calendar API 🆕
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

- **PDF files** (.pdf) - Recommended for best results
- **Maximum file size:** 10MB
- **Course information required:** Course name, code, semester, and year

## Development

### Local Development Setup

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

3. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
# Add your OpenAI API key for LLM parsing (optional)
# Add your Google Calendar credentials for sync functionality
```

4. **Set up Google Calendar Integration (Optional):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3000/google-auth-callback`
   - Copy Client ID and Secret to your `.env` file

5. **Run the development server:**
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run type-check
```

## Project Structure

```
Syllabus-to-Calendar/
├── src/
│   ├── frontend/                   # React application
│   │   ├── src/
│   │   │   ├── components/        # UI components
│   │   │   ├── pages/             # Page components
│   │   │   ├── utils/             # API utilities
│   │   │   └── App.tsx            # Main React app
│   │   └── package.json           # Frontend dependencies
│   ├── backend/                    # Node.js API server
│   │   ├── src/
│   │   │   ├── routes/            # API endpoints
│   │   │   ├── services/           # Parsing services
│   │   │   ├── utils/             # Utilities
│   │   │   └── index.ts           # Express server
│   │   └── package.json           # Backend dependencies
│   └── shared/                     # Shared types and utilities
├── docs/                          # Documentation
└── package.json                   # Root dependencies & scripts
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10MB
ALLOWED_FILE_TYPES=pdf

# LLM Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o
LLM_MAX_TOKENS=10000
LLM_TEMPERATURE=0.1
ENABLE_LLM_PARSING=true
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Acknowledgments

- Built with React, TypeScript, and Node.js
- AI-powered parsing with OpenAI GPT-4o
- Deployed on Vercel
- Designed for law students and academic professionals
