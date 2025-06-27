import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { communityService } from '@/services/api/communityService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const DiscussionThread = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadThreadData();
  }, [threadId]);

  const loadThreadData = async () => {
    try {
      setError(null);
      const [discussionData, repliesData] = await Promise.all([
        communityService.getById(threadId),
        communityService.getThreadReplies(threadId)
      ]);
      setDiscussion(discussionData);
      setReplies(repliesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const newReply = await communityService.addReply({
        threadId: parseInt(threadId),
        content: replyContent.trim(),
        author: 'Current User', // In real app, get from auth context
        parentReplyId: replyingTo
      });
      
      setReplies(prev => [...prev, newReply]);
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply posted successfully!');
    } catch (err) {
      toast.error('Failed to post reply: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReply = async (replyId) => {
    if (!editContent.trim()) return;

    try {
      const updatedReply = await communityService.updateReply(replyId, {
        content: editContent.trim()
      });
      
      setReplies(prev => prev.map(reply => 
        reply.Id === replyId ? updatedReply : reply
      ));
      setEditingReply(null);
      setEditContent('');
      toast.success('Reply updated successfully!');
    } catch (err) {
      toast.error('Failed to update reply: ' + err.message);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      await communityService.deleteReply(replyId);
      setReplies(prev => prev.filter(reply => reply.Id !== replyId));
      toast.success('Reply deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete reply: ' + err.message);
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const updatedReply = await communityService.likeReply(replyId);
      setReplies(prev => prev.map(reply => 
        reply.Id === replyId ? updatedReply : reply
      ));
    } catch (err) {
      toast.error('Failed to like reply: ' + err.message);
    }
  };

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

  const getTopLevelReplies = () => {
    return replies.filter(reply => !reply.parentReplyId);
  };

  const getChildReplies = (parentId) => {
    return replies.filter(reply => reply.parentReplyId === parentId);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadThreadData} />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Discussion not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link 
          to="/community"
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          <span>Back to Community</span>
        </Link>
      </motion.div>

      {/* Discussion Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-800">
                {discussion.title}
              </h1>
              <Badge variant={getCategoryColor(discussion.category)} size="md">
                {discussion.category}
              </Badge>
              {discussion.isPinned && (
                <Badge variant="amber" size="md">
                  <ApperIcon name="Pin" size={12} className="mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {discussion.content}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ApperIcon name="User" size={16} />
                <span className="font-medium">{discussion.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="MessageCircle" size={16} />
                <span>{discussion.replies} replies</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Eye" size={16} />
                <span>{discussion.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={16} />
                <span>{getTimeDifference(discussion.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {discussion.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Reply Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <h3 className="text-lg font-display font-bold text-gray-800 mb-4">
          {replyingTo ? 'Reply to comment' : 'Add your reply'}
        </h3>
        
        {replyingTo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Replying to comment</span>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitReply} className="space-y-4">
          <div>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 resize-none"
              rows="4"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {replyContent.length}/1000 characters
            </div>
            <div className="flex items-center gap-3">
              {replyingTo && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !replyContent.trim()}
                icon={submitting ? null : "Send"}
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Replies */}
      <div className="space-y-6">
        {getTopLevelReplies().map((reply, index) => (
          <motion.div
            key={reply.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{reply.author}</h4>
                  <p className="text-sm text-gray-500">{getTimeDifference(reply.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLikeReply(reply.Id)}
                  className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ApperIcon name="Heart" size={14} />
                  <span className="text-sm">{reply.likes}</span>
                </button>
                
                <button
                  onClick={() => setReplyingTo(reply.Id)}
                  className="px-3 py-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                >
                  Reply
                </button>
                
                <button
                  onClick={() => {
                    setEditingReply(reply.Id);
                    setEditContent(reply.content);
                  }}
                  className="px-3 py-1 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-sm"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDeleteReply(reply.Id)}
                  className="px-3 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {editingReply === reply.Id ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 resize-none"
                  rows="3"
                />
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleEditReply(reply.Id)}
                    variant="primary"
                    size="sm"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingReply(null);
                      setEditContent('');
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 leading-relaxed">{reply.content}</p>
            )}
            
            {/* Child Replies */}
            {getChildReplies(reply.Id).length > 0 && (
              <div className="mt-6 pl-8 border-l-2 border-gray-100 space-y-4">
                {getChildReplies(reply.Id).map((childReply) => (
                  <div key={childReply.Id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={16} className="text-white" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-800">{childReply.author}</h5>
                          <p className="text-xs text-gray-500">{getTimeDifference(childReply.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLikeReply(childReply.Id)}
                          className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-primary-600 hover:bg-white rounded transition-colors"
                        >
                          <ApperIcon name="Heart" size={12} />
                          <span className="text-xs">{childReply.likes}</span>
                        </button>
                        
                        <button
                          onClick={() => handleDeleteReply(childReply.Id)}
                          className="px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-white rounded transition-colors text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm leading-relaxed">{childReply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {getTopLevelReplies().length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <ApperIcon name="MessageCircle" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No replies yet</h3>
          <p className="text-gray-400">Be the first to share your thoughts!</p>
        </motion.div>
      )}
    </div>
  );
};

export default DiscussionThread;