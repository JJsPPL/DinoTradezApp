import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StockCard = ({ stock }) => {
  const isPositive = stock.change > 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const changeIcon = isPositive ? <FaArrowUp /> : <FaArrowDown />;
  
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
          <div className="text-sm text-gray-400">{stock.name}</div>
        </div>
        {stock.lottoScore && (
          <div className="px-2 py-1 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded-md">
            <div className="text-xs text-yellow-400">Lotto Score</div>
            <div className="text-lg font-bold text-yellow-300">{stock.lottoScore}</div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-4">
        <div>
          <div className="text-2xl font-bold text-white">${stock.price?.toFixed(2)}</div>
          <div className={`flex items-center ${changeColor}`}>
            <span className="mr-1">{changeIcon}</span>
            <span>${Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)</span>
          </div>
        </div>
        
        <div className="text-right">
          {stock.volume && (
            <div className="text-sm text-gray-400">
              Vol: {(stock.volume / 1000000).toFixed(1)}M
            </div>
          )}
          {stock.recommendation && (
            <div className={`text-sm font-medium ${
              stock.recommendation.includes('Buy') ? 'text-green-400' : 'text-gray-400'
            }`}>
              {stock.recommendation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockCard;