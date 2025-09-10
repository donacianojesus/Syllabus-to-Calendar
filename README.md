# LawBandit Calendar 

**Status:** **Backend Complete** - LLM Integration with Smart Fallback System  
**Backend:** Fully functional with AI-powered parsing and regex fallback  
**Frontend:** Ready for development  

This project transforms a law student's syllabus into a clean, organized calendar displaying assignments, readings, and exams. The system uses advanced LLM parsing with intelligent fallback to ensure reliable syllabus processing regardless of API availability.

## **What's Working Now**

- **AI-Powered Parsing** - LLM-based syllabus parsing with OpenAI GPT-3.5-turbo
- **Smart Fallback System** - Automatically falls back to regex parsing when LLM unavailable
- **Syllabus Upload API** - Upload PDF/text files with intelligent parsing
- **Advanced Event Extraction** - Detects assignments, exams, readings, and deadlines
- **Flexible Date Parsing** - Handles multiple date formats and edge cases
- **Event Classification** - AI-powered categorization and priority assignment
- **Confidence Scoring** - Shows parsing quality for both LLM and regex methods
- **Comprehensive API** - Full REST API with health checks, status monitoring, and comparison tools

## Overview

LawBandit Calendar is a web application that automatically parses law school syllabi and converts them into an interactive calendar. Simply upload your syllabus (PDF or text format), and the app will extract all important dates, assignments, and exams, presenting them in an easy-to-use calendar interface.

## Features 

### **Implemented (Backend Complete)**
- **LLM Integration:** OpenAI GPT-3.5-turbo for intelligent syllabus parsing
- **Smart Fallback System:** Automatic fallback to regex parsing when LLM unavailable
- **Syllabus Upload API:** Upload PDF or text files via REST API
- **AI-Powered Parsing:** Advanced text extraction and event detection
- **Flexible Event Detection:** Identifies assignments, exams, readings, and deadlines
- **Intelligent Date Recognition:** Parses various date formats with high accuracy
- **AI Event Classification:** Smart categorization and priority assignment
- **Comprehensive Error Handling:** Graceful degradation and detailed error responses
- **File Validation:** Type checking and size limits (10MB max)
- **API Status Monitoring:** Real-time service health and configuration checks
- **Parsing Comparison:** Side-by-side LLM vs regex parsing results

### **In Development**
- **File Upload UI:** Drag-and-drop interface for syllabus upload
- **Calendar Display:** Monthly calendar view showing parsed events
- **Event Management:** View, edit, and manage calendar events
- **Frontend Integration:** Connect React app to backend API

### **LLM Workflow (Currently Active)**
- **Intelligent Parsing:** LLM handles variability across different syllabus formats
- **Structured JSON Output:** Assignments, exams, and activities with proper categorization
- **Smart Fallback:** Automatic fallback to regex parsing when LLM quota exceeded
- **Cost Optimization:** Text truncation and token management for efficient API usage

#### Example LLM JSON Output
```json
{
  "assignments": [
    {"title": "Assignment 1", "due_date": "2025-09-15", "details": "Read chapters 1-3", "priority": "high"}
  ],
  "exams": [
    {"title": "Midterm Exam", "date": "2025-10-20", "priority": "urgent"}
  ],
  "activities": [
    {"title": "Weekly Reading", "details": "Chapters 4-5", "type": "reading"}
  ],
  "course_info": {
    "course_name": "Constitutional Law",
    "course_code": "LAW 101",
    "semester": "Fall",
    "year": 2025
  },
  "confidence_score": 92
}
```

### **Additional Planned Features**
- **Google Calendar Integration:** Sync events directly to Google Calendar
- **Multiple Syllabus Support:** Handle multiple courses simultaneously
- **Export Options:** Download calendar as PDF or export to other formats
- **Notification System:** Email or browser notifications for upcoming deadlines

### Technical Stack
- **Backend:** Node.js + TypeScript + Express + Multer
- **File Parsing:** pdf-parse, mammoth (for DOCX support)
- **Date Processing:** date-fns for robust date parsing
- **Frontend:** React + Vite + Tailwind CSS
- **Development:** Concurrently for running both servers

**Legacy / Optional Parsing:**  
PDF parsing library (pdf-parse) is still available for initial testing, but the recommended approach is the LLM workflow for more consistent and flexible results.

## **API Endpoints**

