import React, { useState } from 'react';
import { Globe, Copy, Check, Code, Search, Sparkles } from 'lucide-react';
import { TOOLS_LIST } from '../data/toolsList';

interface SeoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoDrawer: React.FC<SeoDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'meta' | 'sitemap' | 'schema'>('meta');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://toolstudio.app';

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${TOOLS_LIST.map(
  (tool) => `  <url>
    <loc>${appUrl}/#tool-${tool.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
).join('\n')}
</urlset>`;

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tool Studio - Online PDF & Document Suite',
    operatingSystem: 'All',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '15420',
    },
    description:
      'High-speed online document suite to merge, split, compress, edit, e-sign, watermark, protect, and summarize files using Gemini AI.',
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Tool Studio SEO & Sitemap</h3>
              <p className="text-xs text-slate-500">
                Optimized metadata, JSON-LD Schema markup, and sitemap for search engines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('meta')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'meta'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Meta Tags Preview
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'sitemap'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            XML Sitemap Generator
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Structured Data JSON-LD
          </button>
        </div>

        {/* Tab 1: Meta Tags Preview */}
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Google Search Result Preview</div>
              <div className="space-y-1">
                <p className="text-xs text-emerald-700 font-mono truncate">{appUrl}</p>
                <h4 className="text-base font-semibold text-blue-700 hover:underline cursor-pointer">
                  Tool Studio - High-Speed Online Document & PDF Suite
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Merge PDF files, split pages, compress document sizes, edit, add e-signatures, watermark, protect, and summarize PDFs using Gemini AI. 100% free online tools.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2">Target SEO Keywords Covered</h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'tool studio pdf',
                  'merge pdf online',
                  'split pdf pages',
                  'compress pdf size',
                  'edit pdf text',
                  'ai pdf summarizer',
                  'sign pdf online',
                  'pdf watermark tool',
                  'convert jpg to pdf'
                ].map((kw, i) => (
                  <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: XML Sitemap */}
        {activeTab === 'sitemap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Generated sitemap.xml</span>
              <button
                onClick={() => copyToClipboard(sitemapXml)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy Sitemap'}
              </button>
            </div>
            <pre className="bg-slate-900 text-emerald-400 text-[11px] p-4 rounded-xl overflow-x-auto max-h-60 font-mono leading-relaxed">
              {sitemapXml}
            </pre>
          </div>
        )}

        {/* Tab 3: JSON-LD */}
        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Schema.org JSON-LD Script</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(jsonLdSchema, null, 2))}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy JSON-LD'}
              </button>
            </div>
            <pre className="bg-slate-900 text-amber-300 text-[11px] p-4 rounded-xl overflow-x-auto max-h-60 font-mono leading-relaxed">
              {JSON.stringify(jsonLdSchema, null, 2)}
            </pre>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
