import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tradingAPI } from '../../services/api/trading';
import { captureError } from '../../services/errorTracking';

// Async thunks
export const fetchPositions = createAsyncThunk(
  'trading/fetchPositions',
  async (params, { rejectWithValue }) => {
    try {
      return await tradingAPI.getPositions(params);
    } catch (error) {
      captureError(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const openPosition = createAsyncThunk(
  'trading/openPosition',
  async (data, { rejectWithValue }) => {
    try {
      return await tradingAPI.openPosition(data);
    } catch (error) {
      captureError(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const closePosition = createAsyncThunk(
  'trading/closePosition',
  async ({ positionId, data }, { rejectWithValue }) => {
    try {
      return await tradingAPI.closePosition(positionId, data);
    } catch (error) {
      captureError(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTradeHistory = createAsyncThunk(
  'trading/fetchTradeHistory',
  async (params, { rejectWithValue }) => {
    try {
      return await tradingAPI.getTradeHistory(params);
    } catch (error) {
      captureError(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  positions: {
    data: [],
    loading: false,
    error: null,
  },
  tradeHistory: {
    data: [],
    loading: false,
    error: null,
  },
  statistics: {
    totalTrades: 0,
    profitableTrades: 0,
    winRate: 0,
    totalPnL: 0,
    loading: false,
    error: null,
  },
  notifications: {
    unread: 0,
    data: [],
    loading: false,
    error: null,
  },
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    updatePositionPrice: (state, action) => {
      const { positionId, currentPrice, unrealizedPnl } = action.payload;
      const position = state.positions.data.find(p => p.id === positionId);
      if (position) {
        position.currentPrice = currentPrice;
        position.unrealizedPnl = unrealizedPnl;
      }
    },
    addNotification: (state, action) => {
      state.notifications.data.unshift(action.payload);
      state.notifications.unread += 1;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.data.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.notifications.unread -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    // Positions
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.positions.loading = true;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.positions.loading = false;
        state.positions.data = action.payload;
        state.positions.error = null;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.positions.loading = false;
        state.positions.error = action.payload;
      })
      
    // Trade History
      .addCase(fetchTradeHistory.pending, (state) => {
        state.tradeHistory.loading = true;
      })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.tradeHistory.loading = false;
        state.tradeHistory.data = action.payload;
        state.tradeHistory.error = null;
      })
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        state.tradeHistory.loading = false;
        state.tradeHistory.error = action.payload;
      })
      
    // Position Operations
      .addCase(openPosition.fulfilled, (state, action) => {
        state.positions.data.unshift(action.payload);
      })
      .addCase(closePosition.fulfilled, (state, action) => {
        const index = state.positions.data.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.positions.data[index] = action.payload;
        }
      });
  },
});

export const { updatePositionPrice, addNotification, markNotificationRead } = tradingSlice.actions;

export default tradingSlice.reducer;
