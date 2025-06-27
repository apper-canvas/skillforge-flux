import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import profileService from '@/services/api/profileService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
    Name: '',
    biography: '',
    interests: '',
    skills: '',
    address: '',
    phone: '',
    email: ''
  });

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Try to get all profiles and find current user's profile
        const profiles = await profileService.getAll();
        const userProfile = profiles.find(p => p.user_id === user.userId);
        
        if (userProfile) {
          setProfile(userProfile);
setFormData({
            Name: userProfile.Name || '',
            biography: userProfile.biography || '',
            interests: userProfile.interests || '',
            skills: userProfile.skills || '',
            address: userProfile.address || '',
            phone: userProfile.phone || '',
            email: userProfile.email || ''
          });
        } else {
          // No profile exists for user
          setProfile(null);
setFormData({
            Name: user.firstName || user.emailAddress || '',
            biography: '',
            interests: '',
            skills: '',
            address: '',
            phone: '',
            email: user.emailAddress || ''
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const profileData = {
        ...formData,
        user_id: user.userId,
        Owner: user.userId
      };

      let savedProfile;
      if (profile) {
        // Update existing profile
        savedProfile = await profileService.update(profile.Id, profileData);
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        savedProfile = await profileService.create(profileData);
        toast.success('Profile created successfully!');
      }

      setProfile(savedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
setFormData({
        Name: profile.Name || '',
        biography: profile.biography || '',
        interests: profile.interests || '',
        skills: profile.skills || '',
        address: profile.address || '',
        phone: profile.phone || '',
        email: profile.email || ''
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error && !profile) {
    return (
      <Error 
        message={error} 
        onRetry={() => window.location.reload()}
        type="page"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600">Manage your profile information and preferences</p>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      loading={saving}
                      icon="Save"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    icon="Edit"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <ApperIcon name="AlertCircle" size={16} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="User" size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {formData.Name || user?.firstName || 'User'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {user?.emailAddress || 'No email provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Name Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="User" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Display Name</h3>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) => handleInputChange('Name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your display name"
                  />
                ) : (
                  <p className="text-gray-700">
                    {formData.Name || 'No display name set'}
                  </p>
                )}
              </div>

              {/* Biography Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="FileText" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Biography</h3>
                </div>
                {isEditing ? (
                  <textarea
                    value={formData.biography}
                    onChange={(e) => handleInputChange('biography', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.biography || 'No biography provided'}
                  </p>
                )}
              </div>

              {/* Interests Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="Heart" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
                </div>
                {isEditing ? (
                  <textarea
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="What are you interested in?"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.interests || 'No interests listed'}
                  </p>
                )}
              </div>

              {/* Skills Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="Award" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                </div>
                {isEditing ? (
                  <textarea
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="What skills do you have?"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.skills || 'No skills listed'}
                  </p>
                )}
</div>

              {/* Address Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="MapPin" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                </div>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.address || 'No address provided'}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="Phone" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-700">
                    {formData.phone || 'No phone number provided'}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ApperIcon name="Mail" size={20} className="text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <p className="text-gray-700">
                    {formData.email || 'No email provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;