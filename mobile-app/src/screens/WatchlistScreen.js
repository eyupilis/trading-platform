import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants/theme';
import { formatCurrency, formatPercentage } from '../utils/helpers';

const WatchlistScreen = ({ navigation }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      // TODO: Replace with actual API call
      const mockWatchlist = [
        {
          id: '1',
          pair: 'BTC/USDT',
          price: 44500,
          change24h: 2.5,
          volume: '1.2B',
          high24h: 45000,
          low24h: 43000,
          favorite: true,
        },
        {
          id: '2',
          pair: 'ETH/USDT',
          price: 2250,
          change24h: -1.2,
          volume: '500M',
          high24h: 2300,
          low24h: 2200,
          favorite: true,
        },
      ];
      setWatchlist(mockWatchlist);
    } catch (error) {
      Alert.alert('Hata', 'İzleme listesi yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (id) => {
    Alert.alert(
      'İzleme Listesinden Kaldır',
      'Bu paritenin izleme listesinden kaldırmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              await new Promise(resolve => setTimeout(resolve, 500));
              setWatchlist(prev => prev.filter(item => item.id !== id));
            } catch (error) {
              Alert.alert('Hata', 'İşlem gerçekleştirilemedi');
            }
          },
        },
      ]
    );
  };

  const renderWatchlistItem = ({ item }) => {
    const isPositive = item.change24h >= 0;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate('PairDetail', { pair: item.pair })}
      >
        <View style={styles.mainInfo}>
          <View>
            <Text style={styles.pairText}>{item.pair}</Text>
            <Text style={styles.volumeText}>Hacim: {item.volume}</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.priceText}>
              {formatCurrency(item.price, 'USD')}
            </Text>
            <Text style={[
              styles.changeText,
              { color: isPositive ? COLORS.success : COLORS.error }
            ]}>
              {formatPercentage(item.change24h)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>24s Yüksek</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(item.high24h, 'USD')}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>24s Düşük</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(item.low24h, 'USD')}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CreateAlert', {
              pair: item.pair,
              currentPrice: item.price,
            })}
          >
            <Text style={styles.actionButtonText}>Alarm Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={() => handleRemoveFromWatchlist(item.id)}
          >
            <Text style={[styles.actionButtonText, styles.removeButtonText]}>
              Listeden Kaldır
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="İzleme listesinde ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Yükleniyor...</Text>
        </View>
      ) : watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            İzleme listeniz boş
          </Text>
          <Text style={styles.emptySubtext}>
            Piyasa ekranından parite ekleyebilirsiniz
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Market')}
          >
            <Text style={styles.addButtonText}>Piyasaya Git</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={watchlist.filter(item =>
            item.pair.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderWatchlistItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  emptySubtext: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pairText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  volumeText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginTop: 4,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    ...FONTS.h3,
    color: COLORS.secondary,
  },
  changeText: {
    ...FONTS.body4,
    fontWeight: '500',
    marginTop: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginBottom: 4,
  },
  detailValue: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  removeButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  removeButtonText: {
    color: COLORS.error,
  },
});

export default WatchlistScreen;
