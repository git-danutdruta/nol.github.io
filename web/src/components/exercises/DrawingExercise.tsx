import { useMemo, useState } from 'react';
import type { Exercise } from '@/types/curriculum';
import { getLocalizedString } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { DrawingEngine } from '@/components/drawing/DrawingEngine';
import type { DrawingState } from '@/components/drawing/types';
import { gradeGeometryDrawing, type GeometryGradeResult } from '@/lib/geometry/grader';
import { SelfCheckOverlay } from '@/components/drawing/SelfCheckOverlay';

interface DrawingExerciseProps {
  exercise: Exercise;
  onEvaluated?: (correct: boolean) => void;
}

export function DrawingExercise({ exercise, onEvaluated }: DrawingExerciseProps) {
  const { i18n } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [selfCheckOpen, setSelfCheckOpen] = useState(false);
  const [latestDrawing, setLatestDrawing] = useState<DrawingState | null>(null);
  const [gradeResult, setGradeResult] = useState<GeometryGradeResult | null>(null);
  const [completedManually, setCompletedManually] = useState(false);

  const initialMode = exercise.drawingMode === 'graph' ? 'graph' : 'freehand';
  const drawingKey = `exercise:${exercise.id}`;
  const question = getLocalizedString(exercise.question, i18n.language);
  const solution = exercise.solution ? getLocalizedString(exercise.solution, i18n.language) : undefined;

  const isGeometryExercise = useMemo(() => {
    const lower = question.toLowerCase();
    return (
      exercise.drawingMode === 'geometry' ||
      lower.includes('geometry') ||
      lower.includes('perpendicular') ||
      lower.includes('parallel') ||
      lower.includes('bisector') ||
      lower.includes('midpoint')
    );
  }, [exercise.drawingMode, question]);

  const rubric = gradeResult?.rubric ?? [
    'Check key geometric constraints requested in the prompt.',
    'Compare your construction to the expected method before marking complete.',
  ];

  const runAutoCheck = () => {
    if (!latestDrawing) {
      setGradeResult({
        correct: false,
        status: 'needs-review',
        confidence: 0.2,
        feedback: 'Draw first, then run auto-check.',
        rubric,
      });
      return;
    }

    const result = gradeGeometryDrawing(exercise, latestDrawing);
    setGradeResult(result);
    if (result.correct) {
      onEvaluated?.(true);
    }
  };

  const markManualComplete = () => {
    setCompletedManually(true);
    onEvaluated?.(true);
  };

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-lg font-medium text-slate-900 dark:text-white">
        {question}
      </p>

      {isGeometryExercise && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runAutoCheck}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Auto-check
          </button>
          <button
            type="button"
            onClick={() => setSelfCheckOpen(true)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Self-check mode
          </button>
          <button
            type="button"
            onClick={markManualComplete}
            className="rounded-md border border-emerald-300 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
          >
            Mark complete
          </button>
        </div>
      )}

      <DrawingEngine
        drawingKey={drawingKey}
        initialMode={initialMode}
        onStateChange={setLatestDrawing}
        onSave={() => {
          setSaved(true);
          onEvaluated?.(true);
        }}
      />

      {gradeResult && (
        <div
          className={`rounded-md p-3 text-sm ${
            gradeResult.correct
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200'
          }`}
          role="status"
          aria-live="polite"
        >
          {gradeResult.feedback}
        </div>
      )}

      {saved && (
        <div
          className="rounded-md bg-green-100 p-3 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          role="status"
          aria-live="polite"
        >
          Drawing saved for review.
        </div>
      )}

      {completedManually && (
        <div
          className="rounded-md bg-blue-100 p-3 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          role="status"
          aria-live="polite"
        >
          Marked complete with self-assessment.
        </div>
      )}

      <SelfCheckOverlay
        open={selfCheckOpen}
        onClose={() => setSelfCheckOpen(false)}
        title="Geometry self-check"
        solutionText={solution}
        rubric={rubric}
      />
    </div>
  );
}
