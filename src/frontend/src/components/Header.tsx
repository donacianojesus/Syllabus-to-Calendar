import React from 'react';

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
