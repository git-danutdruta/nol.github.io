import type { Viewport } from '@/components/drawing/types';

export const DEFAULT_VIEWPORT: Viewport = {
  xMin: -10,
  xMax: 10,
  yMin: -10,
  yMax: 10,
};

export function worldToScreen(
  x: number,
  y: number,
  viewport: Viewport,
  width: number,
  height: number
): { x: number; y: number } {
  const xScale = width / (viewport.xMax - viewport.xMin);
  const yScale = height / (viewport.yMax - viewport.yMin);
  return {
    x: (x - viewport.xMin) * xScale,
    y: height - (y - viewport.yMin) * yScale,
  };
}

export function screenToWorld(
  x: number,
  y: number,
  viewport: Viewport,
  width: number,
  height: number
): { x: number; y: number } {
  const xScale = width / (viewport.xMax - viewport.xMin);
  const yScale = height / (viewport.yMax - viewport.yMin);
  return {
    x: viewport.xMin + x / xScale,
    y: viewport.yMin + (height - y) / yScale,
  };
}

export function zoomViewport(
  viewport: Viewport,
  factor: number,
  centerX: number,
  centerY: number
): Viewport {
  const xRange = (viewport.xMax - viewport.xMin) * factor;
  const yRange = (viewport.yMax - viewport.yMin) * factor;
  return {
    xMin: centerX - xRange / 2,
    xMax: centerX + xRange / 2,
    yMin: centerY - yRange / 2,
    yMax: centerY + yRange / 2,
  };
}

export function panViewport(viewport: Viewport, dx: number, dy: number): Viewport {
  return {
    xMin: viewport.xMin + dx,
    xMax: viewport.xMax + dx,
    yMin: viewport.yMin + dy,
    yMax: viewport.yMax + dy,
  };
}
