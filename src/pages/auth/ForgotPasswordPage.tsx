import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Please provide your registered farm email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address format.');
      return;
    }

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccess(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Recover Your Password"
      subtitle="Enter the email address registered with your farm account. We will send you recovery instructions."
    >
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32]">
            <div className="flex items-center gap-2 font-extrabold text-sm mb-1.5">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
              Reset Instructions Dispatched
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{success}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              Enter Reset Password
            </button>
            <Link
              to="/login"
              className="flex-1 py-3 px-4 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
              Farm Registered Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="forgot-password-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. farmer@krishibhoomi.ai"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] text-xs sm:text-sm text-[#37474F] placeholder-gray-400 focus:outline-hidden focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] transition-colors"
              />
            </div>
          </div>

          <button
            id="btn-send-reset-instructions"
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span>Sending Reset Request...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Send Reset Instructions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-4 text-center">
            <Link to="/login" className="text-xs font-bold text-gray-500 hover:text-[#2E7D32]">
              Remembered your password? <span className="text-[#2E7D32] underline">Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
