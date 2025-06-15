import React from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/authe/LoginPage';
import ForgotPasswordPage from './pages/authe/ForgotPasswordPage';
import VerifyOTPPage from './pages/authe/VerifyOTPPage';
import ResetPasswordPage from './pages/authe/ResetPasswordPage';

import DashboardPage from './pages/DashboardPage';
import CourseList from './pages/Courses/CourseList';
import CourseDetail from './pages/Courses/CourseDetails';
import CourseWizard from './pages/Courses/CourseWizard';
import JobList from './pages/Jobs/JobList';
import JobDetail from './pages/Jobs/JobDetails';
import ApplicationsPage from './pages/ApplicationsPage';
import './App.css';
import JobForm from './components/JobForm';
import RazorpayPayment from './RazorpayPayment';



function App() {
  return (
    <AuthProvider className="dashboard">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="payment" element={<RazorpayPayment
          courseId="1"
          amount={99} 
          user={{ name: "Prathap", email: "prathap@example.com" }}
        />
        } />
      

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route>
            <Route path="/" element={<DashboardPage />} />
            
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseWizard />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;
