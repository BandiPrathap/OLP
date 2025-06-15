// src/components/JobForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createJob } from '../api';

const JobForm = ({ initialData = {} }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    company_name: initialData.company_name || '',
    location: initialData.location || '',
    job_type: initialData.job_type || 'full-time',
    mode: initialData.mode || 'office',
    openings: initialData.openings || 1,
    package: initialData.package || '',
    description: initialData.description || '',
    apply_link: initialData.apply_link || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'openings' ? parseInt(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await createJob(formData);
      toast.success('Job created successfully!');
      navigate(`/jobs/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow rounded-4 overflow-hidden">
            <div className="card-header bg-primary bg-gradient text-white py-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-briefcase-fill fs-1 me-3"></i>
                <div>
                  <h1 className="h2 mb-0">Create New Job</h1>
                  <p className="mb-0 opacity-75">Fill in the details to post a new job opportunity</p>
                </div>
              </div>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control"
                        id="jobTitle"
                        placeholder="Job Title"
                        required
                      />
                      <label htmlFor="jobTitle" className="text-muted">
                        <i className="bi bi-card-heading me-2"></i>
                        Job Title
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="form-control"
                        id="companyName"
                        placeholder="Company Name"
                        required
                      />
                      <label htmlFor="companyName" className="text-muted">
                        <i className="bi bi-building me-2"></i>
                        Company Name
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-control"
                        id="location"
                        placeholder="Location"
                        required
                      />
                      <label htmlFor="location" className="text-muted">
                        <i className="bi bi-geo-alt me-2"></i>
                        Location
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="package"
                        value={formData.package}
                        onChange={handleChange}
                        className="form-control"
                        id="salary"
                        placeholder="Salary Package"
                        required
                      />
                      <label htmlFor="salary" className="text-muted">
                        <i className="bi bi-currency-dollar me-2"></i>
                        Salary Package
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        className="form-select"
                        id="jobType"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                      <label htmlFor="jobType" className="text-muted">
                        <i className="bi bi-clock me-2"></i>
                        Job Type
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <select
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                        className="form-select"
                        id="workMode"
                      >
                        <option value="office">Office</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                      <label htmlFor="workMode" className="text-muted">
                        <i className="bi bi-laptop me-2"></i>
                        Work Mode
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="number"
                        name="openings"
                        min="1"
                        value={formData.openings}
                        onChange={handleChange}
                        className="form-control"
                        id="openings"
                        placeholder="Openings"
                        required
                      />
                      <label htmlFor="openings" className="text-muted">
                        <i className="bi bi-people me-2"></i>
                        Number of Openings
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label text-muted">
                    <i className="bi bi-card-text me-2"></i>
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="form-control"
                    id="description"
                    placeholder="Enter detailed job description..."
                    required
                  ></textarea>
                  <div className="form-text">Use markdown for formatting</div>
                </div>
                
                <div className="mb-4">
                  <div className="form-floating">
                    <input
                      type="url"
                      name="apply_link"
                      value={formData.apply_link}
                      onChange={handleChange}
                      className="form-control"
                      id="applyLink"
                      placeholder="Apply Link"
                      required
                    />
                    <label htmlFor="applyLink" className="text-muted">
                      <i className="bi bi-link-45deg me-2"></i>
                      Application Link
                    </label>
                  </div>
                </div>
                
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg btn-gradient-primary py-3"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        <span role="status">Creating Job...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Job Posting
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx>{`
        .card-header {
          border-radius: 0 !important;
        }
        .form-control, .form-select, .form-floating>.form-control, .form-floating>.form-select {
          border-radius: 0.75rem;
          border: 1px solid #dee2e6;
          transition: all 0.3s;
        }
        .form-control:focus, .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          border-color: #86b7fe;
        }
        .form-floating>label {
          padding: 1rem 1.25rem;
          color: #6c757d;
        }
        .btn-gradient-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #3b8cff 100%);
          border: none;
          transition: all 0.3s;
        }
        .btn-gradient-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default JobForm;