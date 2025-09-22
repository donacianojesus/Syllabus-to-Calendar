import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'home':
        return 'Dashboard';
      case 'upload':
        return 'Upload Syllabus';
      case 'calendar':
        return 'Calendar';
      case 'shared':
        return 'Shared Calendars';
      case 'tutorials':
        return 'Tutorials';
      case 'subscribe':
        return 'Subscribe';
      default:
        return 'Syllabus to Calendar';
    }
  };

  return (
    <div className="flex h-screen bg-app-dark">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={getPageTitle(currentPage)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-app-dark">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
