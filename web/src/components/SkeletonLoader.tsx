import { Skeleton } from '@/components/ui/Skeleton';

interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export function SkeletonLoader({ lines = 3, className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`rounded-lg border border-slate-200 p-4 dark:border-slate-800 ${className}`}>
      <Skeleton lines={lines} />
    </div>
  );
}
