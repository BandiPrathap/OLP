// src/pages/courses/components/Stepper.jsx
import React from 'react';

const Stepper = ({ steps, step, progress }) => (
  <div className="mb-8">
    <div className="d-flex justify-content-between align-items-center position-relative mb-3">
      <div 
        className="progress-line position-absolute top-50 start-0 end-0" 
        style={{ 
          height: '4px', 
          zIndex: 0, 
          background: 'linear-gradient(90deg, rgba(13,110,253,0.15) 0%, rgba(25,135,84,0.15) 100%)' 
        }}
      ></div>
      {steps.map((s, idx) => (
        <div
          key={s.label}
          className={`d-flex flex-column align-items-center z-1 position-relative`}
          style={{ minWidth: 100 }}
        >
          {idx > 0 && (
            <div 
              className="position-absolute" 
              style={{
                width: '100%',
                top: '24px',
                left: '-50%',
                height: '4px',
                zIndex: 1,
                background: step > idx ? 'linear-gradient(90deg, #0d6efd 0%, #198754 100%)' : '#e9ecef',
                transition: 'all 0.5s cubic-bezier(.4,2,.6,1)'
              }}
            ></div>
          )}
          
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mb-1 step-circle
              ${step > idx + 1 ? 'bg-gradient-success text-white' : step === idx + 1 ? 'bg-gradient-primary text-white' : 'bg-light text-muted'}
            `}
            style={{
              width: 52,
              height: 52,
              fontSize: 22,
              border: step === idx + 1 ? '3px solid rgba(255,255,255,0.5)' : 'none',
              zIndex: 2,
              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
            }}
          >
            <i className={`bi ${s.icon}`}></i>
          </div>
          <span className={`small fw-semibold ${step >= idx + 1 ? 'text-dark' : 'text-muted'}`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
    
    <div className="d-flex justify-content-end mt-2">
      <span className="badge bg-light text-dark fw-normal">
        <span className="fw-bold">{progress}%</span> Complete
      </span>
    </div>
  </div>
);

export default Stepper;