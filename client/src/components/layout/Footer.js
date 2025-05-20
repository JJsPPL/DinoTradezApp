import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} DinoTradez. All rights reserved.
          </div>
          
          <div className="text-xs text-gray-500 mt-2 md:mt-0">
            Data provided by Yahoo Finance via RapidAPI. Not financial advice.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;