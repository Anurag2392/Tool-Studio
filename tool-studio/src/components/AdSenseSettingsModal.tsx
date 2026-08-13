import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Eye,
  MousePointer,
  TrendingUp,
  Copy,
  Check,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Download,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { AdConfig } from '../types';
import {
  ADSENSE_CONFIG,
  getMaskedPublisherId,
  normalizePublisherId,
  clearAdSenseCache,
  ensureAdSenseScriptLoaded
} from '../config/adsense';

interface AdSenseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adConfig: AdConfig;
  onUpdateConfig: (newConfig: AdConfig) => void;
}

export const AdSenseSettingsModal: React.FC<AdSenseSettingsModalProps> = ({
  isOpen,
  onClose,
  adConfig,
  onUpdateConfig,
}) => {
  // Local state form fields for smooth editing before saving
  const [publisherIdInput, setPublisherIdInput] = useState('');
  const [headerSlot, setHeaderSlot] = useState('');
  const [sidebarSlot, setSidebarSlot] = useState('');
  const [inFeedSlot, setInFeedSlot] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);

  // Status feedback states
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or adConfig changes
  useEffect(() => {
    if (isOpen) {
      setPublisherIdInput(adConfig.publisherId || ADSENSE_CONFIG.publisherId || '');
      setHeaderSlot(adConfig.headerSlot || '');
      setSidebarSlot(adConfig.sidebarSlot || '');
      setInFeedSlot(adConfig.inFeedSlot || '');
      setIsEnabled(adConfig.enabled !== false);
    }
  }, [isOpen, adConfig]);

  if (!isOpen) return null;

  const normalizedPubId = normalizePublisherId(publisherIdInput);
  const isValidPubId = normalizedPubId.startsWith('ca-pub-') && normalizedPubId.length >= 15;
  const maskedPubId = getMaskedPublisherId(normalizedPubId);

  const adsTxtLine = `google.com, ${
    normalizedPubId ? normalizedPubId.replace('ca-pub-', 'pub-') : 'pub-0000000000000000'
  }, DIRECT, f08c47fec0942fa0`;

  const sampleAdScript = `<!-- Google AdSense Live Integration Script for Tool Studio -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedPubId || 'ca-pub-0000000000000000'}" crossorigin="anonymous"></script>
<!-- Header Leaderboard Unit -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${normalizedPubId || 'ca-pub-0000000000000000'}"
     data-ad-slot="${headerSlot || '7289012345'}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  // Handle Save & Apply New AdSense Account
  const handleSave = () => {
    const newPubId = normalizePublisherId(publisherIdInput);

    const updatedConfig: AdConfig = {
      ...adConfig,
      enabled: isEnabled,
      publisherId: newPubId,
      headerSlot: headerSlot.trim(),
      sidebarSlot: sidebarSlot.trim(),
      inFeedSlot: inFeedSlot.trim(),
    };

    onUpdateConfig(updatedConfig);
    try {
      localStorage.setItem('toolstudio_adsense_config', JSON.stringify(updatedConfig));
    } catch (e) {
      // Quiet
    }

    if (isEnabled && newPubId) {
      ensureAdSenseScriptLoaded(newPubId);
    }

    setToastMessage('✅ New Google AdSense account and ad slots saved successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Removing / Disconnecting Old AdSense Account
  const handleRemoveAccount = () => {
    if (confirm('Are you sure you want to remove the old AdSense account credentials? This will clear saved Publisher ID and Ad slots.')) {
      clearAdSenseCache();

      setPublisherIdInput('');
      setHeaderSlot('');
      setSidebarSlot('');
      setInFeedSlot('');
      setIsEnabled(false);

      const resetConfig: AdConfig = {
        enabled: false,
        publisherId: '',
        headerSlot: '',
        sidebarSlot: '',
        inFeedSlot: '',
        simulatedImpressions: 0,
        simulatedClicks: 0,
        simulatedEarningsUsd: 0.0,
      };

      onUpdateConfig(resetConfig);

      setToastMessage('🗑️ Old AdSense account disconnected & credentials cleared.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(sampleAdScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyAdsTxt = () => {
    navigator.clipboard.writeText(adsTxtLine);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2000);
  };

  const downloadAdsTxt = () => {
    const blob = new Blob([`${adsTxtLine}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ads.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-emerald-500/20">
              <DollarSign size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <span>Google AdSense Account Manager</span>
                <span className="text-[10px] uppercase font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  NEW FORM
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Connect your AdSense Publisher ID, configure ad slots & generate ads.txt
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Live Notification Toast */}
        {toastMessage && (
          <div className="bg-slate-900 text-emerald-400 border border-emerald-500/30 p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-200">
            <span>{toastMessage}</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md uppercase">Updated</span>
          </div>
        )}

        {/* Account Master Switch */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              AdSense Serving Status
              <span
                className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                  isEnabled
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {isEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Enable or pause Google AdSense banner placements across all tool pages.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Account Setup Form */}
        <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" /> Connect Google AdSense Account
            </h4>
            {publisherIdInput && (
              <button
                type="button"
                onClick={handleRemoveAccount}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Disconnect / Remove Account</span>
              </button>
            )}
          </div>

          {/* Publisher ID Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Google AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)</span>
              {isValidPubId ? (
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Valid Format ({maskedPubId})
                </span>
              ) : publisherIdInput ? (
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                  <AlertCircle size={12} /> Format: ca-pub-1234567890123456
                </span>
              ) : null}
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={publisherIdInput}
                onChange={(e) => setPublisherIdInput(e.target.value)}
                placeholder="e.g. ca-pub-1234567890123456"
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setPublisherIdInput(normalizePublisherId(publisherIdInput))}
                className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                title="Auto-format Publisher ID with ca-pub- prefix"
              >
                Auto-Format
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              You can find your Publisher ID in your Google AdSense account under <strong>Account → Settings → Account information</strong>.
            </p>
          </div>

          {/* Ad Slot IDs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Header Leaderboard Slot ID
              </label>
              <input
                type="text"
                value={headerSlot}
                onChange={(e) => setHeaderSlot(e.target.value)}
                placeholder="e.g. 7289012345"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Sidebar Rectangle Slot ID
              </label>
              <input
                type="text"
                value={sidebarSlot}
                onChange={(e) => setSidebarSlot(e.target.value)}
                placeholder="e.g. 2345678901"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                In-Feed / Content Slot ID
              </label>
              <input
                type="text"
                value={inFeedSlot}
                onChange={(e) => setInFeedSlot(e.target.value)}
                placeholder="e.g. 3456789012"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Live ads.txt Generation Box */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldCheck size={16} /> Verified ads.txt Seller Line
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyAdsTxt}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                {copiedAdsTxt ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedAdsTxt ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={downloadAdsTxt}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download size={13} />
                <span>Download ads.txt</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 select-all overflow-x-auto">
            {adsTxtLine}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Google AdSense requires this line in your domain&apos;s <code className="bg-slate-800 text-slate-200 px-1 py-0.5 rounded">ads.txt</code> file to authorize Tool Studio to display ads.
          </p>
        </div>

        {/* AdSense HTML Integration Code Generator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileCode size={15} className="text-slate-600" /> Live HTML Integration Code Snippet
            </span>
            <button
              onClick={copyScript}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedScript ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedScript ? 'Copied Snippet!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="bg-slate-900 text-emerald-400 text-[11px] p-3.5 rounded-2xl font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-32 select-all">
            {sampleAdScript}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleRemoveAccount}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <Trash2 size={15} />
            <span>Remove Old Account</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={16} />
              <span>Save & Activate AdSense</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
