'use client';

import { useState, useEffect, useRef } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലయാളം' },
];

const LANG_CODES = new Set(LANGUAGES.map(l => l.code));

/** Read active language from Google Translate cookie (format: /en/ta) */
function getGoogTransLang(): string {
  const match = document.cookie.match(/googtrans=\/[a-z]{2}\/([a-z]{2})/);
  if (match && LANG_CODES.has(match[1])) return match[1];
  return 'en';
}

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          config: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Sync state with Google Translate cookie on mount
  useEffect(() => {
    setCurrentLang(getGoogTransLang());
  }, []);

  // Load Google Translate script once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,ta,te,kn,ml',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Block Google Translate hover tooltip (it hides translated words on mouseover)
  useEffect(() => {
    const blockGtHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'FONT' && document.documentElement.classList.contains('translated-ltr')) {
        e.stopPropagation();
      }
    };
    document.addEventListener('mouseover', blockGtHover, true);
    document.addEventListener('mouseout', blockGtHover, true);
    return () => {
      document.removeEventListener('mouseover', blockGtHover, true);
      document.removeEventListener('mouseout', blockGtHover, true);
    };
  }, []);

  // Auto-protect emojis from Google Translate
  useEffect(() => {
    const emojiRegex = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Component}\uFE0F\u200D\s]+$/u;

    const protectEmojis = () => {
      document.querySelectorAll('font').forEach((el) => {
        const text = el.textContent?.trim() || '';
        if (emojiRegex.test(text) && !el.classList.contains('notranslate')) {
          el.classList.add('notranslate');
          el.setAttribute('translate', 'no');
        }
      });
    };

    const observer = new MutationObserver(protectEmojis);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const selectLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setOpen(false);

    // Trigger Google Translate via its hidden select element
    const select = document.querySelector<HTMLSelectElement>(
      '.goog-te-combo'
    );
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  const activeLang = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative notranslate" ref={ref} translate="no">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[0.95rem] py-2 transition-colors hover:text-sign-primary text-text-primary"
        title="Change language"
        aria-label="Select language"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="hidden md:inline text-xs">{activeLang.native}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-bg-card rounded-lg py-2 min-w-[200px] shadow-lg border border-sign-primary/10 z-50">
          <div className="px-3 py-1.5 text-text-muted text-xs uppercase tracking-wider border-b border-sign-primary/10 mb-1">
            Select Language
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors hover:bg-sign-primary/10 ${
                currentLang === lang.code ? 'bg-sign-primary/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-text-primary text-sm">{lang.native}</span>
                <span className="text-text-muted text-xs">{lang.label}</span>
              </div>
              {currentLang === lang.code && (
                <span className="text-sign-primary text-sm">{'\u2713'}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
