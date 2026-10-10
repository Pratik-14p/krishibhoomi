import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'New password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errs.password = 'Password must include both letters and numbers.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (!validate()) return;

    try {
      const res = await resetPassword(email, password);
      if (res.success) {
        setSuccess(res.message);
      } else {
        setErrors({ general: res.message });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to update password.' });
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Set a secure new password for your Krishibhoomi farm management account."
    >
      {errors.general && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-6 text-center animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#37474F]">Password Successfully Reset</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">{success}</p>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            Proceed to Farmer Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
              Registered Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="farmer@krishibhoomi.ai"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#37474F] placeholder-gray-400 focus:outline-hidden transition-colors ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reset-new-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                placeholder="Minimum 8 chars with letter & number"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#37474F] placeholder-gray-400 focus:outline-hidden transition-colors ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Repeat new password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#37474F] placeholder-gray-400 focus:outline-hidden transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                    : 'border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            id="btn-submit-reset-password"
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span>Updating Password...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Save New Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 text-center">
            <Link to="/login" className="text-xs font-bold text-gray-500 hover:text-[#2E7D32]">
              Back to <span className="text-[#2E7D32] underline">Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
