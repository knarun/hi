import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import RegisterPage from './components/RegisterPage';
import SignUp from './components/SignUp'; // Import SignUp component
import Login from './components/Login';
import YourProject from './components/YourProject';
import AdminPage from './components/AdminPage';
import ProjectDetails from './components/ProjectDetails';
import { ProjectProvider } from './components/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to /login */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> {/* Add signup route */}
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Topbar />
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/register" element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          } />

          <Route path="/yourproject" element={
            <ProtectedRoute>
              <YourProject />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />

          <Route path="/admin/project/:projectId" element={
            <AdminRoute>
              <ProjectDetails />
            </AdminRoute>
          } />
        </Routes>
      </Router>
    </ProjectProvider>
  );
};

export default App;
