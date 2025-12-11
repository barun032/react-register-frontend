import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;