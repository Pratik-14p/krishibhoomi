import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { en } from '../../locales/dictionaries/en';
import type { LanguageCode } from '../../locales/types';
import { api } from '../../services/api';

const CACHE_KEY = 'krishibhoomi_dynamic_translation_cache_v1';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'PRE', 'CODE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION']);
type TextState = { source: string; translated: string; language: string };
type AttributeState = { source: string; translated: string; language: string };

const translationRequests = new Map<string, Promise<Record<string, string>>>();
const failedTranslationRequests = new Map<string, number>();

function requestTranslations(language: string, languageName: string, texts: string[]): Promise<Record<string, string>> {
  const uniqueTexts = Array.from(new Set(texts));
  const requestKey = `${language}:${JSON.stringify(uniqueTexts)}`;
  const existing = translationRequests.get(requestKey);
  if (existing) return existing;
  if ((failedTranslationRequests.get(requestKey) || 0) > Date.now()) {
    return Promise.reject(new Error('Translation request is temporarily suppressed after a recent failure.'));
  }

  const request = api.post<{ translations?: Record<string, string> }>('/translate', {
    language,
    languageName,
    texts: uniqueTexts,
  }).then((response) => {
    const translations = response.data?.translations;
    if (!translations || typeof translations !== 'object' || Array.isArray(translations)) {
      throw new Error('Translation service returned an invalid response.');
    }
    failedTranslationRequests.delete(requestKey);
    return translations;
  }).catch((error: unknown) => {
    // Avoid a DOM mutation/language render loop repeatedly retrying a failed batch.
    failedTranslationRequests.set(requestKey, Date.now() + 20_000);
    throw error;
  }).finally(() => {
    translationRequests.delete(requestKey);
  });

  translationRequests.set(requestKey, request);
  return request;
}

function loadCache(): Record<string, string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

function saveCache(cache: Record<string, string>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch { /* storage is optional */ }
}

function isTranslatable(text: string): boolean {
  const value = text.replace(/\s+/g, ' ').trim();
  if (!value || value.length < 2) return false;
  if (!/[A-Za-z\u0900-\u097F\u0980-\u09FF\u0A80-\u0AFF\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0600-\u06FF]/.test(value)) return false;
  if (/^(https?:\/\/|www\.)/i.test(value) || /^[A-Za-z0-9_./:-]+$/.test(value) && !/\s/.test(value)) return false;
  return true;
}

function localizedDictionaryValues(english: unknown, localized: unknown, output = new Set<string>()): Set<string> {
  if (!english || !localized || typeof english !== 'object' || typeof localized !== 'object') return output;
  for (const [key, localizedValue] of Object.entries(localized)) {
    const englishValue = (english as Record<string, unknown>)[key];
    if (typeof localizedValue === 'string' && typeof englishValue === 'string' && localizedValue !== englishValue) {
      output.add(localizedValue.trim());
    } else if (localizedValue && englishValue && typeof localizedValue === 'object' && typeof englishValue === 'object') {
      localizedDictionaryValues(englishValue, localizedValue, output);
    }
  }
  return output;
}

