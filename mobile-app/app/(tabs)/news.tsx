import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput, Image } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// API anahtarını güvenli bir şekilde saklayın
const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || 'YOUR_API_KEY';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  imageUrl: string;
  url: string;
  publishedAt: string;
  category: string;
}

export const NewsScreen = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'crypto', 'stocks', 'forex', 'commodities'];

  const fetchNews = async () => {
    try {
      // Gerçek API'yi entegre edin
      // const response = await axios.get(
      //   `https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=${NEWS_API_KEY}`
      // );
      // setNews(response.data.articles);
      
      // Şimdilik dummy data kullanıyoruz
      const dummyNews: NewsItem[] = [
        {
          id: '1',
          title: 'Bitcoin Surges Past $50,000 as Institutional Interest Grows',
          description: 'Bitcoin has reached a new milestone as institutional investors continue to show interest in cryptocurrency investments...',
          source: 'CryptoNews',
          imageUrl: 'https://picsum.photos/400/200',
          url: 'https://example.com/news/1',
          publishedAt: new Date().toISOString(),
          category: 'crypto',
        },
        {
          id: '2',
          title: 'Global Markets Rally on Strong Economic Data',
          description: 'Stock markets worldwide are experiencing a surge following better-than-expected economic indicators...',
          source: 'MarketWatch',
          imageUrl: 'https://picsum.photos/400/200',
          url: 'https://example.com/news/2',
          publishedAt: new Date().toISOString(),
          category: 'stocks',
        },
      ];
      setNews(dummyNews);
    } catch (error) {
      console.error('News fetch error:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNews().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Her 5 dakikada bir güncelle
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.newsContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredNews.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsCard}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.newsImage}
              resizeMode="cover"
            />
            <View style={styles.newsContent}>
              <View style={styles.sourceContainer}>
                <Text style={styles.source}>{item.source}</Text>
                <Text style={styles.date}>
                  {new Date(item.publishedAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  newsContainer: {
    flex: 1,
    padding: 15,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 200,
  },
  newsContent: {
    padding: 15,
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  source: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  categoryText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default NewsScreen;
