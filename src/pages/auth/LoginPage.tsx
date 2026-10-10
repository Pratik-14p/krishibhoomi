import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useI18n } from '../../context/I18nContext';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff, Chrome } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, verifyOtp, isLoading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);
  const [pendingOtp, setPendingOtp] = useState(false);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('logged_out') === 'true' || (location.state as any)?.logged_out) {
      setLogoutNotice('You have been signed out successfully. Enter your farmer credentials to log in again.');
    }
  }, [location]);


  const handleGoogleLogin = () => {
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    const google = (window as any).google;
    if (!clientId || !google?.accounts?.id) { setErrors({general:'Google login is not configured yet. Add VITE_GOOGLE_CLIENT_ID to .env.local.'}); return; }
    google.accounts.id.initialize({client_id:clientId,callback:async (response:any)=>{const r=await authService.loginWithGoogleCredential(response.credential);if(r.pendingOtp){setEmail(r.email||'');setPendingOtp(true);setSuccessMessage(r.message||'A verification code was sent to your Gmail.')}else setErrors({general:r.message||'Google login failed.'});}});
    google.accounts.id.prompt();
  };
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) return;

    try {
      const res = await login({ email, password, rememberMe });
      if (res.success) {
        setSuccessMessage('Login successful! Redirecting to your farm dashboard...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 600);
      } else if (res.message?.toLowerCase().includes('verification code') || res.message?.toLowerCase().includes('verify')) {
        setPendingOtp(true);
        setSuccessMessage(res.message);
      } else {
        setErrors({ general: res.message || 'Login failed. Please verify credentials.' });
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred during login.' });
    }
  };

  return (
    <AuthLayout
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
    >
      {/* Logout Notice Banner */}
      {logoutNotice && !errors.general && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#2E7D32]" />
          <span>{logoutNotice}</span>
        </div>
      )}

      {/* General Error Banner */}
      {errors.general && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <button type="button" onClick={handleGoogleLogin} className="w-full mb-4 py-3.5 px-4 rounded-xl border border-[#E0E0E0] bg-white hover:bg-gray-50 text-[#37474F] font-bold text-sm flex items-center justify-center gap-2"><Chrome className="w-4 h-4"/>Continue with Google</button>
      <div className="flex items-center gap-3 mb-4"><div className="h-px bg-gray-200 flex-1"/><span className="text-[10px] text-gray-400 font-bold">OR EMAIL</span><div className="h-px bg-gray-200 flex-1"/></div>

      {pendingOtp && (
        <div className="mb-6 p-5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9]">
          <h3 className="font-bold text-[#1B5E20] mb-2">Confirm your email</h3>
          <p className="text-xs text-gray-600 mb-3">Enter the 6-digit code sent to {email}.</p>
          <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" maxLength={6} placeholder="123456" className="w-full px-4 py-3 rounded-xl border" />
          <button type="button" disabled={otp.length!==6} onClick={async()=>{const r=await verifyOtp(email,otp);if(r.success)navigate(from,{replace:true});else setErrors({general:r.message||'Invalid verification code.'})}} className="w-full mt-3 py-3 rounded-xl bg-[#2E7D32] text-white font-bold disabled:opacity-50">Verify & Continue</button>
          <button type="button" onClick={async()=>{const r=await authService.resendOtp(email);setSuccessMessage(r.message)}} className="w-full mt-2 text-xs font-bold text-[#2E7D32]">Resend code</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
            {t('auth.emailLabel')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="farmer@krishibhoomi.ai"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm text-[#37474F] placeholder-gray-400 focus:outline-hidden transition-colors ${
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

        {/* Password Field with Show/Hide Toggle */}
        <div>
          <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
            {t('auth.passwordLabel')} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              className={`w-full pl-10 pr-11 py-3 rounded-xl border text-xs sm:text-sm text-[#37474F] placeholder-gray-400 focus:outline-hidden transition-colors ${
                errors.password
                  ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                  : 'border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#2E7D32] transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600 select-none">
            <input
              id="login-remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded w-4 h-4 text-[#2E7D32] accent-[#2E7D32] focus:ring-[#2E7D32]"
            />
            {t('auth.rememberMe')}
          </label>

          <Link
            to="/forgot-password"
            id="link-forgot-password"
            className="text-xs font-bold text-[#2E7D32] hover:underline"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        {/* Submit Button */}
        <button
          id="btn-submit-login"
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-98"
        >
          {isLoading ? (
            <span>{t('auth.signingIn')}</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>{t('auth.signInBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Register Switch Link */}
      <div className="mt-6 text-center text-xs text-gray-500">
        {t('auth.dontHaveAccount')}{' '}
        <Link
          to="/register"
          id="link-create-account"
          className="font-extrabold text-[#2E7D32] hover:underline ml-1"
        >
          {t('nav.register')}
        </Link>
      </div>
    </AuthLayout>
  );
};
