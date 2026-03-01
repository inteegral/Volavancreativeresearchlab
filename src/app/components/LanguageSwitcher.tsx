import { useState, useEffect, useRef } from 'react';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const languages = [
  { code: 'en' as const, label: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'es' as const, label: 'ES', flag: '🇪🇸', name: 'Español' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-sm border border-[#F5F5F0]/20 hover:border-[#B5DAD9]/50 hover:bg-[#B5DAD9]/5 transition-all group"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe size={16} className="text-[#F5F5F0]/60 group-hover:text-[#B5DAD9] transition-colors" />
        <span className="font-['Manrope'] text-xs uppercase tracking-wider text-[#F5F5F0]/80 group-hover:text-[#B5DAD9] transition-colors">
          {currentLanguage.code}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 min-w-[180px] bg-[#5E6860] border border-[#F5F5F0]/20 rounded-sm shadow-xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#B5DAD9]/10 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-['Manrope'] text-sm text-[#F5F5F0] group-hover:text-[#B5DAD9] transition-colors">
                    {lang.name}
                  </span>
                </div>
                {language === lang.code && (
                  <Check size={16} className="text-[#B5DAD9]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}