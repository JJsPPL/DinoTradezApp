import React, { useEffect, useRef, memo } from 'react';

const TradingViewChart = ({ symbol = 'USFD', interval = 'D', height = 500 }) => {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Clean up previous widget
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        widgetRef.current = new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: symbol,
          interval: interval,
          timezone: 'America/New_York',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1f2937',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          withdateranges: true,
          save_image: false,
          studies: [
            { id: 'MAExp@tv-basicstudies', inputs: { length: 200 } },
            { id: 'MACD@tv-basicstudies' }
          ],
          studies_overrides: {
            'MAExp@tv-basicstudies.length': 200,
            'MAExp@tv-basicstudies.plot.color': '#FFD700',
            'MAExp@tv-basicstudies.plot.linewidth': 2,
          },
          overrides: {
            'mainSeriesProperties.candleStyle.upColor': '#26a69a',
            'mainSeriesProperties.candleStyle.downColor': '#ef5350',
            'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
            'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
            'paneProperties.background': '#111827',
            'paneProperties.vertGridProperties.color': '#1f2937',
            'paneProperties.horzGridProperties.color': '#1f2937',
          },
          width: '100%',
          height: height,
        });
      }
    };

    // Check if script already loaded
    if (window.TradingView) {
      script.onload();
    } else {
      document.head.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, interval, height]);

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-lg font-bold text-white">
          {symbol} Chart
          <span className="text-xs text-gray-400 ml-2 font-normal">
            200 HMA + MACD (12, 26, 9)
          </span>
        </h3>
      </div>
      <div
        id="tradingview-chart-container"
        ref={containerRef}
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default memo(TradingViewChart);
