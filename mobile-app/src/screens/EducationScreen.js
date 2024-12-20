import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { fetchCourses, getUserProgress } from '../services/education';

const EducationScreen = ({ navigation }) => {
  const theme = useTheme();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [coursesData, progressData] = await Promise.all([
        fetchCourses(),
        getUserProgress()
      ]);
      
      setCourses(coursesData);
      setUserProgress(progressData);
    } catch (err) {
      setError('Eğitim içeriği yüklenirken bir hata oluştu.');
      console.error('Error loading education data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderCourseCard = ({ item }) => {
    const progress = userProgress[item.id] || { completedLessons: 0 };
    const progressPercentage = (progress.completedLessons / item.totalLessons) * 100;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
      >
        <Card style={styles.courseCard}>
          <Image source={{ uri: item.imageUrl }} style={styles.courseImage} />
          <View style={styles.courseInfo}>
            <View style={styles.courseHeader}>
              <Text style={[styles.courseTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
              <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
            </View>
            
            <Text style={[styles.courseDescription, { color: theme.colors.text }]}>
              {item.description}
            </Text>
            
            <View style={styles.courseStats}>
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {item.totalLessons} Ders • {item.duration}
              </Text>
              <Text style={[styles.progressText, { color: theme.colors.text }]}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            
            <ProgressBar
              progress={progressPercentage}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={loadData}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Kripto Eğitimi
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Kripto dünyasını keşfedin ve trading becerilerinizi geliştirin
          </Text>
        </View>

        <FlatList
          data={courses}
          renderItem={renderCourseCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.coursesList}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  coursesList: {
    padding: 16,
  },
  courseCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  courseImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseInfo: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  courseDescription: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    opacity: 0.7,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EducationScreen;
