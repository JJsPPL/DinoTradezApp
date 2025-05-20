import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingIndicator = ({ size = 'md', fullscreen = false, text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };
  
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
        <div className="text-center">
          <FaSpinner className={`${sizeClasses[size]} text-green-400 animate-spin mx-auto mb-4`} />
          <div className="text-white font-medium">{text}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <FaSpinner className={`${sizeClasses[size]} text-green-400 animate-spin mb-4`} />
      <div className="text-gray-300 font-medium">{text}</div>
    </div>
  );
};

export default LoadingIndicator;