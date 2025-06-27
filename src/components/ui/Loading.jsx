import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'course-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 space-y-4"
          >
            <div className="shimmer h-48 rounded-lg"></div>
            <div className="shimmer h-6 rounded w-3/4"></div>
            <div className="shimmer h-4 rounded w-full"></div>
            <div className="shimmer h-4 rounded w-2/3"></div>
            <div className="flex justify-between items-center">
              <div className="shimmer h-5 rounded w-20"></div>
              <div className="shimmer h-8 rounded w-24"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'course-detail') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6"
        >
          <div className="shimmer h-64 rounded-xl"></div>
          <div className="shimmer h-8 rounded w-3/4"></div>
          <div className="shimmer h-5 rounded w-full"></div>
          <div className="shimmer h-5 rounded w-2/3"></div>
          <div className="flex gap-4">
            <div className="shimmer h-12 rounded-lg w-32"></div>
            <div className="shimmer h-12 rounded-lg w-40"></div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="shimmer h-6 rounded w-1/2"></div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shimmer h-12 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <div className="shimmer h-6 rounded w-1/2"></div>
            <div className="shimmer h-20 rounded-lg"></div>
            <div className="shimmer h-5 rounded w-full"></div>
            <div className="shimmer h-5 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'video-player') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black rounded-xl overflow-hidden"
      >
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-white text-center space-y-4">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
            <p className="text-lg font-medium">Loading video...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;