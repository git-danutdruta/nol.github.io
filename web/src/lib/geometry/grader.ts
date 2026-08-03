import type { Exercise } from '@/types/curriculum';
import type { DrawingState, Point, Stroke } from '@/components/drawing/types';

interface LineSegment {
  start: Point;
  end: Point;
  length: number;
  angle: number;
}

export interface GeometryGradeResult {
  correct: boolean;
  status: 'passed' | 'needs-review' | 'manual';
  confidence: number;
  feedback: string;
  rubric: string[];
}

function distance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function toLineSegment(stroke: Stroke): LineSegment | null {
  if (stroke.points.length < 2) return null;

  const start = stroke.points[0];
  const end = stroke.points[stroke.points.length - 1];
  const direct = distance(start, end);
  if (direct < 40) return null;

  let pathLength = 0;
  for (let i = 1; i < stroke.points.length; i++) {
    pathLength += distance(stroke.points[i - 1], stroke.points[i]);
  }

  const straightness = pathLength / Math.max(direct, 1);
  if (straightness > 1.22) return null;

  return {
    start,
    end,
    length: direct,
    angle: Math.atan2(end.y - start.y, end.x - start.x),
  };
}

function normalizeAngleDiff(a: number, b: number): number {
  let diff = Math.abs(a - b);
  while (diff > Math.PI) diff -= Math.PI;
  return Math.abs(diff);
}

function isPerpendicular(a: LineSegment, b: LineSegment): boolean {
  const diff = normalizeAngleDiff(a.angle, b.angle);
  return Math.abs(diff - Math.PI / 2) <= 0.35;
}

function isParallel(a: LineSegment, b: LineSegment): boolean {
  const diff = normalizeAngleDiff(a.angle, b.angle);
  return diff <= 0.18;
}

function midpoint(segment: LineSegment): Point {
  return {
    x: (segment.start.x + segment.end.x) / 2,
    y: (segment.start.y + segment.end.y) / 2,
  };
}

function lineIntersection(a: LineSegment, b: LineSegment): Point | null {
  const x1 = a.start.x;
  const y1 = a.start.y;
  const x2 = a.end.x;
  const y2 = a.end.y;
  const x3 = b.start.x;
  const y3 = b.start.y;
  const x4 = b.end.x;
  const y4 = b.end.y;

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denom) < 1e-6) return null;

  const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
  const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

  return { x: px, y: py };
}

function getGeometryLineSegments(state: DrawingState): LineSegment[] {
  const strokes = state.freehand?.strokes ?? [];
  return strokes
    .map(toLineSegment)
    .filter((segment): segment is LineSegment => segment !== null)
    .sort((a, b) => b.length - a.length);
}

function inferTask(
  question: string
): 'perpendicular-bisector' | 'perpendicular' | 'parallel' | 'midpoint' | 'unsupported' {
  if (question.includes('perpendicular bisector')) return 'perpendicular-bisector';
  if (question.includes('perpendicular')) return 'perpendicular';
  if (question.includes('parallel')) return 'parallel';
  if (question.includes('midpoint')) return 'midpoint';
  return 'unsupported';
}

function rubricForTask(task: ReturnType<typeof inferTask>): string[] {
  switch (task) {
    case 'perpendicular-bisector':
      return [
        'Your construction line should intersect the target segment at roughly 90 degrees.',
        'The intersection should be close to the midpoint of the target segment.',
        'Both halves of the target segment should look approximately equal.',
      ];
    case 'perpendicular':
      return [
        'The two lines should meet at an angle close to 90 degrees.',
        'The intersection point should match the prompt target point if given.',
      ];
    case 'parallel':
      return [
        'The two lines should have the same slope (same direction).',
        'They should not intersect in the visible drawing region.',
      ];
    case 'midpoint':
      return [
        'Mark the midpoint so distances to each endpoint appear equal.',
        'Check with a ruler or grid overlay if available.',
      ];
    default:
      return [
        'Compare your drawing to the expected construction steps.',
        'Check key constraints (equal lengths, right angles, alignment).',
      ];
  }
}

export function gradeGeometryDrawing(exercise: Exercise, state: DrawingState): GeometryGradeResult {
  const question = String(exercise.question).toLowerCase();
  const task = inferTask(question);
  const segments = getGeometryLineSegments(state);

  if (segments.length < 2) {
    return {
      correct: false,
      status: 'needs-review',
      confidence: 0.2,
      feedback: 'Draw at least two clear line segments before running auto-check.',
      rubric: rubricForTask(task),
    };
  }

  if (task === 'perpendicular') {
    for (let i = 0; i < segments.length; i++) {
      for (let j = i + 1; j < segments.length; j++) {
        if (isPerpendicular(segments[i], segments[j])) {
          return {
            correct: true,
            status: 'passed',
            confidence: 0.88,
            feedback: 'Auto-check passed: found two near-perpendicular lines.',
            rubric: rubricForTask(task),
          };
        }
      }
    }

    return {
      correct: false,
      status: 'needs-review',
      confidence: 0.66,
      feedback:
        'Auto-check could not confirm a right angle. Try refining the angle or use self-check.',
      rubric: rubricForTask(task),
    };
  }

  if (task === 'parallel') {
    for (let i = 0; i < segments.length; i++) {
      for (let j = i + 1; j < segments.length; j++) {
        if (isParallel(segments[i], segments[j])) {
          return {
            correct: true,
            status: 'passed',
            confidence: 0.84,
            feedback: 'Auto-check passed: found two near-parallel lines.',
            rubric: rubricForTask(task),
          };
        }
      }
    }

    return {
      correct: false,
      status: 'needs-review',
      confidence: 0.62,
      feedback:
        'Auto-check could not confirm parallel lines. Adjust slope alignment or use self-check.',
      rubric: rubricForTask(task),
    };
  }

  if (task === 'perpendicular-bisector') {
    const base = segments[0];
    const baseMid = midpoint(base);

    for (let i = 1; i < segments.length; i++) {
      const candidate = segments[i];
      if (!isPerpendicular(base, candidate)) continue;

      const cross = lineIntersection(base, candidate);
      if (!cross) continue;

      if (distance(cross, baseMid) <= Math.max(26, base.length * 0.12)) {
        return {
          correct: true,
          status: 'passed',
          confidence: 0.9,
          feedback: 'Auto-check passed: found a line close to a perpendicular bisector.',
          rubric: rubricForTask(task),
        };
      }
    }

    return {
      correct: false,
      status: 'needs-review',
      confidence: 0.68,
      feedback:
        'Auto-check found line segments, but could not verify perpendicular bisector conditions. Use self-check overlay to compare.',
      rubric: rubricForTask(task),
    };
  }

  if (task === 'midpoint') {
    const longest = segments[0];
    const m = midpoint(longest);
    const candidates = segments.flatMap((segment) => [segment.start, segment.end]);
    const hasMidpointMark = candidates.some((point) => distance(point, m) <= 20);

    if (hasMidpointMark) {
      return {
        correct: true,
        status: 'passed',
        confidence: 0.72,
        feedback: 'Auto-check found a midpoint mark near the center of your main segment.',
        rubric: rubricForTask(task),
      };
    }

    return {
      correct: false,
      status: 'needs-review',
      confidence: 0.55,
      feedback:
        'Auto-check could not detect a midpoint mark. You can still complete via self-check.',
      rubric: rubricForTask(task),
    };
  }

  return {
    correct: false,
    status: 'manual',
    confidence: 0.3,
    feedback: 'Auto-check is not available for this construction yet. Use self-check mode.',
    rubric: rubricForTask(task),
  };
}
