import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-center mb-8">
                LawBandit Calendar
              </h1>
              <div className="card max-w-md mx-auto">
                <p className="text-center text-gray-600">
                  Welcome to LawBandit Calendar! 
                  <br />
                  Upload your syllabus to get started.
                </p>
              </div>
            </div>
          } />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
