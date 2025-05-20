# DinoTradezAPP Codebase Structure

This document provides an overview of the DinoTradezAPP codebase structure to help developers navigate and contribute to the project.

## Server-Side Structure

```
/
├── server.js                # Main Express server setup
├── package.json             # Server dependencies
├── .env                     # Environment variables (not tracked in git)
├── .gitignore               # Git ignore configuration
└── INSTALLATION.md          # Installation and deployment instructions
```

### Key Server Files

- **server.js**: The main Express server that handles API proxying to Yahoo Finance API via RapidAPI.
- **.env**: Contains environment variables including the RapidAPI key.

## Client-Side Structure

```
/client
├── public/                  # Static files
│   ├── index.html           # HTML template
│   ├── favicon.ico          # Site icon
│   └── manifest.json        # PWA manifest
│
├── src/                     # React source code
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   │   └── ui/              # UI components (StockCard, StockTable, etc.)
│   │
│   ├── features/            # Redux Toolkit slices
│   │   ├── marketOverview/  # Market overview state management
│   │   ├── darkPool/        # Dark pool state management
│   │   ├── lottoPicks/      # Lotto picks state management
│   │   ├── marketIntelligence/ # News and intelligence state management
│   │   └── watchlists/      # Watchlists state management
│   │
│   ├── pages/               # Page components
│   │   ├── Dashboard.js     # Main dashboard page
│   │   ├── MarketOverview.js # Market overview page
│   │   ├── DarkPoolActivity.js # Dark pool activity page
│   │   ├── LottoStockPicks.js # Lotto stock picks page
│   │   ├── MarketIntelligence.js # Market intelligence page
│   │   ├── BullishWatchlist.js # Bullish watchlist page
│   │   ├── BearishWatchlist.js # Bearish watchlist page
│   │   ├── Disclaimer.js    # Disclaimer page
│   │   └── NotFound.js      # 404 page
│   │
│   ├── services/            # API service functions
│   │   └── api.js           # API calls to backend
│   │
│   ├── store/               # Redux store configuration
│   │   └── index.js         # Store setup and root reducer
│   │
│   ├── App.js               # Main application component
│   ├── App.css              # Global styles
│   └── index.js             # Entry point
│
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Client dependencies
```

### Key Client Files

- **src/App.js**: Main React component that sets up routing and layout.
- **src/services/api.js**: Contains all API service functions for backend communication.
- **src/store/index.js**: Redux store configuration.
- **src/features/*/Slice.js**: Redux Toolkit slices for state management.

## State Management

DinoTradezAPP uses Redux Toolkit for state management with the following slices:

- **marketOverview**: Manages market index data, sector performance, and market movers.
- **darkPool**: Manages dark pool activity data and unusual activity detection.
- **lottoPicks**: Manages high-risk, high-reward stock picks.
- **marketIntelligence**: Manages financial news and trending topics.
- **watchlists**: Manages bullish and bearish watchlists.

## API Structure

The backend proxies requests to the Yahoo Finance API via RapidAPI with the following endpoints:

- `/api/market-overview`: Get overall market summary
- `/api/quotes`: Get quotes for multiple stocks
- `/api/market-movers`: Get market movers (gainers, losers, actives)
- `/api/news`: Get financial news
- `/api/historical`: Get historical data
- `/api/stock-details`: Get detailed stock information

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
│
├── Pages
│   ├── Dashboard
│   ├── MarketOverview
│   ├── DarkPoolActivity
│   ├── LottoStockPicks
│   ├── MarketIntelligence
│   ├── BullishWatchlist
│   ├── BearishWatchlist
│   ├── Disclaimer
│   └── NotFound
│
└── UI Components
    ├── LoadingIndicator
    ├── StockCard
    ├── StockTable
    ├── StockChart
    └── NewsCard
```

## Data Flow

1. User interacts with the UI
2. React components dispatch Redux actions
3. Redux thunks make API calls to the backend
4. Backend proxies requests to Yahoo Finance API
5. Data flows back through the same path in reverse
6. UI updates with the new data

## Styling

DinoTradezAPP uses Tailwind CSS for styling with:

- Custom color palette defined in `tailwind.config.js`
- Responsive design for all components
- Dark theme throughout the application

## Development Guidelines

- Follow the existing file and component structure
- Use Redux Toolkit for all state management
- Use React Router for navigation
- Follow the existing naming conventions
- Use functional components and hooks
- Use async/await for asynchronous operations
- Add proper error handling for all API calls