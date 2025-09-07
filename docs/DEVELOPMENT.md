# Development Guide

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Install root dependencies:**
```bash
npm install
```

2. **Install all project dependencies:**
```bash
npm run install:all
```

### Development Commands

#### Root Level Commands
```bash
# Start both frontend and backend in development mode
npm run dev

# Build both frontend and backend for production
npm run build

# Run tests for both frontend and backend
npm test

# Lint both frontend and backend
npm run lint

# Type check both frontend and backend
npm run type-check
```

#### Backend Commands (from src/backend/)
```bash
# Start backend development server
npm run dev

# Build backend
npm run build

# Start production server
npm start

# Run backend tests
npm test

# Run backend tests in watch mode
npm run test:watch

# Lint backend code
npm run lint

# Type check backend
npm run type-check
```

#### Frontend Commands (from src/frontend/)
```bash
# Start frontend development server
npm run dev

# Build frontend
npm run build

# Preview production build
npm run preview

# Run frontend tests
npm test

# Run frontend tests with UI
npm run test:ui

# Run frontend tests with coverage
npm run test:coverage

# Lint frontend code
npm run lint

# Type check frontend
npm run type-check
```

## Project Structure

```
lawbandit-calendar/
├── src/
│   ├── backend/          # Node.js API server
│   │   ├── src/          # Backend source code
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Business logic
│   │   │   └── utils/    # Helper functions
│   │   ├── dist/         # Compiled JavaScript
│   │   └── package.json  # Backend dependencies
│   ├── frontend/         # React application
│   │   ├── src/          # Frontend source code
│   │   │   ├── components/ # UI components
│   │   │   ├── pages/    # Page components
│   │   │   ├── hooks/    # Custom React hooks
│   │   │   └── utils/    # Frontend utilities
│   │   ├── dist/         # Built frontend
│   │   └── package.json  # Frontend dependencies
│   └── shared/           # Shared types and utilities
├── public/               # Static assets
├── docs/                 # Documentation
├── tests/                # Integration tests
└── package.json          # Root dependencies
```

## Development Workflow

1. **Start development servers:**
   ```bash
   npm run dev
   ```
   This will start:
   - Backend API on http://localhost:3001
   - Frontend app on http://localhost:3000

2. **Make changes:**
   - Backend changes will auto-reload via nodemon
   - Frontend changes will hot-reload via Vite

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Check code quality:**
   ```bash
   npm run lint
   npm run type-check
   ```

## Environment Variables

Create a `.env` file in the root directory (copy from `env.example`):

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

## API Endpoints

### Health Check
- `GET /health` - Server health status

### API Info
- `GET /api` - API information and available endpoints

### Syllabus Upload (Planned)
- `POST /api/upload` - Upload and parse syllabus

### Events Management (Planned)
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request
