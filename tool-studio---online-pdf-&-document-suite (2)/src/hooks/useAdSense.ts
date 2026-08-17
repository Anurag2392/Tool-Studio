import { useEffect, useRef } from 'react';
import { ADSENSE_CONFIG, ensureAdSenseScriptLoaded } from '../config/adsense';

interface UseAdSenseOptions {
  client?: string;
  slot?: string;
  format?: string;
  responsive?: boolean;
  enabled?: boolean;
}

export const useAdSense = (options: UseAdSenseOptions = {}) => {
  const {
    client = ADSENSE_CONFIG.publisherId,
    slot = ADSENSE_CONFIG.slots.contentMid,
    format = 'auto',
    responsive = true,
    enabled = true,
  } = options;

  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);

  useEffect(() => {
    ensureAdSenseScriptLoaded(client);
    if (!enabled || pushedRef.current) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && adRef.current) {
          const windowWithAds = window as unknown as { adsbygoogle?: object[] };
          windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || [];
          windowWithAds.adsbygoogle.push({});
          pushedRef.current = true;
        }
      } catch (e) {
        // Handle slot already filled or script blocked
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [enabled, slot, client]);

  return {
    adRef,
    adProps: {
      className: 'adsbygoogle',
      style: { display: 'block', minHeight: '90px' },
      'data-ad-client': client,
      'data-ad-slot': slot,
      'data-ad-format': format,
      'data-full-width-responsive': responsive ? 'true' : 'false',
    },
  };
};
