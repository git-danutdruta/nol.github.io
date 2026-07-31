import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { FreehandMode } from '@/components/drawing/modes/FreehandMode';
import { GraphingMode } from '@/components/drawing/modes/GraphingMode';
import { MobileToolbar } from '@/components/drawing/MobileToolbar';
import type {
  DrawingMode,
  DrawingModeType,
  DrawingState,
  FreehandState,
  GraphingState,
  PlottedFunction,
  Point,
} from '@/components/drawing/types';
import { DEFAULT_VIEWPORT } from '@/lib/graphing/viewport';
import { useDrawingStore } from '@/stores/drawingStore';

interface DrawingEngineProps {
  drawingKey: string;
  initialMode?: DrawingModeType;
  onSave?: () => void;
}

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 420;

const MODES: Record<DrawingModeType, DrawingMode> = {
  freehand: FreehandMode,
  graph: GraphingMode,
};

function createInitialState(mode: DrawingModeType): DrawingState {
  const base: DrawingState = { version: 1, mode };
  if (mode === 'freehand') {
    base.freehand = { strokes: [] };
  }
  if (mode === 'graph') {
    base.graphing = { functions: [], viewport: DEFAULT_VIEWPORT };
  }
  return base;
}

function ensureModeState(state: DrawingState, mode: DrawingModeType): DrawingState {
  if (mode === 'freehand' && !state.freehand) {
    return { ...state, freehand: { strokes: [] } };
  }
  if (mode === 'graph' && !state.graphing) {
    return { ...state, graphing: { functions: [], viewport: DEFAULT_VIEWPORT } };
  }
  return state;
}

function getPointer(canvas: HTMLCanvasElement, event: PointerEvent<HTMLCanvasElement>): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
    pressure: event.pressure,
  };
}

export function DrawingEngine({ drawingKey, initialMode = 'freehand', onSave }: DrawingEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const saveDrawing = useDrawingStore((store) => store.saveDrawing);
  const getDrawing = useDrawingStore((store) => store.getDrawing);
  const [state, setState] = useState<DrawingState>(() => createInitialState(initialMode));
  const [graphInput, setGraphInput] = useState('x');

  useEffect(() => {
    const persisted = getDrawing(drawingKey);
    if (persisted) {
      setState(ensureModeState(persisted, persisted.mode));
      return;
    }
    setState(createInitialState(initialMode));
  }, [drawingKey, getDrawing, initialMode]);

  const activeMode = useMemo(() => MODES[state.mode], [state.mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (state.mode === 'freehand') {
      activeMode.render(ctx, state.freehand ?? { strokes: [] }, canvas.width, canvas.height);
      return;
    }

    if (state.mode === 'graph') {
      activeMode.render(
        ctx,
        state.graphing ?? { functions: [], viewport: DEFAULT_VIEWPORT },
        canvas.width,
        canvas.height
      );
    }
  }, [activeMode, state]);

  const setMode = (mode: DrawingModeType) => {
    setState((prev) => ensureModeState({ ...prev, mode }, mode));
  };

  const clearCurrentMode = () => {
    setState((prev) => {
      if (prev.mode === 'freehand') {
        return { ...prev, freehand: { strokes: [] } };
      }
      return { ...prev, graphing: { functions: [], viewport: DEFAULT_VIEWPORT } };
    });
  };

  const saveCurrent = () => {
    saveDrawing(drawingKey, state);
    onSave?.();
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (state.mode !== 'freehand') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(event.pointerId);
    const point = getPointer(canvas, event);
    const modeState = state.freehand ?? ({ strokes: [] } as FreehandState);
    const next = activeMode.onPointerDown?.(point, modeState) as FreehandState | undefined;
    if (next) setState((prev) => ({ ...prev, freehand: next }));
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (state.mode !== 'freehand' || (event.buttons & 1) !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = getPointer(canvas, event);
    const modeState = state.freehand ?? ({ strokes: [] } as FreehandState);
    const next = activeMode.onPointerMove?.(point, modeState) as FreehandState | undefined;
    if (next) setState((prev) => ({ ...prev, freehand: next }));
  };

  const onPointerUp = () => {
    if (state.mode !== 'freehand') return;
    const modeState = state.freehand ?? ({ strokes: [] } as FreehandState);
    const next = activeMode.onPointerUp?.(modeState) as FreehandState | undefined;
    if (next) setState((prev) => ({ ...prev, freehand: next }));
  };

  const addGraphFunction = () => {
    const expression = graphInput.trim();
    if (!expression) return;

    const fn: PlottedFunction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      expression,
      color: '#2563eb',
      visible: true,
    };

    setState((prev) => {
      const graphing: GraphingState = prev.graphing ?? { functions: [], viewport: DEFAULT_VIEWPORT };
      return { ...prev, graphing: { ...graphing, functions: [...graphing.functions, fn] } };
    });
  };

  return (
    <div className="space-y-3">
      <MobileToolbar mode={state.mode} onModeChange={setMode} onSave={saveCurrent} onClear={clearCurrentMode} />

      {state.mode === 'graph' && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
          <label htmlFor={`graph-expression-${drawingKey}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            f(x)
          </label>
          <input
            id={`graph-expression-${drawingKey}`}
            type="text"
            value={graphInput}
            onChange={(event) => setGraphInput(event.target.value)}
            placeholder="e.g. x^2 - 3*x + 2"
            className="min-w-[220px] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="button"
            onClick={addGraphFunction}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Plot
          </button>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full rounded-lg border border-slate-300 bg-white touch-none dark:border-slate-700 dark:bg-slate-950"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </div>
  );
}


