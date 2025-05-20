import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLottoPicks } from '../../services/api';

// Async thunk
export const fetchLottoPicks = createAsyncThunk(
  'lottoPicks/fetchPicks',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getLottoPicks();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  lottoPicks: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const lottoPicksSlice = createSlice({
  name: 'lottoPicks',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLottoPicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLottoPicks.fulfilled, (state, action) => {
        state.loading = false;
        state.lottoPicks = action.payload.lottoPicks || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchLottoPicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = lottoPicksSlice.actions;

export default lottoPicksSlice.reducer;