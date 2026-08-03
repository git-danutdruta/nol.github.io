interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export function SkeletonLoader({ lines = 3, className = '' }: SkeletonLoaderProps) {
  const safeLines = Math.max(1, Math.min(lines, 8));

  return (
    <div className={`animate-pulse space-y-2 rounded-lg border border-slate-200 p-4 dark:border-slate-800 ${className}`}>
      {Array.from({ length: safeLines }).map((_, index) => (
        <div
          key={index}
          className="h-3 rounded bg-slate-200 dark:bg-slate-700"
          style={{ width: `${Math.max(40, 100 - index * 8)}%` }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading content</span>
    </div>
  );
}

