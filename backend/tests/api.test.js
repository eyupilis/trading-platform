const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const API_URL = 'http://localhost:5001/api';
let authToken;
let userId;
let courseId;
let lessonId;
let quizId;
let marketId;
let signalId;

const testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'Test123!',
    fullName: 'Test User'
};

describe('Trading Platform API Tests', () => {
    // 1. Authentication Tests
    describe('Authentication', () => {
        test('should register a new user', async () => {
            const response = await axios.post(`${API_URL}/auth/register`, testUser);
            expect(response.status).toBe(201);
            expect(response.data.token).toBeDefined();
            expect(response.data.user).toBeDefined();
            authToken = response.data.token;
            userId = response.data.user.id;
        });

        test('should login with registered user', async () => {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            expect(response.status).toBe(200);
            expect(response.data.token).toBeDefined();
            expect(response.data.user).toBeDefined();
            authToken = response.data.token;
        });
    });

    // 2. Course Tests
    describe('Courses', () => {
        test('should create a new course', async () => {
            const courseData = {
                title: 'Test Course',
                description: 'Test Description',
                difficulty_level: 'intermediate',
                duration_minutes: 60
            };
            
            const response = await axios.post(`${API_URL}/education/courses`, courseData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(201);
            expect(response.data.id).toBeDefined();
            courseId = response.data.id;
        });

        test('should get all courses', async () => {
            const response = await axios.get(`${API_URL}/education/courses`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });

    // 3. Lesson Tests
    describe('Lessons', () => {
        test('should create a new lesson', async () => {
            const lessonData = {
                title: 'Test Lesson',
                content: 'Test Content',
                course_id: courseId,
                order_index: 1,
                duration_minutes: 30
            };
            
            const response = await axios.post(`${API_URL}/education/courses/${courseId}/lessons`, lessonData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(201);
            expect(response.data.id).toBeDefined();
            lessonId = response.data.id;
        });

        test('should get all lessons for a course', async () => {
            const response = await axios.get(`${API_URL}/education/courses/${courseId}/lessons`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });

    // 4. Quiz Tests
    describe('Quizzes', () => {
        test('should create a new quiz', async () => {
            const quizData = {
                title: 'Test Quiz',
                description: 'Test Quiz Description',
                lesson_id: lessonId,
                questions: [
                    {
                        question: 'Test Question',
                        options: ['A', 'B', 'C', 'D'],
                        correct_answer: 'A',
                        points: 1
                    }
                ],
                passing_score: 70
            };
            
            const response = await axios.post(`${API_URL}/education/lessons/${lessonId}/quiz`, quizData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(201);
            expect(response.data.id).toBeDefined();
            quizId = response.data.id;
        });

        test('should submit quiz answers', async () => {
            const response = await axios.post(`${API_URL}/education/quizzes/${quizId}/submit`, {
                answers: ['A']
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.score).toBeDefined();
        });
    });

    // 5. Market Tests
    describe('Markets', () => {
        test('should create a new market', async () => {
            const marketData = {
                symbol: 'BTCUSDT',
                name: 'Bitcoin/USDT',
                type: 'spot',
                base_asset: 'BTC',
                quote_asset: 'USDT',
                min_price: '0.01',
                max_price: '1000000',
                tick_size: '0.01',
                min_qty: '0.00001',
                max_qty: '1000',
                step_size: '0.00001'
            };
            
            const response = await axios.post(`${API_URL}/markets`, marketData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(201);
            expect(response.data.id).toBeDefined();
            marketId = response.data.id;
        });

        test('should get all markets', async () => {
            const response = await axios.get(`${API_URL}/markets`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });

    // 6. Signal Tests
    describe('Signals', () => {
        test('should create a new signal', async () => {
            const signalData = {
                market_id: marketId,
                signal_type: 'buy',
                entry_price: '50000',
                target_price: '55000',
                stop_loss: '48000',
                timeframe: '4h',
                risk_level: 'medium',
                analysis: 'Test analysis'
            };
            
            const response = await axios.post(`${API_URL}/signals`, signalData, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(201);
            expect(response.data.id).toBeDefined();
            signalId = response.data.id;
        });

        test('should get all signals', async () => {
            const response = await axios.get(`${API_URL}/signals`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });

    // 7. Progress Tests
    describe('Progress', () => {
        test('should update lesson progress', async () => {
            const response = await axios.post(`${API_URL}/education/lessons/${lessonId}/progress`, {
                status: 'completed'
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.status).toBe('completed');
        });

        test('should get user progress', async () => {
            const response = await axios.get(`${API_URL}/education/progress`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
        });
    });
});
