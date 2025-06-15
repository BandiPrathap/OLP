import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly }) => {
  const { token, isAdmin, loading } = useAuth();

  console.log('ProtectedRoute:', { token, isAdmin, loading });

    if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
