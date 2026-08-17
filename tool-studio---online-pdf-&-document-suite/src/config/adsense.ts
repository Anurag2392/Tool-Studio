/**
 * Google AdSense Encapsulated Configuration Layer
 * Strictly isolates Publisher ID and Ad Slot metadata with dynamic domain verification.
 */

// Module-level private cache - never exposed on the global window object
let cachedPublisherId: string | null = null;
let scriptLoadingPromise: Promise<void> | null = null;

const TARGET_DOMAIN = 'tool-studio.in';

/**
 * Validates whether current hostname matches target production domain tool-studio.in
 */
export const isValidAdSenseDomain = (): boolean => {
  if (typeof window === 'undefined' || !window.location) return false;
  const hostname = window.location.hostname;
  return hostname === TARGET_DOMAIN || hostname.endsWith(`.${TARGET_DOMAIN}`);
};

/**
 * Safely retrieves build-time or cached Publisher ID
 */
const getPublisherId = (): string => {
  if (cachedPublisherId) return cachedPublisherId;
  try {
    if (typeof window !== 'undefined' && (import.meta as any).env?.VITE_ADSENSE_PUBLISHER_ID) {
      return (import.meta as any).env.VITE_ADSENSE_PUBLISHER_ID;
    }
  } catch (e) {
    // Quiet fallback
  }
  return '';
};

export const ADSENSE_CONFIG = {
  publisherId: getPublisherId(),
  enabled: true,
  slots: {
    header: '',
    sidebar: '',
    inFeed: '',
    contentTop: '',
    contentMid: '',
    mainHighVisibility: '',
  },
};

/**
 * Normalizes user input into a valid Google AdSense Publisher ID (e.g., ca-pub-1234567890123456)
 */
export const normalizePublisherId = (rawId: string): string => {
  if (!rawId) return '';
  const trimmed = rawId.trim();
  if (trimmed.startsWith('ca-pub-')) return trimmed;
  if (trimmed.startsWith('pub-')) return `ca-${trimmed}`;
  const numbersOnly = trimmed.replace(/\D/g, '');
  if (numbersOnly.length > 0) return `ca-pub-${numbersOnly}`;
  return trimmed;
};

/**
 * Clears old AdSense configuration and cached publisher ID
 */
export const clearAdSenseCache = () => {
  cachedPublisherId = null;
  scriptLoadingPromise = null;
  ADSENSE_CONFIG.publisherId = '';
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('toolstudio_adsense_config');
      const script = document.getElementById('adsense-script-loader');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    } catch (e) {
      // Quiet handling
    }
  }
};

/**
 * Fetches Publisher ID from secure server-side endpoint
 */
export const fetchAdSenseConfig = async (): Promise<{ publisherId: string; enabled: boolean }> => {
  if (cachedPublisherId) {
    return { publisherId: cachedPublisherId, enabled: true };
  }

  try {
    const res = await fetch('/api/adsense-config');
    if (res.ok) {
      const data = await res.json();
      if (data?.publisherId) {
        cachedPublisherId = data.publisherId;
        ADSENSE_CONFIG.publisherId = data.publisherId;
        return { publisherId: data.publisherId, enabled: true };
      }
    }
  } catch (e) {
    // Quiet handling without console exposure
  }

  return { publisherId: getPublisherId(), enabled: true };
};

/**
 * Obfuscates Publisher ID for UI display (e.g. settings modals)
 */
export const getMaskedPublisherId = (pubId: string = ADSENSE_CONFIG.publisherId): string => {
  if (!pubId || !pubId.startsWith('ca-pub-')) return 'ca-pub-****';
  return pubId.replace(/^(ca-pub-\d{4})\d+(\d{4})$/, '$1****$2');
};

/**
 * Non-blocking script loader that validates domain before injecting Google AdSense script
 */
export const ensureAdSenseScriptLoaded = (fallbackPubId: string = ADSENSE_CONFIG.publisherId): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  const activePubId = fallbackPubId || ADSENSE_CONFIG.publisherId;
  if (!activePubId) return Promise.resolve();

  // Validate domain against tool-studio.in strictly before any network requests or DOM modifications
  if (!isValidAdSenseDomain()) {
    return Promise.resolve();
  }

  // Deduplicate concurrent or redundant calls
  const existingScript = document.getElementById('adsense-script-loader') as HTMLScriptElement | null;
  if (existingScript) {
    if (existingScript.src.includes(encodeURIComponent(activePubId))) {
      return Promise.resolve();
    } else {
      // Remove stale script for previous account
      existingScript.remove();
    }
  }

  scriptLoadingPromise = new Promise<void>((resolve) => {
    const executeLoad = async () => {
      try {
        const script = document.createElement('script');
        script.id = 'adsense-script-loader';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(activePubId)}`;

        script.onload = () => resolve();
        script.onerror = () => resolve(); // Non-blocking fail-soft

        document.head.appendChild(script);
      } catch (err) {
        resolve();
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => executeLoad(), { timeout: 2000 });
    } else {
      setTimeout(executeLoad, 100);
    }
  });

  return scriptLoadingPromise;
};
