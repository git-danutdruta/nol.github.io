const fs = require('node:fs');
const path = require('node:path');

const DIST_ASSETS_DIR = path.join(__dirname, '..', 'dist', 'assets');

const BUDGETS = {
  maxAnyJsChunkBytes: 700 * 1024,
  maxInitialJsBytes: 320 * 1024,
};

const INITIAL_CHUNK_PREFIXES = ['index-', 'vendor-', 'i18n-', 'state-'];

function formatBytes(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
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

function isInitialChunk(file) {
  return INITIAL_CHUNK_PREFIXES.some((prefix) => file.startsWith(prefix));
}

function runBudgetCheck() {
  assertDistExists();
  const jsAssets = readJsAssets();

  if (jsAssets.length === 0) {
    console.log('No JS chunks found in dist/assets; skipping budget check.');
    return;
  }

  const largestChunk = jsAssets[0];
  const initialChunks = jsAssets.filter((asset) => isInitialChunk(asset.file));
  const initialTotal = initialChunks.reduce((sum, asset) => sum + asset.bytes, 0);

  const violations = [];

  if (largestChunk.bytes > BUDGETS.maxAnyJsChunkBytes) {
    violations.push(
      `Largest JS chunk ${largestChunk.file} is ${formatBytes(largestChunk.bytes)} (limit: ${formatBytes(BUDGETS.maxAnyJsChunkBytes)})`
    );
  }

  if (initialTotal > BUDGETS.maxInitialJsBytes) {
    violations.push(
      `Initial JS payload is ${formatBytes(initialTotal)} (limit: ${formatBytes(BUDGETS.maxInitialJsBytes)})`
    );
  }

  console.log('Bundle budget report:');
  console.log(`- Largest chunk: ${largestChunk.file} (${formatBytes(largestChunk.bytes)})`);
  console.log(
    `- Initial payload: ${formatBytes(initialTotal)} from ${initialChunks
      .map((chunk) => chunk.file)
      .join(', ')}`
  );

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

