# DinoTradezAPP - Installation and Deployment Instructions

This document provides step-by-step instructions for setting up and deploying the DinoTradezAPP application. Follow these instructions carefully to ensure proper functionality.

## Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- A RapidAPI account with access to Yahoo Finance API
- Git

## Project Structure

The DinoTradezAPP follows a full-stack architecture with:
- Express.js backend for secure API proxying
- React frontend for the user interface
- Redux Toolkit for state management

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/JJsPPL/DinoTradezAPP.git
cd DinoTradezAPP
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following content:

```
NODE_ENV=development
PORT=5000
RAPIDAPI_KEY=your_rapidapi_key_here
```

Replace `your_rapidapi_key_here` with your actual RapidAPI key for the Yahoo Finance API.

### 3. Install Server Dependencies

```bash
npm install
```

### 4. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 5. Run the Application in Development Mode

To run both the backend and frontend simultaneously:

```bash
npm run dev-full
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment

### Option 1: Heroku Deployment

1. Create a Heroku account if you don't have one
2. Install the Heroku CLI
3. Login to Heroku from the terminal:
   ```bash
   heroku login
   ```
4. Create a new Heroku app:
   ```bash
   heroku create dinotradez-app
   ```
5. Add your environment variables:
   ```bash
   heroku config:set RAPIDAPI_KEY=your_rapidapi_key_here
   ```
6. Deploy the application:
   ```bash
   git push heroku main
   ```

### Option 2: Manual Deployment

1. Build the React frontend:
   ```bash
   cd client
   npm run build
   cd ..
   ```
2. Deploy the contents to your preferred hosting service

## API Endpoints

The application exposes the following API endpoints:

- `/api/market-overview` - Get overall market summary
- `/api/quotes?symbols=AAPL,MSFT,GOOG` - Get quotes for multiple stocks
- `/api/market-movers?type=gainers` - Get market movers (gainers, losers, actives)
- `/api/news` - Get financial news
- `/api/news?symbol=AAPL` - Get news for a specific stock
- `/api/historical?symbol=AAPL&interval=1d&range=1mo` - Get historical data
- `/api/stock-details?symbol=AAPL` - Get detailed stock information

## Key Features

- **Market Overview**: Real-time market indices, sector performance, gainers and losers
- **Dark Pool Activity**: Simulated dark pool trading patterns and unusual activity detection
- **Lotto Stock Picks**: Algorithm-driven high-risk, high-reward stock opportunities
- **Market Intelligence**: Current financial news and trending topics
- **Watchlists**: Bullish and bearish stock collections with technical indicators
- **Responsive Design**: Optimized for desktop and mobile viewing

## Customizing the Application

### Adding New Stocks to Track

Edit the `CUSTOM_SYMBOLS` constant in `client/src/pages/DarkPoolActivity.js` to change the default stocks tracked for dark pool activity.

### Modifying the Lotto Picks Algorithm

The lotto picks algorithm can be customized by editing the criteria in the `getLottoPicks` function in `client/src/services/api.js`.

### Changing the UI Theme

The color scheme can be modified in the `client/tailwind.config.js` file.

## Troubleshooting

- **API Key Issues**: Ensure your RapidAPI key has access to the Yahoo Finance API endpoints
- **Build Errors**: Make sure all dependencies are installed with `npm install`
- **CORS Errors**: The backend server properly handles CORS, but if you encounter issues, check your browser extensions

## Support and Contributions

For questions or contributions, please open an issue or pull request on the GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.