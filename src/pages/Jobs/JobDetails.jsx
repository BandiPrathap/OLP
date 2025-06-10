import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  BriefcaseFill,
  GeoAltFill,
  PeopleFill,
  CashStack,
  ClockHistory,
  PencilSquare,
  TrashFill,
  BoxArrowUpRight,
  Building,
  Calendar2Check,
  ChevronLeft
} from 'react-bootstrap-icons';
import { getJobById, deleteJob, updateJob } from '../../api';

const JobEditModal = ({ show, job, onClose, onSave, saving }) => {
  const [form, setForm] = useState(job || {});

  useEffect(() => {
    setForm(job || {});
  }, [job]);

  if (!show) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Edit Job</h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={saving}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input name="title" className="form-control" value={form.title || ''} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <input name="company_name" className="form-control" value={form.company_name || ''} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input name="location" className="form-control" value={form.location || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Job Type</label>
              <input name="job_type" className="form-control" value={form.job_type || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Work Mode</label>
              <input name="mode" className="form-control" value={form.mode || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Openings</label>
              <input name="openings" className="form-control" value={form.openings || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Package</label>
              <input name="package" className="form-control" value={form.package || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Apply Link</label>
              <input name="apply_link" className="form-control" value={form.apply_link || ''} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" value={form.description || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmModal = ({ show, onConfirm, onCancel, loading, message }) => {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button type="button" className="btn-close" onClick={onCancel} disabled={loading}></button>
          </div>
          <div className="modal-body">
            <p>{message || 'Are you sure you want to delete this job?'}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
            <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        setJob(response.data);
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteJob(id);
      toast.success('Job deleted successfully');
      window.location.href = '/jobs';
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  const handleEditSave = async (form) => {
    setSaving(true);
    try {
      const res = await updateJob(id, form);
      setJob(res.data);
      toast.success('Job updated successfully');
      setShowEdit(false);
    } catch (error) {
      toast.error('Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Loading job details...</p>
      </div>
    </div>
  );

  if (!job) return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3">
      <div className="bg-light p-5 rounded-4 shadow-sm w-100" style={{ maxWidth: 400 }}>
        <h1 className="h4 fw-bold text-dark mb-3">Job Not Found</h1>
        <p className="text-muted mb-4">
          The job you're looking for doesn't exist or may have been removed.
        </p>
        <a
          href="/jobs"
          className="d-inline-flex align-items-center text-primary fw-medium"
        >
          <ChevronLeft className="me-1" /> Back to jobs list
        </a>
      </div>
    </div>
  );

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <a
        href="/jobs"
        className="d-inline-flex align-items-center text-primary mb-3 fw-medium"
      >
        <ChevronLeft className="me-1" /> Back to jobs
      </a>

      <div className="bg-white rounded-4 shadow overflow-hidden border">
        {/* Job Header */}
        <div className="bg-primary bg-opacity-10 p-4 border-bottom">
          <div className="row align-items-center">
            <div className="col-md">
              <h1 className="h3 fw-bold text-dark mb-2">{job.title}</h1>
              <div className="d-flex align-items-center mb-2">
                <Building className="text-secondary me-2" />
                <span className="text-muted fw-medium">{job.company_name}</span>
                <span className="mx-2 text-secondary">•</span>
                <GeoAltFill className="text-secondary me-2" />
                <span className="text-muted">{job.location}</span>
              </div>
            </div>
            <div className="col-md-auto d-flex gap-2 mt-3 mt-md-0">
              <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => setShowEdit(true)}
                disabled={saving || deleting}
              >
                <PencilSquare className="me-2" />
                Edit
              </button>
              <button
                onClick={() => setShowDelete(true)}
                disabled={deleting || saving}
                className="btn btn-danger d-flex align-items-center"
              >
                <TrashFill className="me-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-4">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="bg-light rounded-3 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <BriefcaseFill className="text-primary fs-4 me-2" />
                  <h3 className="h6 fw-semibold text-dark mb-0">Job Details</h3>
                </div>
                <div className="mb-2 d-flex">
                  <div className="w-50 text-secondary d-flex align-items-center">
                    <ClockHistory className="me-2" />
                    Job Type
                  </div>
                  <div className="w-50 fw-medium">
                    {job.job_type || 'N/A'}
                  </div>
                </div>
                <div className="mb-2 d-flex">
                  <div className="w-50 text-secondary d-flex align-items-center">
                    <Calendar2Check className="me-2" />
                    Work Mode
                  </div>
                  <div className="w-50 fw-medium">
                    {job.mode || 'N/A'}
                  </div>
                </div>
                <div className="mb-2 d-flex">
                  <div className="w-50 text-secondary d-flex align-items-center">
                    <PeopleFill className="me-2" />
                    Openings
                  </div>
                  <div className="w-50 fw-medium">
                    {job.openings || 'N/A'}
                  </div>
                </div>
                <div className="mb-2 d-flex">
                  <div className="w-50 text-secondary d-flex align-items-center">
                    <CashStack className="me-2" />
                    Package
                  </div>
                  <div className="w-50 fw-medium">
                    {job.package || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-light rounded-3 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <BoxArrowUpRight className="text-primary fs-4 me-2" />
                  <h3 className="h6 fw-semibold text-dark mb-0">Application</h3>
                </div>
                <div className="mb-3">
                  <p className="text-muted mb-1">Apply directly through this link:</p>
                  <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-inline-flex align-items-center text-primary text-break"
                  >
                    {job.apply_link}
                    <BoxArrowUpRight className="ms-1 fs-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="border-top pt-4">
            <h2 className="h5 fw-semibold text-dark mb-3 d-flex align-items-center">
              <BriefcaseFill className="me-2 text-primary" />
              Job Description
            </h2>
            <div className="text-muted">
              {job.description ? (
                <p>{job.description}</p>
              ) : (
                <div className="fst-italic">
                  No description provided for this position.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <JobEditModal
        show={showEdit}
        job={job}
        onClose={() => setShowEdit(false)}
        onSave={handleEditSave}
        saving={saving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDelete}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
        message="Are you sure you want to delete this job?"
      />
    </div>
  );
};

export default JobDetails;
