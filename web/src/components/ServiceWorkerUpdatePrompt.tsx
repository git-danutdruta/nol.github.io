import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SERVICE_WORKER_UPDATE_EVENT } from '@/lib/pwa/registerServiceWorker';
import { Toast } from '@/components/ui/Toast';

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
    return () =>
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, [registration]);

  if (!registration || dismissed) return null;

  return (
    <Toast
      open={true}
      message={t('pwa.updateAvailable')}
      durationMs={0}
      variant="info"
      onClose={() => setDismissed(true)}
      actions={
        <>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="motion-press rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t('pwa.dismiss')}
          </button>
          <button
            type="button"
            onClick={() => {
              registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
            }}
            className="motion-press rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            {t('pwa.refreshToUpdate')}
          </button>
        </>
      }
    />
  );
}
