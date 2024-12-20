import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { store } from '../store';
import { addNotification } from '../store/reducers/tradingSlice';
import { tradingAPI } from './api/trading';

export const initNotifications = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('trading', {
      name: 'Trading Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  return true;
};

export const scheduleNotification = async ({ title, body, data = {} }) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null,
  });
};

export const handleTradingNotification = async (position) => {
  const { type, price, targetPrice } = position;
  let title, body;

  switch (type) {
    case 'take_profit':
      title = 'Take Profit Tetiklendi! 🎯';
      body = `Hedef fiyat ${targetPrice} seviyesine ulaşıldı. Kar realizasyonu gerçekleştirildi.`;
      break;
    case 'stop_loss':
      title = 'Stop Loss Tetiklendi! ⚠️';
      body = `Stop loss seviyesi ${targetPrice} tetiklendi. Pozisyon kapatıldı.`;
      break;
    case 'price_alert':
      title = 'Fiyat Alarmı! 📊';
      body = `Fiyat ${price} seviyesine ulaştı.`;
      break;
    default:
      return;
  }

  // Local bildirim gönder
  await scheduleNotification({ title, body, data: position });

  // Store'a bildirim ekle
  store.dispatch(addNotification({
    id: Date.now().toString(),
    title,
    message: body,
    type: position.type,
    positionId: position.id,
    isRead: false,
    createdAt: new Date().toISOString(),
  }));

  // Bildirim tercihlerini kontrol et ve e-posta gönder
  const preferences = await tradingAPI.getNotificationPreferences();
  if (preferences.email_notifications) {
    // E-posta bildirimi gönder
    await tradingAPI.sendEmailNotification({
      type: position.type,
      position: position,
    });
  }
};

export const setupNotificationHandlers = () => {
  Notifications.addNotificationReceivedListener(notification => {
    // Bildirim alındığında yapılacak işlemler
    console.log('Notification received:', notification);
  });

  Notifications.addNotificationResponseReceivedListener(response => {
    // Bildirime tıklandığında yapılacak işlemler
    console.log('Notification response:', response);
  });
};
