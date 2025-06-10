import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- import useNavigate
import { toast } from 'react-toastify';
import { getAllJobs, createJob } from '../../api';
import {
  Search, Briefcase, GeoAlt, CurrencyDollar, Funnel,
  X, Clock, Globe, Telephone, Type, PencilSquare
} from 'react-bootstrap-icons';
import { Modal, Button, Form } from 'react-bootstrap';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    mode: '',
    minSalary: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: 'Full-time',
    mode: 'Remote',
    salary: '',
    description: '',
    skills_required: ''
  });

  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getAllJobs();
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique filter options
  const jobTypes = [...new Set(jobs.map(job => job.job_type))];
  const modes = [...new Set(jobs.map(job => job.mode))];

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType = filters.jobType ? job.job_type === filters.jobType : true;
    const matchesMode = filters.mode ? job.mode === filters.mode : true;
    const matchesSalary = filters.minSalary ? job.salary >= parseInt(filters.minSalary) : true;

    return matchesSearch && matchesJobType && matchesMode && matchesSalary;
  });

  const clearFilters = () => {
    setFilters({
      jobType: '',
      mode: '',
      minSalary: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      toast.success('Job posted successfully!');
      setShowModal(false);
      fetchJobs(); // Refresh job list
      // Reset form
      setFormData({
        title: '',
        company_name: '',
        location: '',
        job_type: 'Full-time',
        mode: 'Remote',
        salary: '',
        description: '',
        skills_required: ''
      });
    } catch (error) {
      toast.error('Failed to post job: ' + error.message);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() => navigate("/")} // <-- Go back button
            size="sm"
          >
            &larr; Back
          </Button>
          <h1 className="h2 fw-bold mb-0 d-flex align-items-center">
            <Briefcase className="me-2" />
            Job Listings
          </h1>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center"
        >
          <PencilSquare className="me-2" />
          Post New Job
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <Search />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search jobs, companies, or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="d-flex align-items-center me-2">
                  <Funnel className="me-2" />
                  <strong>Filters:</strong>
                </div>
                <select
                  className="form-select w-auto"
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                >
                  <option value="">All Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  className="form-select w-auto"
                  value={filters.mode}
                  onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                >
                  <option value="">All Modes</option>
                  {modes.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
                <div className="input-group w-auto" style={{ minWidth: 120 }}>
                  <span className="input-group-text">
                    <CurrencyDollar />
                  </span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min Salary"
                    value={filters.minSalary}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                  />
                </div>
                {(filters.jobType || filters.mode || filters.minSalary) && (
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={clearFilters}
                  >
                    <X className="me-1" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <p className="mb-0 text-muted">
          Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> jobs
        </p>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <Briefcase size={64} className="text-muted" />
          </div>
          <h3 className="h5">No jobs found</h3>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h3 className="h5 card-title fw-bold mb-1">{job.title}</h3>
                      <div className="d-flex align-items-center mb-1 flex-wrap">
                        <span className="text-primary fw-medium">{job.company_name}</span>
                        <span className="mx-2 text-muted">•</span>
                        <span className="d-flex align-items-center text-muted">
                          <GeoAlt className="me-1" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <span className="badge bg-primary-subtle text-primary fs-6 align-self-start">
                      ${job.salary}/mo
                    </span>
                  </div>

                  <p className="card-text mb-3" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.8em'
                  }}>
                    {job.description}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-light text-dark border">
                      <Briefcase className="me-1" />
                      {job.job_type}
                    </span>
                    <span className="badge bg-light text-dark border">
                      {job.mode}
                    </span>
                    {job.skills_required && job.skills_required.split(',').map((skill, index) => (
                      <span key={index} className="badge bg-info bg-opacity-10 text-info">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </small>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Post New Job
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Label>
                  <Type className="me-1" />
                  Job Title *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  <Briefcase className="me-1" />
                  Company Name *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  <GeoAlt className="me-1" />
                  Location *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  <CurrencyDollar className="me-1" />
                  Monthly Salary ($) *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                  min={0}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  <Clock className="me-1" />
                  Job Type *
                </Form.Label>
                <Form.Select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </Form.Select>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Label>
                  <Globe className="me-1" />
                  Work Mode *
                </Form.Label>
                <Form.Select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </Form.Select>
              </div>

              <div className="col-12 mb-3">
                <Form.Label>
                  Description *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <Form.Label>
                  <Telephone className="me-1" />
                  Required Skills (comma separated) *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="skills_required"
                  value={formData.skills_required}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, React, Node.js"
                  required
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Job
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default JobList;