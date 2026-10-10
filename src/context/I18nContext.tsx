import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  TranslationDictionary,
  DICTIONARIES,
} from '../locales';
import { mysqlService } from '../services/mysqlService';

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  currentLanguage: SupportedLanguage;
  languages: SupportedLanguage[];
  t: (path: string, params?: Record<string, string | number>) => string;
  dict: TranslationDictionary;
  isRtl: boolean;
}

const STORAGE_KEY = 'krishibhoomi_language_v1';
const USER_STORAGE_KEY = 'krishibhoomi_active_user_v1';
const DEFAULT_LANGUAGE: LanguageCode = 'en';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper to get nested value from dictionary using dot notation (e.g. "nav.home")
function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;

  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === 'string' ? current : undefined;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        return stored as LanguageCode;
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((code: LanguageCode) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
      return;
    }
    try {
      window.dispatchEvent(new CustomEvent('krishi:language-before-change', { detail: code }));
    } catch {
      // Ignore browser event errors.
    }
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      // Persist to user record in localStorage
      const rawUser = localStorage.getItem(USER_STORAGE_KEY);
      if (rawUser) {
        try {
          const userObj = JSON.parse(rawUser);
          userObj.preferred_language = code;
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
        } catch {
          // ignore
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    // Persist through the active API for the authenticated user (independent preference)
    mysqlService.saveUserLanguagePreference(code).catch((err) => {
      console.warn('[I18n] Failed to persist preferred_language to active database:', err);
    });
  }, []);

  // Hydrate user preference from active database or event listeners
  useEffect(() => {
    const handleLangChanged = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const code = customEvent.detail;
      if (code && SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
        setLanguageState(code as LanguageCode);
      }
    };

    const handleProfileUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<any>;
      const user = customEvent.detail;
      if (user && user.preferred_language && SUPPORTED_LANGUAGES.some((l) => l.code === user.preferred_language)) {
        setLanguageState(user.preferred_language as LanguageCode);
        try {
          localStorage.setItem(STORAGE_KEY, user.preferred_language);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('krishi:language-changed', handleLangChanged);
    window.addEventListener('krishi:profile-updated', handleProfileUpdated);

    // Also attempt to read independent preferred_language from active database for current authenticated user
    mysqlService.getUserLanguagePreference().then((preferred) => {
      if (preferred && SUPPORTED_LANGUAGES.some((l) => l.code === preferred)) {
        setLanguageState(preferred as LanguageCode);
        try {
          localStorage.setItem(STORAGE_KEY, preferred);
        } catch {
          // ignore
        }
      }
    }).catch(() => {});

    return () => {
      window.removeEventListener('krishi:language-changed', handleLangChanged);
      window.removeEventListener('krishi:profile-updated', handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const currentLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE)!
    );
  }, [language]);

  const dict = useMemo(() => {
    return DICTIONARIES[language] || DICTIONARIES[DEFAULT_LANGUAGE];
  }, [language]);

  const isRtl = useMemo(() => {
    return currentLanguage.dir === 'rtl' || currentLanguage.direction === 'rtl';
  }, [currentLanguage]);

  // Update HTML tag lang and dir attributes for correct browser rendering and accessibility
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      // Try current language dictionary
      let text = getNestedValue(dict as any, path);

      // Fallback to English dictionary if not found
      if (!text && language !== DEFAULT_LANGUAGE) {
        text = getNestedValue(DICTIONARIES[DEFAULT_LANGUAGE] as any, path);
      }

      // Friendly aliases for older components that still use a legacy key.
      if (!text && path === 'dashboard.optimizeFarm') {
        text = getNestedValue(dict as any, 'dashboard.farmSubtitle') ||
          getNestedValue(DICTIONARIES[DEFAULT_LANGUAGE] as any, 'dashboard.farmSubtitle');
      }

      // If still missing, return a readable empty-safe value rather than a raw i18n key.
      if (!text) {
        const leaf = path.split('.').filter(Boolean).pop() || 'Text';
        text = leaf.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (letter) => letter.toUpperCase());
      }

      // Interpolate parameters like {name}, {acres}, etc.
      if (params) {
        return Object.entries(params).reduce((acc, [key, val]) => {
          return acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
        }, text);
      }

      return text;
    },
    [dict, language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      currentLanguage,
      languages: SUPPORTED_LANGUAGES,
      t,
      dict,
      isRtl,
    }),
    [language, setLanguage, currentLanguage, t, dict, isRtl]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
