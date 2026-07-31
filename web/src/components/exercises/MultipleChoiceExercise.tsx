import { useState } from 'react';
import type { Exercise } from '@/types/curriculum';
import { validateAnswer } from '@/lib/validateAnswer';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onEvaluated?: (correct: boolean) => void;
}

export function MultipleChoiceExercise({ exercise, onEvaluated }: MultipleChoiceExerciseProps) {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const maxAttempts = exercise.maxAttempts ?? 3;

  function handleSubmit() {
    if (selected === null) return;
    const validation = validateAnswer(exercise, String(selected));
    setResult(validation);
    onEvaluated?.(validation.correct);
    setAttempts((a) => a + 1);
    if (!validation.correct && attempts + 1 >= maxAttempts) {
      setShowSolution(true);
    }
  }

  return (
    <fieldset className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <legend className="text-lg font-medium text-slate-900 dark:text-white">
        {getLocalizedString(exercise.question, i18n.language)}
      </legend>
      <div className="space-y-2">
        {exercise.options?.map((option, index) => (
          <label
            key={index}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <input
              type="radio"
              name={exercise.id}
              value={index}
              checked={selected === index}
              onChange={() => setSelected(index)}
              className="h-4 w-4 text-primary-600"
            />
            <span>{getLocalizedString(option, i18n.language)}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={selected === null}
        className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50"
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
    </fieldset>
  );
}
