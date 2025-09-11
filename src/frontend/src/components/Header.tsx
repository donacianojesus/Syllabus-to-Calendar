import React from 'react';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-lawbandit-dark border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Bell size={20} />
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Settings size={20} />
          </button>

          {/* Upload Button */}
          <button className="btn-primary">
            Upload Syllabus
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
