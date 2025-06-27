import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuizInterface = ({ lesson, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const questions = lesson.content?.questions || [
    {
      id: 1,
      question: "What is the primary purpose of React hooks?",
      options: [
        "To manage state in functional components",
        "To create class components",
        "To handle CSS styling",
        "To manage server requests"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Which hook is used for side effects in React?",
      options: [
        "useState",
        "useEffect",
        "useContext",
        "useReducer"
      ],
      correct: 1
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

const handleSubmit = () => {
    let correctAnswers = 0;
    const questionResults = [];
    
    questions.forEach((question, index) => {
      const isCorrect = answers[index] === question.correct;
      if (isCorrect) {
        correctAnswers++;
      }
      
      // Capture detailed question-level results for analytics
      questionResults.push({
        questionId: question.id,
        question: question.question,
        selectedAnswer: answers[index],
        correctAnswer: question.correct,
        correct: isCorrect,
        topic: question.topic || getQuestionTopic(question.question),
        difficulty: question.difficulty || 'medium'
      });
    });
    
    const finalScore = (correctAnswers / questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);
    
    // Store detailed quiz results for analytics
    const quizResult = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      score: finalScore,
      totalQuestions: questions.length,
      correctAnswers,
      completedAt: new Date().toISOString(),
      questionResults,
      timeSpent: 300 - timeLeft
    };
    
    // Save quiz results for analytics (in a real app, this would be sent to a service)
    if (typeof window !== 'undefined') {
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      existingResults.push(quizResult);
      localStorage.setItem('quizResults', JSON.stringify(existingResults));
    }
    
    if (finalScore >= (lesson.content?.passingScore || 70)) {
      toast.success(`Congratulations! You scored ${finalScore.toFixed(0)}%`);
      if (onComplete) onComplete(quizResult);
    } else {
      toast.error(`You scored ${finalScore.toFixed(0)}%. Try again to pass!`);
    }
  };

  // Helper function to extract topic from question content
  const getQuestionTopic = (questionText) => {
    const text = questionText.toLowerCase();
    if (text.includes('react') || text.includes('hook') || text.includes('component')) return 'react-basics';
    if (text.includes('jsx') || text.includes('component')) return 'components';
    if (text.includes('javascript') || text.includes('es6') || text.includes('arrow')) return 'javascript';
    if (text.includes('limit') || text.includes('calculus') || text.includes('math')) return 'math';
    if (text.includes('spanish') || text.includes('hola') || text.includes('greeting')) return 'spanish';
    if (text.includes('french') || text.includes('restaurant') || text.includes('bonjour')) return 'french';
    return 'general';
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(300);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
          ${score >= (lesson.content?.passingScore || 70) 
            ? 'bg-gradient-to-br from-success/20 to-success/30' 
            : 'bg-gradient-to-br from-error/20 to-error/30'
          }
        `}>
          <ApperIcon 
            name={score >= (lesson.content?.passingScore || 70) ? "CheckCircle" : "XCircle"} 
            size={40} 
            className={score >= (lesson.content?.passingScore || 70) ? "text-success" : "text-error"}
          />
        </div>
        
        <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">
          Quiz Complete!
        </h3>
        
        <div className="text-6xl font-bold mb-4">
          <span className={`
            bg-gradient-to-r bg-clip-text text-transparent
            ${score >= (lesson.content?.passingScore || 70)
              ? 'from-success to-success/80'
              : 'from-error to-error/80'
            }
          `}>
            {score.toFixed(0)}%
          </span>
        </div>
        
        <p className="text-gray-600 mb-6">
          You answered {Object.values(answers).filter((answer, index) => answer === questions[index]?.correct).length} out of {questions.length} questions correctly.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button onClick={resetQuiz} variant="outline">
            Try Again
          </Button>
          {score >= (lesson.content?.passingScore || 70) && (
            <Button onClick={() => window.history.back()} variant="primary">
              Continue Learning
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-2">
            <ApperIcon name="HelpCircle" size={20} className="text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-gray-800">
              {lesson.title}
            </h2>
            <p className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <ApperIcon name="Clock" size={16} className="text-gray-400" />
          <span className={`font-mono ${timeLeft < 60 ? 'text-error' : 'text-gray-600'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-6">
          {question?.question}
        </h3>
        
        <div className="space-y-3">
          {question?.options.map((option, index) => (
            <motion.label
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                ${answers[currentQuestion] === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(currentQuestion, index)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                ${answers[currentQuestion] === index
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
                }
              `}>
                {answers[currentQuestion] === index && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-700">{option}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={answers[currentQuestion] === undefined}
            variant="primary"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            disabled={answers[currentQuestion] === undefined}
            variant="primary"
          >
            Next
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizInterface;