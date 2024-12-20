import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { View, Text } from '../../components/Themed';
import { SignalCard } from '../../components/SignalCard';
import { Ionicons } from '@expo/vector-icons';

// API anahtarını güvenli bir şekilde saklayın
const CRYPTO_API_KEY = process.env.EXPO_PUBLIC_CRYPTO_API_KEY || 'YOUR_API_KEY';

interface MarketData {
  symbol: string;
  price: string;
  change: string;
}

export const HomeScreen = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketData = async () => {
    try {
      // Gerçek API'yi entegre edin
      // const response = await fetch(`https://api.example.com/v1/crypto?apikey=${CRYPTO_API_KEY}`);
      // const data = await response.json();
      
      // Şimdilik dummy data kullanıyoruz
      const dummyData: MarketData[] = [
        { symbol: 'BTC/USD', price: '45,000', change: '+5.2%' },
        { symbol: 'ETH/USD', price: '2,800', change: '-2.1%' },
        { symbol: 'BNB/USD', price: '320', change: '+1.8%' },
      ];
      setMarketData(dummyData);
    } catch (error) {
      console.error('Market data fetch error:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMarketData().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Her 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Trading Dashboard</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.marketOverview}>
        <Text style={styles.sectionTitle}>Market Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marketScroll}>
          {marketData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.marketCard}>
              <Text style={styles.marketSymbol}>{item.symbol}</Text>
              <Text style={styles.marketPrice}>${item.price}</Text>
              <Text style={[
                styles.marketChange,
                { color: item.change.startsWith('+') ? '#4CAF50' : '#F44336' }
              ]}>
                {item.change}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Signals</Text>
        <SignalCard
          title="BTC/USD"
          type="BUY"
          price="45,000"
          change="+5.2%"
          timestamp="2024-01-19T15:30:00Z"
        />
        <SignalCard
          title="ETH/USD"
          type="SELL"
          price="2,800"
          change="-2.1%"
          timestamp="2024-01-19T15:25:00Z"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons 
                name={index % 2 === 0 ? "arrow-up-circle" : "arrow-down-circle"} 
                size={24} 
                color={index % 2 === 0 ? "#4CAF50" : "#F44336"} 
              />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>
                {index % 2 === 0 ? "Buy Order" : "Sell Order"} Executed
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityAmount}>
              ${Math.floor(Math.random() * 10000).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  marketOverview: {
    padding: 20,
  },
  marketScroll: {
    marginTop: 10,
  },
  marketCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  marketSymbol: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  marketPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  marketChange: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
