/**
 * Service Worker Registration & Offline Capability Manager
 * Enables offline caching of the tool directory and application shell.
 */

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export const registerServiceWorker = (config?: ServiceWorkerConfig): void => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    const swUrl = `/sw.js`;

    const registerValidSW = (url: string) => {
      navigator.serviceWorker
        .register(url)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available; please refresh.
                  if (config && config.onUpdate) {
                    config.onUpdate(registration);
                  }
                } else {
                  // Content is cached for offline use.
                  if (config && config.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          };
        })
        .catch((error) => {
          if (config && config.onError) {
            config.onError(error);
          }
        });
    };

    if (document.readyState === 'complete') {
      registerValidSW(swUrl);
    } else {
      window.addEventListener('load', () => {
        registerValidSW(swUrl);
      });
    }
  }
};

export const unregisterServiceWorker = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        // Quiet handling
      });
  }
};
