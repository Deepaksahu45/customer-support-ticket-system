// Aegis — Protected route component with role guard
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aegis-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-aegis-green/30 border-t-aegis-green rounded-full animate-spin" />
          <p className="text-aegis-muted font-body text-sm">Loading Aegis...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
