export const discussionsData = [
  {
    Id: 1,
    title: "Best practices for React state management",
    content: "I'm working on a large React application and wondering about the best approaches for state management. Should I use Context API, Redux, or something else?",
    category: "programming",
    author: "Alex Thompson",
    replies: 12,
    views: 156,
    createdAt: "2024-01-15T09:30:00Z",
    isPinned: true,
    tags: ["react", "state-management", "redux"]
  },
  {
    Id: 2,
    title: "Struggling with Spanish verb conjugations",
    content: "I've been learning Spanish for 3 months now and I'm having trouble with verb conjugations, especially irregular verbs. Any tips or resources?",
    category: "languages",
    author: "Maria Santos",
    replies: 8,
    views: 89,
    createdAt: "2024-01-14T16:45:00Z",
    isPinned: false,
    tags: ["spanish", "grammar", "verbs"]
  },
  {
    Id: 3,
    title: "Calculus limit problems - need help",
    content: "Can someone explain how to solve limit problems when x approaches infinity? I'm stuck on a few homework problems.",
    category: "math",
    author: "David Kim",
    replies: 15,
    views: 203,
    createdAt: "2024-01-14T11:15:00Z",
    isPinned: false,
    tags: ["calculus", "limits", "homework-help"]
  },
  {
    Id: 4,
    title: "Welcome to the SkillForge community!",
    content: "Welcome everyone! This is a place to ask questions, share knowledge, and connect with fellow learners. Please be respectful and helpful to each other.",
    category: "general",
    author: "SkillForge Team",
    replies: 25,
    views: 450,
    createdAt: "2024-01-10T08:00:00Z",
    isPinned: true,
    tags: ["welcome", "community", "guidelines"]
  },
  {
    Id: 5,
    title: "Python vs JavaScript for beginners",
    content: "I'm new to programming and can't decide between Python and JavaScript as my first language. What would you recommend?",
    category: "programming",
    author: "Jenny Wilson",
    replies: 18,
    views: 234,
    createdAt: "2024-01-13T13:20:00Z",
    isPinned: false,
    tags: ["python", "javascript", "beginners"]
  },
  {
    Id: 6,
    title: "French pronunciation tips",
    content: "I'm working on my French pronunciation and finding it challenging. Are there any specific techniques or exercises that helped you?",
    category: "languages",
    author: "Thomas Mueller",
    replies: 6,
    views: 78,
    createdAt: "2024-01-12T17:30:00Z",
    isPinned: false,
    tags: ["french", "pronunciation", "speaking"]
  },
  {
    Id: 7,
    title: "Study group for advanced mathematics",
    content: "Looking to form a study group for advanced math topics. Anyone interested in collaborating on calculus and linear algebra problems?",
    category: "math",
    author: "Sarah Park",
    replies: 4,
    views: 56,
    createdAt: "2024-01-11T20:45:00Z",
    isPinned: false,
    tags: ["study-group", "advanced-math", "collaboration"]
  },
  {
    Id: 8,
    title: "How to stay motivated while learning online",
    content: "I sometimes lose motivation when learning online. What strategies do you use to stay focused and motivated?",
    category: "general",
    author: "Michael Brown",
    replies: 22,
    views: 312,
    createdAt: "2024-01-10T15:15:00Z",
    isPinned: false,
    tags: ["motivation", "online-learning", "tips"]
  }
];

// Mock replies data for thread discussions
export const threadRepliesData = [
  {
    Id: 1,
    threadId: 1,
    content: "I'd recommend Redux Toolkit for larger applications. It's much cleaner than vanilla Redux and has great DevTools support.",
    author: "John Developer",
    createdAt: "2024-01-15T10:15:00Z",
    parentReplyId: null,
    likes: 8
  },
  {
    Id: 2,
    threadId: 1,
    content: "Context API works great for smaller to medium apps. I've used it successfully in several projects without any performance issues.",
    author: "Sarah React",
    createdAt: "2024-01-15T11:30:00Z",
    parentReplyId: null,
    likes: 5
  },
  {
    Id: 3,
    threadId: 1,
    content: "What about Zustand? It's lighter than Redux and has a great developer experience.",
    author: "Mike Frontend",
    createdAt: "1/15/2024 12:45:00 PMZ",
    parentReplyId: 1,
    likes: 3
  },
  {
    Id: 4,
    threadId: 2,
    content: "Try using conjugation apps like SpanishDict or Conjuguemos. Practice daily with just 10-15 minutes and you'll see improvement!",
    author: "Language Teacher",
    createdAt: "1/14/2024 5:00:00 PMZ",
    parentReplyId: null,
    likes: 12
  },
  {
    Id: 5,
    threadId: 2,
    content: "I found flashcards really helpful. Create cards with the infinitive on one side and the conjugated forms on the other.",
    author: "Spanish Learner",
    createdAt: "2024-01-14T18:30:00Z",
    parentReplyId: 4,
    likes: 6
  },
  {
    Id: 6,
    threadId: 3,
    content: "For limits approaching infinity, remember L'Hôpital's rule when you get indeterminate forms like ∞/∞ or 0/0.",
    author: "Math Professor",
    createdAt: "2024-01-14T12:00:00Z",
    parentReplyId: null,
    likes: 15
  },
  {
    Id: 7,
    threadId: 3,
    content: "Also, try graphing the function to visualize what's happening as x approaches infinity. It often makes the concept clearer.",
    author: "Calculus Student",
    createdAt: "2024-01-14T13:30:00Z",
    parentReplyId: 6,
    likes: 8
  }
];