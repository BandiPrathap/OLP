import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createCourse } from '../../api/courses';
import ModuleForm from './ModuleForm';
import LessonForm from './LessonForm';

const CourseWizard = () => {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const handleCourseSubmit = async (data) => {
    try {
      const res = await createCourse(data);
      setCourse(res.data);
      setStep(2);
      toast.success('Course created! Add modules');
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleModulesSubmit = (newModules) => {
    setModules(newModules);
    setStep(3);
    toast.success('Modules added! Now add lessons');
  };

  const handleLessonsSubmit = () => {
    navigate('/courses');
    toast.success('Course created successfully!');
  };

  return (
    <div className="wizard-container">
      {step === 1 && <CourseForm onSubmit={handleCourseSubmit} />}
      {step === 2 && (
        <ModuleForm 
          courseId={course.id} 
          onSubmit={handleModulesSubmit} 
        />
      )}
      {step === 3 && (
        <LessonForm 
          modules={modules} 
          onSubmit={handleLessonsSubmit} 
        />
      )}
    </div>
  );
};