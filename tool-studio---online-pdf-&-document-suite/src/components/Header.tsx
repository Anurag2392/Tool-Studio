import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Sparkles, 
  Crown, 
  Search, 
  ChevronDown, 
  Combine, 
  Scissors, 
  FileArchive, 
  Edit3, 
  PenTool, 
  LayoutGrid,
  User,
  Zap,
  Check,
  RotateCcw,
  Shuffle,
  Columns,
  RotateCw,
  FileSpreadsheet,
  FileCode,
  Image,
  ScanText,
  Lock,
  Stamp,
  Hash,
  Globe,
  Calculator
} from 'lucide-react';
import { ToolId, UserPlan, AdConfig } from '../types';
import { TOOLS_LIST } from '../data/toolsList';
import { UserAccount } from './LoginModal';
import { LanguageOption } from '../data/languages';
import { getTranslation, getToolTranslation } from '../data/translations';

interface HeaderProps {
  currentToolId: ToolId | null;
  onSelectTool: (id: ToolId | null) => void;
  userPlan: UserPlan;
  userAccount: UserAccount;
  onOpenPricing: () => void;
  onOpenPhonePe: () => void;
  onOpenLogin: () => void;
  onOpenSeo: () => void;
  onOpenSeoSettings?: () => void;
  onOpenAdSenseSettings: () => void;
  onOpenHostinger?: () => void;
  adConfig: AdConfig;
  onToggleAds: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentLanguage: LanguageOption;
  onOpenLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  currentToolId,
  onSelectTool,
  userPlan,
  userAccount,
  onOpenPricing,
  onOpenPhonePe,
  onOpenLogin,
  onOpenSeo,
  onOpenSeoSettings,
  onOpenAdSenseSettings,
  onOpenHostinger,
  adConfig,
  onToggleAds,
  searchQuery,
  onSearchChange,
  currentLanguage,
  onOpenLanguage,
}) => {
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const quickTools = useMemo(() => [
    { id: 'merge' as ToolId, label: 'Merge PDF', icon: Combine, color: 'text-emerald-600' },
    { id: 'split' as ToolId, label: 'Split PDF', icon: Scissors, color: 'text-amber-600' },
    { id: 'compress' as ToolId, label: 'Compress PDF', icon: FileArchive, color: 'text-blue-600' },
    { id: 'edit' as ToolId, label: 'Edit & Annotate', icon: Edit3, color: 'text-purple-600' },
    { id: 'ai-summarize' as ToolId, label: 'Gemini AI Assistant', icon: Sparkles, color: 'text-indigo-600' },
    { id: 'sign' as ToolId, label: 'Sign PDF', icon: PenTool, color: 'text-rose-600' },
    { id: 'organize' as ToolId, label: 'Organize Pages', icon: LayoutGrid, color: 'text-teal-600' },
  ], []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo - Tool Studio */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTool(null)}
              className="flex items-center gap-2.5 text-slate-900 group cursor-pointer text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-emerald-600 transition-colors">
                <FileText size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-slate-900">
                    TOOL <span className="text-emerald-600">STUDIO</span>
                  </span>
                  <span className="hidden sm:inline-block text-[9px] font-extrabold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 uppercase px-1.5 py-0.2 rounded-md">
                    PRO SUITE
                  </span>
                </div>
              </div>
            </button>

            {/* Tools Mega Dropdown Trigger */}
            <div className="relative hidden md:flex items-center gap-2">
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Document Tools
                <ChevronDown size={14} className={`transition-transform ${showToolsDropdown ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => onSelectTool('calculators' as ToolId)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <Calculator size={14} className="text-emerald-600" />
                <span>50 Calculators</span>
              </button>

              {/* Tools Dropdown Menu */}
              {showToolsDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-3 gap-3"
                  onMouseLeave={() => setShowToolsDropdown(false)}
                >
                  {/* Column 1: MERGE & SPLIT */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
                      MERGE & ORGANISATION
                    </div>
                    {[
                      { id: 'merge' as ToolId, label: 'Merge PDF', icon: Combine, color: 'text-emerald-600' },
                      { id: 'split' as ToolId, label: 'Split PDF', icon: Scissors, color: 'text-amber-600' },
                      { id: 'organize' as ToolId, label: 'Organize & Sort', icon: LayoutGrid, color: 'text-teal-600' },
                      { id: 'alternate-mix' as ToolId, label: 'Alternate & Mix', icon: Shuffle, color: 'text-indigo-600' },
                      { id: 'rotate' as ToolId, label: 'Rotate Pages', icon: RotateCw, color: 'text-blue-600' },
                      { id: 'n-up' as ToolId, label: 'N-Up Booklet', icon: Columns, color: 'text-purple-600' },
                    ].map((t) => {
                      const IconComp = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTool(t.id);
                            setShowToolsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-colors text-left"
                        >
                          <IconComp size={14} className={t.color} />
                          <span className="truncate">{getToolTranslation(t.id, t.label, '', currentLanguage.code).name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Column 2: EDIT & CONVERT */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
                      {getTranslation('editConvert', currentLanguage.code)}
                    </div>
                    {[
                      { id: 'edit' as ToolId, label: 'Edit & Annotate', icon: Edit3, color: 'text-purple-600' },
                      { id: 'compress' as ToolId, label: 'Compress PDF', icon: FileArchive, color: 'text-blue-600' },
                      { id: 'pdf-to-word' as ToolId, label: 'PDF to Word', icon: FileSpreadsheet, color: 'text-sky-600' },
                      { id: 'word-to-pdf' as ToolId, label: 'Word to PDF', icon: FileCode, color: 'text-indigo-600' },
                      { id: 'pdf-to-image' as ToolId, label: 'PDF to Image', icon: FileText, color: 'text-emerald-600' },
                      { id: 'image-to-pdf' as ToolId, label: 'Image to PDF', icon: Image, color: 'text-rose-600' },
                    ].map((t) => {
                      const IconComp = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTool(t.id);
                            setShowToolsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-colors text-left"
                        >
                          <IconComp size={14} className={t.color} />
                          <span className="truncate">{getToolTranslation(t.id, t.label, '', currentLanguage.code).name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Column 3: SECURITY & AI */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
                      {getTranslation('security', currentLanguage.code)}
                    </div>
                    {[
                      { id: 'ocr' as ToolId, label: 'Gemini Vision OCR', icon: ScanText, color: 'text-purple-600' },
                      { id: 'ai-summarize' as ToolId, label: 'AI Summarize & Chat', icon: Sparkles, color: 'text-indigo-600' },
                      { id: 'sign' as ToolId, label: 'e-Sign Contract', icon: PenTool, color: 'text-rose-600' },
                      { id: 'protect' as ToolId, label: 'Protect & Encrypt', icon: Lock, color: 'text-slate-800' },
                      { id: 'watermark' as ToolId, label: 'Watermark Stamp', icon: Stamp, color: 'text-amber-600' },
                      { id: 'bates-numbering' as ToolId, label: 'Bates Legal Numbering', icon: Hash, color: 'text-slate-700' },
                    ].map((t) => {
                      const IconComp = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTool(t.id);
                            setShowToolsDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-colors text-left"
                        >
                          <IconComp size={14} className={t.color} />
                          <span className="truncate">{getToolTranslation(t.id, t.label, '', currentLanguage.code).name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="col-span-3 border-t border-slate-100 pt-2 text-center">
                    <button
                      onClick={() => {
                        onSelectTool(null);
                        setShowToolsDropdown(false);
                      }}
                      className="text-xs font-extrabold text-emerald-600 hover:underline cursor-pointer"
                    >
                      {getTranslation('viewAll', currentLanguage.code)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs hidden sm:block relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={getTranslation('searchPlaceholder', currentLanguage.code)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
            />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            

            {/* Language Selector Button */}
            <button
              onClick={onOpenLanguage}
              title="Select Language / सभी भाषाएँ"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              <Globe size={14} className="text-sky-600" />
              <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
            </button>

            {/* User Login Window Trigger */}
            <button
              onClick={onOpenLogin}
              title="User Account Login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
            >
              <User size={14} className="text-slate-700" />
              <span className="hidden sm:inline">
                {userAccount.isLoggedIn ? userAccount.name.split(' ')[0] : 'Log In'}
              </span>
            </button>

            {/* PhonePe Upgrade & Daily Usage Status Button */}
            <button
              onClick={onOpenPhonePe}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer ${
                userPlan.isPro
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  : userPlan.dailyLimitUsed >= 3
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black animate-pulse shadow-amber-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Crown size={14} className={userPlan.isPro ? 'text-amber-300 fill-amber-300' : 'text-amber-400'} />
              <span>
                {userPlan.isPro
                  ? userPlan.planName === '1 Day Pro Pass'
                    ? '1-Day Pass Active'
                    : 'Pro Active'
                  : userPlan.dailyLimitUsed >= 3
                  ? '3/3 Limit Reached (₹19 Pass)'
                  : `Free Daily: ${userPlan.dailyLimitUsed}/3 Used`}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
});
