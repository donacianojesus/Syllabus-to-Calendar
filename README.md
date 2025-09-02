# LawBandit Calendar Feature 

**Status:** Currently being implemented — not yet complete.

This project aims to transform a law student's syllabus into a clean, organized calendar displaying assignments, readings, and exams. Designed for clarity, usability, and deployment-ready code, it will help students manage their academic schedules efficiently.

## Overview

LawBandit Calendar is a web application that automatically parses law school syllabi and converts them into an interactive calendar. Simply upload your syllabus (PDF or text format), and the app will extract all important dates, assignments, and exams, presenting them in an easy-to-use calendar interface.

## Features 

### Core Functionality
- **Syllabus Input:** Upload a PDF or text syllabus and parse it to extract:
  - Assignment names and descriptions
  - Due dates and deadlines
  - Exam schedules
  - Reading assignments
  - Class schedules

### Calendar Display
- **Monthly View:** Clean, intuitive monthly calendar layout
- **Event Details:** Each event includes title, date, time, and description
- **Event Types:** Different visual indicators for assignments, exams, and readings
- **Responsive Design:** Optimized for both desktop and mobile devices

### Technical Stack
- **Backend:** Node.js + TypeScript API for syllabus parsing
- **Frontend:** React with modern UI components
- **Deployment:** Vercel-ready with seamless frontend/backend integration

## Stretch Goals

- **Google Calendar Integration:** Sync events directly to your Google Calendar
- **Color-coded Events:** Visual distinction by event type (assignment, exam, reading)
- **Manual Event Management:** Add, edit, or delete events manually
- **Export Options:** Download calendar as PDF or export to other calendar formats
- **Multiple Syllabus Support:** Handle multiple courses simultaneously
- **Notification System:** Email or browser notifications for upcoming deadlines

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

5. **Open your browser:**
Navigate to `http://localhost:3000`

6. **Upload a syllabus:**
Use the upload interface to test with a sample law school syllabus

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

## 📁 Project Structure

```
lawbandit-calendar/
├── src/
│   ├── backend/          # Node.js API server
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   ├── frontend/         # React application
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Frontend utilities
│   └── shared/           # Shared types and utilities
├── public/               # Static assets
├── docs/                 # Documentation
└── tests/                # Test files
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

## Usage

1. **Upload Syllabus:** Drag and drop or select a PDF/text file containing your course syllabus
2. **Review Parsed Events:** The app will automatically extract and display all important dates
3. **View Calendar:** Browse your schedule in the monthly calendar view
4. **Manage Events:** Click on events to view details or make manual adjustments
5. **Export (Future):** Sync with Google Calendar or export to other formats

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request



---

**Note:** This project is currently in active development. Some features may not be fully functional yet. Check the [Issues](https://github.com/yourusername/lawbandit-calendar/issues) page for known limitations and planned improvements.
