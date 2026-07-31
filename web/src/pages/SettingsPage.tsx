import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { SettingsErrorLogPanel } from '@/components/SettingsErrorLogPanel';
import { downloadProgressBackup, parseImportedProgress } from '@/lib/exportImport';
import { useProgressStore } from '@/stores/progressStore';

export function SettingsPage() {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string | null>(null);
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
    setMessage(t('settings.progress.exportSuccess'));
  };

  const handleImport = async (file: File | null) => {
    if (!file) return;
    try {
      const text = await file.text();
      const imported = parseImportedProgress(text);
      if (!window.confirm(t('settings.progress.importConfirm'))) return;
      importProgress(imported);
      setMessage(t('settings.progress.importSuccess'));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t('settings.progress.importError'));
    }
  };

  const handleReset = () => {
    if (!window.confirm(t('settings.progress.resetConfirm'))) return;
    resetProgress();
    setMessage(t('settings.progress.resetSuccess'));
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
              className="rounded-md border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-800 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
            >
              {t('settings.progress.export')}
            </button>

            <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
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
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300"
            >
              {t('settings.progress.reset')}
            </button>
          </div>

          {message && <p className="text-sm text-slate-700 dark:text-slate-300">{message}</p>}
        </div>

        <SettingsErrorLogPanel />
      </div>
    </section>
  );
}
