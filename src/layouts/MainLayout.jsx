// src/layouts/MainLayout.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import DashboardPage from '../pages/DashboardPage';

const MainLayout = ({ children }) => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Portal
        </div>
        <nav className="mt-5 px-2">
          {isAdmin && (
            <>
              <Link 
                to="/courses" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Courses
              </Link>
              <Link 
                to="/jobs" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Jobs
              </Link>
              <Link 
                to="/applications" 
                className="block py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Applications
              </Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left block py-2 px-4 rounded hover:bg-gray-700 transition mt-4"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">
        <DashboardPage/>
      </div>
    </div>
  );
};

export default MainLayout;