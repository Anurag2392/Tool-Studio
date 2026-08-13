import React, { useState } from 'react';
import { X, Search, Globe, Check } from 'lucide-react';
import { LANGUAGES, LanguageOption } from '../data/languages';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageOption;
  onSelectLanguage: (lang: LanguageOption) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.englishName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="text-slate-600 shrink-0" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">Select language</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close language selector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2 bg-white">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search language (e.g. English, Español, Français, हिन्दी)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>

        {/* Languages Grid */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-8">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang);
                    onClose();
                  }}
                  dir={lang.rtl ? 'rtl' : 'ltr'}
                  className={`group flex items-center justify-between text-left transition-colors cursor-pointer py-1 px-2 rounded-lg ${
                    isSelected
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-sky-600 hover:text-sky-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base font-normal tracking-wide group-hover:underline">
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <Check size={16} className="text-sky-600 ml-2 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              No languages found matching &quot;{search}&quot;.
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200/80 flex justify-between items-center text-xs text-slate-500">
          <span>Current: <strong className="text-slate-700">{currentLanguage.nativeName} ({currentLanguage.englishName})</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
