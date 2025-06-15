// src/pages/courses/components/FinishModal.jsx
import React from 'react';

const FinishModal = ({
  showFinishModal,
  setShowFinishModal,
  course,
  modules,
  lessons,
  handleFinish
}) => {
  if (!showFinishModal) return null;
  console.log(lessons,lessons.length,modules,modules.length,course,course.title);
  
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
          <div className="modal-header bg-gradient-success text-white py-4">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              Finish Course Setup
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowFinishModal(false)}
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="d-flex align-items-start mb-4">
              <i className="bi bi-info-circle-fill text-primary fs-4 me-3 mt-1"></i>
              <p className="mb-0">
                Are you ready to publish your course? You can always add more content later.
              </p>
            </div>
            <div className="alert bg-light rounded-3 border-start border-4 border-success">
              <div className="d-flex">
                <i className="bi bi-journal-bookmark fs-4 text-success me-3"></i>
                <div>
                  <p className="mb-1 fw-bold">{course?.title}</p>
                  <div className="d-flex text-muted small">
                    <span className="me-3">
                      <i className="bi bi-folder me-1"></i> 
                      {modules.length} module{modules.length !== 1 ? 's' : ''}
                    </span>
                    <span>
                      <i className="bi bi-file-earmark-text me-1"></i> 
                      {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 bg-light rounded-bottom-4 p-3">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4 btn-hover"
              onClick={() => setShowFinishModal(false)}
            >
              Continue Editing
            </button>
            <button
              type="button"
              className="btn btn-success rounded-pill px-4 btn-hover"
              onClick={handleFinish}
            >
              Publish Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinishModal;