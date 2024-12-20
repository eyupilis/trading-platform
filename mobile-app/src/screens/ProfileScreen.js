import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import chatService from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [chatSettings, setChatSettings] = useState(null);
  const [stats, setStats] = useState({
    totalTrades: 0,
    successRate: 0,
    favoriteMarkets: [],
    activeAlerts: 0,
  });

  useEffect(() => {
    loadChatSettings();
    loadUserStats();
  }, []);

  const loadChatSettings = async () => {
    try {
      const settings = await chatService.getChatSettings();
      setChatSettings(settings);
    } catch (error) {
      console.error('Error loading chat settings:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      // TODO: Replace with actual API call
      const mockStats = {
        totalTrades: 156,
        successRate: 68.5,
        favoriteMarkets: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
        activeAlerts: 5,
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const handleResetUsername = async () => {
    try {
      const newUsername = chatService.generateUsername();
      await chatService.saveUsername(newUsername);
      await loadChatSettings();
      Alert.alert('Başarılı', 'Kullanıcı adınız yenilendi');
    } catch (error) {
      Alert.alert('Hata', 'Kullanıcı adı güncellenirken bir hata oluştu');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user.avatar || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İşlem İstatistikleri</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalTrades}</Text>
              <Text style={styles.statLabel}>Toplam İşlem</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>%{stats.successRate}</Text>
              <Text style={styles.statLabel}>Başarı Oranı</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.activeAlerts}</Text>
              <Text style={styles.statLabel}>Aktif Alarm</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favori Piyasalar</Text>
          <View style={styles.marketsContainer}>
            {stats.favoriteMarkets.map((market, index) => (
              <TouchableOpacity
                key={index}
                style={styles.marketItem}
                onPress={() => navigation.navigate('PairDetail', { pair: market })}
              >
                <Text style={styles.marketText}>{market}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sohbet Ayarları</Text>
          {chatSettings && (
            <>
              <View style={styles.chatSettingItem}>
                <Text style={styles.settingLabel}>Anonim Kullanıcı Adı</Text>
                <Text style={styles.settingValue}>{chatSettings.username}</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={handleResetUsername}
              >
                <Text style={styles.buttonText}>Kullanıcı Adını Yenile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>
            Çıkış Yap
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 4,
  },
  email: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginTop: 16,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.secondary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  marketsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  marketItem: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  marketText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  chatSettingItem: {
    marginBottom: 12,
  },
  settingLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 4,
  },
  settingValue: {
    ...FONTS.body3,
    color: COLORS.secondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
    margin: 20,
  },
  logoutButtonText: {
    color: COLORS.error,
  },
});

export default ProfileScreen;
