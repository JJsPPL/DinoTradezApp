import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowDown } from 'react-icons/fa';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import StockCard from '../components/ui/StockCard';
import { fetchBearishWatchlist } from '../features/watchlists/watchlistsSlice';

const BearishWatchlist = () => {
  const dispatch = useDispatch();
  const { bearishWatchlist, loading, error } = useSelector((state) => state.watchlists);

  useEffect(() => {
    dispatch(fetchBearishWatchlist());
  }, [dispatch]);

  if (loading) {
    return <LoadingIndicator text="Loading bearish watchlist..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaArrowDown className="mr-3 text-red-400" />
        Bearish Watchlist
      </h1>

      <p className="text-gray-400 text-sm mb-4">
        Stocks showing bearish signals: price below 50 &amp; 200 day MA, negative trend, negative momentum.
      </p>

      {error && (
        <div className="card border-red-800 bg-red-900/20">
          <p className="text-red-400">Error loading watchlist: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bearishWatchlist && bearishWatchlist.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {(!bearishWatchlist || bearishWatchlist.length === 0) && !loading && (
        <div className="card">
          <p className="text-gray-400 text-center py-8">
            No stocks currently meeting bearish criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default BearishWatchlist;
