import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaChartLine, FaArrowUp, FaArrowDown, FaSyncAlt } from 'react-icons/fa';

// Components
import LoadingIndicator from '../components/ui/LoadingIndicator';
import StockCard from '../components/ui/StockCard';
import StockChart from '../components/ui/StockChart';
import StockTable from '../components/ui/StockTable';

// Redux actions
import { fetchMarketOverview, fetchMarketMovers } from '../features/marketOverview/marketOverviewSlice';

// Sample data for charts
const generateSampleData = (days = 30, startPrice = 100, volatility = 0.02) => {
  const data = [];
  let currentPrice = startPrice;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Random price movement
    const change = currentPrice * (Math.random() * volatility * 2 - volatility);
    currentPrice += change;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }
  
  return data;
};

const indexData = {
  'S&P 500': generateSampleData(30, 4800, 0.01),
  'NASDAQ': generateSampleData(30, 17000, 0.015),
  'DOW': generateSampleData(30, 38500, 0.008),
  'Russell 2000': generateSampleData(30, 2100, 0.02),
};

const sectorPerformance = [
  { name: 'Technology', change: 2.1 },
  { name: 'Healthcare', change: 1.3 },
  { name: 'Consumer Cyclical', change: 0.8 },
  { name: 'Financial Services', change: 0.4 },
  { name: 'Communication Services', change: 0.3 },
  { name: 'Industrials', change: -0.2 },
  { name: 'Basic Materials', change: -0.5 },
  { name: 'Energy', change: -0.7 },
  { name: 'Utilities', change: -1.1 },
  { name: 'Real Estate', change: -1.4 },
].sort((a, b) => b.change - a.change);

const MarketOverview = () => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState('S&P 500');
  const [refreshing, setRefreshing] = useState(false);
  
  // Get data from Redux store
  const { 
    marketSummary, 
    gainers, 
    losers, 
    actives,
    loading, 
    lastUpdated 
  } = useSelector((state) => state.marketOverview);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchMarketOverview());
    dispatch(fetchMarketMovers('gainers'));
    dispatch(fetchMarketMovers('losers'));
    dispatch(fetchMarketMovers('actives'));
  }, [dispatch]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    Promise.all([
      dispatch(fetchMarketOverview()),
      dispatch(fetchMarketMovers('gainers')),
      dispatch(fetchMarketMovers('losers')),
      dispatch(fetchMarketMovers('actives')),
    ]).finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 600);
    });
  };
  
  if (loading && !refreshing) {
    return <LoadingIndicator text="Loading market data..." />;
  }
  
  const gainerColumns = [
    { key: 'symbol', label: 'Symbol', className: 'w-1/5' },
    { key: 'name', label: 'Name', className: 'w-2/5' },
    { key: 'price', label: 'Price', className: 'w-1/5 text-right' },
    { key: 'changePercent', label: 'Change %', className: 'w-1/5 text-right' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Market Overview</h1>
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
      
      {/* Market Indices */}
      <section>
        <h2 className="text-xl font-semibold text-white flex items-center mb-4">
          <FaChartLine className="mr-2 text-blue-400" />
          Market Indices
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {['S&P 500', 'NASDAQ', 'DOW', 'Russell 2000'].map((index) => {
            const isSelected = selectedIndex === index;
            const data = indexData[index];
            const lastPoint = data[data.length - 1];
            const prevPoint = data[data.length - 2];
            const change = lastPoint.price - prevPoint.price;
            const changePercent = (change / prevPoint.price) * 100;
            const isPositive = change > 0;
            
            return (
              <div 
                key={index}
                className={`card cursor-pointer ${isSelected ? 'border-blue-500' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="text-lg font-bold text-white">{index}</div>
                  <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    {changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{lastPoint.price.toFixed(2)}</div>
                <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
        
        <StockChart 
          data={indexData[selectedIndex]} 
          title={`${selectedIndex} - 30 Day Performance`} 
          height={300} 
          showLegend={false}
        />
      </section>
      
      {/* Sector Performance */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Sector Performance</h2>
        
        <div className="card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {sectorPerformance.map((sector) => {
              const isPositive = sector.change > 0;
              
              return (
                <div key={sector.name} className="p-3 bg-gray-750 rounded-lg">
                  <div className="text-sm text-gray-300 mb-1">{sector.name}</div>
                  <div className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{sector.change.toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Top Gainers */}
        <section>
          <h2 className="text-xl font-semibold text-white flex items-center mb-4">
            <FaArrowUp className="mr-2 text-green-400" />
            Top Gainers
          </h2>
          
          <div className="card">
            <StockTable 
              stocks={gainers.slice(0, 5)} 
              columns={gainerColumns} 
            />
          </div>
        </section>
        
        {/* Top Losers */}
        <section>
          <h2 className="text-xl font-semibold text-white flex items-center mb-4">
            <FaArrowDown className="mr-2 text-red-400" />
            Top Losers
          </h2>
          
          <div className="card">
            <StockTable 
              stocks={losers.slice(0, 5)} 
              columns={gainerColumns} 
            />
          </div>
        </section>
      </div>
      
      {/* Most Active */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Most Active</h2>
        
        <div className="card">
          <StockTable 
            stocks={actives.slice(0, 10)} 
            columns={[
              { key: 'symbol', label: 'Symbol', className: 'w-1/6' },
              { key: 'name', label: 'Name', className: 'w-2/6' },
              { key: 'price', label: 'Price', className: 'w-1/6 text-right' },
              { key: 'change', label: 'Change', className: 'w-1/6 text-right' },
              { key: 'changePercent', label: 'Change %', className: 'w-1/6 text-right' },
            ]} 
          />
        </div>
      </section>
    </div>
  );
};

export default MarketOverview;