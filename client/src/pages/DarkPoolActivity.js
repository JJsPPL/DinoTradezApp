import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChartBar, FaExclamationTriangle, FaInfoCircle, FaSyncAlt } from 'react-icons/fa';

// Components
import LoadingIndicator from '../components/ui/LoadingIndicator';
import StockTable from '../components/ui/StockTable';
import StockChart from '../components/ui/StockChart';

// Redux actions
import { fetchDarkPoolData } from '../features/darkPool/darkPoolSlice';

// Sample data for visualization
const generateDarkPoolHistoricalData = (days = 30) => {
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Regular and dark pool volumes (in millions)
    const regularVolume = 50 + Math.random() * 50;
    const darkPoolVolume = 20 + Math.random() * 30;
    const darkPoolPercent = (darkPoolVolume / (regularVolume + darkPoolVolume)) * 100;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      regularVolume,
      darkPoolVolume,
      darkPoolPercent: parseFloat(darkPoolPercent.toFixed(1)),
    });
  }
  
  return data;
};

const darkPoolHistory = generateDarkPoolHistoricalData();

// Custom symbols for tracking
const CUSTOM_SYMBOLS = 'SPY,QQQ,AAPL,MSFT,AMZN,TSLA,NVDA,AMD,META,GOOG,NFLX,GME,AMC,BBBY,PLTR,BB,NOK,NIO,LCID,RIVN';

const DarkPoolActivity = () => {
  const dispatch = useDispatch();
  const [symbols, setSymbols] = useState(CUSTOM_SYMBOLS);
  const [showInfo, setShowInfo] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get data from Redux store
  const { 
    darkPoolData, 
    unusualActivity,
    loading, 
    lastUpdated 
  } = useSelector((state) => state.darkPool);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchDarkPoolData(symbols));
  }, [dispatch, symbols]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    dispatch(fetchDarkPoolData(symbols)).finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 600);
    });
  };
  
  const handleSymbolsChange = (e) => {
    setSymbols(e.target.value);
  };
  
  const handleSymbolsSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchDarkPoolData(symbols));
  };
  
  if (loading && !refreshing) {
    return <LoadingIndicator text="Loading dark pool data..." />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dark Pool Activity</h1>
        <button 
          className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSyncAlt className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      {lastUpdated && (
        <div className="text-sm text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
      
      {/* Info Box */}
      {showInfo && (
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-400 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">What is Dark Pool Trading?</h3>
              <p className="text-gray-300 text-sm">
                Dark pools are private exchanges where financial assets and securities are traded and matched without exposing trade information to the public. 
                Large institutional investors often use dark pools to buy or sell large blocks of securities without impacting the market price.
                Unusual dark pool activity may indicate potential price movements before they're visible in regular market trading.
              </p>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-300"
              onClick={() => setShowInfo(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      
      {/* Custom Symbols Input */}
      <div className="card">
        <form onSubmit={handleSymbolsSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="symbols" className="block text-sm text-gray-400 mb-1">
              Symbols to Track (comma-separated)
            </label>
            <input
              id="symbols"
              type="text"
              value={symbols}
              onChange={handleSymbolsChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SPY,QQQ,AAPL,MSFT,AMZN..."
            />
          </div>
          <button
            type="submit"
            className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Update Tracking
          </button>
        </form>
      </div>
      
      {/* Dark Pool History Chart */}
      <section>
        <h2 className="text-xl font-semibold text-white flex items-center mb-4">
          <FaChartBar className="mr-2 text-purple-400" />
          Dark Pool Activity Trend (30 Days)
        </h2>
        
        <StockChart 
          data={darkPoolHistory} 
          type="bar"
          dataKeys={['regularVolume', 'darkPoolVolume']}
          colors={['#3b82f6', '#a855f7']}
          height={300} 
        />
        
        <div className="mt-2 card">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-300">Regular Volume</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-300">Dark Pool Volume</span>
            </div>
            <div className="text-sm text-gray-300">
              <span className="font-medium text-purple-400">
                {darkPoolHistory[darkPoolHistory.length - 1].darkPoolPercent}%
              </span> of total volume in dark pools
            </div>
          </div>
        </div>
      </section>
      
      {/* Unusual Dark Pool Activity */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white flex items-center mb-4">
          <FaExclamationTriangle className="mr-2 text-yellow-400" />
          Unusual Dark Pool Activity
        </h2>
        
        <div className="card">
          <StockTable 
            stocks={unusualActivity} 
            columns={[
              { key: 'symbol', label: 'Symbol', className: 'w-1/12' },
              { key: 'name', label: 'Name', className: 'w-3/12' },
              { key: 'price', label: 'Price', className: 'w-1/12 text-right' },
              { key: 'change', label: 'Change', className: 'w-1/12 text-right' },
              { key: 'volume', label: 'Volume', className: 'w-2/12 text-right' },
              { key: 'darkPoolVolume', label: 'Dark Pool Vol', className: 'w-2/12 text-right' },
              { key: 'darkPoolPercent', label: 'Dark Pool %', className: 'w-2/12 text-right' },
            ]} 
          />
          
          {(!unusualActivity || unusualActivity.length === 0) && (
            <div className="text-center text-gray-400 py-4">
              No unusual dark pool activity detected
            </div>
          )}
        </div>
      </section>
      
      {/* All Dark Pool Data */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">All Tracked Stocks</h2>
        
        <div className="card">
          <StockTable 
            stocks={darkPoolData} 
            columns={[
              { key: 'symbol', label: 'Symbol', className: 'w-1/12' },
              { key: 'name', label: 'Name', className: 'w-2/12' },
              { key: 'price', label: 'Price', className: 'w-1/12 text-right' },
              { key: 'change', label: 'Change', className: 'w-1/12 text-right' },
              { key: 'volume', label: 'Volume', className: 'w-1/12 text-right' },
              { key: 'avgVolume', label: 'Avg Vol', className: 'w-1/12 text-right' },
              { key: 'volumeRatio', label: 'Vol Ratio', className: 'w-1/12 text-right' },
              { key: 'darkPoolVolume', label: 'Dark Pool Vol', className: 'w-2/12 text-right' },
              { key: 'darkPoolPercent', label: 'Dark Pool %', className: 'w-2/12 text-right' },
            ]} 
          />
        </div>
      </section>
      
      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="text-yellow-400 font-medium mb-1">Disclaimer</div>
        <p className="text-gray-300 text-sm">
          Dark pool data is simulated based on volume patterns and may not represent actual dark pool activity. 
          This information is for educational purposes only and should not be used as the sole basis for investment decisions.
        </p>
      </div>
    </div>
  );
};

export default DarkPoolActivity;