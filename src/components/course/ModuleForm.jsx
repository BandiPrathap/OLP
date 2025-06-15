import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  createModule,
  deleteModule,
  getModulesByCourse
} from '../../api';

const ModuleForm = ({ courseId, modules, setModules }) => {
  const [title, setTitle] = useState('');
  const [moduleOrder, setModuleOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);


  const fetchModules = async () => {
  try {
    console.log('Fetching modules for course:', courseId);
    const res = await getModulesByCourse(courseId);
    console.log('Modules response:', res.data);
    const sorted = res.data.modules.sort((a, b) => a.module_order - b.module_order);
    setModules(sorted);
    setModuleOrder(sorted.length + 1);
  } catch (err) {
    console.error('Error fetching modules:', err.response || err.message || err);
    toast.error('Failed to load modules');
  }
};



  useEffect(() => {
    if (courseId) fetchModules();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newModule = {
      course_id: courseId,
      title: title.trim(),
      module_order: moduleOrder,
    };

    try {
      setLoading(true);
      await createModule(newModule);
      toast.success('Module added successfully');
      setTitle('');
      fetchModules(); // Reload module list
    } catch (err) {
      console.error('Error creating module:', err);
      toast.error('Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteModule(selectedModuleId);
      toast.success('Module deleted successfully');
      fetchModules();
    } catch (err) {
      console.error('Error deleting module:', err);
      toast.error('Failed to delete module');
    } finally {
      setShowConfirmModal(false);
      setSelectedModuleId(null);
    }
  };


  return (
    <div className="container-lg">
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="row g-3">
              <div className="col-md-8">
                <label htmlFor="title" className="form-label">Module Title</label>
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
                <label htmlFor="module_order" className="form-label">Display Order</label>
                <input
                  type="number"
                  id="module_order"
                  value={moduleOrder}
                  onChange={(e) => setModuleOrder(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-control form-control-lg"
                  min="1"
                  required
                />
              </div>

              <div className="col-md-1 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center"
                  disabled={loading}
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </form>

          {/* Module List */}
          <div className="mt-5">
            <h3 className="h4 mb-4 d-flex align-items-center">
              <i className="bi bi-journal-code me-2"></i>
              Course Modules{' '}
              <span className="badge bg-secondary ms-2">{modules.length}</span>
            </h3>

            {modules.length === 0 ? (
              <div className="text-center py-5 border-2 border-dashed rounded-3">
                <i className="bi bi-journal-x display-4 text-muted mb-3"></i>
                <p className="fs-5 text-muted">No modules added yet</p>
                <p className="text-muted">Add your first module using the form above</p>
              </div>
            ) : (
              <div className="list-group">
                {modules.map((module) => (
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
                      style={{ backgroundColor: 'yellow', border: '1px solid red' }}
                      type="button"
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        setShowConfirmModal(true);
                      }}
                      className="btn btn-link text-danger"
                    >
                      Delete
                      <i className="bi bi-trash fs-5"></i>
                    </button>

                  </div>

                ))}
              </div>
            )}
            {showConfirmModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Deletion</h5>
                    <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      Are you sure you want to delete the module{' '}
                      <strong>
                        {
                          modules.find((mod) => mod.id === selectedModuleId)?.title
                        }
                      </strong>
                      ?
                    </p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleForm;
