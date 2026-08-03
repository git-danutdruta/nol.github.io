import { Suspense, lazy } from 'react';
import type { Exercise } from '@/types/curriculum';
import { SkeletonLoader } from '@/components/SkeletonLoader';

const MultipleChoiceExercise = lazy(() =>
  import('@/components/exercises/MultipleChoiceExercise').then((module) => ({
    default: module.MultipleChoiceExercise,
  }))
);
const NumericExercise = lazy(() =>
  import('@/components/exercises/NumericExercise').then((module) => ({
    default: module.NumericExercise,
  }))
);
const FreeResponseExercise = lazy(() =>
  import('@/components/exercises/FreeResponseExercise').then((module) => ({
    default: module.FreeResponseExercise,
  }))
);
const ExpressionExercise = lazy(() =>
  import('@/components/exercises/ExpressionExercise').then((module) => ({
    default: module.ExpressionExercise,
  }))
);
const DrawingExercise = lazy(() =>
  import('@/components/exercises/DrawingExercise').then((module) => ({
    default: module.DrawingExercise,
  }))
);

interface ExerciseRendererProps {
  exercise: Exercise;
  onEvaluated?: (result: { exerciseId: string; correct: boolean }) => void;
}

export function ExerciseRenderer({ exercise, onEvaluated }: ExerciseRendererProps) {
  const handleEvaluated = (correct: boolean) => {
    onEvaluated?.({ exerciseId: exercise.id, correct });
  };

  const loadingFallback = <SkeletonLoader lines={2} className="border-dashed" />;

  switch (exercise.type) {
    case 'multiple-choice':
      return (
        <Suspense fallback={loadingFallback}>
          <MultipleChoiceExercise exercise={exercise} onEvaluated={handleEvaluated} />
        </Suspense>
      );
    case 'numeric':
      return (
        <Suspense fallback={loadingFallback}>
          <NumericExercise exercise={exercise} onEvaluated={handleEvaluated} />
        </Suspense>
      );
    case 'free-response':
      return (
        <Suspense fallback={loadingFallback}>
          <FreeResponseExercise exercise={exercise} onEvaluated={handleEvaluated} />
        </Suspense>
      );
    case 'expression':
      return (
        <Suspense fallback={loadingFallback}>
          <ExpressionExercise exercise={exercise} onEvaluated={handleEvaluated} />
        </Suspense>
      );
    case 'drawing':
      return (
        <Suspense fallback={loadingFallback}>
          <DrawingExercise exercise={exercise} onEvaluated={handleEvaluated} />
        </Suspense>
      );
    default:
      return <p>Unsupported exercise type.</p>;
  }
}
