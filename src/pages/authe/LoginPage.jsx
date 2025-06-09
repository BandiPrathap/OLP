// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../api';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(credentials);
      console.log(authLogin(response.data.token));
      
      toast.success('Login successful');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center mt-3">
            <Link to="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
