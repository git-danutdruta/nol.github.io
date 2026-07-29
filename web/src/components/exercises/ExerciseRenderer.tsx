import type { Exercise } from '@/types/curriculum';
import { MultipleChoiceExercise } from '@/components/exercises/MultipleChoiceExercise';
import { NumericExercise } from '@/components/exercises/NumericExercise';
import { FreeResponseExercise } from '@/components/exercises/FreeResponseExercise';
import { ExpressionExercise } from '@/components/exercises/ExpressionExercise';
import { DrawingExercise } from '@/components/exercises/DrawingExercise';

interface ExerciseRendererProps {
  exercise: Exercise;
}

export function ExerciseRenderer({ exercise }: ExerciseRendererProps) {
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoiceExercise exercise={exercise} />;
    case 'numeric':
      return <NumericExercise exercise={exercise} />;
    case 'free-response':
      return <FreeResponseExercise exercise={exercise} />;
    case 'expression':
      return <ExpressionExercise exercise={exercise} />;
    case 'drawing':
      return <DrawingExercise exercise={exercise} />;
    default:
      return <p>Unsupported exercise type.</p>;
  }
}
