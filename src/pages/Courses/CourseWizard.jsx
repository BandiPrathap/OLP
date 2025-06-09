// src/pages/courses/CourseWizard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CourseForm from '../../components/course/CourseForm';
import ModuleForm from '../../components/course/ModuleForm';
import LessonForm from '../../components/course/LessonForm';
import { createCourse, createModule, createLesson } from '../../api';


const CourseWizard = () => {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const navigate = useNavigate();

  // Animation direction tracking
  const [direction, setDirection] = useState('forward');
  
  // Step 1: Create course
  const handleCourseSubmit = async (courseData) => {
    try {
      const response = await createCourse(courseData);
      setCourse(response.data);
      setDirection('forward');
      setTimeout(() => setStep(2), 150);
      toast.success('Course created! Now add modules');
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  // Step 2: Add modules
  const handleModuleSubmit = async (moduleData) => {
    try {
      const response = await createModule({
        ...moduleData,
        course_id: course.id
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
    setDirection('forward');
    setTimeout(() => setStep(3), 150);
    toast.info('Now add lessons to your modules');
  };

  // Step 3: Add lessons
  const handleLessonSubmit = async (lessonData) => {
    try {
      const response = await createLesson(lessonData);
      setLessons([...lessons, response.data]);
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
    setDirection('backward');
    setTimeout(() => setStep(step - 1), 150);
  };

  // Progress calculation
  const progress = Math.round(((step - 1) / 2) * 100);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          <i className="bi bi-mortarboard me-2"></i>
          Create New Course
        </h1>
        
        {/* Progress bar */}
        <div className="progress mb-4" style={{ height: '8px' }}>
          <div 
            className="progress-bar bg-success" 
            role="progressbar" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        {/* Stepper */}
        <div className="d-flex justify-content-between position-relative">
          <div className="progress-line position-absolute top-50 start-0 end-0" style={{ height: '2px', zIndex: 0 }}></div>
          
          {[1, 2, 3].map((stepNum) => (
            <div 
              key={stepNum} 
              className={`d-flex flex-column align-items-center z-1 ${step >= stepNum ? 'text-success' : 'text-muted'}`}
            >
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center mb-1 ${
                  step >= stepNum 
                    ? (step === stepNum ? 'bg-primary text-white' : 'bg-success text-white') 
                    : 'bg-light text-muted'
                }`}
                style={{ 
                  width: '40px', 
                  height: '40px',
                  transition: 'all 0.3s ease'
                }}
              >
                {stepNum === 1 && <i className="bi bi-journal-bookmark"></i>}
                {stepNum === 2 && <i className="bi bi-folder"></i>}
                {stepNum === 3 && <i className="bi bi-file-earmark-text"></i>}
              </div>
              <span className="small fw-medium">
                {stepNum === 1 && 'Course Details'}
                {stepNum === 2 && 'Add Modules'}
                {stepNum === 3 && 'Add Lessons'}
              </span>
            </div>
          ))}
        </div>
      </div>


          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              {step === 1 && (
                <CourseForm 
                  onSubmit={handleCourseSubmit} 
                  submitText="Next: Add Modules" 
                />
              )}
              
              {step === 2 && (
                <div>
                  <ModuleForm 
                    courseId={course?.id} 
                    onSubmit={handleModuleSubmit} 
                    modules={modules}
                  />
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <LessonForm 
                    modules={modules} 
                    onSubmit={handleLessonSubmit} 
                    lessons={lessons}
                  />
                </div>
              )}
            </div>
          </div>


      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`btn btn-outline-secondary ${step === 1 ? 'invisible' : ''}`}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
        
        {step === 2 && (
          <button
            onClick={handleModulesComplete}
            className="btn btn-primary"
          >
            Next: Add Lessons
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
        )}
        
        {step === 3 && (
          <button
            onClick={() => setShowFinishModal(true)}
            className="btn btn-success"
          >
            Finish Course Setup
            <i className="bi bi-check-circle ms-2"></i>
          </button>
        )}
      </div>

      {/* Finish Confirmation Modal */}
      {showFinishModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="bi bi-check-circle me-2"></i>
                  Finish Course Setup
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowFinishModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-info-circle text-primary fs-4 me-3"></i>
                  <p className="mb-0">
                    Are you ready to publish your course? You can always add more content later.
                  </p>
                </div>
                <div className="alert alert-light">
                  <p className="mb-1"><strong>Course:</strong> {course?.title}</p>
                  <p className="mb-1"><strong>Modules:</strong> {modules.length}</p>
                  <p className="mb-0"><strong>Lessons:</strong> {lessons.length}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowFinishModal(false)}
                >
                  Continue Editing
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={handleFinish}
                >
                  Publish Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap CSS animations */}
      <style>{`
        .animate__animated {
          --animate-duration: 300ms;
        }
        .progress-line {
          background-color: #e9ecef;
        }
        .card {
          transition: box-shadow 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
      `}</style>
    </div>
  );
};

export default CourseWizard;