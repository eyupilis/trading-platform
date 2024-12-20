import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { openPosition } from '../store/reducers/tradingSlice';
import TradingViewChart from '../components/TradingViewChart';
import TradeForm from '../components/TradeForm';
import MarketInfo from '../components/MarketInfo';
import { styles } from '../styles/screens/trade';

const TradeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTradeSubmit = async (tradeData) => {
    try {
      setIsSubmitting(true);
      await dispatch(openPosition({
        ...tradeData,
        symbol: selectedSymbol,
      })).unwrap();
      
      Alert.alert(
        'Success',
        'Trade position opened successfully',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to open trade position'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView>
        <View style={styles.chartContainer}>
          <TradingViewChart symbol={selectedSymbol} />
        </View>

        <View style={styles.marketInfoContainer}>
          <MarketInfo symbol={selectedSymbol} />
        </View>

        <View style={styles.formContainer}>
          <TradeForm
            onSubmit={handleTradeSubmit}
            isSubmitting={isSubmitting}
            onSymbolChange={setSelectedSymbol}
            selectedSymbol={selectedSymbol}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TradeScreen;
