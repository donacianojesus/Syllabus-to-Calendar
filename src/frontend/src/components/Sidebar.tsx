import React from 'react';
import { Home, Plus, Grid } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'upload', label: 'Upload Syllabus', icon: Plus },
    { id: 'calendar', label: 'Calendar', icon: Grid },
  ];

  return (
    <div className="w-64 bg-lawbandit-sidebar h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center">
          <span className="text-white font-bold text-xl">LawBandit</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'text-white bg-gray-700' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};

export default Sidebar;
