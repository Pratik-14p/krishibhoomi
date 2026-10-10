import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Menu, X, LogIn, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { LanguageSelector } from '../common/LanguageSelector';

interface NavbarProps {
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin: _onOpenLogin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login?logged_out=true');
    } finally {
      setIsLoggingOut(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
    { label: t('nav.about'), href: '#about' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E0E0E0]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32] shadow-xs group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#2E7D32]">Krishibhoomi</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] rounded border border-[#C8E6C9]">
                  AI
                </span>
              </div>
              <p className="text-xs text-[#37474F]/70 font-medium hidden sm:block">Sustainable Agriculture Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-sm font-semibold text-[#37474F] hover:text-[#2E7D32] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#2E7D32] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector id="navbar-language-selector" variant="navbar" />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  id="nav-dashboard-btn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('sidebar.dashboard')} ({user?.name ? user.name.split(' ')[0] : 'Farmer'})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLogout}
                  id="nav-logout-btn"
                  disabled={isLoggingOut}
                  title={t('nav.signOutAccount')}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-200 hover:border-red-200 cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isLoggingOut ? t('nav.loggingOut') : t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  id="nav-login-link"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#37474F] hover:text-[#2E7D32] hover:bg-[#F1F8E9] rounded-xl transition-all border border-transparent hover:border-[#C8E6C9]"
                >
                  <LogIn className="w-4 h-4 text-[#2E7D32]" />
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  id="nav-register-link"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.register')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector id="mobile-header-lang-selector" variant="compact" showLabel={false} />
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#2E7D32] rounded-lg"
            >
              {isAuthenticated ? t('sidebar.dashboard') : t('nav.login')}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#37474F] hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E0E0E0] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase">{t('nav.language')}</span>
            <LanguageSelector id="mobile-drawer-lang-selector" variant="navbar" />
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#37474F] hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-[#E0E0E0] flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  id="mobile-nav-dashboard-btn"
                  className="w-full py-2.5 text-center font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-xs flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('nav.goToDashboard')}</span>
                </button>
                <button
                  onClick={handleLogout}
                  id="mobile-nav-logout-btn"
                  disabled={isLoggingOut}
                  className="w-full py-2.5 text-center font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoggingOut ? t('nav.loggingOut') : t('nav.signOutAccount')}</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold text-[#37474F] bg-[#F7FBF7] border border-[#E0E0E0] rounded-xl block"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-white bg-[#2E7D32] rounded-xl shadow-xs block"
                >
                  {t('nav.registerFarmAccount')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
