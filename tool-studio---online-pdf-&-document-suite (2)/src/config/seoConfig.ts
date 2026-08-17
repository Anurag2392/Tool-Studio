/**
 * SEO & Google Site Verification Dedicated Configuration Object
 * 
 * Provides a clean, sanitized separation of SEO metadata, OpenGraph, Twitter cards,
 * and search engine verification tokens. Prevents leaking environment secrets or internal API URLs.
 */

import { sanitizeMetaContent } from '../utils/securityMetaHelper';

// Safe getter for client-side environment flag
const getEnvFlag = (key: string, defaultVal: string = ''): string => {
  try {
    if (typeof window !== 'undefined' && (import.meta as any).env?.[key]) {
      return String((import.meta as any).env[key]);
    }
  } catch (e) {}
  return defaultVal;
};

export const GOOGLE_VERIFICATION_CONFIG = {
  // Dedicated verification token
  verificationToken: getEnvFlag(
    'VITE_GOOGLE_SITE_VERIFICATION',
    'Vk3JZtCb9ItWfTSvQVC-QOoDKQsPktANSLoM8eKAbkM'
  ),
  // Verification enabled check (defaults to true for production indexing)
  enabled: getEnvFlag('VITE_ENABLE_GOOGLE_VERIFICATION', 'true') !== 'false',
};

export interface PageSeoMeta {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl: string;
  ogImage?: string;
}

export const DEFAULT_SITE_SEO: PageSeoMeta = {
  title: 'Tool Studio - Complete Free Online Document & PDF Suite',
  description:
    'Tool Studio is a fast, 100% browser-secure online document suite. Merge, split, compress, edit, OCR, e-sign & summarize PDFs without software installation. Contact: support@tool-studio.in',
  keywords:
    'tool studio, pdf merge, pdf split, pdf compress, edit pdf, pdf summarizer, vision ocr, e-sign pdf, pdf to image, watermark pdf',
  ogTitle: 'Tool Studio - High-Speed Online Document & PDF Tools',
  ogDescription:
    'Merge, split, edit, compress, e-sign, and summarize PDF files securely in your browser using Gemini AI. 100% free and private.',
  canonicalUrl: 'https://tool-studio.in/',
  ogImage: 'https://tool-studio.in/og-image.png',
};

/**
 * Sanitizes and securely injects page SEO and verification meta tags
 */
export const updateDocumentSeoMeta = (meta: Partial<PageSeoMeta>): void => {
  if (typeof document === 'undefined') return;

  try {
    const title = sanitizeMetaContent(meta.title || DEFAULT_SITE_SEO.title);
    const description = sanitizeMetaContent(meta.description || DEFAULT_SITE_SEO.description);
    const ogTitle = sanitizeMetaContent(meta.ogTitle || meta.title || DEFAULT_SITE_SEO.ogTitle!);
    const ogDescription = sanitizeMetaContent(
      meta.ogDescription || meta.description || DEFAULT_SITE_SEO.ogDescription!
    );
    const canonicalUrl = meta.canonicalUrl || DEFAULT_SITE_SEO.canonicalUrl;

    // Document Title
    document.title = title;

    // Standard Description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', description);

    // OpenGraph Tags
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', ogTitle);

    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescTag) {
      ogDescTag = document.createElement('meta');
      ogDescTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescTag);
    }
    ogDescTag.setAttribute('content', ogDescription);

    // Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    // Google Site Verification Dynamic Enforcement
    let gvTag = document.querySelector('meta[name="google-site-verification"]');
    if (GOOGLE_VERIFICATION_CONFIG.enabled && GOOGLE_VERIFICATION_CONFIG.verificationToken) {
      if (!gvTag) {
        gvTag = document.createElement('meta');
        gvTag.setAttribute('name', 'google-site-verification');
        document.head.prepend(gvTag);
      }
      gvTag.setAttribute('content', GOOGLE_VERIFICATION_CONFIG.verificationToken);
    } else if (gvTag && !GOOGLE_VERIFICATION_CONFIG.enabled) {
      gvTag.remove();
    }
  } catch (err) {
    // Fail-safe quiet handling
  }
};
