// src/pages/courses/components/NavigationButtons.jsx
import React from 'react';

const NavigationButtons = ({
  step,
  handleBack,
  handleModulesComplete,
  setShowFinishModal
}) => (
  <div className="d-flex justify-content-between align-items-center mt-4">
    <button
      onClick={handleBack}
      disabled={step === 1}
      className={`btn btn-outline-secondary px-4 py-2 rounded-pill shadow-sm btn-hover ${step === 1 ? 'invisible' : ''}`}
    >
      <i className="bi bi-arrow-left me-2"></i>
      Back
    </button>

    {step === 2 && (
      <button
        onClick={handleModulesComplete}
        className="btn btn-gradient-primary px-4 py-2 rounded-pill shadow-sm btn-hover"
      >
        Next: Add Lessons
        <i className="bi bi-arrow-right ms-2"></i>
      </button>
    )}

    {step === 3 && (
      <button
        onClick={() => setShowFinishModal(true)}
        className="btn btn-gradient-success px-4 py-2 rounded-pill shadow-sm btn-hover"
      >
        Finish Course Setup
        <i className="bi bi-check-circle ms-2"></i>
      </button>
    )}
  </div>
);

export default NavigationButtons;