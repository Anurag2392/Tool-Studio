import React, { useState, useEffect } from 'react';
import { ToolId, UserPlan, AdConfig } from './types';
import { TOOLS_LIST } from './data/toolsList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToolGrid } from './components/ToolGrid';
import { AdBanner } from './components/AdBanner';
import { AdSlot } from './components/AdSlot';
import { ADSENSE_CONFIG, ensureAdSenseScriptLoaded } from './config/adsense';
import { PricingModal } from './components/PricingModal';
import { SeoDrawer } from './components/SeoDrawer';
import { SeoContentSection } from './components/SeoContentSection';

// New Modals for Login, PhonePe & AdSense
import { LoginModal, UserAccount } from './components/LoginModal';
import { PhonePeModal } from './components/PhonePeModal';
import { AdSenseSettingsModal } from './components/AdSenseSettingsModal';
import { HostingerDeploymentModal } from './components/HostingerDeploymentModal';
import { ProUpsellModal } from './components/ProUpsellModal';

// Individual Tool Components
import { MergeTool } from './components/tools/MergeTool';
import { SplitTool } from './components/tools/SplitTool';
import { CompressTool } from './components/tools/CompressTool';
import { EditAnnotateTool } from './components/tools/EditAnnotateTool';
import { AiAssistantTool } from './components/tools/AiAssistantTool';
import { SignTool } from './components/tools/SignTool';
import { OrganizeTool } from './components/tools/OrganizeTool';
import { RotateTool } from './components/tools/RotateTool';
import { WatermarkTool } from './components/tools/WatermarkTool';
import { PageNumbersTool } from './components/tools/PageNumbersTool';
import { ProtectUnlockTool } from './components/tools/ProtectUnlockTool';
import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { PdfToImageTool } from './components/tools/PdfToImageTool';
import { OcrTool } from './components/tools/OcrTool';
import { EditMetadataTool } from './components/tools/EditMetadataTool';
import { YoutubeKeywordsTool } from './components/tools/YoutubeKeywordsTool';
import { AltTextWriterTool } from './components/tools/AltTextWriterTool';
import { Pi7ImageSuiteTool } from './components/tools/Pi7ImageSuiteTool';
import { CalculatorsSuiteTool } from './components/tools/CalculatorsSuiteTool';
import { GenericUtilityTool } from './components/tools/GenericUtilityTool';
import { LanguageModal } from './components/LanguageModal';
import { LegalSecurityModal } from './components/LegalSecurityModal';
import { AdminEmailModal } from './components/AdminEmailModal';
import { LANGUAGES, LanguageOption } from './data/languages';
import { ToolSkeletonLoader } from './components/ToolSkeletonLoader';

