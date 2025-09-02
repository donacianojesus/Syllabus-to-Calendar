# LawBandit Calendar Feature (Work in Progress)

**Status:** Currently being implemented — not yet complete.

This project aims to transform a law student’s syllabus into a clean, organized calendar displaying assignments, readings, and exams. Designed for clarity, usability, and deployment-ready code, it will help students manage their academic schedules efficiently.

---

## Features 

- **Syllabus Input:** Upload a PDF or text syllabus and parse it to extract:
  - Assignment names
  - Due dates
  - Exams and readings
- **Calendar Display:**  
  - Monthly calendar view (bonus: list view)  
  - Each event includes title, date, and optional description
- **Backend:** Node.js + TypeScript API endpoint to parse syllabus and return events
- **Frontend:** React (or vanilla JS/TS) calendar interface, simple and intuitive, responsive for desktop and mobile
- **Deployment:** Intended for Vercel; frontend and backend will be connected seamlessly

---

## Stretch Goals

- Google Calendar integration for syncing events
- Color-coded events by type (assignment, exam, reading)
- Manual edit/add events
- Additional UI enhancements for improved usability

---

## Installation / Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/lawbandit-calendar.git
```
2. Install dependencies:
``` bash
npm install
```
3. Run the backend server

```bash
npm run dev
```
4. Open the frontend in your browser (default: http://localhost:3000)
   
5. Upload a sample syllabus to see events populate the calendar (feature currently in progress)
