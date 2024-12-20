import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency } from '../utils/helpers';

const PriceAlertsList = ({ alerts, onDeleteAlert, onEditAlert }) => {
  const handleDeleteAlert = (alertId) => {
    Alert.alert(
      'Alarmı Sil',
      'Bu alarmı silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: () => onDeleteAlert(alertId),
          style: 'destructive',
        },
      ]
    );
  };

  const renderAlertItem = ({ item }) => {
    const isAbove = item.direction === 'above';
    const isPriceReached = isAbove 
      ? item.currentPrice >= item.targetPrice
      : item.currentPrice <= item.targetPrice;

    return (
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Text style={styles.pairText}>{item.pair}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isPriceReached ? COLORS.success : COLORS.warning }
          ]}>
            <Text style={styles.statusText}>
              {isPriceReached ? 'Tetiklendi' : 'Bekliyor'}
            </Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Hedef Fiyat</Text>
            <Text style={styles.priceValue}>
              {formatCurrency(item.targetPrice, 'USD')}
            </Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Mevcut Fiyat</Text>
            <Text style={styles.priceValue}>
              {formatCurrency(item.currentPrice, 'USD')}
            </Text>
          </View>
        </View>

        <View style={styles.conditionContainer}>
          <Text style={styles.conditionText}>
            Fiyat {isAbove ? 'üzerine çıktığında' : 'altına düştüğünde'}
          </Text>
        </View>

        {item.note && (
          <Text style={styles.noteText} numberOfLines={2}>
            Not: {item.note}
          </Text>
        )}

        <View style={styles.notificationTypes}>
          {item.notificationType.push && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>Push</Text>
            </View>
          )}
          {item.notificationType.email && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>E-posta</Text>
            </View>
          )}
          {item.notificationType.sms && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>SMS</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEditAlert(item.id)}
          >
            <Text style={styles.actionButtonText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteAlert(item.id)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Sil
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={alerts}
      renderItem={renderAlertItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pairText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 4,
  },
  priceValue: {
    ...FONTS.body3,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  conditionContainer: {
    backgroundColor: COLORS.lightGray,
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  conditionText: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  noteText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  notificationTypes: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  notificationBadge: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  notificationText: {
    ...FONTS.body5,
    color: COLORS.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  deleteButtonText: {
    color: COLORS.error,
  },
});

export default PriceAlertsList;
