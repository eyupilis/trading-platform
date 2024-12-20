import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency } from '../utils/helpers';

const CreateAlertScreen = ({ route, navigation }) => {
  const { pair, currentPrice } = route.params;
  const [alertData, setAlertData] = useState({
    price: '',
    direction: 'above', // 'above' or 'below'
    notificationType: {
      push: true,
      email: false,
      sms: false,
    },
    repeat: false,
    note: '',
  });

  const handleCreateAlert = async () => {
    if (!alertData.price) {
      Alert.alert('Hata', 'Lütfen bir fiyat belirleyin');
      return;
    }

    try {
      // TODO: Implement actual API call to create alert
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Başarılı',
        'Fiyat alarmı başarıyla oluşturuldu',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Alarm oluşturulurken bir hata oluştu');
    }
  };

  const updateNotificationType = (type, value) => {
    setAlertData(prev => ({
      ...prev,
      notificationType: {
        ...prev.notificationType,
        [type]: value,
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.pairText}>{pair}</Text>
            <Text style={styles.currentPrice}>
              Mevcut Fiyat: {formatCurrency(currentPrice, 'USD')}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fiyat Koşulu</Text>
            <View style={styles.directionButtons}>
              <TouchableOpacity
                style={[
                  styles.directionButton,
                  alertData.direction === 'above' && styles.directionButtonActive,
                ]}
                onPress={() => setAlertData(prev => ({ ...prev, direction: 'above' }))}
              >
                <Text style={[
                  styles.directionButtonText,
                  alertData.direction === 'above' && styles.directionButtonTextActive,
                ]}>
                  Üzerine Çıktığında
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.directionButton,
                  alertData.direction === 'below' && styles.directionButtonActive,
                ]}
                onPress={() => setAlertData(prev => ({ ...prev, direction: 'below' }))}
              >
                <Text style={[
                  styles.directionButtonText,
                  alertData.direction === 'below' && styles.directionButtonTextActive,
                ]}>
                  Altına Düştüğünde
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.priceInputContainer}>
              <Text style={styles.label}>Fiyat</Text>
              <TextInput
                style={styles.priceInput}
                value={alertData.price}
                onChangeText={(value) => setAlertData(prev => ({ ...prev, price: value }))}
                placeholder="Fiyat girin"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bildirim Tercihleri</Text>
            <View style={styles.notificationOptions}>
              <View style={styles.notificationOption}>
                <Text style={styles.optionText}>Push Bildirimi</Text>
                <Switch
                  value={alertData.notificationType.push}
                  onValueChange={(value) => updateNotificationType('push', value)}
                  trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                  thumbColor={alertData.notificationType.push ? COLORS.white : '#f4f3f4'}
                />
              </View>
              <View style={styles.notificationOption}>
                <Text style={styles.optionText}>E-posta</Text>
                <Switch
                  value={alertData.notificationType.email}
                  onValueChange={(value) => updateNotificationType('email', value)}
                  trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                  thumbColor={alertData.notificationType.email ? COLORS.white : '#f4f3f4'}
                />
              </View>
              <View style={styles.notificationOption}>
                <Text style={styles.optionText}>SMS</Text>
                <Switch
                  value={alertData.notificationType.sms}
                  onValueChange={(value) => updateNotificationType('sms', value)}
                  trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                  thumbColor={alertData.notificationType.sms ? COLORS.white : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.repeatOption}>
              <Text style={styles.optionText}>Tekrarlayan Alarm</Text>
              <Switch
                value={alertData.repeat}
                onValueChange={(value) => setAlertData(prev => ({ ...prev, repeat: value }))}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={alertData.repeat ? COLORS.white : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Not (İsteğe bağlı)</Text>
            <TextInput
              style={styles.noteInput}
              value={alertData.note}
              onChangeText={(value) => setAlertData(prev => ({ ...prev, note: value }))}
              placeholder="Alarm için not ekleyin"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAlert}
          >
            <Text style={styles.createButtonText}>Alarm Oluştur</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pairText: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: 8,
  },
  currentPrice: {
    ...FONTS.body3,
    color: COLORS.secondary,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: 16,
  },
  directionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  directionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  directionButtonActive: {
    backgroundColor: COLORS.primary,
  },
  directionButtonText: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  directionButtonTextActive: {
    color: COLORS.white,
  },
  priceInputContainer: {
    marginTop: 8,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notificationOptions: {
    marginTop: 8,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  repeatOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    ...FONTS.body3,
    color: COLORS.secondary,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    margin: 16,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default CreateAlertScreen;
