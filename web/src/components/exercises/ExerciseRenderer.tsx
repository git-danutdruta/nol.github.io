import type { Exercise } from '@/types/curriculum';
import { MultipleChoiceExercise } from '@/components/exercises/MultipleChoiceExercise';
import { NumericExercise } from '@/components/exercises/NumericExercise';
import { FreeResponseExercise } from '@/components/exercises/FreeResponseExercise';
import { ExpressionExercise } from '@/components/exercises/ExpressionExercise';
import { DrawingExercise } from '@/components/exercises/DrawingExercise';

interface ExerciseRendererProps {
  exercise: Exercise;
  onEvaluated?: (result: { exerciseId: string; correct: boolean }) => void;
}

export function ExerciseRenderer({ exercise, onEvaluated }: ExerciseRendererProps) {
  const handleEvaluated = (correct: boolean) => {
    onEvaluated?.({ exerciseId: exercise.id, correct });
  };

  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} onEvaluated={handleEvaluated} />;
    case 'numeric':
      return <NumericExercise exercise={exercise} onEvaluated={handleEvaluated} />;
    case 'free-response':
      return <FreeResponseExercise exercise={exercise} onEvaluated={handleEvaluated} />;
    case 'expression':
      return <ExpressionExercise exercise={exercise} onEvaluated={handleEvaluated} />;
    case 'drawing':
      return <DrawingExercise exercise={exercise} onEvaluated={handleEvaluated} />;
    default:
      return <p>Unsupported exercise type.</p>;
  }
}
