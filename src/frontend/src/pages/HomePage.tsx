import React from 'react';
import { Upload, Calendar, BookOpen } from 'lucide-react';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Total Events', value: '0', icon: Calendar },
    { label: 'Courses', value: '0', icon: BookOpen },
    { label: 'Files Uploaded', value: '0', icon: Upload },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Welcome to LawBandit Calendar
        </h2>
        <p className="text-gray-400 text-lg">
          Transform your law school syllabus into an organized calendar
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-lawbandit">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-lawbandit-muted">{stat.label}</p>
                </div>
                <Icon className="w-8 h-8 text-white" />
              </div>
            </div>
          );
        })}
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
            Upload your PDF or text syllabus to automatically extract assignments, exams, and deadlines.
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
            View your events in a clean, organized calendar format with filtering and search options.
          </p>
          <button 
            className="btn-secondary"
            onClick={() => onNavigate?.('calendar')}
          >
            Open Calendar
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <span>No recent activity</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <span>Upload your first syllabus to get started</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
