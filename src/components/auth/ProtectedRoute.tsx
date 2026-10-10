import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FBF7] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32] animate-pulse shadow-sm mb-4">
          <Sprout className="w-8 h-8 animate-bounce" />
        </div>
        <p className="text-sm font-extrabold text-[#37474F]">Krishibhoomi AI</p>
        <p className="text-xs text-gray-500 mt-1">Verifying farm security credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
