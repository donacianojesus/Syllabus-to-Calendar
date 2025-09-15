import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import CalendarPage from './pages/CalendarPage'
import { CalendarEvent } from '../shared/types'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [courseInfo, setCourseInfo] = useState<{
    courseName: string;
    courseCode?: string;
    semester?: string;
    year?: number;
  } | null>(null)

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  const handleUploadSuccess = (uploadResult: any) => {
    if (uploadResult.success && uploadResult.data) {
      // Convert API response events to CalendarEvent format
      const calendarEvents: CalendarEvent[] = uploadResult.data.events.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        time: event.time,
        type: event.type as any,
        course: uploadResult.data.courseName,
        priority: event.priority as any,
        completed: event.completed || false
      }))

      setEvents(calendarEvents)
      setCourseInfo({
        courseName: uploadResult.data.courseName,
        courseCode: uploadResult.data.courseCode,
        semester: uploadResult.data.semester,
        year: uploadResult.data.year
      })
      
      // Navigate to calendar view after successful upload
      setCurrentPage('calendar')
    }
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />
      case 'upload':
        return <UploadPage onUploadSuccess={handleUploadSuccess} />
      case 'calendar':
        return <CalendarPage events={events} courseInfo={courseInfo || undefined} />
      default:
        return <HomePage onNavigate={handlePageChange} />
    }
  }

  return (
    <Router>
      <Layout currentPage={currentPage} onPageChange={handlePageChange}>
        {renderPageContent()}
      </Layout>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App
