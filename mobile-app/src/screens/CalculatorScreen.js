import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/common/Card';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  calculateRiskReward,
  calculatePositionSize,
  calculateBreakEven,
  calculateCompoundInterest,
  calculateMarginRequirement,
} from '../services/calculator';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const CalculatorScreen = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('risk-reward');
  const [inputs, setInputs] = useState({
    // Risk/Reward Calculator
    entryPrice: '',
    targetPrice: '',
    stopLoss: '',
    positionSize: '',
    leverage: '1',
    
    // Position Size Calculator
    accountSize: '',
    riskPercentage: '',
    
    // Break Even Calculator
    fees: '0.1',
    
    // Compound Calculator
    principal: '',
    monthlyContribution: '',
    annualReturn: '',
    years: '',
    
    // Margin Calculator
    maintenanceMargin: '0.5',
  });
  const [results, setResults] = useState(null);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculate = () => {
    try {
      let calculationResult;

      switch (activeTab) {
        case 'risk-reward':
          calculationResult = calculateRiskReward(
            inputs.entryPrice,
            inputs.targetPrice,
            inputs.stopLoss,
            inputs.positionSize,
            inputs.leverage
          );
          break;

        case 'position-size':
          calculationResult = calculatePositionSize(
            inputs.accountSize,
            inputs.riskPercentage,
            inputs.entryPrice,
            inputs.stopLoss,
            inputs.leverage
          );
          break;

        case 'break-even':
          calculationResult = calculateBreakEven(
            inputs.entryPrice,
            inputs.positionSize,
            inputs.fees,
            inputs.leverage
          );
          break;

        case 'compound':
          calculationResult = calculateCompoundInterest(
            inputs.principal,
            inputs.monthlyContribution,
            inputs.annualReturn,
            inputs.years
          );
          break;

        case 'margin':
          calculationResult = calculateMarginRequirement(
            inputs.positionSize,
            inputs.entryPrice,
            inputs.leverage,
            inputs.maintenanceMargin
          );
          break;
      }

      setResults(calculationResult);
    } catch (error) {
      Alert.alert('Hata', 'Lütfen tüm alanları doğru formatta doldurun.');
    }
  };

  const renderTab = (id, label, icon) => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === id && { backgroundColor: theme.colors.primary },
      ]}
      onPress={() => {
        setActiveTab(id);
        setResults(null);
      }}
    >
      <Icon
        name={icon}
        size={24}
        color={activeTab === id ? 'white' : theme.colors.text}
      />
      <Text
        style={[
          styles.tabText,
          { color: activeTab === id ? 'white' : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderInput = (name, label, keyboardType = 'decimal-pad') => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
        value={inputs[name]}
        onChangeText={(value) => handleInputChange(name, value)}
        keyboardType={keyboardType}
        placeholder="0.00"
        placeholderTextColor={theme.colors.placeholder}
      />
    </View>
  );

  const renderRiskRewardCalculator = () => (
    <Card style={styles.calculatorCard}>
      {renderInput('entryPrice', 'Giriş Fiyatı')}
      {renderInput('targetPrice', 'Hedef Fiyat')}
      {renderInput('stopLoss', 'Stop Loss')}
      {renderInput('positionSize', 'Pozisyon Büyüklüğü (USDT)')}
      {renderInput('leverage', 'Kaldıraç')}
    </Card>
  );

  const renderPositionSizeCalculator = () => (
    <Card style={styles.calculatorCard}>
      {renderInput('accountSize', 'Hesap Büyüklüğü (USDT)')}
      {renderInput('riskPercentage', 'Risk Yüzdesi (%)')}
      {renderInput('entryPrice', 'Giriş Fiyatı')}
      {renderInput('stopLoss', 'Stop Loss')}
      {renderInput('leverage', 'Kaldıraç')}
    </Card>
  );

  const renderBreakEvenCalculator = () => (
    <Card style={styles.calculatorCard}>
      {renderInput('entryPrice', 'Giriş Fiyatı')}
      {renderInput('positionSize', 'Pozisyon Büyüklüğü (USDT)')}
      {renderInput('fees', 'İşlem Ücreti (%)')}
      {renderInput('leverage', 'Kaldıraç')}
    </Card>
  );

  const renderCompoundCalculator = () => (
    <Card style={styles.calculatorCard}>
      {renderInput('principal', 'Başlangıç Sermayesi (USDT)')}
      {renderInput('monthlyContribution', 'Aylık Katkı (USDT)')}
      {renderInput('annualReturn', 'Yıllık Getiri (%)')}
      {renderInput('years', 'Süre (Yıl)')}
    </Card>
  );

  const renderMarginCalculator = () => (
    <Card style={styles.calculatorCard}>
      {renderInput('positionSize', 'Pozisyon Büyüklüğü (USDT)')}
      {renderInput('entryPrice', 'Giriş Fiyatı')}
      {renderInput('leverage', 'Kaldıraç')}
      {renderInput('maintenanceMargin', 'Sürdürme Teminatı (%)')}
    </Card>
  );

  const renderResults = () => {
    if (!results) return null;

    const resultItems = [];

    switch (activeTab) {
      case 'risk-reward':
        resultItems.push(
          { label: 'Risk/Ödül Oranı', value: `1:${results.riskRewardRatio.toFixed(2)}` },
          { label: 'Potansiyel Kazanç', value: formatCurrency(results.potentialProfit) },
          { label: 'Maksimum Kayıp', value: formatCurrency(results.potentialLoss) },
          { label: 'Likidite Fiyatı', value: formatCurrency(results.liquidationPrice) },
          { label: 'Efektif Pozisyon', value: formatCurrency(results.effectivePosition) }
        );
        break;

      case 'position-size':
        resultItems.push(
          { label: 'Önerilen Pozisyon', value: formatCurrency(results.positionSize) },
          { label: 'Maksimum Kayıp', value: formatCurrency(results.maxLoss) },
          { label: 'Efektif Pozisyon', value: formatCurrency(results.effectivePosition) }
        );
        break;

      case 'break-even':
        resultItems.push(
          { label: 'Başabaş Fiyatı', value: formatCurrency(results.breakEvenPrice) },
          { label: 'Toplam Ücretler', value: formatCurrency(results.totalFees) },
          { label: 'Gerekli Hareket', value: formatPercentage(results.requiredMovePercentage) }
        );
        break;

      case 'compound':
        resultItems.push(
          { label: 'Gelecek Değer', value: formatCurrency(results.futureValue) },
          { label: 'Toplam Katkı', value: formatCurrency(results.totalContributions) },
          { label: 'Toplam Kazanç', value: formatCurrency(results.totalInterest) }
        );
        break;

      case 'margin':
        resultItems.push(
          { label: 'Pozisyon Değeri', value: formatCurrency(results.positionValue) },
          { label: 'Başlangıç Teminatı', value: formatCurrency(results.initialMargin) },
          { label: 'Sürdürme Teminatı', value: formatCurrency(results.maintenanceMarginAmount) }
        );
        break;
    }

    return (
      <Card style={styles.resultsCard}>
        <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
          Sonuçlar
        </Text>
        {resultItems.map((item, index) => (
          <View key={index} style={styles.resultRow}>
            <Text style={[styles.resultLabel, { color: theme.colors.text }]}>
              {item.label}
            </Text>
            <Text style={[styles.resultValue, { color: theme.colors.primary }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tabs}>
          {renderTab('risk-reward', 'Risk/Ödül', 'chart-line')}
          {renderTab('position-size', 'Pozisyon', 'calculator')}
          {renderTab('break-even', 'Başabaş', 'trending-up')}
          {renderTab('compound', 'Bileşik', 'chart-areaspline')}
          {renderTab('margin', 'Teminat', 'bank')}
        </View>

        {activeTab === 'risk-reward' && renderRiskRewardCalculator()}
        {activeTab === 'position-size' && renderPositionSizeCalculator()}
        {activeTab === 'break-even' && renderBreakEvenCalculator()}
        {activeTab === 'compound' && renderCompoundCalculator()}
        {activeTab === 'margin' && renderMarginCalculator()}

        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: theme.colors.primary }]}
          onPress={calculate}
        >
          <Text style={styles.calculateButtonText}>Hesapla</Text>
        </TouchableOpacity>

        {renderResults()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    minWidth: 100,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  calculatorCard: {
    padding: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  calculateButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsCard: {
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CalculatorScreen;
