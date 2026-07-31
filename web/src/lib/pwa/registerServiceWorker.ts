const SW_URL = '/sw.js';
const UPDATE_EVENT = 'nol-sw-update-available';

function notifyUpdate(registration: ServiceWorkerRegistration) {
  window.dispatchEvent(
    new CustomEvent<ServiceWorkerRegistration>(UPDATE_EVENT, {
      detail: registration,
    })
  );
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    void navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        if (registration.waiting) {
          notifyUpdate(registration);
        }

        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              notifyUpdate(registration);
            }
          });
        });

        window.setInterval(() => {
          void registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((error: unknown) => {
        console.error('Service worker registration failed:', error);
      });
  });
}

export { UPDATE_EVENT as SERVICE_WORKER_UPDATE_EVENT };

