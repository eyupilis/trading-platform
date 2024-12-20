import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import { WebView } from 'react-native-webview';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { fetchLessonContent, submitQuizAnswers, updateProgress } from '../services/education';

const LessonScreen = ({ route, navigation }) => {
  const { courseId, lessonId } = route.params;
  const theme = useTheme();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    loadLessonContent();
  }, [courseId, lessonId]);

  const loadLessonContent = async () => {
    try {
      const data = await fetchLessonContent(courseId, lessonId);
      setLesson(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleQuizSubmit = async () => {
    try {
      const results = await submitQuizAnswers(courseId, lessonId, selectedAnswers);
      setQuizResults(results);
      setQuizSubmitted(true);
      
      if (results.passed) {
        await updateProgress(courseId, lessonId, 100);
      }
    } catch (error) {
      // Handle error
    }
  };

  const handleVideoProgress = async (progress) => {
    if (progress >= 0.9) { // Mark as complete when 90% watched
      try {
        await updateProgress(courseId, lessonId, 100);
      } catch (error) {
        // Handle error
      }
    }
  };

  const renderVideoLesson = () => (
    <View style={styles.videoContainer}>
      <WebView
        source={{ uri: lesson.videoUrl }}
        style={styles.video}
        onProgress={({ nativeEvent }) => handleVideoProgress(nativeEvent.progress)}
      />
      <Card style={styles.contentCard}>
        <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
          {lesson.title}
        </Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {lesson.description}
        </Text>
      </Card>
    </View>
  );

  const renderQuizQuestion = () => {
    if (!lesson?.questions?.length) return null;

    const question = lesson.questions[currentQuestionIndex];
    return (
      <Card style={styles.questionCard}>
        <Text style={[styles.questionText, { color: theme.colors.text }]}>
          {question.text}
        </Text>
        {question.answers.map((answer) => (
          <TouchableOpacity
            key={answer.id}
            style={[
              styles.answerButton,
              {
                backgroundColor:
                  selectedAnswers[question.id] === answer.id
                    ? theme.colors.primary
                    : theme.colors.card,
              },
            ]}
            onPress={() => handleAnswerSelect(question.id, answer.id)}
            disabled={quizSubmitted}
          >
            <Text
              style={[
                styles.answerText,
                {
                  color:
                    selectedAnswers[question.id] === answer.id
                      ? 'white'
                      : theme.colors.text,
                },
              ]}
            >
              {answer.text}
            </Text>
            {quizSubmitted && quizResults?.correctAnswers[question.id] === answer.id && (
              <Icon name="check-circle" size={20} color={theme.colors.success} />
            )}
          </TouchableOpacity>
        ))}
      </Card>
    );
  };

  const renderNavigation = () => (
    <View style={styles.navigation}>
      {currentQuestionIndex > 0 && (
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setCurrentQuestionIndex(prev => prev - 1)}
        >
          <Text style={styles.navButtonText}>Önceki</Text>
        </TouchableOpacity>
      )}
      {!quizSubmitted && currentQuestionIndex === lesson.questions.length - 1 && (
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleQuizSubmit}
        >
          <Text style={styles.navButtonText}>Tamamla</Text>
        </TouchableOpacity>
      )}
      {currentQuestionIndex < lesson.questions.length - 1 && (
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setCurrentQuestionIndex(prev => prev + 1)}
        >
          <Text style={styles.navButtonText}>Sonraki</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {lesson?.type === 'video' ? renderVideoLesson() : renderQuizQuestion()}
        {lesson?.type === 'quiz' && renderNavigation()}
        
        {quizSubmitted && (
          <Card style={styles.resultsCard}>
            <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
              Quiz Sonuçları
            </Text>
            <Text style={[styles.resultsScore, { color: theme.colors.text }]}>
              Skor: {quizResults.score}%
            </Text>
            <Text style={[styles.resultsPassed, { 
              color: quizResults.passed ? theme.colors.success : theme.colors.error 
            }]}>
              {quizResults.passed ? 'Başarılı!' : 'Başarısız'}
            </Text>
          </Card>
        )}
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
  content: {
    padding: 16,
  },
  videoContainer: {
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  contentCard: {
    padding: 16,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  questionCard: {
    padding: 16,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 16,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsCard: {
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsScore: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsPassed: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default LessonScreen;
