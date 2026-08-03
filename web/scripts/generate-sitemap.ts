import { promises as fs } from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://git-danutdruta.github.io';
const BASE_PATH = '/nol.github.io';

function normalizeUrlPath(urlPath: string): string {
  const sanitized = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  return sanitized.replace(/\/$/, '') || '/';
}

function fullUrl(urlPath: string): string {
  const normalized = normalizeUrlPath(urlPath);
  return `${SITE_URL}${BASE_PATH}${normalized === '/' ? '/' : normalized}`;
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function generateSitemap(outputDir: string): Promise<void> {
  const curriculumRoot = path.resolve(__dirname, '..', '..', 'curriculum');
  const subjectsDir = await fs.readdir(curriculumRoot, { withFileTypes: true });

  const routes = new Set<string>(['/', '/subjects', '/progress', '/settings']);

  for (const subjectEntry of subjectsDir) {
    if (!subjectEntry.isDirectory()) continue;

    const subjectPath = path.join(curriculumRoot, subjectEntry.name, 'subject.json');
    try {
      const subject = await readJson<{ id: string; chapters: Array<string | { id: string; lessons: any[] }> }>(
        subjectPath
      );
      routes.add(`/subjects/${subject.id}`);

      for (const chapterRef of subject.chapters ?? []) {
        if (typeof chapterRef !== 'string') continue;

        const chapterPath = path.join(curriculumRoot, subjectEntry.name, chapterRef);
        const chapter = await readJson<{ id: string; lessons: Array<{ id: string }> }>(chapterPath);

        routes.add(`/chapters/${chapter.id}`);
        for (const lesson of chapter.lessons ?? []) {
          routes.add(`/lessons/${lesson.id}`);
        }
      }
    } catch {
      // Skip malformed or intentionally incomplete subjects.
    }
  }

  const urls = Array.from(routes)
    .sort((a, b) => a.localeCompare(b))
    .map(
      (route) =>
        `  <url>\n    <loc>${fullUrl(route)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${
          route === '/' ? '1.0' : '0.7'
        }</priority>\n  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'sitemap.xml'), sitemap, 'utf8');
}

