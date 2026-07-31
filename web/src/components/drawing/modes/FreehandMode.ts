import type { DrawingMode, FreehandState, Stroke } from '@/components/drawing/types';

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

export const FreehandMode: DrawingMode = {
  id: 'freehand',
  name: 'Freehand',
  icon: 'pen',

  render(ctx, state) {
    const freehand = state as FreehandState;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const stroke of freehand.strokes) {
      if (stroke.points.length < 2) continue;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = stroke.opacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  },

  onPointerDown(point, state) {
    const freehand = state as FreehandState;
    const newStroke: Stroke = {
      id: generateId(),
      points: [point],
      color: '#000000',
      width: 2,
      opacity: 1,
      tool: 'pen',
    };
    return { ...freehand, strokes: [...freehand.strokes, newStroke] };
  },

  onPointerMove(point, state) {
    const freehand = state as FreehandState;
    if (freehand.strokes.length === 0) return freehand;

    const strokes = [...freehand.strokes];
    const current = strokes[strokes.length - 1];
    strokes[strokes.length - 1] = { ...current, points: [...current.points, point] };
    return { ...freehand, strokes };
  },

  onPointerUp(state) {
    return state;
  },
};
