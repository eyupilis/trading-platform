import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.reconnectAttempts = 0;
      }
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
  },
});

export const {
  setConnected,
  incrementReconnectAttempts,
  resetReconnectAttempts,
} = networkSlice.actions;

export default networkSlice.reducer;
