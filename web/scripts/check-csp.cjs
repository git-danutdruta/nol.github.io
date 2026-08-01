const fs = require('node:fs');
const path = require('node:path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');

const REQUIRED_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
];

function readIndex() {
  return fs.readFileSync(INDEX_PATH, 'utf8');
}

function extractCspMeta(html) {
  const cspTagRegex = /<meta\s+[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i;
  const tagMatch = html.match(cspTagRegex);
  if (!tagMatch) return null;

  const contentRegex = /content=(['"])([\s\S]*?)\1/i;
  const contentMatch = tagMatch[0].match(contentRegex);
  if (!contentMatch) return null;

  return contentMatch[2];
}

function normalizeDirectives(content) {
  return content
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean);
}

function main() {
  const html = readIndex();
  const cspContent = extractCspMeta(html);

  if (!cspContent) {
    console.error('CSP check failed: missing Content-Security-Policy meta tag in web/index.html');
    process.exit(1);
  }

  const directives = normalizeDirectives(cspContent);
  const missing = REQUIRED_DIRECTIVES.filter((required) => !directives.includes(required));

  if (missing.length > 0) {
    console.error('CSP check failed: missing required directives:');
    for (const directive of missing) {
      console.error(`- ${directive}`);
    }
    process.exit(1);
  }

  console.log('CSP check passed.');
}

main();

