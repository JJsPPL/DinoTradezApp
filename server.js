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

// SEC EDGAR S-3 Filings (public API, no key needed)
app.get('/api/sec-filings', async (req, res) => {
  try {
    const formType = req.query.form || 'S-3';
    const limit = Math.min(parseInt(req.query.limit) || 20, 40);

    // Use SEC EDGAR full-text search API (EFTS)
    const today = new Date().toISOString().split('T')[0];
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const edgarResponse = await axios.get('https://efts.sec.gov/LATEST/search-index', {
      params: {
        q: `"${formType}"`,
        forms: formType,
        dateRange: 'custom',
        startdt: threeMonthsAgo,
        enddt: today,
        from: 0,
        size: limit,
      },
      headers: {
        'User-Agent': 'DinoTradez/1.0 (contact@dinotradez.com)',
        Accept: 'application/json',
      },
    });

    const hits = edgarResponse.data?.hits?.hits || [];

    // Deduplicate by accession number (one entry per filing)
    const seen = new Set();
    const filings = [];

    for (const hit of hits) {
      const src = hit._source || {};
      const adsh = src.adsh || '';
      if (seen.has(adsh)) continue;
      seen.add(adsh);

      // Parse display_names like "GD Culture Group Ltd  (GDC)  (CIK 0001641398)"
      const displayName = src.display_names?.[0] || '';
      let companyName = displayName;
      let ticker = null;

      const tickerMatch = displayName.match(/\(([A-Z]{1,5})\)/);
      if (tickerMatch) {
        ticker = tickerMatch[1];
        companyName = displayName.split('(')[0].trim();
      }

      const filedDate = src.file_date || null;
      const formTypeActual = src.form || src.root_forms?.[0] || formType;
      const cik = src.ciks?.[0]?.replace(/^0+/, '') || '';
      const accessionNo = adsh;

      let filingUrl = null;
      if (accessionNo && cik) {
        filingUrl = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=S-3&dateb=&owner=include&count=10`;
      }

      filings.push({
        companyName,
        ticker,
        filedDate,
        formType: formTypeActual,
        filingUrl,
      });
    }

    res.json({ filings, total: edgarResponse.data?.hits?.total?.value || 0 });
  } catch (error) {
    console.error('Error fetching SEC filings:', error.message);
    res.status(500).json({ error: 'Failed to fetch SEC filings', filings: [] });
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