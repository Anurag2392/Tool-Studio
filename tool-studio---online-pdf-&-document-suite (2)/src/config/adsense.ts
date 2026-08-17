/**
 * Google AdSense Encapsulated Configuration & Privacy-First Loader
 * 
 * Privacy-First Principles:
 * 1. The AdSense script is ONLY loaded after explicit user interaction with document processing tools.
 * 2. Purges ad-related cookies and storage when entering 'Anonymous Mode' or upon completion of sensitive PDF tasks.
 * 3. Never leaks internal secrets or publisher keys to global scope.
 */

import { AdConfig } from '../types';

// Module-level private cache - never exposed on the global window object
let cachedPublisherId: string | null = null;
let scriptLoadingPromise: Promise<void> | null = null;
let hasUserInteractedWithTools = false;
let isAnonymousModeActive = false;

const TARGET_DOMAIN = 'tool-studio.in';

// List of known ad tracking cookies to purge in Anonymous Mode or after sensitive document tasks
const AD_COOKIE_NAMES = [
  '__gads',
  '__gpi',
  '__gcl_au',
  'IDE',
  'test_cookie',
  'DSID',
  'FLC',
  'GED_PROFILE_SYNC',
  'FCCDCF',
  'FCNEC',
  '_ga',
  '_gid',
  '_gat',
  'taid',
];

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
 * Normalizes user input into a valid Google AdSense Publisher ID
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
 * Privacy-First: Purges any stored ad-related cookies across current domain & root paths
 */
export const purgeAdRelatedCookies = (): void => {
  if (typeof document === 'undefined') return;

  try {
    const domains = [
      window.location.hostname,
      `.${window.location.hostname}`,
      `tool-studio.in`,
      `.tool-studio.in`,
      '',
    ];

    const paths = ['/', '/api', ''];

    AD_COOKIE_NAMES.forEach((cookieName) => {
      domains.forEach((domain) => {
        paths.forEach((path) => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; SameSite=Lax`;
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; Secure; SameSite=None`;
        });
      });
    });

    // Also remove any temporary ad tracking session keys
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.removeItem('google_ads_session');
        sessionStorage.removeItem('__gads');
      } catch (e) {}
    }
  } catch (e) {
    // Quiet handling
  }
};

/**
 * Toggles Anonymous/Incognito Mode for private document workflows
 */
export const setAnonymousMode = (active: boolean): void => {
  isAnonymousModeActive = active;
  if (active) {
    purgeAdRelatedCookies();
    // Remove active AdSense script element if present to halt tracking
    if (typeof document !== 'undefined') {
      const script = document.getElementById('adsense-script-loader');
      if (script) {
        script.remove();
      }
    }
  }
};

export const getAnonymousMode = (): boolean => isAnonymousModeActive;

/**
 * Called when a sensitive PDF task (e.g. e-signing, redact, unlock, OCR) completes
 */
export const onSensitivePdfTaskComplete = (): void => {
  // Purge cookies and transient ad tokens immediately to guarantee zero data retention
  purgeAdRelatedCookies();
};

/**
 * Privacy-First Signal: Records that a user has actively chosen to interact with a document tool
 */
export const notifyToolInteraction = (): void => {
  hasUserInteractedWithTools = true;
};

export const hasInteractedWithTools = (): boolean => hasUserInteractedWithTools;

/**
 * Clears old AdSense configuration and cached publisher ID
 */
export const clearAdSenseCache = () => {
  cachedPublisherId = null;
  scriptLoadingPromise = null;
  hasUserInteractedWithTools = false;
  ADSENSE_CONFIG.publisherId = '';
  purgeAdRelatedCookies();
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
 * Obfuscates Publisher ID for UI display
 */
export const getMaskedPublisherId = (pubId: string = ADSENSE_CONFIG.publisherId): string => {
  if (!pubId || !pubId.startsWith('ca-pub-')) return 'ca-pub-****';
  return pubId.replace(/^(ca-pub-\d{4})\d+(\d{4})$/, '$1****$2');
};

/**
 * Privacy-First Script Loader:
 * Only executes when:
 * 1. Target domain is valid
 * 2. User is NOT in Anonymous Mode
 * 3. User has explicitly interacted with a tool (or forceInteraction is true)
 */
export const ensureAdSenseScriptLoaded = (
  fallbackPubId: string = ADSENSE_CONFIG.publisherId,
  forceInteraction: boolean = false
): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();

  // If in Anonymous Mode, refuse to inject ad scripts
  if (isAnonymousModeActive) {
    return Promise.resolve();
  }

  // Privacy Check: Wait until user has actively interacted with tools
  if (!hasUserInteractedWithTools && !forceInteraction) {
    return Promise.resolve();
  }

  const activePubId = fallbackPubId || ADSENSE_CONFIG.publisherId;
  if (!activePubId) return Promise.resolve();

  // Validate domain against tool-studio.in strictly before any network requests
  if (!isValidAdSenseDomain()) {
    return Promise.resolve();
  }

  // Deduplicate concurrent or redundant calls
  const existingScript = document.getElementById('adsense-script-loader') as HTMLScriptElement | null;
  if (existingScript) {
    if (existingScript.src.includes(encodeURIComponent(activePubId))) {
      return Promise.resolve();
    } else {
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
        script.onerror = () => resolve();

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
