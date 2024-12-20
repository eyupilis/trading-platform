import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { getAuthToken } from './auth';

const educationApi = axios.create({
  baseURL: `${API_BASE_URL}/education`,
});

// Request interceptor'ı ekle
educationApi.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCourses = async () => {
  try {
    const response = await educationApi.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error(error.response?.data?.message || 'Kurslar yüklenirken bir hata oluştu');
  }
};

export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await educationApi.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw new Error(error.response?.data?.message || 'Kurs detayları yüklenirken bir hata oluştu');
  }
};

export const fetchLessonContent = async (courseId, lessonId) => {
  try {
    const response = await educationApi.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lesson content:', error);
    throw new Error(error.response?.data?.message || 'Ders içeriği yüklenirken bir hata oluştu');
  }
};

export const submitQuizAnswers = async (courseId, lessonId, answers) => {
  try {
    const response = await educationApi.post(`/courses/${courseId}/lessons/${lessonId}/submit`, {
      answers,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    throw new Error(error.response?.data?.message || 'Quiz cevapları gönderilirken bir hata oluştu');
  }
};

export const updateProgress = async (courseId, lessonId, progress) => {
  try {
    const response = await educationApi.post(`/courses/${courseId}/lessons/${lessonId}/progress`, {
      progress,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw new Error(error.response?.data?.message || 'İlerleme güncellenirken bir hata oluştu');
  }
};

export const getUserProgress = async () => {
  try {
    const response = await educationApi.get('/progress');
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw new Error(error.response?.data?.message || 'İlerleme durumu yüklenirken bir hata oluştu');
  }
};

// Yeni eklenen fonksiyonlar
export const bookmarkLesson = async (courseId, lessonId) => {
  try {
    const response = await educationApi.post(`/courses/${courseId}/lessons/${lessonId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error('Error bookmarking lesson:', error);
    throw new Error(error.response?.data?.message || 'Ders işaretlenirken bir hata oluştu');
  }
};

export const saveNotes = async (courseId, lessonId, notes) => {
  try {
    const response = await educationApi.post(`/courses/${courseId}/lessons/${lessonId}/notes`, {
      notes,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving notes:', error);
    throw new Error(error.response?.data?.message || 'Notlar kaydedilirken bir hata oluştu');
  }
};

export const getCourseRecommendations = async () => {
  try {
    const response = await educationApi.get('/recommendations');
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw new Error(error.response?.data?.message || 'Öneriler yüklenirken bir hata oluştu');
  }
};

export const searchCourses = async (query) => {
  try {
    const response = await educationApi.get('/courses/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw new Error(error.response?.data?.message || 'Kurs araması yapılırken bir hata oluştu');
  }
};

export const getCourseCertificate = async (courseId) => {
  try {
    const response = await educationApi.get(`/courses/${courseId}/certificate`);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw new Error(error.response?.data?.message || 'Sertifika alınırken bir hata oluştu');
  }
};
