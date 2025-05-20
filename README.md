# DinoTradezAPP

A modern financial dashboard showing current market data with specialized sections for market overview, dark pool activity, lotto stock picks, market intelligence, and bullish/bearish watchlists.

![DinoTradez Dashboard](https://via.placeholder.com/1200x600?text=DinoTradez+Dashboard)

## Features

- **Live Market Data**: Real-time stock prices, indices, and market trends via Yahoo Finance API
- **Dark Pool Activity Tracking**: Monitor institutional trading activity with simulated dark pool data
- **Lotto Stock Picks**: Algorithm-driven selections for high-risk, high-reward opportunities
- **Market Intelligence**: News, events, and analysis affecting the market
- **Bullish & Bearish Watchlists**: Curated lists of stocks with positive and negative outlook
- **Responsive Design**: Optimized for both desktop and mobile viewing

## Tech Stack

### Backend
- Node.js with Express
- Direct API integration with Yahoo Finance API via RapidAPI
- Server-side caching for optimized performance
- Rate limiting to prevent API quota exhaustion

### Frontend
- React with functional components and hooks
- Redux Toolkit for state management
- Recharts for data visualization
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- RapidAPI account with access to Yahoo Finance API
  - Sign up at [RapidAPI](https://rapidapi.com/)
  - Subscribe to the [Yahoo Finance API](https://rapidapi.com/sparior/api/yahoo-finance15)
  - Copy your API key from the Dashboard

### Installation

1. Clone the repository
```bash
git clone https://github.com/JJsPPL/DinoTradezAPP.git
cd DinoTradezAPP
```

2. Set up environment variables
```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file and add your RapidAPI key
# If you're using the key from the screenshot, it's already included
```

3. Install server dependencies
```bash
npm install
```

4. Install client dependencies
```bash
cd client
npm install
cd ..
```

5. Start the development server
```bash
npm run dev-full
```

This will run both the backend server and the React frontend.

## API Endpoints

DinoTradezAPP leverages the Yahoo Finance API through RapidAPI. The key endpoints used are:

- `/api/market-overview` - Get overall market summary
- `/api/quotes?symbols=AAPL,MSFT,GOOG` - Get quotes for multiple stocks
- `/api/market-movers?type=gainers` - Get market movers (gainers, losers, actives)
- `/api/news` - Get financial news
- `/api/news?symbol=AAPL` - Get news for a specific stock
- `/api/historical?symbol=AAPL&interval=1d&range=1mo` - Get historical data
- `/api/stock-details?symbol=AAPL` - Get detailed stock information
- `/api/stock-screener` - Get filtered stocks based on criteria
- `/api/insider-trades?symbol=AAPL` - Get insider trading activity

### Yahoo Finance API RapidAPI Setup

The exact Yahoo Finance API endpoints used:

1. **v1/markets/quote** - Get real-time quotes for stocks
2. **v1/markets/quotes** (snapshots) - Get historical data for stocks
3. **api/yahoo/market/get-summary** - Get market summary
4. **v1/markets/movers** - Get market gainers, losers, and active stocks
5. **v1/markets/screener** - Screen stocks based on criteria
6. **v1/insider-trades** - Get insider trading information
7. **v1/news/list** - Get general financial news

## Project Structure

```
DinoTradezAPP/
├── server.js             # Express server setup
├── package.json          # Server dependencies
├── .env                  # Environment variables (not tracked in git)
├── client/               # React frontend
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── features/     # Redux Toolkit slices
│   │   ├── services/     # API service functions
│   │   ├── store/        # Redux store configuration
│   │   ├── App.js        # Main application component
│   │   └── index.js      # Entry point
│   └── package.json      # Client dependencies
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## Deployment

This application can be deployed to platforms like Heroku, Vercel, or any other service that supports Node.js applications.

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create dinotradez-app

# Add environment variables
heroku config:set RAPIDAPI_KEY=your_rapidapi_key_here

# Deploy to Heroku
git push heroku main

# Open the app
heroku open
```

## Additional Features

### Dark Pool Activity

The dark pool activity is simulated based on volume patterns and insider trading data. This simulation provides an approximation of potential dark pool activity but should not be considered actual dark pool data.

### Lotto Stock Picks

The lotto picks algorithm analyzes stocks based on:
- Volatility (price movement)
- Volume (trading activity)
- Momentum (direction of movement)
- Technical indicators (moving averages)

These picks are high-risk and should be approached with caution.

## Troubleshooting

### API Key Issues

If you encounter errors with the Yahoo Finance API:
1. Check that your RapidAPI key is correct in the `.env` file
2. Verify your subscription is active on RapidAPI
3. Check the API quota usage in your RapidAPI dashboard

### CORS Issues

If you encounter CORS errors during development:
1. Ensure the backend server is running on port 5000
2. Check that the proxy setting in `client/package.json` is set to `"http://localhost:5000"`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Yahoo Finance API provided by RapidAPI
- Built with React, Redux, Express, and Node.js