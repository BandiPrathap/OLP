// src/components/course/LessonForm.jsx
import { useState, useEffect } from 'react';

const LessonForm = ({ modules, onSubmit, lessons = [] }) => {
  const [currentModule, setCurrentModule] = useState(modules[0]?.id || '');
  const [title, setTitle] = useState('');
  const [lessonOrder, setLessonOrder] = useState(1);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [newLessonAdded, setNewLessonAdded] = useState(null);

  // Calculate next lesson order
  useEffect(() => {
    const moduleLessons = lessons.filter(l => l.module_id === currentModule);
    setLessonOrder(moduleLessons.length > 0 ? Math.max(...moduleLessons.map(l => l.lesson_order)) + 1 : 1);
  }, [currentModule, lessons]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Lesson title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!lessonOrder || lessonOrder < 1) {
      newErrors.lessonOrder = 'Lesson order must be at least 1';
    }
    
    if (!videoUrl) {
      newErrors.video = 'Please upload a video';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentModule || !validateForm()) return;
    
    const lessonData = {
      module_id: currentModule,
      title,
      video_url: videoUrl,
      lesson_order: lessonOrder
    };
    
    onSubmit(lessonData);
    
    // Animation effect for new lesson
    setNewLessonAdded(lessonData);
    setTimeout(() => {
      setTitle('');
      setVideoUrl('');
      setNewLessonAdded(null);
    }, 2000);
  };

  const handleVideoUpload = () => {
    if (!currentModule) {
      alert('Please select a module first');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          const fakeVideoUrl = "https://example.com/video.mp4";
          setVideoUrl(fakeVideoUrl);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getModuleLessonCount = (moduleId) => {
    return lessons.filter(lesson => lesson.module_id === moduleId).length;
  };

  const getModuleTitle = (moduleId) => {
    return modules.find(m => m.id === moduleId)?.title || '';
  };

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* Left Column - Module Selection and Form */}
        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h4 mb-0 d-flex align-items-center">
                <i className="bi bi-film me-2"></i>
                Create New Lesson
              </h2>
            </div>
            
            <div className="card-body">
              <div className="mb-4">
                <label className="form-label d-flex align-items-center">
                  <i className="bi bi-folder2-open me-2"></i>
                  Select Module
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {modules.map(module => (
                    <div 
                      key={module.id}
                      onClick={() => setCurrentModule(module.id)}
                      className={`card card-hover cursor-pointer ${currentModule === module.id ? 'border-primary bg-primary-subtle' : ''}`}
                      style={{ width: 'calc(50% - 8px)', minWidth: '180px' }}
                    >
                      <div className="card-body py-2">
                        <div className="d-flex align-items-center">
                          <div className={`flex-shrink-0 me-2 ${currentModule === module.id ? 'text-primary' : 'text-muted'}`}>
                            <i className="bi bi-folder-fill fs-5"></i>
                          </div>
                          <div>
                            <h6 className={`card-title mb-0 ${currentModule === module.id ? 'text-primary' : ''}`}>
                              {module.title}
                            </h6>
                            <small className="text-muted d-flex align-items-center">
                              <i className="bi bi-play-circle me-1"></i>
                              {getModuleLessonCount(module.id)} lessons
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentModule && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center">
                      <i className="bi bi-card-heading me-2"></i>
                      Lesson Title
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-pencil"></i>
                      </span>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        placeholder="Introduction to React Hooks"
                      />
                      {errors.title && (
                        <div className="invalid-feedback d-flex align-items-center">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          {errors.title}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-sort-numeric-down me-2"></i>
                        Order in Module
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-list-ol"></i>
                        </span>
                        <input
                          type="number"
                          value={lessonOrder}
                          onChange={(e) => setLessonOrder(parseInt(e.target.value) || 1)}
                          className={`form-control ${errors.lessonOrder ? 'is-invalid' : ''}`}
                          min="1"
                        />
                        {errors.lessonOrder && (
                          <div className="invalid-feedback d-flex align-items-center">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            {errors.lessonOrder}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <i className="bi bi-camera-video me-2"></i>
                        Video Content
                      </label>
                      <button
                        type="button"
                        onClick={handleVideoUpload}
                        disabled={isUploading || !!videoUrl}
                        className={`btn w-100 ${videoUrl 
                          ? 'btn-success' 
                          : isUploading 
                            ? 'btn-primary' 
                            : 'btn-outline-primary'}`}
                      >
                        {isUploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Uploading... {uploadProgress}%
                          </>
                        ) : videoUrl ? (
                          <>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Video Ready
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cloud-arrow-up me-2"></i>
                            Upload Video
                          </>
                        )}
                      </button>
                      {errors.video && (
                        <div className="text-danger mt-1 d-flex align-items-center">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          {errors.video}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {videoUrl && (
                    <div className="mb-4 border rounded p-2">
                      <div className="ratio ratio-16x9 bg-dark rounded">
                        <video controls className="w-100">
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="mt-2 text-end">
                        <button 
                          type="button" 
                          onClick={() => setVideoUrl('')}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove Video
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="d-grid mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isUploading}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Lesson to Course
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Lessons Preview */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0 d-flex align-items-center">
                  <i className="bi bi-list-task me-2"></i>
                  Course Lessons
                </h2>
                <span className="badge bg-light text-dark">
                  {lessons.length} lessons
                </span>
              </div>
            </div>
            
            <div className="card-body overflow-auto" style={{ maxHeight: '650px' }}>
              {lessons.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-folder-x text-muted display-4"></i>
                  </div>
                  <h3 className="h5 text-muted mb-1">No Lessons Yet</h3>
                  <p className="text-muted">Start by adding your first lesson</p>
                </div>
              ) : (
                <div>
                  {modules.map(module => {
                    const moduleLessons = lessons.filter(l => l.module_id === module.id);
                    return moduleLessons.length > 0 && (
                      <div key={module.id} className="mb-4">
                        <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                          <i className="bi bi-folder-fill text-success me-2"></i>
                          <h3 className="h5 mb-0 text-truncate">{module.title}</h3>
                          <span className="badge bg-success-subtle text-success ms-auto">
                            {moduleLessons.length} lessons
                          </span>
                        </div>
                        
                        <div className="list-group">
                          {moduleLessons.map(lesson => (
                            <div 
                              key={lesson.id}
                              className={`list-group-item list-group-item-action ${
                                newLessonAdded?.title === lesson.title ? 'animate__animated animate__pulse bg-success-subtle' : ''
                              }`}
                            >
                              <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                  <span className="badge bg-primary rounded-circle p-2">
                                    {lesson.lesson_order}
                                  </span>
                                </div>
                                
                                <div className="flex-grow-1">
                                  <h6 className="mb-0">{lesson.title}</h6>
                                  <div className="d-flex small text-muted mt-1">
                                    <span className="me-3 d-flex align-items-center">
                                      <i className="bi bi-play-circle me-1"></i>
                                      Video
                                    </span>
                                    <span className="d-flex align-items-center">
                                      <i className="bi bi-clock me-1"></i>
                                      8:45 min
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex-shrink-0">
                                  <i className="bi bi-play-btn fs-4 text-success"></i>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom hover effect */}
      <style jsx>{`
        .card-hover {
          transition: all 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default LessonForm;