// src/components/course/ModuleSelector.jsx
import React from 'react';

const ModuleSelector = ({ modules, currentModule, setCurrentModule, lessons }) => {
  return (
    <div className="mb-4">
      <label className="form-label d-flex align-items-center">
        <i className="bi bi-folder2-open me-2"></i>
        Select Module
      </label>
      <div className="d-flex flex-wrap gap-2">
        {modules.map((module) => {
          const isActive = currentModule === module.id;
          const lessonCount = isActive ? lessons.length : null;

          return (
            <div
              key={module.id}
              onClick={() => setCurrentModule(module.id)}
              className={`card card-hover cursor-pointer ${isActive ? 'border-primary bg-primary-subtle' : ''}`}
              style={{ width: 'calc(50% - 8px)', minWidth: '180px' }}
              role="button"
            >
              <div className="card-body py-2">
                <div className="d-flex align-items-center">
                  <div className={`flex-shrink-0 me-2 ${isActive ? 'text-primary' : 'text-muted'}`}>
                    <i className="bi bi-folder-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className={`card-title mb-0 text-truncate ${isActive ? 'text-primary' : ''}`} title={module.title}>
                      {module.title}
                    </h6>
                    {isActive && (
                      <small className="text-muted d-flex align-items-center">
                        <i className="bi bi-play-circle me-1"></i>
                        {lessonCount} lessons
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ModuleSelector;