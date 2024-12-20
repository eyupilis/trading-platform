import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './common/Card';
import { Picker } from '@react-native-picker/picker';

const TRADING_PAIRS = [
  { label: 'BTC/USDT', value: 'BTCUSDT' },
  { label: 'ETH/USDT', value: 'ETHUSDT' },
  { label: 'BNB/USDT', value: 'BNBUSDT' },
];

const TradeForm = ({
  onSubmit,
  isSubmitting,
  onSymbolChange,
  selectedSymbol,
}) => {
  const theme = useTheme();
  const [type, setType] = useState('LONG');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('1');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');

  const handleSubmit = () => {
    const tradeData = {
      type,
      amount: parseFloat(amount),
      leverage: parseInt(leverage, 10),
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
    };

    onSubmit(tradeData);
  };

  const isValid = amount && parseFloat(amount) > 0 && leverage;

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Open Position
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Trading Pair</Text>
        <View style={[styles.pickerContainer, { borderColor: theme.colors.border }]}>
          <Picker
            selectedValue={selectedSymbol}
            onValueChange={onSymbolChange}
            style={[styles.picker, { color: theme.colors.text }]}
          >
            {TRADING_PAIRS.map((pair) => (
              <Picker.Item
                key={pair.value}
                label={pair.label}
                value={pair.value}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Position Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'LONG' && { backgroundColor: theme.colors.success },
            ]}
            onPress={() => setType('LONG')}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === 'LONG' && styles.activeTypeText,
              ]}
            >
              Long
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'SHORT' && { backgroundColor: theme.colors.error },
            ]}
            onPress={() => setType('SHORT')}
          >
            <Text
              style={[
                styles.typeButtonText,
                type === 'SHORT' && styles.activeTypeText,
              ]}
            >
              Short
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Amount (USDT)</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="Enter amount"
          placeholderTextColor={theme.colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Leverage</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={leverage}
          onChangeText={setLeverage}
          keyboardType="number-pad"
          placeholder="Enter leverage (1-100)"
          placeholderTextColor={theme.colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Take Profit (Optional)</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={takeProfit}
          onChangeText={setTakeProfit}
          keyboardType="decimal-pad"
          placeholder="Enter take profit price"
          placeholderTextColor={theme.colors.placeholder}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Stop Loss (Optional)</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          value={stopLoss}
          onChangeText={setStopLoss}
          keyboardType="decimal-pad"
          placeholder="Enter stop loss price"
          placeholderTextColor={theme.colors.placeholder}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: theme.colors.primary },
          (!isValid || isSubmitting) && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Open Position</Text>
        )}
      </TouchableOpacity>
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTypeText: {
    color: 'white',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default TradeForm;