export const AutoTranslateLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, currentLanguage, dict } = useI18n();
  const [translationUnavailable, setTranslationUnavailable] = useState(false);
  const languageRef = useRef(language);
  const nodeState = useRef(new WeakMap<Text, TextState>()).current;
  const attributeState = useRef(new WeakMap<HTMLElement, Map<string, AttributeState>>()).current;
  const timerRef = useRef<number | null>(null);
  const pendingRef = useRef<Map<string, Set<Text>>>(new Map<string, Set<Text>>());
  const protectedDictionaryText = useMemo(
    () => localizedDictionaryValues(en, dict),
    [dict]
  );

  useEffect(() => { languageRef.current = language; }, [language]);

  useEffect(() => {
    if (language === 'en') return;
    let cancelled = false;
    const cache = loadCache();

    const scheduleBatch = () => {
      if (timerRef.current !== null || pendingRef.current.size === 0) return;
      timerRef.current = window.setTimeout(async () => {
        timerRef.current = null;
        const pendingEntries = pendingRef.current as Map<string, Set<Text>>;
        const batch = [...pendingEntries.entries()].slice(0, 35) as Array<[string, Set<Text>]>;
        batch.forEach(([source]) => pendingRef.current.delete(source));
        try {
          const translations = await requestTranslations(language, currentLanguage.name, batch.map(([source]) => source));
          if (cancelled || languageRef.current !== language) return;
          setTranslationUnavailable(false);
          for (const [source, nodes] of batch) {
            const translated = translations[source];
            if (typeof translated !== 'string' || !translated.trim()) continue;
            cache[`${language}:${source}`] = translated;
            nodes.forEach((node) => {
              const current = node.textContent || '';
              if (current.trim() !== source) return;
              const prefix = current.match(/^\s*/)?.[0] || '';
              const suffix = current.match(/\s*$/)?.[0] || '';
              node.textContent = `${prefix}${translated}${suffix}`;
              nodeState.set(node, { source, translated, language });
            });
          }
          saveCache(cache);
        } catch (error) {
          if (!cancelled && languageRef.current === language) setTranslationUnavailable(true);
          console.warn('[I18n] Dynamic translation unavailable:', error instanceof Error ? error.name : 'UnknownError');
        }
        if (!cancelled) scheduleBatch();
      }, 80);
    };

    const collect = () => {
      if (cancelled) return;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let current: Node | null;
      while ((current = walker.nextNode())) {
        const textNode = current as Text;
        const parent = textNode.parentElement;
        if (!parent || SKIP_TAGS.has(parent.tagName) || parent.closest('[data-no-auto-translate="true"]')) continue;
        const visible = textNode.textContent || '';
        const previous = nodeState.get(textNode);
        if (previous && previous.language !== language && visible.trim() === previous.translated.trim()) {
          textNode.textContent = previous.source;
        }
        const raw = textNode.textContent || '';
        const source = previous && raw.trim() === previous.translated.trim()
          ? previous.source
          : raw.replace(/\s+/g, ' ').trim();
        if (!source || source.length > 500 || !isTranslatable(source)) continue;
        if (protectedDictionaryText.has(source)) continue;

        const cached = cache[`${language}:${source}`];
        if (cached) {
          if (raw.trim() !== cached.trim()) textNode.textContent = raw.replace(source, cached);
          nodeState.set(textNode, { source, translated: cached, language });
          continue;
        }
        const nodes = pendingRef.current.get(source) || new Set<Text>();
        nodes.add(textNode);
        pendingRef.current.set(source, nodes);
      }
      scheduleBatch();
    };

    const restoreBeforeLanguageChange = (event: Event) => {
      const nextLanguage = (event as CustomEvent<LanguageCode>).detail;
      if (nextLanguage) languageRef.current = nextLanguage;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let current: Node | null;
      while ((current = walker.nextNode())) {
        const node = current as Text;
        const state = nodeState.get(node);
        if (state && (node.textContent || '').trim() === state.translated.trim()) node.textContent = state.source;
      }
    };

    window.addEventListener('krishi:language-before-change', restoreBeforeLanguageChange);
    const observer = new MutationObserver(collect);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    collect();
    return () => {
      window.removeEventListener('krishi:language-before-change', restoreBeforeLanguageChange);
      cancelled = true;
      observer.disconnect();
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      pendingRef.current.clear();
    };
  }, [language, currentLanguage.name, nodeState, protectedDictionaryText]);

  // Translate placeholder/title/ARIA text too, and restore the source string
  // before applying a new language so repeated switches never translate a
  // previous translation.
  useEffect(() => {
    if (language === 'en') return;
    let cancelled = false;
    const cache = loadCache();
    const attributes = ['placeholder', 'title', 'aria-label'];
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[placeholder], [title], [aria-label]'))
      .filter((element) => !element.closest('[data-no-auto-translate="true"]'));
    const targets = new Map<string, Array<{ element: HTMLElement; attribute: string }>>();

    elements.forEach((element) => {
      const states = attributeState.get(element) || new Map<string, AttributeState>();
      attributeState.set(element, states);
      attributes.forEach((attribute) => {
        const state = states.get(attribute);
        let value = element.getAttribute(attribute);
        if (state && value === state.translated) {
          value = state.source;
          element.setAttribute(attribute, value);
        }
        if (!value || !isTranslatable(value) || protectedDictionaryText.has(value.trim())) return;
        const cached = cache[`${language}:${value}`];
        if (cached) {
          element.setAttribute(attribute, cached);
          states.set(attribute, { source: value, translated: cached, language });
          return;
        }
        const group = targets.get(value) || [];
        group.push({ element, attribute });
        targets.set(value, group);
      });
    });

    const run = async () => {
      const items = Array.from(targets.entries());
      for (let index = 0; index < items.length; index += 30) {
        try {
          const batch = items.slice(index, index + 30);
          const translations = await requestTranslations(language, currentLanguage.name, batch.map(([source]) => source));
          if (cancelled || languageRef.current !== language) return;
          setTranslationUnavailable(false);
          for (const [source, elementsForSource] of batch) {
            const translated = translations[source];
            if (typeof translated !== 'string' || !translated.trim()) continue;
            cache[`${language}:${source}`] = translated;
            elementsForSource.forEach(({ element, attribute }) => {
              if (element.getAttribute(attribute) !== source) return;
              element.setAttribute(attribute, translated);
              const states = attributeState.get(element) || new Map<string, AttributeState>();
              states.set(attribute, { source, translated, language });
              attributeState.set(element, states);
            });
          }
          saveCache(cache);
        } catch (error) {
          if (!cancelled && languageRef.current === language) setTranslationUnavailable(true);
          console.warn('[I18n] Attribute translation unavailable:', error instanceof Error ? error.name : 'UnknownError');
        }
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [language, currentLanguage.name, attributeState, protectedDictionaryText]);

  return <>
    {children}
    {translationUnavailable && language !== 'en' && (
      <div
        role="status"
        aria-live="polite"
        data-no-auto-translate="true"
        className="fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-lg"
      >
        <span>{dict.common?.error || 'Notice'}: Translation is temporarily unavailable. Original text remains visible.</span>
        <button
          type="button"
          className="ml-3 font-semibold underline"
          onClick={() => setTranslationUnavailable(false)}
          aria-label="Dismiss translation notice"
        >
          ×
        </button>
      </div>
    )}
  </>;
};
