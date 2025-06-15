// src/pages/courses/CourseWizard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import WizardHeader from './components/WizardHeader';
import Stepper from './components/Stepper';
import StepContent from './components/StepContent';
import NavigationButtons from './components/NavigationButtons';
import FinishModal from './components/FinishModal';
import { createCourse, createModule, createLesson,getLessonsByModule } from '../../api';

const steps = [
  { label: 'Course Details', icon: 'bi-journal-bookmark' },
  { label: 'Add Modules', icon: 'bi-folder' },
  { label: 'Add Lessons', icon: 'bi-file-earmark-text' },
];

const CourseWizard = () => {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const navigate = useNavigate();

  // Step 1: Create course
  const handleCourseSubmit = async (courseData) => {
    try {
      const response = await createCourse(courseData);
      setCourse(response.data);
      setTimeout(() => setStep(2), 200);
      toast.success('Course created! Now add modules');
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleModuleSubmit = async (moduleData) => {
    try {
      const response = await createModule({
        ...moduleData,
        course_id: course.id,
      });
      setModules([...modules, response.data]);
      toast.success('Module added!');
    } catch (error) {
      toast.error('Failed to add module');
    }
  };


  const handleModulesComplete = () => {
    if (modules.length === 0) {
      toast.warning('Please add at least one module');
      return;
    }
    setTimeout(() => setStep(3), 200);
    toast.info('Now add lessons to your modules');
  };

    const handleLessonSubmit = async (lessonData) => {
      try {
        const response = await createLesson(lessonData);
        const newLesson = response.data;

        // ✅ update global state
        toast.success('Lesson added!');
      } catch (error) {
        toast.error('Failed to add lesson');
      }
    };

  const handleFinish = () => {
    setShowFinishModal(false);
    navigate(`/courses/${course.id}`);
    toast.success('Course created successfully!');
  };

  const handleBack = () => {
    setTimeout(() => setStep(step - 1), 200);
  };

  const progress = Math.round(((step - 1) / (steps.length - 1)) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <WizardHeader />
      
      <Stepper 
        steps={steps} 
        step={step} 
        progress={progress} 
      />
      
      <StepContent 
        step={step}
        steps={steps}
        course={course}
        modules={modules}
        setModules={setModules}
        lessons={lessons}
        setLessons={setLessons}
        handleCourseSubmit={handleCourseSubmit}
        handleModuleSubmit={handleModuleSubmit}
        handleLessonSubmit={handleLessonSubmit}
      />
      
      <NavigationButtons 
        step={step}
        handleBack={handleBack}
        handleModulesComplete={handleModulesComplete}
        setShowFinishModal={setShowFinishModal}
      />
      
      <FinishModal 
        showFinishModal={showFinishModal}
        setShowFinishModal={setShowFinishModal}
        course={course}
        modules={modules}
        lessons={lessons}
        handleFinish={handleFinish}
      />
    </div>
  );
};

export default CourseWizard;