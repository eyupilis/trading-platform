import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { closePosition } from '../store/reducers/tradingSlice';
import { Card } from './common/Card';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const ActivePositions = ({ positions }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleClosePosition = (position) => {
    Alert.alert(
      'Close Position',
      `Are you sure you want to close your ${position.type} position for ${position.symbol}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(closePosition({
                positionId: position.id,
                data: { closePrice: position.currentPrice }
              })).unwrap();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to close position');
            }
          },
        },
      ]
    );
  };

  const renderPosition = ({ item: position }) => {
    const isProfitable = position.unrealizedPnl > 0;
    const profitColor = isProfitable ? theme.colors.success : theme.colors.error;

    return (
      <Card style={styles.positionCard}>
        <View style={styles.positionHeader}>
          <Text style={[styles.symbol, { color: theme.colors.text }]}>
            {position.symbol}
          </Text>
          <View style={[
            styles.typeBadge,
            { backgroundColor: position.type === 'LONG' ? theme.colors.success : theme.colors.error }
          ]}>
            <Text style={styles.typeText}>{position.type}</Text>
          </View>
        </View>

        <View style={styles.positionDetails}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Entry Price</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {formatCurrency(position.entryPrice)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Current Price</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {formatCurrency(position.currentPrice)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.text }]}>P&L</Text>
            <Text style={[styles.value, { color: profitColor }]}>
              {formatCurrency(position.unrealizedPnl)} ({formatPercentage(position.pnlPercentage)})
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: theme.colors.error }]}
          onPress={() => handleClosePosition(position)}
        >
          <Text style={styles.closeButtonText}>Close Position</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Active Positions
      </Text>
      <FlatList
        data={positions}
        renderItem={renderPosition}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No active positions
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  positionCard: {
    marginBottom: 12,
    padding: 16,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  positionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
});

export default ActivePositions;
