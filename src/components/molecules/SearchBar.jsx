import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search courses...",
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon="Search"
        className="w-full"
      />
    </motion.div>
  );
};

export default SearchBar;