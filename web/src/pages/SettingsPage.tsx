import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SettingsErrorLogPanel } from '@/components/SettingsErrorLogPanel';
import { DebugInfoExport } from '@/components/DebugInfoExport';
import { Toast } from '@/components/ui/Toast';
import { downloadProgressBackup, parseImportedProgress } from '@/lib/exportImport';
import { exportFirstCanvasAsPng, triggerPrintPdf } from '@/lib/exportMedia';
import { useProgressStore } from '@/stores/progressStore';

export function SettingsPage() {
  const { t } = useTranslation();
  const [toast, setToast] = useState<{
    message: string;
    variant: 'info' | 'success' | 'error';
  } | null>(null);
  const importProgress = useProgressStore((state) => state.importProgress);
  const resetProgress = useProgressStore((state) => state.resetProgress);
  const progressData = useProgressStore((state) => ({
    schemaVersion: state.schemaVersion,
    xp: state.xp,
    lessons: state.lessons,
    dailyActivity: state.dailyActivity,
    badges: state.badges,
  }));

  const handleExport = () => {
    if (!window.confirm(t('settings.progress.exportConfirm'))) return;
    downloadProgressBackup(progressData);
    setToast({ message: t('settings.progress.exportSuccess'), variant: 'success' });
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseImportedProgress(text);
      if (!window.confirm(t('settings.progress.importConfirm'))) return;
      importProgress(imported);
      setToast({ message: t('settings.progress.importSuccess'), variant: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : t('settings.progress.importError'),
        variant: 'error',
      });
    }
  };

  const handleReset = () => {
    if (!window.confirm(t('settings.progress.resetConfirm'))) return;
    resetProgress();
    setToast({ message: t('settings.progress.resetSuccess'), variant: 'success' });
  };

  const handleExportCanvas = () => {
    const exported = exportFirstCanvasAsPng();
    setToast({
      message: exported
        ? t('settings.media.exportImageSuccess')
        : t('settings.media.exportImageNoCanvas'),
      variant: exported ? 'success' : 'info',
    });
  };

  const handleExportPdf = () => {
    triggerPrintPdf();
    setToast({ message: t('settings.media.exportPdfHint'), variant: 'info' });
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
        {t('settings.title')}
      </h1>
      <div className="space-y-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <LanguageSwitcher />
        <ThemeSwitcher />

        <div className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('settings.progress.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('settings.progress.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="motion-press rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
            >
              {t('settings.progress.export')}
            </button>

            <label className="motion-press cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              {t('settings.progress.import')}
              <input
                type="file"
                accept="application/json"
                className="sr-only"
                onChange={(event) => {
                  void handleImport(event.target.files?.[0] ?? null);
                  event.currentTarget.value = '';
                }}
              />
            </label>

            <button
              type="button"
              onClick={handleReset}
              className="motion-press rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
            >
              {t('settings.progress.reset')}
            </button>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('settings.media.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('settings.media.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportCanvas}
              className="motion-press rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
            >
              {t('settings.media.exportImage')}
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="motion-press rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t('settings.media.exportPdf')}
            </button>
          </div>
        </div>

        <SettingsErrorLogPanel />
        <DebugInfoExport />
      </div>

      <Toast
        open={toast !== null}
        message={toast?.message ?? ''}
        variant={toast?.variant ?? 'info'}
        onClose={() => setToast(null)}
      />
    </section>
  );
}
