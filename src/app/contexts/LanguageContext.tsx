import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../../locales/en';
import es from '../../locales/es';

export type Language = 'en' | 'es';

export interface Translations {
  nav: {
    home: string;
    about: string;
    artists: string;
    residencies: string;
    journal: string;
  };
  footer: {
    newsletter: string;
    newsletterPlaceholder: string;
    subscribe: string;
    followUs: string;
    contact: string;
    privacy: string;
    terms: string;
    rights: string;
  };
  home: {
    subtitle: string;
    cta: string;
    aboutTitle: string;
    aboutSubtitle: string;
    residenciesTitle: string;
    residenciesSubtitle: string;
    journalTitle: string;
    journalSubtitle: string;
  };
  about: {
    subtitle: string;
    title: string;
  };
  artists: {
    subtitle: string;
    title: string;
    loadMore: string;
    allArtists: string;
    backToArtists: string;
  };
  residencies: {
    subtitle: string;
    title: string;
    duration: string;
    participants: string;
    applications: string;
    openNow: string;
    closedNow: string;
    viewDetails: string;
    backToResidencies: string;
    editions: string;
    latestEdition: string;
    participatingArtists: string;
    projectDocumentation: string;
    applyNow: string;
    noOpenCall: string;
  };
  journal: {
    subtitle: string;
    title: string;
    all: string;
    articles: string;
    videos: string;
    readMore: string;
    watchVideo: string;
    backToJournal: string;
    aboutAuthor: string;
    relatedResidency: string;
    publishedOn: string;
    video: string;
  };
  common: {
    loading: string;
    notFound: string;
    backToHome: string;
    learnMore: string;
    close: string;
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    replay: string;
    playWithSound: string;
    clickToStart: string;
  };
}

const translations: Record<Language, Translations> = {
  en,
  es,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'volavan_language';
const DEFAULT_LANGUAGE: Language = 'en';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get initial language from localStorage or browser, default to English
  const getInitialLanguage = (): Language => {
    // Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY) as Language;
    if (stored && (stored === 'en' || stored === 'es')) {
      return stored;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en' || browserLang === 'es') {
      return browserLang as Language;
    }

    return DEFAULT_LANGUAGE;
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    // Set initial HTML lang attribute
    document.documentElement.lang = language;
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}