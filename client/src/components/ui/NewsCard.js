import React from 'react';
import { FaExternalLinkAlt, FaClock } from 'react-icons/fa';

const NewsCard = ({ article }) => {
  if (!article) return null;
  
  const { title, summary, url, publisher, publishedAt, relatedSymbols } = article;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };
  
  return (
    <div className="card hover:bg-gray-750 transition-colors">
      <div className="flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-blue-400 font-medium">
            {publisher || 'Unknown Source'}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <FaClock className="mr-1" />
            {formatDate(publishedAt)}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        
        <p className="text-gray-300 text-sm mb-4">
          {summary && summary.length > 150 
            ? `${summary.substring(0, 150)}...` 
            : summary || 'No summary available'}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          {relatedSymbols && relatedSymbols.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {relatedSymbols.slice(0, 3).map((symbol) => (
                <span key={symbol} className="text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
                  {symbol}
                </span>
              ))}
              {relatedSymbols.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-700 rounded-md text-gray-300">
                  +{relatedSymbols.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            Read More <FaExternalLinkAlt className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;