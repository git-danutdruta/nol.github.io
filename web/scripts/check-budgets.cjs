const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const DIST_ASSETS_DIR = path.join(__dirname, '..', 'dist', 'assets');
const BUDGET_CONFIG_PATH = path.join(__dirname, '..', 'performance-budget.json');

const DEFAULT_BUDGETS = {
  maxAnyJsChunkBytes: 700 * 1024,
  maxInitialJsBytes: 320 * 1024,
  maxInitialJsGzipBytes: 200 * 1024,
  initialChunkPrefixes: ['index-', 'vendor-', 'i18n-', 'state-'],
};

function loadBudgets() {
  if (!fs.existsSync(BUDGET_CONFIG_PATH)) {
    return DEFAULT_BUDGETS;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(BUDGET_CONFIG_PATH, 'utf8'));
    return {
      ...DEFAULT_BUDGETS,
      ...parsed,
      initialChunkPrefixes: Array.isArray(parsed.initialChunkPrefixes)
        ? parsed.initialChunkPrefixes
        : DEFAULT_BUDGETS.initialChunkPrefixes,
    };
  } catch (error) {
    throw new Error(`Invalid budget config at ${BUDGET_CONFIG_PATH}: ${error.message}`);
  }
}

function formatBytes(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

function gzipSizeForFile(file) {
  const fullPath = path.join(DIST_ASSETS_DIR, file);
  const content = fs.readFileSync(fullPath);
  return zlib.gzipSync(content).length;
}

function assertDistExists() {
  if (!fs.existsSync(DIST_ASSETS_DIR)) {
    throw new Error(`Missing build output: ${DIST_ASSETS_DIR}. Run \`pnpm build\` first.`);
  }
}

function readJsAssets() {
  const files = fs.readdirSync(DIST_ASSETS_DIR);
  return files
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
      const fullPath = path.join(DIST_ASSETS_DIR, file);
      const bytes = fs.statSync(fullPath).size;
      return { file, bytes };
    })
    .sort((a, b) => b.bytes - a.bytes);
}

function isInitialChunk(file, prefixes) {
  return prefixes.some((prefix) => file.startsWith(prefix));
}

function runBudgetCheck() {
  const budgets = loadBudgets();
  assertDistExists();
  const jsAssets = readJsAssets();

  if (jsAssets.length === 0) {
    console.log('No JS chunks found in dist/assets; skipping budget check.');
    return;
  }

  const largestChunk = jsAssets[0];
  const initialChunks = jsAssets.filter((asset) =>
    isInitialChunk(asset.file, budgets.initialChunkPrefixes)
  );
  const initialTotal = initialChunks.reduce((sum, asset) => sum + asset.bytes, 0);
  const initialGzipTotal = initialChunks.reduce(
    (sum, asset) => sum + gzipSizeForFile(asset.file),
    0
  );

  const violations = [];

  if (largestChunk.bytes > budgets.maxAnyJsChunkBytes) {
    violations.push(
      `Largest JS chunk ${largestChunk.file} is ${formatBytes(largestChunk.bytes)} (limit: ${formatBytes(budgets.maxAnyJsChunkBytes)})`
    );
  }

  if (initialTotal > budgets.maxInitialJsBytes) {
    violations.push(
      `Initial JS payload is ${formatBytes(initialTotal)} (limit: ${formatBytes(budgets.maxInitialJsBytes)})`
    );
  }

  if (initialGzipTotal > budgets.maxInitialJsGzipBytes) {
    violations.push(
      `Initial JS gzip payload is ${formatBytes(initialGzipTotal)} (limit: ${formatBytes(budgets.maxInitialJsGzipBytes)})`
    );
  }

  console.log('Bundle budget report:');
  console.log(`- Largest chunk: ${largestChunk.file} (${formatBytes(largestChunk.bytes)})`);
  console.log(
    `- Initial payload: ${formatBytes(initialTotal)} from ${initialChunks
      .map((chunk) => chunk.file)
      .join(', ')}`
  );
  console.log(`- Initial payload (gzip): ${formatBytes(initialGzipTotal)}`);

  if (violations.length > 0) {
    console.error('\nBudget check failed:');
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log('Budget check passed.');
}

runBudgetCheck();
