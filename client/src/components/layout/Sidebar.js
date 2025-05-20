import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartLine, 
  FaChartPie, 
  FaChartBar, 
  FaLightbulb, 
  FaNewspaper, 
  FaArrowUp, 
  FaArrowDown, 
  FaInfoCircle 
} from 'react-icons/fa';

const navLinks = [
  { path: '/', name: 'Dashboard', icon: <FaChartPie /> },
  { path: '/market-overview', name: 'Market Overview', icon: <FaChartLine /> },
  { path: '/dark-pool', name: 'Dark Pool Activity', icon: <FaChartBar /> },
  { path: '/lotto-picks', name: 'Lotto Stock Picks', icon: <FaLightbulb /> },
  { path: '/market-intelligence', name: 'Market Intelligence', icon: <FaNewspaper /> },
  { path: '/bullish-watchlist', name: 'Bullish Watchlist', icon: <FaArrowUp /> },
  { path: '/bearish-watchlist', name: 'Bearish Watchlist', icon: <FaArrowDown /> },
  { path: '/disclaimer', name: 'Disclaimer', icon: <FaInfoCircle /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <div className="p-4">
        <div className="text-lg font-semibold text-gray-300 mb-4">Navigation</div>
        <nav>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-green-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="p-4 mt-8 border-t border-gray-700">
        <div className="text-xs text-gray-500 mb-2">Market Hours</div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <div className="text-sm text-gray-300">Market Open</div>
        </div>
        <div className="text-xs text-gray-400 mt-1">9:30 AM - 4:00 PM EST</div>
      </div>
      
      <div className="p-4 mt-auto border-t border-gray-700">
        <div className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} DinoTradez
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;