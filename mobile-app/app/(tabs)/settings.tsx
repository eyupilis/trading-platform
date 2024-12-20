import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'action';
  value?: boolean;
  options?: string[];
  icon: string;
  onPress?: () => void;
}

export const SettingsScreen = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Turkish', 'Spanish', 'French', 'German'];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: handleLogout, style: 'destructive' },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      languages.map(lang => ({
        text: lang,
        onPress: () => setSelectedLanguage(lang),
      }))
    );
  };

  const settings: SettingItem[] = [
    {
      id: 'appearance',
      title: 'Dark Mode',
      description: 'Enable dark mode for better viewing at night',
      type: 'toggle',
      value: darkMode,
      icon: 'moon',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Receive alerts for important updates',
      type: 'toggle',
      value: notifications,
      icon: 'notifications',
    },
    {
      id: 'biometrics',
      title: 'Biometric Login',
      description: 'Use fingerprint or face ID for quick access',
      type: 'toggle',
      value: biometrics,
      icon: 'finger-print',
    },
    {
      id: 'language',
      title: 'Language',
      description: `Current: ${selectedLanguage}`,
      type: 'select',
      icon: 'language',
      onPress: handleLanguageChange,
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Manage your account security preferences',
      type: 'action',
      icon: 'shield',
      onPress: () => console.log('Navigate to security settings'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      type: 'action',
      icon: 'lock-closed',
      onPress: () => console.log('Navigate to privacy policy'),
    },
    {
      id: 'about',
      title: 'About',
      description: 'Learn more about our app',
      type: 'action',
      icon: 'information-circle',
      onPress: () => console.log('Navigate to about page'),
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case 'appearance':
        setDarkMode(value);
        break;
      case 'notifications':
        setNotifications(value);
        break;
      case 'biometrics':
        setBiometrics(value);
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        {settings.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.type === 'action' ? item.onPress : undefined}
          >
            <View style={styles.settingIcon}>
              <Ionicons name={item.icon as any} size={24} color="#2196F3" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Text style={styles.settingDescription}>{item.description}</Text>
            </View>
            {item.type === 'toggle' && (
              <Switch
                value={item.value}
                onValueChange={(value) => handleToggle(item.id, value)}
                trackColor={{ false: '#ddd', true: '#2196F3' }}
                thumbColor="#fff"
              />
            )}
            {item.type === 'select' && (
              <Ionicons name="chevron-forward" size={24} color="#666" />
            )}
            {item.type === 'action' && (
              <Ionicons name="chevron-forward" size={24} color="#666" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out" size={24} color="#F44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  logoutText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 30,
  },
});

export default SettingsScreen;
