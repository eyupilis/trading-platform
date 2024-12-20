import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import chatService from '../services/chatService';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: {
      trades: true,
      news: true,
      priceAlerts: true,
      chat: true,
    },
    chat: {
      notifications: true,
      soundEnabled: true,
      theme: 'light',
      fontSize: 'medium',
    },
    security: {
      biometricLogin: false,
      twoFactorAuth: false,
    },
    display: {
      theme: 'light',
      language: 'tr',
      currency: 'USD',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load chat settings
      const chatSettings = await chatService.getChatSettings();
      setSettings(prev => ({
        ...prev,
        chat: chatSettings,
      }));

      // TODO: Load other settings from API
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = async (category, setting, value) => {
    try {
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: value,
        },
      }));

      if (category === 'chat') {
        await chatService.updateChatSettings({
          ...settings.chat,
          [setting]: value,
        });
      }

      // TODO: Update other settings via API
    } catch (error) {
      Alert.alert('Hata', 'Ayarlar güncellenirken bir hata oluştu');
    }
  };

  const renderSwitch = (category, setting, label) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={settings[category][setting]}
        onValueChange={(value) => handleSettingChange(category, setting, value)}
        trackColor={{ false: COLORS.gray, true: COLORS.primary }}
      />
    </View>
  );

  const renderOption = (category, setting, label, options) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              settings[category][setting] === option.value && styles.selectedOption,
            ]}
            onPress={() => handleSettingChange(category, setting, option.value)}
          >
            <Text style={[
              styles.optionText,
              settings[category][setting] === option.value && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          {renderSwitch('notifications', 'trades', 'İşlem Bildirimleri')}
          {renderSwitch('notifications', 'news', 'Haber Bildirimleri')}
          {renderSwitch('notifications', 'priceAlerts', 'Fiyat Alarmları')}
          {renderSwitch('notifications', 'chat', 'Sohbet Bildirimleri')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sohbet Ayarları</Text>
          {renderSwitch('chat', 'notifications', 'Bildirimler')}
          {renderSwitch('chat', 'soundEnabled', 'Ses')}
          {renderOption('chat', 'theme', 'Tema', [
            { label: 'Açık', value: 'light' },
            { label: 'Koyu', value: 'dark' },
          ])}
          {renderOption('chat', 'fontSize', 'Yazı Boyutu', [
            { label: 'Küçük', value: 'small' },
            { label: 'Orta', value: 'medium' },
            { label: 'Büyük', value: 'large' },
          ])}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Güvenlik</Text>
          {renderSwitch('security', 'biometricLogin', 'Biyometrik Giriş')}
          {renderSwitch('security', 'twoFactorAuth', 'İki Faktörlü Doğrulama')}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Text style={styles.buttonText}>Şifre Değiştir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Görünüm</Text>
          {renderOption('display', 'theme', 'Tema', [
            { label: 'Açık', value: 'light' },
            { label: 'Koyu', value: 'dark' },
            { label: 'Sistem', value: 'system' },
          ])}
          {renderOption('display', 'language', 'Dil', [
            { label: 'Türkçe', value: 'tr' },
            { label: 'English', value: 'en' },
          ])}
          {renderOption('display', 'currency', 'Para Birimi', [
            { label: 'USD', value: 'USD' },
            { label: 'TRY', value: 'TRY' },
            { label: 'EUR', value: 'EUR' },
          ])}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert('Önbellek temizlendi')}
          >
            <Text style={styles.buttonText}>Önbelleği Temizle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={() => Alert.alert(
              'Hesabı Sil',
              'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
              [
                { text: 'İptal', style: 'cancel' },
                {
                  text: 'Sil',
                  style: 'destructive',
                  onPress: () => console.log('Delete account'),
                },
              ]
            )}
          >
            <Text style={[styles.buttonText, styles.dangerButtonText]}>
              Hesabı Sil
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
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
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    ...FONTS.body4,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: 4,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  selectedOptionText: {
    color: COLORS.white,
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
  dangerButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  dangerButtonText: {
    color: COLORS.error,
  },
});

export default SettingsScreen;
