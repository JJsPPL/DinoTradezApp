import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Page components
import Dashboard from './pages/Dashboard';
import MarketOverview from './pages/MarketOverview';
import DarkPoolActivity from './pages/DarkPoolActivity';
import LottoStockPicks from './pages/LottoStockPicks';
import MarketIntelligence from './pages/MarketIntelligence';
import BullishWatchlist from './pages/BullishWatchlist';
import BearishWatchlist from './pages/BearishWatchlist';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/market-overview" element={<MarketOverview />} />
                <Route path="/dark-pool" element={<DarkPoolActivity />} />
                <Route path="/lotto-picks" element={<LottoStockPicks />} />
                <Route path="/market-intelligence" element={<MarketIntelligence />} />
                <Route path="/bullish-watchlist" element={<BullishWatchlist />} />
                <Route path="/bearish-watchlist" element={<BearishWatchlist />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;