import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Check, Search, ChevronDown, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageCode, SupportedLanguage } from '../../locales';

interface LanguageSelectorProps {
  id?: string;
  variant?: 'navbar' | 'dashboard' | 'compact' | 'full';
  showLabel?: boolean;
  className?: string;
  onSelect?: (code: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  id = 'language-selector',
  variant = 'navbar',
  showLabel = true,
  className = '',
  onSelect,
}) => {
  const { language, setLanguage, currentLanguage, languages, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto focus search input when opened
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return languages;

    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.script.toLowerCase().includes(q) ||
        (lang.region && lang.region.toLowerCase().includes(q))
    );
  }, [languages, searchQuery]);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
    if (onSelect) {
      onSelect(code);
    }
  };

  // Full variant (e.g. for profile / settings page)
  if (variant === 'full') {
    return (
      <div id={id} className={`w-full bg-white rounded-xl border border-stone-200 p-5 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              {t('profile.languageSettings')}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('profile.selectAppLanguage')}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchLanguage')}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 placeholder-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50/80 bg-white'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-stone-900 truncate">
                      {lang.nativeName}
                    </span>
                    {lang.code === 'en' && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <span>{lang.name}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-stone-400">{lang.script}</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Trigger button styles based on variant
  const getTriggerClasses = () => {
    if (variant === 'dashboard') {
      return 'inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 hover:border-emerald-500 text-stone-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20';
    }
    if (variant === 'compact') {
      return 'p-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20';
    }
    // Default navbar
    return 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-stone-200 bg-white/90 backdrop-blur-sm hover:bg-emerald-50/50 hover:border-emerald-500 text-stone-700 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20';
  };

  return (
    <div id={id} className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t('nav.selectLanguage')}
        className={getTriggerClasses()}
      >
        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
        {showLabel && (
          <span className="inline-flex items-center gap-1 font-semibold text-stone-900 tracking-tight whitespace-nowrap">
            <span className="text-stone-500 font-medium">{t('nav.language')}:</span>
            <span className="font-bold text-[#2E7D32]">{currentLanguage.nativeName}</span>
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t('nav.selectLanguage')}
          className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white shadow-xl border border-stone-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header with Title and Search */}
          <div className="p-3 bg-stone-50 border-b border-stone-200/80">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                {t('nav.allLanguages')} ({languages.length})
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-100/70 font-medium px-2 py-0.5 rounded-full">
                {currentLanguage.nativeName} ({currentLanguage.name})
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.searchLanguage')}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 p-1.5">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 px-4 text-center text-xs text-stone-500">
                {t('common.error')}: No language matches &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredLanguages.map((lang: SupportedLanguage) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-medium'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">
                          {lang.nativeName}
                        </span>
                        <span className="text-xs text-stone-500 font-normal">
                          {lang.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {lang.script} {lang.region ? `• ${lang.region}` : ''}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 bg-stone-50/80 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between">
            <span>22 Scheduled Languages of India + English</span>
            <span className="text-[10px] font-mono text-stone-400">Unicode 15.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
