import type { DrawingMode, GraphingState, PlottedFunction } from '@/components/drawing/types';
import { evaluateFunction } from '@/lib/graphing/evaluator';
import { worldToScreen, DEFAULT_VIEWPORT } from '@/lib/graphing/viewport';

export const GraphingMode: DrawingMode = {
  id: 'graph',
  name: 'Graph',
  icon: 'line-chart',

  render(ctx, state, width, height) {
    const graphing = state as GraphingState;
    const viewport = graphing.viewport || DEFAULT_VIEWPORT;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    drawGrid(ctx, viewport, width, height);

    // Draw axes
    drawAxes(ctx, viewport, width, height);

    // Draw functions
    for (const fn of graphing.functions) {
      if (!fn.visible) continue;
      drawFunction(ctx, fn, viewport, width, height);
    }
  },

  onPointerDown() {
    return undefined;
  },

  onPointerMove() {
    return undefined;
  },

  onPointerUp() {
    return undefined;
  },
};

function drawGrid(
  ctx: CanvasRenderingContext2D,
  viewport: typeof DEFAULT_VIEWPORT,
  width: number,
  height: number
) {
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  const xStep = niceStep(viewport.xMax - viewport.xMin);
  const yStep = niceStep(viewport.yMax - viewport.yMin);

  ctx.beginPath();
  for (let x = Math.ceil(viewport.xMin / xStep) * xStep; x <= viewport.xMax; x += xStep) {
    const screen = worldToScreen(x, 0, viewport, width, height);
    ctx.moveTo(screen.x, 0);
    ctx.lineTo(screen.x, height);
  }
  for (let y = Math.ceil(viewport.yMin / yStep) * yStep; y <= viewport.yMax; y += yStep) {
    const screen = worldToScreen(0, y, viewport, width, height);
    ctx.moveTo(0, screen.y);
    ctx.lineTo(width, screen.y);
  }
  ctx.stroke();
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  viewport: typeof DEFAULT_VIEWPORT,
  width: number,
  height: number
) {
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;

  const origin = worldToScreen(0, 0, viewport, width, height);

  ctx.beginPath();
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.stroke();
}

function drawFunction(
  ctx: CanvasRenderingContext2D,
  fn: PlottedFunction,
  viewport: typeof DEFAULT_VIEWPORT,
  width: number,
  height: number
) {
  const result = evaluateFunction(fn.expression, viewport.xMin, viewport.xMax);
  if (result.values.length < 2) return;

  ctx.beginPath();
  const start = worldToScreen(result.values[0].x, result.values[0].y, viewport, width, height);
  ctx.moveTo(start.x, start.y);

  for (let i = 1; i < result.values.length; i++) {
    const point = worldToScreen(result.values[i].x, result.values[i].y, viewport, width, height);
    ctx.lineTo(point.x, point.y);
  }

  ctx.strokeStyle = fn.color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function niceStep(range: number): number {
  const rough = range / 10;
  const exponent = Math.floor(Math.log10(rough));
  const fraction = rough / Math.pow(10, exponent);

  let niceFraction: number;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * Math.pow(10, exponent);
}
