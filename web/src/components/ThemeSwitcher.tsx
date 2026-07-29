import { useTheme } from '@/components/ThemeProvider';
import { useTranslation } from 'react-i18next';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{t('settings.theme')}</span>
      <div className="flex gap-2">
        {(['light', 'dark', 'system'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={theme === value}
            className={`rounded-md border px-3 py-2 text-sm transition-colors ${
              theme === value
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {t(`settings.theme${value.charAt(0).toUpperCase() + value.slice(1)}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
