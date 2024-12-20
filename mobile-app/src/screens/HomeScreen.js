import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { fetchPositions, fetchTradeHistory } from '../store/reducers/tradingSlice';
import PerformanceCard from '../components/PerformanceCard';
import ActivePositions from '../components/ActivePositions';
import TradingChart from '../components/TradingChart';
import NotificationsList from '../components/NotificationsList';
import { styles } from '../styles/screens/home';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { positions, tradeHistory, statistics } = useSelector(state => state.trading);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(fetchPositions());
    dispatch(fetchTradeHistory());
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.section}>
        <PerformanceCard statistics={statistics} />
      </View>

      <View style={styles.section}>
        <TradingChart data={tradeHistory.data} />
      </View>

      <View style={styles.section}>
        <ActivePositions positions={positions.data} />
      </View>

      <View style={styles.section}>
        <NotificationsList />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
