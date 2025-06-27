import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import FilterSelect from '@/components/molecules/FilterSelect';

const CourseFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedSubject, 
  onSubjectChange,
  selectedDifficulty,
  onDifficultyChange 
}) => {
  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'programming', label: 'Programming' },
    { value: 'languages', label: 'Languages' },
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'business', label: 'Business' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-6">
          <SearchBar
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses by title, instructor, or subject..."
          />
        </div>
        
        <div className="md:col-span-3">
          <FilterSelect
            label="Subject"
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            options={subjectOptions}
          />
        </div>
        
        <div className="md:col-span-3">
          <FilterSelect
            label="Difficulty"
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            options={difficultyOptions}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CourseFilters;