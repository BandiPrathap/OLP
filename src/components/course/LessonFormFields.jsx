// src/components/course/LessonFormFields.jsx
import React from 'react';

const LessonFormFields = ({
  title,
  setTitle,
  lessonOrder,
  setLessonOrder,
  videoUrl,
  setVideoUrl,
  duration,
  setDuration,
  errors,
  isUploading,
  uploadProgress,
  fileInputRef,
  handleVideoUpload,
  handleSubmit,
  loading
}) => {

  return (
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
             onChange={(e) => {
                const value = parseInt(e.target.value);
                setLessonOrder(isNaN(value) ? '' : value);
                }}
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
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleVideoUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
      
      <div className="mb-3">
        <label className="form-label d-flex align-items-center">
          <i className="bi bi-clock me-2"></i>
          Duration
        </label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-clock"></i>
          </span>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
            placeholder="e.g. 55 mins"
          />
          {errors.duration && (
            <div className="invalid-feedback d-flex align-items-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              {errors.duration}
            </div>
          )}
        </div>
      </div>
      
      <div className="d-grid mt-4">
        <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isUploading || loading} // ✅ disabled if uploading or submitting
            >
            {loading ? (
                <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
                </>
            ) : (
                <>
                <i className="bi bi-plus-circle me-2"></i>
                Add Lesson to Course
                </>
            )}
            </button>

      </div>
    </form>
  );
};

export default LessonFormFields;