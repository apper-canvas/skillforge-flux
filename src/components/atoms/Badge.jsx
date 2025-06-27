import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    error: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    beginner: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    intermediate: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    advanced: "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  const classes = `inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;