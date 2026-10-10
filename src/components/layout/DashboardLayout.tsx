import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sprout,
  LayoutDashboard,
  TestTube,
  PackageCheck,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Coins,
  Layers,
  FileText,
  User,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Upload,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { GeneratePdfReportModal } from '../reports/GeneratePdfReportModal';
import { useI18n } from '../../context/I18nContext';
import { LanguageSelector } from '../common/LanguageSelector';

interface DashboardLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
  onOpenUploadModal: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onSelectTab,
  children,
  onOpenUploadModal,
}) => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('Rabi Season 2026');
  const [exportToast, setExportToast] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarNavItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'soil-analysis', label: t('sidebar.soilAnalysis'), icon: TestTube },
    { id: 'crop-recommendation', label: t('sidebar.cropRecommendation'), icon: Sprout },
    { id: 'fertilizer', label: t('sidebar.fertilizerRecommendation'), icon: PackageCheck },
    { id: 'pesticides', label: t('sidebar.pesticideAdvisory'), icon: ShieldAlert },
    { id: 'yield', label: t('sidebar.yieldPrediction'), icon: BarChart3 },
    { id: 'market', label: t('sidebar.marketAnalysis'), icon: TrendingUp },
    { id: 'profit', label: t('sidebar.costProfit'), icon: Coins },
    { id: 'scenarios', label: t('sidebar.scenarioSimulator'), icon: Layers },
    { id: 'strategy', label: t('sidebar.personalizedStrategy'), icon: Compass },
    { id: 'reports', label: t('sidebar.reportsHistory'), icon: FileText },
    { id: 'profile', label: t('sidebar.profile'), icon: User },
  ];

  const handleExport = () => {
    setPdfModalOpen(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login?logged_out=true');
    } finally {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'KB';
    return name
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F7FBF7] flex flex-col lg:flex-row">
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Fixed, Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-[#E0E0E0] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-[#E0E0E0]/60">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#2E7D32]">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#2E7D32]">Krishibhoomi</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">AI Agriculture</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id ||
                (item.id === 'market' && activeTab === 'market-analysis') ||
                (item.id === 'profit' && activeTab === 'profit-calculator') ||
                (item.id === 'scenarios' && activeTab === 'scenario-simulator');
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => {
                    if (item.id === 'dashboard') {
                      navigate('/dashboard');
                    } else if (item.id === 'soil-analysis') {
                      navigate('/soil-analysis');
                    } else if (item.id === 'crop-recommendation') {
                      navigate('/crop-recommendation');
                    } else if (item.id === 'fertilizer') {
                      navigate('/fertilizer-recommendation');
                    } else if (item.id === 'pesticides') {
                      navigate('/pesticide-recommendation');
                    } else if (item.id === 'yield') {
                      navigate('/yield-prediction');
                    } else if (item.id === 'market') {
                      navigate('/market-analysis');
                    } else if (item.id === 'profit') {
                      navigate('/profit-calculator');
                    } else if (item.id === 'scenarios') {
                      navigate('/scenario-simulator');
                    } else if (item.id === 'reports') {
                      navigate('/dashboard?tab=reports');
                    } else if (item.id === 'profile') {
                      navigate('/profile');
                    } else {
                      onSelectTab(item.id);
                    }
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#E8F5E9] text-[#2E7D32] shadow-2xs font-extrabold'
                      : 'text-[#37474F]/80 hover:bg-[#F1F8E9]/60 hover:text-[#2E7D32]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2E7D32]' : 'text-gray-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom User Profile & Logout */}
        <div className="p-3 border-t border-[#E0E0E0] space-y-2.5">

          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] overflow-hidden flex items-center justify-center font-extrabold text-xs text-[#2E7D32] shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#37474F] truncate">{user?.name || 'Farmer'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email || 'Active Account'}</p>
            </div>
          </div>

          <button
            onClick={() => setLogoutModalOpen(true)}
            id="btn-sidebar-logout"
            className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area (offset by 72 (18rem) on desktop) */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Top Header Bar matching Figma */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0E0E0]/80 px-3 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-[#37474F] hover:bg-gray-100 rounded-xl"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input matching Figma */}
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dashboard.searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 bg-gray-50/80 border border-[#E0E0E0] rounded-xl text-xs text-[#37474F] placeholder-gray-400 focus:outline-hidden focus:border-[#2E7D32] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-full">
            <LanguageSelector id="dashboard-header-lang-selector" variant="dashboard" />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-xl border border-[#E0E0E0] flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#2E7D32]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E0E0E0] rounded-2xl shadow-xl p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-[#37474F]">{t('dashboard.agronomicAlerts')}</span>
                    <span className="text-[10px] font-bold text-[#2E7D32]">3 {t('dashboard.newBadge')}</span>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32]">
                      <p className="font-bold">Mandi Price Spike</p>
                      <p className="text-[11px] text-gray-600">Mustard trending up +5.1% in Alwar APMC.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#FFF8E1] text-[#E65100]">
                      <p className="font-bold">Zinc Supplementation Due</p>
                      <p className="text-[11px] text-gray-600">North Field Block A basal dressing scheduled.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill with Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                id="btn-header-profile-menu"
                className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] overflow-hidden flex items-center justify-center font-bold text-xs">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#37474F] leading-tight truncate max-w-[120px]">
                    {user?.name || 'Farmer'}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Farmer ({user?.farmArea ? `${user.farmArea} A` : 'Holding'})
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E0E0E0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-extrabold text-[#37474F] truncate">{user?.name || 'Farmer'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email || 'Active Account'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] rounded-full">
                      {user?.soilType || 'Soil Pending'} • {user?.farmArea ? `${user.farmArea} Acres` : 'Land Unspecified'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-[#37474F] hover:bg-[#F1F8E9] hover:text-[#2E7D32] flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      {t('sidebar.profile')}
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      Switch / Re-login Account
                    </button>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setLogoutModalOpen(true);
                      }}
                      id="btn-dropdown-logout"
                      className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Banner Bar: "Welcome back, {user.name}!" + Season Selector + Export Button */}
        <div className="px-4 sm:px-8 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#37474F] tracking-tight">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {t('dashboard.optimizeFarm', {
                  acres: String(user?.farmArea ?? 0),
                  location: user?.location || t('profile.farmArea'),
                })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 max-w-full">
              {/* Season dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E0E0E0] rounded-xl text-xs font-bold text-[#37474F] shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="Rabi Season 2026">{t('dashboard.rabiSeason')}</option>
                  <option value="Kharif Season 2026">{t('dashboard.kharifSeason')}</option>
                  <option value="Zaid Season 2026">{t('dashboard.zaidSeason')}</option>
                  <option value="This Month">{t('dashboard.thisMonth')}</option>
                </select>
              </div>

              {/* Export Button matching Figma Export ↑ */}
              <button
                onClick={handleExport}
                id="btn-export-report"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                {t('dashboard.exportReport')}
              </button>
            </div>
          </div>
        </div>

        {/* Export Toast Notification */}
        {exportToast && (
          <div className="mx-4 sm:mx-8 mt-2 p-3 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-[#2E7D32] flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Agricultural AI Advisory PDF compiled and exported for {selectedSeason}.</span>
            </div>
            <button onClick={() => setExportToast(false)} className="text-[#2E7D32] hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content View Body */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>

      <GeneratePdfReportModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#37474F]">{t('dashboard.signOutModalTitle')}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
              {t('dashboard.signOutModalDesc', { name: user?.name || 'Farmer' })}
            </p>

            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {t('dashboard.staySignedIn')}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                id="btn-confirm-logout-modal"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? t('nav.loggingOut') : t('dashboard.yesLogOut')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
