import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSelector } from '../../components/common/LanguageSelector';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBackHome?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  showBackHome = true,
}) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#F7FBF7] flex flex-col justify-between selection:bg-[#E8F5E9] selection:text-[#2E7D32]">
      {/* Top Bar */}
      <header className="px-4 sm:px-8 py-4 flex items-center justify-between border-b border-[#E0E0E0]/60 bg-white/70 backdrop-blur-xs">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32] group-hover:scale-105 transition-transform shadow-2xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#2E7D32]">Krishibhoomi</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                AI
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Smart Sustainable Farming Platform</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSelector id="auth-lang-selector" variant="navbar" />
          {showBackHome && (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#2E7D32] px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('auth.backToHome')}
            </Link>
          )}
        </div>
      </header>

      {/* Main Form Center Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-[#37474F] tracking-tight">{title}</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="py-4 px-4 text-center border-t border-[#E0E0E0]/60 bg-white/40 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span>© {new Date().getFullYear()} Krishibhoomi AI Agriculture. All rights reserved.</span>
        <span className="hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1 text-[#2E7D32] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          ICAR Benchmark Compliant
        </span>
      </footer>
    </div>
  );
};
