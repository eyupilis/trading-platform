import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const { width } = Dimensions.get('window');

const MarketOverviewScreen = ({ navigation }) => {
  const [marketData, setMarketData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
  }, [selectedTimeframe]);

  const fetchMarketData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData = {
        totalMarketCap: 2.1e12, // 2.1 trillion
        totalVolume24h: 98e9, // 98 billion
        btcDominance: 42.5,
        topGainers: [
          { pair: 'SOL/USDT', change: 15.2, price: 75.45 },
          { pair: 'AVAX/USDT', change: 12.8, price: 42.30 },
          { pair: 'DOT/USDT', change: 8.5, price: 8.92 },
        ],
        topLosers: [
          { pair: 'DOGE/USDT', change: -7.8, price: 0.082 },
          { pair: 'SHIB/USDT', change: -6.4, price: 0.00001234 },
          { pair: 'XRP/USDT', change: -4.2, price: 0.62 },
        ],
        chartData: {
          labels: ['', '', '', '', '', ''],
          datasets: [{
            data: [2.0e12, 2.05e12, 2.12e12, 2.08e12, 2.15e12, 2.1e12],
          }],
        },
      };
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMarketData();
  };

  const renderTimeframeButtons = () => {
    const timeframes = ['24h', '7d', '30d', '90d'];
    return (
      <View style={styles.timeframeContainer}>
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe && styles.selectedTimeframe,
            ]}
            onPress={() => setSelectedTimeframe(timeframe)}
          >
            <Text style={[
              styles.timeframeText,
              selectedTimeframe === timeframe && styles.selectedTimeframeText,
            ]}>
              {timeframe}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMarketStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Toplam Piyasa Değeri</Text>
        <Text style={styles.statValue}>
          {formatCurrency(marketData.totalMarketCap, 'USD')}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>24s Hacim</Text>
        <Text style={styles.statValue}>
          {formatCurrency(marketData.totalVolume24h, 'USD')}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>BTC Dominansı</Text>
        <Text style={styles.statValue}>
          {formatPercentage(marketData.btcDominance)}
        </Text>
      </View>
    </View>
  );

  const renderMovers = (title, data, isGainers) => (
    <View style={styles.moversSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.moverItem}
          onPress={() => navigation.navigate('PairDetail', { pair: item.pair })}
        >
          <Text style={styles.moverPair}>{item.pair}</Text>
          <View style={styles.moverInfo}>
            <Text style={styles.moverPrice}>
              {formatCurrency(item.price, 'USD')}
            </Text>
            <Text style={[
              styles.moverChange,
              { color: isGainers ? COLORS.success : COLORS.error }
            ]}>
              {formatPercentage(item.change)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Toplam Piyasa Değeri</Text>
          {renderTimeframeButtons()}
          <LineChart
            data={marketData.chartData}
            width={width - 32}
            height={220}
            chartConfig={{
              backgroundColor: COLORS.white,
              backgroundGradientFrom: COLORS.white,
              backgroundGradientTo: COLORS.white,
              decimalPlaces: 0,
              color: (opacity = 1) => COLORS.primary,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {renderMarketStats()}

        <View style={styles.moversContainer}>
          {renderMovers('En Çok Yükselenler', marketData.topGainers, true)}
          {renderMovers('En Çok Düşenler', marketData.topLosers, false)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    ...FONTS.h3,
    color: COLORS.secondary,
    marginBottom: 16,
  },
  timeframeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.lightGray,
  },
  selectedTimeframe: {
    backgroundColor: COLORS.primary,
  },
  timeframeText: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  selectedTimeframeText: {
    color: COLORS.white,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginBottom: 4,
  },
  statValue: {
    ...FONTS.body3,
    color: COLORS.secondary,
  },
  moversContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  moversSection: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.secondary,
    marginBottom: 12,
  },
  moverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moverPair: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  moverInfo: {
    alignItems: 'flex-end',
  },
  moverPrice: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  moverChange: {
    ...FONTS.body5,
    marginTop: 2,
  },
});

export default MarketOverviewScreen;
