import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'doctor' | 'user')[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { userData, loading } = useAuth();

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user data, redirect to login
  if (!userData) {
    return <Navigate to={redirectTo} replace />;
  }

  // If allowedRoles is specified, check if user has the right role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    // Redirect based on user's actual role
    switch (userData.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'doctor':
        return <Navigate to="/doctor-dashboard" replace />;
      case 'user':
        return <Navigate to="/user-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
