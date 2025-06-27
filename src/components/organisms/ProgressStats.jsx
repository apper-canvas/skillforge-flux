import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/atoms/ProgressRing';
import Badge from '@/components/atoms/Badge';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ProgressStats = ({ enrolledCourses = [], progress = {} }) => {
  const calculateOverallProgress = () => {
    if (enrolledCourses.length === 0) return 0;
    
    const totalProgress = enrolledCourses.reduce((acc, course) => {
      const courseProgress = progress[course.id] || {};
      const totalLessons = course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
      const completedLessons = Object.values(courseProgress.completedLessons || {}).filter(Boolean).length;
      return acc + (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);
    }, 0);
    
    return totalProgress / enrolledCourses.length;
  };

  const getCompletedCourses = () => {
    return enrolledCourses.filter(course => {
      const courseProgress = progress[course.id] || {};
      const totalLessons = course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
      const completedLessons = Object.values(courseProgress.completedLessons || {}).filter(Boolean).length;
      return totalLessons > 0 && completedLessons === totalLessons;
    }).length;
  };

  const getSubjectDistribution = () => {
    const subjects = {};
    enrolledCourses.forEach(course => {
      subjects[course.subject] = (subjects[course.subject] || 0) + 1;
    });
    return subjects;
  };

  const subjectData = getSubjectDistribution();
  
  const chartData = {
    labels: Object.keys(subjectData),
    datasets: [
      {
        data: Object.values(subjectData),
        backgroundColor: [
          '#5B4FCF',
          '#7C3AED',
          '#F59E0B',
          '#10B981',
          '#EF4444',
          '#3B82F6'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 text-center"
      >
        <div className="mb-4">
          <ProgressRing progress={calculateOverallProgress()} size={80} strokeWidth={8} />
        </div>
        <h3 className="text-lg font-display font-bold text-gray-800 mb-1">
          Overall Progress
        </h3>
        <p className="text-sm text-gray-600">
          Across all courses
        </p>
      </motion.div>

      {/* Enrolled Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-3">
            <ApperIcon name="BookOpen" size={24} className="text-primary-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {enrolledCourses.length}
            </div>
            <p className="text-sm text-gray-600">Enrolled Courses</p>
          </div>
        </div>
        <Badge variant="primary" size="sm">
          <ApperIcon name="TrendingUp" size={12} className="mr-1" />
          Active Learning
        </Badge>
      </motion.div>

      {/* Completed Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-success/20 to-success/30 rounded-full p-3">
            <ApperIcon name="CheckCircle" size={24} className="text-success" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {getCompletedCourses()}
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
        <Badge variant="success" size="sm">
          <ApperIcon name="Award" size={12} className="mr-1" />
          Achievements
        </Badge>
      </motion.div>

      {/* Subject Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
          Subject Distribution
        </h3>
        {Object.keys(subjectData).length > 0 ? (
          <div className="h-32">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-4">
            <ApperIcon name="PieChart" size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No data available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProgressStats;