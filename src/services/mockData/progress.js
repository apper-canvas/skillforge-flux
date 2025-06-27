export const progressData = [
  {
    id: 1,
    courseId: "1",
    userId: "default",
    completedLessons: {
      "1-1-1": true,
      "1-1-2": true,
      "1-1-3": false,
      "1-2-1": false,
      "1-2-2": false,
      "1-2-3": false
    },
    quizScores: {
      "1-1-3": 85
    },
    quizResults: [
      {
        lessonId: "1-1-3",
        lessonTitle: "React Basics Quiz",
        score: 85,
        totalQuestions: 2,
        correctAnswers: 1,
        completedAt: "2024-01-15T10:30:00Z",
        questionResults: [
          {
            questionId: 1,
            question: "What is React?",
            selectedAnswer: 0,
            correctAnswer: 0,
            correct: true,
            topic: "react-basics",
            difficulty: "easy"
          },
          {
            questionId: 2,
            question: "React is maintained by?",
            selectedAnswer: 2,
            correctAnswer: 1,
            correct: false,
            topic: "react-basics",
            difficulty: "easy"
          }
        ],
        timeSpent: 120
      }
    ],
    topicPerformance: {
      "react-basics": { correct: 3, total: 5, percentage: 60 },
      "components": { correct: 2, total: 4, percentage: 50 },
      "javascript": { correct: 4, total: 6, percentage: 67 }
    },
    weakAreas: [
      {
        topic: "components",
        percentage: 50,
        needsImprovement: true,
        recommendedLessons: ["Understanding Components", "JSX Syntax"],
        lastPracticed: "2024-01-10T08:00:00Z"
      },
      {
        topic: "react-basics",
        percentage: 60,
        needsImprovement: true,
        recommendedLessons: ["What is React?", "Setting up React"],
        lastPracticed: "2024-01-15T10:30:00Z"
      }
    ],
    lastAccessed: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    courseId: "3",
    userId: "default",
    completedLessons: {
      "3-1-1": true,
      "3-1-2": false
    },
    quizScores: {},
    quizResults: [],
    topicPerformance: {
      "spanish": { correct: 8, total: 10, percentage: 80 }
    },
    weakAreas: [],
    lastAccessed: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    courseId: "2",
    userId: "default", 
    completedLessons: {
      "2-1-1": true,
      "2-1-2": false
    },
    quizScores: {
      "2-1-quiz": 45
    },
    quizResults: [
      {
        lessonId: "2-1-quiz",
        lessonTitle: "JavaScript ES6 Quiz",
        score: 45,
        totalQuestions: 4,
        correctAnswers: 2,
        completedAt: "2024-01-12T15:45:00Z",
        questionResults: [
          {
            questionId: 1,
            question: "What are arrow functions?",
            selectedAnswer: 1,
            correctAnswer: 0,
            correct: false,
            topic: "javascript",
            difficulty: "medium"
          },
          {
            questionId: 2,
            question: "How does destructuring work?",
            selectedAnswer: 2,
            correctAnswer: 2,
            correct: true,
            topic: "javascript", 
            difficulty: "medium"
          }
        ],
        timeSpent: 180
      }
    ],
    topicPerformance: {
      "javascript": { correct: 2, total: 6, percentage: 33 }
    },
    weakAreas: [
      {
        topic: "javascript",
        percentage: 33,
        needsImprovement: true,
        recommendedLessons: ["Arrow Functions", "Destructuring", "ES6+ Features"],
        lastPracticed: "2024-01-12T15:45:00Z"
      }
    ],
    lastAccessed: "2024-01-12T15:45:00Z"
  }
];