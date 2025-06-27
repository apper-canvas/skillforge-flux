import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { communityService } from '@/services/api/communityService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const Community = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      setError(null);
      const data = await communityService.getAll();
      setDiscussions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTimeDifference = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general': return 'default';
      case 'help': return 'warning';
      case 'programming': return 'primary';
      case 'languages': return 'secondary';
      case 'math': return 'success';
      default: return 'default';
    }
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
        <Error message={error} onRetry={loadDiscussions} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          Community
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {" "}Forums
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with fellow learners, ask questions, and share your knowledge
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="help">Help & Support</option>
              <option value="programming">Programming</option>
              <option value="languages">Languages</option>
              <option value="math">Mathematics</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Discussions */}
      {filteredDiscussions.length === 0 ? (
        <Empty
          type="community"
          onAction={() => setSearchTerm('')}
        />
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion, index) => (
            <motion.div
              key={discussion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
            >
<div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 
                      className="text-lg font-display font-bold text-gray-800 hover:text-primary-600 cursor-pointer transition-colors duration-200"
                      onClick={() => navigate(`/community/thread/${discussion.Id}`)}
                    >
                      {discussion.title}
                    </h3>
                    <Badge variant={getCategoryColor(discussion.category)} size="sm">
                      {discussion.category}
                    </Badge>
                    {discussion.isPinned && (
                      <Badge variant="amber" size="sm">
                        <ApperIcon name="Pin" size={10} className="mr-1" />
                        Pinned
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {discussion.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="User" size={14} />
                      <span>{discussion.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="MessageCircle" size={14} />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Eye" size={14} />
                      <span>{discussion.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      <span>{getTimeDifference(discussion.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <ApperIcon name="Heart" size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <ApperIcon name="Share" size={16} />
                  </button>
                </div>
              </div>
              
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {discussion.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          variant="primary"
          size="lg"
          icon="Plus"
          className="rounded-full shadow-2xl hover:shadow-3xl"
        >
          New Discussion
        </Button>
      </motion.div>
    </div>
  );
};

export default Community;