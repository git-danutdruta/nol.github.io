import { useEffect, useState } from 'react';
import { loadCurriculum } from '@/lib/curriculumLoader';
import type { Subject, Chapter, Lesson } from '@/types/curriculum';

export interface LessonRef {
  id: string;
  title: string;
}

export interface ChapterRef {
  id: string;
  title: string;
  lessons: LessonRef[];
}

export interface SubjectRef {
  id: string;
  title: string;
  description: string;
  chapters: ChapterRef[];
}

export function useCurriculum() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await loadCurriculum();
        if (!cancelled) {
          setSubjects(data.subjects);
          setChapters(data.chapters);
          setLessons(data.lessons);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { subjects, chapters, lessons, loading, error };
}
