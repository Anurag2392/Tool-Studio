import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Globe,
  Tag,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Sliders,
  Eye,
  ExternalLink,
  Bot
} from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsList';
import { ToolId } from '../types';

interface SeoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeToolId?: ToolId | null;
}

export interface ToolSeoConfig {
  title: string;
  metaDescription: string;
  keywords: string;
  h1Text: string;
}

export interface GlobalSeoConfig {
  siteName: string;
  globalTitle: string;
  globalDescription: string;
  globalKeywords: string;
  canonicalDomain: string;
  tools: Record<string, ToolSeoConfig>;
}

const DEFAULT_SEO_CONFIG: GlobalSeoConfig = {
  siteName: 'Tool Studio Pro',
  globalTitle: 'Tool Studio - Free Online PDF & Document Utility Suite',
  globalDescription: '100% free, private & fast browser-based PDF converter, merger, compressor, editor & AI document tools with zero server uploads.',
  globalKeywords: 'pdf converter, merge pdf, compress pdf, pdf to word, pdf to excel, pdf ocr, free pdf tools',
  canonicalDomain: 'https://tool-studio.in',
  tools: TOOLS_LIST.reduce((acc, t) => {
    const kw = Array.isArray(t.seoKeywords) ? t.seoKeywords.join(', ') : (t.seoKeywords || '');
    acc[t.id] = {
      title: t.seoTitle || `${t.name} - Free Online PDF Tool | Tool Studio`,
      metaDescription: t.shortDesc || `Use ${t.name} online for free. Fast, secure, and private PDF utility.`,
      keywords: kw || `${t.name.toLowerCase()}, pdf tool, online pdf, free converter`,
      h1Text: t.name,
    };
    return acc;
  }, {} as Record<string, ToolSeoConfig>),
};

