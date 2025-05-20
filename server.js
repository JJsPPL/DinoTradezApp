// This is the updated main file that sets up the Express server with improved Yahoo Finance API integration
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'yahoo-finance15.p.rapidapi.com';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Increased limit for more API calls
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Common headers for Yahoo Finance API
const getYahooFinanceHeaders = () => ({
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': RAPIDAPI_HOST
});

// API endpoints
// Market Overview - Get market summary
app.get('/api/market-overview', async (req, res) => {
  try {
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/yahoo/market/get-summary', {
      params: { region: 'US' },
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market overview:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get quotes for multiple stocks - Direct endpoint from your screenshot
app.get('/api/quotes', async (req, res) => {
  try {
    const { symbols } = req.query;
    if (!symbols) {
      return res.status(400).json({ error: 'Stock symbols are required' });
    }
    
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote', {
      params: { 
        symbols, 
        'AAplType': 'STOCK' // From your screenshot, this appears to be a parameter
      },
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock quotes:', error);
    res.status(500).json({ error: 'Failed to fetch stock quotes' });
  }
});

// Get market movers - gainers, losers, most active
app.get('/api/market-movers', async (req, res) => {
  try {
    const { type } = req.query; // gainers, losers, actives
    const moversType = type || 'gainers';
    
    const response = await axios.get(`https://yahoo-finance15.p.rapidapi.com/api/v1/markets/movers`, {
      params: { type: moversType },
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market movers:', error);
    res.status(500).json({ error: 'Failed to fetch market movers' });
  }
});

// Get financial news
app.get('/api/news', async (req, res) => {
  try {
    const { symbol } = req.query;
    let endpoint = 'https://yahoo-finance15.p.rapidapi.com/api/v1/news/list';
    
    // If a symbol is provided, use the symbol-specific news endpoint
    if (symbol) {
      endpoint = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules';
      const response = await axios.get(endpoint, {
        params: { symbol, module: 'news' },
        headers: getYahooFinanceHeaders()
      });
      
      res.json(response.data);
    } else {
      // Otherwise fetch general market news
      const response = await axios.get(endpoint, {
        headers: getYahooFinanceHeaders()
      });
      
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get stock historical data using v1/market/quotes endpoint with snapshots
app.get('/api/historical', async (req, res) => {
  try {
    const { symbol, interval, range } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    
    // Use the snapshots endpoint from the API list in your screenshot
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quotes', {
      params: { 
        symbol,
        interval: interval || '1d',
        diffandsplits: 'true',
        range: range || '1mo'
      },
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Get detailed stock information using modules endpoint
app.get('/api/stock-details', async (req, res) => {
  try {
    const { symbol } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    
    // First get basic quote information
    const quoteResponse = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/quote', {
      params: { 
        symbols: symbol,
        'AAplType': 'STOCK'
      },
      headers: getYahooFinanceHeaders()
    });
    
    // Then get additional modules data
    const modulesResponse = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules', {
      params: { 
        symbol,
        module: 'asset-profile,financial-data,earnings'
      },
      headers: getYahooFinanceHeaders()
    });
    
    // Combine the data
    const combinedData = {
      quote: quoteResponse.data,
      details: modulesResponse.data
    };
    
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
});

// Get stock screener data
app.get('/api/stock-screener', async (req, res) => {
  try {
    // Using the v1/market/screener endpoint from your screenshot
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/screener', {
      params: {
        marketCap: req.query.marketCap || '1B,',
        sector: req.query.sector || '',
        industry: req.query.industry || '',
        priceGt: req.query.priceGt || '',
        priceLt: req.query.priceLt || ''
      },
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching screener data:', error);
    res.status(500).json({ error: 'Failed to fetch screener data' });
  }
});

// Get available tickers
app.get('/api/tickers', async (req, res) => {
  try {
    // Using the v1/market/tickers endpoint from your screenshot
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/markets/tickers', {
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tickers:', error);
    res.status(500).json({ error: 'Failed to fetch tickers' });
  }
});

// Get insider trades
app.get('/api/insider-trades', async (req, res) => {
  try {
    const { symbol } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }
    
    // Using the v1/insider-trades endpoint from your screenshot
    const response = await axios.get('https://yahoo-finance15.p.rapidapi.com/api/v1/insider-trades', {
      params: { symbol },
      headers: getYahooFinanceHeaders()
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching insider trades:', error);
    res.status(500).json({ error: 'Failed to fetch insider trades' });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;