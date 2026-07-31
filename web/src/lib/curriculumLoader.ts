import type { Subject, Chapter, Lesson } from '@/types/curriculum';

const CURRICULUM_BASE = `${import.meta.env.BASE_URL}curriculum`;

export interface LoadedCurriculum {
  subjects: Subject[];
  chapters: Chapter[];
  lessons: Lesson[];
}

export async function loadCurriculum(): Promise<LoadedCurriculum> {
  const indexResponse = await fetch(`${CURRICULUM_BASE}/index.json`);
  if (!indexResponse.ok) {
    throw new Error(`Failed to load curriculum index: ${indexResponse.status}`);
  }
  const index = (await indexResponse.json()) as {
    subjects: { id: string; title: string; description: string }[];
  };

  const subjects: Subject[] = [];
  const chapters: Chapter[] = [];
  const lessons: Lesson[] = [];

  for (const subjectMeta of index.subjects) {
    const subjectResponse = await fetch(`${CURRICULUM_BASE}/${subjectMeta.id}/subject.json`);
    if (!subjectResponse.ok) {
      throw new Error(`Failed to load subject ${subjectMeta.id}: ${subjectResponse.status}`);
    }
    const subjectData = (await subjectResponse.json()) as Subject;

    const loadedChapters: Chapter[] = [];
    for (const chapterRef of subjectData.chapters) {
      const chapterPath = typeof chapterRef === 'string' ? chapterRef : '';
      const chapterResponse = await fetch(
        `${CURRICULUM_BASE}/${subjectMeta.id}/${chapterPath.replace(/^\/+/, '')}`
      );
      if (!chapterResponse.ok) {
        throw new Error(`Failed to load chapter ${chapterPath}: ${chapterResponse.status}`);
      }
      const chapter = (await chapterResponse.json()) as Chapter;
      loadedChapters.push(chapter);
      chapters.push(chapter);
      lessons.push(...chapter.lessons);
    }

    subjects.push({ ...subjectData, chapters: loadedChapters });
  }

  return { subjects, chapters, lessons };
}
