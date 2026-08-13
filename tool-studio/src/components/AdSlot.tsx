import React, { useEffect, useRef, useState } from 'react';
import { Megaphone, AlertCircle } from 'lucide-react';
import { ADSENSE_CONFIG, ensureAdSenseScriptLoaded } from '../config/adsense';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  responsive?: boolean;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slot = ADSENSE_CONFIG.slots.mainHighVisibility,
  format = 'auto',
  responsive = true,
  className = '',
  label = 'SPONSORED ADVERTISEMENT',
  style,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);
  const [adBlocked, setAdBlocked] = useState<boolean>(false);

  useEffect(() => {
    // Dynamically ensure script is loaded
    ensureAdSenseScriptLoaded(ADSENSE_CONFIG.publisherId);

    if (pushedRef.current) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && adRef.current) {
          const windowWithAds = window as unknown as { adsbygoogle?: object[] };
          windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || [];
          windowWithAds.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (err) {
        // Handle blocked or re-rendered ad slot gracefully
        setAdBlocked(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div className={`my-6 relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs transition-all ${className}`}>
      {/* Header Badge */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-2 mb-2 border-b border-slate-100">
        <span className="flex items-center gap-1.5 text-slate-700">
          <Megaphone size={12} className="text-emerald-600" />
          {label}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          ADVERTISEMENT
        </span>
      </div>

      {/* Ad Content / Fallback Area */}
      {adBlocked ? (
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-3 text-amber-900 text-xs">
          <AlertCircle size={18} className="text-amber-600 shrink-0" />
          <div>
            <strong className="block font-bold">Support Tool Studio</strong>
            <span className="text-[11px] text-amber-800">
              Please consider disabling your AdBlocker to support our free PDF & AI tool workspace.
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center min-h-[90px] overflow-hidden bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-1">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={
              style || {
                display: 'block',
                width: '100%',
                minHeight: '90px',
              }
            }
            data-ad-client={ADSENSE_CONFIG.publisherId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        </div>
      )}
    </div>
  );
};