export const SeoSettingsModal: React.FC<SeoSettingsModalProps> = ({
  isOpen,
  onClose,
  activeToolId,
}) => {
  const [selectedToolId, setSelectedToolId] = useState<string>(activeToolId || 'merge');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tools' | 'global'>('tools');
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);

  // SEO Config state loaded from localStorage or defaults
  const [seoConfig, setSeoConfig] = useState<GlobalSeoConfig>(() => {
    const defaultTools: Record<string, ToolSeoConfig> = {};
    TOOLS_LIST.forEach((t) => {
      const kw = Array.isArray(t.seoKeywords) ? t.seoKeywords.join(', ') : (t.seoKeywords || '');
      defaultTools[t.id] = {
        title: t.seoTitle || `${t.name} - Free Online PDF Tool | Tool Studio`,
        metaDescription: t.shortDesc || `Use ${t.name} online for free. Fast, secure, and private PDF utility.`,
        keywords: kw || `${t.name.toLowerCase()}, pdf tool, online pdf, free converter`,
        h1Text: t.name,
      };
    });

    const initialConfig: GlobalSeoConfig = {
      siteName: 'Tool Studio Pro',
      globalTitle: 'Tool Studio - Free Online PDF & Document Utility Suite',
      globalDescription: '100% free, private & fast browser-based PDF converter, merger, compressor, editor & AI document tools with zero server uploads.',
      globalKeywords: 'pdf converter, merge pdf, compress pdf, pdf to word, pdf to excel, pdf ocr, free pdf tools',
      canonicalDomain: 'https://tool-studio.in',
      tools: defaultTools,
    };

    try {
      const stored = localStorage.getItem('toolstudio_seo_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...initialConfig,
          ...parsed,
          tools: { ...initialConfig.tools, ...(parsed.tools || {}) },
        };
      }
    } catch (e) {
      // Quiet handling
    }
    return initialConfig;
  });

  useEffect(() => {
    if (activeToolId) {
      setSelectedToolId(activeToolId);
    }
  }, [activeToolId]);

  if (!isOpen) return null;

  const currentToolMeta = TOOLS_LIST.find((t) => t.id === selectedToolId) || TOOLS_LIST[0];
  const kwString = Array.isArray(currentToolMeta.seoKeywords) ? currentToolMeta.seoKeywords.join(', ') : (currentToolMeta.seoKeywords || '');
  const rawToolConfig = seoConfig?.tools?.[selectedToolId];
  const currentToolConfig: ToolSeoConfig = {
    title: rawToolConfig?.title || `${currentToolMeta.name} - Free Online PDF Tool`,
    metaDescription: rawToolConfig?.metaDescription || currentToolMeta.shortDesc || '',
    keywords: rawToolConfig?.keywords || kwString || 'pdf, online converter',
    h1Text: rawToolConfig?.h1Text || currentToolMeta.name || '',
  };

  const handleToolConfigChange = (field: keyof ToolSeoConfig, val: string) => {
    setSeoConfig((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [selectedToolId]: {
          ...currentToolConfig,
          [field]: val,
        },
      },
    }));
  };

  const handleGlobalConfigChange = (field: keyof GlobalSeoConfig, val: string) => {
    setSeoConfig((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleSaveSeo = () => {
    try {
      localStorage.setItem('toolstudio_seo_config', JSON.stringify(seoConfig));
      window.dispatchEvent(new CustomEvent('seo-config-updated', { detail: seoConfig }));
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    } catch (e) {
      alert('Failed saving SEO settings');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all SEO settings to factory defaults?')) {
      const defaultTools: Record<string, ToolSeoConfig> = {};
      TOOLS_LIST.forEach((t) => {
        const kw = Array.isArray(t.seoKeywords) ? t.seoKeywords.join(', ') : (t.seoKeywords || '');
        defaultTools[t.id] = {
          title: t.seoTitle || `${t.name} - Free Online PDF Tool | Tool Studio`,
          metaDescription: t.shortDesc || `Use ${t.name} online for free. Fast, secure, and private PDF utility.`,
          keywords: kw || `${t.name.toLowerCase()}, pdf tool, online pdf, free converter`,
          h1Text: t.name,
        };
      });

      const resetConfig: GlobalSeoConfig = {
        siteName: 'Tool Studio Pro',
        globalTitle: 'Tool Studio - Free Online PDF & Document Utility Suite',
        globalDescription: '100% free, private & fast browser-based PDF converter, merger, compressor, editor & AI document tools with zero server uploads.',
        globalKeywords: 'pdf converter, merge pdf, compress pdf, pdf to word, pdf to excel, pdf ocr, free pdf tools',
        canonicalDomain: 'https://tool-studio.in',
        tools: defaultTools,
      };

      setSeoConfig(resetConfig);
      localStorage.removeItem('toolstudio_seo_config');
      window.dispatchEvent(new CustomEvent('seo-config-updated', { detail: resetConfig }));
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2500);
    }
  };

  const handleAiAutoGenerate = () => {
    const title = `${currentToolMeta.name} Online - Free & High Speed | ${seoConfig.siteName}`;
    const desc = `Best free online ${currentToolMeta.name.toLowerCase()} tool. Convert, edit, and optimize document files instantly in your browser with 100% privacy and no watermark.`;
    const kw = `${currentToolMeta.name.toLowerCase()}, online ${currentToolMeta.name.toLowerCase()}, free pdf utility, convert pdf, tool studio`;

    setSeoConfig((prev) => ({
      ...prev,
      tools: {
        ...prev.tools,
        [selectedToolId]: {
          title,
          metaDescription: desc,
          keywords: kw,
          h1Text: currentToolMeta.name,
        },
      },
    }));
  };

  const filteredTools = TOOLS_LIST.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold border border-emerald-500/30">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <span>SEO Settings Centralized Dashboard</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  Admin SEO Control
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage titles, meta descriptions & keywords for top organic Google rankings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSeo}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Saved Toast Bar */}
        {isSavedToast && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>SEO settings saved and applied to page meta tags successfully!</span>
            </span>
            <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-md uppercase">Live</span>
          </div>
        )}

        {/* Modal Body Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col p-4 space-y-3 shrink-0">
            {/* Top View Selector Tabs */}
            <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('tools')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'tools'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tool Pages ({TOOLS_LIST.length})
              </button>
              <button
                onClick={() => setActiveTab('global')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'global'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Global SEO
              </button>
            </div>

            {activeTab === 'tools' ? (
              <>
                {/* Tool Search Bar */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tool pages..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Tool Selection List */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-64 md:max-h-full">
                  {filteredTools.map((tool) => {
                    const isSelected = tool.id === selectedToolId;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedToolId(tool.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                            : 'hover:bg-slate-200/60 text-slate-700 font-semibold'
                        }`}
                      >
                        <span className="truncate pr-2">{tool.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          /{tool.id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-900">Global Website SEO Configuration</p>
                <p className="text-[11px] leading-relaxed">
                  Controls the default root page titles, OpenGraph metadata, and baseline site keywords.
                </p>
              </div>
            )}
          </div>

          {/* Main Editing Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'tools' ? (
              <div className="space-y-5">
                {/* Selected Tool Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Editing Page SEO
                    </span>
                    <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                      <span>{currentToolMeta.name}</span>
                      <span className="text-xs font-mono text-slate-400">({currentToolMeta.id})</span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAiAutoGenerate}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Bot size={14} className="text-amber-400" />
                      <span>AI Generate SEO</span>
                    </button>
                  </div>
                </div>

                {/* Google Search Result Preview Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Eye size={13} className="text-emerald-600" /> Google Search Result Snippet Preview
                  </span>
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3 font-sans space-y-1 shadow-2xs">
                    <div className="text-xs text-slate-700 flex items-center gap-1 truncate">
                      <Globe size={12} className="text-slate-400" />
                      <span>{seoConfig.canonicalDomain}</span>
                      <span className="text-slate-400">› {selectedToolId}</span>
                    </div>
                    <div className="text-base text-blue-700 hover:underline font-medium truncate cursor-pointer">
                      {currentToolConfig.title || 'Page Title Placeholder'}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {currentToolConfig.metaDescription || 'Meta description placeholder for search results.'}
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4 text-xs">
                  {/* Page Title */}
                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Document Title Tag (&lt;title&gt;)</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(currentToolConfig.title || '').length} / 60 chars
                      </span>
                    </label>
                    <input
                      type="text"
                      value={currentToolConfig.title || ''}
                      onChange={(e) => handleToolConfigChange('title', e.target.value)}
                      placeholder="e.g. Merge PDF Files Online - Free & Fast"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Meta Description (&lt;meta name="description"&gt;)</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(currentToolConfig.metaDescription || '').length} / 160 chars
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={currentToolConfig.metaDescription || ''}
                      onChange={(e) => handleToolConfigChange('metaDescription', e.target.value)}
                      placeholder="e.g. Combine multiple PDF documents into a single file in seconds."
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Target Keywords */}
                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1">
                      Target Organic Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={currentToolConfig.keywords}
                      onChange={(e) => handleToolConfigChange('keywords', e.target.value)}
                      placeholder="e.g. merge pdf, combine pdf online, free pdf joiner"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {/* H1 Heading Text */}
                  <div>
                    <label className="block font-extrabold text-slate-800 mb-1">
                      Tool Heading Title (H1)
                    </label>
                    <input
                      type="text"
                      value={currentToolConfig.h1Text}
                      onChange={(e) => handleToolConfigChange('h1Text', e.target.value)}
                      placeholder="e.g. Merge PDF Documents"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Global Site SEO Form */
              <div className="space-y-4 text-xs">
                <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Global Site SEO Settings
                </h4>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Website Name / Brand Name
                  </label>
                  <input
                    type="text"
                    value={seoConfig.siteName}
                    onChange={(e) => handleGlobalConfigChange('siteName', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Global Root Page Title
                  </label>
                  <input
                    type="text"
                    value={seoConfig.globalTitle}
                    onChange={(e) => handleGlobalConfigChange('globalTitle', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Global Root Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoConfig.globalDescription}
                    onChange={(e) => handleGlobalConfigChange('globalDescription', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Global Keywords
                  </label>
                  <input
                    type="text"
                    value={seoConfig.globalKeywords}
                    onChange={(e) => handleGlobalConfigChange('globalKeywords', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">
                    Canonical Domain URL
                  </label>
                  <input
                    type="url"
                    value={seoConfig.canonicalDomain}
                    onChange={(e) => handleGlobalConfigChange('canonicalDomain', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw size={14} className="text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSaveSeo}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={15} />
              <span>Apply & Save SEO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
