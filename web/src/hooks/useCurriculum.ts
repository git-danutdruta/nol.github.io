import { useEffect, useState } from 'react';

export interface Lesson {
  id: string;
  title: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

interface CurriculumData {
  subjects: Subject[];
}

export function useCurriculum() {
  const [data, setData] = useState<CurriculumData>({ subjects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch('/curriculum/index.json');
        if (!response.ok) throw new Error(`Failed to load curriculum: ${response.status}`);
        const json = (await response.json()) as CurriculumData;
        if (!cancelled) {
          setData(json);
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

  const chapters = data.subjects.flatMap((subject) => subject.chapters);
  const lessons = chapters.flatMap((chapter) => chapter.lessons);

  return { subjects: data.subjects, chapters, lessons, loading, error };
}
