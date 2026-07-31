import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SERVICE_WORKER_UPDATE_EVENT } from '@/lib/pwa/registerServiceWorker';

export function ServiceWorkerUpdatePrompt() {
  const { t } = useTranslation();
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<ServiceWorkerRegistration>;
      if (!custom.detail) return;
      setRegistration(custom.detail);
      setDismissed(false);
    };

    window.addEventListener(SERVICE_WORKER_UPDATE_EVENT, handler);
    return () => window.removeEventListener(SERVICE_WORKER_UPDATE_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!registration) return;

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, [registration]);

  if (!registration || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-primary-200 bg-white p-4 shadow-lg dark:border-primary-900 dark:bg-slate-900">
      <p className="text-sm text-slate-700 dark:text-slate-200">{t('pwa.updateAvailable')}</p>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {t('pwa.dismiss')}
        </button>
        <button
          type="button"
          onClick={() => {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
          }}
          className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {t('pwa.refreshToUpdate')}
        </button>
      </div>
    </div>
  );
}

