import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import WebSocketService from '../../src/services/websocket';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSignalsStart,
  fetchSignalsSuccess,
  fetchSignalsFailure,
  addSignal,
  updateSignal,
  removeSignal,
  setFilter
} from '../../src/store/reducers/tradesSlice';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../../src/config';

interface TradeSignal {
  id: string;
  trader_id: string;
  market_id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  entry_price: number;
  take_profit: number;
  stop_loss: number;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  created_at: string;
  analysis?: string;
}

function TradesScreen() {
  const dispatch = useDispatch();
  const { signals, loading, error, filter } = useSelector((state: any) => state.trades);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSignals = useCallback(async () => {
    try {
      dispatch(fetchSignalsStart());
      const response = await axios.get(`${API_URL}/mobile/trades`);
      dispatch(fetchSignalsSuccess(response.data.signals));
    } catch (error) {
      const axiosError = error as AxiosError;
      dispatch(fetchSignalsFailure(axiosError.message));
    }
  }, [dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSignals();
    setRefreshing(false);
  }, [fetchSignals]);

  useEffect(() => {
    fetchSignals();

    // WebSocket bağlantısını başlat
    WebSocketService.connect();

    // Event listener'ları ekle
    const handleNewSignal = (signal: TradeSignal) => {
      dispatch(addSignal(signal));
    };

    const handleSignalUpdate = (signal: TradeSignal) => {
      dispatch(updateSignal(signal));
    };

    const handleSignalDelete = (data: { id: string }) => {
      dispatch(removeSignal(data.id));
    };

    WebSocketService.on('new_signal', handleNewSignal);
    WebSocketService.on('signal_update', handleSignalUpdate);
    WebSocketService.on('signal_delete', handleSignalDelete);

    // Cleanup
    return () => {
      WebSocketService.off('new_signal', handleNewSignal);
      WebSocketService.off('signal_update', handleSignalUpdate);
      WebSocketService.off('signal_delete', handleSignalDelete);
      WebSocketService.disconnect();
    };
  }, [dispatch]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSignals}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {loading && signals.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>Loading signals...</Text>
        </View>
      ) : signals.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>No signals available</Text>
        </View>
      ) : (
        signals.map((signal: TradeSignal) => (
          <TouchableOpacity
            key={signal.id}
            style={styles.signalCard}
            onPress={() => {/* Signal detaylarını göster */}}
          >
            <View style={styles.signalHeader}>
              <View style={styles.symbolContainer}>
                <Text style={styles.symbolText}>{signal.symbol}</Text>
                <Text style={[
                  styles.directionText,
                  { color: signal.direction === 'BUY' ? '#4CAF50' : '#F44336' }
                ]}>
                  {signal.direction}
                </Text>
              </View>
              <Text style={[
                styles.statusText,
                { color: signal.status === 'ACTIVE' ? '#4CAF50' : '#9E9E9E' }
              ]}>
                {signal.status}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Entry</Text>
                <Text style={styles.priceValue}>{signal.entry_price}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Take Profit</Text>
                <Text style={styles.priceValue}>{signal.take_profit}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Stop Loss</Text>
                <Text style={styles.priceValue}>{signal.stop_loss}</Text>
              </View>
            </View>

            {signal.analysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisText}>{signal.analysis}</Text>
              </View>
            )}

            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={16} color="#757575" />
              <Text style={styles.timeText}>
                {new Date(signal.created_at).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  signalCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  directionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  analysisContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  analysisText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#757575',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TradesScreen;
