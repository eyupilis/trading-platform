import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  signals: [],
  loading: false,
  error: null,
  filter: 'all' // 'all' | 'active' | 'closed'
};

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    fetchSignalsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSignalsSuccess: (state, action) => {
      state.loading = false;
      state.signals = action.payload;
    },
    fetchSignalsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSignal: (state, action) => {
      state.signals.unshift(action.payload);
    },
    updateSignal: (state, action) => {
      const index = state.signals.findIndex(signal => signal.id === action.payload.id);
      if (index !== -1) {
        state.signals[index] = action.payload;
      }
    },
    removeSignal: (state, action) => {
      state.signals = state.signals.filter(signal => signal.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearSignals: (state) => {
      state.signals = [];
      state.error = null;
    }
  }
});

export const {
  fetchSignalsStart,
  fetchSignalsSuccess,
  fetchSignalsFailure,
  addSignal,
  updateSignal,
  removeSignal,
  setFilter,
  clearSignals
} = tradesSlice.actions;

export default tradesSlice.reducer;
