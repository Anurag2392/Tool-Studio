import React, { useState } from 'react';
import { Server, Download, Check, Copy, Shield, Globe, ExternalLink, HardDrive, Terminal } from 'lucide-react';

interface HostingerDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingerDeploymentModal: React.FC<HostingerDeploymentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedHtaccess, setCopiedHtaccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'htaccess' | 'dns'>('guide');

  if (!isOpen) return null;

  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Hostinger Cache Control & Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>`;

  const copyHtaccess = () => {
    navigator.clipboard.writeText(htaccessContent);
    setCopiedHtaccess(true);
    setTimeout(() => setCopiedHtaccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">
              <Server size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">Hostinger Deployment Setup</h3>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  Tool Studio Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Complete guide and server settings to deploy Tool Studio directly on Hostinger hPanel or VPS.
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
            onClick={() => setActiveTab('guide')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Step-by-Step Deployment Guide
          </button>
          <button
            onClick={() => setActiveTab('htaccess')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'htaccess'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            .htaccess SPA Rewrites
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'dns'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Domain & SSL Settings
          </button>
        </div>

        {/* Tab 1: Step by step Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
              <HardDrive size={20} className="text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-950 leading-relaxed">
                <strong className="font-bold">Hostinger Compatibility:</strong> Tool Studio processes all documents 100% locally in the client browser session using WebAssembly & JS. It runs seamlessly on Hostinger Premium Shared Hosting, Business Hosting, or Cloud Hosting with zero backend server dependencies required.
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Deploy to Hostinger in 4 Easy Steps</h4>
              
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="font-bold text-slate-900">Build / Export Web Artifacts</strong>
                    <p className="text-slate-500 mt-0.5">
                      Export your app from the AI Studio top bar settings (Export ZIP) or run <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">npm run build</code> locally to create the <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">dist</code> directory.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="font-bold text-slate-900">Login to Hostinger hPanel File Manager</strong>
                    <p className="text-slate-500 mt-0.5">
                      Open your Hostinger Dashboard → File Manager → navigate to <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">public_html</code> directory of your domain.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="font-bold text-slate-900">Upload Files to public_html</strong>
                    <p className="text-slate-500 mt-0.5">
                      Upload all contents of your compiled <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">dist</code> folder (index.html, assets, .htaccess) directly inside <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">public_html</code>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                  <div>
                    <strong className="font-bold text-slate-900">Verify .htaccess SPA Routing Rules</strong>
                    <p className="text-slate-500 mt-0.5">
                      Ensure the <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">.htaccess</code> file is present in <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-mono">public_html</code> to enable clean tool URLs (e.g. #tool-merge).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: .htaccess File */}
        {activeTab === 'htaccess' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Hostinger .htaccess File Content</span>
              <button
                onClick={copyHtaccess}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedHtaccess ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copiedHtaccess ? 'Copied to Clipboard' : 'Copy .htaccess'}
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-400 text-[11px] p-4 rounded-2xl overflow-x-auto font-mono leading-relaxed border border-slate-800">
              {htaccessContent}
            </pre>

            <p className="text-[11px] text-slate-500">
              * Note: In Hostinger hPanel File Manager, make sure "Show Hidden Files" is toggled ON so you can edit <code className="font-mono bg-slate-100 px-1 rounded">.htaccess</code>.
            </p>
          </div>
        )}

        {/* Tab 3: Domain & SSL */}
        {activeTab === 'dns' && (
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Globe size={16} className="text-indigo-600" /> Hostinger SSL & HTTPS Activation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                In Hostinger hPanel → Security → SSL → Click <strong>"Install SSL"</strong> (Unlimited Free Let's Encrypt SSL). Turn on <strong>"Force HTTPS"</strong> to enforce encrypted connections for all Tool Studio users.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Shield size={16} className="text-emerald-600" /> Data Privacy & Hostinger Storage
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Because Tool Studio operates fully inside client-side browser memory via WebAssembly and HTML5 File APIs, no user PDF documents or personal files are ever transmitted to or stored on Hostinger server disks.
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-medium">
            © Tool Studio. All rights reserved. Hostinger optimized.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
