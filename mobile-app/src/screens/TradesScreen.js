import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TradesScreen = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    // Initial fetch of trades
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      // TODO: Implement API call to fetch trades
      setTrades([
        {
          id: '1',
          pair: 'BTC/USDT',
          type: 'LONG',
          entryPrice: '43,250.00',
          targetPrice: '45,000.00',
          stopLoss: '42,000.00',
          status: 'ACTIVE',
          profit: '+4.2%',
        },
        {
          id: '2',
          pair: 'ETH/USDT',
          type: 'SHORT',
          entryPrice: '2,250.00',
          targetPrice: '2,150.00',
          stopLoss: '2,300.00',
          status: 'ACTIVE',
          profit: '-1.5%',
        },
      ]);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const renderTradeCard = ({ item }) => {
    const isLong = item.type === 'LONG';
    const isProfitable = item.profit.startsWith('+');

    return (
      <TouchableOpacity style={styles.tradeCard}>
        <View style={styles.tradeHeader}>
          <Text style={styles.tradePair}>{item.pair}</Text>
          <View style={[
            styles.typeTag,
            { backgroundColor: isLong ? '#2ecc71' : '#e74c3c' }
          ]}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>

        <View style={styles.tradeDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Giriş:</Text>
            <Text style={styles.detailValue}>{item.entryPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Hedef:</Text>
            <Text style={styles.detailValue}>{item.targetPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Stop:</Text>
            <Text style={styles.detailValue}>{item.stopLoss}</Text>
          </View>
        </View>

        <View style={styles.tradeFooter}>
          <Text style={styles.statusText}>{item.status}</Text>
          <Text style={[
            styles.profitText,
            { color: isProfitable ? '#2ecc71' : '#e74c3c' }
          ]}>
            {item.profit}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={trades}
        renderItem={renderTradeCard}
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
  listContainer: {
    padding: 10,
  },
  tradeCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tradePair: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  typeText: {
    color: '#fff',
    fontWeight: '500',
  },
  tradeDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  detailValue: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
  tradeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  profitText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TradesScreen;
