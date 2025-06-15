// src/pages/courses/components/WizardHeader.jsx
import React from 'react';

const WizardHeader = () => (
  <div className="mb-8">
    <div className="text-center mb-6">
      <h1 className="display-6 fw-bold mb-3 text-primary d-flex align-items-center justify-content-center gap-2">
        <i className="bi bi-mortarboard fs-1 text-gradient-primary"></i>
        Create New Course
      </h1>
      <p className="text-muted">Step-by-step guide to build your course content</p>
    </div>
  </div>
);

export default WizardHeader;