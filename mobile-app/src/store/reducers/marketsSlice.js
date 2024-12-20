import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  markets: [],
  selectedMarket: null,
  loading: false,
  error: null
};

const marketsSlice = createSlice({
  name: 'markets',
  initialState,
  reducers: {
    fetchMarketsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMarketsSuccess: (state, action) => {
      state.loading = false;
      state.markets = action.payload;
    },
    fetchMarketsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectMarket: (state, action) => {
      state.selectedMarket = action.payload;
    },
    updateMarketData: (state, action) => {
      const index = state.markets.findIndex(market => market.symbol === action.payload.symbol);
      if (index !== -1) {
        state.markets[index] = { ...state.markets[index], ...action.payload };
      }
    }
  }
});

export const {
  fetchMarketsStart,
  fetchMarketsSuccess,
  fetchMarketsFailure,
  selectMarket,
  updateMarketData
} = marketsSlice.actions;

export default marketsSlice.reducer;
