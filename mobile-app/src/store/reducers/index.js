import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tradesReducer from './tradesSlice';
import marketsReducer from './marketsSlice';
import settingsReducer from './settingsSlice';
import networkReducer from './networkSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  trades: tradesReducer,
  markets: marketsReducer,
  settings: settingsReducer,
  network: networkReducer
});

export default rootReducer;
