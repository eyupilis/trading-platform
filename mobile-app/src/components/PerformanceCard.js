import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './common/Card';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const PerformanceCard = ({ statistics }) => {
  const theme = useTheme();
  const {
    totalTrades,
    profitableTrades,
    winRate,
    totalPnL,
    loading,
  } = statistics;

  const renderStatItem = (label, value, format = 'text') => {
    let formattedValue = value;
    if (format === 'currency') {
      formattedValue = formatCurrency(value);
    } else if (format === 'percentage') {
      formattedValue = formatPercentage(value);
    }

    return (
      <View style={styles.statItem}>
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
        <Text
          style={[
            styles.value,
            { color: theme.colors.primary },
            value < 0 && { color: theme.colors.error },
          ]}
        >
          {formattedValue}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <Card style={styles.container}><Text>Loading...</Text></Card>;
  }

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Performance Overview
      </Text>
      <View style={styles.grid}>
        {renderStatItem('Total Trades', totalTrades)}
        {renderStatItem('Win Rate', winRate, 'percentage')}
        {renderStatItem('Profitable Trades', profitableTrades)}
        {renderStatItem('Total P&L', totalPnL, 'currency')}
      </View>
    </Card>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PerformanceCard;
