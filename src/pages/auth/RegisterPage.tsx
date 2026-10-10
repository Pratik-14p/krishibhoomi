import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useI18n } from '../../context/I18nContext';
import { User as UserIcon, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, verifyOtp, isLoading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingOtp, setPendingOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const cleanEmail = email.trim();

    if (!fullName.trim()) errs.fullName = 'Farmer name is required.';
    else if (fullName.trim().length < 2) errs.fullName = 'Please enter a valid farmer name.';

    if (!cleanEmail) errs.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) errs.email = 'Please enter a valid email address.';

    if (!password) errs.password = 'Password is required.';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters long.';
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) errs.password = 'Password must contain both letters and numbers.';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validate()) return;

    try {
      const res = await register({ fullName: fullName.trim(), email: email.trim().toLowerCase(), password });
      if (res.success && res.user) {
        navigate('/dashboard');
      } else if (res.message?.toLowerCase().includes('verification') || res.message?.toLowerCase().includes('code')) {
        setPendingOtp(true);
        setSuccessMessage(res.message);
      } else {
        setErrors({ general: res.message || 'Registration failed. Please try again.' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred during registration.' });
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) return;
    const res = await verifyOtp(email.trim().toLowerCase(), otp);
    if (res.success) navigate('/dashboard');
    else setErrors({ general: res.message || 'Invalid verification code.' });
  };

  const handleResend = async () => {
    const res = await authService.resendOtp(email.trim().toLowerCase());
    if (res.success) setSuccessMessage(res.message);
    else setErrors({ general: res.message });
  };

  return (
    <AuthLayout title={t('auth.registerTitle')} subtitle="Create your farmer account using your name, email and password.">
      {errors.general && (
        <div className="mb-5 p-4 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {pendingOtp && (
        <div className="mb-5 p-5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9]">
          <h3 className="font-bold text-[#1B5E20] mb-2">Verify your email</h3>
          <p className="text-xs text-gray-600 mb-3">Enter the 6-digit code sent to <strong>{email}</strong>. It expires in 10 minutes.</p>
          <input
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors((prev) => ({ ...prev, general: '' })); }}
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="6-digit code"
            className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] text-center text-lg tracking-[0.35em] focus:outline-none focus:border-[#2E7D32]"
          />
          <button type="button" disabled={otp.length !== 6 || isLoading} onClick={handleVerify} className="w-full mt-3 py-3 rounded-xl bg-[#2E7D32] text-white font-bold disabled:opacity-50">
            {isLoading ? 'Verifying…' : 'Verify Email & Create Account'}
          </button>
          <button type="button" onClick={handleResend} className="w-full mt-2 text-xs font-bold text-[#2E7D32]">Resend code</button>
        </div>
      )}

      {!pendingOtp && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">Farmer Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><UserIcon className="w-4 h-4" /></div>
              <input id="register-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" placeholder="e.g. Rajesh Kumar" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] text-sm text-[#37474F] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]" />
            </div>
            {errors.fullName && <p className="mt-1 text-[11px] font-semibold text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">Email Address <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Mail className="w-4 h-4" /></div>
              <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="farmer@gmail.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] text-sm text-[#37474F] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]" />
            </div>
            {errors.email && <p className="mt-1 text-[11px] font-semibold text-red-600">{errors.email}</p>}
            <p className="mt-1.5 text-[11px] text-gray-500">Use an email address you can access. A verification OTP will be sent before the account is activated.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Lock className="w-4 h-4" /></div>
              <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="Minimum 8 characters" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] text-sm text-[#37474F] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]" />
            </div>
            {errors.password && <p className="mt-1 text-[11px] font-semibold text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400"><Lock className="w-4 h-4" /></div>
              <input id="register-confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" placeholder="Re-enter your password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E0E0E0] text-sm text-[#37474F] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]" />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-[11px] font-semibold text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button id="btn-submit-register" type="submit" disabled={isLoading} className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {isLoading ? 'Sending verification code…' : <><ShieldCheck className="w-4 h-4" /><span>Continue & Verify Email</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to="/login" id="link-go-to-login" className="font-extrabold text-[#2E7D32] hover:underline ml-1">{t('nav.login')}</Link>
      </div>
    </AuthLayout>
  );
};
