import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StockTable = ({ stocks, columns }) => {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-center text-gray-400">No stocks available</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={stock.symbol || index}>
              {columns.map((column) => (
                <td key={`${stock.symbol}-${column.key}`} className={column.className}>
                  {renderCellContent(stock, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderCellContent = (stock, column) => {
  const value = stock[column.key];
  
  // Handle special cases
  switch (column.key) {
    case 'symbol':
      return (
        <div className="font-medium">{value}</div>
      );
    
    case 'name':
      return (
        <div className="text-gray-300">{value}</div>
      );
      
    case 'price':
      return (
        <div className="font-medium">${typeof value === 'number' ? value.toFixed(2) : value}</div>
      );
      
    case 'change':
      const isPositive = value > 0;
      const changeIcon = isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />;
      return (
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {changeIcon}
          ${Math.abs(value).toFixed(2)}
        </div>
      );
      
    case 'changePercent':
      const isPctPositive = value > 0;
      return (
        <div className={isPctPositive ? 'text-green-500' : 'text-red-500'}>
          {isPctPositive ? '+' : ''}{value.toFixed(2)}%
        </div>
      );
      
    case 'volume':
      if (!value) return 'N/A';
      return (
        <div>{(value / 1000000).toFixed(1)}M</div>
      );
    
    case 'darkPoolVolume':
      if (!value) return 'N/A';
      return (
        <div>{(value / 1000000).toFixed(1)}M</div>
      );
      
    case 'darkPoolPercent':
      if (!value) return 'N/A';
      return (
        <div className={parseFloat(value) > 30 ? 'text-purple-400 font-medium' : ''}>
          {value}%
        </div>
      );
      
    case 'lottoScore':
      if (!value) return 'N/A';
      
      let scoreColor = 'text-gray-400';
      if (value >= 8) scoreColor = 'text-green-400 font-bold';
      else if (value >= 6) scoreColor = 'text-green-300';
      else if (value >= 4) scoreColor = 'text-yellow-300';
      
      return (
        <div className={scoreColor}>{value}/10</div>
      );
      
    case 'riskLevel':
      if (!value) return 'N/A';
      
      let riskColor = 'text-gray-400';
      if (value === 'High') riskColor = 'text-red-400';
      else if (value === 'Medium') riskColor = 'text-yellow-400';
      else if (value === 'Low') riskColor = 'text-green-400';
      
      return (
        <div className={riskColor}>{value}</div>
      );
    
    case 'recommendation':
      if (!value) return 'N/A';
      
      let recColor = 'text-gray-400';
      if (value.includes('Strong Buy')) recColor = 'text-green-400 font-bold';
      else if (value.includes('Buy')) recColor = 'text-green-300';
      else if (value.includes('Watch')) recColor = 'text-yellow-300';
      
      return (
        <div className={recColor}>{value}</div>
      );
    
    default:
      // For any other fields, just return the value
      return value || 'N/A';
  }
};

export default StockTable;