import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMarketOverview, getMarketMovers } from '../../services/api';

// Async thunks
export const fetchMarketOverview = createAsyncThunk(
  'marketOverview/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getMarketOverview();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMarketMovers = createAsyncThunk(
  'marketOverview/fetchMovers',
  async (type = 'gainers', { rejectWithValue }) => {
    try {
      const data = await getMarketMovers(type);
      return { type, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  marketSummary: {},
  gainers: [],
  losers: [],
  actives: [],
  sectors: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

const marketOverviewSlice = createSlice({
  name: 'marketOverview',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Market Overview
      .addCase(fetchMarketOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.marketSummary = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMarketOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Market Movers
      .addCase(fetchMarketMovers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketMovers.fulfilled, (state, action) => {
        state.loading = false;
        const { type, data } = action.payload;
        
        if (type === 'gainers') {
          state.gainers = data.finance?.result || [];
        } else if (type === 'losers') {
          state.losers = data.finance?.result || [];
        } else if (type === 'actives') {
          state.actives = data.finance?.result || [];
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMarketMovers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = marketOverviewSlice.actions;

export default marketOverviewSlice.reducer;