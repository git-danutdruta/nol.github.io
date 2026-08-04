import { getClientErrorLog } from '@/lib/observability/clientLogger';
import { useProgressStore } from '@/stores/progressStore';

async function getStorageEstimate() {
  if (!('storage' in navigator) || typeof navigator.storage.estimate !== 'function') {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    return {
      quota: estimate.quota ?? null,
      usage: estimate.usage ?? null,
    };
  } catch {
    return null;
  }
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DebugInfoExport() {
  const progress = useProgressStore((state) => ({
    schemaVersion: state.schemaVersion,
    xp: state.xp,
    lessonCount: Object.keys(state.lessons).length,
    badges: state.badges,
  }));

  const handleExportDebug = async () => {
    const diagnostics = {
      exportedAt: new Date().toISOString(),
      app: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        pathname: window.location.pathname,
      },
      progress,
      clientErrors: getClientErrorLog(),
      storage: await getStorageEstimate(),
    };

    downloadJson(`nol-debug-info-${new Date().toISOString().slice(0, 10)}.json`, diagnostics);
  };

  return (
    <div className="space-y-2 border-t border-slate-200 pt-6 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Debug diagnostics</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Export non-PII debug data (device info, app state summary, and captured client errors) for
        support.
      </p>
      <button
        type="button"
        onClick={() => {
          void handleExportDebug();
        }}
        className="motion-press rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        Export debug info
      </button>
    </div>
  );
}
