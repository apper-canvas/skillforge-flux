import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { communityService } from '@/services/api/communityService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';

const NewDiscussion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'help', label: 'Help & Support' },
    { value: 'programming', label: 'Programming' },
    { value: 'languages', label: 'Languages' },
    { value: 'math', label: 'Mathematics' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const discussionData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: 'Current User', // Would come from auth context in real app
        replies: 0,
        views: 0,
        isPinned: false,
        createdAt: new Date().toISOString()
      };
      
      await communityService.create(discussionData);
      toast.success('Discussion created successfully!');
      navigate('/community');
    } catch (error) {
      toast.error('Failed to create discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/community');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            icon="ArrowLeft"
            onClick={handleCancel}
            className="flex-shrink-0"
          >
            Back to Community
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
          Start a New
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {" "}Discussion
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Share your thoughts, ask questions, or start a conversation with the community
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Input
              label="Discussion Title"
              placeholder="Enter a descriptive title for your discussion..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              placeholder="Write your discussion content here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none focus:ring-2 focus:ring-primary-200 ${
                errors.content 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 focus:border-primary-500'
              }`}
              required
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <ApperIcon name="AlertCircle" size={14} />
                {errors.content}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <Input
              label="Tags (Optional)"
              placeholder="Enter tags separated by commas (e.g., javascript, beginner, help)"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              icon="Tag"
            />
            <p className="mt-2 text-sm text-gray-500">
              Add relevant tags to help others find your discussion
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="Send"
              disabled={loading}
              className="sm:flex-1"
            >
              {loading ? <Loading size="sm" /> : 'Create Discussion'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={loading}
              className="sm:flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-blue-50 rounded-xl p-6"
      >
        <div className="flex items-start gap-3">
          <ApperIcon name="Lightbulb" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Tips for a Great Discussion</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Use a clear, descriptive title that summarizes your topic</li>
              <li>• Provide enough context so others can understand and help</li>
              <li>• Choose the most relevant category for better visibility</li>
              <li>• Add tags to help others find your discussion</li>
              <li>• Be respectful and follow community guidelines</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewDiscussion;