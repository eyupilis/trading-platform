import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TradeSignal {
  id: string;
  trader_id: string;
  market_id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entry_price: number;
  take_profit: number;
  stop_loss: number;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  created_at: string;
  analysis?: string;
}

interface TradesState {
  signals: TradeSignal[];
  loading: boolean;
  error: string | null;
  filter: string | null;
}

const initialState: TradesState = {
  signals: [],
  loading: false,
  error: null,
  filter: null,
};

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    fetchSignalsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSignalsSuccess: (state, action: PayloadAction<TradeSignal[]>) => {
      state.loading = false;
      state.signals = action.payload;
      state.error = null;
    },
    fetchSignalsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSignal: (state, action: PayloadAction<TradeSignal>) => {
      state.signals.unshift(action.payload);
    },
    updateSignal: (state, action: PayloadAction<TradeSignal>) => {
      const index = state.signals.findIndex(signal => signal.id === action.payload.id);
      if (index !== -1) {
        state.signals[index] = action.payload;
      }
    },
    removeSignal: (state, action: PayloadAction<string>) => {
      state.signals = state.signals.filter(signal => signal.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<string | null>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  fetchSignalsStart,
  fetchSignalsSuccess,
  fetchSignalsFailure,
  addSignal,
  updateSignal,
  removeSignal,
  setFilter,
} = tradesSlice.actions;

export default tradesSlice.reducer;
