import type { ReactNode } from 'react';

interface FullscreenDrawingProps {
  isFullscreen: boolean;
  children: ReactNode;
}

export function FullscreenDrawing({ isFullscreen, children }: FullscreenDrawingProps) {
  if (!isFullscreen) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-30 overflow-auto bg-white p-3 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
