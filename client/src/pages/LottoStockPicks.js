import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaLightbulb, FaInfoCircle, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

// Components
import LoadingIndicator from '../components/ui/LoadingIndicator';
import StockCard from '../components/ui/StockCard';
import StockTable from '../components/ui/StockTable';

// Redux actions
import { fetchLottoPicks } from '../features/lottoPicks/lottoPicksSlice';

const LottoStockPicks = () => {
  const dispatch = useDispatch();
  const [showInfo, setShowInfo] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterScore, setFilterScore] = useState(0);
  
  // Get data from Redux store
  const { 
    lottoPicks,
    loading, 
    lastUpdated 
  } = useSelector((state) => state.lottoPicks);
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchLottoPicks());
  }, [dispatch]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    
    dispatch(fetchLottoPicks()).finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 600);
    });
  };
  
  const handleScoreChange = (e) => {
    setFilterScore(parseFloat(e.target.value));
  };
  
  if (loading && !refreshing) {
    return <LoadingIndicator text="Finding lotto picks..." />;
  }
  
  // Filter picks by score
  const filteredPicks = lottoPicks.filter(stock => parseFloat(stock.lottoScore) >= filterScore);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Lotto Stock Picks</h1>
        <button 
          className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSyncAlt className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Picks'}
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
            <FaInfoCircle className="text-yellow-400 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">What are Lotto Picks?</h3>
              <p className="text-gray-300 text-sm">
                Lotto picks are high-risk, high-reward stock opportunities identified using our proprietary algorithm. 
                These stocks typically show unusual volatility, momentum, or volume patterns that indicate potential 
                for significant short-term price movement. Like lottery tickets, these picks carry substantial risk 
                but may offer outsized returns. Our Lotto Score rates each pick from 0-10 based on its potential.
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
      
      {/* Risk Warning */}
      <div className="p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-yellow-400 mr-3 mt-1" />
          <div>
            <h3 className="text-yellow-300 font-medium mb-1">High Risk Warning</h3>
            <p className="text-gray-300 text-sm">
              Lotto picks are extremely high-risk investments and may experience significant volatility. 
              Never invest more than you can afford to lose. These picks are not suitable for all investors 
              and should constitute only a small portion of a diversified portfolio.
            </p>
          </div>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="text-gray-300 whitespace-nowrap">
            Filter by minimum Lotto Score:
          </div>
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filterScore}
              onChange={handleScoreChange}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="text-yellow-400 font-medium text-lg w-16 text-center">
            {filterScore.toFixed(1)}
          </div>
        </div>
      </div>
      
      {/* Lotto Picks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPicks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
        
        {filteredPicks.length === 0 && (
          <div className="col-span-full p-8 bg-gray-800 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400">
              No picks match your current filter. Try lowering the minimum Lotto Score.
            </p>
          </div>
        )}
      </div>
      
      {/* Lotto Picks Table */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white flex items-center mb-4">
          <FaLightbulb className="mr-2 text-yellow-400" />
          Lotto Picks Details
        </h2>
        
        <div className="card">
          <StockTable 
            stocks={filteredPicks} 
            columns={[
              { key: 'symbol', label: 'Symbol', className: 'w-1/10' },
              { key: 'name', label: 'Name', className: 'w-3/10' },
              { key: 'price', label: 'Price', className: 'w-1/10 text-right' },
              { key: 'change', label: 'Change', className: 'w-1/10 text-right' },
              { key: 'changePercent', label: 'Change %', className: 'w-1/10 text-right' },
              { key: 'lottoScore', label: 'Lotto Score', className: 'w-1/10 text-right' },
              { key: 'riskLevel', label: 'Risk', className: 'w-1/10 text-right' },
              { key: 'potentialReturn', label: 'Potential', className: 'w-1/10 text-right' },
              { key: 'recommendation', label: 'Rec', className: 'w-1/10 text-right' },
            ]} 
          />
        </div>
      </section>
      
      {/* Methodology */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Our Methodology</h2>
        
        <div className="card">
          <p className="text-gray-300 mb-4">
            Our Lotto Picks are identified using a proprietary algorithm that analyzes multiple factors:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-750 rounded-lg">
              <h3 className="text-yellow-400 font-medium mb-2">Volatility Analysis</h3>
              <p className="text-sm text-gray-300">
                We identify stocks with unusually high volatility compared to their historical averages, 
                which can indicate potential for rapid price movement.
              </p>
            </div>
            
            <div className="p-3 bg-gray-750 rounded-lg">
              <h3 className="text-yellow-400 font-medium mb-2">Momentum Indicators</h3>
              <p className="text-sm text-gray-300">
                Stocks showing strong directional movement with technical indicators supporting 
                continued momentum are rated higher in our system.
              </p>
            </div>
            
            <div className="p-3 bg-gray-750 rounded-lg">
              <h3 className="text-yellow-400 font-medium mb-2">Volume Patterns</h3>
              <p className="text-sm text-gray-300">
                Unusual volume spikes, especially with positive price action, can signal institutional 
                interest and potential for significant movement.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <strong>Lotto Score Interpretation:</strong><br/>
            0-3: Low potential with high risk<br/>
            4-6: Moderate potential with high risk<br/>
            7-8: High potential with high risk<br/>
            9-10: Exceptional potential with high risk
          </div>
        </div>
      </section>
      
      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="text-yellow-400 font-medium mb-1">Disclaimer</div>
        <p className="text-gray-300 text-sm">
          Lotto Picks are provided for informational purposes only. DinoTradez does not guarantee 
          the accuracy of our picks or any returns on investments. Past performance is not indicative 
          of future results. Always conduct your own research before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default LottoStockPicks;