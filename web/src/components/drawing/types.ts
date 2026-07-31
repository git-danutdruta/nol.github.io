export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  tool: 'pen' | 'highlighter' | 'eraser';
}

export interface Viewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PlottedFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

export interface FreehandState {
  strokes: Stroke[];
}

export interface GraphingState {
  functions: PlottedFunction[];
  viewport: Viewport;
}

export interface DrawingState {
  version: 1;
  mode: DrawingModeType;
  freehand?: FreehandState;
  graphing?: GraphingState;
}

export type DrawingModeType = 'freehand' | 'graph';

export interface DrawingMode {
  id: DrawingModeType;
  name: string;
  icon: string;
  render(ctx: CanvasRenderingContext2D, state: unknown, width: number, height: number): void;
  onPointerDown?(point: Point, state: unknown): unknown;
  onPointerMove?(point: Point, state: unknown): unknown;
  onPointerUp?(state: unknown): unknown;
}
