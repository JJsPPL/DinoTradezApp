import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBullishWatchlist, getBearishWatchlist } from '../../services/api';

// Async thunks
export const fetchBullishWatchlist = createAsyncThunk(
  'watchlists/fetchBullish',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getBullishWatchlist();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBearishWatchlist = createAsyncThunk(
  'watchlists/fetchBearish',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getBearishWatchlist();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  bullishWatchlist: [],
  bearishWatchlist: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const watchlistsSlice = createSlice({
  name: 'watchlists',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Bullish Watchlist
      .addCase(fetchBullishWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBullishWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.bullishWatchlist = action.payload.bullishWatchlist || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchBullishWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Bearish Watchlist
      .addCase(fetchBearishWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBearishWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.bearishWatchlist = action.payload.bearishWatchlist || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchBearishWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = watchlistsSlice.actions;

export default watchlistsSlice.reducer;