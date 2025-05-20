import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFinancialNews } from '../../services/api';

// Async thunk
export const fetchMarketNews = createAsyncThunk(
  'marketIntelligence/fetchNews',
  async (symbol = null, { rejectWithValue }) => {
    try {
      const data = await getFinancialNews(symbol);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  news: [],
  trendingTopics: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const marketIntelligenceSlice = createSlice({
  name: 'marketIntelligence',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.items || [];
        
        // Extract trending topics from news headlines
        const topics = new Map();
        state.news.forEach(article => {
          const title = article.title || '';
          const words = title.split(' ')
            .filter(word => word.length > 4)
            .map(word => word.replace(/[^a-zA-Z]/g, ''));
          
          words.forEach(word => {
            if (topics.has(word)) {
              topics.set(word, topics.get(word) + 1);
            } else {
              topics.set(word, 1);
            }
          });
        });
        
        // Sort topics by frequency and take top 10
        state.trendingTopics = Array.from(topics.entries())
          .filter(([word, count]) => count > 1)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([word, count]) => ({ word, count }));
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMarketNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors } = marketIntelligenceSlice.actions;

export default marketIntelligenceSlice.reducer;