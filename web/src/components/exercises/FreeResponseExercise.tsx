import { useState } from 'react';
import type { Exercise } from '@/types/curriculum';
import { validateAnswer } from '@/lib/validateAnswer';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

interface FreeResponseExerciseProps {
  exercise: Exercise;
}

export function FreeResponseExercise({ exercise }: FreeResponseExerciseProps) {
  const { i18n } = useTranslation();
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const maxAttempts = exercise.maxAttempts ?? 3;

  function handleSubmit() {
    const validation = validateAnswer(exercise, answer);
    setResult(validation);
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
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        placeholder="Type your answer"
        className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
        aria-label="Free response answer"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        Check
      </button>
      {result && (
        <div
          className={`rounded-md p-3 ${
            result.correct
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
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
          <strong>Solution:</strong> {getLocalizedString(exercise.solution, i18n.language)}
        </div>
      )}
    </div>
  );
}
