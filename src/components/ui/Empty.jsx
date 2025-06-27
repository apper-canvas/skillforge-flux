import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by exploring our available options.",
  icon = "BookOpen",
  actionLabel = "Get Started",
  onAction,
  type = 'default'
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'courses':
        return {
          title: "No courses found",
          description: "Try adjusting your filters or search terms to find the perfect course for you.",
          icon: "Search",
          actionLabel: "Clear Filters"
        };
      case 'progress':
        return {
          title: "Start your learning journey",
          description: "Enroll in your first course to begin tracking your progress and achievements.",
          icon: "TrendingUp",
          actionLabel: "Browse Courses"
        };
      case 'community':
        return {
          title: "Join the conversation",
          description: "Be the first to start a discussion in this community forum.",
          icon: "MessageCircle",
          actionLabel: "Start Discussion"
        };
      default:
        return { title, description, icon, actionLabel };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="bg-gradient-to-br from-primary-100 to-amber-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name={config.icon} size={36} className="text-primary-600" />
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-display font-bold text-gray-800 mb-3"
        >
          {config.title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          {config.description}
        </motion.p>
        
        {onAction && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="ArrowRight" size={16} />
            {config.actionLabel}
          </motion.button>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-4 text-center"
        >
          <div className="space-y-2">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3">
              <ApperIcon name="BookOpen" size={20} className="text-primary-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-500">Interactive Courses</p>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3">
              <ApperIcon name="Award" size={20} className="text-amber-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-500">Earn Certificates</p>
          </div>
          <div className="space-y-2">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
              <ApperIcon name="Users" size={20} className="text-green-600 mx-auto" />
            </div>
            <p className="text-xs text-gray-500">Join Community</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Empty;