import { buildIssueUrl } from '@/lib/observability/reportIssue';

interface ReportIssueProps {
  lessonId: string;
  exerciseId?: string;
  kind?: 'bug' | 'content';
  compact?: boolean;
}

export function ReportIssue({ lessonId, exerciseId, kind = 'bug', compact = false }: ReportIssueProps) {
  const template = kind === 'content' ? 'content_error.yml' : 'bug_report.yml';
  const href = buildIssueUrl(template, { lessonId, exerciseId });
  const label =
    kind === 'content'
      ? compact
        ? 'Report content'
        : 'Report content error'
      : compact
        ? 'Report issue'
        : 'Report a problem';

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="motion-press inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {label}
    </a>
  );
}

