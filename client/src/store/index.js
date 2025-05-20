import { configureStore } from '@reduxjs/toolkit';
import marketOverviewReducer from '../features/marketOverview/marketOverviewSlice';
import darkPoolReducer from '../features/darkPool/darkPoolSlice';
import lottoPicksReducer from '../features/lottoPicks/lottoPicksSlice';
import marketIntelligenceReducer from '../features/marketIntelligence/marketIntelligenceSlice';
import watchlistsReducer from '../features/watchlists/watchlistsSlice';

export const store = configureStore({
  reducer: {
    marketOverview: marketOverviewReducer,
    darkPool: darkPoolReducer,
    lottoPicks: lottoPicksReducer,
    marketIntelligence: marketIntelligenceReducer,
    watchlists: watchlistsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});