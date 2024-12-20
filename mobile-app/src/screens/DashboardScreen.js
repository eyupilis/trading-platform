import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = ({ navigation }) => {
  const [marketData, setMarketData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch new data here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Initial data fetch
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // TODO: Implement API call to fetch market data
      setMarketData([
        { pair: 'BTC/USDT', price: '43,250.00', change: '+2.5%' },
        { pair: 'ETH/USDT', price: '2,250.00', change: '+1.8%' },
      ]);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const renderMarketWidget = () => (
    <View style={styles.widget}>
      <Text style={styles.widgetTitle}>Piyasa Özeti</Text>
      {marketData.map((item, index) => (
        <View key={index} style={styles.marketItem}>
          <Text style={styles.pairText}>{item.pair}</Text>
          <Text style={styles.priceText}>{item.price}</Text>
          <Text style={[
            styles.changeText,
            { color: item.change.startsWith('+') ? '#2ecc71' : '#e74c3c' }
          ]}>
            {item.change}
          </Text>
        </View>
      ))}
    </View>
  );

  const NavigationButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <Text style={styles.navButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderMarketWidget()}
        
        <View style={styles.navigationGrid}>
          <NavigationButton 
            title="İşlemler" 
            onPress={() => navigation.navigate('Trades')} 
          />
          <NavigationButton 
            title="Piyasa" 
            onPress={() => navigation.navigate('Market')} 
          />
          <NavigationButton 
            title="Haberler" 
            onPress={() => navigation.navigate('News')} 
          />
          <NavigationButton 
            title="Profil" 
            onPress={() => navigation.navigate('Profile')} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  widget: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pairText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  priceText: {
    fontSize: 16,
    color: '#34495e',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navigationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#2c3e50',
    width: '48%',
    padding: 20,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DashboardScreen;
