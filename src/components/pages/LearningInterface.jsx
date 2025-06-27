import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { generateCertificate } from "@/services/certificateService";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";
import ApperIcon from "@/components/ApperIcon";
import CertificateTemplate from "@/components/molecules/CertificateTemplate";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import QuizInterface from "@/components/molecules/QuizInterface";
import CourseSidebar from "@/components/organisms/CourseSidebar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";

const LearningInterface = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingCertificate, setGeneratingCertificate] = useState(false);
  const certificateRef = useRef();
  useEffect(() => {
    loadCourse();
    loadProgress();
  }, [courseId]);

  useEffect(() => {
    if (course && lessonId) {
      findCurrentLesson();
    }
  }, [course, lessonId]);

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
      // If no progress found, create initial progress
      try {
        const initialProgress = await progressService.create({
          courseId,
          completedLessons: {},
          quizScores: {},
          lastAccessed: new Date().toISOString()
        });
        setProgress(initialProgress);
      } catch (createErr) {
        console.error('Failed to create progress:', createErr);
      }
    }
  };

  const findCurrentLesson = () => {
    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        if (lesson.id === lessonId) {
          setCurrentLesson(lesson);
          return;
        }
      }
    }
  };

  const markLessonComplete = async () => {
    if (!progress || !currentLesson) return;

    try {
      const updatedProgress = {
        ...progress,
        completedLessons: {
          ...progress.completedLessons,
          [currentLesson.id]: true
        },
        lastAccessed: new Date().toISOString()
      };

      await progressService.update(courseId, updatedProgress);
      setProgress(updatedProgress);
      toast.success('Lesson completed!');
    } catch (err) {
      toast.error('Failed to save progress');
    }
  };

  const findNextLesson = () => {
    const allLessons = [];
    course.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        allLessons.push(lesson);
      });
    });

    const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const findPreviousLesson = () => {
    const allLessons = [];
    course.modules?.forEach(module => {
      module.lessons?.forEach(lesson => {
        allLessons.push(lesson);
      });
    });

    const currentIndex = allLessons.findIndex(lesson => lesson.id === lessonId);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const handleNavigation = (lesson) => {
    if (lesson) {
      navigate(`/learn/${courseId}/${lesson.id}`);
    }
  };

  const handleVideoComplete = () => {
    markLessonComplete();
  };

const handleQuizComplete = () => {
    markLessonComplete();
  };
  const calculateProgress = () => {
    if (!course?.modules || !progress) return 0;
    
    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = Object.values(progress.completedLessons || {}).filter(Boolean).length;
    
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const handleDownloadCertificate = async () => {
    const progressPercentage = calculateProgress();
    
    if (progressPercentage < 100) {
      toast.warning('Complete all lessons to download your certificate');
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Loading type="video-player" />
          </div>
          <div className="lg:col-span-1">
            <Loading />
          </div>
        </div>
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

  if (!course || !currentLesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message="Lesson not found" />
      </div>
    );
  }

  const nextLesson = findNextLesson();
  const previousLesson = findPreviousLesson();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Lesson Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-800">
                  {currentLesson.title}
                </h1>
                <p className="text-gray-600 capitalize">
                  {currentLesson.type} • {currentLesson.duration || 10} minutes
                </p>
</div>
              
              <div className="flex items-center gap-2">
                {progress?.completedLessons?.[currentLesson.id] && (
                  <div className="flex items-center gap-1 text-success">
                    <ApperIcon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
                {calculateProgress() === 100 && (
                  <Button
                    onClick={handleDownloadCertificate}
                    loading={generatingCertificate}
                    variant="amber"
                    size="sm"
                    icon="Award"
                  >
                    Certificate
                  </Button>
                )}
              </div>
            </div>
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() => handleNavigation(previousLesson)}
                disabled={!previousLesson}
                variant="outline"
                size="sm"
                icon="ChevronLeft"
              >
                Previous
              </Button>
              
              <Button
                onClick={() => navigate(`/course/${courseId}`)}
                variant="ghost"
                size="sm"
                icon="ArrowLeft"
              >
                Back to Course
              </Button>
              
              <Button
                onClick={() => handleNavigation(nextLesson)}
                disabled={!nextLesson}
                variant="outline"
                size="sm"
                icon="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </motion.div>

          {/* Lesson Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentLesson.type === 'video' ? (
              <VideoPlayer
                lesson={currentLesson}
                onComplete={handleVideoComplete}
              />
            ) : (
              <QuizInterface
                lesson={currentLesson}
                onComplete={handleQuizComplete}
              />
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
<div className="lg:col-span-1">
          <CourseSidebar
            course={course}
            currentLessonId={lessonId}
            progress={progress}
          />
        </div>
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
    </div>
  );
};

export default LearningInterface;