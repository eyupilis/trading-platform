import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PriceAlertsList from '../components/PriceAlertsList';
import { COLORS, FONTS } from '../constants/theme';

const AlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // TODO: Replace with actual API call
      const mockAlerts = [
        {
          id: '1',
          pair: 'BTC/USDT',
          targetPrice: 45000,
          currentPrice: 44500,
          direction: 'above',
          notificationType: {
            push: true,
            email: true,
            sms: false,
          },
          note: 'Önemli direnç noktası',
          repeat: false,
          createdAt: '2024-12-18T15:30:00Z',
        },
        {
          id: '2',
          pair: 'ETH/USDT',
          targetPrice: 2200,
          currentPrice: 2250,
          direction: 'below',
          notificationType: {
            push: true,
            email: false,
            sms: false,
          },
          note: 'Destek seviyesi',
          repeat: true,
          createdAt: '2024-12-18T14:00:00Z',
        },
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      Alert.alert('Hata', 'Alarmlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      Alert.alert('Başarılı', 'Alarm başarıyla silindi');
    } catch (error) {
      Alert.alert('Hata', 'Alarm silinirken bir hata oluştu');
    }
  };

  const handleEditAlert = (alertId) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      navigation.navigate('EditAlert', { alert });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fiyat Alarmları</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateAlert', {
            pair: 'BTC/USDT',
            currentPrice: 44500,
          })}
        >
          <Text style={styles.addButtonText}>+ Yeni Alarm</Text>
        </TouchableOpacity>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Henüz bir fiyat alarmı oluşturmadınız
          </Text>
          <Text style={styles.emptySubtext}>
            Yeni bir alarm oluşturmak için yukarıdaki butonu kullanın
          </Text>
        </View>
      ) : (
        <PriceAlertsList
          alerts={alerts}
          onDeleteAlert={handleDeleteAlert}
          onEditAlert={handleEditAlert}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

export default AlertsScreen;
