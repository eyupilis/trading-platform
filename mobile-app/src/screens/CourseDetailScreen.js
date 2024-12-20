import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/common/Card';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const theme = useTheme();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    loadCourseDetails();
    loadUserProgress();
  }, [courseId]);

  const loadCourseDetails = async () => {
    // TODO: Replace with actual API call
    const mockCourse = {
      id: courseId,
      title: 'Kripto Para Temelleri',
      description: 'Blockchain ve kripto para teknolojilerine kapsamlı bir giriş kursu.',
      image: require('../assets/courses/crypto-basics.png'),
      instructor: {
        name: 'Ahmet Yılmaz',
        title: 'Kripto Analisti',
        avatar: 'https://via.placeholder.com/100',
      },
      totalLessons: 10,
      duration: '2 saat',
      level: 'Başlangıç',
      lessons: [
        {
          id: '1',
          title: 'Blockchain Nedir?',
          duration: '15 dk',
          type: 'video',
          completed: true,
        },
        {
          id: '2',
          title: 'Bitcoin ve Altcoinler',
          duration: '20 dk',
          type: 'video',
          completed: true,
        },
        {
          id: '3',
          title: 'Cüzdanlar ve Güvenlik',
          duration: '15 dk',
          type: 'video',
          completed: false,
        },
        {
          id: '4',
          title: 'Bölüm Sonu Quiz',
          duration: '10 dk',
          type: 'quiz',
          completed: false,
        },
      ],
    };
    setCourse(course);
  };

  const loadUserProgress = async () => {
    // TODO: Replace with actual API call
    const mockProgress = {
      completedLessons: 2,
      lastLesson: '2',
      quizScores: {
        '4': null,
      },
    };
    setUserProgress(mockProgress);
  };

  const handleLessonPress = (lesson) => {
    navigation.navigate('LessonDetail', {
      courseId,
      lessonId: lesson.id,
      type: lesson.type,
    });
  };

  const renderLessonItem = ({ item: lesson }) => (
    <TouchableOpacity onPress={() => handleLessonPress(lesson)}>
      <Card style={styles.lessonCard}>
        <View style={styles.lessonIcon}>
          <Icon
            name={lesson.type === 'video' ? 'play-circle' : 'help-circle'}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.lessonInfo}>
          <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
            {lesson.title}
          </Text>
          <Text style={[styles.lessonDuration, { color: theme.colors.text }]}>
            {lesson.duration}
          </Text>
        </View>
        <View style={styles.lessonStatus}>
          {lesson.completed ? (
            <Icon name="check-circle" size={24} color={theme.colors.success} />
          ) : (
            <Icon name="circle-outline" size={24} color={theme.colors.text} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <Image source={course.image} style={styles.courseImage} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {course.title}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.colors.text }]}>
            {course.description}
          </Text>

          <View style={styles.instructorCard}>
            <Image
              source={{ uri: course.instructor.avatar }}
              style={styles.instructorAvatar}
            />
            <View style={styles.instructorInfo}>
              <Text style={[styles.instructorName, { color: theme.colors.text }]}>
                {course.instructor.name}
              </Text>
              <Text style={[styles.instructorTitle, { color: theme.colors.text }]}>
                {course.instructor.title}
              </Text>
            </View>
          </View>

          <View style={styles.courseStats}>
            <View style={styles.statItem}>
              <Icon name="book-open" size={20} color={theme.colors.primary} />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {course.totalLessons} Ders
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="clock" size={20} color={theme.colors.primary} />
              <Text style={[styles.statText, { color: theme.colors.text }]}>
                {course.duration}
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Dersler
          </Text>

          <FlatList
            data={course.lessons}
            renderItem={renderLessonItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  courseStats: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    fontSize: 14,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  lessonIcon: {
    marginRight: 16,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
  lessonStatus: {
    marginLeft: 16,
  },
});

export default CourseDetailScreen;
