import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light' | 'dark'
  notifications: true,
  language: 'en',
  currency: 'USD'
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    resetSettings: () => initialState
  }
});

export const {
  setTheme,
  toggleNotifications,
  setLanguage,
  setCurrency,
  resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;
