import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const { width } = Dimensions.get('window');

const PairDetailScreen = ({ route, navigation }) => {
  const { pair } = route.params;
  const [pairData, setPairData] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    fetchPairData();
    checkWatchlistStatus();
  }, [selectedTimeframe]);

  const fetchPairData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData = {
        pair,
        price: 44500,
        change24h: 2.5,
        volume: '1.2B',
        high24h: 45000,
        low24h: 43000,
        marketCap: '850B',
        supply: {
          circulating: '19.5M',
          total: '21M',
        },
        chartData: {
          labels: ['', '', '', '', '', ''],
          datasets: [{
            data: [43000, 43500, 44200, 44100, 44800, 44500],
          }],
        },
        orderBook: {
          asks: [
            { price: 44550, amount: 1.2 },
            { price: 44600, amount: 0.8 },
            { price: 44650, amount: 2.1 },
          ],
          bids: [
            { price: 44450, amount: 1.5 },
            { price: 44400, amount: 1.1 },
            { price: 44350, amount: 0.9 },
          ],
        },
      };
      setPairData(mockData);
    } catch (error) {
      Alert.alert('Hata', 'Veri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    // TODO: Replace with actual API call
    setInWatchlist(Math.random() > 0.5);
  };

  const handleWatchlistToggle = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setInWatchlist(!inWatchlist);
      Alert.alert(
        'Başarılı',
        inWatchlist
          ? 'Parite izleme listenizden kaldırıldı'
          : 'Parite izleme listenize eklendi'
      );
    } catch (error) {
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi');
    }
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

  const renderPriceStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.mainStats}>
        <Text style={styles.price}>
          {formatCurrency(pairData.price, 'USD')}
        </Text>
        <Text style={[
          styles.change,
          { color: pairData.change24h >= 0 ? COLORS.success : COLORS.error }
        ]}>
          {formatPercentage(pairData.change24h)}
        </Text>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24s Hacim</Text>
          <Text style={styles.statValue}>{pairData.volume}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24s Yüksek</Text>
          <Text style={styles.statValue}>
            {formatCurrency(pairData.high24h, 'USD')}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24s Düşük</Text>
          <Text style={styles.statValue}>
            {formatCurrency(pairData.low24h, 'USD')}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Piyasa Değeri</Text>
          <Text style={styles.statValue}>{pairData.marketCap}</Text>
        </View>
      </View>
    </View>
  );

  const renderSupplyInfo = () => (
    <View style={styles.supplyContainer}>
      <Text style={styles.sectionTitle}>Arz Bilgisi</Text>
      <View style={styles.supplyStats}>
        <View style={styles.supplyItem}>
          <Text style={styles.supplyLabel}>Dolaşımdaki Arz</Text>
          <Text style={styles.supplyValue}>{pairData.supply.circulating}</Text>
        </View>
        <View style={styles.supplyItem}>
          <Text style={styles.supplyLabel}>Toplam Arz</Text>
          <Text style={styles.supplyValue}>{pairData.supply.total}</Text>
        </View>
      </View>
    </View>
  );

  const renderOrderBook = () => (
    <View style={styles.orderBookContainer}>
      <Text style={styles.sectionTitle}>Emir Defteri</Text>
      <View style={styles.orderBookHeader}>
        <Text style={styles.orderBookHeaderText}>Fiyat</Text>
        <Text style={styles.orderBookHeaderText}>Miktar</Text>
        <Text style={styles.orderBookHeaderText}>Toplam</Text>
      </View>
      <View style={styles.orderBookContent}>
        <View style={styles.asks}>
          {pairData.orderBook.asks.map((ask, index) => (
            <View key={index} style={styles.orderBookRow}>
              <Text style={[styles.orderBookPrice, { color: COLORS.error }]}>
                {formatCurrency(ask.price, 'USD')}
              </Text>
              <Text style={styles.orderBookAmount}>{ask.amount}</Text>
              <Text style={styles.orderBookTotal}>
                {formatCurrency(ask.price * ask.amount, 'USD')}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.bids}>
          {pairData.orderBook.bids.map((bid, index) => (
            <View key={index} style={styles.orderBookRow}>
              <Text style={[styles.orderBookPrice, { color: COLORS.success }]}>
                {formatCurrency(bid.price, 'USD')}
              </Text>
              <Text style={styles.orderBookAmount}>{bid.amount}</Text>
              <Text style={styles.orderBookTotal}>
                {formatCurrency(bid.price * bid.amount, 'USD')}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.pairTitle}>{pair}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('CreateAlert', {
                pair,
                currentPrice: pairData.price,
              })}
            >
              <Text style={styles.actionButtonText}>Alarm Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, inWatchlist && styles.activeButton]}
              onPress={handleWatchlistToggle}
            >
              <Text style={[
                styles.actionButtonText,
                inWatchlist && styles.activeButtonText
              ]}>
                {inWatchlist ? 'İzleniyor' : 'İzle'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartContainer}>
          {renderTimeframeButtons()}
          <LineChart
            data={pairData.chartData}
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

        {renderPriceStats()}
        {renderSupplyInfo()}
        {renderOrderBook()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  pairTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
  },
  activeButtonText: {
    color: COLORS.white,
  },
  chartContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
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
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
  },
  mainStats: {
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    ...FONTS.h1,
    color: COLORS.secondary,
  },
  change: {
    ...FONTS.h3,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    paddingVertical: 8,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  statValue: {
    ...FONTS.body3,
    color: COLORS.secondary,
    marginTop: 4,
  },
  supplyContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.secondary,
    marginBottom: 16,
  },
  supplyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supplyItem: {
    flex: 1,
  },
  supplyLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  supplyValue: {
    ...FONTS.body3,
    color: COLORS.secondary,
    marginTop: 4,
  },
  orderBookContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderBookHeaderText: {
    ...FONTS.body4,
    color: COLORS.gray,
    flex: 1,
    textAlign: 'right',
  },
  orderBookContent: {
    marginTop: 8,
  },
  orderBookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderBookPrice: {
    ...FONTS.body4,
    flex: 1,
    textAlign: 'right',
  },
  orderBookAmount: {
    ...FONTS.body4,
    color: COLORS.secondary,
    flex: 1,
    textAlign: 'right',
  },
  orderBookTotal: {
    ...FONTS.body4,
    color: COLORS.secondary,
    flex: 1,
    textAlign: 'right',
  },
});

export default PairDetailScreen;
