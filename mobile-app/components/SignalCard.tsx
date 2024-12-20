import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from './Themed';
import { Ionicons } from '@expo/vector-icons';

export type SignalCardProps = {
  title: string;
  type: 'BUY' | 'SELL';
  price: string;
  change: string;
  timestamp: string;
};

export const SignalCard = ({ title, type, price, change, timestamp }: SignalCardProps) => {
  const isPositive = type === 'BUY';
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, isPositive ? styles.buyBadge : styles.sellBadge]}>
          <Text style={styles.badgeText}>{type}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.price}>${price}</Text>
          <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
            {change}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={24}
            color={isPositive ? '#4CAF50' : '#F44336'}
          />
        </View>
      </View>

      <Text style={styles.timestamp}>{formattedDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buyBadge: {
    backgroundColor: '#E8F5E9',
  },
  sellBadge: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  change: {
    fontSize: 16,
    fontWeight: '500',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});
