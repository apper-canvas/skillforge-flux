import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { courseService } from '@/services/api/courseService';
import { progressService } from '@/services/api/progressService';
import ProgressStats from '@/components/organisms/ProgressStats';
import CourseCard from '@/components/molecules/CourseCard';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      
      // Load all progress data
      const progressData = await progressService.getAll();
      const progressMap = {};
      progressData.forEach(p => {
        progressMap[p.courseId] = p;
      });
      setProgress(progressMap);
      
      // Load enrolled courses
      const enrolledCourseIds = progressData.map(p => p.courseId);
      const allCourses = await courseService.getAll();
      const enrolled = allCourses.filter(course => enrolledCourseIds.includes(course.id));
      setEnrolledCourses(enrolled);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseProgress = (course) => {
    const courseProgress = progress[course.id];
    if (!courseProgress) return 0;

    const totalLessons = course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
    const completedLessons = Object.values(courseProgress.completedLessons || {}).filter(Boolean).length;

    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getRecentCourses = () => {
    return enrolledCourses
      .filter(course => progress[course.id]?.lastAccessed)
      .sort((a, b) => {
        const dateA = new Date(progress[a.id].lastAccessed);
        const dateB = new Date(progress[b.id].lastAccessed);
        return dateB - dateA;
      })
      .slice(0, 3);
  };

  const getInProgressCourses = () => {
    return enrolledCourses.filter(course => {
      const progressPercent = calculateCourseProgress(course);
      return progressPercent > 0 && progressPercent < 100;
    });
  };

  const getCompletedCourses = () => {
    return enrolledCourses.filter(course => {
      const progressPercent = calculateCourseProgress(course);
      return progressPercent >= 100;
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  const recentCourses = getRecentCourses();
  const inProgressCourses = getInProgressCourses();
  const completedCourses = getCompletedCourses();

  if (enrolledCourses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Empty
          type="progress"
          onAction={() => window.location.href = '/'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-2">
          Your Learning
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {" "}Dashboard
          </span>
        </h1>
        <p className="text-lg text-gray-600">
          Track your progress and continue your learning journey
        </p>
      </motion.div>

      {/* Progress Stats */}
      <ProgressStats enrolledCourses={enrolledCourses} progress={progress} />

      {/* Recent Activity */}
      {recentCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-2">
              <ApperIcon name="Clock" size={20} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-800">
              Recently Accessed
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={calculateCourseProgress(course)}
                enrolled={true}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* In Progress Courses */}
      {inProgressCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full p-2">
              <ApperIcon name="PlayCircle" size={20} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-800">
              Continue Learning
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={calculateCourseProgress(course)}
                enrolled={true}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-success/20 to-success/30 rounded-full p-2">
              <ApperIcon name="CheckCircle" size={20} className="text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-800">
              Completed Courses
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={calculateCourseProgress(course)}
                enrolled={true}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Dashboard;