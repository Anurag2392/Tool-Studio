import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, Cookie, CheckCircle2, AlertTriangle, Mail, Globe, Sparkles, X, Server, ExternalLink, Megaphone } from 'lucide-react';

interface LegalSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'security' | 'cookies' | 'privacy-ads';
}

export const LegalSecurityModal: React.FC<LegalSecurityModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'security' | 'cookies' | 'privacy-ads'>(initialTab);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [functionalConsent, setFunctionalConsent] = useState(true);
  const [savedCookies, setSavedCookies] = useState(false);

  if (!isOpen) return null;

  const handleSaveCookiePreferences = () => {
    localStorage.setItem(
      'tool_studio_cookie_consent',
      JSON.stringify({ analytics: analyticsConsent, functional: functionalConsent, date: new Date().toISOString() })
    );
    setSavedCookies(true);
    setTimeout(() => setSavedCookies(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold shadow-sm">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Legal, Compliance & Security</h3>
              <p className="text-xs text-slate-500 font-medium">
                GDPR & CCPA Compliant • 100% Client-Isolated Privacy • Tool Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock size={14} /> Security & Virus Scan
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck size={14} /> Privacy Policy (GDPR)
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={14} /> Terms of Service
          </button>

          <button
            onClick={() => setActiveTab('privacy-ads')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'privacy-ads'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone size={14} /> Privacy & Ads
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cookies'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cookie size={14} /> Cookie Preferences
          </button>
        </div>

        {/* TAB 1: SECURITY & VIRUS GUARANTEE */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-emerald-900 text-sm">100% In-Browser Memory Isolation & Auto-Purge</h4>
                <p className="text-emerald-800 mt-1">
                  At Tool Studio, document security is our highest engineering priority. All PDF merging, splitting, compressing, and editing take place locally inside your browser's sandboxed WebAssembly execution environment. Your files are never stored on permanent server disks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1">
                  <Lock size={14} className="text-emerald-600" /> 256-Bit SSL Encryption
                </span>
                <p className="text-slate-600 text-[11px]">
                  All web interactions, API routes, and network requests utilize standard high-grade HTTPS TLS 1.3 encryption.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-blue-600" /> Automated Malware Scanning
                </span>
                <p className="text-slate-600 text-[11px]">
                  Upload buffers are inspected for dangerous script injections, macro payloads, and malicious structure anomalies.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1">
                  <Server size={14} className="text-purple-600" /> Zero Data Selling
                </span>
                <p className="text-slate-600 text-[11px]">
                  We strictly do not profile, sell, trade, or share user files or metadata with third-party data brokers.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-amber-600" /> Instant Buffer Purge
                </span>
                <p className="text-slate-600 text-[11px]">
                  When you download your result or close your tab, temporary binary buffers are completely cleared from RAM memory.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVACY POLICY (GDPR & CCPA) */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-2">
            <h4 className="font-black text-slate-900 text-sm">Tool Studio Global Privacy Policy</h4>
            <p>
              Effective Date: July 2026. Tool Studio (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy in full compliance with the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
            </p>

            <h5 className="font-bold text-slate-800">1. Information We Collect</h5>
            <p>
              Tool Studio operates primarily as a browser-first application. We do not require account registration to use basic tools. If you upgrade via PhonePe or create an account, we process minimal credentials (email, account status, payment confirmation tokens).
            </p>

            <h5 className="font-bold text-slate-800">2. Document Files Handling</h5>
            <p>
              Your uploaded PDF and image files are processed in real-time. We do not read, index, store, or train AI models on your private documents. AI Summarization requests send isolated page text snippets directly to Gemini AI API via secure, stateless server proxies and are not retained.
            </p>

            <h5 className="font-bold text-slate-800">3. Your Data Rights</h5>
            <p>
              Under GDPR, you have the right to access, rectify, or request deletion of any personal data associated with your account. To exercise your privacy rights, please contact our Data Protection Officer at <strong className="text-slate-900">support@tool-studio.in</strong>.
            </p>
          </div>
        )}

        {/* TAB 3: TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-2">
            <h4 className="font-black text-slate-900 text-sm">Terms of Service & Usage Conditions</h4>
            <p>
              By accessing Tool Studio (tool-studio.in), you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h5 className="font-bold text-slate-800">1. Acceptable Use</h5>
            <p>
              You agree not to use Tool Studio to upload illegal content, malicious software, copyrighted materials without authorization, or perform automated spamming against our infrastructure.
            </p>

            <h5 className="font-bold text-slate-800">2. Pro Subscriptions & PhonePe Billing</h5>
            <p>
              Upgrades to Tool Studio Pro are processed securely via PhonePe. Pro subscriptions provide ad-free browsing, priority processing, and unlimited AI summaries. Subscriptions can be managed or canceled at any time.
            </p>

            <h5 className="font-bold text-slate-800">3. Disclaimer of Warranties</h5>
            <p>
              Tool Studio provides document utilities on an &quot;as is&quot; and &quot;as available&quot; basis. While we strive for 99.9% conversion accuracy, we recommend verifying critical financial or legal documents.
            </p>
          </div>
        )}

        {/* TAB 4: COOKIE CONSENT MANAGER */}
        {activeTab === 'cookies' && (
          <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Cookie size={16} className="text-amber-600" /> Manage Cookie Preferences
              </h4>
              <p className="text-slate-600 text-xs">
                We use cookies to maintain your selected language, save tool preferences, and verify PhonePe Pro account status.
              </p>

              <div className="space-y-3 pt-2">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">Strictly Necessary Cookies</span>
                    <span className="text-[11px] text-slate-500">Required for language preferences and PhonePe login sessions.</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                    Always Active
                  </span>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">Performance & Usage Analytics</span>
                    <span className="text-[11px] text-slate-500">Helps us monitor tool processing speeds and fix errors.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                  <div>
                    <span className="font-bold text-slate-900 block">Functional & Personalization Cookies</span>
                    <span className="text-[11px] text-slate-500">Remembers recently used PDF tools and UI layout state.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={functionalConsent}
                    onChange={(e) => setFunctionalConsent(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {savedCookies && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Preferences Saved!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSaveCookiePreferences}
                  className="ml-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Save Consent Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PRIVACY & ADS DISCLOSURE */}
        {activeTab === 'privacy-ads' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed max-h-80 overflow-y-auto pr-2">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Megaphone size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-amber-950 text-sm">Third-Party Advertising & Cookie Data Usage</h4>
                <p className="text-amber-900 mt-1">
                  Tool Studio utilizes third-party advertising services, including Google AdSense, to keep our core document utilities 100% free for all global users.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">How Third-Party Ad Providers Use Data</h5>
              <p className="text-slate-600">
                Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to Tool Studio or other websites on the internet.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Anonymized signals (such as device type, browser language, and coarse geographical area) are processed to serve contextual ads.</li>
                <li>No personal document contents, uploaded PDFs, or private file buffers are ever shared with or accessible to ad providers.</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Globe size={14} className="text-blue-600" /> Google Partner Sites Data Policy
              </h5>
              <p className="text-slate-600 text-[11px]">
                To learn more about how Google collects and processes data when you visit sites that use Google AdSense services, please visit Google's official privacy guidance:
              </p>
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 underline pt-1 cursor-pointer"
              >
                <span>How Google uses data when you use our partners' sites or apps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-1.5 bg-white">
              <h5 className="font-bold text-slate-900">Opting Out of Personalized Ads</h5>
              <p className="text-slate-600 text-[11px]">
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Google Ads Settings</a> or by opting out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">www.aboutads.info</a>.
              </p>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 -mx-6 -mb-6 p-4 px-6 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <Mail size={13} className="text-emerald-600" />
            <span>Questions? Email Data Protection Officer: <a href="mailto:support@tool-studio.in" className="font-bold text-slate-800 underline hover:text-emerald-600">support@tool-studio.in</a></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
