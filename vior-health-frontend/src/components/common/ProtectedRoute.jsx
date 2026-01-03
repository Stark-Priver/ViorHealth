import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Access Denied</h1>
          <p className="text-neutral-600 mb-6">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-neutral-500">
            Your role: <span className="font-semibold">{user?.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
