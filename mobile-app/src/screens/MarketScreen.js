import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { marketAPI } from '../services/api';

const MarketScreen = ({ navigation }) => {
  const [marketData, setMarketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('volume'); // volume, change, name

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // TODO: Replace with actual API call
      const mockData = [
        { id: '1', pair: 'BTC/USDT', price: '43,250.00', change: '+2.5', volume: '1.2B', favorite: false },
        { id: '2', pair: 'ETH/USDT', price: '2,250.00', change: '+1.8', volume: '500M', favorite: true },
        { id: '3', pair: 'BNB/USDT', price: '320.50', change: '-0.5', volume: '200M', favorite: false },
        { id: '4', pair: 'XRP/USDT', price: '0.55', change: '+3.2', volume: '150M', favorite: false },
      ];
      setMarketData(mockData);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const filteredData = marketData.filter(item =>
    item.pair.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return parseFloat(b.volume.replace(/[BM]/g, '')) - parseFloat(a.volume.replace(/[BM]/g, ''));
      case 'change':
        return parseFloat(b.change) - parseFloat(a.change);
      case 'name':
        return a.pair.localeCompare(b.pair);
      default:
        return 0;
    }
  });

  const renderSortButton = (title, value) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === value && styles.sortButtonActive]}
      onPress={() => setSortBy(value)}
    >
      <Text style={[styles.sortButtonText, sortBy === value && styles.sortButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderMarketItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.marketItem}
      onPress={() => navigation.navigate('PairDetail', { pair: item.pair })}
    >
      <View style={styles.pairInfo}>
        <Text style={styles.pairText}>{item.pair}</Text>
        <Text style={styles.volumeText}>Hacim: {item.volume}</Text>
      </View>
      <View style={styles.priceInfo}>
        <Text style={styles.priceText}>{item.price}</Text>
        <Text style={[
          styles.changeText,
          { color: parseFloat(item.change) >= 0 ? '#2ecc71' : '#e74c3c' }
        ]}>
          {item.change}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Parite Ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.sortContainer}>
        {renderSortButton('Hacim', 'volume')}
        {renderSortButton('Değişim', 'change')}
        {renderSortButton('İsim', 'name')}
      </View>

      <FlatList
        data={sortedData}
        renderItem={renderMarketItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdde1',
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  sortButtonActive: {
    backgroundColor: '#2c3e50',
  },
  sortButtonText: {
    color: '#2c3e50',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 10,
  },
  marketItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pairInfo: {
    flex: 1,
  },
  pairText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  volumeText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default MarketScreen;
