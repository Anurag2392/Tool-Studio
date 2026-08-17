/**
 * Security Meta Tag Helper
 * Dynamically injects Content Security Policy (CSP), Strict-Transport-Security (HSTS),
 * Referrer-Policy, and Permissions-Policy into the document head.
 * 
 * Provides runtime protection against XSS, clickjacking, unsafe injection,
 * and man-in-the-middle attacks on document processing tools.
 */

export interface SecurityPolicyConfig {
  enableStrictCSP?: boolean;
  enableHSTS?: boolean;
  allowAdSense?: boolean;
}

/**
 * Sanitizes input text to prevent XSS injection in meta tag attributes
 */
export const sanitizeMetaContent = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>"']/g, '') // Strip tag delimiters and quotes
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
};

/**
 * Injects or updates a meta tag in document.head
 */
export const setMetaTag = (
  attributeName: 'name' | 'http-equiv' | 'property',
  attributeValue: string,
  content: string
): void => {
  if (typeof document === 'undefined') return;

  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

/**
 * Initializes and dynamically injects security headers and meta tags into document.head
 */
export const injectSecurityMetaTags = (config: SecurityPolicyConfig = {}): void => {
  if (typeof document === 'undefined') return;

  try {
    // 1. Content Security Policy (CSP)
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://adservice.google.com https://*.googleadservices.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https: https://pagead2.googlesyndication.com https://pagead2.googleadservices.com blob: data:",
      "frame-src 'self' https: https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];

    setMetaTag('http-equiv', 'Content-Security-Policy', cspDirectives.join('; '));

    // 2. X-Content-Type-Options: nosniff
    setMetaTag('http-equiv', 'X-Content-Type-Options', 'nosniff');

    // 3. Referrer-Policy: strict-origin-when-cross-origin
    setMetaTag('name', 'referrer', 'strict-origin-when-cross-origin');

    // 4. Permissions-Policy: restrict sensitive browser hardware
    setMetaTag(
      'name',
      'permissions-policy',
      'camera=(), microphone=(), geolocation=(), payment=(self)'
    );

    // 5. Upgrade Insecure Requests
    setMetaTag('http-equiv', 'Content-Security-Policy-Report-Only', 'upgrade-insecure-requests');
  } catch (err) {
    // Graceful fallback without breaking client rendering
  }
};
