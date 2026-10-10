import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Sprout, LogIn, Lock, Mail, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await login({ email, password, rememberMe });
      if (res.success) {
        onClose();
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E0E0E0] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#37474F]">Farmer Sign In</h3>
          <p className="text-xs sm:text-sm text-[#37474F]/70 mt-1">
            Access your soil reports, crop analytics, and AI recommendations
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
              Registered Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm text-[#37474F]"
                placeholder="farmer@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-sm text-[#37474F]"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#37474F]/80 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              Remember Me
            </label>
            <Link
              to="/forgot-password"
              onClick={onClose}
              className="text-[#2E7D32] font-semibold hover:underline cursor-pointer"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? 'Signing In...' : 'Sign In to Farm Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#E0E0E0] text-center">
          <div className="text-xs text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              onClick={onClose}
              className="font-bold text-[#2E7D32] hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
