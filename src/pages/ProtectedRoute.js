// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // or your auth logic

  if (!token) {
    // User is not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;
