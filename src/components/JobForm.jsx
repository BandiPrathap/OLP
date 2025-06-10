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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Job</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Work Mode</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="office">Office</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Number of Openings</label>
          <input
            type="number"
            name="openings"
            min="1"
            value={formData.openings}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Salary Package</label>
        <input
          type="text"
          name="package"
          value={formData.package}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Job Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          className="w-full px-3 py-2 border rounded-md"
          required
        ></textarea>
      </div>
      
      <div className="mt-4">
        <label className="block text-gray-700 mb-2">Apply Link</label>
        <input
          type="url"
          name="apply_link"
          value={formData.apply_link}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;