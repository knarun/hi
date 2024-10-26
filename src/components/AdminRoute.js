import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct default import

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decoded = jwtDecode(token); // Updated usage
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime || !decoded.isAdmin) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AdminRoute;
