interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  const count = Math.max(1, Math.min(lines, 8));

  return (
    <div className={`animate-pulse space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-3 rounded bg-slate-200 dark:bg-slate-700"
          style={{ width: `${Math.max(36, 100 - index * 10)}%` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

