// src/pages/ApplicationsPage.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getJobApplications } from '../api';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // For demo, using job ID 1 - in real app, you might have a selector
        const response = await getJobApplications(1);
        setApplications(response.data);
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      // In a real app, you'd have an API endpoint to update status
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-8">Loading applications...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Job Applications</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            ) : (
              applications.map(application => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{application.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{application.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select 
                      value={application.status} 
                      onChange={(e) => updateStatus(application.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="applied">Applied</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsPage;