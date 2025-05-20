import React from 'react';
import { Line, Bar, ResponsiveContainer, LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const StockChart = ({ 
  data,
  type = 'line',
  height = 300,
  title,
  symbol,
  dataKeys = ['price'],
  colors = ['#4ade80', '#3b82f6', '#a855f7', '#facc15', '#ef4444'],
  showGrid = true,
  showLegend = true,
  showTooltip = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }
  
  const chartTitle = title || (symbol ? `${symbol} Chart` : 'Stock Chart');
  
  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            {showTooltip && <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />}
            {showLegend && <Legend wrapperStyle={{ color: '#d1d5db' }} />}
            {dataKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors[index % colors.length]} 
                name={key.charAt(0).toUpperCase() + key.slice(1)} 
              />
            ))}
          </BarChart>
        );
      
      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            {showTooltip && <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />}
            {showLegend && <Legend wrapperStyle={{ color: '#d1d5db' }} />}
            {dataKeys.map((key, index) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]} 
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6 }}
                name={key.charAt(0).toUpperCase() + key.slice(1)} 
              />
            ))}
          </LineChart>
        );
    }
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">{chartTitle}</h3>
      </div>
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;