import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly }) => {
  const { token, isAdmin, loading } = useAuth();

  console.log('ProtectedRoute:', { token, isAdmin, loading });

  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
