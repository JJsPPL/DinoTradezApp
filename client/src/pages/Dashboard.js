import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaChartLine, FaChartBar, FaLightbulb, FaNewspaper, FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';

// Components
import LoadingIndicator from '../components/ui/LoadingIndicator';
import StockCard from '../components/ui/StockCard';
import TradingViewChart from '../components/ui/TradingViewChart';
import NewsCard from '../components/ui/NewsCard';

// Redux actions
import { fetchMarketOverview } from '../features/marketOverview/marketOverviewSlice';
import { fetchDarkPoolData } from '../features/darkPool/darkPoolSlice';
import { fetchLottoPicks } from '../features/lottoPicks/lottoPicksSlice';
import { fetchBullishWatchlist, fetchBearishWatchlist } from '../features/watchlists/watchlistsSlice';

// Default chart symbol
const DEFAULT_CHART_SYMBOL = 'USFD';

// Sample news articles
const sampleNews = [
  {
    title: 'Market Opens Higher on Strong Jobs Report',
    summary: 'U.S. stocks opened higher on Friday after a stronger-than-expected jobs report showed the labor market remains resilient despite economic headwinds.',
    publisher: 'Market News',
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    url: '#',
    relatedSymbols: ['SPY', 'QQQ', 'DIA'],
  },
  {
    title: 'Tech Sector Leads Market Gains',
    summary: 'Technology stocks led the market higher on Thursday, with semiconductor companies posting significant gains following positive industry forecasts.',
    publisher: 'Tech Daily',
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    url: '#',
    relatedSymbols: ['NVDA', 'AMD', 'INTC', 'SOXX'],
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const { marketSummary, loading: marketLoading } = useSelector((state) => state.marketOverview);
  const { darkPoolData, loading: darkPoolLoading } = useSelector((state) => state.darkPool);
  const { lottoPicks, loading: lottoLoading } = useSelector((state) => state.lottoPicks);
  const { 
    bullishWatchlist, 
    bearishWatchlist, 
    loading: watchlistsLoading 
  } = useSelector((state) => state.watchlists);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchMarketOverview());
    dispatch(fetchDarkPoolData());
    dispatch(fetchLottoPicks());
    dispatch(fetchBullishWatchlist());
    dispatch(fetchBearishWatchlist());
  }, [dispatch]);
  
  const isLoading = marketLoading || darkPoolLoading || lottoLoading || watchlistsLoading;
  
  if (isLoading) {
    return <LoadingIndicator text="Loading dashboard data..." />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      
      {/* Chart - USFD with 200 HMA + MACD */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaChartLine className="mr-2 text-blue-400" />
            Chart
          </h2>
          <Link to="/market-overview" className="text-sm text-blue-400 hover:text-blue-300">
            View Market Overview →
          </Link>
        </div>

        <TradingViewChart symbol={DEFAULT_CHART_SYMBOL} height={500} />
      </section>
      
      {/* Dark Pool & Lotto Picks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dark Pool Activity */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaChartBar className="mr-2 text-purple-400" />
              Dark Pool Activity
            </h2>
            <Link to="/dark-pool" className="text-sm text-blue-400 hover:text-blue-300">
              View Full Report →
            </Link>
          </div>
          
          <div className="space-y-4">
            {darkPoolData && darkPoolData.slice(0, 3).map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
            
            {(!darkPoolData || darkPoolData.length === 0) && (
              <div className="card">
                <p className="text-gray-400 text-center">No dark pool data available</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Lotto Stock Picks */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaLightbulb className="mr-2 text-yellow-400" />
              Lotto Stock Picks
            </h2>
            <Link to="/lotto-picks" className="text-sm text-blue-400 hover:text-blue-300">
              View All Picks →
            </Link>
          </div>
          
          <div className="space-y-4">
            {lottoPicks && lottoPicks.slice(0, 3).map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
            
            {(!lottoPicks || lottoPicks.length === 0) && (
              <div className="card">
                <p className="text-gray-400 text-center">No lotto picks available</p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Market Intelligence */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <FaNewspaper className="mr-2 text-blue-400" />
            Market Intelligence
          </h2>
          <Link to="/market-intelligence" className="text-sm text-blue-400 hover:text-blue-300">
            View All News →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleNews.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </section>
      
      {/* Watchlists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bullish Watchlist */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaArrowUp className="mr-2 text-green-400" />
              Bullish Watchlist
            </h2>
            <Link to="/bullish-watchlist" className="text-sm text-blue-400 hover:text-blue-300">
              View Full Watchlist →
            </Link>
          </div>
          
          <div className="space-y-4">
            {bullishWatchlist && bullishWatchlist.slice(0, 3).map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
            
            {(!bullishWatchlist || bullishWatchlist.length === 0) && (
              <div className="card">
                <p className="text-gray-400 text-center">No bullish stocks available</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Bearish Watchlist */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaArrowDown className="mr-2 text-red-400" />
              Bearish Watchlist
            </h2>
            <Link to="/bearish-watchlist" className="text-sm text-blue-400 hover:text-blue-300">
              View Full Watchlist →
            </Link>
          </div>
          
          <div className="space-y-4">
            {bearishWatchlist && bearishWatchlist.slice(0, 3).map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
            
            {(!bearishWatchlist || bearishWatchlist.length === 0) && (
              <div className="card">
                <p className="text-gray-400 text-center">No bearish stocks available</p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Disclaimer */}
      <section className="mt-8">
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex items-start">
            <FaInfoCircle className="text-yellow-400 mr-3 mt-1" />
            <div>
              <h3 className="text-white font-medium mb-1">Disclaimer</h3>
              <p className="text-gray-300 text-sm">
                DinoTradez provides market data for informational purposes only. This is not financial advice. 
                Always do your own research before making investment decisions.
              </p>
              <Link to="/disclaimer" className="text-sm text-blue-400 hover:text-blue-300 inline-block mt-2">
                Read Full Disclaimer →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;