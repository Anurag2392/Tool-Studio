import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Check, Eye, Image as ImageIcon, ShieldCheck, Key, RefreshCw, Code, Tag, MessageSquare, Download, Upload } from 'lucide-react';

interface AltTextWriterToolProps {
  onBack: () => void;
  onSuccessAction?: () => void;
}

export interface AltTextResult {
  conciseAltText: string;
  detailedDescription: string;
  seoKeywords: string[];
  socialCaption: string;
}

export const AltTextWriterTool: React.FC<AltTextWriterToolProps> = ({ onBack, onSuccessAction }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [tone, setTone] = useState<'professional' | 'descriptive' | 'e-commerce' | 'social'>('professional');
  const [context, setContext] = useState('');
  const [engine, setEngine] = useState<'fast' | 'precision' | 'deep'>('fast');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AltTextResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [copiedAlt, setCopiedAlt] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedDetailed, setCopiedDetailed] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = () => {
      setBase64Data(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleGenerateAltText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Data) {
      alert('Please upload or select an image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/gemini/generate-alt-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: imageFile?.type || 'image/png',
          filename: imageFile?.name || 'uploaded_image.png',
          engine,
          tone,
          context,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate Alt Text');
      }

      const resData: AltTextResult = await res.json();
      setResult(resData);
      if (onSuccessAction) onSuccessAction();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const htmlSnippet = `<img src="${imageFile?.name || 'image.png'}" alt="${result?.conciseAltText || ''}" />`;

  const copyToClipboard = (text: string, setCopiedFn: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> All Tools
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Eye size={18} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Alt Text & Description Writer</h2>
            <p className="text-xs text-slate-500">Generate WCAG 2.2 compliant alt text, screen reader descriptions, and SEO image tags with Intelligent Vision Engine.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Upload Zone */}
        {!previewUrl ? (
          <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all space-y-3 group text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-sm">Click or Drag Image Here to Upload</p>
              <p className="text-xs text-slate-500 mt-0.5">Supports PNG, JPG, WEBP, GIF (Max 15MB)</p>
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-4">
            <div className="flex items-center gap-4">
              <img src={previewUrl} alt="Upload Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-xs" />
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs truncate max-w-xs">{imageFile?.name || 'Selected Image'}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : 'Image Loaded'}
                </p>
              </div>
            </div>

            <label className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors">
              Change Image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        )}

        {/* Configuration Options */}
        <form onSubmit={handleGenerateAltText} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800">Writing Tone / Purpose</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              >
                <option value="professional">Professional / WCAG Standard</option>
                <option value="descriptive">Detailed / Screen Reader Accessible</option>
                <option value="e-commerce">E-Commerce Product Listing</option>
                <option value="social">Social Media & Blog Storytelling</option>
              </select>
            </div>

            {/* Context Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800">Image Context or Niche (Optional)</label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Modern SaaS Dashboard, Nike Shoes, Fashion Blog"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* AI Engine Selection */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-xs font-bold text-slate-200">Active Processing Engine:</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setEngine('fast')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    engine === 'fast' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fast Neural Engine
                </button>
                <button
                  type="button"
                  onClick={() => setEngine('precision')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    engine === 'precision' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  High-Precision Engine
                </button>
                <button
                  type="button"
                  onClick={() => setEngine('deep')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    engine === 'deep' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Deep Analysis Engine
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Status: <strong className="text-emerald-400 font-bold">● Active & Ready</strong></span>
              <span>No external API keys required</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !base64Data}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Analyzing Image & Writing Alt Text...
              </>
            ) : (
              <>
                <Eye size={16} /> Generate WCAG Alt Text & SEO Captions
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Results View */}
        {result && (
          <div className="space-y-6 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
            {/* Concise Alt Text Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-emerald-400" />
                  <h3 className="font-extrabold text-xs text-emerald-400 uppercase tracking-wider">
                    WCAG 2.2 Compliant HTML Alt Text
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard(result.conciseAltText, setCopiedAlt)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  {copiedAlt ? <Check size={14} /> : <Copy size={14} />}
                  {copiedAlt ? 'Copied Alt Text!' : 'Copy Alt Text'}
                </button>
              </div>

              <p className="text-sm font-semibold text-slate-100 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                "{result.conciseAltText}"
              </p>
            </div>

            {/* HTML Snippet Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Code size={14} className="text-purple-600" /> HTML Image Tag Ready for Web
                </span>
                <button
                  onClick={() => copyToClipboard(htmlSnippet, setCopiedHtml)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedHtml ? <Check size={12} /> : <Copy size={12} />}
                  {copiedHtml ? 'Copied HTML' : 'Copy HTML Code'}
                </button>
              </div>
              <pre className="bg-white p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 overflow-x-auto">
                {htmlSnippet}
              </pre>
            </div>

            {/* Detailed Screen Reader Description */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-blue-600" /> Detailed Accessibility Screen Reader Description
                </span>
                <button
                  onClick={() => copyToClipboard(result.detailedDescription, setCopiedDetailed)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  {copiedDetailed ? <Check size={12} /> : <Copy size={12} />}
                  {copiedDetailed ? 'Copied Description' : 'Copy Description'}
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                {result.detailedDescription}
              </p>
            </div>

            {/* Social Media Caption & Hashtags */}
            {result.socialCaption && (
              <div className="bg-purple-950/40 border border-purple-800/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-purple-300">Social Media Post Caption</span>
                  <button
                    onClick={() => copyToClipboard(result.socialCaption, setCopiedCaption)}
                    className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCaption ? <Check size={12} /> : <Copy size={12} />}
                    {copiedCaption ? 'Copied Caption' : 'Copy Caption'}
                  </button>
                </div>
                <p className="text-xs text-purple-100 font-medium">{result.socialCaption}</p>
              </div>
            )}

            {/* SEO Keywords Badges */}
            {result?.seoKeywords && (result.seoKeywords?.length || 0) > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">SEO Image Subject Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {result.seoKeywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
