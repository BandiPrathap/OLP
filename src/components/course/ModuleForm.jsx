// src/components/course/ModuleForm.jsx
import { useState } from 'react';

const ModuleForm = ({ courseId, onSubmit, onDelete, modules = [] }) => {
  const [title, setTitle] = useState('');
  const [moduleOrder, setModuleOrder] = useState(modules.length + 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      course_id: courseId,
      title,
      module_order: moduleOrder
    });
    setTitle('');
    setModuleOrder(prev => prev + 1);
  };

  return (
    <div className="container-lg">
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">
          <h2 className="card-title h2 mb-4 pb-2 border-bottom">Manage Course Modules</h2>
          
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="row g-3">
              <div className="col-md-8">
                <label htmlFor="title" className="form-label">
                  Module Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter module name"
                  required
                />
              </div>
              
              <div className="col-md-3">
                <label htmlFor="module_order" className="form-label">
                  Display Order
                </label>
                <input
                  type="number"
                  id="module_order"
                  value={moduleOrder}
                  onChange={(e) => setModuleOrder(parseInt(e.target.value) || 1)}
                  className="form-control form-control-lg"
                  min="1"
                  required
                />
              </div>
              
              <div className="col-md-1 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  Add
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-5">
            <h3 className="h4 mb-4 d-flex align-items-center">
              <i className="bi bi-journal-code me-2"></i>
              Course Modules <span className="badge bg-secondary ms-2">{modules.length}</span>
            </h3>
            
            {modules.length === 0 ? (
              <div className="text-center py-5 border-2 border-dashed rounded-3">
                <i className="bi bi-journal-x display-4 text-muted mb-3"></i>
                <p className="fs-5 text-muted">No modules added yet</p>
                <p className="text-muted">Add your first module using the form above</p>
              </div>
            ) : (
              <div className="list-group">
                {modules.map(module => (
                  <div 
                    key={module.id} 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                  >
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary rounded-circle me-3 p-2">
                        {module.module_order}
                      </span>
                      <span className="fw-medium">{module.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this module? All related content will be permanently removed.')) {
                          onDelete(module.id);
                        }
                      }}
                      className="btn btn-link text-danger p-0"
                      title="Delete module"
                    >
                      <i className="bi bi-trash fs-5"></i>
                      <span className="visually-hidden">Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleForm;