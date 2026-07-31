import { beforeEach, describe, expect, it } from 'vitest';
import { getClientErrorLog, recordClientError } from '@/lib/observability/clientLogger';

describe('clientLogger', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores structured errors in localStorage', () => {
    recordClientError(new Error('boom'), { source: 'test' });

    const log = getClientErrorLog();
    expect(log).toHaveLength(1);
    expect(log[0].message).toBe('boom');
    expect(log[0].context?.source).toBe('test');
  });

  it('normalizes string errors', () => {
    recordClientError('string failure');

    const log = getClientErrorLog();
    expect(log[0].name).toBe('UnknownError');
    expect(log[0].message).toBe('string failure');
  });
});
