import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { courseService } from '@/services/api/courseService';
import { progressService } from '@/services/api/progressService';
import CourseFilters from '@/components/organisms/CourseFilters';
import CourseCard from '@/components/molecules/CourseCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    loadCourses();
    loadProgress();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedSubject, selectedDifficulty]);

  const loadCourses = async () => {
    try {
      setError(null);
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const data = await progressService.getAll();
      const progressMap = {};
      data.forEach(p => {
        progressMap[p.courseId] = p;
      });
      setProgress(progressMap);
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(course => course.subject === selectedSubject);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  };

  const calculateCourseProgress = (course) => {
    const courseProgress = progress[course.id];
    if (!courseProgress) return 0;

    const totalLessons = course.modules?.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
    const completedLessons = Object.values(courseProgress.completedLessons || {}).filter(Boolean).length;

    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const isEnrolled = (courseId) => {
    return !!progress[courseId];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading type="course-grid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error message={error} onRetry={loadCourses} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
          Discover Your Next
          <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {" "}Skill
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from hundreds of courses taught by industry experts and start your learning journey today.
        </p>
      </motion.div>

      {/* Filters */}
      <CourseFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
      />

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          type="courses"
          onAction={() => {
            setSearchTerm('');
            setSelectedSubject('all');
            setSelectedDifficulty('all');
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard
                course={course}
                progress={calculateCourseProgress(course)}
                enrolled={isEnrolled(course.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CourseCatalog;