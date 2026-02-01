import React, { useState } from 'react';
import { Menu, Crown, Globe } from 'lucide-react';
import { SubscriptionTier, LanguageCode, Language } from '../types';

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  title: string;
  tier: SubscriptionTier;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  toggleSidebar,
  title,
  tier,
  currentLanguage,
  onLanguageChange
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === currentLanguage);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0b0e14]/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        
        <h1 className="font-semibold text-white truncate max-w-[200px] sm:max-w-none">
          {title}
        </h1>
        
        {tier === 'pro' && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded-full">
            <Crown className="w-3 h-3" />
            PRO
          </span>
        )}
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{currentLang?.flag} {currentLang?.name}</span>
        </button>
        
        {showLangMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-700 transition-colors ${
                    currentLanguage === lang.code ? 'bg-cyan-600/20 text-cyan-400' : 'text-gray-300'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