### Backend API (Port 3001)
- `GET /health` - Server health check
- `GET /api` - API information and available endpoints
- `GET /api/upload/info` - Upload requirements and supported formats
- `POST /api/upload` - Upload and parse syllabus files (with LLM + regex fallback)
- `GET /api/parse/status` - LLM service status and configuration
- `POST /api/parse/llm` - Direct LLM parsing (text input only)
- `POST /api/parse/compare` - Compare LLM vs regex parsing results

### Frontend (Port 3000)
- `http://localhost:3000` - React application (ready for development)

## **API Usage Examples**

### Upload and Parse Syllabus
```bash
# Upload a syllabus (uses LLM with regex fallback)
curl -X POST http://localhost:3001/api/upload \
  -F "syllabus=@your-syllabus.pdf" \
  -F "courseName=Constitutional Law" \
  -F "courseCode=LAW 101" \
  -F "semester=Fall" \
  -F "year=2024"
```

### Check LLM Service Status
```bash
# Check if LLM parsing is available
curl http://localhost:3001/api/parse/status
```

### Direct LLM Parsing
```bash
# Parse text directly with LLM
curl -X POST http://localhost:3001/api/parse/llm \
  -H "Content-Type: application/json" \
  -d '{"text": "Assignment 1 due September 15, 2024", "courseName": "Test Course"}'
```

### Compare Parsing Methods
```bash
# Compare LLM vs regex parsing
curl -X POST http://localhost:3001/api/parse/compare \
  -H "Content-Type: application/json" \
  -d '{"text": "Assignment 1 due September 15, 2024", "courseName": "Test Course"}'
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/donacianojesus/lawbandit-calendar.git
cd lawbandit-calendar
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
# Add your OpenAI API key for LLM parsing (optional)
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Test the API:**
- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:3000` (In development)
- Health check: `http://localhost:3001/health`
- LLM Status: `http://localhost:3001/api/parse/status`

6. **Test LLM Integration:**
- **With API Key:** LLM parsing will work automatically
- **Without API Key:** System falls back to regex parsing
- **Upload a syllabus:** Use `POST http://localhost:3001/api/upload`

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
lawbandit-calendar/
├── src/
│   ├── backend/                    # Node.js API server (Complete)
│   │   ├── src/
│   │   │   ├── routes/            # Upload API endpoints
│   │   │   ├── services/          # PDF/Text parsing services
│   │   │   ├── utils/             # File upload & date parsing
│   │   │   └── index.ts           # Express server setup
│   │   └── package.json           # Backend dependencies
│   ├── frontend/                   # React application (In Development)
│   │   ├── src/
│   │   │   ├── components/        # UI components (planned)
│   │   │   ├── pages/             # Page components (planned)
│   │   │   ├── hooks/             # Custom React hooks (planned)
│   │   │   └── App.tsx            # Basic React app
│   │   └── package.json           # Frontend dependencies
│   └── shared/                     # Shared types and utilities
│       ├── types.ts               # Calendar event types
│       └── utils.ts               # Shared utility functions
├── docs/                          # Documentation
├── public/                        # Static assets
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
ALLOWED_FILE_TYPES=pdf,txt,doc,docx

# LLM Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-3.5-turbo
LLM_MAX_TOKENS=2000
LLM_TEMPERATURE=0.1
ENABLE_LLM_PARSING=true

# Optional: Google Calendar Integration
GOOGLE_CALENDAR_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
```

## **Testing the API**

### Quick Test (Recommended)
The easiest way to test the API is to place a PDF file in the project root directory and run:

```bash
# Create a simple test script
cat > test-upload.js << 'EOF'
const fs = require('fs');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testUpload() {
  const pdfFiles = fs.readdirSync('.').filter(f => f.endsWith('.pdf'));
  if (pdfFiles.length === 0) {
    console.log('No PDF files found. Place a PDF in the project root.');
    return;
  }
  
  const form = new FormData();
  form.append('syllabus', fs.createReadStream(pdfFiles[0]));
  form.append('courseName', 'Test Course');
  
  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: form
  });
  
  const result = await response.json();
  console.log('Success! Events found:', result.data?.events?.length || 0);
  console.log('Confidence:', result.metadata?.confidence + '%');
}

testUpload();
EOF

