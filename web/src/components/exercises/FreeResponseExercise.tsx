import { useState } from 'react';
import type { Exercise } from '@/types/curriculum';
import { validateAnswer } from '@/lib/validateAnswer';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { Hints } from './Hints';

interface FreeResponseExerciseProps {
  exercise: Exercise;
  onEvaluated?: (correct: boolean) => void;
}

export function FreeResponseExercise({ exercise, onEvaluated }: FreeResponseExerciseProps) {
  const { i18n, t } = useTranslation();
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const maxAttempts = exercise.maxAttempts ?? 3;

  function handleSubmit() {
    const validation = validateAnswer(exercise, answer);
    setResult(validation);
    onEvaluated?.(validation.correct);
    setAttempts((a) => a + 1);
    if (!validation.correct && attempts + 1 >= maxAttempts) {
      setShowSolution(true);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-lg font-medium text-slate-900 dark:text-white">
        {getLocalizedString(exercise.question, i18n.language)}
      </p>
      {exercise.hints && exercise.hints.length > 0 && <Hints hints={exercise.hints} />}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        placeholder={t('exercise.placeholder.freeResponse')}
        className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        aria-label={t('exercise.aria.freeResponseAnswer')}
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="motion-press rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        {t('exercise.check')}
      </button>
      {result && (
        <div
          className={`rounded-md p-3 ${
            result.correct
              ? 'motion-success-pop bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}
          role="status"
          aria-live="polite"
        >
          {result.message}
        </div>
      )}
      {showSolution && exercise.solution && (
        <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
          <strong>{t('exercise.solution')}:</strong>{' '}
          {getLocalizedString(exercise.solution, i18n.language)}
        </div>
      )}
    </div>
  );
}
