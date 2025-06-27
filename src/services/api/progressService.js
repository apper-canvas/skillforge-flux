import { progressData } from '@/services/mockData/progress';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getAll() {
    await delay(200);
    return [...progressData];
  },

  async getById(courseId) {
    await delay(150);
    const progress = progressData.find(p => p.courseId === courseId);
    if (!progress) {
      throw new Error('Progress not found');
    }
    return { ...progress };
  },

  async create(progressItem) {
    await delay(300);
    const newProgress = {
      ...progressItem,
      id: Math.max(...progressData.map(p => p.id), 0) + 1
    };
    progressData.push(newProgress);
    return { ...newProgress };
  },

  async update(courseId, progressItem) {
    await delay(250);
    const index = progressData.findIndex(p => p.courseId === courseId);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    progressData[index] = { ...progressData[index], ...progressItem };
    return { ...progressData[index] };
  },

async delete(courseId) {
    await delay(200);
    const index = progressData.findIndex(p => p.courseId === courseId);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    progressData.splice(index, 1);
    return true;
  },

  async getQuizAnalytics(userId = 'default') {
    await delay(200);
    const userProgress = progressData.filter(p => p.userId === userId || !p.userId);
    
    const analytics = {
      totalQuizzes: 0,
      averageScore: 0,
      topicPerformance: {},
      weakAreas: [],
      improvementTrends: []
    };

    userProgress.forEach(progress => {
      if (progress.quizResults) {
        progress.quizResults.forEach(result => {
          analytics.totalQuizzes++;
          
          // Track topic performance
          result.questionResults.forEach(qResult => {
            const topic = qResult.topic || 'General';
            if (!analytics.topicPerformance[topic]) {
              analytics.topicPerformance[topic] = { correct: 0, total: 0 };
            }
            analytics.topicPerformance[topic].total++;
            if (qResult.correct) {
              analytics.topicPerformance[topic].correct++;
            }
          });
        });
      }
    });

    // Calculate average scores and identify weak areas
    Object.keys(analytics.topicPerformance).forEach(topic => {
      const performance = analytics.topicPerformance[topic];
      performance.percentage = (performance.correct / performance.total) * 100;
      
      if (performance.percentage < 70) {
        analytics.weakAreas.push({
          topic,
          percentage: performance.percentage,
          needsImprovement: true
        });
      }
    });

    // Sort weak areas by performance
    analytics.weakAreas.sort((a, b) => a.percentage - b.percentage);

    return analytics;
  },

  async getWeakAreas(userId = 'default') {
    await delay(150);
    const analytics = await this.getQuizAnalytics(userId);
    return analytics.weakAreas;
  },

  async getPracticeRecommendations(userId = 'default') {
    await delay(200);
    const weakAreas = await this.getWeakAreas(userId);
    
    const recommendations = weakAreas.map(area => ({
      topic: area.topic,
      currentScore: area.percentage,
      recommendedLessons: this.getRelevantLessons(area.topic),
      recommendedQuizzes: this.getRelevantQuizzes(area.topic),
      priority: area.percentage < 50 ? 'high' : 'medium'
    }));

    return recommendations;
  },

  getRelevantLessons(topic) {
    const topicMap = {
      'react-basics': ['What is React?', 'Setting up React'],
      'components': ['Understanding Components', 'JSX Syntax'],
      'hooks': ['React Hooks Introduction', 'useState and useEffect'],
      'javascript': ['ES6+ Features', 'Arrow Functions', 'Destructuring'],
      'math': ['Introduction to Limits', 'Limit Laws'],
      'spanish': ['Hello and Goodbye', 'Pronunciation Practice'],
      'french': ['At the Restaurant', 'Basic Conversations']
    };
    
    return topicMap[topic.toLowerCase()] || ['Foundation Concepts'];
  },

  getRelevantQuizzes(topic) {
    const quizMap = {
      'react-basics': ['React Fundamentals Quiz'],
      'components': ['Components Quiz', 'JSX Practice Quiz'],
      'javascript': ['ES6 Features Quiz', 'Advanced JavaScript Quiz'],
      'math': ['Calculus Basics Quiz'],
      'spanish': ['Greetings Quiz', 'Basic Vocabulary Quiz'],
      'french': ['Restaurant Conversation Quiz']
    };
    
    return quizMap[topic.toLowerCase()] || ['General Practice Quiz'];
  }
};