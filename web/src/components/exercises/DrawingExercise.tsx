import { useState } from 'react';
import type { Exercise } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { DrawingEngine } from '@/components/drawing/DrawingEngine';

interface DrawingExerciseProps {
  exercise: Exercise;
  onEvaluated?: (correct: boolean) => void;
}

export function DrawingExercise({ exercise, onEvaluated }: DrawingExerciseProps) {
  const { i18n } = useTranslation();
  const [saved, setSaved] = useState(false);

  const initialMode = exercise.drawingMode === 'graph' ? 'graph' : 'freehand';
  const drawingKey = `exercise:${exercise.id}`;

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-lg font-medium text-slate-900 dark:text-white">
        {getLocalizedString(exercise.question, i18n.language)}
      </p>
      <DrawingEngine
        drawingKey={drawingKey}
        initialMode={initialMode}
        onSave={() => {
          setSaved(true);
          onEvaluated?.(true);
        }}
      />
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
