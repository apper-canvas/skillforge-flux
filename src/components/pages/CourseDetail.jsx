import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { generateCertificate } from "@/services/certificateService";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";
import { enrollmentService } from "@/services/api/enrollmentService";
import ApperIcon from "@/components/ApperIcon";
import CertificateTemplate from "@/components/molecules/CertificateTemplate";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ProgressRing from "@/components/atoms/ProgressRing";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const CourseDetail = () => {
  const { courseId } = useParams();
const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [enrolling, setEnrolling] = useState(false);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    course: courseId,
    user: '',
    enrollmentdate: new Date().toISOString().split('T')[0]
  });
  const certificateRef = useRef();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    loadCourse();
    loadProgress();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setError(null);
      const data = await courseService.getById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await progressService.getById(courseId);
      setProgress(data);
    } catch (err) {
      // Progress not found is expected for non-enrolled courses
      console.log('No progress found for course:', courseId);
    }
  };

const handleEnroll = () => {
    setShowEnrollmentForm(true);
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!enrollmentData.user) {
      toast.error('Please select a user');
      return;
    }

    try {
      setEnrolling(true);
      
      // Create enrollment record
      await enrollmentService.create({
        course: courseId,
        user: enrollmentData.user,
        enrollmentdate: enrollmentData.enrollmentdate,
        name: `${course?.title || 'Course'} - Enrollment`
      });

      // Create progress record
      await progressService.create({
        courseId,
        completedLessons: {},
        quizScores: {},
        lastAccessed: new Date().toISOString()
      });
      
      toast.success('Successfully enrolled in course!');
      setShowEnrollmentForm(false);
      loadProgress();
      
      // Navigate to first lesson
      if (course.modules?.[0]?.lessons?.[0]) {
        navigate(`/learn/${courseId}/${course.modules[0].lessons[0].id}`);
      }
    } catch (err) {
      toast.error('Failed to enroll in course');
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleFormChange = (field, value) => {
    setEnrollmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    // Find the next uncompleted lesson
    let nextLesson = null;
    
    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        if (!progress?.completedLessons?.[lesson.id]) {
          nextLesson = lesson;
          break;
        }
      }
      if (nextLesson) break;
    }
    
    // If no uncompleted lesson, go to first lesson
    if (!nextLesson && course.modules?.[0]?.lessons?.[0]) {
      nextLesson = course.modules[0].lessons[0];
    }
    
    if (nextLesson) {
      navigate(`/learn/${courseId}/${nextLesson.id}`);
    }
  };

  const calculateProgress = () => {
    if (!course?.modules || !progress) return 0;
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = Object.values(progress.completedLessons || {}).filter(Boolean).length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
case 'advanced': return 'advanced';
      default: return 'default';
    }
  };
const handleDownloadCertificate = async () => {
    if (progressPercentage < 100) {
      toast.warning('Complete the course to download your certificate');
      return;
    }

    try {
      setGeneratingCertificate(true);
      await generateCertificate(certificateRef, course);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to generate certificate');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="course-detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCourse} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Course not found" />
      </div>
    );
  }

  const isEnrolled = !!progress;
  const progressPercentage = calculateProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={getDifficultyColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
              <Badge variant="secondary">
                {course.subject}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-800 mb-4">
              {course.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {course.description || `Master ${course.subject} with comprehensive lessons and hands-on practice. Perfect for ${course.difficulty.toLowerCase()} learners.`}
            </p>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <ApperIcon name="User" size={18} className="text-gray-500" />
                <span className="text-gray-700">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Clock" size={18} className="text-gray-500" />
                <span className="text-gray-700">{course.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="BookOpen" size={18} className="text-gray-500" />
                <span className="text-gray-700">{course.modules?.length || 0} modules</span>
              </div>
            </div>
            
<div className="flex items-center gap-4">
              {isEnrolled ? (
                <>
                  <Button
                    onClick={handleContinue}
                    variant="primary"
                    size="lg"
                    icon="Play"
                  >
                    Continue Learning
                  </Button>
                  {progressPercentage === 100 && (
                    <Button
                      onClick={handleDownloadCertificate}
                      loading={generatingCertificate}
                      variant="amber"
                      size="lg"
                      icon="Award"
                    >
                      Download Certificate
                    </Button>
                  )}
                  <div className="flex items-center gap-3">
                    <ProgressRing progress={progressPercentage} size={60} strokeWidth={6} />
                    <div>
                      <p className="text-sm text-gray-600">Your Progress</p>
                      <p className="text-sm font-medium text-gray-800">
                        {Math.round(progressPercentage)}% Complete
                      </p>
                      {progressPercentage === 100 && (
                        <p className="text-xs text-amber-600 font-medium">
                          🎉 Course Completed!
                        </p>
                      )}
                    </div>
                  </div>
                </>
) : (
                <Button
                  onClick={handleEnroll}
                  variant="primary"
                  size="lg"
                  icon="Plus"
                >
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="Play" size={64} className="text-white opacity-80" />
            </div>
            {isEnrolled && (
              <div className="absolute top-4 right-4">
                <Badge variant="success" size="sm">
                  <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                  Enrolled
                </Badge>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Curriculum */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
            Course Curriculum
          </h2>
          
          <div className="space-y-4">
            {course.modules?.map((module, moduleIndex) => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-2">
                    <ApperIcon name="BookOpen" size={16} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {module.lessons?.length || 0} lessons
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 ml-11">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div key={lesson.id} className="flex items-center gap-2 text-sm">
                      <ApperIcon
                        name={lesson.type === 'video' ? 'Play' : 'HelpCircle'}
                        size={14}
                        className="text-gray-400"
                      />
                      <span className="text-gray-700">
                        {lessonIndex + 1}. {lesson.title}
                      </span>
                      {lesson.duration && (
                        <span className="text-gray-400 ml-auto">
                          {lesson.duration}min
                        </span>
                      )}
                      {isEnrolled && progress?.completedLessons?.[lesson.id] && (
                        <ApperIcon name="CheckCircle" size={14} className="text-success" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Course Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Instructor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-display font-bold text-gray-800 mb-4">
              Your Instructor
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{course.instructor}</h4>
                <p className="text-sm text-gray-600">Subject Expert</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon key={i} name="Star" size={12} className="text-amber-400 fill-current" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4.8 rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-display font-bold text-gray-800 mb-4">
              What You'll Learn
            </h3>
            <div className="space-y-3">
              {[
                'Master the fundamentals and advanced concepts',
                'Hands-on practice with real-world projects',
                'Interactive quizzes and assessments',
                'Certificate of completion',
                'Lifetime access to course materials'
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
</motion.div>
      </div>

      {/* Hidden Certificate Template */}
      <div className="absolute -left-[9999px] -top-[9999px]">
        <CertificateTemplate
          ref={certificateRef}
          course={course}
          completionDate={progress?.lastAccessed || new Date().toISOString()}
          studentName="Student"
/>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Enroll in Course</h3>
              <button
                onClick={() => setShowEnrollmentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleEnrollmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  value={course?.title || 'Loading...'}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500"
                />
              </div>

              <Input
                label="User ID"
                type="number"
                placeholder="Enter user ID"
                value={enrollmentData.user}
                onChange={(e) => handleFormChange('user', e.target.value)}
                icon="User"
                required
              />

              <Input
                label="Enrollment Date"
                type="date"
                value={enrollmentData.enrollmentdate}
                onChange={(e) => handleFormChange('enrollmentdate', e.target.value)}
                icon="Calendar"
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowEnrollmentForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={enrolling}
                  variant="primary"
                  className="flex-1"
                >
                  Enroll Now
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;