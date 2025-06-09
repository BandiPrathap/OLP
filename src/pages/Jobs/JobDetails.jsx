// src/pages/jobs/JobDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getJobById, deleteJob } from '../../api';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted successfully');
        // Redirect to jobs list
        window.location.href = '/jobs';
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading job details...</div>;
  if (!job) return <div className="text-center py-8">Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-gray-600">
              {job.company_name} • {job.location}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold">Job Type</h3>
            <p>{job.job_type}</p>
          </div>
          <div>
            <h3 className="font-semibold">Work Mode</h3>
            <p>{job.mode}</p>
          </div>
          <div>
            <h3 className="font-semibold">Openings</h3>
            <p>{job.openings}</p>
          </div>
          <div>
            <h3 className="font-semibold">Package</h3>
            <p>{job.package}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{job.description}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Apply Link</h2>
          <a 
            href={job.apply_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {job.apply_link}
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;