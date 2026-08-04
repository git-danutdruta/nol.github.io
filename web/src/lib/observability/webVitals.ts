type VitalName = 'FCP' | 'LCP' | 'CLS' | 'INP' | 'TTFB';

interface VitalMetric {
  name: VitalName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

const DEV_ONLY_PREFIX = '[NOL][web-vitals]';

function rateMetric(name: VitalName, value: number): VitalMetric['rating'] {
  switch (name) {
    case 'LCP':
      if (value <= 2500) return 'good';
      if (value <= 4000) return 'needs-improvement';
      return 'poor';
    case 'CLS':
      if (value <= 0.1) return 'good';
      if (value <= 0.25) return 'needs-improvement';
      return 'poor';
    case 'INP':
      if (value <= 200) return 'good';
      if (value <= 500) return 'needs-improvement';
      return 'poor';
    case 'FCP':
      if (value <= 1800) return 'good';
      if (value <= 3000) return 'needs-improvement';
      return 'poor';
    case 'TTFB':
      if (value <= 800) return 'good';
      if (value <= 1800) return 'needs-improvement';
      return 'poor';
    default:
      return 'needs-improvement';
  }
}

function shouldLogInCurrentMode(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem('nol-debug-web-vitals') === '1';
}

function logMetric(name: VitalName, value: number) {
  if (!shouldLogInCurrentMode()) return;
  const metric: VitalMetric = {
    name,
    value,
    rating: rateMetric(name, value),
  };
  console.info(DEV_ONLY_PREFIX, metric);
}

function observePaintMetrics() {
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
  if (fcpEntry) {
    logMetric('FCP', fcpEntry.startTime);
  }
}

function observeNavigationMetrics() {
  const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const nav = entries[0];
  if (!nav) return;
  logMetric('TTFB', nav.responseStart);
}

function observeLargestContentfulPaint() {
  if (!('PerformanceObserver' in window)) return;
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const last = entries[entries.length - 1];
    if (last) {
      logMetric('LCP', last.startTime);
    }
  });
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
}

function observeLayoutShift() {
  if (!('PerformanceObserver' in window)) return;
  let cls = 0;
  const observer = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries() as Array<
      PerformanceEntry & { value?: number; hadRecentInput?: boolean }
    >) {
      if (entry.hadRecentInput) continue;
      cls += entry.value ?? 0;
    }
    logMetric('CLS', cls);
  });
  observer.observe({ type: 'layout-shift', buffered: true });
}

function observeInteractionToNextPaint() {
  if (!('PerformanceObserver' in window)) return;
  const observer = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    for (const entry of entries) {
      logMetric('INP', entry.duration);
    }
  });

  try {
    const options: PerformanceObserverInit & { durationThreshold?: number } = {
      type: 'event',
      buffered: true,
      durationThreshold: 40,
    };
    observer.observe(options);
  } catch {
    // Older browsers may not support event timing; ignore quietly.
  }
}

let initialized = false;

export function initWebVitalsLogging() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  observePaintMetrics();
  observeNavigationMetrics();
  observeLargestContentfulPaint();
  observeLayoutShift();
  observeInteractionToNextPaint();
}

