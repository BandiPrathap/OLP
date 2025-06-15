// src/pages/courses/components/StepContent.jsx
import React from 'react';
import CourseForm from '../../../components/course/CourseForm';
import ModuleForm from '../../../components/course/ModuleForm';
import LessonForm from '../../../components/course/LessonForm';

const StepContent = ({
  step,
  steps,
  course,
  modules,
  setModules,
  lessons,
  setLessons,
  handleCourseSubmit,
  handleModuleSubmit,
  handleLessonSubmit
}) => (
  <div 
    className="card border-0 shadow-lg mb-4 animate__animated animate__fadeIn" 
    style={{ 
      borderRadius: '16px',
      background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
    }}
  >
    <div className="card-header bg-transparent border-0 pt-4 pb-0">
      <h3 className="fw-bold text-center text-gradient-primary">
        {steps[step-1].label}
        <div 
          className="mx-auto mt-2" 
          style={{ 
            width: '60px', 
            height: '4px', 
            background: 'linear-gradient(90deg, #0d6efd 0%, #198754 100%)',
            borderRadius: '10px'
          }}
        ></div>
      </h3>
    </div>
    <div className="card-body p-4 p-lg-5">
      {step === 1 && (
        <CourseForm
          onSubmit={handleCourseSubmit}
          submitText="Next: Add Modules"
        />
      )}

      {step === 2 && (
        <ModuleForm
          courseId={course?.id}
          setModules={setModules}
          modules={modules}
        />
      )}

      {step === 3 && (
        <LessonForm
            modules={modules}
            onSubmit={handleLessonSubmit}
            setLessons={setLessons}
            lessons={Array.isArray(lessons) ? lessons : []}  // ✅ defensive fix
        />
        )}

      {/* {step === 3 && <p className="text-muted">Current Step: {step}</p> */}

    </div>
  </div>
);

export default StepContent;