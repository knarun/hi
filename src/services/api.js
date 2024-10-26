import axios from 'axios';
import { Navigate } from 'react-router-dom'; // Optional: If you plan to use in response interceptor

const API_URL = 'http://localhost:5000/api'; // Ensure this matches your backend

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we receive a 401 Unauthorized, clear the token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login'; // Ensure /login route exists
    }
    return Promise.reject(error);
  }
);

// Signup Function
export const signUpUser = (userData) => api.post('/users/signup', userData);

export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.patch('/users/profile', profileData);

export const registerProject = (formData) => api.post('/projects/register', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const getMyProject = () => api.get('/projects/my-project');
export const updateProject = (projectData) => api.patch('/projects', projectData);

// Admin functions
export const getAllProjects = () => api.get('/projects/all');
export const updateProjectStatus = (id, status) => api.patch(`/projects/${id}/status`, { status });

export const getProjectDetails = (projectId) => api.get(`/projects/${projectId}`);

export default api;
