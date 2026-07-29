import { useState } from 'react';
import type { Exercise } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

interface DrawingExerciseProps {
  exercise: Exercise;
}

export function DrawingExercise({ exercise }: DrawingExerciseProps) {
  const { i18n } = useTranslation();
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-lg font-medium text-slate-900 dark:text-white">
        {getLocalizedString(exercise.question, i18n.language)}
      </p>
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">
          Drawing canvas will be implemented in the drawing engine (FE-006/FE-007/FE-009).
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Mode: <strong>{exercise.drawingMode || 'freehand'}</strong>
        </p>
      </div>
      <button
        type="button"
        onClick={() => setSaved(true)}
        className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        Save drawing
      </button>
      {saved && (
        <div
          className="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          role="status"
          aria-live="polite"
        >
          Drawing saved for review.
        </div>
      )}
    </div>
  );
}
