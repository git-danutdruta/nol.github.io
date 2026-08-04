import { recordClientError } from '@/lib/observability/clientLogger';

let installed = false;

export function installGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (event) => {
    recordClientError(event.error ?? event.message, {
      source: 'window.error',
      pathname: window.location.pathname,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    recordClientError(event.reason, {
      source: 'window.unhandledrejection',
      pathname: window.location.pathname,
    });
  });
}
