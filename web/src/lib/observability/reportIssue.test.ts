import { describe, expect, it } from 'vitest';
import { buildBugReportUrl, buildContentErrorUrl } from '@/lib/observability/reportIssue';

describe('reportIssue url helpers', () => {
  it('builds bug report URL with lesson and exercise context', () => {
    const href = buildBugReportUrl({
      lessonId: 'algebra-linear-equations',
      exerciseId: 'ex-2',
      appUrl: 'https://example.test/lesson/algebra-linear-equations',
      browserInfo: 'Browser X',
    });

    const url = new URL(href);
    expect(url.searchParams.get('template')).toBe('bug_report.yml');
    expect(url.searchParams.get('lesson_id')).toBe('algebra-linear-equations');
    expect(url.searchParams.get('exercise_id')).toBe('ex-2');
  });

  it('builds content error URL with lesson context', () => {
    const href = buildContentErrorUrl({
      lessonId: 'arithmetic-fractions',
      appUrl: 'https://example.test/lesson/arithmetic-fractions',
      browserInfo: 'Browser Y',
    });

    const url = new URL(href);
    expect(url.searchParams.get('template')).toBe('content_error.yml');
    expect(url.searchParams.get('lesson_id')).toBe('arithmetic-fractions');
    expect(url.searchParams.get('section_id')).toBe('lesson-content');
  });
});

