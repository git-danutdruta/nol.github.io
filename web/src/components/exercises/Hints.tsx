import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocalizedString } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';

interface HintsProps {
  hints: LocalizedString[];
}

export function Hints({ hints }: HintsProps) {
  const { i18n, t } = useTranslation();
  const [visible, setVisible] = useState(0);

  if (hints.length === 0) return null;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setVisible((v) => Math.min(v + 1, hints.length))}
        disabled={visible >= hints.length}
        className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 dark:text-primary-400 dark:hover:text-primary-300"
      >
        {hints.length === 1
          ? t('exercise.hint')
          : t('exercise.hints')} {visible > 0 ? `(${visible}/${hints.length})` : ''}
      </button>
      {visible > 0 && (
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
          {hints.slice(0, visible).map((hint, index) => (
            <li key={index}>{getLocalizedString(hint, i18n.language)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

