import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import { LanguageSelector } from '../common/LanguageSelector';
import {
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
  Layers,
  Sprout,
  Maximize2,
  Edit3,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

const SOIL_TYPE_OPTIONS = [
  'Alluvial Loam',
  'Black Cotton Soil (Regur)',
  'Red Sandy Loam',
  'Clay Loam',
  'Silty Loam',
  'Laterite Soil',
  'Desert / Arid Sandy Soil',
];

const PREFERRED_CROP_OPTIONS = [
  'Wheat & Mustard (Dual Sowing)',
  'Basmati Rice & Wheat Rotation',
  'Cotton & Pulses (Kharif Cash)',
  'Maize & Soybean Intercropping',
  'Sugarcane & Green Manure',
  'High-Value Vegetables & Melons',
  'Organic Chickpea & Millet',
];

export const ProfileView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { t, currentLanguage } = useI18n();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [farmArea, setFarmArea] = useState<number | string>('');
  const [soilType, setSoilType] = useState('');
  const [preferredCrop, setPreferredCrop] = useState('');

  // Populate from current user on load or when user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      setLocation(user.location || '');
      setFarmArea(user.farmArea ?? '');
      setSoilType(user.soilType || '');
      setPreferredCrop(user.preferredCrop || '');
    }
  }, [user]);

  // Cancel edit mode and revert to user data
  const handleCancel = () => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || '');
      setLocation(user.location || '');
      setFarmArea(user.farmArea ?? '');
      setSoilType(user.soilType || '');
      setPreferredCrop(user.preferredCrop || '');
    }
    setIsEditing(false);
    setErrorMessage(null);
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('A valid email address is required.');
      return;
    }
    if (!mobile.trim()) {
      setErrorMessage('Mobile number is required.');
      return;
    }
    const areaNum = parseFloat(String(farmArea));
    if (isNaN(areaNum) || areaNum <= 0) {
      setErrorMessage('Farm area must be a positive number of acres.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        location: location.trim(),
        farmArea: areaNum,
        soilType: soilType.trim(),
        preferredCrop: preferredCrop.trim(),
        avatarUrl: '',
      });

      setIsSaving(false);
      setIsEditing(false);
      setSuccessMessage('Farmer profile changes saved successfully!');

      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    } catch (err: any) {
      setIsSaving(false);
      setErrorMessage(err.message || 'Failed to update farm profile.');
    }
  };

  const getInitials = (n: string) => {
    if (!n) return 'KB';
    return n
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {t('profile.verified')}
            </span>
            <span className="text-xs text-gray-400">ID: KB-{user?.id?.substring(0, 8) || '204'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#37474F] mt-2 tracking-tight">
            {t('profile.title')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Action Toggle Button */}
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              id="btn-edit-profile"
              onClick={() => {
                setIsEditing(true);
                setSuccessMessage(null);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Edit3 className="w-4 h-4" />
              {t('profile.editProfile')}
            </button>
          ) : (
            <button
              id="btn-cancel-profile-top"
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 text-gray-600 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              {t('profile.cancel')}
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Form & Overview */}
      <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Farmer Identity Section (Typography and Monogram Badge - No Images) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-gray-100">
            {/* Identity Badge */}
            <div className="w-20 h-20 rounded-2xl border-2 border-[#C8E6C9] bg-[#E8F5E9] flex flex-col items-center justify-center text-[#2E7D32] shadow-xs shrink-0">
              <UserIcon className="w-7 h-7 text-[#2E7D32] mb-0.5" />
              <span className="text-[10px] font-black tracking-wider uppercase">{getInitials(name)}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-[#37474F] truncate">{name}</h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F8E9] text-[#2E7D32] border border-[#C8E6C9]">
                  Farmer
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {location || 'Location Not Specified'}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium">
                  <Maximize2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  {farmArea} Acres Holding
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-medium text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user?.memberSince || 'Recent'}
                </span>
              </div>
            </div>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.fullName')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="input-profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm text-[#37474F]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <UserIcon className="w-4 h-4 text-[#2E7D32]" />
                  <span>{name}</span>
                </div>
              )}
            </div>

            {/* 2. Email */}
            <div>
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.email')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm text-[#37474F]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <Mail className="w-4 h-4 text-[#2E7D32]" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            {/* 3. Mobile */}
            <div>
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.mobile')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="input-profile-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm text-[#37474F]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <Phone className="w-4 h-4 text-[#2E7D32]" />
                  <span>{mobile || 'Not set'}</span>
                </div>
              )}
            </div>

            {/* 4. Location */}
            <div>
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.location')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    id="input-profile-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm text-[#37474F]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <MapPin className="w-4 h-4 text-[#2E7D32]" />
                  <span>{location || 'Not set'}</span>
                </div>
              )}
            </div>

            {/* 5. Farm Area */}
            <div>
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.farmArea')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <input
                    id="input-profile-farm-area"
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={farmArea}
                    onChange={(e) => setFarmArea(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden text-xs sm:text-sm text-[#37474F]"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <Maximize2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>{farmArea} Acres</span>
                </div>
              )}
            </div>

            {/* 6. Soil Type */}
            <div>
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.soilType')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <select
                    id="select-profile-soil-type"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] bg-white text-xs sm:text-sm font-medium text-[#37474F] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden cursor-pointer"
                  >
                    {SOIL_TYPE_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <Layers className="w-4 h-4 text-[#2E7D32]" />
                  <span>{soilType}</span>
                </div>
              )}
            </div>

            {/* 7. Preferred Crop (Full Width) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#37474F] uppercase tracking-wider mb-1.5">
                {t('profile.preferredCrop')} <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <select
                    id="select-profile-preferred-crop"
                    value={preferredCrop}
                    onChange={(e) => setPreferredCrop(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] bg-white text-xs sm:text-sm font-medium text-[#37474F] focus:border-[#2E7D32] focus:ring-2 focus:ring-[#E8F5E9] outline-hidden cursor-pointer"
                  >
                    {PREFERRED_CROP_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm font-semibold text-[#37474F]">
                  <Sprout className="w-4 h-4 text-[#2E7D32]" />
                  <span>{preferredCrop}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions when Editing */}
          {isEditing && (
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                id="btn-cancel-profile-bottom"
                onClick={handleCancel}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E0E0E0] hover:bg-gray-50 text-gray-600 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {t('profile.cancel')}
              </button>
              <button
                type="submit"
                id="btn-save-profile-bottom"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-75 active:scale-98"
              >
                <Save className="w-4 h-4" />
                {isSaving ? t('profile.saving') : t('profile.saveChanges')}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Quick Summary Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Land Registered</p>
            <p className="text-base font-extrabold text-[#37474F]">{farmArea} Acres</p>
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFF8E1] text-[#E65100] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Soil Profile</p>
            <p className="text-base font-extrabold text-[#37474F] truncate">{soilType}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-5 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] text-[#0277BD] flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Primary Crop</p>
            <p className="text-base font-extrabold text-[#37474F] truncate">{preferredCrop.split('&')[0] || preferredCrop}</p>
          </div>
        </div>
      </div>

      {/* Language and Regional Dialect Settings */}
      <LanguageSelector id="profile-language-selector" variant="full" />

      {/* Account Security & Active Session Card */}
      <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="text-base font-bold text-[#37474F]">Account Security & Session</h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage your active Krishibhoomi credentials and login session on this browser.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              id="btn-profile-logout"
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Session</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Authenticated Email</p>
            <p className="text-sm font-extrabold text-[#37474F] mt-0.5 truncate">{user?.email || 'Not Signed In'}</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Farmer Account ID</p>
            <p className="text-sm font-mono font-bold text-gray-600 mt-0.5">{user?.id || 'farmer-guest'}</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Cloud Storage Status</p>
            <p className="text-sm font-extrabold text-[#2E7D32] mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
              Your data is securely saved
            </p>
          </div>
        </div>

        {/* Logout Confirmation Prompt */}
        {showLogoutConfirm && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50/70 border border-red-200 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-red-800">
                  Are you sure you want to sign out?
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  You will be logged out and returned to the farmer sign-in screen.
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      await logout();
                      navigate('/login?logged_out=true');
                    } finally {
                      setIsLoggingOut(false);
                      setShowLogoutConfirm(false);
                    }
                  }}
                  disabled={isLoggingOut}
                  id="btn-confirm-profile-logout"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? 'Signing out...' : 'Confirm Sign Out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