import { SeoSettingsModal } from './components/SeoSettingsModal';
import { Breadcrumb } from './components/Breadcrumb';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [currentToolId, setCurrentToolId] = useState<ToolId | null>(null);
  const [isToolLoading, setIsToolLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSeoDrawer, setShowSeoDrawer] = useState(false);
  const [showSeoSettingsModal, setShowSeoSettingsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPhonePeModal, setShowPhonePeModal] = useState(false);
  const [loginNotice, setLoginNotice] = useState<string | null>(null);
  const [pendingPaymentFlow, setPendingPaymentFlow] = useState(false);

  const handleOpenPhonePe = () => {
    if (!userAccount.isLoggedIn) {
      setShowPricingModal(false);
      setShowProUpsellModal(false);
      setLoginNotice('Website Google Login Required: You must first sign in with Google or create an account on our website before purchasing a license and accessing our services.');
      setPendingPaymentFlow(true);
      setShowLoginModal(true);
      return;
    }
    setShowPricingModal(false);
    setShowProUpsellModal(false);
    setShowPhonePeModal(true);
  };
  const [showAdSenseModal, setShowAdSenseModal] = useState(false);
  const [showHostingerModal, setShowHostingerModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showAdminEmailModal, setShowAdminEmailModal] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'security' | 'cookies' | 'privacy-ads'>('privacy');
  const [authTxnParam, setAuthTxnParam] = useState<string | null>(null);
  const [adminAuthBanner, setAdminAuthBanner] = useState<{
    txnId: string;
    status: 'ACTIVATED' | 'FAILED';
    message: string;
  } | null>(null);

  // Check URL query parameters for Admin Payment Authorization Link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const adminApproveTxn = urlParams.get('admin_approve_txn');
      const token = urlParams.get('token');
      const authTxn = urlParams.get('auth_txn');

      if (adminApproveTxn) {
        // Trigger Admin License Authorization
        fetch('/api/payment/admin-authorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: adminApproveTxn, token }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const rawPlan = data.transaction?.plan || 'Pro Annual';
              const is1Day = rawPlan === '1 Day Pro Pass' || rawPlan.includes('1 Day');
              const isMonthly = rawPlan === 'Pro Monthly' || rawPlan.includes('Monthly');

              const planTitle = is1Day ? '1 Day Pro Pass' : isMonthly ? 'Pro Monthly' : 'Pro Annual';
              const durationMs = is1Day
                ? 24 * 60 * 60 * 1000 // 24 Hours
                : isMonthly
                ? 30 * 24 * 60 * 60 * 1000 // 30 Days
                : 365 * 24 * 60 * 60 * 1000; // 365 Days

              const activatedPlan: UserPlan = {
                isPro: true,
                planName: planTitle,
                proExpiryDate: Date.now() + durationMs,
                dailyLimitUsed: 0,
                dailyLimitMax: 999999,
              };
              setUserPlan(activatedPlan);
              localStorage.setItem('toolstudio_user_plan', JSON.stringify(activatedPlan));

              // Clean up URL query parameters without full page unmount if already on page
              window.history.replaceState({}, document.title, window.location.pathname);

              setAdminAuthBanner({
                txnId: adminApproveTxn,
                status: 'ACTIVATED',
                message: `License successfully authorized and activated for transaction ${adminApproveTxn} by support@tool-studio.in!`,
              });

              // Force quick smooth state update / reload if requested to guarantee all components reflect active Pro state
              setTimeout(() => {
                window.location.href = window.location.pathname + '?license_activated=true';
              }, 1200);
            }
          })
          .catch(() => {
            // Quiet error handling
          });
      } else if (authTxn) {
        setAuthTxnParam(authTxn);
      }
    }
  }, []);

  // Selected Language state
  const [currentLanguage, setCurrentLanguage] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem('tool_studio_language');
    if (saved) {
      const found = LANGUAGES.find((l) => l.code === saved);
      if (found) return found;
    }
    return LANGUAGES.find((l) => l.code === 'en') || LANGUAGES[5];
  });

  // Sync document direction and lang attributes
  useEffect(() => {
    if (currentLanguage) {
      document.documentElement.lang = currentLanguage.code;
      document.documentElement.dir = currentLanguage.rtl ? 'rtl' : 'ltr';
    }
  }, [currentLanguage]);

  // Dynamic SEO Document Title & Meta Tags Updater
  useEffect(() => {
    const applySeo = () => {
      let pageTitle = 'Tool Studio - Free Online PDF & Document Utility Suite';
      let pageDesc = '100% free, private & fast browser-based PDF converter, merger, compressor, editor & AI document tools with zero server uploads.';
      let pageKw = 'pdf converter, merge pdf, compress pdf, pdf to word, pdf to excel, pdf ocr, free pdf tools';
      let canonicalUrl = 'https://tool-studio.in/';

      try {
        const stored = localStorage.getItem('toolstudio_seo_config');
        if (stored) {
          const config = JSON.parse(stored);
          if (currentToolId && config.tools?.[currentToolId]) {
            const toolCfg = config.tools[currentToolId];
            if (toolCfg.title) pageTitle = toolCfg.title;
            if (toolCfg.metaDescription) pageDesc = toolCfg.metaDescription;
            if (toolCfg.keywords) pageKw = toolCfg.keywords;
            canonicalUrl = `https://tool-studio.in/#tool-${currentToolId}`;
          } else if (config.globalTitle) {
            pageTitle = config.globalTitle;
            if (config.globalDescription) pageDesc = config.globalDescription;
            if (config.globalKeywords) pageKw = config.globalKeywords;
            if (config.canonicalDomain) canonicalUrl = config.canonicalDomain;
          }
        } else if (currentToolId) {
          const toolMeta = TOOLS_LIST.find((t) => t.id === currentToolId);
          if (toolMeta) {
            pageTitle = toolMeta.seoTitle || `${toolMeta.name} - Free Online Tool | Tool Studio`;
            pageDesc = toolMeta.shortDesc || pageDesc;
            canonicalUrl = `https://tool-studio.in/#tool-${currentToolId}`;
          }
        }
      } catch (e) {
        // Quiet handling
      }

      // Update Document Title
      document.title = pageTitle;

      // Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', pageDesc);

      // Meta Keywords
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement('meta');
        metaKw.setAttribute('name', 'keywords');
        document.head.appendChild(metaKw);
      }
      metaKw.setAttribute('content', pageKw);

      // Canonical Link Tag
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);

      // OpenGraph Tags
      const setMetaProperty = (prop: string, val: string) => {
        let tag = document.querySelector(`meta[property="${prop}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', prop);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', val);
      };

      setMetaProperty('og:title', pageTitle);
      setMetaProperty('og:description', pageDesc);
      setMetaProperty('og:url', canonicalUrl);
      setMetaProperty('og:type', 'website');
      setMetaProperty('og:site_name', 'Tool Studio Pro');
    };

    applySeo();
    window.addEventListener('seo-config-updated', applySeo);
    return () => window.removeEventListener('seo-config-updated', applySeo);
  }, [currentToolId]);

  // User Account State
  const [userAccount, setUserAccount] = useState<UserAccount>({
    isLoggedIn: false,
    name: 'Guest User',
    email: '',
  });

  // Monetization User Plan State with Daily Usage tracking and 1-Day Pass expiry check
  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    const today = new Date().toISOString().slice(0, 10);
    let isPro = false;
    let planName: UserPlan['planName'] = 'Free';
    let proExpiryDate: number | undefined = undefined;

    try {
      const savedPlanStr = localStorage.getItem('toolstudio_user_plan');
      if (savedPlanStr) {
        const savedPlan = JSON.parse(savedPlanStr);
        if (savedPlan.isPro) {
          if (savedPlan.proExpiryDate && Date.now() > savedPlan.proExpiryDate) {
            isPro = false;
            planName = 'Free';
            localStorage.removeItem('toolstudio_user_plan');
          } else {
            isPro = true;
            planName = savedPlan.planName || 'Pro Monthly';
            proExpiryDate = savedPlan.proExpiryDate;
          }
        }
      }
    } catch (e) {
      // Quiet handling
    }

    let dailyLimitUsed = 0;
    try {
      const savedDate = localStorage.getItem('toolstudio_daily_usage_date');
      const savedCount = localStorage.getItem('toolstudio_daily_usage_count');
      if (savedDate === today && savedCount) {
        dailyLimitUsed = parseInt(savedCount, 10) || 0;
      } else {
        localStorage.setItem('toolstudio_daily_usage_date', today);
        localStorage.setItem('toolstudio_daily_usage_count', '0');
      }
    } catch (e) {
      // Quiet handling
    }

    return {
      isPro,
      planName,
      dailyLimitUsed,
      dailyLimitMax: isPro ? 99999 : 3,
      proExpiryDate,
    };
  });

  const [showProUpsellModal, setShowProUpsellModal] = useState(false);

  // Google AdSense Config State
  const [adConfig, setAdConfig] = useState<AdConfig>(() => {
    try {
      const saved = localStorage.getItem('toolstudio_adsense_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Quiet handling
    }
    return {
      enabled: true,
      publisherId: ADSENSE_CONFIG.publisherId,
      headerSlot: ADSENSE_CONFIG.slots.header,
      sidebarSlot: ADSENSE_CONFIG.slots.sidebar,
      inFeedSlot: ADSENSE_CONFIG.slots.inFeed,
      simulatedImpressions: 520,
      simulatedClicks: 18,
      simulatedEarningsUsd: 14.50,
    };
  });

  // Dynamically load AdSense meta and script in production runtime
  useEffect(() => {
    if (adConfig.enabled) {
      ensureAdSenseScriptLoaded(adConfig.publisherId);
    }
  }, [adConfig.enabled, adConfig.publisherId]);

  // Handle successful PhonePe Upgrade or manual Pro upgrade
  const handleUpgradeUser = (planName: '1 Day Pro Pass' | 'Pro Monthly' | 'Pro Annual') => {
    const is1Day = planName === '1 Day Pro Pass';
    const isMonthly = planName === 'Pro Monthly';
    const proExpiryDate = is1Day
      ? Date.now() + 24 * 60 * 60 * 1000 // 24 Hours
      : isMonthly
      ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 Days
      : Date.now() + 365 * 24 * 60 * 60 * 1000; // 365 Days

    const newPlanState: UserPlan = {
      isPro: true,
      planName,
      dailyLimitUsed: 0,
      dailyLimitMax: 99999,
      proExpiryDate,
    };

    setUserPlan(newPlanState);
    localStorage.setItem('toolstudio_user_plan', JSON.stringify({
      isPro: true,
      planName,
      proExpiryDate,
    }));
    setAdConfig((prev) => ({ ...prev, enabled: false }));
  };

  // Automated License Verification & Discontinuation Effect
  useEffect(() => {
    const checkLicenseExpiry = () => {
      if (userPlan.isPro && userPlan.proExpiryDate) {
        if (Date.now() >= userPlan.proExpiryDate) {
          const expiredPlan: UserPlan = {
            isPro: false,
            planName: 'Free',
            dailyLimitUsed: 3,
            dailyLimitMax: 3,
          };
          setUserPlan(expiredPlan);
          localStorage.removeItem('toolstudio_user_plan');
          setAdminAuthBanner({
            txnId: 'EXPIRED_PASS',
            status: 'FAILED',
            message: 'Your Pro License pass duration has completed. Your plan has been automatically discontinued.',
          });
          setShowProUpsellModal(true);
        }
      }
    };

    checkLicenseExpiry();
    const interval = setInterval(checkLicenseExpiry, 10000); // Verify every 10 seconds
    return () => clearInterval(interval);
  }, [userPlan.isPro, userPlan.proExpiryDate]);

  const handlePhonePeSuccess = (
    planName: '1 Day Pro Pass' | 'Pro Monthly' | 'Pro Annual',
    paymentDetails: { paymentId: string; orderId: string }
  ) => {
    handleUpgradeUser(planName);
    if (!userAccount.isLoggedIn) {
      setUserAccount({
        isLoggedIn: true,
        name: 'Pro Subscriber',
        email: 'pro.user@toolstudio.app',
      });
    }
  };

  // Called whenever a tool runs or succeeds - increments daily limit for free users
  const handleRecordToolUsage = () => {
    setAdConfig((prev) => ({
      ...prev,
      simulatedImpressions: prev.simulatedImpressions + 1,
    }));

    if (userPlan.isPro) {
      if (userPlan.proExpiryDate && Date.now() > userPlan.proExpiryDate) {
        // 1-Day Pass expired
        const expiredPlan: UserPlan = {
          isPro: false,
          planName: 'Free',
          dailyLimitUsed: 3,
          dailyLimitMax: 3,
        };
        setUserPlan(expiredPlan);
        localStorage.removeItem('toolstudio_user_plan');
        setShowProUpsellModal(true);
      }
      return;
    }

    // Free user usage check
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('toolstudio_daily_usage_date');
    let currentCount = userPlan.dailyLimitUsed;

    if (savedDate !== today) {
      currentCount = 0;
    }

    const nextCount = currentCount + 1;
    localStorage.setItem('toolstudio_daily_usage_date', today);
    localStorage.setItem('toolstudio_daily_usage_count', String(nextCount));

    setUserPlan((prev) => ({
      ...prev,
      dailyLimitUsed: nextCount,
    }));

    if (nextCount >= 3) {
      setTimeout(() => {
        setShowProUpsellModal(true);
      }, 1000);
    }
  };

  const activeToolMeta = TOOLS_LIST.find((t) => t.id === currentToolId);

  // Dynamic SEO Title, Meta Description, Canonical & OpenGraph Tag Manager
  useEffect(() => {
    if (activeToolMeta) {
      document.title = `${activeToolMeta.name} - Free Online Tool | Tool Studio`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', `${activeToolMeta.seoTitle || activeToolMeta.shortDesc} Fast, browser-isolated, 100% free online tool by Tool Studio.`);
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${activeToolMeta.name} - Free Online Document Tool | Tool Studio`);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', activeToolMeta.shortDesc || activeToolMeta.longDesc);

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://tool-studio.in/#tool-${activeToolMeta.id}`);
    } else {
      document.title = 'Tool Studio - Complete Free Online Document & PDF Suite';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Tool Studio is a fast, 100% browser-secure online document suite. Merge, split, compress, edit, OCR, e-sign & summarize PDFs without software installation. Contact: support@tool-studio.in');
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'Tool Studio - High-Speed Online Document & PDF Tools');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', 'Merge, split, edit, compress, e-sign, and summarize PDF files securely in your browser using Gemini AI. 100% free and private.');
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', 'https://tool-studio.in/');
    }
  }, [activeToolMeta]);

  // Handle browser back button or direct anchor navigation
  useEffect(() => {
    // Always open home page view when website loads
    if (window.location.hash) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {
        window.location.hash = '';
      }
    }
    setCurrentToolId(null);
    setIsToolLoading(false);

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#tool-', '');
      if (hash && TOOLS_LIST.some((t) => t.id === hash)) {
        setIsToolLoading(true);
        setCurrentToolId(hash as ToolId);
        setTimeout(() => setIsToolLoading(false), 280);
      } else if (!hash) {
        setIsToolLoading(false);
        setCurrentToolId(null);
      }
    };

    const handleOpenAdSense = () => {
      setShowAdSenseModal(true);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('open-adsense-settings', handleOpenAdSense);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('open-adsense-settings', handleOpenAdSense);
    };
  }, []);

  const handleSelectTool = (id: ToolId | null) => {
    if (id) {
      if (!userPlan.isPro && userPlan.dailyLimitUsed >= 3) {
        setShowProUpsellModal(true);
        return;
      }
      setIsToolLoading(true);
      setCurrentToolId(id);
      window.location.hash = `tool-${id}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsToolLoading(false), 280);
    } else {
      setIsToolLoading(false);
      setCurrentToolId(null);
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <Header
        currentToolId={currentToolId}
        onSelectTool={handleSelectTool}
        userPlan={userPlan}
        userAccount={userAccount}
        onOpenPricing={() => setShowPricingModal(true)}
        onOpenPhonePe={handleOpenPhonePe}
        onOpenLogin={() => {
          setLoginNotice(null);
          setShowLoginModal(true);
        }}
        onOpenSeo={() => setShowSeoDrawer(true)}
        onOpenSeoSettings={() => setShowSeoSettingsModal(true)}
        onOpenAdSenseSettings={() => setShowAdSenseModal(true)}
        onOpenHostinger={() => setShowHostingerModal(true)}
        adConfig={adConfig}
        onToggleAds={() => setAdConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentLanguage={currentLanguage}
        onOpenLanguage={() => setShowLanguageModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        

        {/* ADMIN AUTHORIZATION CONFIRMATION BANNER */}
        {adminAuthBanner && (
          <div className="bg-emerald-950 border-2 border-emerald-400 text-white rounded-2xl p-5 shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white">ADMIN AUTHORIZATION SUCCESSFUL</span>
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      LICENSE ACTIVATED
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 mt-1 font-medium leading-relaxed">
                    Transaction <span className="font-mono font-bold text-amber-300">{adminAuthBanner.txnId}</span> verified & Pro License activated by Admin (<strong className="text-white">support@tool-studio.in</strong>). All pro tools unlocked!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAdminAuthBanner(null)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer self-end sm:self-center shrink-0"
              >
                Dismiss & Start Using Pro
              </button>
            </div>
          </div>
        )}
        
        {/* PAYMENT AUTHORIZATION LINK VERIFICATION BANNER */}
        {authTxnParam && (
          <div className="bg-emerald-950 text-emerald-100 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">Payment Authorization Verified</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase">
                      PHONEPE PG AUTH
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 mt-0.5 font-medium">
                    Transaction Ref: <span className="font-mono font-bold text-amber-300">{authTxnParam}</span> • Status: <span className="font-bold text-emerald-400">AUTHORIZED</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowPhonePeModal(true)}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  View Full Receipt
                </button>
                <button
                  onClick={() => setAuthTxnParam(null)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-emerald-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* High Visibility Header AdSlot */}
        {adConfig.enabled && (
          <AdSlot
            slot={ADSENSE_CONFIG.slots.header}
            label="SPONSORED GOOGLE ADSENSE"
            className="max-w-7xl mx-auto"
          />
        )}

        {/* If no tool selected, render Directory Grid */}
        {!currentToolId ? (
          <ToolGrid
            onSelectTool={handleSelectTool}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            adConfig={adConfig}
            langCode={currentLanguage.code}
          />
        ) : isToolLoading ? (
          <ToolSkeletonLoader
            toolName={activeToolMeta?.name}
            onBack={() => handleSelectTool(null)}
          />
        ) : (
          <ErrorBoundary>
            <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Active Tool View Routing */}
            {currentToolId === 'merge' && (
              <MergeTool
                onBack={() => handleSelectTool(null)}
                onOpenPricing={() => setShowPricingModal(true)}
                onOpenPhonePe={() => setShowPhonePeModal(true)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'split' && (
              <SplitTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'compress' && (
              <CompressTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'edit' && (
              <EditAnnotateTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'ai-summarize' && (
              <AiAssistantTool
                onBack={() => handleSelectTool(null)}
                onOpenPricing={() => setShowPricingModal(true)}
                onOpenPhonePe={() => setShowPhonePeModal(true)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'sign' && (
              <SignTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'organize' && (
              <OrganizeTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'rotate' && (
              <RotateTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'watermark' && (
              <WatermarkTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'page-numbers' && (
              <PageNumbersTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {(currentToolId === 'protect' || currentToolId === 'unlock') && (
              <ProtectUnlockTool
                mode={currentToolId}
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'image-to-pdf' && (
              <ImageToPdfTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'pdf-to-image' && (
              <PdfToImageTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'ocr' && (
              <OcrTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'metadata' && (
              <EditMetadataTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'youtube-keywords' && (
              <YoutubeKeywordsTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {currentToolId === 'alt-text-writer' && (
              <AltTextWriterTool
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {[
              'image-compressor-kb',
              'image-resizer',
              'image-cropper',
              'increase-image-size',
              'remove-bg-transparent',
              'image-converter',
              'dpi-enhancer',
              'blur-pixelate-image'
            ].includes(currentToolId || '') && (
              <Pi7ImageSuiteTool
                initialMode={currentToolId as any}
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {(currentToolId === 'calculators' || (currentToolId && currentToolId.startsWith('calculator-'))) && (
              <CalculatorsSuiteTool
                initialCalcId={currentToolId.replace('calculator-', '')}
                onBack={() => handleSelectTool(null)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {[
              'crop',
              'flatten',
              'grayscale',
              'extract-images',
              'bates-numbering',
              'n-up',
              'deskew',
              'repair',
              'alternate-mix',
              'pdf-to-word',
              'word-to-pdf',
              'excel-to-pdf',
              'ppt-to-pdf',
              'html-to-pdf',
              'pdf-to-excel',
              'pdf-to-ppt',
              'pdf-to-pdfa',
              'redact',
              'compare',
              'pdf-to-zip',
              'scan-to-pdf',
              'resize-pdf',
              'blank-pages',
              'forms',
            ].includes(currentToolId || '') && (
              <GenericUtilityTool
                toolId={currentToolId!}
                onBack={() => handleSelectTool(null)}
                onOpenPricing={() => setShowPricingModal(true)}
                onOpenPhonePe={() => setShowPhonePeModal(true)}
                onSuccessAction={handleRecordToolUsage}
              />
            )}

            {/* In-Article Native Ad Banner */}
            <AdBanner format="infeed" adConfig={adConfig} />

            {/* SEO Content & FAQ Section for active tool */}
            {activeToolMeta && <SeoContentSection tool={activeToolMeta} publisherId={adConfig.publisherId} />}

          </div>
          </ErrorBoundary>
        )}

      </main>

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onOpenSeo={() => setShowSeoDrawer(true)}
        onOpenSeoSettings={() => setShowSeoSettingsModal(true)}
        onOpenAdSenseSettings={() => setShowAdSenseModal(true)}
        onOpenPricing={() => setShowPricingModal(true)}
        onOpenHostinger={() => setShowHostingerModal(true)}
        adConfig={adConfig}
        onOpenLanguage={() => setShowLanguageModal(true)}
        currentLanguage={currentLanguage}
        onOpenLegal={(tab) => {
          setLegalTab(tab || 'privacy');
          setShowLegalModal(true);
        }}
        onOpenAdminEmails={() => setShowAdminEmailModal(true)}
      />

      {/* Modals & Drawers */}
      <SeoSettingsModal
        isOpen={showSeoSettingsModal}
        onClose={() => setShowSeoSettingsModal(false)}
        activeToolId={currentToolId}
      />
      <LegalSecurityModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalTab}
      />
      <LanguageModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => {
          setCurrentLanguage(lang);
          localStorage.setItem('tool_studio_language', lang.code);
        }}
      />
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        userPlan={userPlan}
        onOpenPhonePe={handleOpenPhonePe}
      />

      <ProUpsellModal
        isOpen={showProUpsellModal}
        onClose={() => setShowProUpsellModal(false)}
        onOpenPricing={() => setShowPricingModal(true)}
        onOpenPhonePe={handleOpenPhonePe}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setLoginNotice(null);
        }}
        userAccount={userAccount}
        onLogin={(acc) => {
          setUserAccount(acc);
          setLoginNotice(null);
          if (pendingPaymentFlow) {
            setPendingPaymentFlow(false);
            setShowPhonePeModal(true);
          }
        }}
        onLogout={() => setUserAccount({ isLoggedIn: false, name: 'Guest User', email: '' })}
        userPlan={userPlan}
        onOpenPricing={() => setShowPricingModal(true)}
        loginNotice={loginNotice}
      />

      <PhonePeModal
        isOpen={showPhonePeModal}
        onClose={() => setShowPhonePeModal(false)}
        userAccount={userAccount}
        onPaymentSuccess={handlePhonePeSuccess}
      />

      <AdSenseSettingsModal
        isOpen={showAdSenseModal}
        onClose={() => setShowAdSenseModal(false)}
        adConfig={adConfig}
        onUpdateConfig={(cfg) => {
          setAdConfig(cfg);
          localStorage.setItem('toolstudio_adsense_config', JSON.stringify(cfg));
        }}
      />

      <HostingerDeploymentModal
        isOpen={showHostingerModal}
        onClose={() => setShowHostingerModal(false)}
      />

      <SeoDrawer
        isOpen={showSeoDrawer}
        onClose={() => setShowSeoDrawer(false)}
      />

      <AdminEmailModal
        isOpen={showAdminEmailModal}
        onClose={() => setShowAdminEmailModal(false)}
        onLicenseActivated={(txnId) => {
          const activatedPlan: UserPlan = {
            isPro: true,
            planName: 'Pro Annual',
            proExpiryDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
            dailyLimitUsed: 0,
            dailyLimitMax: 999999,
          };
          setUserPlan(activatedPlan);
          localStorage.setItem('toolstudio_user_plan', JSON.stringify(activatedPlan));
          setAdminAuthBanner({
            txnId,
            status: 'ACTIVATED',
            message: `License successfully authorized and activated for transaction ${txnId} by support@tool-studio.in!`,
          });
        }}
      />

    </div>
  );
}
