const STORAGE_KEY = 'nol-client-error-log';
const MAX_ENTRIES = 50;

export interface ClientErrorEntry {
  id: string;
  timestamp: string;
  name: string;
  message: string;
  stack?: string;
  context?: Record<string, string>;
}

function readStoredEntries(): ClientErrorEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClientErrorEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistEntries(entries: ClientErrorEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // Ignore storage errors to avoid breaking app flow.
  }
}

function normalizeError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    name: 'UnknownError',
    message: typeof error === 'string' ? error : 'Unknown runtime error',
  };
}

export function recordClientError(error: unknown, context?: Record<string, string>) {
  const normalized = normalizeError(error);
  const entry: ClientErrorEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    timestamp: new Date().toISOString(),
    name: normalized.name,
    message: normalized.message,
    stack: normalized.stack,
    context,
  };

  const next = [entry, ...readStoredEntries()];
  persistEntries(next);

  // Keep console output for local debugging and browser devtools diagnostics.
  console.error('[NOL][client-error]', entry);
}

export function getClientErrorLog(): ClientErrorEntry[] {
  return readStoredEntries();
}
