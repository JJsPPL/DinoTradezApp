import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDarkPoolData } from '../../services/api';

// Default symbols to track for dark pool activity
const DEFAULT_SYMBOLS = 'SPY,QQQ,AAPL,MSFT,AMZN,TSLA,NVDA,AMD,META,GOOG,NFLX,INTC,BA,XOM,JPM,GS,MS,C,BAC,WFC';

// Async thunk
export const fetchDarkPoolData = createAsyncThunk(
  'darkPool/fetchData',
  async (symbols = DEFAULT_SYMBOLS, { rejectWithValue }) => {
    try {
      const data = await getDarkPoolData(symbols);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  darkPoolData: [],
  unusualActivity: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const darkPoolSlice = createSlice({
  name: 'darkPool',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDarkPoolData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDarkPoolData.fulfilled, (state, action) => {
        state.loading = false;
        state.darkPoolData = action.payload.darkPoolData || [];
        
        // Identify unusual dark pool activity
        state.unusualActivity = state.darkPoolData.filter(
          stock => 
            stock.isUnusual && 
            parseFloat(stock.darkPoolPercent) > 30 // More than 30% of volume in dark pools
        );
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDarkPoolData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = darkPoolSlice.actions;

export default darkPoolSlice.reducer;