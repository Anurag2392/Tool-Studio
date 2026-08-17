import React, { useState } from 'react';
import { FileText, Shield, Lock, Globe, Mail, Send, CheckCircle2 } from 'lucide-react';
import { ToolId, AdConfig } from '../types';
import { LanguageOption } from '../data/languages';
import { sendEmailNotification } from '../lib/emailNotifier';

interface FooterProps {
  onSelectTool: (id: ToolId) => void;
  onOpenSeo: () => void;
  onOpenSeoSettings?: () => void;
  onOpenAdSenseSettings?: () => void;
  onOpenPricing: () => void;
  onOpenHostinger?: () => void;
  adConfig: AdConfig;
  onOpenLanguage?: () => void;
  currentLanguage?: LanguageOption;
  onOpenLegal?: (tab?: 'privacy' | 'terms' | 'security' | 'cookies' | 'privacy-ads') => void;
  onOpenAdminEmails?: () => void;
  onRestartTour?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTool,
  onOpenSeo,
  onOpenSeoSettings,
  onOpenAdSenseSettings,
  onOpenPricing,
  onOpenHostinger,
  adConfig,
  onOpenLanguage,
  currentLanguage,
  onOpenLegal,
  onOpenAdminEmails,
  onRestartTour,
}) => {
  const [connectEmail, setConnectEmail] = useState('');
  const [connectStatus, setConnectStatus] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleEmailConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectEmail || !connectEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setIsConnecting(true);
    setConnectStatus(null);

    await sendEmailNotification({
      type: 'EMAIL_CONNECT',
      userEmail: connectEmail,
      userName: connectEmail.split('@')[0],
      details: `User connected their email directly via Tool Studio Footer Connect widget`,
      targetEmail: 'support@tool-studio.in',
    });

    setIsConnecting(false);
    setConnectStatus(`Connected! Email sent to support@tool-studio.in`);
    setConnectEmail('');
  };
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black">
                <FileText size={20} />
              </div>
              <span className="font-black text-xl tracking-tight">
                TOOL <span className="text-emerald-500">STUDIO</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-speed, browser-local document processing suite. Merge, split, edit, compress, e-sign, and analyze documents with complete privacy and Gemini AI intelligence.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
                <Shield size={12} /> 100% Client Local Security
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2.5 py-1 rounded-full">
                <Lock size={12} /> Privacy First
              </span>
            </div>
            <div className="pt-2 space-y-2">
              <a
                href="mailto:support@tool-studio.in"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl"
              >
                <Mail size={13} className="text-emerald-400" />
                <span>Contact: support@tool-studio.in</span>
              </a>

              {/* Connect Email Quick Form */}
              <form onSubmit={handleEmailConnect} className="pt-1">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Connect Email for Instant Updates & Support
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="email"
                    value={connectEmail}
                    onChange={(e) => setConnectEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50 transition-colors"
                  >
                    <Send size={12} /> Connect
                  </button>
                </div>
                {connectStatus && (
                  <p className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {connectStatus}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Popular PDF Tools Column 1 */}
          <div>
            <h3 className="text-white text-xs font-extrabold uppercase tracking-wider mb-3">Popular Tools</h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onSelectTool('merge')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Merge PDF Documents
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('split')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Split & Extract Pages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('compress')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Compress PDF Size
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('edit')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Edit & Annotate PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('sign')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Sign PDF Online
                </button>
              </li>
            </ul>
          </div>

          {/* Organize & Security Column 2 */}
          <div>
            <h3 className="text-white text-xs font-extrabold uppercase tracking-wider mb-3">Organize & Security</h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onSelectTool('organize')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Organize & Reorder Pages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('watermark')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Add Watermark
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('protect')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Protect PDF Password
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('unlock')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Unlock PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('image-to-pdf')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  JPG & Images to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* AI Tools & Features */}
          <div>
            <h3 className="text-white text-xs font-extrabold uppercase tracking-wider mb-3">AI & Subscriptions</h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button onClick={() => onSelectTool('ai-summarize')} className="hover:text-purple-400 transition-colors flex items-center gap-1 text-purple-300 font-bold cursor-pointer">
                  ✨ Gemini AI Document Chat
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('ocr')} className="hover:text-purple-400 transition-colors flex items-center gap-1 text-slate-300 font-bold cursor-pointer">
                  🔍 Gemini Vision OCR
                </button>
              </li>
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
                  👑 PhonePe Pro Subscriptions
                </button>
              </li>
              {onRestartTour && (
                <li>
                  <button onClick={onRestartTour} className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-400 font-bold cursor-pointer">
                    🚀 Interactive Site Tour
                  </button>
                </li>
              )}
              {onOpenLanguage && (
                <li>
                  <button onClick={onOpenLanguage} className="hover:text-sky-400 transition-colors flex items-center gap-1 text-sky-300 font-bold cursor-pointer">
                    <Globe size={13} /> Select Language ({currentLanguage?.nativeName || 'English'})
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Tool Studio. All rights reserved. High-speed document tools.</p>
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <button
              onClick={() => onOpenLegal && onOpenLegal('privacy-ads')}
              className="hover:text-amber-300 text-amber-400 font-bold cursor-pointer flex items-center gap-1"
            >
              Privacy & Ads
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('terms')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('privacy')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('security')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Security & GDPR
            </button>
            <button
              onClick={() => onOpenLegal && onOpenLegal('cookies')}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Cookie Settings
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
