// src/pages/jobs/JobList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllJobs } from '../../api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchJobs();
  }, []);

  if (loading) return <div className="text-center py-8">Loading jobs...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link 
          to="/jobs/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No jobs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-gray-600">{job.company_name} - {job.location}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm">
                      {job.job_type}
                    </span>
                    <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm">
                      {job.mode}
                    </span>
                  </div>
                </div>
                <Link 
                  to={`/jobs/${job.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;