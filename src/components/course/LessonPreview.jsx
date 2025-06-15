import React from 'react';
import classNames from 'classnames';

const LessonPreview = ({ modules, lessons, currentModule, highlightLessonId, onSelectLesson }) => {
  lessons = Array.isArray(lessons) ? lessons : [];

  // Filter the lessons for currentModule only, if selected
  const visibleModules = currentModule
    ? modules.filter((m) => m.id === currentModule)
    : modules;

  const moduleWithLessons = visibleModules.map((module) => ({
    ...module,
    lessons: lessons.filter((l) => l.module_id === module.id),
  })).filter((module) => module.lessons.length > 0);

  if (lessons.length === 0 || moduleWithLessons.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header bg-success text-white py-3">
          <h2 className="h4 mb-0 d-flex align-items-center">
            <i className="bi bi-list-task me-2"></i>
            Course Lessons
          </h2>
        </div>
        <div className="card-body d-flex flex-column justify-content-center">
          <div className="text-center py-5">
            <i className="bi bi-folder-x text-muted display-4 mb-3"></i>
            <h3 className="h5 text-muted mb-1">No Lessons Yet</h3>
            <p className="text-muted">Start by adding your first lesson</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-success text-white py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0 d-flex align-items-center">
            <i className="bi bi-list-task me-2"></i>
            Course Lessons
          </h2>
          <span className="badge bg-light text-dark">{lessons.length} lessons</span>
        </div>
      </div>

      <div className="card-body overflow-auto" style={{ maxHeight: '650px' }}>
        {moduleWithLessons.map((module) => (
          <div key={module.id} className="mb-4">
            <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
              <i className="bi bi-folder-fill text-success me-2"></i>
              <h3 className="h5 mb-0 text-truncate">{module.title}</h3>
              <span className="badge bg-success-subtle text-success ms-auto">
                {module.lessons.length} lessons
              </span>
            </div>
            <div className="list-group">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => onSelectLesson?.(lesson)}
                  className={classNames('list-group-item', 'list-group-item-action', {
                    'animate__animated animate__pulse bg-success-subtle': lesson.id === highlightLessonId,
                  })}
                  role="button"
                >
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <span className="badge bg-primary rounded-circle p-2">
                        {lesson.lesson_order}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 text-truncate" title={lesson.title}>
                        {lesson.title}
                      </h6>
                      <div className="d-flex small text-muted mt-1">
                        <span className="me-3 d-flex align-items-center">
                          <i className="bi bi-play-circle me-1"></i>
                          Video
                        </span>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-clock me-1"></i>
                          {lesson.duration || 'N/A'}
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
        ))}
      </div>
    </div>
  );
};

export default LessonPreview;
