import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getAll() {
    try {
      await delay(200);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completed_lessons" } },
          { field: { Name: "quiz_scores" } },
          { field: { Name: "last_accessed" } },
          { field: { Name: "user_id" } },
          { field: { Name: "quiz_results" } },
          { field: { Name: "course_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data.map(progress => ({
        id: progress.Id,
        courseId: progress.course_id?.Name || progress.course_id,
        userId: progress.user_id?.Name || progress.user_id || 'default',
        completedLessons: progress.completed_lessons ? JSON.parse(progress.completed_lessons) : {},
        quizScores: progress.quiz_scores ? JSON.parse(progress.quiz_scores) : {},
        quizResults: progress.quiz_results ? JSON.parse(progress.quiz_results) : [],
        lastAccessed: progress.last_accessed
      }));
    } catch (error) {
      console.error("Error fetching progress:", error);
      return [];
    }
  },

  async getById(courseId) {
    try {
      await delay(150);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "completed_lessons" } },
          { field: { Name: "quiz_scores" } },
          { field: { Name: "last_accessed" } },
          { field: { Name: "user_id" } },
          { field: { Name: "quiz_results" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          {
            FieldName: "course_id",
            Operator: "EqualTo",
            Values: [courseId]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Progress not found');
      }
      
      const progress = response.data[0];
      return {
        id: progress.Id,
        courseId: progress.course_id?.Name || progress.course_id,
        userId: progress.user_id?.Name || progress.user_id || 'default',
        completedLessons: progress.completed_lessons ? JSON.parse(progress.completed_lessons) : {},
        quizScores: progress.quiz_scores ? JSON.parse(progress.quiz_scores) : {},
        quizResults: progress.quiz_results ? JSON.parse(progress.quiz_results) : [],
        lastAccessed: progress.last_accessed
      };
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      throw error;
    }
  },

  async create(progressItem) {
    try {
      await delay(300);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: `Progress for course ${progressItem.courseId}`,
          course_id: progressItem.courseId,
          user_id: progressItem.userId || 'default',
          completed_lessons: JSON.stringify(progressItem.completedLessons || {}),
          quiz_scores: JSON.stringify(progressItem.quizScores || {}),
          quiz_results: JSON.stringify(progressItem.quizResults || []),
          last_accessed: progressItem.lastAccessed || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const newProgress = successfulRecords[0].data;
          return {
            id: newProgress.Id,
            courseId: newProgress.course_id?.Name || newProgress.course_id,
            userId: newProgress.user_id?.Name || newProgress.user_id || 'default',
            completedLessons: newProgress.completed_lessons ? JSON.parse(newProgress.completed_lessons) : {},
            quizScores: newProgress.quiz_scores ? JSON.parse(newProgress.quiz_scores) : {},
            quizResults: newProgress.quiz_results ? JSON.parse(newProgress.quiz_results) : [],
            lastAccessed: newProgress.last_accessed
          };
        }
      }
      
      throw new Error('Failed to create progress');
    } catch (error) {
      console.error("Error creating progress:", error);
      throw error;
    }
  },

  async update(courseId, progressItem) {
    try {
      await delay(250);
      
      // First get the existing progress record to get its ID
      const existingProgress = await this.getById(courseId);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: existingProgress.id
      };
      
      if (progressItem.completedLessons !== undefined) {
        updateData.completed_lessons = JSON.stringify(progressItem.completedLessons);
      }
      if (progressItem.quizScores !== undefined) {
        updateData.quiz_scores = JSON.stringify(progressItem.quizScores);
      }
      if (progressItem.quizResults !== undefined) {
        updateData.quiz_results = JSON.stringify(progressItem.quizResults);
      }
      if (progressItem.lastAccessed !== undefined) {
        updateData.last_accessed = progressItem.lastAccessed;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const updatedProgress = successfulUpdates[0].data;
          return {
            id: updatedProgress.Id,
            courseId: updatedProgress.course_id?.Name || updatedProgress.course_id,
            userId: updatedProgress.user_id?.Name || updatedProgress.user_id || 'default',
            completedLessons: updatedProgress.completed_lessons ? JSON.parse(updatedProgress.completed_lessons) : {},
            quizScores: updatedProgress.quiz_scores ? JSON.parse(updatedProgress.quiz_scores) : {},
            quizResults: updatedProgress.quiz_results ? JSON.parse(updatedProgress.quiz_results) : [],
            lastAccessed: updatedProgress.last_accessed
          };
        }
      }
      
      throw new Error('Failed to update progress');
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  async delete(courseId) {
    try {
      await delay(200);
      
      // First get the existing progress record to get its ID
      const existingProgress = await this.getById(courseId);
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [existingProgress.id]
      };
      
      const response = await apperClient.deleteRecord('progress', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting progress:", error);
      throw error;
    }
  },

  async getQuizAnalytics(userId = 'default') {
    await delay(200);
    
    try {
      const allProgress = await this.getAll();
      const userProgress = allProgress.filter(p => p.userId === userId || !p.userId);
      
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
            result.questionResults?.forEach(qResult => {
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
    } catch (error) {
      console.error("Error getting quiz analytics:", error);
      return {
        totalQuizzes: 0,
        averageScore: 0,
        topicPerformance: {},
        weakAreas: [],
        improvementTrends: []
      };
    }
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