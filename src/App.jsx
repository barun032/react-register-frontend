// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { useRegister } from './context/RegisterContext';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { currentUser } = useRegister();

  if (!currentUser) {
    // If not logged in, go to Login Page
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    alert("Access Denied: Admins only.");
    // If logged in but not admin, go back to Home
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* 1. Public Route: Login Page */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 2. Protected Route: Home Page (Register Page) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <RegisterPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 3. Protected Route: Admin Dashboard */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all: Redirect unknown paths to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;