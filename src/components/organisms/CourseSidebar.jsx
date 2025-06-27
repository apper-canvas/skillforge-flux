import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import LessonItem from '@/components/molecules/LessonItem';
import ProgressRing from '@/components/atoms/ProgressRing';

const CourseSidebar = ({ course, currentLessonId, progress = {} }) => {
  const calculateProgress = () => {
    if (!course?.modules) return 0;
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = Object.values(progress.completedLessons || {}).filter(Boolean).length;
    
    return (completedLessons / totalLessons) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24"
    >
      {/* Course Header */}
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold text-gray-800 mb-2 line-clamp-2">
          {course?.title}
        </h2>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Overall Progress
          </div>
          <ProgressRing progress={calculateProgress()} size={60} strokeWidth={6} />
        </div>
      </div>

      {/* Course Modules */}
      <div className="space-y-4">
        {course?.modules?.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 py-2 border-b border-gray-100">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-2">
                <ApperIcon name="BookOpen" size={16} className="text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 text-sm">
                  Module {moduleIndex + 1}
                </h3>
                <p className="text-xs text-gray-500">
                  {module.title}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              {module.lessons?.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  courseId={course.id}
                  isActive={lesson.id === currentLessonId}
                  completed={progress.completedLessons?.[lesson.id] || false}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseSidebar;