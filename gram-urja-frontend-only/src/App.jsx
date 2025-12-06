import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddVillagePage from './pages/AddVillagePage';
import AnalysisPage from './pages/AnalysisPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    const savedVillages = localStorage.getItem('villages');
    if (savedVillages) setVillages(JSON.parse(savedVillages));
    setLoading(false);
  }, []);

  const addVillage = (village) => {
    const newVillages = [...villages, { ...village, id: Date.now() }];
    setVillages(newVillages);
    localStorage.setItem('villages', JSON.stringify(newVillages));
  };

  if (loading) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'#fff'}}>Loading...</div>;

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DashboardPage villages={villages} /></ProtectedRoute>} />
        <Route path="/add-village" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AddVillagePage addVillage={addVillage} /></ProtectedRoute>} />
        <Route path="/analysis/:villageId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AnalysisPage villages={villages} /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ReportsPage villages={villages} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </Router>
  );
}

export default App;
