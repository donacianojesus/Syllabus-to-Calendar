# LawBandit Calendar 

**Status:** **Core Backend Complete** - Syllabus Upload API Fully Functional

This project transforms a law student's syllabus into a clean, organized calendar displaying assignments, readings, and exams. Designed for clarity, usability, and deployment-ready code, it helps students manage their academic schedules efficiently.

## **What's Working Now**

- **Syllabus Upload API** - Upload PDF/text files and parse them automatically
- **Smart Event Extraction** - Identifies assignments, exams, readings, and deadlines
- **Date Parsing** - Handles multiple date formats (MM/DD/YYYY, Month DD, etc.)
- **Event Classification** - Automatically categorizes and prioritizes events
- **Confidence Scoring** - Shows parsing quality (typically 80-90% accuracy)
- **RESTful API** - Complete backend with health checks and error handling

## Overview

LawBandit Calendar is a web application that automatically parses law school syllabi and converts them into an interactive calendar. Simply upload your syllabus (PDF or text format), and the app will extract all important dates, assignments, and exams, presenting them in an easy-to-use calendar interface.

## Features 

### **Implemented (Backend Complete)**
- **Syllabus Upload API:** Upload PDF or text files via REST API
- **Smart Text Parsing:** Extracts text from PDFs using pdf-parse library
- **Event Detection:** Identifies assignments, exams, readings, and deadlines
- **Date Recognition:** Parses various date formats automatically
- **Event Classification:** Categorizes events by type and priority
- **Error Handling:** Comprehensive validation and error responses
- **File Validation:** Type checking and size limits (10MB max)

### **In Development (Next Phase)**
- **File Upload UI:** Drag-and-drop interface for syllabus upload
- **Calendar Display:** Monthly calendar view showing parsed events
- **Event Management:** View, edit, and manage calendar events
- **Frontend Integration:** Connect React frontend to backend API

### **Planned Features**
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

## **API Endpoints**

### Backend API (Port 3001)
- `GET /health` - Server health check
- `GET /api` - API information and available endpoints
- `GET /api/upload/info` - Upload requirements and supported formats
- `POST /api/upload` - Upload and parse syllabus files

### Frontend (Port 3000)
- `http://localhost:3000` - React application (in development)

## **API Usage Example**

```bash
# Upload a syllabus
curl -X POST http://localhost:3001/api/upload \
  -F "syllabus=@your-syllabus.pdf" \
  -F "courseName=Constitutional Law" \
  -F "courseCode=LAW 101" \
  -F "semester=Fall" \
  -F "year=2024"

# Response includes parsed events with dates, types, and priorities
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/lawbandit-calendar.git
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
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Test the API:**
- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:3000` (in development)
- Health check: `http://localhost:3001/health`

6. **Upload a syllabus:**
- Use the API directly: `POST http://localhost:3001/api/upload`
- Or test with your own PDF/text syllabus file

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
PORT=3000
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10MB
ALLOWED_FILE_TYPES=pdf,txt,doc,docx

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
- **Metadata:** File info, parsing statistics

### Sample Response
```json
{
  "success": true,
  "data": {
    "courseName": "Constitutional Law",
    "courseCode": "LAW 101",
    "events": [
      {
        "id": "assignment-1-2024-09-06",
        "title": "Assignment 1: Case Brief",
        "date": "2024-09-06T04:00:00.000Z",
        "type": "assignment",
        "priority": "high",
        "completed": false
      }
    ]
  },
  "metadata": {
    "confidence": 85,
    "fileType": "pdf",
    "eventsFound": 4
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

## **Next Development Phase**

1. **File Upload UI** - Build React component for drag-and-drop upload
2. **Calendar Display** - Show parsed events in monthly calendar view
3. **Event Management** - Edit, delete, and manage calendar events
4. **Frontend Integration** - Connect React app to backend API

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request



## **Current Status**

- **Backend API:** Fully functional syllabus upload and parsing
- **File Processing:** PDF and text file support with smart parsing
- **Event Extraction:** Automatic detection of assignments, exams, and deadlines
- **Frontend UI:** In development - basic React app running
- **Calendar Display:** Planned for next phase
- **Event Management:** Planned for next phase

## **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


---

**Note:** The core backend functionality is complete and ready for testing. The frontend interface is the next development priority.
