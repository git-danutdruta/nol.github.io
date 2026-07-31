import type { ProgressExportPayload, ProgressPersistedState } from '@/types/progress';
import { PROGRESS_SCHEMA_VERSION } from '@/types/progress';
import { sanitizeProgressState } from '@/lib/progressMigrations';

function isProgressExportPayload(value: unknown): value is ProgressExportPayload {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<ProgressExportPayload>;
  return (
    payload.app === 'nol-math' && payload.type === 'progress-export' && payload.data !== undefined
  );
}

export function createProgressExportPayload(data: ProgressPersistedState): ProgressExportPayload {
  return {
    app: 'nol-math',
    type: 'progress-export',
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function exportProgressToJson(data: ProgressPersistedState): string {
  return JSON.stringify(createProgressExportPayload(data), null, 2);
}

export function parseImportedProgress(json: string): ProgressPersistedState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json) as unknown;
  } catch {
    throw new Error('Invalid JSON file.');
  }

  if (!isProgressExportPayload(parsed)) {
    throw new Error('Unsupported import file format.');
  }

  return sanitizeProgressState(parsed.data);
}

export function downloadProgressBackup(data: ProgressPersistedState): void {
  const json = exportProgressToJson(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `nol-progress-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
