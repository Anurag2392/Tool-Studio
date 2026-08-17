import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Combine, 
  Scissors, 
  FileArchive, 
  Edit3, 
  Lock, 
  Globe, 
  TrendingUp, 
  PenTool, 
  FileText,
  Flame,
  RefreshCw,
  Image as ImageIcon,
  Layers,
  Calculator
} from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsList';
import { ToolCard } from './ToolCard';
import { ToolCategory, ToolId, AdConfig, PdfToolMeta } from '../types';
import { AdBanner } from './AdBanner';
import { getTranslation, getToolTranslation } from '../data/translations';
import { RecentFilesModule } from './RecentFilesModule';
import { HomeSeoHub } from './HomeSeoHub';

interface ToolGridProps {
  onSelectTool: (id: ToolId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  adConfig: AdConfig;
  langCode?: string;
}

const CATEGORY_SECTIONS: {
  id: ToolCategory;
  title: string;
  desc: string;
  icon: React.ElementType;
  badge: string;
  badgeBg: string;
}[] = [
  {
    id: 'popular',
    title: 'Featured & Popular Tools',
    desc: 'Most frequently used tools for daily PDF & image operations',
    icon: Flame,
    badge: 'Popular',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'edit-convert',
    title: 'PDF Editing & Format Conversion',
    desc: 'Convert between PDF, Word, Excel, JPG, HTML & edit document content',
    icon: RefreshCw,
    badge: 'Conversion',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    id: 'organize-split',
    title: 'Organize, Merge & Page Suite',
    desc: 'Combine PDFs, split pages, extract, reorder, and rotate documents',
    icon: Combine,
    badge: 'Page Tools',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'other-scans',
    title: 'Image Suite & Photo Utilities',
    desc: 'Compress to exact KB (20KB, 50KB), resize dimensions, 300 DPI, crop, and BG remover',
    icon: ImageIcon,
    badge: 'Image Utilities',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  {
    id: 'security',
    title: 'PDF Security, Signatures & Protection',
    desc: 'Encrypt, unlock passwords, sign contracts, redact & add watermarks',
    icon: ShieldCheck,
    badge: 'Security',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  {
    id: 'ai-tools',
    title: 'Gemini AI Document Intelligence',
    desc: 'Summarize long documents, ask questions, write alt-text & generate SEO keywords',
    icon: Sparkles,
    badge: 'AI Powered',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    id: 'calculators',
    title: '50 Smart Calculators Suite (Phase 1, 2 & 3)',
    desc: 'EMI, SIP, Income Tax, GST, Age, BMI, FD, PPF, SWP, Car Loan, Book Spine Thickness & DPI Print',
    icon: Calculator,
    badge: '50 Calculators',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  }
];

export const ToolGrid: React.FC<ToolGridProps> = React.memo(({
  onSelectTool,
  searchQuery,
  onSearchChange,
  adConfig,
  langCode = 'en',
}) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');

  const categories = useMemo(() => [
    { id: 'all' as ToolCategory, label: `${getTranslation('allTools', langCode)} (${TOOLS_LIST.length})` },
    { id: 'popular' as ToolCategory, label: getTranslation('popular', langCode) },
    { id: 'edit-convert' as ToolCategory, label: getTranslation('editConvert', langCode) },
    { id: 'organize-split' as ToolCategory, label: getTranslation('organizeSplit', langCode) },
    { id: 'other-scans' as ToolCategory, label: 'Image Suite' },
    { id: 'security' as ToolCategory, label: getTranslation('security', langCode) },
    { id: 'ai-tools' as ToolCategory, label: getTranslation('aiTools', langCode) },
    { id: 'calculators' as ToolCategory, label: '50 Calculators' },
  ], [langCode]);

  // Memoize tool filtering calculation
  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return TOOLS_LIST.filter((tool) => {
      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'popular' && tool.isPopular) ||
        tool.category === activeCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      const translated = getToolTranslation(tool.id, tool.name, tool.shortDesc, langCode);

      return (
        tool.name.toLowerCase().includes(query) ||
        translated.name.toLowerCase().includes(query) ||
        tool.shortDesc.toLowerCase().includes(query) ||
        translated.shortDesc.toLowerCase().includes(query) ||
        tool.seoKeywords.some((k) => k.toLowerCase().includes(query))
      );
    });
  }, [activeCategory, searchQuery, langCode]);

