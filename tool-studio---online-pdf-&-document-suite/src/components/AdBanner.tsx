import React, { useState, useEffect } from 'react';
import { DollarSign, Eye, ExternalLink, Settings, Sparkles, Check, ShieldAlert, HeartHandshake } from 'lucide-react';
import { AdConfig } from '../types';
import { ADSENSE_CONFIG, getMaskedPublisherId } from '../config/adsense';

interface AdBannerProps {
  format: 'leaderboard' | 'rectangle' | 'infeed' | 'anchor';
  adConfig: AdConfig;
  onUpdateConfig?: (newConfig: AdConfig) => void;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format,
  adConfig,
  onUpdateConfig,
  className = '',
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAdBlocked, setIsAdBlocked] = useState(false);

  useEffect(() => {
    if (!adConfig.enabled) return;

    // Check for existence of window.adsbygoogle and handle ad-blocker detection
    const verifyAdSense = () => {
      try {
        const adsbygoogle = (window as any).adsbygoogle;
        if (typeof adsbygoogle !== 'undefined') {
          // Attempt pushing ad unit initialization
          try {
            (adsbygoogle as any[]).push({});
          } catch (e) {
            // Already initialized or slot occupied
          }
        } else {
          // Test if ad script was blocked by browser ad blocker
          const testElement = document.createElement('div');
          testElement.className = 'adsbygoogle ad-zone ad-space';
          testElement.style.display = 'block';
          testElement.style.position = 'absolute';
          testElement.style.left = '-9999px';
          document.body.appendChild(testElement);

          setTimeout(() => {
            if (testElement.offsetHeight === 0 || !(window as any).adsbygoogle) {
              setIsAdBlocked(true);
            }
            if (document.body.contains(testElement)) {
              document.body.removeChild(testElement);
            }
          }, 200);
        }
      } catch (err) {
        setIsAdBlocked(true);
      }
    };

    const timer = setTimeout(verifyAdSense, 800);
    return () => clearTimeout(timer);
  }, [adConfig.enabled, format]);

  if (!adConfig.enabled) return null;

  const publisherId = adConfig.publisherId || ADSENSE_CONFIG.publisherId;
  const maskedPublisherId = getMaskedPublisherId(publisherId);

  // If publisher ID is not configured yet, show a clean AdSense setup card
  if (!publisherId || publisherId === 'ca-pub-0000000000000000') {
    return (
      <div className={`my-4 relative overflow-hidden rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-center ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Google AdSense Space Ready</h4>
              <p className="text-[11px] text-slate-600">Connect your Google AdSense Publisher ID to start serving ads and monetizing this space.</p>
            </div>
          </div>
          {onUpdateConfig && (
            <button
              onClick={() => {
                const event = new CustomEvent('open-adsense-settings');
                window.dispatchEvent(event);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Configure AdSense
            </button>
          )}
        </div>
      </div>
    );
  }

  const adSlotId =
    format === 'leaderboard'
      ? adConfig.headerSlot || ADSENSE_CONFIG.slots.header
      : format === 'rectangle'
      ? adConfig.sidebarSlot || ADSENSE_CONFIG.slots.sidebar
      : adConfig.inFeedSlot || ADSENSE_CONFIG.slots.inFeed;

  const adCodeSnippet = `<!-- Google AdSense Official Live Unit (${format}) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${publisherId}"
     data-ad-slot="${adSlotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(adCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`my-4 relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 shadow-2xs transition-all ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-slate-700 font-medium px-2 pb-1.5 border-b border-slate-100">
        <span className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          SPONSORED ADVERTISEMENT
        </span>
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
          GOOGLE ADSENSE
        </span>
      </div>

      {/* Ad Contents & AdBlocker Fallback */}
      <div className="pt-2">
        {isAdBlocked ? (
          <div className="bg-amber-50/90 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <ShieldAlert size={20} className="text-amber-600 shrink-0" />
              <div>
                <strong className="block text-amber-950 font-bold">Support Us by Disabling AdBlock</strong>
                <span className="text-amber-800 text-[11px]">
                  Tool Studio is 100% free and powered by Google AdSense. Disabling your ad-blocker keeps all PDF tools & AI features free!
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <HeartHandshake size={13} /> Reload Page
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[90px] flex items-center justify-center bg-white border border-dashed border-slate-200 rounded-lg p-2 overflow-hidden">
            {/* Live Google AdSense Slot */}
            <ins
              className="adsbygoogle"
              style={{
                display: 'block',
                width: '100%',
                minHeight: format === 'rectangle' ? '250px' : '90px',
              }}
              data-ad-client={publisherId}
              data-ad-slot={adSlotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        )}
      </div>

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <DollarSign className="text-emerald-600" size={20} /> Google AdSense Live Configuration
              </h3>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Your publisher account <strong className="font-mono text-emerald-700">{maskedPublisherId}</strong> is verified and authorized to serve live Google AdSense ads.
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Check size={16} className="text-emerald-600" /> Security & Privacy Protected
                </div>
                <p className="text-[11px] text-emerald-800">
                  Publisher credentials are automatically secured and synchronized via host verification and <code className="bg-emerald-100 px-1 py-0.5 rounded">ads.txt</code>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">AdSense HTML Snippet</label>
                <pre className="bg-slate-900 text-emerald-400 text-[11px] p-3 rounded-lg overflow-x-auto font-mono max-h-48 leading-relaxed">
                  {adCodeSnippet}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={copyCode}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : null}
                {copied ? 'Copied to Clipboard!' : 'Copy Code Snippet'}
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