# Run the test
node test-upload.js
```

### Method 1: Using cURL
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "syllabus=@your-syllabus.pdf" \
  -F "courseName=Constitutional Law" \
  -F "courseCode=LAW 101"
```

### Method 2: Using PowerShell (Windows)
```powershell
$form = @{
    syllabus = Get-Item "path\to\your\syllabus.pdf"
    courseName = "Constitutional Law"
    courseCode = "LAW 101"
}
Invoke-RestMethod -Uri "http://localhost:3001/api/upload" -Method Post -Form $form
```

### Method 3: Using Node.js (Full Example)
```javascript
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  const form = new FormData();
  form.append('syllabus', fs.createReadStream('syllabus.pdf'));
  form.append('courseName', 'Constitutional Law');
  form.append('courseCode', 'LAW 101');
  form.append('semester', 'Fall');
  form.append('year', '2024');

  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: form
  });

  const result = await response.json();
  console.log('Response:', JSON.stringify(result, null, 2));
}

testUpload();
```

### Method 4: Using Postman or Similar Tools
1. Set method to `POST`
2. URL: `http://localhost:3001/api/upload`
3. Body type: `form-data`
4. Add fields:
   - `syllabus` (file): Select your PDF
   - `courseName` (text): "Test Course"
   - `courseCode` (text): "TEST 101"

## **Expected Response**

The API returns structured data including:
- **Course Information:** Name, code, semester, year
- **Parsed Events:** Array of calendar events with dates, types, and priorities
- **Confidence Score:** Parsing quality (0-100%)
- **Parsing Method:** Indicates whether LLM or regex parsing was used
- **Metadata:** File info, parsing statistics, and service status

### Sample Response (LLM Parsing)
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

### Sample Response (Regex Fallback)
```json
{
  "success": true,
  "data": {
    "courseName": "Constitutional Law",
    "courseCode": "LAW 101",
    "events": [...]
  },
  "metadata": {
    "confidence": 75,
    "method": "regex",
    "fileType": "pdf",
    "eventsFound": 3
  }
}
```

## **Testing Different File Types**

### Supported Formats
- **PDF files** (.pdf) - Recommended for best results
- **Text files** (.txt) - Good for testing parsing logic
- **Word documents** (.docx) - Planned for future support

### Test Files
You can test with:
1. **Your own syllabus PDF** - Most realistic test
2. **Sample text file** - Create a simple `.txt` file with assignment dates
3. **Generated test PDF** - Use the script in the project to create test content

### Troubleshooting

**Common Issues:**
- **"No file uploaded"** - Make sure the file field is named `syllabus`
- **"Invalid file type"** - Only PDF and TXT files are supported
- **"File size exceeds limit"** - Maximum file size is 10MB
- **"Multipart: Boundary not found"** - Use proper multipart/form-data format

**Low Confidence Scores:**
- Try with a different PDF format
- Ensure the syllabus contains clear assignment dates
- Check that dates are in recognizable formats (MM/DD/YYYY, Month DD, etc.)

## **LLM Workflow Overview (Currently Active)**
1. Extract syllabus text from PDF and clean it
2. Send cleaned text to LLM → return structured JSON with assignments, exams, activities
3. Validate JSON → convert to calendar events with proper categorization
4. **Smart Fallback:** If LLM fails, automatically use regex parsing
5. Return results with parsing method and confidence score

## **Next for Development**

1. **File Upload UI** - Build React component for drag-and-drop upload
2. **Calendar Display** - Show parsed events in monthly calendar view  
3. **Event Management** - Edit, delete, and manage calendar events
4. **Frontend Integration** - Connect React app to backend API
5. **Activities Panel** - Handle undated events and activities

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request



## **Current Status**

- **Backend API:** Fully functional with LLM integration and smart fallback
- **LLM Parsing:** OpenAI GPT-3.5-turbo integration with quota management
- **File Processing:** PDF and text file support with intelligent parsing
- **Event Extraction:** AI-powered detection of assignments, exams, and deadlines
- **Smart Fallback:** Automatic fallback to regex parsing when LLM unavailable
- **API Monitoring:** Real-time service status and configuration checks
- **Frontend UI:** Ready for Phase 2 development - basic React app running
- **Calendar Display:** Planned for Phase 2
- **Event Management:** Planned for Phase 2

## **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


---

**Note:** The core backend functionality is complete and ready for testing. The frontend interface is the next development priority.
