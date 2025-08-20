import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('about');
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  const handleLoginSuccess = () => {
    setCurrentPage('admin');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'admin':
        return user ? <AdminDashboard /> : <Login onLoginSuccess={handleLoginSuccess} />;
      default:
        return <About />;
    }
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Portfolio. Built with React & Node.js</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;