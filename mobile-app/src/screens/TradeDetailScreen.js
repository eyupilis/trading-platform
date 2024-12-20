import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const screenWidth = Dimensions.get('window').width;

const TradeDetailScreen = ({ route, navigation }) => {
  const { tradeId } = route.params;
  const [trade, setTrade] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTradeDetails();
    fetchChartData();
  }, [tradeId]);

  const fetchTradeDetails = async () => {
    try {
      // TODO: Replace with actual API call
      const mockTrade = {
        id: tradeId,
        pair: 'BTC/USDT',
        type: 'LONG',
        entryPrice: 43250.00,
        currentPrice: 44500.00,
        targetPrice: 45000.00,
        stopLoss: 42000.00,
        status: 'ACTIVE',
        profit: '+2.89%',
        volume: '1.5',
        leverage: '10x',
        openTime: '2024-12-18T10:30:00Z',
        trader: {
          name: 'John Doe',
          successRate: '75%',
          totalTrades: 156,
        },
        notes: 'Strong support at 42,000. Expecting breakout above 45,000.',
      };
      setTrade(mockTrade);
    } catch (error) {
      Alert.alert('Hata', 'İşlem detayları yüklenirken bir hata oluştu');
    }
  };

  const fetchChartData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData = {
        labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
        datasets: [{
          data: [43250, 43400, 43800, 44100, 44300, 44500],
        }],
      };
      setChartData(mockData);
    } catch (error) {
      Alert.alert('Hata', 'Grafik verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${trade.pair} işlemi - Giriş: ${formatCurrency(trade.entryPrice, 'USD')} | Hedef: ${formatCurrency(trade.targetPrice, 'USD')} | Stop: ${formatCurrency(trade.stopLoss, 'USD')}`,
      });
    } catch (error) {
      Alert.alert('Hata', 'İşlem paylaşılırken bir hata oluştu');
    }
  };

  const handleAddAlert = () => {
    navigation.navigate('CreateAlert', { pair: trade.pair, currentPrice: trade.currentPrice });
  };

  if (!trade || !chartData || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const profitAmount = trade.currentPrice - trade.entryPrice;
  const profitPercentage = (profitAmount / trade.entryPrice) * 100;
  const isProfit = profitAmount >= 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.pairContainer}>
            <Text style={styles.pairText}>{trade.pair}</Text>
            <View style={[
              styles.typeTag,
              { backgroundColor: trade.type === 'LONG' ? COLORS.success : COLORS.error }
            ]}>
              <Text style={styles.typeText}>{trade.type}</Text>
            </View>
          </View>
          <Text style={[
            styles.profitText,
            { color: isProfit ? COLORS.success : COLORS.error }
          ]}>
            {formatPercentage(profitPercentage)}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Giriş Fiyatı</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(trade.entryPrice, 'USD')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mevcut Fiyat</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(trade.currentPrice, 'USD')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hedef Fiyat</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(trade.targetPrice, 'USD')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stop Loss</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(trade.stopLoss, 'USD')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hacim</Text>
            <Text style={styles.detailValue}>{trade.volume}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kaldıraç</Text>
            <Text style={styles.detailValue}>{trade.leverage}</Text>
          </View>
        </View>

        <View style={styles.traderInfo}>
          <Text style={styles.sectionTitle}>Trader Bilgisi</Text>
          <View style={styles.traderDetails}>
            <Text style={styles.traderName}>{trade.trader.name}</Text>
            <View style={styles.traderStats}>
              <Text style={styles.statText}>
                Başarı Oranı: {trade.trader.successRate}
              </Text>
              <Text style={styles.statText}>
                Toplam İşlem: {trade.trader.totalTrades}
              </Text>
            </View>
          </View>
        </View>

        {trade.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>Notlar</Text>
            <Text style={styles.notesText}>{trade.notes}</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.alertButton]}
            onPress={handleAddAlert}
          >
            <Text style={styles.buttonText}>Alarm Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.buttonText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pairText: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginRight: 10,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  typeText: {
    color: COLORS.white,
    ...FONTS.body4,
    fontWeight: 'bold',
  },
  profitText: {
    ...FONTS.h3,
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    ...FONTS.body3,
    color: COLORS.secondary,
  },
  detailValue: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: '500',
  },
  traderInfo: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginBottom: 8,
  },
  traderDetails: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
  },
  traderName: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  traderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  notesContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  notesText: {
    ...FONTS.body3,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  alertButton: {
    backgroundColor: COLORS.primary,
  },
  shareButton: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default TradeDetailScreen;
