const ISSUE_BASE_URL = 'https://github.com/git-danutdruta/nol.github.io/issues/new';

type IssueTemplate = 'bug_report.yml' | 'content_error.yml';

export interface IssueContext {
  lessonId: string;
  exerciseId?: string;
  appUrl?: string;
  browserInfo?: string;
}

function getDefaultAppUrl(): string {
  if (typeof window === 'undefined') return 'unknown';
  return window.location.href;
}

function getDefaultBrowserInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  return navigator.userAgent;
}

export function buildBugReportUrl(context: IssueContext): string {
  const url = new URL(ISSUE_BASE_URL);
  url.searchParams.set('template', 'bug_report.yml');
  url.searchParams.set('labels', 'bug');
  url.searchParams.set('title', `[BUG] ${context.lessonId}${context.exerciseId ? ` / ${context.exerciseId}` : ''}`);
  url.searchParams.set('app_url', context.appUrl ?? getDefaultAppUrl());
  url.searchParams.set('browser_info', context.browserInfo ?? getDefaultBrowserInfo());
  url.searchParams.set('lesson_id', context.lessonId);
  url.searchParams.set('exercise_id', context.exerciseId ?? 'n/a');
  return url.toString();
}

export function buildContentErrorUrl(context: IssueContext): string {
  const url = new URL(ISSUE_BASE_URL);
  url.searchParams.set('template', 'content_error.yml');
  url.searchParams.set('labels', 'content,bug');
  url.searchParams.set('title', `[CONTENT] ${context.lessonId}`);
  url.searchParams.set('app_url', context.appUrl ?? getDefaultAppUrl());
  url.searchParams.set('browser_info', context.browserInfo ?? getDefaultBrowserInfo());
  url.searchParams.set('lesson_id', context.lessonId);
  url.searchParams.set('section_id', context.exerciseId ?? 'lesson-content');
  return url.toString();
}

export function buildIssueUrl(template: IssueTemplate, context: IssueContext): string {
  return template === 'bug_report.yml' ? buildBugReportUrl(context) : buildContentErrorUrl(context);
}

