import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import CourseCatalog from '@/components/pages/CourseCatalog';
import CourseDetail from '@/components/pages/CourseDetail';
import LearningInterface from '@/components/pages/LearningInterface';
import Dashboard from '@/components/pages/Dashboard';
import Community from '@/components/pages/Community';
import DiscussionThread from '@/components/pages/DiscussionThread';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-white to-surface">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-20"
        >
<Routes>
            <Route path="/" element={<CourseCatalog />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/learn/:courseId/:lessonId" element={<LearningInterface />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/thread/:threadId" element={<DiscussionThread />} />
          </Routes>
        </motion.main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;