import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import ProgressRing from '@/components/atoms/ProgressRing';

const CourseCard = ({ course, progress = 0, enrolled = false }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'advanced': return 'advanced';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <ApperIcon name="Play" size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {enrolled && (
            <div className="absolute top-3 right-3">
              <ProgressRing progress={progress} size={40} strokeWidth={4} showText={false} />
            </div>
          )}
          
          <div className="absolute bottom-3 left-3">
            <Badge variant={getDifficultyColor(course.difficulty)} size="sm">
              {course.difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-display font-bold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
              {course.title}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description || `Master ${course.subject} with interactive lessons and hands-on practice.`}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <ApperIcon name="User" size={14} />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              <span>{course.duration}h</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ApperIcon name="BookOpen" size={14} />
              <span>{course.modules?.length || 0} modules</span>
            </div>
            
            <div className="flex items-center gap-2">
              {enrolled ? (
                <Badge variant="success" size="sm">
                  <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                  Enrolled
                </Badge>
              ) : (
                <Badge variant="primary" size="sm">
                  <ApperIcon name="Plus" size={12} className="mr-1" />
                  Enroll
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;