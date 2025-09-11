import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'upload':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Syllabus</h2>
          <p className="text-gray-400">Upload functionality coming soon...</p>
        </div>
      case 'calendar':
        return <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Calendar View</h2>
          <p className="text-gray-400">Calendar functionality coming soon...</p>
        </div>
      default:
        return <HomePage />
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
