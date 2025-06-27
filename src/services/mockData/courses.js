export const coursesData = [
  {
    id: "1",
    title: "React Fundamentals",
    subject: "programming",
    difficulty: "beginner",
    thumbnail: "https://picsum.photos/400/300?random=1",
    instructor: "Sarah Johnson",
    duration: 8,
    description: "Learn the basics of React including components, state, and props. Perfect for beginners starting their React journey.",
    modules: [
      {
        id: "1-1",
        title: "Introduction to React",
        lessons: [
          {
            id: "1-1-1",
            title: "What is React?",
            type: "video",
            duration: 15,
            completed: false,
            content: "Introduction to React framework and its benefits"
          },
          {
            id: "1-1-2",
            title: "Setting up React",
            type: "video",
            duration: 20,
            completed: false,
            content: "How to set up a React development environment"
          },
          {
            id: "1-1-3",
            title: "React Basics Quiz",
            type: "quiz",
            duration: 10,
            completed: false,
            content: {
              questions: [
                {
                  id: 1,
                  question: "What is React?",
                  options: ["A library", "A framework", "A language", "A database"],
                  correct: 0
                },
                {
                  id: 2,
                  question: "React is maintained by?",
                  options: ["Google", "Facebook", "Microsoft", "Apple"],
                  correct: 1
                }
              ],
              passingScore: 70
            }
          }
        ]
      },
      {
        id: "1-2",
        title: "Components and JSX",
        lessons: [
          {
            id: "1-2-1",
            title: "Understanding Components",
            type: "video",
            duration: 25,
            completed: false,
            content: "Learn about React components and how to create them"
          },
          {
            id: "1-2-2",
            title: "JSX Syntax",
            type: "video",
            duration: 18,
            completed: false,
            content: "Understanding JSX and how it works"
          },
          {
            id: "1-2-3",
            title: "Components Quiz",
            type: "quiz",
            duration: 8,
            completed: false,
            content: {
              questions: [
                {
                  id: 1,
                  question: "What does JSX stand for?",
                  options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "None of the above"],
                  correct: 0
                }
              ],
              passingScore: 70
            }
          }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    subject: "programming",
    difficulty: "intermediate",
    thumbnail: "https://picsum.photos/400/300?random=2",
    instructor: "Michael Chen",
    duration: 12,
    description: "Master advanced JavaScript concepts including async/await, closures, and ES6+ features.",
    modules: [
      {
        id: "2-1",
        title: "ES6+ Features",
        lessons: [
          {
            id: "2-1-1",
            title: "Arrow Functions",
            type: "video",
            duration: 20,
            completed: false,
            content: "Learn about arrow functions and their benefits"
          },
          {
            id: "2-1-2",
            title: "Destructuring",
            type: "video",
            duration: 15,
            completed: false,
            content: "Understanding destructuring in JavaScript"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Spanish for Beginners",
    subject: "languages",
    difficulty: "beginner",
    thumbnail: "https://picsum.photos/400/300?random=3",
    instructor: "Elena Rodriguez",
    duration: 15,
    description: "Start your Spanish learning journey with basic vocabulary, grammar, and pronunciation.",
    modules: [
      {
        id: "3-1",
        title: "Basic Greetings",
        lessons: [
          {
            id: "3-1-1",
            title: "Hello and Goodbye",
            type: "video",
            duration: 12,
            completed: false,
            content: "Learn basic Spanish greetings"
          },
          {
            id: "3-1-2",
            title: "Pronunciation Practice",
            type: "video",
            duration: 18,
            completed: false,
            content: "Practice Spanish pronunciation"
          }
        ]
      }
    ]
  },
  {
    id: "4",
    title: "Calculus I",
    subject: "math",
    difficulty: "intermediate",
    thumbnail: "https://picsum.photos/400/300?random=4",
    instructor: "Dr. Robert Wilson",
    duration: 20,
    description: "Comprehensive introduction to differential and integral calculus with practical applications.",
    modules: [
      {
        id: "4-1",
        title: "Limits and Continuity",
        lessons: [
          {
            id: "4-1-1",
            title: "Introduction to Limits",
            type: "video",
            duration: 30,
            completed: false,
            content: "Understanding the concept of limits"
          },
          {
            id: "4-1-2",
            title: "Limit Laws",
            type: "video",
            duration: 25,
            completed: false,
            content: "Learn about limit laws and their applications"
          }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "Python Data Science",
    subject: "programming",
    difficulty: "advanced",
    thumbnail: "https://picsum.photos/400/300?random=5",
    instructor: "Dr. Lisa Zhang",
    duration: 25,
    description: "Advanced Python programming for data science including pandas, numpy, and machine learning.",
    modules: [
      {
        id: "5-1",
        title: "Data Manipulation",
        lessons: [
          {
            id: "5-1-1",
            title: "Pandas Basics",
            type: "video",
            duration: 35,
            completed: false,
            content: "Introduction to pandas for data manipulation"
          }
        ]
      }
    ]
  },
  {
    id: "6",
    title: "French Conversation",
    subject: "languages",
    difficulty: "intermediate",
    thumbnail: "https://picsum.photos/400/300?random=6",
    instructor: "Marie Dubois",
    duration: 18,
    description: "Improve your French speaking skills through interactive conversations and real-world scenarios.",
    modules: [
      {
        id: "6-1",
        title: "Everyday Conversations",
        lessons: [
          {
            id: "6-1-1",
            title: "At the Restaurant",
            type: "video",
            duration: 22,
            completed: false,
            content: "Learn to order food in French"
          }
        ]
      }
    ]
  }
];