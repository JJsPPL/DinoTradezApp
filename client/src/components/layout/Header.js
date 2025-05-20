import React from 'react';
import { Link } from 'react-router-dom';
import { FaDollarSign, FaChartLine } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold text-green-400 hover:text-green-300">
              <FaDollarSign className="mr-2" />
              <span className="text-white">DINO</span>
              <span className="text-green-400">TRADEZ</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-300">
              <span className="mr-2">S&P 500:</span>
              <span className="text-green-400 flex items-center">
                <span>4,892.32</span>
                <FaChartLine className="ml-1" />
                <span className="ml-1">+1.2%</span>
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-300">
              <span className="mr-2">NASDAQ:</span>
              <span className="text-green-400 flex items-center">
                <span>17,321.45</span>
                <FaChartLine className="ml-1" />
                <span className="ml-1">+1.7%</span>
              </span>
            </div>
            
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            
            <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;