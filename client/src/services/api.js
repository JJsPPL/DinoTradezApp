import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Market Overview API
export const getMarketOverview = async () => {
  try {
    const response = await api.get('/market-overview');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Stock Quotes API - Updated to match the exact endpoint from the screenshot
export const getStockQuotes = async (symbols) => {
  try {
    const response = await api.get(`/quotes?symbols=${symbols}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Market Movers API
export const getMarketMovers = async (type = 'gainers') => {
  try {
    const response = await api.get(`/market-movers?type=${type}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Financial News API
export const getFinancialNews = async (symbol = null) => {
  try {
    const endpoint = symbol ? `/news?symbol=${symbol}` : '/news';
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Historical Data API - Updated to use snapshots endpoint
export const getHistoricalData = async (symbol, interval = '1d', range = '1mo') => {
  try {
    const response = await api.get(`/historical?symbol=${symbol}&interval=${interval}&range=${range}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Stock Details API - Enhanced with more data
export const getStockDetails = async (symbol) => {
  try {
    const response = await api.get(`/stock-details?symbol=${symbol}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Stock Screener API - New function
export const getStockScreener = async (params = {}) => {
  try {
    // Create query string from params
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    const response = await api.get(`/stock-screener${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Insider Trades - New function
export const getInsiderTrades = async (symbol) => {
  try {
    const response = await api.get(`/insider-trades?symbol=${symbol}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Dark Pool API (Simulated based on volume data and insider trades)
export const getDarkPoolData = async (symbols) => {
  try {
    // Get stock quotes first
    const quotesResponse = await getStockQuotes(symbols);
    
    // For each stock, also get insider trades to enhance the simulation
    const symbolsArray = symbols.split(',');
    const darkPoolData = [];
    
    for (const symbol of symbolsArray) {
      try {
        const stockData = quotesResponse.quoteResponse?.result.find(
          stock => stock.symbol === symbol
        );
        
        if (!stockData) continue;
        
        // Try to get insider trades data to enhance the simulation
        let insiderData = null;
        try {
          insiderData = await getInsiderTrades(symbol);
        } catch (err) {
          // Continue even if insider data fails
          console.warn(`Couldn't get insider data for ${symbol}`);
        }
        
        const volume = stockData.regularMarketVolume || 0;
        const avgVolume = stockData.averageDailyVolume3Month || 1;
        
        // Simulate dark pool activity based on volume anomalies and insider trades
        // More sophisticated algorithm now that uses insider trading as an indicator
        const hasRecentInsiderActivity = insiderData && 
          insiderData.insiderTraders && 
          insiderData.insiderTraders.length > 0;
          
        // Higher dark pool percentage if there's insider activity
        const darkPoolMultiplier = hasRecentInsiderActivity ? (0.3 + Math.random() * 0.4) : (0.2 + Math.random() * 0.3);
        const darkPoolVolume = Math.floor(volume * darkPoolMultiplier);
        const darkPoolPercent = ((darkPoolVolume / volume) * 100).toFixed(2);
        const volumeRatio = (volume / avgVolume).toFixed(2);
        
        // Unusual activity is based on volume ratio AND insider activity
        const isUnusual = (volume > avgVolume * 1.5) || hasRecentInsiderActivity;
        
        darkPoolData.push({
          symbol: stockData.symbol,
          name: stockData.shortName || stockData.longName,
          price: stockData.regularMarketPrice,
          change: stockData.regularMarketChange,
          changePercent: stockData.regularMarketChangePercent,
          volume,
          avgVolume,
          volumeRatio,
          darkPoolVolume,
          darkPoolPercent,
          isUnusual,
          hasInsiderActivity: hasRecentInsiderActivity,
          lastUpdated: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`Error processing dark pool data for ${symbol}:`, err);
      }
    }
    
    return { darkPoolData };
  } catch (error) {
    throw error;
  }
};

// Lotto Picks API (Enhanced algorithm using screener + movers)
export const getLottoPicks = async () => {
  try {
    // Get market movers first
    const gainers = await getMarketMovers('gainers');
    const actives = await getMarketMovers('actives');
    
    // Also get some screener results for small cap high volatility stocks
    const screenResults = await getStockScreener({
      marketCap: '100M,2B', // Small to mid cap
      priceGt: '1',         // Above $1 to avoid penny stocks
      priceLt: '50'         // Below $50 to find affordable options
    });
    
    // Combine all potential candidates
    const allStocks = [
      ...(gainers.finance?.result || []),
      ...(actives.finance?.result || []),
      ...(screenResults?.result || [])
    ];
    
    // Apply enhanced lotto criteria
    const lottoCandidates = allStocks
      .filter(stock => {
        // Only stocks with sufficient volatility and price range
        return (
          stock.regularMarketChangePercent > 2.5 &&    // Significant price movement
          stock.regularMarketPrice < 50 &&             // Not too expensive
          stock.regularMarketPrice > 0.5 &&            // Not a penny stock
          stock.regularMarketVolume > 500000           // Sufficient liquidity
        );
      })
      .map(stock => {
        // Generate enhanced lotto score based on multiple factors
        const volatility = (stock.regularMarketChangePercent / 5);            // 0-10 based on percent change
        const volumeFactor = Math.min(3, stock.regularMarketVolume / 5000000); // 0-3 based on volume
        const momentum = stock.regularMarketChangePercent > 0 ? 1 : -0.5;     // Positive bias
        
        // Combined score with stronger weight on volatility
        const lottoScore = ((volatility * 0.7) + (volumeFactor * 0.3)) * momentum;
        // Normalized to 0-10 scale and adjusted to prefer higher scores
        const normalizedScore = Math.min(10, Math.max(0, ((lottoScore + 10) / 2)));
        
        return {
          symbol: stock.symbol,
          name: stock.shortName || stock.longName,
          price: stock.regularMarketPrice,
          change: stock.regularMarketChange,
          changePercent: stock.regularMarketChangePercent,
          volume: stock.regularMarketVolume,
          lottoScore: normalizedScore.toFixed(1),
          riskLevel: normalizedScore > 7 ? 'High' : normalizedScore > 4 ? 'Medium' : 'Low',
          potentialReturn: `${Math.round(normalizedScore * 10)}%`,
          recommendation: normalizedScore > 6 ? 'Strong Buy' : normalizedScore > 4 ? 'Buy' : 'Watch',
        };
      })
      .sort((a, b) => b.lottoScore - a.lottoScore)
      .slice(0, 10); // Top 10 picks
      
    return { lottoPicks: lottoCandidates };
  } catch (error) {
    throw error;
  }
};

// Enhanced watchlist criteria
const bullishCriteria = (stock) => {
  // More sophisticated bullish criteria based on technical indicators
  const priceAbove50dma = stock.fiftyDayAverage && stock.regularMarketPrice > stock.fiftyDayAverage;
  const priceAbove200dma = stock.twoHundredDayAverage && stock.regularMarketPrice > stock.twoHundredDayAverage;
  const movingAverageUptrend = stock.fiftyDayAverageChangePercent > 0;
  const positiveRSI = stock.regularMarketChangePercent > 0; // Simple proxy for positive RSI
  
  // Count how many bullish criteria are met
  const bullishFactors = [priceAbove50dma, priceAbove200dma, movingAverageUptrend, positiveRSI]
    .filter(Boolean).length;
  
  // Consider bullish if at least 3 of 4 criteria are met
  return bullishFactors >= 3;
};

const bearishCriteria = (stock) => {
  // More sophisticated bearish criteria based on technical indicators
  const priceBelow50dma = stock.fiftyDayAverage && stock.regularMarketPrice < stock.fiftyDayAverage;
  const priceBelow200dma = stock.twoHundredDayAverage && stock.regularMarketPrice < stock.twoHundredDayAverage;
  const movingAverageDowntrend = stock.fiftyDayAverageChangePercent < 0;
  const negativeRSI = stock.regularMarketChangePercent < 0; // Simple proxy for negative RSI
  
  // Count how many bearish criteria are met
  const bearishFactors = [priceBelow50dma, priceBelow200dma, movingAverageDowntrend, negativeRSI]
    .filter(Boolean).length;
  
  // Consider bearish if at least 3 of 4 criteria are met
  return bearishFactors >= 3;
};

// Updated watchlist functions
export const getBullishWatchlist = async () => {
  try {
    // Default bullish symbols to analyze - updated to include more tech stocks
    const defaultSymbols = 'AAPL,MSFT,GOOGL,AMZN,NVDA,AMD,TSLA,META,NFLX,DIS,PYPL,SQ,ROKU,SHOP,CRWD,DDOG,SNOW,NET,PLTR,U,CRM,ADBE,NOW,INTU,AMAT,KLAC,ASML,CDNS,SNPS,FTNT';
    const response = await getStockQuotes(defaultSymbols);
    
    const bullishStocks = response.quoteResponse?.result.filter(bullishCriteria) || [];
    
    return { bullishWatchlist: bullishStocks };
  } catch (error) {
    throw error;
  }
};

export const getBearishWatchlist = async () => {
  try {
    // Default bearish symbols to analyze - updated to include more cyclical/value stocks
    const defaultSymbols = 'F,GE,T,INTC,BA,XOM,VZ,MO,CVX,IBM,WFC,C,PFE,KO,CSCO,GM,HPQ,BBY,GPS,KSS,CAT,DE,MMM,DOW,DD,LYB,FCX,X,CLF,NUE';
    const response = await getStockQuotes(defaultSymbols);
    
    const bearishStocks = response.quoteResponse?.result.filter(bearishCriteria) || [];
    
    return { bearishWatchlist: bearishStocks };
  } catch (error) {
    throw error;
  }
};

export default {
  getMarketOverview,
  getStockQuotes,
  getMarketMovers,
  getFinancialNews,
  getHistoricalData,
  getStockDetails,
  getStockScreener,
  getInsiderTrades,
  getDarkPoolData,
  getLottoPicks,
  getBullishWatchlist,
  getBearishWatchlist,
};