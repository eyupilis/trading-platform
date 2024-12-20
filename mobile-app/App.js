import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NetInfo from '@react-native-community/netinfo';
import { store, persistor } from './src/store';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { initErrorTracking } from './src/services/errorTracking';
import { setOnlineStatus } from './src/store/reducers/networkSlice';
import websocketService from './src/services/websocket';

// Initialize error tracking
initErrorTracking();

const App = () => {
  useEffect(() => {
    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch(setOnlineStatus(state.isConnected));
      if (state.isConnected) {
        websocketService.connect();
      }
    });

    // Initial WebSocket connection
    websocketService.connect();

    return () => {
      unsubscribe();
      websocketService.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
