// src/pages/ApplicationsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import
import { toast } from 'react-toastify';
import {
  PersonCircle,
  Envelope,
  Clock,
  CheckCircle,
  Eye,
  XCircle,
  People,
  ArrowRepeat,
  ThreeDotsVertical,
  ChevronDown
} from 'react-bootstrap-icons';
import { getJobApplications } from '../api';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('1');
  const [statusDropdown, setStatusDropdown] = useState(null);
  const navigate = useNavigate(); // <-- Add this line

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getJobApplications(selectedJob);
        setApplications(response.data);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [selectedJob]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      setApplications(prev => prev.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      toast.success('Status updated');
      setStatusDropdown(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const statusConfig = {
    applied: { color: 'badge bg-primary-subtle text-primary-emphasis', icon: <Clock className="text-primary" /> },
    reviewed: { color: 'badge bg-warning-subtle text-warning-emphasis', icon: <Eye className="text-warning" /> },
    interview: { color: 'badge bg-purple text-white', icon: <People className="text-white" /> },
    rejected: { color: 'badge bg-danger-subtle text-danger-emphasis', icon: <XCircle className="text-danger" /> },
    hired: { color: 'badge bg-success-subtle text-success-emphasis', icon: <CheckCircle className="text-success" /> }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        <p className="mt-4 text-secondary">Loading applications...</p>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <button
            className="btn btn-outline-secondary me-3"
            onClick={() => navigate(-1)}
            type="button"
          >
            Back
          </button>
          <h1 className="h3 fw-bold text-dark d-flex align-items-center mb-0">
            <PersonCircle className="me-2 text-primary" size={28} />
            Job Applications
          </h1>
        </div>
        <div className="d-flex align-items-center mt-3 mt-md-0">
          <span className="me-2 text-secondary">Filter by job:</span>
          <div className="position-relative">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="form-select pe-5"
              style={{ minWidth: 200 }}
            >
              <option value="1">Frontend Developer</option>
              <option value="2">Backend Engineer</option>
              <option value="3">UX Designer</option>
            </select>
            <div className="position-absolute top-50 end-0 translate-middle-y pe-2 text-secondary" style={{ pointerEvents: 'none' }}>
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Candidate</th>
                <th>Contact</th>
                <th>Applied</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <People className="text-secondary mb-3" size={48} />
                      <h3 className="h5 fw-medium text-dark mb-1">No applications found</h3>
                      <p className="text-secondary" style={{ maxWidth: 400 }}>
                        There are no applications for this job yet. Check back later or share the job posting.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map(application => (
                  <tr key={application.id} className="table-row">
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-light border border-dashed rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }} />
                        <div>
                          <div className="fw-medium text-dark">{application.name}</div>
                          <div className="text-secondary small">Software Engineer</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-secondary">
                        <Envelope className="me-2" />
                        <span>{application.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-secondary">
                        <Clock className="me-2" />
                        <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`${statusConfig[application.status].color} d-inline-flex align-items-center px-3 py-1 rounded-pill text-capitalize`}>
                        {statusConfig[application.status].icon}
                        <span className="ms-2">{application.status}</span>
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="dropdown d-inline">
                        <button
                          onClick={() => setStatusDropdown(statusDropdown === application.id ? null : application.id)}
                          className="btn btn-light btn-sm rounded-circle"
                          type="button"
                          aria-expanded={statusDropdown === application.id}
                        >
                          <ThreeDotsVertical />
                        </button>
                        {statusDropdown === application.id && (
                          <div className="dropdown-menu dropdown-menu-end show mt-2" style={{ minWidth: 220 }}>
                            <div className="px-3 py-2 small text-secondary border-bottom">
                              Update status
                            </div>
                            {Object.keys(statusConfig).map(status => (
                              <button
                                key={status}
                                onClick={() => updateStatus(application.id, status)}
                                className="dropdown-item d-flex align-items-center"
                                type="button"
                              >
                                <span className={`rounded-circle me-2`} style={{
                                  width: 12, height: 12,
                                  background:
                                    status === 'applied' ? '#0d6efd' :
                                    status === 'reviewed' ? '#ffc107' :
                                    status === 'interview' ? '#6f42c1' :
                                    status === 'rejected' ? '#dc3545' : '#198754'
                                }}></span>
                                <span className="text-capitalize">{status}</span>
                              </button>
                            ))}
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item d-flex align-items-center text-primary" type="button">
                              <ArrowRepeat className="me-2" />
                              View Full Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {applications.length > 0 && (
          <div className="card-footer d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="small text-secondary mb-3 mb-md-0">
              Showing <span className="fw-medium">1</span> to <span className="fw-medium">{applications.length}</span> of{' '}
              <span className="fw-medium">{applications.length}</span> results
            </div>
            <div>
              <button className="btn btn-outline-secondary btn-sm me-2">
                Previous
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
