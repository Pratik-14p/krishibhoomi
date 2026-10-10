import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Square, Loader2 } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageCode } from '../../locales/types';

interface VoiceListenButtonProps {
  text: string;
  langCode?: string;
  className?: string;
  variant?: 'subtle' | 'primary' | 'badge';
  size?: 'xs' | 'sm' | 'md';
  customLabel?: string;
}

const BCP47_LANGUAGE_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
  sa: 'sa-IN',
  ne: 'ne-NP',
  kok: 'kok-IN',
  mai: 'mai-IN',
  ks: 'ks-IN',
  sd: 'sd-IN',
  brx: 'brx-IN',
  doi: 'doi-IN',
  mni: 'mni-IN',
  sat: 'sat-IN',
};

const LISTEN_LABELS: Record<string, { listen: string; stop: string }> = {
  en: { listen: 'Listen', stop: 'Stop' },
  hi: { listen: 'सुनें', stop: 'रोकें' },
  mr: { listen: 'ऐका', stop: 'थांबवा' },
  bn: { listen: 'শুনুন', stop: 'থামুন' },
  te: { listen: 'వినండి', stop: 'ఆపండి' },
  ta: { listen: 'கேளுங்கள்', stop: 'நிறுத்து' },
  gu: { listen: 'સાંભળો', stop: 'રોકો' },
  kn: { listen: 'ಕೇಳಿ', stop: 'ನಿಲ್ಲಿಸಿ' },
  ml: { listen: 'കേൾക്കുക', stop: 'നിർത്തുക' },
  pa: { listen: 'ਸੁਣੋ', stop: 'ਰੋਕੋ' },
  or: { listen: 'ଶୁଣନ୍ତୁ', stop: 'ରୋକନ୍ତୁ' },
  as: { listen: 'শুনক', stop: 'থামক' },
  ur: { listen: 'سنیں', stop: 'روکیں' },
};

export const VoiceListenButton: React.FC<VoiceListenButtonProps> = ({
  text,
  langCode,
  className = '',
  variant = 'subtle',
  size = 'sm',
  customLabel,
}) => {
  const { language } = useI18n();
  const activeLang = (langCode || language) as LanguageCode;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup on unmount or text change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const cleanTextForSpeech = (raw: string): string => {
    return raw
      .replace(/[*_~`#>]/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/kg\/ha/gi, ' kilograms per hectare ')
      .replace(/q\/acre/gi, ' quintals per acre ')
      .replace(/ppm/gi, ' parts per million ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isSupported || !text) return;

      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      window.speechSynthesis.cancel();

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      const bcpTag = BCP47_LANGUAGE_MAP[activeLang] || 'en-IN';
      utterance.lang = bcpTag;
      utterance.rate = 0.92; // Deliberate clear pace for agricultural terminology
      utterance.pitch = 1.0;

      // Try selecting a matching device voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === bcpTag.toLowerCase() ||
          v.lang.toLowerCase().startsWith(activeLang.toLowerCase())
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Text-to-speech error:', err);
        setIsPlaying(false);
      }
    },
    [activeLang, isPlaying, isSupported, text]
  );

  if (!isSupported || !text.trim()) {
    return null;
  }

  const langLabels = LISTEN_LABELS[activeLang] || LISTEN_LABELS.en;
  const currentLabel = customLabel || (isPlaying ? langLabels.stop : langLabels.listen);

  // Variant styling
  const sizeClasses = {
    xs: 'px-2 py-1 text-[10px] gap-1 rounded-md',
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-3 py-2 text-xs font-bold gap-2 rounded-xl',
  }[size];

  const variantClasses = {
    subtle: isPlaying
      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
      : 'bg-white/90 hover:bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs',
    primary: isPlaying
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-[#2E7D32] text-white hover:bg-[#1B5E20] shadow-2xs',
    badge: isPlaying
      ? 'bg-red-100 text-red-800'
      : 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      aria-label={isPlaying ? 'Stop listening to advisory' : 'Listen to advisory in selected language'}
      title={isPlaying ? 'Stop audio' : 'Listen with text-to-speech'}
      className={`inline-flex items-center font-bold transition-all cursor-pointer select-none active:scale-95 ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-red-600 animate-pulse" />
          <span>{currentLabel}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>{currentLabel}</span>
        </>
      )}
    </button>
  );
};
