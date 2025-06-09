// src/api/index.js
import axios from 'axios';

const API = axios.create({
  baseURL: "https://elevateu-khaki.vercel.app/",
});

// const API = axios.create({
//   baseURL: "http://localhost:5000/",
// });

// Request interceptor
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status
      });
    }
    return Promise.reject({ message: 'Network error' });
  }
);

// Auth API
export const login = (credentials) => API.post('/api/auth/login', credentials);
export const forgotPassword = (email) => API.post('/api/auth/forgot-password', { email });
export const verifyOTP = (data) => API.post('/api/auth/verify-reset-otp', data);
export const resetPassword = (data) => API.post('/api/auth/reset-password', data);

// Courses API
export const createCourse = (courseData) => API.post('/api/courses', courseData);
export const updateCourse = (id, courseData) => API.put(`/api/courses/${id}`, courseData);
export const deleteCourse = (id) => API.delete(`/api/courses/${id}`);
export const getAllCourses = () => API.get('/api/courses');

export const getCourseById = (id) => API.get(`/api/courses/${id}`);

// Modules API
export const createModule = (moduleData) => API.post('/api/modules', moduleData);
export const getModulesByCourse = (courseId) => API.get(`/api/modules/course/${courseId}`);
export const getModuleById = (id) => API.get(`/api/modules/${id}`);
export const updateModule = (id, moduleData) => API.put(`/api/modules/${id}`, moduleData);
export const deleteModule = (id) => API.delete(`/api/modules/${id}`); 
// Lessons API
export const createLesson = (lessonData) => API.post('/api/lessons', lessonData);
export const getLessonsByModule = (moduleId) => API.get(`/api/lessons/module/${moduleId}`);
export const getLessonById = (id) => API.get(`/api/lessons/${id}`);
export const updateLesson = (id, lessonData) => API.put(`/api/lessons/${id}`, lessonData);
export const deleteLesson = (id) => API.delete(`/api/lessons/${id}`);

// Jobs API
export const createJob = (jobData) => API.post('/api/jobs', jobData);
export const linkJobToCourse = (jobId, courseId) => API.post(`/api/jobs/${jobId}/map-course`, { course_id: courseId });
export const getAllJobs = () => API.get('/api/jobs');
export const getJobById = (id) => API.get(`/api/jobs/${id}`);
export const getJobsByCourse = (courseId) => API.get(`/api/jobs/course/${courseId}`);
export const getJobApplications = (jobId) => API.get(`/api/jobs/${jobId}/applications`);
export const deleteJob = (id) => API.delete(`/api/jobs/${id}`);


export default API;