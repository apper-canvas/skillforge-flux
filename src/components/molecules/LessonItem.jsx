import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const LessonItem = ({ lesson, courseId, isActive = false, completed = false }) => {
  const getLessonIcon = () => {
    if (completed) return 'CheckCircle';
    if (lesson.type === 'video') return 'Play';
    if (lesson.type === 'quiz') return 'HelpCircle';
    return 'BookOpen';
  };

const getIconColor = () => {
    if (completed) return 'text-success';
    if (lesson.type === 'youtube') return 'text-red-500';
    if (isActive) return 'text-primary-600';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        border-l-4 pl-4 py-3 transition-all duration-200
        ${isActive ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}
        ${completed ? 'border-success bg-success/5' : ''}
      `}
    >
      <Link
        to={`/learn/${courseId}/${lesson.id}`}
        className="flex items-center gap-3 group"
      >
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center transition-colors
          ${completed ? 'bg-success text-white' : 'bg-gray-100 group-hover:bg-primary-100'}
        `}>
          <ApperIcon 
            name={getLessonIcon()} 
            size={16} 
            className={completed ? 'text-white' : getIconColor()}
          />
        </div>
        
        <div className="flex-1">
          <h4 className={`
            text-sm font-medium transition-colors
            ${isActive ? 'text-primary-600' : 'text-gray-800'}
            ${completed ? 'text-success' : ''}
            group-hover:text-primary-600
          `}>
            {lesson.title}
          </h4>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 capitalize">
              {lesson.type}
            </span>
            {lesson.duration && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  {lesson.duration}min
                </span>
              </>
            )}
          </div>
        </div>
        
        {isActive && (
          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
        )}
      </Link>
    </motion.div>
  );
};

export default LessonItem;