import React from 'react';
import { Upload, Calendar } from 'lucide-react';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Welcome to Syllabus to Calendar
        </h2>
        <p className="text-gray-400 text-lg">
          Transform your law school syllabus into an organized calendar
        </p>
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="card">
          <div className="flex items-center space-x-4 mb-4">
            <Upload className="w-8 h-8 text-white" />
            <h3 className="text-xl font-bold text-white">Upload Syllabus</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Upload your PDF syllabus to automatically extract assignments, exams, and deadlines.
          </p>
          <button 
            className="btn-primary"
            onClick={() => onNavigate?.('upload')}
          >
            Start Upload
          </button>
        </div>

        {/* Calendar Section */}
        <div className="card">
          <div className="flex items-center space-x-4 mb-4">
            <Calendar className="w-8 h-8 text-white" />
            <h3 className="text-xl font-bold text-white">View Calendar</h3>
          </div>
          <p className="text-gray-400 mb-4">
            View your events in a clean, organized calendar format.
          </p>
          <button 
            className="btn-secondary"
            onClick={() => onNavigate?.('calendar')}
          >
            Open Calendar
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
