import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import TradesScreen from '../screens/TradesScreen';
import MarketScreen from '../screens/MarketScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewsScreen from '../screens/NewsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TradeDetailScreen from '../screens/TradeDetailScreen';
import CreateAlertScreen from '../screens/CreateAlertScreen';
import AlertsScreen from '../screens/AlertsScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import MarketOverviewScreen from '../screens/MarketOverviewScreen';
import PairDetailScreen from '../screens/PairDetailScreen';
import ChatRoomsScreen from '../screens/ChatRoomsScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import CreateChatRoomScreen from '../screens/CreateChatRoomScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import EducationScreen from '../screens/EducationScreen';

// Auth Navigator
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check for user token
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to get token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {userToken == null ? (
          // Auth screens
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // App screens
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen}
              options={{ title: 'Ana Sayfa' }}
            />
            <Stack.Screen 
              name="Trades" 
              component={TradesScreen}
              options={{ title: 'İşlemler' }}
            />
            <Stack.Screen 
              name="TradeDetail" 
              component={TradeDetailScreen}
              options={{ title: 'İşlem Detayı' }}
            />
            <Stack.Screen 
              name="Market" 
              component={MarketScreen}
              options={{ title: 'Piyasa' }}
            />
            <Stack.Screen 
              name="News" 
              component={NewsScreen}
              options={{ title: 'Haberler' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Profil' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Ayarlar' }}
            />
            <Stack.Screen 
              name="CreateAlert" 
              component={CreateAlertScreen}
              options={{ title: 'Alarm Oluştur' }}
            />
            <Stack.Screen 
              name="Alerts" 
              component={AlertsScreen}
              options={{ title: 'Alarmlar' }}
            />
            <Stack.Screen 
              name="Watchlist" 
              component={WatchlistScreen}
              options={{ title: 'İzleme Listesi' }}
            />
            <Stack.Screen 
              name="MarketOverview" 
              component={MarketOverviewScreen}
              options={{ title: 'Piyasa Özeti' }}
            />
            <Stack.Screen 
              name="PairDetail" 
              component={PairDetailScreen}
              options={{ title: 'Parite Detayı' }}
            />
            <Stack.Screen 
              name="ChatRooms" 
              component={ChatRoomsScreen}
              options={{ title: 'Sohbet Odaları' }}
            />
            <Stack.Screen 
              name="ChatRoom" 
              component={ChatRoomScreen}
              options={{ title: 'Sohbet' }}
            />
            <Stack.Screen 
              name="CreateChatRoom" 
              component={CreateChatRoomScreen}
              options={{ title: 'Oda Oluştur' }}
            />
            <Stack.Screen 
              name="Calculator" 
              component={CalculatorScreen}
              options={{ title: 'İşlem Hesaplayıcı' }}
            />
            <Stack.Screen 
              name="Education" 
              component={EducationScreen}
              options={{ title: 'Eğitimler' }}
            />
            <Stack.Screen 
              name="CourseDetail" 
              component={CourseDetailScreen}
              options={{ title: 'Kurs Detayı' }}
            />
            <Stack.Screen 
              name="Lesson" 
              component={LessonScreen}
              options={{ title: 'Ders' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
