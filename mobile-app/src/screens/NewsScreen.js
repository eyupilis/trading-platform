import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { newsAPI } from '../services/api';

const NewsScreen = ({ navigation }) => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', title: 'Tümü' },
    { id: 'crypto', title: 'Kripto' },
    { id: 'market', title: 'Piyasa' },
    { id: 'technology', title: 'Teknoloji' },
  ];

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    try {
      // TODO: Replace with actual API call
      const mockNews = [
        {
          id: '1',
          title: 'Bitcoin 45.000 Doları Aştı',
          summary: 'Bitcoin, son 24 saatte yaşanan yükselişle birlikte...',
          category: 'crypto',
          imageUrl: 'https://example.com/btc.jpg',
          date: '2024-12-18',
          readTime: '3 dk',
        },
        {
          id: '2',
          title: 'Yeni Blockchain Projesi Duyuruldu',
          summary: 'Önde gelen teknoloji şirketlerinden yeni bir blockchain...',
          category: 'technology',
          imageUrl: 'https://example.com/blockchain.jpg',
          date: '2024-12-18',
          readTime: '5 dk',
        },
      ];
      setNews(mockNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const filteredNews = news.filter(item =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item.id && styles.categoryButtonTextActive
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.newsCard}
      onPress={() => navigation.navigate('NewsDetail', { newsId: item.id })}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.newsImage}
        defaultSource={require('../assets/placeholder.png')}
      />
      <View style={styles.newsContent}>
        <View style={styles.newsHeader}>
          <Text style={styles.newsCategory}>
            {categories.find(cat => cat.id === item.category)?.title}
          </Text>
          <Text style={styles.newsDate}>{item.date}</Text>
        </View>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsSummary} numberOfLines={2}>
          {item.summary}
        </Text>
        <View style={styles.newsFooter}>
          <Text style={styles.readTime}>{item.readTime} okuma</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryButton}
        keyExtractor={item => item.id}
        style={styles.categoriesList}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.newsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  categoriesList: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#2c3e50',
  },
  categoryButtonText: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  newsList: {
    padding: 10,
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
    backgroundColor: '#f0f0f0',
  },
  newsContent: {
    padding: 15,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsCategory: {
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: 12,
  },
  newsDate: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  newsSummary: {
    color: '#34495e',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  readTime: {
    color: '#7f8c8d',
    fontSize: 12,
  },
});

export default NewsScreen;