  // Group filtered tools category-wise
  const categoryGroupedTools = useMemo(() => {
    const query = searchQuery.trim();

    return CATEGORY_SECTIONS.map((sec) => {
      const sectionTools = filteredTools.filter((t) => {
        if (sec.id === 'popular') return t.isPopular;
        return t.category === sec.id;
      });

      return {
        ...sec,
        tools: sectionTools
      };
    }).filter((sec) => (sec.tools?.length || 0) > 0);
  }, [filteredTools, searchQuery]);

  return (
    <div className="space-y-10">
      
      {/* Hero Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <Sparkles size={14} className="text-emerald-600" />
          <span>Tool Studio • High-Performance Document Suite</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {getTranslation('heroTitle', langCode)}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {getTranslation('heroSubtitle', langCode)}
        </p>

        {/* Quick Direct Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onSelectTool('merge')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            <Combine size={14} /> Merge PDF
          </button>
          <button
            onClick={() => onSelectTool('image-compressor-kb')}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-700/20 cursor-pointer"
          >
            <ImageIcon size={14} /> Compress to KB
          </button>
          <button
            onClick={() => onSelectTool('compress')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <FileArchive size={14} /> Compress PDF
          </button>
          <button
            onClick={() => onSelectTool('edit')}
            className="px-4 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Edit3 size={14} /> Edit & Annotate
          </button>
          <button
            onClick={() => onSelectTool('ai-summarize')}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-purple-700/20 cursor-pointer"
          >
            <Sparkles size={14} /> AI Assistant
          </button>
        </div>
      </div>

      {/* Leaderboard Ad Banner Slot */}
      <AdBanner format="leaderboard" adConfig={adConfig} />

      {/* Recent Processed Files Session History Module */}
      <RecentFilesModule onSelectTool={onSelectTool} />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Category-Wise Redesigned Tools Sections */}
      {(categoryGroupedTools?.length || 0) > 0 ? (
        <div className="space-y-12">
          {categoryGroupedTools.map((section) => {
            const IconComp = section.icon;
            const toolCount = section.tools?.length || 0;
            return (
              <div key={section.id} className="space-y-4">
                
                {/* Category Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold shadow-sm">
                      <IconComp size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                          {section.title}
                        </h2>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${section.badgeBg}`}>
                          {section.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {section.desc}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                    {toolCount} {toolCount === 1 ? 'Tool' : 'Tools'}
                  </span>
                </div>

                {/* Section Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} langCode={langCode} />
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-500 font-semibold text-sm">No tools found for "{searchQuery}".</p>
          <button
            onClick={() => {
              onSearchChange('');
              setActiveCategory('all');
            }}
            className="text-xs text-emerald-600 font-bold underline cursor-pointer"
          >
            Reset Filters & View All Tools
          </button>
        </div>
      )}

      {/* Why Choose Tool Studio Feature Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xs space-y-8 mt-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Why Professionals Choose Tool Studio
          </h2>
          <p className="text-xs text-slate-500">
            Engineered for high performance, drag-and-drop file processing, PhonePe payments, and AdSense yield.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">100% Private Local Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Files stay completely safe in your browser. Contracts and financial documents never leave your local session.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Gemini AI Document Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract insights, query PDFs directly, translate foreign documents, and perform OCR with Google Gemini 3.6 Flash.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
              <Zap size={20} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Instant Drag-and-Drop</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by react-dropzone with animated drop zones, validation feedback, and zero upload delay.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Power Hub & Backlink Directory */}
      <HomeSeoHub onSelectTool={onSelectTool} />

    </div>
  );
});
