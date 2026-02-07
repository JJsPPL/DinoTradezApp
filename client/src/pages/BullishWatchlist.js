import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowUp } from 'react-icons/fa';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import StockCard from '../components/ui/StockCard';
import { fetchBullishWatchlist } from '../features/watchlists/watchlistsSlice';

const BullishWatchlist = () => {
  const dispatch = useDispatch();
  const { bullishWatchlist, loading, error } = useSelector((state) => state.watchlists);

  useEffect(() => {
    dispatch(fetchBullishWatchlist());
  }, [dispatch]);

  if (loading) {
    return <LoadingIndicator text="Loading bullish watchlist..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaArrowUp className="mr-3 text-green-400" />
        Bullish Watchlist
      </h1>

      <p className="text-gray-400 text-sm mb-4">
        Stocks showing bullish signals: price above 50 &amp; 200 day MA, positive trend, positive momentum.
      </p>

      {error && (
        <div className="card border-red-800 bg-red-900/20">
          <p className="text-red-400">Error loading watchlist: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bullishWatchlist && bullishWatchlist.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {(!bullishWatchlist || bullishWatchlist.length === 0) && !loading && (
        <div className="card">
          <p className="text-gray-400 text-center py-8">
            No stocks currently meeting bullish criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default BullishWatchlist;
