import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const CertificateTemplate = forwardRef(({ course, completionDate, studentName = "Student" }, ref) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      ref={ref}
      className="bg-white w-[800px] h-[600px] p-12 relative overflow-hidden"
      style={{ fontFamily: 'serif' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100 to-purple-100"></div>
        <div className="absolute top-8 left-8">
          <ApperIcon name="Award" size={200} className="text-blue-200" />
        </div>
        <div className="absolute bottom-8 right-8">
          <ApperIcon name="Star" size={150} className="text-purple-200" />
        </div>
      </div>

      {/* Border */}
      <div className="absolute inset-4 border-4 border-blue-600 rounded-lg"></div>
      <div className="absolute inset-6 border-2 border-blue-300 rounded-lg"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            CERTIFICATE OF COMPLETION
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            This is to certify that
          </p>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2 inline-block">
            {studentName}
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            has successfully completed the course
          </p>
          
          <h3 className="text-2xl font-bold text-blue-700 mb-6">
            {course.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-8 text-sm text-gray-600 mb-6">
            <div>
              <p className="font-semibold">Subject:</p>
              <p>{course.subject}</p>
            </div>
            <div>
              <p className="font-semibold">Difficulty Level:</p>
              <p className="capitalize">{course.difficulty}</p>
            </div>
            <div>
              <p className="font-semibold">Duration:</p>
              <p>{course.duration} hours</p>
            </div>
            <div>
              <p className="font-semibold">Modules:</p>
              <p>{course.modules?.length || 0} modules</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex justify-between items-end w-full max-w-md">
            <div className="text-center">
              <div className="w-32 border-t-2 border-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Date of Completion</p>
              <p className="font-semibold text-gray-800">{formatDate(completionDate)}</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 border-t-2 border-gray-400 mb-2"></div>
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="font-semibold text-gray-800">{course.instructor}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-6 text-blue-600">
            <ApperIcon name="Award" size={24} className="mr-2" />
            <span className="font-bold text-lg">SkillForge Academy</span>
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;