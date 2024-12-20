import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './common/Card';
import { useSocket } from '../contexts/SocketContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const MarketInfo = ({ symbol }) => {
  const theme = useTheme();
  const { socket } = useSocket();
  const [marketData, setMarketData] = useState({
    price: 0,
    change24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
  });

  useEffect(() => {
    if (socket) {
      // Subscribe to market data updates
      socket.emit('subscribe_market', { symbol });
      
      socket.on('market_update', (data) => {
        if (data.symbol === symbol) {
          setMarketData(data);
        }
      });

      return () => {
        socket.emit('unsubscribe_market', { symbol });
        socket.off('market_update');
      };
    }
  }, [socket, symbol]);

  const renderInfoItem = (label, value, format = 'text') => {
    let formattedValue = value;
    if (format === 'currency') {
      formattedValue = formatCurrency(value);
    } else if (format === 'percentage') {
      formattedValue = formatPercentage(value);
    }

    return (
      <View style={styles.infoItem}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <Text
          style={[
            styles.value,
            { color: theme.colors.text },
            format === 'percentage' && {
              color: value >= 0 ? theme.colors.success : theme.colors.error,
            },
          ]}
        >
          {formattedValue}
        </Text>
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.symbol, { color: theme.colors.text }]}>{symbol}</Text>
        <Text
          style={[
            styles.price,
            { color: marketData.change24h >= 0 ? theme.colors.success : theme.colors.error },
          ]}
        >
          {formatCurrency(marketData.price)}
        </Text>
      </View>

      <View style={styles.grid}>
        {renderInfoItem('24h Change', marketData.change24h, 'percentage')}
        {renderInfoItem('24h High', marketData.high24h, 'currency')}
        {renderInfoItem('24h Low', marketData.low24h, 'currency')}
        {renderInfoItem('24h Volume', marketData.volume24h, 'currency')}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MarketInfo;
