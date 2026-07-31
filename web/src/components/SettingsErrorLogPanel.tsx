import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getClientErrorLog } from '@/lib/observability/clientLogger';

function downloadLog(entries: unknown[]) {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `nol-client-errors-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SettingsErrorLogPanel() {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const entries = useMemo(() => {
    void refreshKey;
    return getClientErrorLog();
  }, [refreshKey]);

  return (
    <div className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        {t('settings.errors.title')}
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {t('settings.errors.description')}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setRefreshKey((k) => k + 1)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {t('settings.errors.refresh')}
        </button>
        <button
          type="button"
          onClick={() => downloadLog(entries)}
          disabled={entries.length === 0}
          className="rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
        >
          {t('settings.errors.export')}
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">{t('settings.errors.empty')}</p>
      ) : (
        <div className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <ul className="space-y-3">
            {entries.slice(0, 15).map((entry) => (
              <li
                key={entry.id}
                className="border-b border-slate-200 pb-2 text-xs last:border-b-0 dark:border-slate-800"
              >
                <p className="font-semibold text-slate-900 dark:text-white">
                  {entry.name}: {entry.message}
                </p>
                <p className="text-slate-500 dark:text-slate-400">{entry.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
