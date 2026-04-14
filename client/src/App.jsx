// Aegis — Main application with routing and layout
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import AdminPanel from './pages/AdminPanel';
import Pricing from './pages/Pricing';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-aegis-dark bg-aegis-glow">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onClose={() => setSidebarOpen(false)}
      />
      <motion.main
        animate={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
            ? sidebarCollapsed ? 64 : 240
            : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="pt-16 min-h-screen"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aegis-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-aegis-green/30 border-t-aegis-green rounded-full animate-spin" />
          <p className="text-aegis-muted font-body text-sm">Loading Aegis...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TicketList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TicketDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AppLayout>
              <AdminPanel />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-aegis-dark bg-aegis-glow">
            <div className="text-center">
              <h1 className="text-6xl font-brand font-bold text-aegis-green mb-4">404</h1>
              <p className="text-aegis-muted mb-6">Page not found</p>
              <a href="/dashboard" className="aegis-btn">Go to Dashboard</a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
